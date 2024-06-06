document.addEventListener('DOMContentLoaded', async() => {
    const messageDiv = document.getElementById("error-message");
    const form = document.getElementById('resume-form');

    let log_In = await checkLogin();
    if(!log_In){
        messageDiv.style.display ="block"; 
        form.style.display = "none";
        return;
    }
    // 假設用戶ID是從某處獲得的，例如cookie或session
    const userId = 'user3'; // 替換為實際用戶ID的獲取方式
    
    fetch(`/api_get_user_info?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                document.getElementById('name').value = data.Name || '';
                document.getElementById('email').value = data.Email || '';
                document.getElementById('phone').value = data.Phone || '';
            }
        })
        .catch(error => console.error('Error:', error));

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // 防止表單提交

        const resumeID = document.getElementById('resume_id').value;
        const name = document.getElementById('name').value;
        const sex = document.getElementById('sex').value;
        const education = document.getElementById('education').value;
        const phone = document.getElementById('phone').value;
        const identifyID = document.getElementById('identify_id').value;
        const birth = document.getElementById('birth').value;
        const email = document.getElementById('email').value;
        const experience = document.getElementById('experience').value;
        const introduction = document.getElementById('introduction').value;

        const resumeData = {
            resume_id: resumeID,
            name: name,
            sex: sex,
            education: education,
            phone: phone,
            identify_id: identifyID,
            birth: birth,
            email: email,
            experience: experience,
            introduction: introduction
        };

        fetch('/api_submit_resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resumeData)
        }).then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Resume submitted successfully');
            } else if (data.error) {
                alert('Error: ' + data.error);
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });
});

function logout() {
    window.location.href = "/login";
}

function backtoHome() {
    window.location.href = "/home";
}
