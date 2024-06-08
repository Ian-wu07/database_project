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

	loadingIndicator.classList.add("show");
	// Initial fetch to populate table on page load
	await fetch("/api_get_favorite")
		.then((response) => response.json())
		.then((data) => {
			last_favoriteJobs = new Set(data.map((job) => job.Job_ID));
			favoriteJobs = new Set(data.map((job) => job.Job_ID));
		})
		.catch((error) => {
			console.error("Error fetching favorites:", error);
		});
	fetchJobs();

	refreshButton.addEventListener("click", function () {
        loadingIndicator.classList.add("show");
        fetchJobs();
        submit_favorites();
    });
	searchButton.addEventListener("click", filterJobs);
    categoryFilter.addEventListener("change", filterJobs);
    salaryFilter.addEventListener("change", filterJobs);
});

// 抓取職缺資料
function fetchJobs() {
	const loadingIndicator = document.getElementById("loading-indicator");
	const messageDiv = document.getElementById("error-message");

	fetch("/api_get_jobs")
		.then((response) => response.json())
		.then((data) => {
			jobData = data; // Store fetched data
			updateTable(jobData);
			setTimeout(() => {
				loadingIndicator.classList.remove("show"); // Hide loading indicator with fade-out effect
			}, 500); // Adjust timing if needed
            // console.log(jobData);
		})
		.catch((error) => {
			console.error("Error fetching jobs:", error);
			messageDiv.textContent = "Error fetching jobs. Please try again later.";
			messageDiv.style.display = "block";
			setTimeout(() => {
				loadingIndicator.classList.remove("show"); // Hide loading indicator with fade-out effect even on error
			}, 500); // Adjust timing if needed
		});
    
}

// Function to update table with job data
function updateTable(data) {
	const jobTableBody = document.getElementById("job-table-body");
	jobTableBody.innerHTML = ""; // Clear existing table data

	data.forEach((job) => {
		const row = document.createElement("tr");
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
			toggleFavorite(job, favoriteStar);
		};
		favoriteCell.appendChild(favoriteStar);
		row.appendChild(favoriteCell);

		jobTableBody.appendChild(row);
	});
}

// Function to toggle favorite jobs
function toggleFavorite(job, element) {
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
    console.log(favoriteJobs);
}

function submit_favorites() {
	//比較set的資料，last出現但是現在消失的代表要刪除，現在出現但是last沒有的代表要新增
	const newFavoriteIds = Array.from(favoriteJobs).filter((id) => !last_favoriteJobs.has(id));
	const removedFavoriteIds = Array.from(last_favoriteJobs).filter((id) => !favoriteJobs.has(id));
	//創建JSON格式的資料
	const favoriteData = { insert: newFavoriteIds, delete: removedFavoriteIds };
	if (favoriteData.delete.length === 0 && favoriteData.insert.length === 0) {
		return;
	}

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
			last_favoriteJobs = new Set(favoriteJobs);
		})
		.catch((error) => {
			console.error("Error saving favorite jobs:", error);
		});
}

// Function to filter job data based on search input
function filterJobs() {
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const salaryFilter = document.getElementById("salary-filter");
	const query = searchInput.value.trim();
    const selectedCategory = categoryFilter.value.toLowerCase();
    const selectedSalary = salaryFilter.value.toLowerCase();
	let filteredData;

	if (query.includes(":")) {
		const [key, value] = query.split(":").map((part) => part.trim());
		filteredData = jobData.filter((job) => (job[key] || "").toLowerCase().includes(value));
	} else {
		filteredData = jobData.filter((job) =>
			(job["Job_title"] || "").toLowerCase().includes(query)
		);
	}

    if (selectedCategory) {
        filteredData = filteredData.filter(job => (job["Category"] || "").toLowerCase() === selectedCategory);
    }

    if (selectedSalary) {
        const [minSalary, maxSalary] = selectedSalary.split("-").map(Number);
        filteredData = filteredData.filter(job => {
            const salary = Number(job["Salary"]);
            return salary >= minSalary && salary <= maxSalary;
        });
    }
	updateTable(filteredData);
}
