
/*
I will need this templet many times ahead
$.ajax({
        url:"ajaxhandler/attendanceAJAX.php",
        type:"POST",
        dataType:"json",
        data:{},
        beforeSend:function(e)
        {

        },
        success:function(rv)
        {

        },
        error:function(e)
        {

        }
    });
*/
function  getSessionHTML(rv)
{
    let x=``;
    x=`<option value=-1>SELECT ONE</option>`;
    let i=0;
    for(i=0;i<rv.length;i++)
    {
        let cs=rv[i];
        x=x+`<option value=${cs['id']}>${cs['year']+" "+cs['term']}</option>`;
    }
    return x;
}
function loadSessions()
{
    //make an ajax call and load the sessions from DB
    $.ajax({
        url:"ajaxhandler/attendanceAJAX.php",
        type:"POST",
        dataType:"json",
        data:{action:"getSession"},
        beforeSend:function(e)
        {

        },
        success:function(rv)
        {
            //alert(JSON.stringify(rv));
            //lets create the HTML from rv dynamically
            let x=getSessionHTML(rv);
            $("#ddlclass").html(x);
        },
        error:function(e)
        {
            alert("OOPS!");
        }
    });
}
function getCourseCardHTML(classlist)
{
  let x=``;
  x=``;
  let i=0;
  for(i=0;i<classlist.length;i++)
  {
    let cc=classlist[i];
    x=x+`<div class="classcard" data-classobject='${JSON.stringify(cc)}'>${cc['code']}</div>`;
  }
  return x;
}

function fetchFacultyCourses(facid,sessionid)
{
    //get al the courses taken by the loged in faculty
    //for the selected session
    //from DB
    //by an ajax call
    $.ajax({
        url:"ajaxhandler/attendanceAJAX.php",
        type:"POST",
        dataType:"json",
        data:{facid:facid,sessionid:sessionid,action:"getFacultyCourses"},
        beforeSend:function(e)
        {

        },
        success:function(rv)
        {
        //alert(JSON.stringify(rv));
        let x=getCourseCardHTML(rv);
        $("#classlistarea").html(x);
        },
        error:function(e)
        {

        }
    });
}

function getClassdetailsAreaHTML(classobject)
{
    let dobj=new Date();    
    let ondate=`2023-02-01`;
    let year=dobj.getFullYear();//xxxx format
    let month=dobj.getMonth()+1;//returns 0-11
    if(month<10)
    {
        month="0"+month;//its a string now
    }
    let day=dobj.getDate();//1-31
    if(day<10)
    {
        day="0"+day;//its a string now
    }
    ondate=year+"-"+month+"-"+day;
    //alert(ondate);
 let x=`<div class="classdetails">
 <div class="code-area">${classobject['code']}</div>
 <div class="title-area">${classobject['title']}</div>
 <div class="ondate-area">
     <input type="date" value='${ondate}' id='dtpondate'>
 </div>
</div>`;
 return x;
}

function getStudentListHTML(studentList)
{
    
  let x=`<div class="studenttlist">
  <label>STUDENT LIST</label>
         </div>`;
 let i=0;
 for(i=0;i<studentList.length;i++)
 {
    let cs=studentList[i];
    let checkedState=``;
    let rowcolor='absentcolor';
    if(cs['isPresent']=='YES')
    {
        checkedState=`checked`;
        rowcolor='presentcolor'
    }
    //we want different color for checked and unchecked rows

    x=x+`<div class="studentdetails ${rowcolor}" id="student${cs['id']}">
    <div class="slno-area">${(i+1)}</div>
    <div class="rollno-area">${cs['roll_no']}</div>
    <div class="name-area">${cs['name']}</div>
    <div class="checkbox-area" data-studentid='${cs['id']}'>
        <input type="checkbox" class="cbpresent" data-studentid='${cs['id']}' ${checkedState}>
        <!--we will do it dynamically, but before that lets save 
        a few attendance-->
    </div>
</div>`;
 }
  x=x+`<div class="reportsection">
  <button id="btnReport">REPORT</button>
 </div>
 <div id="divReport"></div>
  `;
  return x;
}

function fetchStudentList(sessionid,classid,facid,ondate)
{
    //make an ajax call and get the data from DB
    $.ajax({
        url:"ajaxhandler/attendanceAJAX.php",
        type:"POST",
        dataType:"json",
        data:{facid:facid,ondate:ondate,sessionid:sessionid,classid:classid,action:"getStudentList"},
        beforeSend:function(e)
        {

        },
        success:function(rv)
        {
          //alert(JSON.stringify(rv));
          //get the studentlist HTML
          let x=getStudentListHTML(rv);
          $("#studentlistarea").html(x);
        },
        error:function(e)
        {

        }
    });
}
function saveAttendance(studentid,courseid,facultyid,sessionid,ondate,ispresent)
{
    //make an ajax call and save the attendance of the student in DB
    $.ajax({
        url:"ajaxhandler/attendanceAJAX.php",
        type:"POST",
        dataType:"json",
        data:{studentid:studentid,courseid:courseid,facultyid:facultyid,sessionid:sessionid,ondate:ondate,ispresent:ispresent,action:"saveattendance"},
        beforeSend:function(e)
        {

        },
        success:function(rv)
        {
        //alert(JSON.stringify(rv));
        //we saved the attendance now lets view them
        if(ispresent=="YES")
        {
            $("#student"+studentid).removeClass('absentcolor');
           $("#student"+studentid).addClass('presentcolor');
        }
        else{
            $("#student"+studentid).removeClass('presentcolor');
            $("#student"+studentid).addClass('absentcolor');
        }
        },
        error:function(e)
        {
            alert("OOPS!");
        }
    });
}

