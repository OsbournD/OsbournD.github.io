       document.addEventListener('DOMContentLoaded', function() {
            const teacherId = sessionStorage.getItem('teacherId');
            if (!teacherId) {
                window.location.href = '../HTML/login.html';
                return;
            }

            fetchTeacherData();
        });

        function fetchTeacherData() {
			const data = {
                    teacherId: sessionStorage.getItem('teacherId')
                };
            fetch('../PHPgetTeacherDashboard.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			})
			.then(response => {
				// Log the raw response for debugging
				return response.text().then(text => {
					console.log('Response Text:', text);  // Log raw response
					try {
						return JSON.parse(text);  // Try parsing the text manually
					} catch (e) {
						throw new Error('Invalid JSON: ' + e.message);
					}
				});
			})
			.then(data => {
				if (data.status === 'success') {
					updateDashboard(data);
				} else {
					alert('Error loading dashboard data');
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
        }

        function updateDashboard(data) {
            document.getElementById('classCode').textContent = data.classCode;
            document.getElementById('totalStudents').textContent = data.totalStudents;
            document.getElementById('avgScore').textContent = data.averageScore;

            const studentTable = document.getElementById('studentTable');
            studentTable.innerHTML = '';

            data.students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.username}</td>
                    <td>${student.highScore}</td>
                    <td>${student.levelsCompleted}</td>
                    <td>${student.lastActive}</td>
                `;
                studentTable.appendChild(row);
            });
        }