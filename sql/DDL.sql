CREATE TABLE User (
    User_ID VARCHAR(8) PRIMARY KEY,
    User_Name VARCHAR(20),
    Email VARCHAR(50),
    User_Password VARCHAR(20),
    User_Identity INT DEFAULT 1  
) ENGINE=INNODB;

CREATE TABLE Resume (
    Resume_ID VARCHAR(8) PRIMARY KEY,
    -- User_Name VARCHAR(20),
    Sex CHAR(1) CHECK (Sex IN ('m','f')),
    Education TEXT,
    Phone CHAR(10) CHECK (LENGTH(Phone)=10),
    Identify_ID VARCHAR(10) CHECK (LENGTH(Identify_ID)=10),
    Birth CHAR(8) CHECK (LENGTH(Birth)=8),
    -- Email VARCHAR(50),
    Experience_1 VARCHAR(20),
    Experience_2 VARCHAR(20),
    Experience_3 VARCHAR(20),
    Introduction MEDIUMTEXT,
    FOREIGN KEY (Resume_ID) REFERENCES User(User_ID) on delete CasCade
) ENGINE=INNODB;

CREATE TABLE Category_about_Job (
    Serial_Number INT PRIMARY KEY,
    Category_content VARCHAR(3)
) ENGINE=INNODB;

CREATE TABLE Working_Hours_about_Job (
    Serial_Number INT PRIMARY KEY,
    Working_Hours_content VARCHAR(3)
) ENGINE=INNODB;

CREATE TABLE Job (
    Job_ID VARCHAR(4) PRIMARY KEY,
    Job_title VARCHAR(15),
    Salary INT,
    Content MEDIUMTEXT,
    Job_Address MEDIUMTEXT,
    Payment VARCHAR(2),
    Paydate VARCHAR(5),
    Quantity INT,
    Contact VARCHAR(4),
    Phone CHAR(10) CHECK (LENGTH(Phone)=10),
    Category_Num INT,
    Working_Hours_Num INT,
    Job_State INT DEFAULT 1,
    FOREIGN KEY (Category_Num) REFERENCES Category_about_Job(Serial_Number) on delete set null on update CasCade,
    FOREIGN KEY (Working_Hours_num) REFERENCES Working_Hours_about_Job(Serial_Number) on delete set null on update CasCade
) ENGINE=INNODB;

CREATE TABLE List (
    List_ID VARCHAR(8),
    Job_ID VARCHAR(4),
    FOREIGN KEY (Job_ID) REFERENCES Job(Job_ID) on delete CasCade on update set null,
    FOREIGN KEY (List_ID) REFERENCES User(User_ID) on delete CasCade
) ENGINE=INNODB;

-- drop table List;
-- drop table Job;
-- drop table Category_about_Job;
-- drop table Working_Hours_about_Job;
-- drop table Resume;
-- drop table User;

-----------------------------------------------------------------------------------------------------------------------------

DELIMITER //
CREATE TRIGGER User_Register
AFTER INSERT ON User
FOR EACH ROW
BEGIN
    INSERT INTO Resume (Resume_ID)
    VALUES (NEW.User_ID);
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER Create_User_ID
BEFORE INSERT ON User
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(8);
    DECLARE id_exists INT DEFAULT 1;

    WHILE id_exists = 1 DO
        SET new_id = LEFT(UUID(), 8);
        SELECT COUNT(*) INTO id_exists FROM User WHERE User_ID = new_id;
    END WHILE;

    SET NEW.User_ID = new_id;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER Create_Job_ID
BEFORE INSERT ON Job
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(4);
    DECLARE id_exists INT DEFAULT 1;

    WHILE id_exists = 1 DO
        SET new_id = LEFT(UUID(), 4);
        SELECT COUNT(*) INTO id_exists FROM Job WHERE Job_ID = new_id;
    END WHILE;

    SET NEW.Job_ID = new_id;
END//
DELIMITER ;

-----------------------------------------------------------------------------------------------------------------------------

