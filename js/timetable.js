// script.js

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const saveBtn = document.getElementById("save-btn");
    const timetable = document.getElementById("timetable");
    let isLoggedIn = false;

    // Add data-label attributes for mobile view
    const addDataLabels = () => {
        const headers = document.querySelectorAll("#timetable thead th");
        const rows = document.querySelectorAll("#timetable tbody tr");

        rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            cells.forEach((cell, index) => {
                cell.setAttribute("data-label", headers[index].innerText);
            });
        });
    };

    // Mock login functionality
    loginBtn.addEventListener("click", () => {
        const username = prompt("Enter username:");
        const password = prompt("Enter password:");
        if (username === "koshish" && password === "juit") {
            isLoggedIn = true;
            toggleEditMode(true);
            alert("Login successful!");
        } else {
            alert("Invalid credentials!");
        }
    });

    logoutBtn.addEventListener("click", () => {
        isLoggedIn = false;
        toggleEditMode(false);
        alert("Logged out!");
    });

    saveBtn.addEventListener("click", () => {
        const data = [];
        document.querySelectorAll("#timetable tbody tr").forEach((row) => {
            const rowData = [];
            row.querySelectorAll("td").forEach((cell) => {
                rowData.push(cell.innerText);
            });
            data.push(rowData);
        });

        localStorage.setItem("timetableData", JSON.stringify(data));
        alert("Timetable saved!");
    });

    // Load saved data from localStorage
    const loadTimetableData = () => {
        const savedData = JSON.parse(localStorage.getItem("timetableData"));
        if (savedData) {
            const rows = document.querySelectorAll("#timetable tbody tr");
            savedData.forEach((rowData, i) => {
                if (rows[i]) {
                    const cells = rows[i].querySelectorAll("td");
                    rowData.forEach((text, j) => {
                        if (cells[j]) cells[j].innerText = text;
                    });
                }
            });
        }
    };

    // Toggle edit mode
    const toggleEditMode = (enabled) => {
        document.querySelectorAll("#timetable tbody td").forEach((cell) => {
            cell.contentEditable = enabled;
        });
        saveBtn.style.display = enabled ? "inline-block" : "none";
        loginBtn.style.display = enabled ? "none" : "inline-block";
        logoutBtn.style.display = enabled ? "inline-block" : "none";
    };

    // Initial load
    loadTimetableData();
    addDataLabels();
    toggleEditMode(false);
});
