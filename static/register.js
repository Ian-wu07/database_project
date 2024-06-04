// 處理註冊表單的提交
document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("register-form").addEventListener("submit", function (event) {
		event.preventDefault();
		const user_id = document.getElementById("user_id").value;
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const phone = document.getElementById("phone").value;
		fetch("/api_register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id: user_id,
				name: name,
				email: email,
				password: password,
				phone: phone,
			}),
		})
            .then(response => {
                if (response.ok) {
                    // 登录成功，跳转到其他页面
                    response.json()
                    window.location.href = '/login';
                } else {
                    // 登录失败，显示错误消息
                    response.json().then(data => {
                        alert(data.error);
                    });
                }
            })
            .catch(error => {
                console.error("Error registering user: ", error);
                alert("Error registering user: " + error.message);
            });
	});
    // 如果成功登錄，跳轉到其他頁面
    
    // 如果失敗，顯示錯誤訊息

});
