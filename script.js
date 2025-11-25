// ===== Helper: feedback list read / write =====
function getFeedbackList() {
    return JSON.parse(localStorage.getItem("feedbackList") || "[]");
}

function saveFeedbackList(list) {
    localStorage.setItem("feedbackList", JSON.stringify(list));
}

// ===== STUDENT LOGIN PAGE =====
function handleStudentLogin(event) {
    event.preventDefault();

    const name = document.querySelector('input[name="name"]').value.trim();
    const course = document.querySelector('input[name="course"]').value.trim();
    const semester = document.querySelector('select[name="semester"]').value;
    const roll = document.querySelector('input[name="roll"]').value.trim();

    if (!name || !course || !semester || !roll) {
        alert("Please fill all details.");
        return false;
    }

    const student = { name, course, semester, roll };
    localStorage.setItem("currentStudent", JSON.stringify(student));

    window.location.href = "student-dashboard.html";
    return false;
}

// ===== FEEDBACK FORM PAGE =====
function handleFeedbackSubmit(event) {
    event.preventDefault();

    const student = JSON.parse(localStorage.getItem("currentStudent") || "{}");

    // Teacher + "Other" handling
    let teacher = document.querySelector('select[name="teacher"]').value;
    if (teacher === "Other") {
        const otherName = document.getElementById("otherTeacherInput").value.trim();
        if (!otherName) {
            alert("Please enter teacher name.");
            return false;
        }
        teacher = otherName;
    }

    const subject = document.querySelector('input[name="subject"]').value.trim();
    const ratingEl = document.querySelector('input[name="rate"]:checked');
    const feedbackText = document.querySelector('textarea[name="feedback"]').value.trim();

    if (!teacher || !subject || !ratingEl || !feedbackText) {
        alert("Please complete the form before submitting.");
        return false;
    }

    const record = {
        studentName: student.name,
        roll: student.roll,
        course: student.course,
        semester: student.semester,
        teacher: teacher,
        subject: subject,
        rating: ratingEl.value,
        feedback: feedbackText,
        submittedAt: new Date().toLocaleString()
    };

    const list = getFeedbackList();
    list.push(record);
    saveFeedbackList(list);

    event.target.reset();
    window.location.href = "thankyou.html";
    return false;
}

// ===== ADMIN LOGIN PAGE =====
function adminLogin(event) {
    event.preventDefault();

    const user = document.getElementById("adminUser").value.trim();
    const pass = document.getElementById("adminPass").value.trim();

    if (user === "rbmi1996" && pass === "rbmign1996") {
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid username or password.");
    }
    return false;
}

// ===== ADMIN DASHBOARD PAGE =====
function loadAdminTable() {
    const tbody = document.getElementById("adminFeedbackBody");
    if (!tbody) return;

    const list = getFeedbackList();
    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11">No feedback submitted yet.</td></tr>';
        return;
    }

    list.forEach((fb, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${fb.studentName || "-"}</td>
            <td>${fb.roll || "-"}</td>
            <td>${fb.course || "-"}</td>
            <td>${fb.semester || "-"}</td>
            <td>${fb.teacher}</td>
            <td>${fb.subject}</td>
            <td>${fb.rating}</td>
            <td>${fb.feedback}</td>
            <td>${fb.submittedAt}</td>
            <td>
                <button onclick="deleteFeedback(${index})"
                    style="padding:6px 12px; background:#ff4d4d; border:none; border-radius:6px; color:#fff; cursor:pointer;">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Single feedback delete
function deleteFeedback(index) {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    let list = getFeedbackList();
    list.splice(index, 1);
    saveFeedbackList(list);

    loadAdminTable();
    alert("Feedback deleted successfully.");
}
