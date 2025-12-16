let courses = JSON.parse(localStorage.getItem("courses")) || [];
let gradesChart = null;

function saveCourses() {
    localStorage.setItem("courses", JSON.stringify(courses));
}

function renderGradesChart(){
    const canvas = document.getElementById('gradesChart');
    if(!canvas){
        return;
    }
    const labels = courses.map(c => c.name);
    const data = courses.map(c => c.grade);

    if(gradesChart){
        gradesChart.destroy();
    }

    gradesChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data,
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f6',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false,
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#e5e7eb',
                        borderDash: [4, 4]
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                },
                y: {
                    min: 0,
                    max: 11,
                    grid: {
                        color: '#e5e7eb',
                        borderDash: [4, 4]
                    },
                    ticks: {
                        stepSize: 1,
                        color: '#6b7280',
                        maxRotation: 0,
                        autoSkip: true
                    }
                }
            }
        }
    });
    console.log("ran the funciton")
}

function addCourse() {
    const name = document.getElementById('courseName').value.trim();
    const grade = parseFloat(document.getElementById('grade').value);

    if (!name || /\d/.test(name)) {
        alert("Please enter a valid name of a subject/course");
        return;
    }
    if (isNaN(grade) || grade > 10 || grade < 1) {
        alert("Please enter a valid grade of the subject/course");
        return;
    }

    courses.push({
        id: Date.now(),
        name,
        grade
    });

    document.getElementById('courseName').value = '';
    document.getElementById('grade').value = '';

    saveCourses();
    renderCourses();
    calculateGPA();
    trackStats();
    renderGradesChart();
}

function deleteCourse(id) {
    courses = courses.filter(course => course.id !== id);
    saveCourses();
    renderCourses();
    calculateGPA();
    trackStats();
    renderGradesChart();
}

function renderCourses() {
    const list = document.getElementById('coursesList');
    if(!list){
        return;
    }
    if (courses.length === 0) {
        list.innerHTML = '<div class="emptyState">No courses added yet. Add a course to calculate your GPA!</div>';
        return;
    }

    list.innerHTML = courses.map(course => `
        <div class="courseItem">
            <div class="courseName">${course.name}</div>
            <div class="courseGrade">${course.grade}</div>
            <button class="deleteButton" onclick="deleteCourse(${course.id})">Delete</button>
        </div>
    `).join('');
}

function calculateGPA() {
    const gpaDisplay = document.getElementById('gpaDisplay');
    if(!gpaDisplay){
        return;
    }

    if (courses.length === 0) {
        gpaDisplay.textContent = '0.00';
        return;
    }

    const total = courses.reduce((sum, course) => sum + course.grade, 0);
    const gpa = total / courses.length;
    gpaDisplay.textContent = gpa.toFixed(2);
}

function trackStats() {
    const totalCourses = document.getElementById('totalCourses');
    const averagePoints = document.getElementById('averagePoints');
    const highestGrade = document.getElementById('highestGrade');

    if(!totalCourses || !averagePoints || !highestGrade){
        return;
    }

    if (courses.length === 0) {
        totalCourses.textContent = '0';
        averagePoints.textContent = '0.00';
        highestGrade.textContent = '0.0';
        return;
    }

    let sum = 0;
    let max = 0;
    courses.forEach(course => {
        sum += course.grade;
        if (course.grade > max) max = course.grade;
    });

    const avg = sum / courses.length;
    totalCourses.textContent = courses.length;
    averagePoints.textContent = avg.toFixed(2);
    highestGrade.textContent = max.toFixed(1);
}

document.addEventListener("DOMContentLoaded", () => {
    renderCourses();
    calculateGPA();
    trackStats();
    renderGradesChart();
});
