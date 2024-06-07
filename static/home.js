const displayOrder = [
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
    "Job_State"
];

document.addEventListener("DOMContentLoaded", async function () {
    const messageDiv = document.getElementById("error-message");
    let loggedIn = await checkLogin();
    if (!loggedIn) {
        messageDiv.style.display = "block";
        return;
    }

    const refreshButton = document.getElementById("refresh-button");
    const jobTableBody = document.getElementById("job-table-body");
    const loadingIndicator = document.getElementById("loading-indicator");
    const searchInput = document.getElementById("search-input");

    let jobData = [];
    let favoriteJobs = new Set();

    // Function to fetch job data and update the table
    function fetchJobs() {
        loadingIndicator.classList.add("show"); // Show loading indicator with fade-in effect

        fetch("/api_get_jobs")
            .then((response) => response.json())
            .then((data) => {
                jobData = data; // Store fetched data
                updateTable(jobData);
                setTimeout(() => {
                    loadingIndicator.classList.remove("show"); // Hide loading indicator with fade-out effect
                }, 500); // Adjust timing if needed
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
        jobTableBody.innerHTML = ""; // Clear existing table data

        data.forEach((job) => {
            const row = document.createElement("tr");
            // 按照指定順序顯示屬性值
            displayOrder.forEach((key) => {
                const cell = document.createElement("td");
                cell.textContent = job[key] || "";
                row.appendChild(cell);
            });

            // Add favorite star cell
            const favoriteCell = document.createElement("td");
            const favoriteStar = document.createElement("span");
            favoriteStar.classList.add("favorite-star");
            favoriteStar.textContent = favoriteJobs.has(job.Job_ID) ? "★" : "☆";
            favoriteStar.onclick = function () {
                toggleFavorite(job, favoriteStar);
            };
            favoriteCell.appendChild(favoriteStar);
            row.appendChild(favoriteCell);

            jobTableBody.appendChild(row);
        });
    }

    // Initial fetch to populate table on page load
    fetchJobs();

    refreshButton.addEventListener("click", fetchJobs);
    searchInput.addEventListener("input", filterJobs);

    // Function to filter job data based on search input
    function filterJobs() {
        const query = searchInput.value.trim().toLowerCase();
        let filteredData;

        if (query.includes(":")) {
            const [key, value] = query.split(":").map((part) => part.trim().toLowerCase());
            filteredData = jobData.filter((job) => (job[key] || "").toLowerCase().includes(value));
        } else {
            filteredData = jobData.filter((job) =>
                (job["Job_title"] || "").toLowerCase().includes(query)
            );
        }

        updateTable(filteredData);
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

        submitFavorites();
    }

    // Function to submit favorite jobs to backend
    function submitFavorites() {
        const listId = session['user_id']; // 从用户会话或认证中获取当前用户的ID
        const favoriteJobIds = Array.from(favoriteJobs);

        fetch("/api_save_favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ List_ID: listId, Job_IDs: favoriteJobIds })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Successfully saved favorite:", data);
                // 显示成功消息或进行其他处理
            })
            .catch(error => {
                console.error("Error saving favorite:", error);
                // 显示错误消息或进行其他处理
            });
    }
});

function logout() {
    window.location.href = "/login";
}

function gotoResume() {
    window.location.href = "/resume";
}
