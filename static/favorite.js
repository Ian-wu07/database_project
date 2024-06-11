const displayOrder = [
	"Job_title",
	"Salary",
	"Content",
	"Job_Address",
	"Payment",
	"Paydate",
	"Quantity",
	"Contact",
	"Phone",
	"Category",
	"Working_Hours",
];

let jobData = [];
let last_favoriteJobs = new Set();
let favoriteJobs = new Set();

document.addEventListener("DOMContentLoaded", async function () {
	const messageDiv = document.getElementById("error-message");
	const refreshButton = document.getElementById("refresh-button");
	const searchButton = document.getElementById("search-button");
	const categoryFilter = document.getElementById("category-filter");
	const salaryFilter = document.getElementById("salary-filter");
	const loadingIndicator = document.getElementById("loading-indicator");

	let login_status = await checkLogin();
	if (!login_status) {
		messageDiv.style.display = "block";
		return;
	}
	fetch_favorites();

	refreshButton.addEventListener("click", async function () {
        await submit_favorites();
		await fetch_favorites();
	});
	searchButton.addEventListener("click", filter_jobs);
	categoryFilter.addEventListener("change", filter_jobs);
	salaryFilter.addEventListener("change", filter_jobs);
});

// 抓取職缺資料
function fetch_favorites() {
	const loadingIndicator = document.getElementById("loading-indicator");
	const messageDiv = document.getElementById("error-message");

	loadingIndicator.classList.add("show");

    return new Promise((resolve, reject) => {
        fetch("/api_get_favorite")
            .then((response) => response.json())
            .then((data) => {
                jobData = data; // Store fetched data
                last_favoriteJobs = new Set(data.map((job) => job.Job_ID));
                favoriteJobs = new Set(data.map((job) => job.Job_ID));
                update_table(jobData);
                resolve();
            })
            .catch((error) => {
                console.error("Error fetching jobs:", error);
                messageDiv.textContent = "Error fetching jobs. Please try again later.";
                messageDiv.style.display = "block";
                reject(error);
               
            })
            .finally(() => {
                setTimeout(() => {
                    loadingIndicator.classList.remove("show"); // Hide loading indicator with fade-out effect even on error
                }, 500); // Adjust timing if needed
            });
    });
}

// Function to update table with job data
function update_table(data) {
	const jobTableBody = document.getElementById("job-table-body");
	jobTableBody.innerHTML = ""; // Clear existing table data

	data.forEach((job) => {
		const row = document.createElement("tr");
		row.classList.add(job.Job_State === 0 ? "job-inactive" : "job-active"); // Add class based on Job_State

		displayOrder.forEach((key) => {
			const cell = document.createElement("td");
			cell.textContent = job[key] || "";
			row.appendChild(cell);
		});

		// Add favorite star cell
		const favoriteCell = document.createElement("td");
		const favoriteStar = document.createElement("span");
		favoriteStar.classList.add("favorite-star");
		if (favoriteJobs.has(job.Job_ID)) {
			favoriteStar.textContent = "★";
			favoriteStar.classList.add("favorite");
		} else {
			favoriteStar.textContent = "☆";
		}
		favoriteStar.onclick = function () {
			toggle_favorite(job, favoriteStar);
		};
		favoriteCell.appendChild(favoriteStar);
		row.appendChild(favoriteCell);

		jobTableBody.appendChild(row);
	});
}

// Function to toggle favorite jobs
function toggle_favorite(job, element) {
	if (favoriteJobs.has(job.Job_ID)) {
		// Remove from favorites
		favoriteJobs.delete(job.Job_ID);
		element.textContent = "☆";
		element.classList.remove("favorite");
	} else {
		// Add to favorites
		favoriteJobs.add(job.Job_ID);
		element.textContent = "★";
		element.classList.add("favorite");
	}
	// console.log(favoriteJobs);
}

function submit_favorites() {
	const errorMessage = document.getElementById("error-message");
	errorMessage.style.display = "none";
	//比較set的資料，last出現但是現在消失的代表要刪除，現在出現但是last沒有的代表要新增
	const newFavoriteIds = Array.from(favoriteJobs).filter((id) => !last_favoriteJobs.has(id));
	const removedFavoriteIds = Array.from(last_favoriteJobs).filter((id) => !favoriteJobs.has(id));
	//創建JSON格式的資料
	const favoriteData = { insert: newFavoriteIds, delete: removedFavoriteIds };
	if (favoriteData.delete.length === 0 && favoriteData.insert.length === 0) {
		return;
	}
    return new Promise((resolve, reject) => {
        fetch("/api_save_favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(favoriteData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Favorite jobs saved successfully:", data);
                errorMessage.style.display = "block";
                errorMessage.style.color = "green";
                errorMessage.textContent = "Favorite jobs saved successfully";
                last_favoriteJobs = new Set(favoriteJobs);
                resolve();
            })
            .catch((error) => {
                console.error("Error saving favorite jobs:", error);
                reject();
            });
    });
}