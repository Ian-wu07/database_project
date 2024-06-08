// 要顯示的職缺欄位順序
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
	"Job_State",
];

let jobData = [];

document.addEventListener("DOMContentLoaded", async function () {
	const messageDiv = document.getElementById("error-message");
	const refreshButton = document.getElementById("refresh-button");
	const searchButton = document.getElementById("search-button");
	const categoryFilter = document.getElementById("category-filter");
	const salaryFilter = document.getElementById("salary-filter");
	const loadingIndicator = document.getElementById("loading-indicator");

	// 檢查登入狀態
	let login_status = await checkLogin();
	if (!login_status) {
		messageDiv.style.display = "block";
		return;
	}

	fetchJobs();

	refreshButton.addEventListener("click", function () {
		loadingIndicator.classList.add("show");
		fetchJobs();
	});
	searchButton.addEventListener("click", filterJobs);
	categoryFilter.addEventListener("change", filterJobs);
	salaryFilter.addEventListener("change", filterJobs);
});

// 抓取職缺資料
function fetchJobs() {
	const loadingIndicator = document.getElementById("loading-indicator");
	const messageDiv = document.getElementById("error-message");
	const categoryFilter = document.getElementById("category-filter");
	const salaryFilter = document.getElementById("salary-filter");

	loadingIndicator.classList.add("show");

	fetch("/api_get_jobs")
		.then((response) => response.json())
		.then((data) => {
			jobData = data;
			updateTable(jobData);
			setTimeout(() => {
				loadingIndicator.classList.remove("show");
			}, 500);
			categoryFilter.value = "";
			salaryFilter.value = "";
		})
		.catch((error) => {
			console.error("Error fetching jobs:", error);
			messageDiv.textContent = "Error fetching jobs. Please try again later.";
			messageDiv.style.display = "block";
			setTimeout(() => {
				loadingIndicator.classList.remove("show");
			}, 500);
		});
}

// 更新表格顯示職缺資料
function updateTable(data) {
	const errorMessage = document.getElementById("error-message");
	errorMessage.style.display = "none";

	const jobTableBody = document.getElementById("job-table-body");
	jobTableBody.innerHTML = "";

	const newRow = document.createElement("tr");
	displayOrder.forEach((key) => {
		const newCell = document.createElement("td");
		const input = document.createElement("input");
		input.type = "text";
		input.dataset.key = key;
		input.required = true;
		newCell.appendChild(input);
		newRow.appendChild(newCell);
	});

	const actionsCell = document.createElement("td");
	const addButton = document.createElement("button");
	addButton.textContent = "Add";
	addButton.classList.add("add-button");
	addButton.onclick = () => addJob(newRow);
	actionsCell.appendChild(addButton);
	newRow.appendChild(actionsCell);

	jobTableBody.appendChild(newRow);

	data.forEach((job) => {
		const row = document.createElement("tr");
		row.dataset.jobId = job.Job_ID;

		displayOrder.forEach((key) => {
			const cell = document.createElement("td");
			cell.textContent = job[key];
			cell.dataset.key = key;
			row.appendChild(cell);
		});

		const actionsCell = document.createElement("td");
		const editButton = document.createElement("button");
		editButton.textContent = "Edit";
		editButton.classList.add("edit-button");
		editButton.onclick = () => editJob(row, job);
		actionsCell.appendChild(editButton);

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete";
		deleteButton.classList.add("delete-button");
		deleteButton.onclick = () => deleteJob(row, job);
		actionsCell.appendChild(deleteButton);

		row.appendChild(actionsCell);
		jobTableBody.appendChild(row);
	});
}

// 編輯職缺
function editJob(row, job) {
	const cells = row.querySelectorAll("td");
	cells.forEach((cell, index) => {
		if (index < displayOrder.length) {
			const key = cell.dataset.key;
			const input = document.createElement("input");
			input.type = "text";
			input.value = job[key];
			cell.innerHTML = "";
			cell.appendChild(input);
		}
	});

	const actionsCell = cells[cells.length - 1];
	actionsCell.innerHTML = "";

	const saveButton = document.createElement("button");
	saveButton.textContent = "Save";
	saveButton.classList.add("save-button");
	saveButton.onclick = () => saveJob(row, job);
	actionsCell.appendChild(saveButton);

	const cancelButton = document.createElement("button");
	cancelButton.textContent = "Cancel";
	cancelButton.classList.add("cancel-button");
	cancelButton.onclick = () => updateTable(jobData);
	actionsCell.appendChild(cancelButton);
}

