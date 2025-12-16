let courses = JSON.parse(localStorage.getItem("courses")) || [];
let gradesChart = null;

function saveCourses() {
    localStorage.setItem("courses", JSON.stringify(courses));
}

function saveGoal(){
    const targetInput = document.getElementById('goaltarget');
    if(!targetInput){
        return;
    }
    const value = parseFloat(targetInput.value);
    if(isNaN(value) || value <=0 || value >10){
        return;
    }

    localStorage.setItem("goalGPA", value);
}

function loadGoal(){
    const targetInput = document.getElementById('goaltarget');
    if(!targetInput){
        return;
    }
    const savedGoal = parseFloat(localStorage.getItem('goalGPA'));
    if(!isNaN(savedGoal)){
        targetInput.value = savedGoal;
    }
}

function renderGradesChart(){
    const canvas = document.getElementById('gradesChart');
    const empty = document.getElementById('empty');
    if(!canvas || !empty){
        return;
    }
    const labels = courses.map(c => c.name);
    const data = courses.map(c => c.grade);

    if(gradesChart){
        gradesChart.destroy();
    }

    if(courses.length === 0){
        empty.style.display = 'block';
    }
    else{
        empty.style.display = 'none';
    }

    if(courses.length > 0){
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
    }
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


function updateGoal() {
    const progress = document.getElementById('progress');
    const targetGPA = parseFloat(document.getElementById('goaltarget').value);
    const message = calculateNextGrade(targetGPA);
    const toggle = document.getElementById('goalToggle');
    const goaltargetInput = document.getElementById('goaltarget');

    if(!goaltargetInput){
        return;
    }
    const value = parseFloat(goaltargetInput.value);
    if(isNaN(value) || value <= 0 || value > 10){
        alert("Please enter a valid target GPA");
        return;
    }

    saveGoal();
    if(toggle){
        renderProgress(toggle.checked);
    }
}


function setProgress(){
    const bar = document.getElementById("progressBar");
    const currentLabel = document.querySelector(".targets");
    const targetLabel = document.querySelector(".targets.target2");
    const percentLabel = document.querySelector(".progressContainer + label");
    const goaltarget = parseFloat(document.getElementById('goaltarget').value);
    let avg = 0;

    if(isNaN(goaltarget) || goaltarget<=0){
        return;
    }

    if(courses.length > 0){
        const total =courses.reduce((sum, c) => sum + c.grade, 0);
        avg = total / courses.length;
    }

    if(currentLabel){
        currentLabel.textContent = `Current GPA: ${avg.toFixed(2)}`;
    }
    if(targetLabel){
        targetLabel.textContent = `Target: ${goaltarget.toFixed(2)}`;
    }

    let value = (avg/goaltarget)*100;
    if(value > 100) value = 100;

    bar.style.width = value + "%";
    if(percentLabel){
        percentLabel.textContent = `${value.toFixed(2)}% of the way there`;
    }
}

function calculateNextGrade(targetGPA){
    if(courses.length === 0){
        return;
    }

    const currentTotal = courses.reduce((sum, c) => sum + c.grade, 0);
    const numCourses = courses.length;
    const currentGPA = currentTotal/numCourses;

    const reqNextGrade=(targetGPA*(numCourses+1))-(currentGPA*numCourses);

    if(reqNextGrade>10){
        return "Not achievable with one more course";
    }
    else if(reqNextGrade<=currentGPA){
        return "Target already achieved";
    }
    else{
        console.log(`You need a ${reqNextGrade.toFixed(2)} on your next course`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadGoal();
    renderCourses();
    calculateGPA();
    trackStats();
    renderGradesChart();

    const toggle = document.getElementById('goalToggle');
    if(toggle){
        const savedToggle = localStorage.getItem('goalToggle');
        toggle.checked = savedToggle === 'true';
        renderProgress(toggle.checked);

        toggle.addEventListener("change", () =>{
            localStorage.setItem('goalToggle', toggle.checked);
            renderProgress(toggle.checked);
        });
    }
});



function renderProgress(show){
    const progress = document.getElementById('progress');
    const targetGPA = parseFloat(document.getElementById('goaltarget').value);
    const message = calculateNextGrade(targetGPA) || '';
    const empty2 = document.getElementById('empty2');
    const targetInput = document.getElementById('goaltarget');
    if(!targetInput){
        return;
    }

    if(empty2){
        empty2.style.display = show ? 'none' : 'block';
    }

    if(progress){
        progress.style.display = show ? "block" : "none";
        if(show){
            setProgress();
            const nextGradeEl = document.getElementById('nextGrade');
            if(nextGradeEl){
                nextGradeEl.textContent = message;
            }
        }
    }
}