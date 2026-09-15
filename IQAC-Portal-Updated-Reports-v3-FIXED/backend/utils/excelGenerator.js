const ExcelJS = require("exceljs");

const User = require("../models/User");
const Submission = require("../models/Submission");

const facultyQuestions =
require("../data/facultyQuestions");

const hodQuestions =
require("../data/hodQuestions");

const deanQuestions =
require("../data/deanQuestions");

// ========================================
// ADMIN EXCEL
// ========================================

exports.generateAdminExcel = async (

school,

department

) => {

const workbook = new ExcelJS.Workbook();

workbook.creator = "SRIHER IQAC Portal";

workbook.created = new Date();

await generateFacultySheet(

workbook,

school,

department

);

// We'll build later

await generateHodSheet(

workbook,

school,

department

);

// We'll build later

await generateDeanSheet(

workbook,

school,

department

);

return workbook;

};

// ========================================
// FACULTY SHEET
// ========================================

async function generateFacultySheet(

workbook,

school,

department

){

const worksheet =
workbook.addWorksheet("Faculty");

// ====================================
// FIXED COLUMNS
// ====================================

const columns = [

{ header:"School", key:"school" },

{ header:"Department", key:"department" },

{ header:"Faculty Name", key:"faculty" },

{ header:"Quarter", key:"quarter" },

{ header:"Submission Status", key:"status" },

{ header:"Submitted Date", key:"submittedDate" }

];

// ====================================
// DYNAMIC QUESTION COLUMNS
// ====================================

facultyQuestions.forEach((section)=>{

section.questions.forEach((question,index)=>{

columns.push({

header:

question.question,

key:

`${section.sectionNo}_${index}`

});

});

});

// ====================================
// SUMMARY COLUMNS
// ====================================

columns.push(

{

header:"Total Questions",

key:"totalQuestions"

},

{

header:"Answered",

key:"answered"

},

{

header:"NIL",

key:"notAnswered"

}

);

// ====================================
// APPLY TO SHEET
// ====================================

worksheet.columns = columns;

// ====================================
// HEADER STYLE
// ====================================

worksheet.getRow(1).eachCell((cell)=>{

cell.font={

bold:true,

color:{argb:"FFFFFFFF"}

};

cell.fill={

type:"pattern",

pattern:"solid",

fgColor:{argb:"1F4E78"}

};

cell.alignment={

vertical:"middle",

horizontal:"center",

wrapText:true

};

cell.border={

top:{style:"thin"},

left:{style:"thin"},

bottom:{style:"thin"},

right:{style:"thin"}

};

});

// ====================================
// COLUMN WIDTH
// ====================================

worksheet.columns.forEach((column)=>{

column.width=28;

});

// Freeze Header

worksheet.views=[

{

state:"frozen",

ySplit:1

}

];

// ====================================
// LOAD FACULTY USERS
// ====================================

const userFilter = {

role: "faculty",

isDeleted: false,

isActive: true

};

if (

school &&

school !== "All"

){

userFilter.school = school;

}

if (

department &&

department !== "All"

){

userFilter.department = department;

}

const facultyUsers =

await User.find(userFilter)

.sort({

department:1,

name:1

});

// ====================================
// LOAD SUBMISSIONS
// ====================================

const submissionFilter = {

role:"faculty"

};

if (

school &&

school !== "All"

){

submissionFilter.school = school;

}

if (

department &&

department !== "All"

){

submissionFilter.department = department;

}

const submissions =

await Submission.find(

submissionFilter

).sort({

quarter:1,

submittedByName:1

});

// ====================================
// CREATE QUICK LOOKUP
// ====================================

const submissionMap = {};

submissions.forEach((submission)=>{

const key =

`${submission.submittedBy}_${submission.quarter}`;

submissionMap[key]=submission;

});

console.log(

"Faculty Users:",

facultyUsers.length

);

console.log(

"Faculty Submissions:",

submissions.length

);

// ====================================
// GENERATE ROWS
// ====================================

const quarters = [

"Q1",

"Q2",

"Q3",

"Q4"

];

quarters.forEach((quarter)=>{

// ----------------------------
// Quarter Heading
// ----------------------------

const headingRow =
worksheet.addRow([

`========== ${quarter} ==========`]);

headingRow.font={

bold:true,

size:14

};

headingRow.fill={

type:"pattern",

pattern:"solid",

fgColor:{argb:"D9EAF7"}

};

headingRow.alignment = {

    horizontal: "center",

    vertical: "middle"

};

worksheet.mergeCells(

headingRow.number,

1,

headingRow.number,

worksheet.columnCount

);
// ----------------------------
// Faculty Loop
// ----------------------------
let previousSchool = "";
facultyUsers.forEach((faculty)=>{
    if (
    previousSchool !== "" &&
    previousSchool !== faculty.school
) {

    worksheet.addRow([]);

}

previousSchool = faculty.school;

const key =

`${faculty._id}_${quarter}`;

const submission =

submissionMap[key];

console.log("=================================");
console.log("Faculty :", faculty.name);
console.log("Quarter :", quarter);

const row = {

school:

faculty.school,

department:

faculty.department,

faculty:

faculty.name,

quarter,

status:

submission

?

submission.status

:

"Not Submitted",

submittedDate:

submission

?

new Date(

submission.createdAt

).toLocaleDateString()

:

"-",

totalQuestions:

submission

?

submission.totalQuestions

:

0,

answered:

submission

?

submission.answeredCount

:

0,

notAnswered:

submission

?

submission.unansweredCount
:
0
};
// ======================================
// FILL ALL QUESTION ANSWERS
// ======================================

facultyQuestions.forEach((section)=>{

    section.questions.forEach((question,index)=>{

        const key =
        `${section.sectionNo}_${index}`;

        if(!submission){

            row[key] = "Not Submitted";

            return;

        }

        const ans =
        submission.answers.find(

            a => a.questionNo === key

        );

        if(!ans){

            row[key] = "NIL";

            return;

        }

        if (
    typeof ans.answer === "string" &&
    ans.answer.startsWith("/uploads/")
) {

    row[key] = {
        text: "View File",
        hyperlink: `http://localhost:5000${ans.answer}`
    };

}
else {

    row[key] = ans.answer ?? "NIL";

}

    });

});

// ======================================
// ADD ROW TO EXCEL
// ======================================

const excelRow = worksheet.addRow(row);

// ======================================
// STATUS CELL COLOR
// ======================================

const statusColumnIndex =
    worksheet.columns.findIndex(
        col => col.key === "status"
    ) + 1;

const statusCell =
    excelRow.getCell(statusColumnIndex);

// 🔴 Draft / Not Submitted
if (
    row.status === "Draft" ||
    row.status === "Not Submitted"
) {

    statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FFC7CE"
        }
    };

    statusCell.font = {
        color: {
            argb: "9C0006"
        },
        bold: true
    };

}

// 🟡 Pending
else if (

    row.status === "Pending HOD Approval" ||

    row.status === "Pending Dean Review" ||

    row.status === "Pending Admin Review"

) {

    statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FFF2CC"
        }
    };

    statusCell.font = {
        color: {
            argb: "7F6000"
        },
        bold: true
    };

}

// 🟢 Approved
else if (

    row.status === "Approved by Dean" ||

    row.status === "Submitted to Admin"

) {

    statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "C6EFCE"
        }
    };

    statusCell.font = {
        color: {
            argb: "006100"
        },
        bold: true
    };

}

