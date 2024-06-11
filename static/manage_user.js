// 要顯示的使用者欄位順序
const displayOrder = ["User_Name", "Email", "User_Password", "User_Identity"];

let userData = [];

document.addEventListener("DOMContentLoaded", async function () {
	const messageDiv = document.getElementById("error-message");
	const refreshButton = document.getElementById("refresh-button");
	const searchButton = document.getElementById("search-button");


	// 檢查登入狀態
	let login_status = await checkLogin();
	if (!login_status) {
		messageDiv.style.display = "block";
		return;
	}

	fetchUsers();

	refreshButton.addEventListener("click", fetchUsers);
	searchButton.addEventListener("click", filterUsers);
});

// 抓取使用者資料
function fetchUsers() {
	const loadingIndicator = document.getElementById("loading-indicator");
	const messageDiv = document.getElementById("error-message");

	loadingIndicator.classList.add("show");
	messageDiv.classList.remove("show");

	fetch("/api_get_users")
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok " + response.statusText);
			}
			return response.json();
		})
		.then((data) => {
			userData = data;
			update_table(userData);
		})
		.catch((error) => {
			console.error("Error fetching users:", error);
			messageDiv.textContent = "Error fetching users. Please try again later.";
			messageDiv.classList.add("show");
		})
		.finally(() => {
            setTimeout(() => {
                loadingIndicator.classList.remove("show");
            }, 500);  // 500 毫秒延遲
		});
}


// 更新表格顯示使用者資料
function update_table(data) {
	const errorMessage = document.getElementById("error-message");
	errorMessage.style.display = "none";

	const userTableBody = document.getElementById("user-table-body");
	userTableBody.innerHTML = "";

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
	addButton.onclick = () => addUser(newRow);
	actionsCell.appendChild(addButton);
	newRow.appendChild(actionsCell);

	userTableBody.appendChild(newRow);

	data.forEach((user) => {
		const row = document.createElement("tr");
		row.dataset.userId = user.User_ID;

		displayOrder.forEach((key) => {
			const cell = document.createElement("td");
			cell.textContent = user[key];
			cell.dataset.key = key;
			row.appendChild(cell);
		});

		const actionsCell = document.createElement("td");
		const editButton = document.createElement("button");
		editButton.textContent = "Edit";
		editButton.classList.add("edit-button");
		editButton.onclick = () => editUser(row, user);
		actionsCell.appendChild(editButton);

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete";
		deleteButton.classList.add("delete-button");
		deleteButton.onclick = () => deleteUser(row, user);
		actionsCell.appendChild(deleteButton);

		row.appendChild(actionsCell);
		userTableBody.appendChild(row);
	});
}

// 編輯使用者
function editUser(row, user) {
	const cells = row.querySelectorAll("td");
	cells.forEach((cell, index) => {
		if (index < displayOrder.length) {
			const key = cell.dataset.key;
			const input = document.createElement("input");
			input.type = "text";
			input.value = user[key];
			cell.innerHTML = "";
			cell.appendChild(input);
		}
	});

	const actionsCell = cells[cells.length - 1];
	actionsCell.innerHTML = "";

	const saveButton = document.createElement("button");
	saveButton.textContent = "Save";
	saveButton.classList.add("save-button");
	saveButton.onclick = () => saveUser(row, user);
	actionsCell.appendChild(saveButton);

	const cancelButton = document.createElement("button");
	cancelButton.textContent = "Cancel";
	cancelButton.classList.add("cancel-button");
	cancelButton.onclick = () => update_table(userData);
	actionsCell.appendChild(cancelButton);
}

// 儲存使用者
function saveUser(row, user) {
	const inputs = row.querySelectorAll("input");
	inputs.forEach((input, index) => {
		const key = displayOrder[index];
		user[key] = input.value;
		const cell = input.parentElement;
		cell.textContent = input.value;
	});

	const actionsCell = row.querySelector("td:last-child");
	actionsCell.innerHTML = "";

	const editButton = document.createElement("button");
	editButton.textContent = "Edit";
	editButton.classList.add("edit-button");
	editButton.onclick = () => editUser(row, user);
	actionsCell.appendChild(editButton);

	const deleteButton = document.createElement("button");
	deleteButton.textContent = "Delete";
	deleteButton.classList.add("delete-button");
	deleteButton.onclick = () => deleteUser(row, user);
	actionsCell.appendChild(deleteButton);

	const errorMessage = document.getElementById("error-message");

	user["User_Identity"] = parseInt(user["User_Identity"]);
	console.log(user);
	fetch("/api_change_user", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Successfully saved user:", data);
			errorMessage.style.display = "block";
			errorMessage.textContent = "Successfully saved user";
			errorMessage.style.color = "green";
		})
		.catch((error) => {
			console.error("Error saving user:", error);
			errorMessage.style.display = "block";
			errorMessage.textContent = "Error saving user:";
			errorMessage.style.color = "red";
		});
}

// 刪除使用者
function deleteUser(row, user) {
	const errorMessage = document.getElementById("error-message");
	const data_userId = { User_ID: user.User_ID };

	fetch("/api_change_user", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data_userId),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Successfully deleted user:", data);
			errorMessage.style.display = "block";
			errorMessage.textContent = "Successfully deleted user";
			errorMessage.style.color = "green";
			row.remove();
		})
		.catch((error) => {
			console.error("Error deleting user:", error);
			errorMessage.style.display = "block";
			errorMessage.textContent = "Error deleting user";
			errorMessage.style.color = "red";
		});
}

// 新增使用者
function addUser(row) {
	const errorMessage = document.getElementById("error-message");
	const inputs = row.querySelectorAll("input");
	const newUser = {};

	let isValid = true;
	inputs.forEach((input) => {
		if (!input.value.trim()) {
			isValid = false;
			input.style.border = "3px solid red";
		} else {
			input.style.border = "";
			const key = input.dataset.key;
			newUser[key] = input.value;
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
		newUser[key] = input.value;
	});

	newUser["User_Identity"] = parseInt(newUser["User_Identity"]);
	console.log(newUser);
	fetch("/api_change_user", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newUser),
	})
		.then((response) => {
			if (!response.ok) {
				errorMessage.style.display = "block";
				errorMessage.textContent = "Error adding user";
				errorMessage.style.color = "red";
				return Promise.reject(0);
			}
		})
		.then((data) => {
			console.log("Successfully added user:", data);
			errorMessage.style.display = "block";
			errorMessage.textContent = "User added successfully!";
			errorMessage.style.color = "green";
			fetchUsers();
		})
		.catch((error) => {
			console.error("Error adding user:", error);
		});
}

// 過濾使用者
function filterUsers() {
	const searchInput = document.getElementById("search-input");
	const query = searchInput.value.trim();

	let filteredData;

	if (query.includes(":")) {
		const [key, value] = query.split(":").map((part) => part.trim());
		filteredData = userData.filter((user) => (user[key] || "").toLowerCase().includes(value));
	} else {
		filteredData = userData.filter((user) =>
			(user["User_Name"] || "").toLowerCase().includes(query)
		);
	}

	update_table(filteredData);
}
