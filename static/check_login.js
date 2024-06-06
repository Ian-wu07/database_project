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