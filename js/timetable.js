$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var recipient = button.data('whatever') 
    var modal = $(this)
    modal.find('.modal-title').text("Add New Class!")
    modal.find('.modal-body input').val(recipient)
  })
  
  $('#exampleModal1').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    var recipient = button.data('whatever') 
    var modal = $(this)
    modal.find('.modal-title').text("Remove Class!")
    modal.find('.modal-body input').val(recipient)
  })
  
  var idmanager ={
      "Monday":0,
      "Tuesday":0,
      "Wednesday":0,
      "Thrusday":0,
      "Friday":0
  
  }
  document.getElementById("addme").addEventListener("click",function(){
  
      var stime=document.getElementById("stime").value;
      var time=document.getElementById("time").value;
      var venue=document.getElementById("venue").value;
      var course=document.getElementById("course").value;
      var c_color=document.getElementById("c_color").value;
      var faculty=document.getElementById("faculty").value;
      var day=document.getElementById("whichday").value;
  
      var div = document.createElement("span");
      div.style.padding="10px"
  
      var node = document.createElement("span");               
      var textnode = document.createTextNode(course);
      node.appendChild(textnode);  
      node.style.fontSize="22px"               
      div.appendChild(node);  
  
  
      var node1 = document.createElement("span");               
      var textnode1 = document.createTextNode(" "+venue);         
      node1.appendChild(textnode1);     
      node1.style.fontSize="19px"            
      div.appendChild(node1); 
  
      let node2 = document.createElement("p");               
      let textnode2 = document.createTextNode(faculty);        
      node2.appendChild(textnode2);
      node2.style.fontSize="15px"                  
      div.appendChild(node2);   
      stime=Number(stime)
      time=Number(time)
      i=Number(idmanager[day])
  
      //Check a element is present on adjacent or same place.
      if( ((11-stime+time)>0) && ((5>stime && (6-stime-time)>0) || (stime>5))){
          div.id=day[0]+i
          div.style.position="absolute";
          div.className += day
          div.style.background=c_color; 
          div.style.marginTop=stime*75+"px"; 
          div.style.height=time*75+"px";  
          document.getElementById(day).appendChild(div);
          document.getElementById("iclose").click();
      }
      else{
          alert("Problem Fixing Class To Table!");
      }	
  });
  
  document.getElementById("remove").addEventListener("click",function(){
      var whichday1=document.getElementById("whichday1").value;
      var element =document.getElementById("element").value;
      try{
      document.querySelector("."+whichday1+":nth-of-type(n+"+element+")").remove();}
      catch(err){
      alert("Problem Deleting Component");
      }
      document.getElementById("iiclose").click();
  })