// 🟠 Rejected
else if (

    row.status === "Rejected by HOD" ||

    row.status === "Rejected by Dean"

) {

    statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "F4B084"
        }
    };

    statusCell.font = {
        color: {
            argb: "9C6500"
        },
        bold: true
    };

}
// ======================================
// MAKE FILE LINKS CLICKABLE
// ======================================

facultyQuestions.forEach((section) => {

    section.questions.forEach((question, index) => {

        const columnKey =
        `${section.sectionNo}_${index}`;

        const columnIndex =
worksheet.columns.findIndex(
    col => col.key === columnKey
) + 1;

const cell =
excelRow.getCell(columnIndex);

        if (

            cell.value &&

            typeof cell.value === "object" &&

            cell.value.hyperlink

        ) {

            cell.font = {

                color: { argb: "0000FF" },

                underline: true

            };

        }

    });

});

// ======================================
// BORDER FOR EVERY CELL
// ======================================

excelRow.eachCell((cell) => {

    cell.border = {

        top: { style: "thin" },

        left: { style: "thin" },

        bottom: { style: "thin" },

        right: { style: "thin" }

    };

});

});
// ----------------------------
// Blank Row
// ----------------------------

worksheet.addRow([]);

});

}

// ========================================
// HOD SHEET
// ========================================
async function generateHodSheet(
    workbook,
    school,
    department
){

    const worksheet =
        workbook.addWorksheet("HOD");

    worksheet.views = [
        {
            state: "frozen",
            ySplit: 1
        }
    ];
// ====================================
// LOAD HOD USERS
// ====================================

const userFilter = {

    role: "hod",

    isDeleted: false,

    isActive: true

};

if (
    school &&
    school !== "All"
){
    userFilter.school = school;
}

if (
    department &&
    department !== "All"
){
    userFilter.department = department;
}

const hodUsers =
await User.find(userFilter)
.sort({

    school:1,

    department:1,

    name:1

});
// ====================================
// LOAD HOD SUBMISSIONS
// ====================================

const submissionFilter = {

    role:"hod"

};

if (
    school &&
    school !== "All"
){
    submissionFilter.school = school;
}

if (
    department &&
    department !== "All"
){
    submissionFilter.department = department;
}

const submissions =
await Submission.find(submissionFilter);
// ====================================
// CREATE LOOKUP
// ====================================

const submissionMap = {};

submissions.forEach(submission=>{

    submissionMap[
        `${submission.submittedBy}_${submission.quarter}`
    ] = submission;

});
console.log(Object.keys(submissionMap));
// ====================================
// FIND MAX RECORD COUNT
// ====================================

const maxRecords = {};

hodQuestions.forEach(section=>{

    if(section.type !== "table")
        return;

    maxRecords[section.sectionNo] = 1;

});

submissions.forEach(submission=>{

    submission.answers.forEach(answer=>{

        if(
            !Array.isArray(answer.answer)
        ) return;

        const total =
            answer.answer.length;

        if(

            total >

            (maxRecords[answer.questionNo] || 1)

        ){

            maxRecords[
                answer.questionNo
            ] = total;

        }

    });

});

console.log(maxRecords);

// ====================================
// CREATE COLUMNS
// ====================================

const columns = [

    { header: "School", key: "school" },

    { header: "Department", key: "department" },

    { header: "HOD Name", key: "hod" },

    { header: "Quarter", key: "quarter" },

    { header: "Submission Status", key: "status" },

    { header: "Submitted Date", key: "submittedDate" },

    { header: "Section", key: "section" },

    { header: "Record Number", key: "recordNumber" }

];

// ======================================
// ADD QUESTION COLUMNS
// ======================================

hodQuestions.forEach(section => {

    // TABLE QUESTION
    if (section.type === "table") {

        section.tableColumns.forEach(col => {

            columns.push({

                header: `S${section.sectionNo} - ${col.label}`,

                key: `${section.sectionNo}_${col.key}`

            });

        });

    }

    // NORMAL QUESTION
    else if (section.type === "singleRecord") {

    section.fields.forEach(field => {

        columns.push({

            header: `S${section.sectionNo} - ${field.label}`,

            key: `${section.sectionNo}_${field.key}`

        });

    });

}
});
// ======================================
// SUMMARY
// ======================================

columns.push(

    {

        header: "Total Questions",

        key: "totalQuestions"

    },

    {

        header: "Answered",

        key: "answered"

    },

    {

        header: "NIL",

        key: "notAnswered"

    }

);

worksheet.columns = columns;
worksheet.getRow(1).eachCell((cell)=>{

    cell.font = {

        bold:true,

        color:{ argb:"FFFFFFFF" }

    };

    cell.fill = {

        type:"pattern",

        pattern:"solid",

        fgColor:{ argb:"1F4E78" }

    };

    cell.alignment = {

        vertical:"middle",

        horizontal:"center",

        wrapText:true

    };

    cell.border = {

        top:{style:"thin"},

        left:{style:"thin"},

        bottom:{style:"thin"},

        right:{style:"thin"}

    };

});
worksheet.columns.forEach(column=>{

    column.width = 25;

});
// ====================================
// QUARTERS
// ====================================

const quarters = [

    "Q1",

    "Q2",

    "Q3",

    "Q4"

];

quarters.forEach((quarter)=>{

    const headingRow =
    worksheet.addRow([

        `========== ${quarter} ==========`]);

    headingRow.font = {

        bold:true,

        size:14

    };

    headingRow.fill = {

        type:"pattern",

        pattern:"solid",

        fgColor:{argb:"D9EAF7"}

    };

    headingRow.alignment = {

        horizontal:"center",

        vertical:"middle"

    };

    worksheet.mergeCells(

        headingRow.number,

        1,

        headingRow.number,

        worksheet.columnCount

    );
    // ====================================
// HOD LOOP
// ====================================

let previousSchool = "";

hodUsers.forEach((hod)=>{

    if(

        previousSchool !== "" &&

        previousSchool !== hod.school

    ){

        worksheet.addRow([]);

    }

    previousSchool = hod.school;

    const submission =
    submissionMap[
        `${hod._id}_${quarter}`
    ];
    console.log("================================");
console.log("HOD :", hod.name);
console.log("Quarter :", quarter);
console.log("Lookup Key :", `${hod._id}_${quarter}`);
console.log("Submission :", submission);

// =========================================
// NO SUBMISSION
// =========================================

if (!submission) {

    const row = {

        school: hod.school,
        department: hod.department,
        hod: hod.name,
        quarter,
        status: "Not Submitted",
        submittedDate: "-",
        section: "-",
        recordNumber: "-",
        totalQuestions: 0,
        answered: 0,
        notAnswered: 0

    };

    const excelRow = worksheet.addRow(row);

    styleHodRow(
        worksheet,
        excelRow,
        row
    );

    return;

}
// =========================================
// START MERGE ROW
// =========================================

const mergeStartRow = worksheet.rowCount + 1;

// =========================================
// LOOP THROUGH ALL SECTIONS
// =========================================

hodQuestions.forEach((section) => {

    // =====================================
    // TABLE QUESTIONS
    // =====================================

    if (section.type === "table") {

        const answerObj = submission.answers.find(

            a => String(a.questionNo) === String(section.sectionNo)

        );

        const records =

            Array.isArray(answerObj?.answer)

                ? answerObj.answer

                : [];

        const maxRecord =

            maxRecords[section.sectionNo] || 1;

        for (

            let recordIndex = 0;

            recordIndex < maxRecord;

            recordIndex++

        ) {

            const record =

                records[recordIndex] || {};

            const row = {

                school: hod.school,

                department: hod.department,

                hod: hod.name,

                quarter,

                status: submission.status,

                submittedDate: new Date(

                    submission.createdAt

                ).toLocaleDateString(),

                section: `Section ${section.sectionNo}`,

                recordNumber: recordIndex + 1,

                totalQuestions:

                    submission.totalQuestions,

                answered:

                    submission.answeredCount,

                notAnswered:

                    submission.unansweredCount

            };

            // ===============================
            // FILL TABLE COLUMNS
            // ===============================

            section.tableColumns.forEach(col => {

                let value =

                    record[col.key];

                if (

                    value === undefined ||

                    value === null ||

                    value === ""

                ) {

                    row[

                        `${section.sectionNo}_${col.key}`

                    ] = "NIL";

                }

                else if (

                    typeof value === "string" &&

                    value.startsWith("/uploads/")

                ) {

                    row[
                        `${section.sectionNo}_${col.key}`
                    ] = {

                        text: "View File",

                        hyperlink:

                            `http://localhost:5000${value}`

                    };

                }

                else {

                    row[
                        `${section.sectionNo}_${col.key}`
                    ] = value;

                }

            });

            const excelRow = worksheet.addRow(row);

// ======================================
// STATUS COLOR
// ======================================

const statusColumnIndex =
    worksheet.columns.findIndex(
        col => col.key === "status"
    ) + 1;

const statusCell =
    excelRow.getCell(statusColumnIndex);

// 🔴 Draft / Not Submitted
if (
    row.status === "Draft" ||
    row.status === "Not Submitted"
) {

    statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FFC7CE"
        }
    };

    statusCell.font = {
        color: {
            argb: "9C0006"
        },
        bold: true
    };

}

// 🟡 Pending
else if (

    row.status === "Pending HOD Approval" ||

    row.status === "Pending Dean Review" ||

    row.status === "Pending Admin Review"

) {

    statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FFF2CC"
        }
    };

    statusCell.font = {
        color: {
            argb: "7F6000"
        },
        bold: true
    };

}

// 🟢 Approved
else if (

    row.status === "Approved by Dean" ||

    row.status === "Submitted to Admin"

) {

    statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "C6EFCE"
        }
    };

    statusCell.font = {
        color: {
            argb: "006100"
        },
        bold: true
    };

}

// 🟠 Rejected
else if (

    row.status === "Rejected by HOD" ||

    row.status === "Rejected by Dean"

) {

    statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "F4B084"
        }
    };

    statusCell.font = {
        color: {
            argb: "9C6500"
        },
        bold: true
    };

}

// ======================================
// HYPERLINK STYLE
// ======================================

excelRow.eachCell((cell)=>{

    if(

        cell.value &&

        typeof cell.value === "object" &&

        cell.value.hyperlink

    ){

        cell.font = {

            color:{
                argb:"0000FF"
            },

            underline:true

        };

    }

});

// ======================================
// BORDER
// ======================================

excelRow.eachCell((cell)=>{

    cell.border={

        top:{style:"thin"},

        left:{style:"thin"},

        bottom:{style:"thin"},

        right:{style:"thin"}

    };

});

        }

    }

   else if (section.type === "singleRecord") {

    const answerObj = submission.answers.find(

        a => String(a.questionNo) === String(section.sectionNo)

    );

    const row = {

        school: hod.school,

        department: hod.department,

        hod: hod.name,

        quarter,

        status: submission.status,

        submittedDate: new Date(
            submission.createdAt
        ).toLocaleDateString(),

        section: `Section ${section.sectionNo}`,

        recordNumber: 1,

        totalQuestions: submission.totalQuestions,

        answered: submission.answeredCount,

        notAnswered: submission.unansweredCount

    };

    section.fields.forEach(field => {

        const value =
            answerObj?.answer?.[field.key];

        if (

            value === undefined ||

            value === null ||

            value === ""

        ) {

            row[
                `${section.sectionNo}_${field.key}`
            ] = "NIL";

        }

        else if (

            typeof value === "string" &&

            value.startsWith("/uploads/")

        ) {

            row[
                `${section.sectionNo}_${field.key}`
            ] = {

                text: "View File",

                hyperlink:
                    `http://localhost:5000${value}`

            };

        }

        else {

            row[
                `${section.sectionNo}_${field.key}`
            ] = value;

        }

    });

    const excelRow = worksheet.addRow(row);

    styleHodRow(
        worksheet,
        excelRow,
        row
    );

}

});
// =========================================
// MERGE COMMON COLUMNS
// =========================================

