let students = [];

window.addEventListener('load', function() {
  loadData();
  initApp();
  toggleBottomNav(); // Call toggleBottomNav on load
});

window.addEventListener('resize', toggleBottomNav);

function loadData() {
  try {
    students = JSON.parse(localStorage.getItem('students')) || [];
  } catch (error) {
    console.error('Error loading data:', error);
    alert('Failed to load data. Using empty dataset.');
    students = [];
  }
}

function saveData() {
  try {
    localStorage.setItem('students', JSON.stringify(students));
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Failed to save data. Please try again.');
  }
}

function showAddStudent() {
  hideAllSections();
  document.getElementById("add-student").style.display = "block";
}

function showStudentList() {
  hideAllSections();
  document.getElementById("student-list").style.display = "block";
  updateStudentList();
}

function showMarkAttendance() {
  hideAllSections();
  document.getElementById("mark-attendance").style.display = "block";
  document.getElementById("attendance-date").valueAsDate = new Date();
  document.getElementById("attendance-period").value = 'full';
  updateMarkAttendance();
}

function showAttendanceView() {
  hideAllSections();
  document.getElementById("view-attendance").style.display = "block";
  document.getElementById("view-attendance-date").valueAsDate = new Date();
  updateAttendanceView();
}

function showReports() {
  hideAllSections();
  document.getElementById("reports").style.display = "block";
}

function hideAllSections() {
  const sections = ["add-student", "student-list", "mark-attendance", "view-attendance", "reports"];
  sections.forEach(section => {
    document.getElementById(section).style.display = "none";
  });
}

function addStudent() {
  const rollNumber = document.getElementById("student-roll-number").value.trim();
  const name = document.getElementById("student-name").value.trim();
  const phone = document.getElementById("student-phone").value.trim();
  const whatsapp = document.getElementById("student-whatsapp").value.trim();

  const studentData = { rollNumber, name, phone, whatsapp };
  const errors = validateStudentData(studentData);

  if (errors.length > 0) {
      showMessage(errors.join(" "), "error");
      return;
  }

  const existingStudentIndex = students.findIndex(student => student.rollNumber === rollNumber);
  
  if (existingStudentIndex !== -1 && document.getElementById("add-edit-student-btn").textContent === 'Add Student') {
      showMessage("A student with this roll number already exists.", "error");
      return;
  }

  // Use a custom popup for verification
  showVerificationPopup(studentData, () => {
      students.push({ ...studentData, attendance: {} });
      showMessage("Student added successfully.", "success");
      saveData();
      clearStudentForm();
      updateStudentList();
  });
}

function showVerificationPopup(studentData, onConfirm) {
  const overlay = document.getElementById('overlay');
  const confirmPopup = document.createElement('div');
  confirmPopup.className = 'confirm-popup';
  confirmPopup.innerHTML = `
      <h3>Confirm Student Details</h3>
      <p>Please verify the following details:</p>
      <ul>
          <li>Roll Number: ${studentData.rollNumber}</li>
          <li>Name: ${studentData.name}</li>
          <li>Phone: ${studentData.phone}</li>
          <li>WhatsApp: ${studentData.whatsapp || 'Not provided'}</li>
      </ul>
      <div class="popup-buttons">
          <button id="confirm-add">Confirm</button>
          <button id="cancel-add">Cancel</button>
      </div>
  `;

  overlay.style.display = 'block';
  document.body.appendChild(confirmPopup);

  document.getElementById('confirm-add').addEventListener('click', () => {
      onConfirm();
      closePopup();
  });

  document.getElementById('cancel-add').addEventListener('click', closePopup);
}

function fillWhatsAppNumber() {
  const phoneNumber = document.getElementById("student-phone").value;
  const whatsappNumber = document.getElementById("student-whatsapp");
  const sameAsPhone = document.getElementById("same-as-phone");
  
  // Validate the phone number before enabling the checkbox
  if (!/^\d{10}$/.test(phoneNumber)) {
    sameAsPhone.checked = false; // Reset the checkbox
    whatsappNumber.disabled = false; // Enable WhatsApp field
    showMessage("Please enter a valid 10-digit phone number.", "error");
    return;
  }

  if (sameAsPhone.checked) {
      whatsappNumber.value = phoneNumber;
      whatsappNumber.disabled = true;
  } else {
      whatsappNumber.disabled = false;
  }
}

