let towersToPlace = 0;
let selectedTowerType = null;

const towerPlaceSound = new Audio("../SoundEffects/683587__yehawsnail__bubble-pop.wav");
const towerFreezeSound = new Audio("../SoundEffects/452645__kyles__ice-grinding-cracking-freezing-designed.mp3");
const towerLightningSound = new Audio("../SoundEffects/512471__michael_grinnell__electric-zap.wav");

class Tower {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
		towerPlaceSound.currentTime = 0;
        towerPlaceSound.play();
        
        if (type === 'basic') {
            this.range = 100;
            this.fireRate = 1000;
            this.damage = 1;
            this.image = basicTower;
        } else if (type === 'freeze') {
            this.range = 80;
            this.fireRate = 5000;
            this.damage = 0;
            this.image = freezeTower;
            this.chargeTime = 500; // 0.5 seconds charge
            this.freezeDuration = 2000; // 2 seconds full freeze
            this.chargingEnemy = null; // Track single charging enemy
            this.chargeStartTime = 0;
            this.frozenEnemy = null; // Track single frozen enemy
            this.freezeEndTime = 0;
        } else if (type === 'lightning') {
            this.range = 120;
            this.fireRate = 3000;
            this.damage = 2;
            this.chainRange = 119; // How far the lightning can chain to secondary targets
            this.chainCount = 3; // Maximum number of chain targets
            this.image = lightningTower;
            this.chainTargets = []; // Keep track of chain targets for drawing
            this.chainTime = 0; // Time tracking for drawing the chains
            this.chainDuration = 500; // How long to show the chain lightning
        }
        
