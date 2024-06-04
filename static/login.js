document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        fetch('/api_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (response.ok) {
                // 登录成功，跳转到其他页面
                window.location.href = '/home';
            } else {
                // 登录失败，显示错误消息
                response.json().then(data => {
                    errorMessage.textContent = data.error;
                });
            }
        })
        .catch(error => {
            console.error('Login failed:', error);
            errorMessage.textContent = 'An unexpected error occurred. Please try again later.';
        });
    });
});