function downloadCSV(sessionid,classid,facid)
{
    //make ajax call to fetch from server
    $.ajax({
        url:"ajaxhandler/attendanceAJAX.php",
        type:"POST",
        dataType:"json",
        data:{sessionid:sessionid,classid:classid,facid:facid,action:"downloadReport"},
        beforeSend:function(e)
        {

        },
        success:function(rv)
        {
       //alert(JSON.stringify(rv));
       //lets download the file
       let x=`
       <object data=${rv['filename']} type="text/html" target="_parent"></object>       
       `;
       $("#divReport").html(x);
        },
        error:function(e)
        {
            alert("OOPS!");
        }
    });
}
//as soon as the page is done loading do the following
$(function(e)
{
    $(document).on("click","#btnLogout",function(ee)
    {
          $.ajax(
            {
                url:"ajaxhandler/logoutAjax.php",
                type:"POST",
                dataType:"json",
                data:{id:1},
                beforeSend:function(e){

                },
                success:function(e){
                    document.location.replace("login.php");
                },
                error:function(e){
                    alert("Something went wrong!");
                }
            }
          );
    });
    loadSessions();
    $(document).on("change","#ddlclass",function(e)
    {
        $("#classlistarea").html(``);
        $("#classdetailsarea").html(``);
        $("#studentlistarea").html(``);
        let si=$("#ddlclass").val();
        if(si!=-1)
        {
            //alert(si);
            let sessionid=si;
            let facid=$("#hiddenFacId").val();
            fetchFacultyCourses(facid,sessionid);
        }     
    });
    $(document).on("click",".classcard",function(e){
         //what is the underlyning object?
         let classobject=$(this).data('classobject');
         //remember the classid
         $("#hiddenSelectedCourseID").val(classobject['id']);
         //alert(JSON.stringify(classobject));
         let x=getClassdetailsAreaHTML(classobject);
         $("#classdetailsarea").html(x);
         //now fill the studentlist 
         //for session and course
         let sessionid=$("#ddlclass").val();//sorry for the name
         let classid=classobject['id'];
         let facid=$("#hiddenFacId").val();
         let ondate=$("#dtpondate").val();
         if(sessionid!=-1)
         {
            //here we want to fetch the student list along with the
            //attendance on current date. For that we also have to
            //pass facid and ondate to the following function
            fetchStudentList(sessionid,classid,facid,ondate);
         }
        
    });
    $(document).on("click",".cbpresent",function(e){
      //say get the check state
      let ispresent=this.checked;     
      //ispresent is a boolean value, convert it to YES NO
      if(ispresent)
      {
        ispresent="YES";
      } 
      else{
        ispresent="NO";
      }
      //alert(ispresent);

      //if we want to save the attendance we need to know
      //studentid=??, ispresent,courseid,facultyid,sessionid
      //date
      let studentid=$(this).data('studentid');
      let courseid=$("#hiddenSelectedCourseID").val();
      let facultyid= $("#hiddenFacId").val();
      let sessionid=$("#ddlclass").val();
      let ondate=$("#dtpondate").val();
      //alert(studentid+" "+courseid+" "+facultyid+" "+sessionid+" "+ondate);
      saveAttendance(studentid,courseid,facultyid,sessionid,ondate,ispresent);
    });
    $(document).on("change","#dtpondate",function(e){
      //alert($("#dtpondate").val());
      //now load the studentlist on this day
         let sessionid=$("#ddlclass").val();//sorry for the name
         let classid=$("#hiddenSelectedCourseID").val();
         let facid=$("#hiddenFacId").val();
         let ondate=$("#dtpondate").val();
         if(sessionid!=-1)
         {
            //here we want to fetch the student list along with the
            //attendance on current date. For that we also have to
            //pass facid and ondate to the following function
            fetchStudentList(sessionid,classid,facid,ondate);
         }
    });
    $(document).on("click","#btnReport",function(){
        alert("CLICKED");
        //send the session course faculty to server
        //and get a csv filename in return
        //server will create the CSV file which will contain
        //the report
        let sessionid=$("#ddlclass").val();//sorry for the name
        let classid=$("#hiddenSelectedCourseID").val();
        let facid=$("#hiddenFacId").val();
        downloadCSV(sessionid,classid,facid);
    })
});