// 儲存職缺
function saveJob(row, job) {
	const inputs = row.querySelectorAll("input");
	inputs.forEach((input, index) => {
		const key = displayOrder[index];
		job[key] = input.value;
		const cell = input.parentElement;
		cell.textContent = input.value;
	});

	const actionsCell = row.querySelector("td:last-child");
	actionsCell.innerHTML = "";

	const editButton = document.createElement("button");
	editButton.textContent = "Edit";
	editButton.classList.add("edit-button");
	editButton.onclick = () => editJob(row, job);
	actionsCell.appendChild(editButton);

	const deleteButton = document.createElement("button");
	deleteButton.textContent = "Delete";
	deleteButton.classList.add("delete-button");
	deleteButton.onclick = () => deleteJob(row, job);
	actionsCell.appendChild(deleteButton);

	const errorMessage = document.getElementById("error-message");

	console.log(job);
	fetch("/api_change_job", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(job),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Successfully saved job:", data);
			errorMessage.style.display = "block";
			errorMessage.textContent = "Successfully saved job";
			errorMessage.style.color = "green";
		})
		.catch((error) => {
			console.error("Error saving job:", error);
			errorMessage.style.display = "block";
			errorMessage.textContent = "Error saving job:";
			errorMessage.style.color = "red";
		});
}

// 刪除職缺
function deleteJob(row, job) {
	const errorMessage = document.getElementById("error-message");
	const data_jobId = { Job_ID: job.Job_ID };

	fetch("/api_change_job", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data_jobId),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Successfully deleted job:", data);
			errorMessage.style.display = "block";
			errorMessage.textContent = "Successfully deleted job";
			errorMessage.style.color = "green";
			row.remove();
		})
		.catch((error) => {
			console.error("Error deleting job:", error);
			errorMessage.style.display = "block";
			errorMessage.textContent = "Error deleting job";
			errorMessage.style.color = "red";
		});
}

// 新增職缺
function addJob(row) {
	const errorMessage = document.getElementById("error-message");
	const inputs = row.querySelectorAll("input");
	const newJob = {};

	let isValid = true;
	inputs.forEach((input) => {
		if (!input.value.trim()) {
			isValid = false;
			input.style.border = "3px solid red";
		} else {
			input.style.border = "";
			const key = input.dataset.key;
			newJob[key] = input.value;
		}
	});

	if (!isValid) {
		errorMessage.style.display = "block";
		errorMessage.textContent = "Please fill in all required fields.";
		errorMessage.style.color = "red";
		return;
	}

	inputs.forEach((input) => {
		const key = input.dataset.key;
		newJob[key] = input.value;
	});

	newJob["Salary"] = parseInt(newJob["Salary"]);
	newJob["Quantity"] = parseInt(newJob["Quantity"]);
	newJob["Job_State"] = parseInt(newJob["Job_State"]);

	console.log(newJob);
	fetch("/api_change_job", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newJob),
	})
		.then((response) => {
			if (!response.ok) {
				errorMessage.style.display = "block";
				errorMessage.textContent = "Error adding job";
				errorMessage.style.color = "red";
				return Promise.reject(0);
			}
		})
		.then((data) => {
			console.log("Successfully added job:", data);
			errorMessage.style.display = "block";
			errorMessage.textContent = "Job added successfully!";
			errorMessage.style.color = "green";
			fetchJobs();
		})
		.catch((error) => {
			console.error("Error adding job:", error);
		});
}

// 過濾職缺
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
		filteredData = filteredData.filter(
			(job) => (job["Category"] || "").toLowerCase() === selectedCategory
		);
	}

	if (selectedSalary) {
		const [minSalary, maxSalary] = selectedSalary.split("-").map(Number);
		filteredData = filteredData.filter((job) => {
			const salary = Number(job["Salary"]);
			return minSalary <= salary && (!maxSalary || salary <= maxSalary);
		});
	}
	updateTable(filteredData);
}
