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

	fetch_jobs();

	refreshButton.addEventListener("click", function () {
		loadingIndicator.classList.add("show");
		fetch_jobs();
	});
	searchButton.addEventListener("click", filter_jobs);
	categoryFilter.addEventListener("change", filter_jobs);
	salaryFilter.addEventListener("change", filter_jobs);
});

// 抓取職缺資料
function fetch_jobs() {
	const loadingIndicator = document.getElementById("loading-indicator");
	const messageDiv = document.getElementById("error-message");
	const categoryFilter = document.getElementById("category-filter");
	const salaryFilter = document.getElementById("salary-filter");

	loadingIndicator.classList.add("show");
	messageDiv.classList.remove("show");

	fetch("/api_get_jobs")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok " + response.statusText);
			}
			return response.json();
		})
		.then((data) => {
			jobData = data;
			update_table(jobData);
			categoryFilter.value = "";
			salaryFilter.value = "";
		})
		.catch((error) => {
			console.error("Error fetching jobs:", error);
			messageDiv.textContent = "Error fetching jobs. Please try again later.";
			messageDiv.classList.add("show");
		})
		.finally(() => {
			setTimeout(() => {
				loadingIndicator.classList.remove("show");
			}, 500); // 500 毫秒延遲
		});
}

// 更新表格顯示職缺資料
function update_table(data) {
	const errorMessage = document.getElementById("error-message");
	errorMessage.style.display = "none";

	const jobTableBody = document.getElementById("job-table-body");
	jobTableBody.innerHTML = "";

	const newRow = document.createElement("tr");
	displayOrder.forEach((key) => {
		const newCell = document.createElement("td");

		// 創建選單選取框
		let input;
		if (key === "Category" || key === "Working_Hours" || key === "Job_State") {
			input = document.createElement("select");

			// 根據欄位名設置選單選項
			let options;
			if (key === "Category") {
				options = ["人力", "餐飲", "門市", "辦公", "補教", "活動", "其他"]; // 替換為實際選項
			} else if (key === "Working_Hours") {
				options = ["早班", "午班", "晚班", "大夜班"]; // 替換為實際選項
			} else if (key === "Job_State") {
				options = [1, 0]; // 替換為實際選項
			}

			options.forEach((optionValue) => {
				const option = document.createElement("option");
				option.value = optionValue;
				option.textContent = optionValue;
				input.appendChild(option);
			});
		} else {
			input = document.createElement("input");
			input.type = "text";
			if (key === "Phone") {
				input.setAttribute("minlength", "10");
				input.setAttribute("maxlength", "10");
				input.setAttribute("size", "10");
			}
		}

		// 添加其他屬性
		input.dataset.key = key;
		input.required = true;

		// 添加輸入元素到單元格
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

			// 如果是 Category、Working_Hours 或 Job_State 欄位，則創建選單選取
			if (key === "Category" || key === "Working_Hours" || key === "Job_State") {
				const select = document.createElement("select");

				let options;
				if (key === "Category") {
					options = ["人力", "餐飲", "門市", "辦公", "補教", "活動", "其他"]; // 替換為實際選項
				} else if (key === "Working_Hours") {
					options = ["早班", "午班", "晚班", "大夜班"]; // 替換為實際選項
				} else if (key === "Job_State") {
					options = [1, 0]; // 替換為實際選項
				}

				options.forEach((optionValue) => {
					const option = document.createElement("option");
					option.value = optionValue;
					option.textContent = optionValue;
					if (job[key] === optionValue) {
						option.selected = true;
					}
					select.appendChild(option);
				});

				// 將選單選取添加到單元格中
				cell.innerHTML = "";
				cell.appendChild(select);
			} else {
				// 否則，創建文本輸入框
				input.type = "text";
				input.value = job[key];
				cell.innerHTML = "";
				cell.appendChild(input);
			}
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
	cancelButton.onclick = () => update_table(jobData);
	actionsCell.appendChild(cancelButton);
}

// 儲存職缺
function saveJob(row, job) {
	const inputs = row.querySelectorAll("input, select"); // 同時選取輸入框和選單選取框
	inputs.forEach((input, index) => {
		const key = displayOrder[index];
		if (input.tagName === "INPUT") {
			job[key] = input.value;
		} else if (input.tagName === "SELECT") {
			job[key] = input.options[input.selectedIndex].value; // 獲取選擇的值
		}
		const cell = input.parentElement;
		cell.textContent = job[key];
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
	const inputs = row.querySelectorAll("input, select"); // 同時選取輸入框和選單選取框
	const newJob = {};
    // console.log(inputs);
	let isValid = true;
	inputs.forEach((input) => {
		if (!input.value.trim()) {
			isValid = false;
			input.style.border = "3px solid red";
		} else {
			input.style.border = "";
			const key = input.dataset.key;
			newJob[key] =
				input.tagName === "INPUT" ? input.value : input.options[input.selectedIndex].value; // 根據元素類型獲取值
		}
	});

	if (!isValid) {
		errorMessage.style.display = "block";
		errorMessage.textContent = "Please fill in all required fields.";
		errorMessage.style.color = "red";
		return;
	}
    if(newJob["Phone"].length != 10){
        errorMessage.style.display = "block";
        errorMessage.textContent = "Phone number must be 10 digits.";
        errorMessage.style.color = "red";
        inputs[8].style.border = "3px solid red";
        return;
    }
	// 將數值欄位轉換為整數
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
			fetch_jobs();
		})
		.catch((error) => {
			console.error("Error adding job:", error);
		});
}
