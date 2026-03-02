//LOGIN SYSTEM////

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

/* REGISTER *//////////
function registerUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm_password").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  let users = getUsers();

  if (users.some(u => u.username === username)) {
    alert("Username already taken!");
    return;
  }

  users.push({ username, password });
  saveUsers(users);

  alert("Account registered successfully!");
  window.location.href = "loginpage.html";
}

/* LOGIN */
function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const users = getUsers();
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    document.getElementById("error").innerText =
      "Invalid username or password";
    return;
  }

  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("currentUser", username);
  window.location.href = "studentform.html";
}

/* AUTH CHECK */
function checkAuth(requiredRole = null) {
  const loggedIn = localStorage.getItem("loggedIn");
  const role = localStorage.getItem("currentRole");

  if (loggedIn !== "true") {
    window.location.href = "loginpage.html";
    return;
  }

  if (requiredRole && role !== requiredRole) {
    alert("Access denied.");
    window.location.href = "loginpage.html";
  }
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentRole");
  window.location.href = "Loginpage.html";
}

//SHOW CURRENT USER
function loadCurrentUser() {
  const user = localStorage.getItem("currentUser");
  const label = document.getElementById("currentUserLabel");

  if (label && user) {
    label.textContent = user;
  }
}

/* =========================
   SIDEBAR TOGGLE
   ========================= */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  sidebar.classList.toggle("collapsed");
}

/////////////////////////////////////////////////////////////////////

// Get students from localStorage
function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

// Save students to localStorage
function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

//REGISTER STUDENT

function registerStudent() {
  let students = getStudents();

  let student = {
    id: document.getElementById("studentId").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    grade: document.getElementById("gradeSection").value
  };

  if (!student.id || !student.firstName || !student.lastName || !student.grade) {
    alert("Please fill in all fields.");
    return;
  }

  students.push(student);
  saveStudents(students);

  alert("Student registered successfully!");

  // Clear form
  document.getElementById("studentId").value = "";
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("gradeSection").value = "";
}

//LOAD STUDENTS

