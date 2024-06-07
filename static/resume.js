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
    "Introduction"
];
let resumeData = {};
document.addEventListener("DOMContentLoaded", async () => {
	const messageDiv = document.getElementById("error-message");
	const form = document.getElementById("resume-form");

	let log_In = await checkLogin();
	if (!log_In) {
		messageDiv.style.display = "block";
		form.style.display = "none";
		return;
	}

	fetch("/api_get_resume")
		.then((response) => response.json())
		.then((data) => {
			if (data.error) {
				console.error("Error:", data.error);
			} else {
                resumeData=data[0]
				displayOrder.forEach((item) => {            
					document.getElementById(item.toLocaleLowerCase()).value = resumeData[item];
				})
			}
		})
		.catch((error) => console.error("Error:", error));

	form.addEventListener("submit", function (event) {
		event.preventDefault(); // 防止表單提交時重整頁面
		displayOrder.forEach((item) => {
            const element = document.getElementById(item.toLocaleLowerCase());
            const value = element.value;
            resumeData[item] = value;
		})
        console.log(resumeData,'1')
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
					alert("Resume submitted successfully");
				} else if (data.error) {
					alert("Error: " + data.error);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
});