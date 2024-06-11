const displayOrder = [
	"User_Name",
	"Email",
	"Sex",
	"Education",
	"Phone",
	"Identify_ID",
	"Birth",
	"Experience_1",
	"Experience_2",
	"Experience_3",
	"Introduction",
];
let resumeData = {};
document.addEventListener("DOMContentLoaded", async () => {
	const errorMessage = document.getElementById("error-message");
	const loadingIndicator = document.getElementById("loading-indicator");
	const form = document.getElementById("resume-form");

	let log_In = await checkLogin();
	if (!log_In) {
		errorMessage.style.display = "block";
		form.style.display = "none";
		return;
	}

	await fetch_resume();

	form.addEventListener("submit", function (event) {
		event.preventDefault();

		let isValid = true;
		displayOrder.forEach((item) => {
			const element = document.getElementById(item.toLocaleLowerCase());
			const value = element.value;
			resumeData[item] = value;
		});

		if (!isValid) {
			errorMessage.style.display = "block";
			errorMessage.textContent = "Please fill in all required fields.";
			errorMessage.style.color = "red";
			return;
		}
		submit_resume();
	});
});

function fetch_resume() {
	const loadingIndicator = document.getElementById("loading-indicator");
	const errorMessage = document.getElementById("error-message");
	loadingIndicator.classList.add("show");
	return new Promise((resolve, reject) => {
		fetch("/api_get_resume")
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					console.error("Error:", data.error);
					errorMessage.style.display = "block";
					errorMessage.textContent = data.error;
					reject(data.error);
				} else {
					resumeData = data[0];
					displayOrder.forEach((item) => {
						document.getElementById(item.toLocaleLowerCase()).value = resumeData[item];
					});
					resolve(data[0]);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				reject(error);
			})
			.finally(() => {
				setTimeout(() => {
					loadingIndicator.classList.remove("show"); // Hide loading indicator with fade-out effect even on error
				}, 500);
			});
	});
}

function submit_resume() {
	const loadingIndicator = document.getElementById("loading-indicator");
	const errorMessage = document.getElementById("error-message");

	loadingIndicator.classList.add("show");
	return new Promise((resolve, reject) => {
		fetch("/api_submit_resume", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(resumeData),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message) {
					errorMessage.style.display = "block";
					errorMessage.textContent = "Resume submitted successfully";
					errorMessage.style.color = "green";
					alert("Resume submitted successfully");
					resolve();
				} else if (data.error) {
					errorMessage.style.display = "block";
					errorMessage.textContent = data.error;
					errorMessage.style.color = "red";
					alert("Error: " + data.error);
					reject();
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				reject();
			})
			.finally(() => {
				setTimeout(() => {
					loadingIndicator.classList.remove("show"); // Hide loading indicator with fade-out effect even on error
				}, 500);
			});
	});
}
