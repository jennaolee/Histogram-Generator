// store the .csv file
var csvFile = document.getElementById("dataFile");

// split the data and store in an array
function parseData(data) {
    let csvData = [];
    let line_break = data.split("\n");
    line_break.forEach(res => {
        csvData.push(res.split(","));
    });
    
    return csvData;
}

// return the maximum grade from the array
function getMaxGrade(data) {
    let csvData = parseData(data);
    let numStudents = csvData.length - 1; // -1 because of the heading
    let maxGrade = Number(csvData[1][1]); // the first student's grade
    let maxGradeIndex = 0;

    for(let j = 2; j < numStudents; j++) { // start with the second student's grade
       
        if(Number(csvData[j][1]) > maxGrade) {
            maxGrade = Number(csvData[j][1]);
            maxGradeIndex = j;
        }
    }

    return csvData[maxGradeIndex];
}

// return the minimum grade in the array
function getMinGrade(data) {
    let csvData = parseData(data);
    let numStudents = csvData.length - 1; // -1 because of the heading
    let minGrade = Number(csvData[1][1]); // the first student's grade
    let minGradeIndex = 0;
    
    for(let i = 2; i < numStudents; i++) { // start with the second student's grade
       
        if(Number(csvData[i][1]) < minGrade) {
            minGrade = Number(csvData[i][1]);
            minGradeIndex = i;
        }
    }

    return csvData[minGradeIndex];
}

// return the mean grade in the array
function getMeanGrade(data) {
    let csvData = parseData(data);
    let numStudents = csvData.length - 1;
    let total = 0;

    for(let i = 1; i < numStudents + 1; i++) {
        total += Number(csvData[i][1]);
    }

    let meanGrade = total/numStudents;

    return meanGrade.toFixed(2); // round mean grade to 2 decimal places
}

// function to sort - returns the difference 
function compare(a, b) { 
    return a - b;
}

// return the median grade after sorting the array
function getMedianGrade(data) {
    let csvData = parseData(data);
    let gradesArr = [];
    let numStudents = csvData.length - 1;

    for(let i = 0; i < numStudents + 1; i++) {
        gradesArr.push(Number(csvData[i][1]));
    }

    gradesArr.sort(compare);
    let medianGrade = gradesArr[Math.ceil(numStudents/2)];

    return medianGrade;
}

// checks that grade input is valid
function isValidInput(bound_input) {
    for (let i = 0; i < bound_input.length; i++) {
        document.getElementById("errorMessage").style.color = "red";

        for (let j = i+1; j < bound_input.length+1; j++) {
            
            if(bound_input[j] >= bound_input[i]) {
                document.getElementById("errorMessage").innerHTML = "Error: Overlapping bounds.";
                return false;

            } else if((isNaN(bound_input[i]))) {
                document.getElementById("errorMessage").innerHTML = "Error: Invalid value found.";
                return false;
            }        
        } 
    }

    return true;
}

// return an array of the number of students in each grade range
function getHistogram(data) {

    // get the lower bound values and push into an array
    let max = Number(document.getElementById("Max").value);
    let A_plus = Number(document.getElementById("A+").value);
    let A = Number(document.getElementById("A").value);
    let A_minus = Number(document.getElementById("A-").value);
    let B_plus = Number(document.getElementById("B+").value);
    let B = Number(document.getElementById("B").value);
    let B_minus = Number(document.getElementById("B-").value);
    let C_plus = Number(document.getElementById("C+").value);
    let C = Number(document.getElementById("C").value);
    let C_minus = Number(document.getElementById("C-").value);
    let D = Number(document.getElementById("D").value);
    let F = Number(document.getElementById("F").value);

    let csvData = parseData(data);
    let numStudents = csvData.length - 1;
    let bound_input = [max, A_plus, A, A_minus, B_plus, B, B_minus, C_plus, C, C_minus, D, F];
    let gradeDistribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // inform users of overlapping bound and invalid input errors 
    if(isValidInput(bound_input)) {
        document.getElementById("errorMessage").innerHTML = "";
    }

    // increment the respective grade ranges
    for(let i = 1; i < numStudents; i++) {
        let student_grade = csvData[i][1];

        if(student_grade <= max && student_grade >= A_plus) {
            gradeDistribution[0]++;
            
        } else if (student_grade < A_plus && student_grade >= A) {
            gradeDistribution[1]++;

        } else if (student_grade < A && student_grade >= A_minus) {
            gradeDistribution[2]++;

        } else if (student_grade < A_minus && student_grade >= B_plus) {
            gradeDistribution[3]++;

        } else if (student_grade < B_plus && student_grade >= B) {
            gradeDistribution[4]++;

        } else if (student_grade < B && student_grade >= B_minus) {
            gradeDistribution[5]++;

        } else if (student_grade < B_minus && student_grade >= C_plus) {
            gradeDistribution[6]++;

        } else if (student_grade < C_plus && student_grade >= C) {
            gradeDistribution[7]++;

        } else if (student_grade < C && student_grade >= C_minus) {
            gradeDistribution[8]++;

        } else if (student_grade < C_minus && student_grade >= D) {
            gradeDistribution[9]++;

        } else {
            gradeDistribution[10]++;
        }
    }

    return gradeDistribution;
}