const mergeEndRow = worksheet.rowCount;

if (mergeEndRow > mergeStartRow) {

    // School
    worksheet.mergeCells(
        mergeStartRow,
        1,
        mergeEndRow,
        1
    );

    // Department
    worksheet.mergeCells(
        mergeStartRow,
        2,
        mergeEndRow,
        2
    );

    // HOD Name
    worksheet.mergeCells(
        mergeStartRow,
        3,
        mergeEndRow,
        3
    );

    // Quarter
    worksheet.mergeCells(
        mergeStartRow,
        4,
        mergeEndRow,
        4
    );

    // Status
    worksheet.mergeCells(
        mergeStartRow,
        5,
        mergeEndRow,
        5
    );

    // Submitted Date
    worksheet.mergeCells(
        mergeStartRow,
        6,
        mergeEndRow,
        6
    );

    // Total Questions
    worksheet.mergeCells(
        mergeStartRow,
        worksheet.columnCount - 2,
        mergeEndRow,
        worksheet.columnCount - 2
    );

    // Answered
    worksheet.mergeCells(
        mergeStartRow,
        worksheet.columnCount - 1,
        mergeEndRow,
        worksheet.columnCount - 1
    );

    // NIL
    worksheet.mergeCells(
        mergeStartRow,
        worksheet.columnCount,
        mergeEndRow,
        worksheet.columnCount
    );

    // Center Alignment
    [1,2,3,4,5,6,
     worksheet.columnCount-2,
     worksheet.columnCount-1,
     worksheet.columnCount].forEach(col=>{

        worksheet.getCell(
            mergeStartRow,
            col
        ).alignment = {

            vertical:"middle",

            horizontal:"center",

            wrapText:true

        };

    });

}
// =========================================
// BLANK ROW AFTER EVERY HOD
// =========================================

