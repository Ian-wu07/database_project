const displayOrder = [
	"Job_ID",
	"Job_title",
	"Salary",
	"Content",
	"Address",
	"Payment",
	"Paydate",
	"Quantity",
	"Contact",
	"Phone",
	"Category",
	"Hours",
];

document.addEventListener("DOMContentLoaded", function () {
	const refreshButton = document.getElementById("refresh-button");
	const jobTableBody = document.getElementById("job-table-body");

	// Function to fetch job data and update the table
	function fetchJobs() {
		fetch("/api_get_jobs")
			.then((response) => response.json())
			.then((data) => {
				// Clear existing table data
				jobTableBody.innerHTML = "";

				// Populate table with new data
                data.forEach(job => {
                    const row = document.createElement('tr');
                    // 按照指定順序顯示屬性值
                    displayOrder.forEach(key => {
                        const cell = document.createElement('td');
                        cell.textContent = job[key] || '';
                        row.appendChild(cell);
                    });
                    jobTableBody.appendChild(row);
                });
			})
			.catch((error) => {
				console.error("Error fetching jobs:", error);
			});
	}

	// Initial fetch to populate table on page load
	fetchJobs();

	// Set up event listener for the refresh button
	refreshButton.addEventListener("click", fetchJobs);
});

function logout() {
	window.location.href = "/login";
}