function showMessage(message, type = "info") {
  const overlay = document.getElementById('overlay');
  const popup = document.createElement('div');
  popup.className = 'confirm-popup';
  popup.innerHTML = `
    <h3>${type === 'error' ? 'Error' : 'Success'}</h3>
    <p>${message}</p>
    <div class="popup-buttons">
      <button id="close-message">Close</button>
    </div>
  `;

  overlay.style.display = 'block';
  document.body.appendChild(popup);

  document.getElementById('close-message').addEventListener('click', closePopup);
}

function handleError(error) {
  console.error('An error occurred:', error);
  showMessage('An error occurred. Please try again.', 'error');
}

function validateStudentData(student) {
  const errors = [];
  if (!/^\d+$/.test(student.rollNumber)) errors.push("Roll number must be numeric.");
  if (student.name.length < 2) errors.push("Name must be at least 2 characters long.");
  if (!/^\d{10}$/.test(student.phone)) errors.push("Phone number must be 10 digits.");
  if (student.whatsapp && !/^\d{10}$/.test(student.whatsapp)) errors.push("WhatsApp number must be 10 digits.");
  return errors;
}

function clearStudentForm() {
  ["student-roll-number", "student-name", "student-phone", "student-whatsapp"].forEach(id => {
      document.getElementById(id).value = "";
  });
  document.getElementById("same-as-phone").checked = false;
  document.getElementById("student-whatsapp").disabled = false;
  document.getElementById("add-edit-student-btn").textContent = "Add Student";
  document.getElementById("add-edit-student-btn").onclick = addStudent;
}

function updateStudentList(studentsToShow = students) {
  const tableBody = document.getElementById("student-table").getElementsByTagName("tbody")[0];
  const studentListDiv = document.getElementById("student-list");
  tableBody.innerHTML = "";

  if (studentsToShow.length === 0) {
    const messageRow = document.createElement("tr");
    const messageCell = document.createElement("td");
    messageCell.colSpan = 4; // Adjust colSpan to 4 
    messageCell.textContent = "No students found.";
    messageCell.style.textAlign = "center";
    messageCell.style.padding = "20px";
    messageRow.appendChild(messageCell);
    tableBody.appendChild(messageRow);

    let messageElement = studentListDiv.querySelector(".no-students-message");
    if (!messageElement) {
      messageElement = document.createElement("p");
      messageElement.className = "no-students-message";
      messageElement.style.color = "red";
      messageElement.style.textAlign = "center";
      studentListDiv.insertBefore(messageElement, studentListDiv.firstChild);
    }
    messageElement.textContent = students.length === 0 ? "No students have been added yet." : "No students match your search.";
  } else {
    const messageElement = studentListDiv.querySelector(".no-students-message");
    if (messageElement) {
      messageElement.remove();
    }

    studentsToShow.forEach(student => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="Roll Number">${student.rollNumber}</td>
        <td data-label="Name">${student.name}</td>
        <td data-label="Phone">${student.phone}</td>
        <td data-label="Actions">
          <button onclick="editStudent('${student.rollNumber}')">Edit</button>
          <button onclick="deleteStudent('${student.rollNumber}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }
}

function searchStudents() {
  const searchText = document.getElementById("search-input").value.trim().toLowerCase();
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchText) ||
    student.rollNumber.toLowerCase().includes(searchText) ||
    student.class.toLowerCase().includes(searchText) ||
    student.section.toLowerCase().includes(searchText)
  );

  updateStudentList(filteredStudents);
}

function editStudent(rollNumber) {
  const student = students.find(s => s.rollNumber === rollNumber);
  if (student) {
      document.getElementById("student-roll-number").value = student.rollNumber;
      document.getElementById("student-name").value = student.name;
      document.getElementById("student-phone").value = student.phone;
      document.getElementById("student-whatsapp").value = student.whatsapp || "";
      
      const addButton = document.getElementById("add-edit-student-btn");
      addButton.textContent = 'Update Student';
      addButton.onclick = () => handleUpdateStudent(rollNumber); // Changed this line
  }
  showAddStudent();
}

