document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("login-form").addEventListener("submit", function (event) {
		event.preventDefault();

		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;
		const errorMessage = document.getElementById("error-message");

		fetch("/api_login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		})
			.then((response) => {
				console.log(response);
				if (!response.ok) {
					errorMessage.textContent = "帳號或密碼輸入錯誤";
					return Promise.resolve(0);
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				if (data.redirect_to) {
					window.location.href = data.redirect_to;
				} else {
					console.error("No redirect URL found in the response:", data);
				}
			})
			.catch((error) => {
				console.error("Login failed:", error);
				errorMessage.textContent = "An unexpected error occurred. Please try again later.";
			});
	});
});
