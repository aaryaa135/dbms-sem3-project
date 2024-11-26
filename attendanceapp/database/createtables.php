<?php

$path = $_SERVER['DOCUMENT_ROOT'];
require_once $path . "/attendanceapp/database/database.php";
function clearTable($dbo, $tabName)
{
  $c = "delete from ".$tabName;
  $s = $dbo->conn->prepare($c);
  try {
    $s->execute();
    echo($tabName." cleared");
  } catch (PDOException $oo) {
    echo($oo->getMessage());
  }
}
$dbo = new Database();
$c = "create table student_details
(
    id int auto_increment primary key,
    roll_no varchar(20) unique,
    name varchar(50),
    email_id varchar(100)
)";
$s = $dbo->conn->prepare($c);
try {
  $s->execute();
  echo ("<br>student_details created");
} catch (PDOException $o) {
  echo ("<br>student_details not created");
}

$c = "create table course_details
(
    id int auto_increment primary key,
    code varchar(20) unique,
    title varchar(50),
    credit int
)";
$s = $dbo->conn->prepare($c);
try {
  $s->execute();
  echo ("<br>course_details created");
} catch (PDOException $o) {
  echo ("<br>course_details not created");
}


$c = "create table faculty_details
(
    id int auto_increment primary key,
    user_name varchar(20) unique,
    name varchar(100),
    password varchar(50)
)";
$s = $dbo->conn->prepare($c);
try {
  $s->execute();
  echo ("<br>faculty_details created");
} catch (PDOException $o) {
  echo ("<br>faculty_details not created");
}


$c = "create table session_details
(
    id int auto_increment primary key,
    year int,
    term varchar(50),
    unique (year,term)
)";
$s = $dbo->conn->prepare($c);
try {
  $s->execute();
  echo ("<br>session_details created");
} catch (PDOException $o) {
  echo ("<br>session_details not created");
}



$c = "create table course_registration
(
    student_id int,
    course_id int,
    session_id int,
    primary key (student_id,course_id,session_id)
)";
$s = $dbo->conn->prepare($c);
try {
  $s->execute();
  echo ("<br>course_registration created");
} catch (PDOException $o) {
  echo ("<br>course_registration not created");
}
clearTable($dbo, "course_registration");

$c = "create table course_allotment
(
    faculty_id int,
    course_id int,
    session_id int,
    primary key (faculty_id,course_id,session_id)
)";
$s = $dbo->conn->prepare($c);
try {
  $s->execute();
  echo ("<br>course_allotment created");
} catch (PDOException $o) {
  echo ("<br>course_allotment not created");
}
clearTable($dbo, "course_allotment");

$c = "create table attendance_details
(
    faculty_id int,
    course_id int,
    session_id int,
    student_id int,
    on_date date,
    status varchar(10),
    primary key (faculty_id,course_id,session_id,student_id,on_date)
)";
$s = $dbo->conn->prepare($c);
try {
  $s->execute();
  echo ("<br>attendance_details created");
} catch (PDOException $o) {
  echo ("<br>attendance_details not created");
}
clearTable($dbo, "attendance_details");

$c = "create table sent_email_details
(
    faculty_id int,
    course_id int,
    session_id int,
    student_id int,
    on_date date,
    id int auto_increment primary key,
    message varchar(200),
    to_email varchar(100)
)";
$s = $dbo->conn->prepare($c);
try {
  $s->execute();
  echo ("<br>sent_email_details created");
} catch (PDOException $o) {
  echo ("<br>sent_email_details not created");
}
clearTable($dbo, "sent_email_details");

clearTable($dbo, "student_details");
$c = "insert into student_details
(id,roll_no,name,email_id)
values
(1,'K701','SHARAD','abc@gmail.com'),
(2,'K702','NIKHIL','abc@gmail.com'),
(3,'K703','MAYANK','abc@gmail.com'),
(4,'K704','DEEPIKA','abc@gmail.com'),
(5,'K705','DEEPMALA','abc@gmail.com'),
(6,'K601','HARSH','abc@gmail.com'),
(7,'K801','MAAHI','abc@gmail.com'),
(8,'K602','MANNU','abc@gmail.com'),
(9,'K802','GANGA','abc@gmail.com'),
(10,'K706','AMAN','abc@gmail.com'),
(11,'K803','PAWAN','abc@gmail.com'),
(12,'K707','PRINCE','abc@gmail.com'),

