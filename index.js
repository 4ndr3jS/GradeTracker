let courses = [];

function addCourse(){
    const name = document.getElementById('courseName').ariaValueMax.trim();
    const grade = document.getElementById('grade').value;

    if(!name)
        alert("Please enter a name for the subject/course");
    courses.push({
        id: Date.now(),
        name: name,
        grade: grade
    });
    renderCourses();
    calculateGPA();
}

function deleteCourse(id){
    courses = courses.filter(course => course.id !==id);
    renderCourses();
    calculateGPA();
}

function renderCourses(){
    const list = document.getElementById('coursesList')
}