function drawHistogram(data, canvas) {
    let gradeDistribution = getHistogram(data);
    let numGrades = gradeDistribution.length;
    
    let width = 1600;
    let height = 800;
    
    canvas.width = width;
    canvas.height = height;

    canvas.style.width = "800px";
    canvas.style.height = "400px";

    let bar_width = (width/(2*numGrades + 1)) + 1;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#222c41";
    
    // calculate the percentage of students in a particular grade range and draw a representative bar
    // A+ students
    ctx.fillRect(25 + bar_width/2, height - height*((gradeDistribution[0]/25)), bar_width, height*((gradeDistribution[0]/25)));

    // A students
    ctx.fillRect(25 + bar_width/2 + 2*bar_width, height - height*(gradeDistribution[1]/25), bar_width, height*((gradeDistribution[1]/25)));

    // A- students
    ctx.fillRect(25 + bar_width/2 + 4*bar_width, height - height*(gradeDistribution[2]/25), bar_width, height*((gradeDistribution[2]/25)));

    // B+ students
    ctx.fillRect(25 + bar_width/2 + 6*bar_width, height - height*(gradeDistribution[3]/25), bar_width, height*((gradeDistribution[3]/25)));

    // B students
    ctx.fillRect(25 + bar_width/2 + 8*bar_width, height - height*(gradeDistribution[4]/25), bar_width, height*((gradeDistribution[4]/25)));

    // B- students
    ctx.fillRect(25 + bar_width/2 + 10*bar_width, height - height*(gradeDistribution[5]/25), bar_width, height*((gradeDistribution[5]/25)));

    // C+ students
    ctx.fillRect(25 + bar_width/2 + 12*bar_width, height - height*(gradeDistribution[6]/25), bar_width, height*((gradeDistribution[6]/25)));

    // C students
    ctx.fillRect(25 + bar_width/2 + 14*bar_width, height - height*(gradeDistribution[7]/25), bar_width, height*((gradeDistribution[7]/25)));

    // C- students
    ctx.fillRect(25 + bar_width/2 + 16*bar_width, height - height*(gradeDistribution[8]/25), bar_width, height*((gradeDistribution[8]/25)));

    // D students
    ctx.fillRect(25 + bar_width/2 + 18*bar_width, height - height*(gradeDistribution[9]/25), bar_width, height*((gradeDistribution[9]/25)));

    // F students
    ctx.fillRect(25 + bar_width/2 + 20*bar_width, height - height*(gradeDistribution[10]/25), bar_width, height*((gradeDistribution[10]/25)));
}

// clear the canvas - for updating
function clearCanvas(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// main function to read a file and display the output
function stats(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsText(input.files[0]);

        reader.addEventListener("loadend", function(e) {
            let csvFile = e.target.result;
            let maxGrade = getMaxGrade(csvFile);
            let minGrade = getMinGrade(csvFile);
            let meanGrade = getMeanGrade(csvFile);
            let medianGrade = getMedianGrade(csvFile);
            let histogram = getHistogram(csvFile);
            e.target.value = '';

            let canvas = document.getElementById("myCanvas");
            clearCanvas(canvas);

            document.getElementById("highestGrade").innerHTML = maxGrade[0] + " (" + maxGrade[1] + "%)";
            document.getElementById("lowestGrade").innerHTML = minGrade[0] + " (" + minGrade[1] + "%)";
            document.getElementById("meanGrade").innerHTML = "(" + meanGrade + "%)";
            document.getElementById("medianGrade").innerHTML = "(" + medianGrade + "%)";
            
            drawHistogram(csvFile, canvas);
            document.getElementById("Aplus-students").innerHTML = histogram[0];
            document.getElementById("A-students").innerHTML = histogram[1];
            document.getElementById("Aminus-students").innerHTML = histogram[2];
            document.getElementById("Bplus-students").innerHTML = histogram[3];
            document.getElementById("B-students").innerHTML = histogram[4];
            document.getElementById("Bminus-students").innerHTML = histogram[5];
            document.getElementById("Cplus-students").innerHTML = histogram[6];
            document.getElementById("C-students").innerHTML = histogram[7];
            document.getElementById("Cminus-students").innerHTML = histogram[8];;
            document.getElementById("D-students").innerHTML = histogram[9];
            document.getElementById("F-students").innerHTML = histogram[10];
        });
    }  
}