document.addEventListener('DOMContentLoaded', function() {
    function fetchBooks() {
        fetch('/get_books')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#book-table tbody');
                tableBody.innerHTML = ''; // 清空表格內容
                data.forEach(book => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${book.ISBN}</td>
                        <td>${book.BookTitle}</td>
                        <td>${book.Author}</td>
                        <td>${book.Publisher}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });
    }

    document.getElementById('refresh-button').addEventListener('click', fetchBooks);

    // 初次加載頁面時獲取數據
    fetchBooks();
});
