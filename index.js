let courses = [];

function addCourse(){
    const name = document.getElementById('courseName').value.trim();
    const grade = parseFloat(document.getElementById('grade').value);

    if(!name || /\d/.test(name)){
        alert("Please enter a valid name of a subject/course");
        return;
    }
    if(isNaN(grade) || grade>10 || grade < 1){
        alert("Please enter a valid grade of the subject/course");
        return;
    }
    courses.push({
        id: Date.now(),
        name: name,
        grade: grade
    });
    renderCourses();
    calculateGPA();
    document.getElementById('courseName').value = ' ';
    document.getElementById('grade').value = ' ';
}

function deleteCourse(id){
    courses = courses.filter(course => course.id !==id);
    renderCourses();
    calculateGPA();
}

function renderCourses(){
    const list = document.getElementById('coursesList')
    if(courses.length===0){
        list.innerHTML ='<div class="emptyState">No courses added yet. Add a course to calculate your GPA!</div>';
        return;
    }
    list.innerHTML = courses.map(course => `
<div class="courseItem">
    <div class="courseName">${course.name}</div>
    <div class="courseGrade">${course.grade}</div>
    <button class ="deleteButton" onclick="deleteCourse(${course.id})">Delete</button>
</div>
`).join('');
    
}

function calculateGPA(){
    if(courses.length===0){
        document.getElementById('gpaDisplay').textContent = '0.00';  
        return;
    }

    let sum = 0;

    courses.forEach(course => {
        sum += course.grade;
    });

    const gpa = sum/courses.length;
    document.getElementById('gpaDisplay').textContent = gpa.toFixed(2);
}

function trackStats(){
    if(courses.length===0){
        document.getElementById('gpaDisplay').textContent = '0.00';  
        document.getElementById('totalCourses').textContent = '0';
        document.getElementById('averagePoints').textContent = '0.00';
        document.getElementById('highestGrade').textContent = '0.0';
        return;
    }
    let sum = 0;
    let max = 0;
    courses.forEach(course => {
        sum += course.grade;
        if(course.grade>max){
            max=course.grade;
        }
    });

    const gpa = sum/courses.length;
    document.getElementById('gpaDisplay').textContent = gpa.toFixed(2);

    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('averagePoints').textContent = courses.grade;
    document.getElementById('highestGrade').textContent = max;
}

document.addEventListener("DOMContentLoaded", () => {
    trackStats();
});

