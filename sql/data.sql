insert into User (User_Name,Email,User_Password,User_Identity)
values("chewei","test1@gmail.com","1234567890",1);
insert into User (User_Name,Email,User_Password,User_Identity)
values("Onion Man","test2@gmail.com","0987654321",1);
insert into User (User_Name,Email,User_Password,User_Identity)
values("Ivy Shao","test3@gmail.com","0123456789",1);
insert into User (User_Name,Email,User_Password,User_Identity)
values("Wing Stars","test4@gmail.com","9876543210",0);

insert into Category_about_Job values(1,"人力");
insert into Category_about_Job values(2,"餐飲");
insert into Category_about_Job values(3,"門市");
insert into Category_about_Job values(4,"辦公");
insert into Category_about_Job values(5,"補教");
insert into Category_about_Job values(6,"活動");
insert into Category_about_Job values(7,"其他");

insert into Working_Hours_about_Job values(1,"早班");
insert into Working_Hours_about_Job values(2,"午班");
insert into Working_Hours_about_Job values(3,"晚班");
insert into Working_Hours_about_Job values(4,"大夜班");

insert into Job (Job_title,Salary,Content,Job_Address,Payment,Paydate,Quantity,Contact,Phone,Category_Num,Working_Hours_Num,Job_State)
values("金展雞肉飯",170,"安撫被老闆嚇到的客人","新北市永和區","現金","每月5日",1,"謝先生","0212345678",2,3,0);
insert into Job (Job_title,Salary,Content,Job_Address,Payment,Paydate,Quantity,Contact,Phone,Category_Num,Working_Hours_Num,Job_State)
values("漢堡王",170,"讓老闆罵你髒話紓壓","新北市中和區","匯款","每月5日",3,"王先生","0287654321",2,3,1);
insert into Job (Job_title,Salary,Content,Job_Address,Payment,Paydate,Quantity,Contact,Phone,Category_Num,Working_Hours_Num,Job_State)
values("博聯生技",360,"巡迴體檢","臺北市松山區","匯款","每月5日",5,"陳先生","0912345678",1,1,1);
insert into Job (Job_title,Salary,Content,Job_Address,Payment,Paydate,Quantity,Contact,Phone,Category_Num,Working_Hours_Num,Job_State)
values("7-11師大店",190,"抓老鼠","臺北市文山區","匯款","每月10日",2,"劉先生","0923456789",3,4,1);

insert into List (List_ID,Job_ID) values("4c0cf018","5b23");
insert into List (List_ID,Job_ID) values("4c0cf018","5b2c");
insert into List (List_ID,Job_ID) values("4b499cd0","5b32");
insert into List (List_ID,Job_ID) values("4b4254dd","5bfa");
insert into List (List_ID,Job_ID) values("4b499cd0","5b23");
insert into List (List_ID,Job_ID) values("4b499cd0","5b2c");
insert into List (List_ID,Job_ID) values("4c0cf018","5b32");
insert into List (List_ID,Job_ID) values("4b499cd0","5bfa");

UPDATE Resume
SET Sex = 'm',Education = '師大資工',Phone = '0912345678',Identify_ID = 'F123456789',Birth = '20000412',
Experience_1 = '數學家教',Experience_2 = NULL,Experience_3 = NULL,Introduction = '我是師大資工三年級'
WHERE Resume_ID = '4b4254dd';
UPDATE Resume
SET Sex = 'f',Education = '實踐食品',Phone = '0987654321',Identify_ID = 'F213456789',Birth = '20030523',
Experience_1 = 'Net櫃台',Experience_2 = "飲料店",Experience_3 = NULL,Introduction = '我是實踐食品三年級'
WHERE Resume_ID = '4b499cd0';
UPDATE Resume
SET Sex = 'f',Education = '錦和高中',Phone = '0922333444',Identify_ID = 'N987654321',Birth = '20021118',
Experience_1 = '搶銀行',Experience_2 = "偷老人錢包",Experience_3 = "碰瓷",Introduction = '我沒有拿到高中畢業證書'
WHERE Resume_ID = '4b513806';
UPDATE Resume
SET Sex = 'm',Education = '台大醫學',Phone = '0911666999',Identify_ID = 'A321654987',Birth = '19970229',
Experience_1 = null,Experience_2 = NULL,Experience_3 = NULL,Introduction = '我準備擺攤賣雞排'
WHERE Resume_ID = '4c0cf018';