// script.js
document.addEventListener("DOMContentLoaded", () => {
    const timetableBody = document.getElementById("timetable-body");
    const addRowButton = document.getElementById("add-row");
    const saveButton = document.getElementById("save-timetable");

    // Add a new row to the timetable
    addRowButton.addEventListener("click", () => {
        const newRow = document.createElement("tr");

        // Time column
        const timeCell = document.createElement("td");
        timeCell.textContent = "Enter Time";
        timeCell.contentEditable = true;
        newRow.appendChild(timeCell);

        // Weekday columns
        for (let i = 0; i < 5; i++) {
            const cell = document.createElement("td");
            cell.classList.add("editable");
            cell.contentEditable = true;
            newRow.appendChild(cell);
        }

        timetableBody.appendChild(newRow);
    });

    // Save timetable data
    saveButton.addEventListener("click", () => {
        const timetableData = [];
        const rows = timetableBody.querySelectorAll("tr");

        rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            const rowData = Array.from(cells).map((cell) => cell.textContent);
            timetableData.push(rowData);
        });

        console.log("Timetable Data Saved:", timetableData);
        alert("Timetable data has been saved to the console!");
    });
});
