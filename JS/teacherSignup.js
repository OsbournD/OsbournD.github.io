    function generateClassCode() {
        return Math.random().toString(36).substring(2, 12).toUpperCase();
    }

    function teacherSignup() {
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const classCode = generateClassCode();
		const data = {
                username: username,
                password: password,	
                classCode: classCode
            };
		console.log(data);
        fetch('../PHP/teacherSignup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('generatedCode').textContent = classCode;
                document.getElementById('classCodeDisplay').style.display = 'block';
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during signup.');
        });
    }

    function teacherLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('../PHP/teacherLogin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                sessionStorage.setItem('teacherId', data.teacherId);
                window.location.href = '../HTML/teacherDashboard.html';
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login.');
        });
    }

function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    
    fetch('../PHP/verifyTeacher.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: responsePayload.email,
            name: responsePayload.name
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            window.location.href = '../HTML/teacherDashboard.html';
        }
    });
}

function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}