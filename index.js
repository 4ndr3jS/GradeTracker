let courses = [];

function loadCourses() {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
}

function saveCourses() {
    localStorage.setItem("courses", JSON.stringify(courses));
}

function saveGoal(value) {
    localStorage.setItem("goalGPA", value);
}

function loadGoal() {
    const input = document.getElementById("goaltarget");
    const saved = parseFloat(localStorage.getItem("goalGPA"));
    if (input && !isNaN(saved)) {
        input.value = saved;
    }
}

function addCourse() {
    const name = document.getElementById("courseName").value.trim();
    const grade = parseFloat(document.getElementById("grade").value);

    if (!name || /\d/.test(name)) {
        alert("Enter a valid course name");
        return;
    }
    if (isNaN(grade) || grade < 1 || grade > 10) {
        alert("Enter a valid grade (1–10)");
        return;
    }

    courses.push({ id: Date.now(), name, grade });

    document.getElementById("courseName").value = "";
    document.getElementById("grade").value = "";

    saveCourses();
    renderAll();
}

function deleteCourse(id) {
    courses = courses.filter(c => c.id !== id);
    saveCourses();
    renderAll();
}

function renderCourses() {
    const list = document.getElementById("coursesList");
    if (!list) return;

    if (courses.length === 0) {
        list.innerHTML = `<div class="emptyState">No courses added yet</div>`;
        return;
    }

    list.innerHTML = courses.map(c => `
        <div class="courseItem">
            <div>${c.name}</div>
            <div>${c.grade}</div>
            <button onclick="deleteCourse(${c.id})" class="deleteButton">Delete</button>
        </div>
    `).join("");
}

function calculateGPA() {
    const el = document.getElementById("gpaDisplay");
    if (!el) return;

    if (courses.length === 0) {
        el.textContent = "0.00";
        return;
    }

    const avg = courses.reduce((s, c) => s + c.grade, 0) / courses.length;
    el.textContent = avg.toFixed(2);
}

function trackStats() {
    const total = document.getElementById("totalCourses");
    const avg = document.getElementById("averagePoints");
    const high = document.getElementById("highestGrade");
    if (!total || !avg || !high) return;

    if (courses.length === 0) {
        total.textContent = "0";
        avg.textContent = "0.00";
        high.textContent = "0.0";
        return;
    }

    const sum = courses.reduce((s, c) => s + c.grade, 0);
    total.textContent = courses.length;
    avg.textContent = (sum / courses.length).toFixed(2);
    high.textContent = Math.max(...courses.map(c => c.grade)).toFixed(1);
}

let gradesChart = null;
function renderGradesChart() {
    const canvas = document.getElementById("gradesChart");
    const empty = document.getElementById("empty");
    if (!canvas || !empty) return;

    if (gradesChart) gradesChart.destroy();

    if (courses.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    gradesChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: courses.map(c => c.name),
            datasets: [{
                data: courses.map(c => c.grade),
                borderColor: "#3b82f6",
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { min: 0, max: 10 } }
        }
    });
}

function updateGoal() {
    const input = document.getElementById("goaltarget");
    if (!input) return;

    const value = parseFloat(input.value);
    if (isNaN(value) || value <= 0 || value > 10) {
        alert("Enter a valid target GPA");
        return;
    }

    saveGoal(value);
    renderProgress();
}

function calculateNextGrade(target) {
    if (courses.length === 0) return "Add courses first";

    const sum = courses.reduce((s, c) => s + c.grade, 0);
    const n = courses.length;
    const needed = (target * (n + 1)) - sum;

    if (needed > 10) return "Not achievable with one more course";
    if (needed <= sum / n) return "Target already achieved";
    return `You need a ${needed.toFixed(2)} on your next course`;
}

function setProgressBar() {
    const bar = document.getElementById("progressBar");
    if (!bar) return;

    const target = parseFloat(localStorage.getItem("goalGPA"));
    if (isNaN(target)) return;

    const avg = courses.length
        ? courses.reduce((s, c) => s + c.grade, 0) / courses.length
        : 0;

    const percent = Math.min((avg / target) * 100, 100);
    bar.style.width = percent + "%";

    const labels = document.querySelectorAll(".targets");
    if (labels[0]) labels[0].textContent = `Current GPA: ${avg.toFixed(2)}`;
    if (labels[1]) labels[1].textContent = `Target: ${target.toFixed(2)}`;

    const text = document.querySelector(".progressContainer + label");
    if (text) text.textContent = `${percent.toFixed(2)}% of the way there`;
}

function renderProgress() {
    const progress = document.getElementById("progress");
    const empty = document.getElementById("empty2");
    if (!progress) return;

    const target = parseFloat(localStorage.getItem("goalGPA"));
    const enabled = localStorage.getItem("goalToggle") === "true";

    if (!enabled || isNaN(target)) {
        progress.classList.add("hidden");
        if (empty) empty.style.display = "block";
        return;
    }

    if (empty) empty.style.display = "none";
    progress.classList.remove("hidden");

    setProgressBar();

    const next = document.getElementById("nextGrade");
    if (next) next.textContent = calculateNextGrade(target);
}

function renderAll() {
    renderCourses();
    calculateGPA();
    trackStats();
    renderGradesChart();
    renderProgress();
}

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    courses = loadCourses();
    loadGoal();
    renderAll();

    const goalToggle = document.getElementById("goalToggle");
    if (goalToggle) {
        goalToggle.checked = localStorage.getItem("goalToggle") === "true";
        goalToggle.addEventListener("change", () => {
            localStorage.setItem("goalToggle", goalToggle.checked);
            renderProgress();
        });
    }

    const themeToggle = document.getElementById("modetoggle");
    if(themeToggle){
        themeToggle.checked = localStorage.getItem("theme") === "dark";
        themeToggle.addEventListener("change", () =>{
            if(themeToggle.checked){
                document.body.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        });
    }
    
    const addBtn = document.getElementById("addOption");
    if (addBtn) addBtn.addEventListener("click", addCourse);
});