function handleUpdateStudent(rollNumber) {
  const updatedRollNumber = document.getElementById("student-roll-number").value.trim();
  const name = document.getElementById("student-name").value.trim();
  const phone = document.getElementById("student-phone").value.trim();
  const whatsapp = document.getElementById("student-whatsapp").value.trim();

  const updatedStudentData = { rollNumber: updatedRollNumber, name, phone, whatsapp };

  const errors = validateStudentData(updatedStudentData);
  if (errors.length > 0) {
    showMessage(errors.join(" "), "error");
    return;
  }

  const existingStudentIndex = students.findIndex(student => student.rollNumber === rollNumber);

  if (existingStudentIndex !== -1) {
    // Verify changes before updating
    showConfirmationPopup(getStudentChanges(students[existingStudentIndex], updatedStudentData), () => {
      // Update the student at the existing index
      students[existingStudentIndex] = { 
        ...updatedStudentData,
        attendance: students[existingStudentIndex].attendance || {}
      };
      showMessage("Student updated successfully.", "success");
      saveData();
      clearStudentForm();
      updateStudentList();
      // Reset the button state back to "Add Student"
      document.getElementById("add-edit-student-btn").textContent = "Add Student";
      document.getElementById("add-edit-student-btn").onclick = addStudent;
    });
  } else {
    showMessage("Student not found.", "error");
  }
}

function getStudentChanges(original, updated) {
  const changes = {};
  for (const key in updated) {
      if (updated[key] !== original[key]) {
          changes[key] = {
              from: original[key],
              to: updated[key]
          };
      }
  }
  return changes;
}

function showConfirmationPopup(changes, onConfirm) {
  const overlay = document.getElementById('overlay');
  const confirmPopup = document.createElement('div');
  confirmPopup.className = 'confirm-popup';
  
  let changesHTML = '<ul>';
  for (const [key, value] of Object.entries(changes)) {
      changesHTML += `<li><strong>${key}:</strong> ${value.from} → ${value.to}</li>`;
  }
  changesHTML += '</ul>';

  confirmPopup.innerHTML = `
      <h3>Confirm Changes</h3>
      <p>Please review the following changes:</p>
      ${changesHTML}
      <div class="popup-buttons">
          <button id="confirm-update">Confirm</button>
          <button id="cancel-update">Cancel</button>
      </div>
  `;
  
  overlay.style.display = 'block';
  document.body.appendChild(confirmPopup);

  document.getElementById('confirm-update').addEventListener('click', () => {
      onConfirm();
      closePopup();
  });

  document.getElementById('cancel-update').addEventListener('click', closePopup);
}

function deleteStudent(rollNumber) {
  if (confirm('Are you sure you want to delete this student?')) {
    students = students.filter(s => s.rollNumber !== rollNumber);
    saveData();
    updateStudentList();
  }
}

function markAttendance(rollNumber, isPresent) {
  const attendanceDate = document.getElementById("attendance-date").value;
  const attendancePeriod = document.getElementById("attendance-period").value;
  const student = students.find(s => s.rollNumber === rollNumber);
  
  if (!student.attendance) student.attendance = {};
  if (!student.attendance[attendanceDate]) {
      student.attendance[attendanceDate] = { morning: null, afternoon: null };
  }
  
  if (attendancePeriod === 'full') {
      student.attendance[attendanceDate].morning = isPresent;
      student.attendance[attendanceDate].afternoon = isPresent;
  } else {
      student.attendance[attendanceDate][attendancePeriod] = isPresent;
  }
  
  const card = document.querySelector(`.attendance-card[data-roll="${rollNumber}"]`);
  if (card) {
      const presentBtn = card.querySelector('.present');
      const absentBtn = card.querySelector('.absent');
      
      presentBtn.classList.toggle('active', isPresent);
      absentBtn.classList.toggle('active', !isPresent);
  }

  saveData();
}

