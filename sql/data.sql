delete from User;
delete from Job;

INSERT INTO User (User_ID, Name, Email, Password, Phone)
VALUES
    ('user1', 'John Doe', 'johndoe@example.com', 'password123', '1234567890'),
    ('user2', 'Jane Smith', 'janesmith@example.com', 'password456', '0987654321'),
    ('user3', 'Ian', 'ian@gmail.com', '123', '0');

INSERT INTO Job (Job_ID, Job_title, Salary, Content, Address, Payment, Paydate, Quantity, Contact, Phone, Category, Hours) VALUES
('JOB001', 'Software Engineer', 60000, 'Develop and maintain software solutions.', '123 Tech St, City', 'Monthly', '2024-07-15', 1, 'John Doe', '1234567890', 'IT', '9 AM - 6 PM'),
('JOB002', 'Data Analyst', 55000, 'Analyze and interpret complex data sets.', '456 Data Rd, City', 'Monthly', '2024-07-20', 2, 'Jane Smith', '0987654321', 'IT', '8 AM - 5 PM'),
('JOB003', 'Graphic Designer', 50000, 'Create visual concepts to communicate ideas.', '789 Design Blvd, City', 'Monthly', '2024-07-25', 1, 'Alice Johnson', '1122334455', 'Design', '10 AM - 7 PM'),
('JOB004', 'Project Manager', 70000, 'Lead project teams to deliver projects on time.', '101 Management Ln, City', 'Monthly', '2024-07-30', 1, 'Bob Brown', '5566778899', 'Management', '9 AM - 6 PM'),
('JOB005', 'Sales Representative', 45000, 'Sell products and services to customers.', '202 Sales Ave, City', 'Monthly', '2024-08-01', 3, 'Carol White', '6677889900', 'Sales', '9 AM - 6 PM');
