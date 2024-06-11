function checkLogin() {
	return new Promise((resolve, reject) => {
		fetch("/api_check_login")
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				resolve(data.success); // Resolve with the success value
			})
			.catch((error) => {
				console.error("Error checking login status:", error);
				reject(false);
			});
	});
}

function logout() {
	fetch("/api_logout")
		.then((response) => response.json())
		.then((data) => {
			console.log("Successfully logged out:", data);
			window.location.href = "/login";
		})
		.catch((error) => {
			console.error("Error logging out:", error);
		});
}

function gotoResume() {
	window.location.href = "/resume";
}

function gotoFavorite() {
	window.location.href = "/favorite";
}

function backtoHome() {
	window.location.href = "/home";
}

function gotoManage_job() {
	window.location.href = "/manage";
}

function gotoManage_user() {
	window.location.href = "/manage_user";
}


// Function to filter job data based on search input
function filter_jobs() {
	const searchInput = document.getElementById("search-input");
	const categoryFilter = document.getElementById("category-filter");
	const salaryFilter = document.getElementById("salary-filter");
	const query = searchInput.value.trim();
	const selectedCategory = categoryFilter.value.toLowerCase();
	const selectedSalary = salaryFilter.value.toLowerCase();
	let filteredData;

	if (query.includes(":")) {
		let [key, value] = query.split(":").map((part) => part.trim());
        if(key === "Hours"){
            key = "Working_Hours";
        }
        else if(key === "Address"){
            key = "Job_Address";
        }
		filteredData = jobData.filter((job) => {
            if (typeof job[key] !== 'string') {
				job[key] = job[key].toString();
			}
            return job[key].includes(value);
		});
	} else {
		filteredData = jobData.filter((job) =>
			(job["Job_title"] || "").includes(query.toLowerCase())
		);
	}

	if (selectedCategory) {
		filteredData = filteredData.filter(
			(job) => (job["Category"] || "").toLowerCase() === selectedCategory
		);
	}

	if (selectedSalary) {
		const [minSalary, maxSalary] = selectedSalary.split("-").map(Number);
		filteredData = filteredData.filter((job) => {
			const salary = Number(job["Salary"]);
			return salary >= minSalary && (salary <= maxSalary || !maxSalary);
		});
	}
	update_table(filteredData);
}