worksheet.addRow([]);

});

});

}
function styleHodRow(worksheet, excelRow, row) {

    const statusColumnIndex =
        worksheet.columns.findIndex(
            col => col.key === "status"
        ) + 1;

    const statusCell =
        excelRow.getCell(statusColumnIndex);

    // 🔴 Draft / Not Submitted
    if (
        row.status === "Draft" ||
        row.status === "Not Submitted"
    ) {

        statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFC7CE" }
        };

        statusCell.font = {
            color: { argb: "9C0006" },
            bold: true
        };

    }

    // 🟡 Pending
    else if (

        row.status === "Pending HOD Approval" ||

        row.status === "Pending Dean Review" ||

        row.status === "Pending Admin Review"

    ) {

        statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF2CC" }
        };

        statusCell.font = {
            color: { argb: "7F6000" },
            bold: true
        };

    }

    // 🟢 Approved
    else if (

        row.status === "Approved by Dean" ||

        row.status === "Submitted to Admin"

    ) {

        statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "C6EFCE" }
        };

        statusCell.font = {
            color: { argb: "006100" },
            bold: true
        };

    }

    // 🟠 Rejected
    else if (

        row.status === "Rejected by HOD" ||

        row.status === "Rejected by Dean"

    ) {

        statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F4B084" }
        };

        statusCell.font = {
            color: { argb: "9C6500" },
            bold: true
        };

    }

    excelRow.eachCell(cell => {

        if (
            cell.value &&
            typeof cell.value === "object" &&
            cell.value.hyperlink
        ) {

            cell.font = {
                color: { argb: "0000FF" },
                underline: true
            };

        }

        cell.border = {

            top: { style: "thin" },

            left: { style: "thin" },

            bottom: { style: "thin" },

            right: { style: "thin" }

        };

    });

}
// ========================================
// DEAN SHEET
// ========================================