function loadStudentsTable() {
  let students = getStudents();
  let table = document.getElementById("studentTable");

  if (!table) return;

  table.innerHTML = "";

  if (students.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="4">No students registered yet.</td>
      </tr>
    `;
    return;
  }

  students.forEach((s, index) => {
    let row = `
      <tr>
        <td>${s.studentNo || s.id}</td>
        <td>${s.name || "No Name"}</td>
        <td>${s.gradeLevel || ""} - ${s.section || ""}</td>
        <td>
          <button onclick="addEntry('${s.studentNo || s.id}')">Add Status</button>
          <button onclick="viewRecords('${s.username}')">View</button>
          <button onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

//DELETE STUDENT

function deleteStudent(index) {
  let students = getStudents();

  if (!confirm("Delete this student?")) return;

  students.splice(index, 1);
  saveStudents(students);
  loadStudentsTable();
}

//ADD STATUS

function addEntry(studentId) {
  localStorage.setItem("selectedStudent", studentId);
  window.location.href = "entry.html";
}

function viewRecords(studentId) {
  localStorage.setItem("selectedStudent", studentId);
  window.location.href = "record.html";
}

//SAVE STATUS

function saveVisit() {
  let records = JSON.parse(localStorage.getItem("records")) || [];

  let record = {
  recordId: Date.now(), // ✅ REQUIRED
  studentId: document.getElementById("studentId").value,
  date: document.getElementById("visitDate").value,
  temp: document.getElementById("temp").value,
  pr: document.getElementById("pr").value,
  rr: document.getElementById("rr").value,
  o2: document.getElementById("o2").value,
  pain: document.getElementById("pain").value,
  complaint: document.getElementById("complaint").value,
  intervention: document.getElementById("intervention").value,
  status: "Incomplete"
};

  if (!record.studentId || !record.date || !record.complaint) {
    alert("Please fill in required fields.");
    return;
  }

  records.push(record);
  localStorage.setItem("records", JSON.stringify(records));

  alert("Clinic entry saved successfully!");

  // Back to student page
  window.location.href = "students.html";
}

//LOAD RECORDS

function formatDateTime(dateString) {
  const date = new Date(dateString);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 || 12;

  return `${month}/${day}/${year} - ${formattedHour}:${minutes} ${ampm}`;
}

function loadRecords() {
  let records = JSON.parse(localStorage.getItem("records")) || [];
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let table = document.getElementById("recordsTable");

  let selectedStudentId = localStorage.getItem("selectedStudent");
  if (!table || !selectedStudentId) return;

  table.innerHTML = "";

  let student = students.find(s => 
  String(s.studentNo || s.id) === String(selectedStudentId)
);

let studentName = student
  ? student.name
  : selectedStudentId;

let grade = student
  ? `${student.gradeLevel || ""} - ${student.section || ""}`
  : "-";

  let studentRecords = records.filter(r => r.studentId === selectedStudentId);

  if (studentRecords.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="6">No records for ${studentName}</td>
      </tr>
    `;
    return;
  }

  studentRecords.forEach(r => {
    let status = r.status || "Incomplete";

if (r.status === "Complete" && r.completedAt) {
  status += `<br><small>${r.completedAt}</small>`;
}
    table.innerHTML += `
      <tr>
        <td>${formatDateTime(r.date)}</td>
        <td>${studentName}</td>
        <td>${grade}</td>
        <td>${r.complaint}</td>
        <td>${status}</td>
        <td>
          <button type="button" class="btn-view"
            onclick="viewRecord('${r.recordId}')">
            View
          </button>
        </td>
      </tr>
    `;
  });
}

//LOAD STUDENT MEDICAL INFO//
function loadStudentMedicalInfo() {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let selectedStudentId = localStorage.getItem("selectedStudent");

  let student = students.find(s =>
    s.username === selectedStudentId
  );

  if (!student) {
    alert("Student not found.");
    return;
  }

  document.getElementById("edit_name").value = student.name || "";
  document.getElementById("edit_studentNo").value = student.studentNo || "";
  document.getElementById("edit_gradeLevel").value = student.gradeLevel || "";
  document.getElementById("edit_section").value = student.section || "";
  document.getElementById("edit_sex").value = student.sex || "";
  document.getElementById("edit_age").value = student.age || "";
  document.getElementById("edit_birthDate").value = student.birthDate || "";
  document.getElementById("edit_address").value = student.address || "";
  document.getElementById("edit_guardian").value = student.guardian || "";
  document.getElementById("edit_contact").value = student.contact || "";

  document.querySelectorAll(".edit-ailment").forEach(cb => {
    cb.checked = student.ailments?.includes(cb.value);
  });
}

//NURSE CAN EDIT

function enableEditMode() {
  document.querySelectorAll(".medical-grid input")
    .forEach(input => input.disabled = false);

  document.querySelectorAll(".edit-ailment")
    .forEach(cb => cb.disabled = false);

  document.getElementById("saveMedicalBtn").style.display = "inline-block";
}

//VIEW/EDIT RECORD

function viewRecord(recordId) {
  localStorage.setItem("selectedRecord", recordId);
  window.location.href = "viewrecord.html";
}
function loadSelectedRecord() {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  const recordId = localStorage.getItem("selectedRecord");

  if (!recordId) {
    alert("No record selected.");
    return;
  }

  const r = records.find(x => String(x.recordId) === String(recordId));

  if (!r) {
    alert("Record not found.");
    return;
  }

  const visitDate = document.getElementById("visitDate");
  const studentId = document.getElementById("studentId");
  const temp = document.getElementById("temp");
  const pr = document.getElementById("pr");
  const rr = document.getElementById("rr");
  const o2 = document.getElementById("o2");
  const pain = document.getElementById("pain");
  const complaint = document.getElementById("complaint");
  const intervention = document.getElementById("intervention");
  const status = document.getElementById("status");

  if (!visitDate || !studentId) return;

  visitDate.value = r.date;
  studentId.value = r.studentId;
  temp.value = r.temp || "";
  pr.value = r.pr || "";
  rr.value = r.rr || "";
  o2.value = r.o2 || "";
  pain.value = r.pain || "";
  complaint.value = r.complaint || "";
  intervention.value = r.intervention || "";
  status.value = r.status || "Incomplete";
}
function updateRecord() {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  const recordId = localStorage.getItem("selectedRecord");

  const i = records.findIndex(r => String(r.recordId) === String(recordId));
  if (i === -1) return;

  const visitDate = document.getElementById("visitDate");
  const temp = document.getElementById("temp");
  const pr = document.getElementById("pr");
  const rr = document.getElementById("rr");
  const o2 = document.getElementById("o2");
  const pain = document.getElementById("pain");
  const complaint = document.getElementById("complaint");
  const intervention = document.getElementById("intervention");
  const status = document.getElementById("status");

let completedTime = records[i].completedAt || "";

if (status.value === "Complete" && !records[i].completedAt) {
  const now = new Date();

  const datePart = now.toLocaleDateString("en-PH");
  const timePart = now.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  completedTime = `${datePart} - ${timePart}`;
}

  records[i] = {
    ...records[i],
    date: visitDate.value,
    temp: temp.value,
    pr: pr.value,
    rr: rr.value,
    o2: o2.value,
    pain: pain.value,
    complaint: complaint.value,
    intervention: intervention.value,
    status: status.value,
    completedAt: completedTime
  };

  localStorage.setItem("records", JSON.stringify(records));

  alert("Clinic visit updated successfully!");
  window.location.href = "record.html";
}

//DELETE RECORD

function deleteRecord() {
  const recordId = localStorage.getItem("selectedRecord");
  const records = JSON.parse(localStorage.getItem("records")) || [];

  console.log("DELETE CLICKED");
  console.log("selectedRecord =", recordId);
  console.log("records =", records);

  if (!recordId) {
    alert("No record selected.");
    return;
  }

  const index = records.findIndex(
    r => String(r.recordId) === String(recordId)
  );

  if (index === -1) {
    alert("Record not found.");
    return;
  }

  if (!confirm("Are you sure you want to delete this clinic visit?")) return;

  records.splice(index, 1);
  localStorage.setItem("records", JSON.stringify(records));
  localStorage.removeItem("selectedRecord");

  alert("Clinic visit deleted successfully!");
  window.location.href = "record.html";
}

//DASHBOARD

function loadDashboard() {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let records = JSON.parse(localStorage.getItem("records")) || [];

  // Total Students
  let totalStudents = document.getElementById("totalStudents");
  if (totalStudents) {
    totalStudents.textContent = students.length;
  }

  // Total Clinic Visits
  let totalRecords = document.getElementById("totalRecords");
  if (totalRecords) {
    totalRecords.textContent = records.length;
  }

  // Today's Visits
  let todayVisits = document.getElementById("todayVisits");
  if (todayVisits) {
    let today = new Date().toISOString().split("T")[0];
    let countToday = records.filter(r => r.date.startsWith(today)).length;
    todayVisits.textContent = countToday;
  }
}

//CLINIC VISIT

function loadRecentVisits() {
  let records = JSON.parse(localStorage.getItem("records")) || [];
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let table = document.getElementById("recentVisits");

  if (!table) return;

  table.innerHTML = "";

  if (records.length === 0) {
    table.innerHTML = `
      <tr>
        <td>—</td>
        <td>—</td>
        <td>—</td>
      </tr>
    `;
    return;
  }

  // show only 3 visits
  let recent = records.slice(-3).reverse();

  recent.forEach((r) => {
    let student = students.find(s => s.id === r.studentId);
    let name = student ? student.firstName + " " + student.lastName : r.studentId;

    let row = `
      <tr>
        <td>${r.date}</td>
        <td>${name}</td>
        <td>${r.complaint}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

//SIDEBAR ACTIVE LINK
function setActiveSidebarLink() {
  const currentPage = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".sidebar nav a");

  links.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// SEARCH BAR ID OR NAME//
function filterStudents() {
  const input = document.getElementById("studentSearch");
  if (!input) return;

  const search = input.value.toLowerCase().trim();
  const rows = document.querySelectorAll("#studentTable tr");

  rows.forEach(row => {
    const studentId = row.cells[0]?.textContent.toLowerCase() || "";
    const name = row.cells[1]?.textContent.toLowerCase() || "";

    row.style.display =
      studentId.includes(search) || name.includes(search)
        ? ""
        : "none";
  });
}

//SAVESTUDENT FORM//

function saveStudentForm() {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let currentUser = localStorage.getItem("currentUser");

  let studentIndex = students.findIndex(s =>
    s.username === currentUser
  );

  let ailments = [];
  document.querySelectorAll(".ailment-checkbox:checked")
    .forEach(cb => ailments.push(cb.value));

  let studentData = {
    username: currentUser, // 🔥 LINK TO LOGIN ACCOUNT
    name: document.getElementById("name").value,
    studentNo: document.getElementById("studentNo").value,
    gradeLevel: document.getElementById("gradeLevel").value,
    section: document.getElementById("section").value,
    sex: document.getElementById("sex").value,
    age: document.getElementById("age").value,
    birthDate: document.getElementById("birthDate").value,
    address: document.getElementById("address").value,
    guardian: document.getElementById("guardian").value,
    contact: document.getElementById("contact").value,
    ailments: ailments
  };

  if (studentIndex === -1) {
    students.push(studentData); // first time submit
  } else {
    students[studentIndex] = studentData; // update
  }

  localStorage.setItem("students", JSON.stringify(students));
  alert("Medical form submitted successfully!");
}

//CHECKBOXES
function getCheckedAilments() {
  const checkboxes = document.querySelectorAll(".ailment-checkbox");
  let selected = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      selected.push(cb.value);
    }
  });

  return selected;
}

//LOAD STUDENT FORMS//

function loadStudentFormForStudent() {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let currentUser = localStorage.getItem("currentUser");

  let student = students.find(s =>
    s.username === currentUser
  );

  if (!student) return;

  document.getElementById("name").value = student.name || "";
  document.getElementById("studentNo").value = student.studentNo || "";
  document.getElementById("gradeLevel").value = student.gradeLevel || "";
  document.getElementById("section").value = student.section || "";
  document.getElementById("sex").value = student.sex || "";
  document.getElementById("age").value = student.age || "";
  document.getElementById("birthDate").value = student.birthDate || "";
  document.getElementById("address").value = student.address || "";
  document.getElementById("guardian").value = student.guardian || "";
  document.getElementById("contact").value = student.contact || "";

  document.querySelectorAll(".ailment-checkbox").forEach(cb => {
    cb.checked = student.ailments?.includes(cb.value);
  });
}

//UPDATE THE STUDENT MEDICAL//

function updateMedicalInfo() {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let selectedStudentId = localStorage.getItem("selectedStudent");

  // 🔥 MATCH USING USERNAME (LIKE LOAD FUNCTION)
  let index = students.findIndex(s =>
    s.username === selectedStudentId
  );

  if (index === -1) {
    alert("Student not found.");
    return;
  }

  let ailments = [];
  document.querySelectorAll(".edit-ailment:checked")
    .forEach(cb => ailments.push(cb.value));

  students[index] = {
    ...students[index],
    name: document.getElementById("edit_name").value,
    studentNo: document.getElementById("edit_studentNo").value,
    gradeLevel: document.getElementById("edit_gradeLevel").value,
    section: document.getElementById("edit_section").value,
    sex: document.getElementById("edit_sex").value,
    age: document.getElementById("edit_age").value,
    birthDate: document.getElementById("edit_birthDate").value,
    address: document.getElementById("edit_address").value,
    guardian: document.getElementById("edit_guardian").value,
    contact: document.getElementById("edit_contact").value,
    ailments: ailments
  };

  localStorage.setItem("students", JSON.stringify(students));

  alert("Medical information updated successfully!");
  location.reload();
}

//NURSE LOGIN POPUP ALERT

function openNurseModal() {
  document.getElementById("nurseModal").style.display = "flex";
}

function closeNurseModal() {
  document.getElementById("nurseModal").style.display = "none";
}

function authenticateNurse() {
  const username = document.getElementById("nurseUser").value;
  const password = document.getElementById("nursePass").value;

  const defaultUser = "admin";
  const defaultPass = "12345";

  if (username === defaultUser && password === defaultPass) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", "Admin");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid Nurse/Admin credentials.");
  }
}