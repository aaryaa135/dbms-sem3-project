// Function to save the timetable data
const saveTimetable = () => {
    const table = document.getElementById("timetable");
    const data = [];
    for (let i = 1; i < table.rows.length; i++) {
      const row = [];
      for (let j = 1; j < table.rows[i].cells.length; j++) {
        row.push(table.rows[i].cells[j].innerText.trim());
      }
      data.push(row);
    }
    localStorage.setItem("timetable", JSON.stringify(data));
    alert("Timetable saved!");
  };
  
  // Function to load the timetable data
  const loadTimetable = () => {
    const savedData = JSON.parse(localStorage.getItem("timetable"));
    if (savedData) {
      const table = document.getElementById("timetable");
      for (let i = 0; i < savedData.length; i++) {
        for (let j = 0; j < savedData[i].length; j++) {
          table.rows[i + 1].cells[j + 1].innerText = savedData[i][j];
        }
      }
      alert("Timetable loaded!");
    }
  };
  
  // Function to reset the timetable
  const resetTimetable = () => {
    if (confirm("Are you sure you want to reset the timetable?")) {
      localStorage.removeItem("timetable");
      location.reload();
    }
  };
  
  // Function to check if all cells are filled before saving
  const validateTimetable = () => {
    const table = document.getElementById("timetable");
    let isValid = true;
    for (let i = 1; i < table.rows.length; i++) {
      for (let j = 1; j < table.rows[i].cells.length; j++) {
        if (table.rows[i].cells[j].innerText.trim() === "") {
          isValid = false;
          break;
        }
      }
    }
  
    if (!isValid) {
      alert("Please fill in all cells before saving.");
    } else {
      saveTimetable();
    }
  };
  
  // Function to handle auto-saving after an edit
  const autoSave = () => {
    saveTimetable();
  };
  
  // Attach event listeners to save and reset buttons
  document.getElementById("saveButton").addEventListener("click", validateTimetable);
  document.getElementById("resetButton").addEventListener("click", resetTimetable);
  
  // Auto save when content of any cell changes
  const table = document.getElementById("timetable");
  table.addEventListener("input", autoSave);
  
  // Load timetable data on page load
  window.addEventListener("DOMContentLoaded", loadTimetable);
  