(13,'K101','ARNAV(VEER)','abc@gmail.com'),
(14,'K201','KANAK','abc@gmail.com'),
(15,'K501','ARNAV','abc@gmail.com'),
(16,'K401','ALOK','abc@gmail.com'),
(17,'K402','NITIK','abc@gmail.com'),
(18,'K403','PRINCE2','abc@gmail.com'),
(19,'K708','LIZA','abc@gmail.com'),
(20,'KN01','VIRAJ','abc@gmail.com'),
(21,'K301','ABHINAV','abc@gmail.com'),
(22,'K901','VISHAKA','abc@gmail.com'),
(23,'K804','LUCKY','abc@gmail.com'),
(24,'K404','PREETI','abc@gmail.com')
";

$s = $dbo->conn->prepare($c);
try {
  $s->execute();
} catch (PDOException $o) {
  echo ("<br>duplicate entry");
}

clearTable($dbo, "faculty_details");
$c = "insert into faculty_details
(id,user_name,password,name)
values
(1,'dar','123','DARSHIKA'),
(2,'raa','123','RAAVI'),
(3,'aar','123','AARYA'),
(4,'var','123','VARDAAN'),
(5,'pri','123','PRIYAL'),
(6,'ras','123','RASHI')";

$s = $dbo->conn->prepare($c);
try {
  $s->execute();
} catch (PDOException $o) {
  echo ("<br>duplicate entry");
}

clearTable($dbo, "session_details");
$c = "insert into session_details
(id,year,term)
values
(1,2024,'ODD SEMESTER'),
(2,2025,'EVEN SEMESTER'),
(3,2025,'ODD SEMESTER')";

$s = $dbo->conn->prepare($c);
try {
  $s->execute();
} catch (PDOException $o) {
  echo ("<br>duplicate entry");
}

clearTable($dbo, "course_details");
$c = "insert into course_details
(id,title,code,credit)
values
  (1,'ENGLISH','EN24',2),
  (2,'MATHS','MA24',3),
  (3,'EVS','EV24',4),
  (4,'HINDI','HI24',4),
  (5,'SCIENCE','SC24',3),
  (6,'SOCIAL SCIENCE','SO24',1)";
$s = $dbo->conn->prepare($c);
try {
  $s->execute();
} catch (PDOException $o) {
  echo ("<br>duplicate entry");
}

//if any record already there in the table delete them
clearTable($dbo, "course_registration");
$c = "insert into course_registration
  (student_id,course_id,session_id)
  values
  (:sid,:cid,:sessid)";
$s = $dbo->conn->prepare($c);
//iterate over all the 24 students
//for each of them chose max 3 random courses, from 1 to 6

for ($i = 1; $i <= 24; $i++) {
  for ($j = 0; $j < 3; $j++) {
    $cid = rand(1, 6);
    //insert the selected course into course_registration table for 
    //session 1 and student_id $i
    try {
      $s->execute([":sid" => $i, ":cid" => $cid, ":sessid" => 1]);
    } catch (PDOException $pe) {
    }

    //repeat for session 2
    $cid = rand(1, 6);
    //insert the selected course into course_registration table for 
    //session 2 and student_id $i
    try {
      $s->execute([":sid" => $i, ":cid" => $cid, ":sessid" => 2]);
    } catch (PDOException $pe) {
    }

    //repeat for session 3
    $cid = rand(1, 6);
    //insert the selected course into course_registration table for 
    //session 2 and student_id $i
    try {
      $s->execute([":sid" => $i, ":cid" => $cid, ":sessid" => 3]);
    } catch (PDOException $pe) {
    }
  }
}


//if any record already there in the table delete them
clearTable($dbo, "course_allotment");
$c = "insert into course_allotment
  (faculty_id,course_id,session_id)
  values
  (:fid,:cid,:sessid)";
$s = $dbo->conn->prepare($c);
//iterate over all the 6 teachers
//for each of them chose max 2 random courses, from 1 to 6

for ($i = 1; $i <= 6; $i++) {
  for ($j = 0; $j < 2; $j++) {
    $cid = rand(1, 6);
    //insert the selected course into course_allotment table for 
    //session 1 and fac_id $i
    try {
      $s->execute([":fid" => $i, ":cid" => $cid, ":sessid" => 1]);
    } catch (PDOException $pe) {
    }

    //repeat for session 2
    $cid = rand(1, 6);
    //insert the selected course into course_allotment table for 
    //session 2 and student_id $i
    try {
      $s->execute([":fid" => $i, ":cid" => $cid, ":sessid" => 2]);
    } catch (PDOException $pe) {
    }

    //repeat for session 3
    $cid = rand(1, 6);
    //insert the selected course into course_allotment table for 
    //session 2 and student_id $i
    try {
      $s->execute([":fid" => $i, ":cid" => $cid, ":sessid" => 3]);
    } catch (PDOException $pe) {
    }
  }
}