function updateMarkAttendance() {
  const attendanceList = document.getElementById("attendance-list");
  attendanceList.innerHTML = "";
  const attendanceDate = document.getElementById("attendance-date").value;
  const attendancePeriod = document.getElementById("attendance-period").value;
  const searchText = document.getElementById("attendance-search").value.toLowerCase();

  if (students.length === 0) {
    attendanceList.innerHTML = "<p>No students found.</p>";
    return;
  }

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchText) || 
    student.rollNumber.toLowerCase().includes(searchText)
  );

  filteredStudents.forEach(student => {
    const card = document.createElement("div");
    card.className = "attendance-card";
    card.setAttribute('data-roll', student.rollNumber);

    let morningAttendance = student.attendance?.[attendanceDate]?.morning;
    let afternoonAttendance = student.attendance?.[attendanceDate]?.afternoon;

    let isPresent;
    if (attendancePeriod === 'full') {
      isPresent = morningAttendance && afternoonAttendance;
    } else if (attendancePeriod === 'morning') {
      isPresent = morningAttendance;
    } else {
      isPresent = afternoonAttendance;
    }

    // Change this line to display roll number first, followed by the name
    card.innerHTML = `
      <h3>${student.rollNumber}. ${student.name}</h3>
      <div class="attendance-buttons">
        <button class="attendance-btn present ${isPresent === true ? 'active' : ''}" onclick="markAttendance('${student.rollNumber}', true)">P</button>
        <button class="attendance-btn absent ${isPresent === false ? 'active' : ''}" onclick="markAttendance('${student.rollNumber}', false)">A</button>
      </div>
    `;
    attendanceList.appendChild(card);
  });
}

function saveAttendance() {
  const attendanceDate = document.getElementById("attendance-date").value;
  if (!attendanceDate) {
    showMessage("Please select a date.", "error");
    return;
  }

  const attendancePeriod = document.getElementById("attendance-period").value;

  // Check if there are any students
  if (students.length === 0) {
    showMessage("Please add students before marking attendance.", "error");
    return; 
  }

  const absentStudents = students.filter(student => {
    if (attendancePeriod === 'full') {
      return student.attendance[attendanceDate]?.morning === false || student.attendance[attendanceDate]?.afternoon === false;
    } else {
      return student.attendance[attendanceDate]?.[attendancePeriod] === false;
    }
  });

  if (absentStudents.length > 0) {
    const overlay = document.getElementById('overlay');
    const confirmPopup = document.createElement('div');
    confirmPopup.className = 'confirm-popup';
    confirmPopup.innerHTML = `
      <h3>Confirm Absent Students</h3>
      <p>The following students are marked absent for ${attendanceDate} (${attendancePeriod}):</p>
      <ul class="absent-student-list">
        ${absentStudents.map(student => `
          <li>
            <span class="student-name">${student.rollNumber}. ${student.name}</span>
          </li>
        `).join('')}
      </ul>
      <div class="popup-buttons">
        <button id="confirm-save">Confirm and Send Message</button>
        <button id="cancel-save">Cancel</button>
      </div>
    `;
    
    // Show overlay and disable pointer events on main content
    overlay.style.display = 'block';
    document.getElementById('app-container').style.pointerEvents = 'none';
    
    document.body.appendChild(confirmPopup);

    document.getElementById('confirm-save').addEventListener('click', () => {
      saveData();
      sendBatchWhatsAppMessages(absentStudents, attendanceDate, attendancePeriod);
      closePopup();
    });

    document.getElementById('cancel-save').addEventListener('click', closePopup);
  } else {
    saveData();
    showMessage(`Attendance for ${attendanceDate} saved successfully.`, "success");
  }
}

function closePopup() {
  const overlay = document.getElementById('overlay');
  const popup = document.querySelector('.confirm-popup');
  
  // Hide overlay and re-enable pointer events on main content
  overlay.style.display = 'none';
  document.getElementById('app-container').style.pointerEvents = 'auto';
  
  if (popup) {
    document.body.removeChild(popup);
  }
}

function sendBatchWhatsAppMessages(students, attendanceDate, attendancePeriod) {
  let message = "The following students were marked absent on " + attendanceDate + 
                " for the " + attendancePeriod + " period:\n\n";
  
  students.forEach(student => {
    message += student.name + " (Roll No: " + student.rollNumber + ")\n";
  });
  
  message += "\nPlease contact the school administration for any clarifications.";
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');

  // After opening the WhatsApp window, show the success message
  showMessage(`Attendance for ${attendanceDate} saved successfully. Batch message prepared for absent students.`, "success"); 
}