-- 得到自己list的收藏數量  =>  使用方法 SELECT COUNT(*) as num FROM list WHERE List_ID = "9051f935" GROUP BY List_ID;
-- 得到自己list的收藏數量  =>  使用方法 SELECT Count_Job_ID('$List_ID') AS num;
DELIMITER //
CREATE FUNCTION Count_Job_ID(id VARCHAR(8)) RETURNS INT DETERMINISTIC
BEGIN
    DECLARE num INT;
    SELECT COUNT(*) INTO num FROM list WHERE List_ID = id GROUP BY List_ID;
    RETURN num;
END //
DELIMITER ;

-- DROP FUNCTION IF EXISTS Count_Job_ID;
-- SHOW FUNCTION STATUS WHERE Db = 'team9';

----------------------------------------------------------------------------------------------------------------------------- 

-- 看誰的List有收藏甚麼工作
SELECT User.User_Name, Job.Job_title
FROM User LEFT OUTER JOIN List ON User.User_ID = List.List_ID LEFT OUTER JOIN Job ON List.Job_ID = Job.Job_ID;
-- 看Job是甚麼分類的、甚麼時段的
SELECT Job_ID,Job_title,Salary,Content,Job_Address,Payment,Paydate,Quantity,Contact,Phone,Category_content AS Category,Working_Hours_content AS Working_Hours,Job_State
FROM Job LEFT JOIN Working_Hours_about_Job ON Working_Hours_Num = Working_Hours_about_Job.Serial_Number 
LEFT JOIN Category_about_Job ON Category_Num = Category_about_Job.Serial_Number;

-- Resume可得知自己的User_Name、Email
SELECT User_Name,Email,Sex,Education,Phone,Identify_ID,Birth,Experience_1,Experience_2,Experience_3,Introduction
FROM Resume INNER JOIN User ON Resume_ID = User_ID;

-- 查詢工作分類 => 單選項
SELECT Job_ID,Job_title,Salary,Content,Job_Address,Payment,Paydate,Quantity,Contact,Phone,Category_content AS Category,Working_Hours_content AS Working_Hours,Job_State
FROM Job LEFT JOIN Working_Hours_about_Job ON Working_Hours_Num = Working_Hours_about_Job.Serial_Number 
LEFT JOIN Category_about_Job ON Category_Num = Category_about_Job.Serial_Number
where Category_about_Job.Category_content = "餐飲";
-- 查詢工作分類 => 多選項
SELECT Job_ID,Job_title,Salary,Content,Job_Address,Payment,Paydate,Quantity,Contact,Phone,Category_content AS Category,Working_Hours_content AS Working_Hours,Job_State
FROM Job LEFT JOIN Working_Hours_about_Job ON Working_Hours_Num = Working_Hours_about_Job.Serial_Number 
LEFT JOIN Category_about_Job ON Category_Num = Category_about_Job.Serial_Number
where Category_about_Job.Category_content = "餐飲" or Category_about_Job.Category_content = "人力";
-- 查詢工作時薪分類 => 大於等於查詢
SELECT Job_ID,Job_title,Salary,Content,Job_Address,Payment,Paydate,Quantity,Contact,Phone,Category_content AS Category,Working_Hours_content AS Working_Hours,Job_State
FROM Job LEFT JOIN Working_Hours_about_Job ON Working_Hours_Num = Working_Hours_about_Job.Serial_Number 
LEFT JOIN Category_about_Job ON Category_Num = Category_about_Job.Serial_Number
where Salary >= 180;
-- 放大鏡搜尋關鍵字 => 有包含關鍵字就好
SELECT Job_ID,Job_title,Salary,Content,Job_Address,Payment,Paydate,Quantity,Contact,Phone,Category_content AS Category,Working_Hours_content AS Working_Hours,Job_State
FROM Job LEFT JOIN Working_Hours_about_Job ON Working_Hours_Num = Working_Hours_about_Job.Serial_Number 
LEFT JOIN Category_about_Job ON Category_Num = Category_about_Job.Serial_Number
WHERE Job_title LIKE '%生技%';

