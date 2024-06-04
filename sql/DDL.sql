CREATE TABLE User (
    User_ID VARCHAR(20) PRIMARY KEY,
    Name VARCHAR(20),
    Email VARCHAR(50),
    Password VARCHAR(20),
    Phone CHAR(10)
) ENGINE=INNODB;

CREATE TABLE Resume (
    Resume_ID VARCHAR(20) PRIMARY KEY,
    Name VARCHAR(20),
    Sex CHAR(1),
    Education TEXT,
    Phone CHAR(10),
    Identify_ID VARCHAR(20),
    Birth CHAR(8),
    Email VARCHAR(50),
    Experience VARCHAR(20),
    Introduction MEDIUMTEXT
) ENGINE=INNODB;

CREATE TABLE Job (
    Job_ID VARCHAR(20) PRIMARY KEY,
    Job_title VARCHAR(20),
    Salary INT,
    Content MEDIUMTEXT,
    Address MEDIUMTEXT,
    Payment VARCHAR(20),
    Paydate VARCHAR(20),
    Quantity INT,
    Contact VARCHAR(20),
    Phone CHAR(10),
    Category VARCHAR(20),
    Hours VARCHAR(50)
) ENGINE=INNODB;

CREATE TABLE List (
    List_ID VARCHAR(20) PRIMARY KEY,
    List_title VARCHAR(20),
    Job_ID VARCHAR(20),
    FOREIGN KEY (Job_ID) REFERENCES Job(Job_ID) on delete set null
) ENGINE=INNODB;