function markAllPresent() {
  const attendanceDate = document.getElementById("attendance-date").value;
  const attendancePeriod = document.getElementById("attendance-period").value;
  
  students.forEach(student => {
      if (!student.attendance) student.attendance = {};
      if (!student.attendance[attendanceDate]) student.attendance[attendanceDate] = { morning: null, afternoon: null };
      
      if (attendancePeriod === 'full') {
          if (student.attendance[attendanceDate].morning !== false) student.attendance[attendanceDate].morning = true;
          if (student.attendance[attendanceDate].afternoon !== false) student.attendance[attendanceDate].afternoon = true;
      } else {
          if (student.attendance[attendanceDate][attendancePeriod] !== false) {
              student.attendance[attendanceDate][attendancePeriod] = true;
          }
      }
  });
  
  updateMarkAttendance();
}

function updateAttendanceView() {
  const tableBody = document.getElementById("attendance-view-table").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";
  const attendanceDate = document.getElementById("view-attendance-date").value;

  if (!attendanceDate) {
    alert("Please select a date to view attendance.");
    return;
  }

  students.forEach(student => {
    const attendance = student.attendance && student.attendance[attendanceDate] ? student.attendance[attendanceDate] : { morning: false, afternoon: false };
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Roll Number">${student.rollNumber}</td>
      <td data-label="Name">${student.name}</td>
      <td data-label="Morning">${attendance.morning ? 'Present' : 'Absent'}</td>
      <td data-label="Afternoon">${attendance.afternoon ? 'Present' : 'Absent'}</td>
    `;
    tableBody.appendChild(row);
  });
}

function generateAttendanceReport() {
  const startDate = document.getElementById("report-start-date").value;
  const endDate = document.getElementById("report-end-date").value;
  
  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  let report = "Roll Number,Name,Date,Morning,Afternoon\n";
  
  students.forEach(student => {
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    while (currentDate <= endDateObj) {
      const date = currentDate.toISOString().split('T')[0];
      const attendance = student.attendance && student.attendance[date] ? student.attendance[date] : { morning: false, afternoon: false };
      
      report += `${student.rollNumber},${student.name},${date},${attendance.morning ? 'Present' : 'Absent'},${attendance.afternoon ? 'Present' : 'Absent'}\n`;
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  const blob = new Blob([report], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance_report_${startDate}_to_${endDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toggleBottomNav() {
  const bottomNav = document.getElementById('bottom-nav');

  // Use media query to determine screen size
  if (window.matchMedia('(max-width: 768px)').matches) {
    bottomNav.style.display = 'flex';
  } else {
    bottomNav.style.display = 'none';
  }
}

function initApp() {
  showMarkAttendance(); 
  document.getElementById("attendance-date").valueAsDate = new Date();
  document.getElementById("view-attendance-date").valueAsDate = new Date();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById("report-start-date").value = today;
  document.getElementById("report-end-date").value = today;
  // Initialize Select2 for the attendance period dropdown
  $(document).ready(function() {
    $('#attendance-period').select2({
      width: '100%', 
      theme: 'bootstrap4' 
    });
  });
}

document.querySelector('.dropbtn').addEventListener('click', function(e) {
  e.stopPropagation();
  document.querySelector('.dropdown-content').style.display = 
    document.querySelector('.dropdown-content').style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', function(e) {
  if (!e.target.matches('.dropbtn')) {
    document.querySelector('.dropdown-content').style.display = 'none';
  }
});

document.getElementById('attendance-period').addEventListener('change', updateMarkAttendance);
document.getElementById('attendance-search').addEventListener('input', updateMarkAttendance);

document.getElementById("delete-all-data").addEventListener("click", function() {
  if (confirm("Are you sure you want to delete all saved data? This action cannot be undone.")) {
    localStorage.removeItem('students');
    students = [];
    updateStudentList(); 
    updateMarkAttendance();
    updateAttendanceView(); 
    alert("All saved data has been deleted.");
  }
});

window.addEventListener('beforeunload', function() {
  saveData();
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("attendance-date").addEventListener('change', updateMarkAttendance);
});

// Initialize the application
initApp();

// Additional helper functions

function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}