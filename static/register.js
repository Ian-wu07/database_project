// 處理註冊表單的提交
document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("register-form").addEventListener("submit", function (event) {
		event.preventDefault();
		const name = document.getElementById("name").value;
		const email = document.getElementById("email").value;
		const password = document.getElementById("password");
		const password_confirm = document.getElementById("password_confirm");
		const errorMessage = document.getElementById("error-message");

		password.addEventListener("paste", function (event) {
			event.preventDefault();
		});
		password_confirm.addEventListener("paste", function (event) {
			event.preventDefault();
		});

		errorMessage.textContent = "";
		password.style.border = "";
		password_confirm.style.border = "";
		if (password.value !== password_confirm.value) {
			errorMessage.textContent = "密碼不一致";
			password.style.border = "3px solid red";
			password_confirm.style.border = "3px solid red";
			return;
		}
		fetch("/api_register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				email: email,
				password: password.value,
			}),
		})
			.then((response) => {
				if (response.ok) {
					// 登录成功，跳转到其他页面
					errorMessage.textContent = "";
					response.json().then((data) => {
						alert("註冊成功，請重新登入");
					});
					window.location.href = "/login";
				} else {
					// 登录失败，显示错误消息
					response.json().then((data) => {
						errorMessage.textContent = data.error;
						alert(data.error);
					});
				}
			})
			.catch((error) => {
				console.error("Error registering user: ", error);
				alert("Error registering user: " + error.message);
			});
	});
});