        this.lastShot = Date.now();
    }

    update(enemies, projectiles) {
        const now = Date.now();
        
        if (this.type === 'basic') {
            if (now - this.lastShot > this.fireRate) {
                for (let enemy of enemies) {
                    const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                    if (dist < this.range) {
                        projectiles.push(new Projectile(this.x, this.y, enemy));
                        this.lastShot = now;
                        break;
                    }
                }
            }
        } else if (this.type === 'freeze') {
            // Check if current frozen enemy should be unfrozen
            if (this.frozenEnemy && now >= this.freezeEndTime) {
                this.frozenEnemy.frozen = false;
                this.frozenEnemy.speed = this.frozenEnemy.baseSpeed;
                this.frozenEnemy.tint = null;
                this.frozenEnemy = null;
            }

            if (this.chargingEnemy) {
                const dist = Math.hypot(this.chargingEnemy.x - this.x, this.chargingEnemy.y - this.y);
                if (dist > this.range || this.chargingEnemy.offScreen) {
                    // Reset enemy if they leave range
                    this.chargingEnemy.speed = this.chargingEnemy.baseSpeed;
                    this.chargingEnemy.tint = null;
					this.chargingEnemy.freezing = false;
                    this.chargingEnemy = null;
                } else {
                    const chargeProgress = (now - this.chargeStartTime) / this.chargeTime;
                    // Gradually slow from 100% to 20% speed during charge
                    this.chargingEnemy.speed = this.chargingEnemy.baseSpeed * (1 - (chargeProgress * 0.8));
                    this.chargingEnemy.tint = '#00ffff';

                    if (now - this.chargeStartTime >= this.chargeTime) {
                        this.chargingEnemy.frozen = true;
						this.chargingEnemy.freezing = false;
                        this.chargingEnemy.speed = 0;
                        this.frozenEnemy = this.chargingEnemy;
                        this.freezeEndTime = now + this.freezeDuration;
                        this.frozenEnemy.tint = '#0000ff';
						this.chargingEnemy.health -= 1;
						checkBotHealth(this.chargingEnemy)
                        this.chargingEnemy = null;
                        this.lastShot = now;
                    }
                }
            }
            if (!this.chargingEnemy && !this.frozenEnemy && now - this.lastShot > this.fireRate) {
                for (let enemy of enemies) {
                    const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                    if (dist < this.range && !enemy.frozen && !enemy.freezing) {
                        if (!enemy.baseSpeed) enemy.baseSpeed = enemy.speed;
                        this.chargingEnemy = enemy;
						this.chargingEnemy.freezing = true;
                        this.chargeStartTime = now;
						towerFreezeSound.currentTime = 0;
						towerFreezeSound.play();
                        break;
                    }
                }
            }
        }else if (this.type === 'lightning') {
            // Clear old chain targets that persist after the visual effect duration
            if (now - this.chainTime > this.chainDuration) {
                this.chainTargets = [];
            }
            
            if (now - this.lastShot > this.fireRate && enemies.length > 0) {
                // Find primary target within range
                let primaryTarget = null;
                for (let enemy of enemies) {
                    const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
                    if (dist < this.range) {
                        primaryTarget = enemy;
                        break;
                    }
                }
                
                if (primaryTarget) {
                    // Damage the primary target
                    primaryTarget.health -= this.damage;
                    checkBotHealth(primaryTarget);
                    this.lastShot = now;
                    this.chainTime = now;
                    towerLightningSound.currentTime = 0;
                    towerLightningSound.play();
                    
                    // Find secondary targets to chain to
                    this.chainTargets = [primaryTarget];
                    let availableEnemies = enemies.filter(e => e !== primaryTarget && !e.offScreen);
                    
                    // Chain from the primary target to up to chainCount secondary targets
                    let lastTarget = primaryTarget;
                    for (let i = 0; i < this.chainCount; i++) {
                        // Find the closest enemy to the last target within chainRange
                        let nextTarget = null;
                        let shortestDistance = this.chainRange;
                        
                        for (let enemy of availableEnemies) {
                            const dist = Math.hypot(enemy.x - lastTarget.x, enemy.y - lastTarget.y);
                            if (dist < shortestDistance) {
                                shortestDistance = dist;
                                nextTarget = enemy;
                            }
                        }
                        
                        if (nextTarget) {
                            // Damage this enemy and add to chain
                            nextTarget.health -= this.damage;
                            checkBotHealth(nextTarget);
                            this.chainTargets.push(nextTarget);
                            
                            // Remove from available enemies and set as last target
                            availableEnemies = availableEnemies.filter(e => e !== nextTarget);
                            lastTarget = nextTarget;
                        } else {
                            break; // No more targets in range
                        }
                    }
                }
            }
        }
    }

    draw() {
        this.drawRange();
        ctx.drawImage(this.image, this.x - 40, this.y - 60, 80, 80);
        
        // Draw effects for freezing tower
        if (this.type === 'freeze') {
            const now = Date.now();
            
            // Draw charging effect
            if (this.chargingEnemy) {
                const progress = (now - this.chargeStartTime) / this.chargeTime;
                
                // Draw line from tower to enemy
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.chargingEnemy.x, this.chargingEnemy.y);
                ctx.strokeStyle = `rgba(0, 255, 255, ${progress})`;
                ctx.lineWidth = 10;
                ctx.stroke();
            }

            if (this.frozenEnemy) {
				if(!this.frozenEnemy.offScreen){
					ctx.beginPath();
					ctx.arc(this.frozenEnemy.x, this.frozenEnemy.y, 25, 0, Math.PI * 2);
					ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
					ctx.lineWidth = 2;
					ctx.stroke();
				}
            }
        }else if (this.type === 'lightning') {
            const now = Date.now();
            if (now - this.chainTime < this.chainDuration && this.chainTargets.length > 0) {
                // Calculate lightning opacity based on time elapsed
                const opacity = 1 - ((now - this.chainTime) / this.chainDuration);
                
                // Draw chain lightning effect
                for (let i = 0; i < this.chainTargets.length - 1; i++) {
                    if (!this.chainTargets[i].offScreen && !this.chainTargets[i+1].offScreen) {
                        // Draw jagged lightning line between targets
                        this.drawLightning(
                            this.chainTargets[i].x, 
                            this.chainTargets[i].y,
                            this.chainTargets[i+1].x, 
                            this.chainTargets[i+1].y,
                            opacity
                        );
                    }
                }
                    this.drawLightning(
                        this.x, 
                        this.y,
                        this.chainTargets[0].x, 
                        this.chainTargets[0].y,
                        opacity
                    );
            }
        }
    }

	drawLightning(x1, y1, x2, y2, opacity) {
        const segments = 8;
        const segmentLength = Math.hypot(x2 - x1, y2 - y1) / segments;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        
        let currentX = x1;
        let currentY = y1;
        
        for (let i = 0; i < segments - 1; i++) {
            // Calculate next point with some randomness
            const nextX = x1 + (i + 1) * (x2 - x1) / segments + (Math.random() - 0.5) * 15;
            const nextY = y1 + (i + 1) * (y2 - y1) / segments + (Math.random() - 0.5) * 15;
            
            ctx.lineTo(nextX, nextY);
            currentX = nextX;
            currentY = nextY;
        }
        
        ctx.lineTo(x2, y2);
        
        // Create lightning glow effect
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `rgba(100, 149, 237, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(135, 206, 250, ${opacity})`);
        gradient.addColorStop(1, `rgba(100, 149, 237, ${opacity})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 20;
        ctx.stroke();
        
        // Add bright center to lightning
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        currentX = x1;
        currentY = y1;
        
        for (let i = 0; i < segments - 1; i++) {
            const nextX = x1 + (i + 1) * (x2 - x1) / segments + (Math.random() - 0.5) * 15;
            const nextY = y1 + (i + 1) * (y2 - y1) / segments + (Math.random() - 0.5) * 15;
            
            ctx.lineTo(nextX, nextY);
            currentX = nextX;
            currentY = nextY;
        }
        
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

	drawRange() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        
        if (this.type === 'freeze') {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        } else if (this.type === 'lightning') {
            ctx.strokeStyle = 'rgba(100, 149, 237, 0.5)';
        } else {
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        }
        
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw chain range indicator for lightning tower
        if (this.type === 'lightning') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.chainRange, 0, Math.PI * 2);
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(100, 149, 237, 0.3)';
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

// Keep the original canvasClicked function
function canvasClicked(x, y) {
    if (selectedTowerType && isNearPath(x, y)) {
        const selectedSlot = document.querySelector(`.tower-slot[data-tower-type="${selectedTowerType}"]`);
        const towerCost = parseInt(selectedSlot.dataset.towerCost);
        console.log(towerCost);
        if (towersToPlace >= towerCost) {
            game.towers.push(new Tower(x, y, selectedTowerType));
            towersToPlace -= towerCost;
            document.getElementById('towerPoints').innerHTML = 'Tower Points: ' + towersToPlace;
        }
    }
}

function isNearPath(x, y) {
    for (let i = 0; i < waypoints.length - 1; i++) {
        const start = waypoints[i];
        const end = waypoints[i + 1];
        const nearDistance = 20;
        const distance = pointToSegmentDistance(x, y, start, end);
        if (distance < nearDistance) {
            return false;
        }
    }
    return true;
}

function pointToSegmentDistance(px, py, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    let t = ((px - start.x) * dx + (py - start.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
    const nearestX = start.x + t * dx;
    const nearestY = start.y + t * dy;
    return Math.hypot(px - nearestX, py - nearestY);
}

// Initialize tower hotbar
function initTowerHotbar() {
    const towerSlots = document.querySelectorAll('.tower-slot');
	const basicTowerSlot = document.querySelector('.tower-slot[data-tower-type="basic"]');
    basicTowerSlot.style.border = '2px solid #00ff00';
    selectedTowerType = "basic";
    towerSlots.forEach(slot => {
        slot.addEventListener('click', function(e) {
            e.preventDefault();
            if (towersToPlace >= slot.dataset.towerCost) {
                if (selectedTowerType === slot.dataset.towerType) {
                    // Deselect if clicking the same tower
                    selectedTowerType = null;
                    slot.style.border = '2px solid #165c1a';
                } else {
                    // Select new tower
                    selectedTowerType = slot.dataset.towerType;
                    // Update visual selection
                    document.querySelectorAll('.tower-slot').forEach(s => 
                        s.style.border = '2px solid #165c1a'
                    );
                    slot.style.border = '2px solid #00ff00';
                }
            }
        });
    });
}

window.addEventListener('load', initTowerHotbar);