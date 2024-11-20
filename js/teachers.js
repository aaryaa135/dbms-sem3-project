function changeInfo(teacherId) {
    const teacherName = prompt("Enter the new teacher name:");
    const teacherSubject = prompt("Enter the new subject:");
    const teacherEmail = prompt("Enter the new email:");
    const teacherPhone = prompt("Enter the new phone number:");

    if (teacherName && teacherSubject && teacherEmail && teacherPhone) {
        document.getElementById(teacherId).querySelector('h2 span').textContent = teacherName;
        document.getElementById(teacherId).querySelector('p:nth-of-type(1)').textContent = `Subject: ${teacherSubject}`;
        document.getElementById(teacherId).querySelector('p:nth-of-type(2)').textContent = `Email: ${teacherEmail}`;
        document.getElementById(teacherId).querySelector('p:nth-of-type(3)').textContent = `Phone: ${teacherPhone}`;
    }
}
