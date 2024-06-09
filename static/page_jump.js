function checkLogin() {
    return new Promise((resolve, reject) => {
        fetch("/api_check_login")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                resolve(data.success); // Resolve with the success value
            })
            .catch(error => {
                console.error("Error checking login status:", error);
                resolve(false); // Resolve with false if there is an error
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