async function generateDeanSheet(

    workbook,

    school,

    department

){

const worksheet =
workbook.addWorksheet("Dean");

// ======================================
// FIXED COLUMNS
// ======================================

const columns = [

{ header:"School", key:"school" },

{ header:"Department", key:"department" },

{ header:"Dean Name", key:"dean" },

{ header:"Quarter", key:"quarter" },

{ header:"Submission Status", key:"status" },

{ header:"Submitted Date", key:"submittedDate" },

{ header:"Section", key:"section" },

{ header:"Record Number", key:"recordNumber" }

];

// ======================================
// DYNAMIC COLUMNS
// ======================================

deanQuestions.forEach(section=>{

    // Single Record

    if(section.type==="singleRecord"){

        section.fields.forEach(field=>{

            columns.push({

                header:`S${section.sectionNo} - ${field.label}`,

                key:`${section.sectionNo}_${field.key}`

            });

        });

    }

    // Table

    else if(section.type==="table"){

        section.tableColumns.forEach(col=>{

            columns.push({

                header:`S${section.sectionNo} - ${col.label}`,

                key:`${section.sectionNo}_${col.key}`

            });

        });

    }

});

// ======================================
// SUMMARY
// ======================================

columns.push(

{

header:"Total Questions",

key:"totalQuestions"

},

{

header:"Answered",

key:"answered"

},

{

header:"NIL",

key:"notAnswered"

}

);

worksheet.columns = columns;

// ======================================
// HEADER STYLE
// ======================================

worksheet.getRow(1).eachCell((cell)=>{

cell.font={

bold:true,

color:{argb:"FFFFFFFF"}

};

cell.fill={

type:"pattern",

pattern:"solid",

fgColor:{argb:"1F4E78"}

};

cell.alignment={

vertical:"middle",

horizontal:"center",

wrapText:true

};

cell.border={

top:{style:"thin"},

left:{style:"thin"},

bottom:{style:"thin"},

right:{style:"thin"}

};

});

worksheet.columns.forEach(column=>{

column.width=28;

});

worksheet.views=[

{

state:"frozen",

ySplit:1

}

];

// ======================================
// LOAD DEAN USERS
// ======================================

const userFilter = {

    role: "dean",

    isDeleted: false,

    isActive: true

};

if (

    school &&

    school !== "All"

) {

    userFilter.school = school;

}

const deanUsers=

await User.find(userFilter)

.sort({

department:1,

name:1

});

// ======================================
// LOAD SUBMISSIONS
// ======================================

const submissionFilter = {

    role: "dean"

};

if (

    school &&

    school !== "All"

) {

    submissionFilter.school = school;

}

const submissions=

await Submission.find(

submissionFilter

);

// ======================================
// LOOKUP
// ======================================

const submissionMap={};

submissions.forEach(submission=>{

const key=

`${submission.submittedBy}_${submission.quarter}`;

submissionMap[key]=submission;

});

// ======================================
// QUARTERS
// ======================================

const quarters=[

"Q1",

"Q2",

"Q3",

"Q4"

];

quarters.forEach((quarter)=>{

const headingRow=

worksheet.addRow([

`========== ${quarter} ==========`

]);

headingRow.font={

bold:true,

size:14

};

headingRow.fill={

type:"pattern",

pattern:"solid",

fgColor:{argb:"D9EAF7"}

};

worksheet.mergeCells(

headingRow.number,

1,

headingRow.number,

worksheet.columnCount

);

let previousSchool="";

deanUsers.forEach((dean)=>{

if(

previousSchool!=="" &&

previousSchool!==dean.school

){

worksheet.addRow([]);

}

previousSchool=

dean.school;

const key=

`${dean._id}_${quarter}`;

const submission=
submissionMap[key];
// ======================================
// NO SUBMISSION
// ======================================

if (!submission) {

    const row = {

        school: dean.school,

        department: dean.department,

        dean: dean.name,

        quarter,

        status: "Not Submitted",

        submittedDate: "-",

        section: "-",

        recordNumber: "-",

        totalQuestions: 0,

        answered: 0,

        notAnswered: 0

    };

    const excelRow = worksheet.addRow(row);

    styleHodRow(
        worksheet,
        excelRow,
        row
    );

    return;

}

// ======================================
// START MERGE
// ======================================

const mergeStartRow =
worksheet.rowCount + 1;

// ======================================
// LOOP ALL SECTIONS
// ======================================

deanQuestions.forEach(section => {

    // ======================================
    // SINGLE RECORD
    // ======================================

    if (section.type === "singleRecord") {

        const answerObj =
        submission.answers.find(

            a =>

                String(a.questionNo) ===

                String(section.sectionNo)

        );

        const row = {

            school: dean.school,

            department: dean.department,

            dean: dean.name,

            quarter,

            status: submission.status,

            submittedDate:
            new Date(

                submission.createdAt

            ).toLocaleDateString(),

            section:
            `Section ${section.sectionNo}`,

            recordNumber: "1",

            totalQuestions:
            submission.totalQuestions,

            answered:
            submission.answeredCount,

            notAnswered:
            submission.unansweredCount

        };

        section.fields.forEach(field => {

            const value =
            answerObj?.answer?.[field.key];

            if (

                value === undefined ||

                value === null ||

                value === ""

            ) {

                row[
                    `${section.sectionNo}_${field.key}`
                ] = "NIL";

            }

            else if (

                typeof value === "string" &&

                value.startsWith("/uploads/")

            ) {

                row[
                    `${section.sectionNo}_${field.key}`
                ] = {

                    text: "View File",

                    hyperlink:
                    `http://localhost:5000${value}`

                };

            }

            else {

                row[
                    `${section.sectionNo}_${field.key}`
                ] = value;

            }

        });

        const excelRow =
        worksheet.addRow(row);

        styleHodRow(

            worksheet,

            excelRow,

            row

        );

    }

    // ======================================
    // TABLE QUESTION
    // ======================================

    else if (

        section.type === "table"

    ) {

        const answerObj = submission.answers.find(

    a =>

        String(a.questionNo) ===

        String(section.sectionNo)

);

const records =

Array.isArray(answerObj?.answer)

? answerObj.answer

: [];

const totalRecords =

Math.max(

    records.length,

    1

);

for (

    let recordIndex = 0;

    recordIndex < totalRecords;

    recordIndex++

) {

    const record =

    records[recordIndex] || {};

    const row = {

        school: dean.school,

        department: dean.department,

        dean: dean.name,

        quarter,

        status: submission.status,

        submittedDate:

        new Date(

            submission.createdAt

        ).toLocaleDateString(),

        section:

        `Section ${section.sectionNo}`,

        recordNumber:

        recordIndex + 1,

        totalQuestions:

        submission.totalQuestions,

        answered:

        submission.answeredCount,

        notAnswered:

        submission.unansweredCount

    };

    section.tableColumns.forEach(col => {

        const value =

        record[col.key];

        if (

            value === undefined ||

            value === null ||

            value === ""

        ) {

            row[
                `${section.sectionNo}_${col.key}`
            ] = "NIL";

        }

        else if (

            typeof value === "string" &&

            value.startsWith("/uploads/")

        ) {

            row[
                `${section.sectionNo}_${col.key}`
            ] = {

                text: "View File",

                hyperlink:
                `http://localhost:5000${value}`

            };

        }

        else {

            row[
                `${section.sectionNo}_${col.key}`
            ] = value;

        }

    });

    const excelRow =

    worksheet.addRow(row);

    styleHodRow(

        worksheet,

        excelRow,

        row

    );

}

    }

});
// ======================================
// MERGE COMMON COLUMNS
// ======================================

const mergeEndRow =
worksheet.rowCount;

if (mergeEndRow > mergeStartRow) {

    // School
    worksheet.mergeCells(
        mergeStartRow,
        1,
        mergeEndRow,
        1
    );

    // Department
    worksheet.mergeCells(
        mergeStartRow,
        2,
        mergeEndRow,
        2
    );

    // Dean Name
    worksheet.mergeCells(
        mergeStartRow,
        3,
        mergeEndRow,
        3
    );

    // Quarter
    worksheet.mergeCells(
        mergeStartRow,
        4,
        mergeEndRow,
        4
    );

    // Status
    worksheet.mergeCells(
        mergeStartRow,
        5,
        mergeEndRow,
        5
    );

    // Submitted Date
    worksheet.mergeCells(
        mergeStartRow,
        6,
        mergeEndRow,
        6
    );

    // Total Questions
    worksheet.mergeCells(
        mergeStartRow,
        worksheet.columnCount - 2,
        mergeEndRow,
        worksheet.columnCount - 2
    );

    // Answered
    worksheet.mergeCells(
        mergeStartRow,
        worksheet.columnCount - 1,
        mergeEndRow,
        worksheet.columnCount - 1
    );

    // NIL
    worksheet.mergeCells(
        mergeStartRow,
        worksheet.columnCount,
        mergeEndRow,
        worksheet.columnCount
    );

    // Alignment
    [

        1,
        2,
        3,
        4,
        5,
        6,

        worksheet.columnCount - 2,

        worksheet.columnCount - 1,

        worksheet.columnCount

    ].forEach(col => {

        worksheet.getCell(
            mergeStartRow,
            col
        ).alignment = {

            vertical: "middle",

            horizontal: "center",

            wrapText: true

        };

    });

}

// Blank Row Between Deans

worksheet.addRow([]);

}); // deanUsers.forEach

// Blank Row Between Quarters

worksheet.addRow([]);

}); // quarters.forEach

} // generateDeanSheet

exports.generateFacultySheet = generateFacultySheet;

exports.generateHodSheet = generateHodSheet;

exports.generateDeanSheet = generateDeanSheet;