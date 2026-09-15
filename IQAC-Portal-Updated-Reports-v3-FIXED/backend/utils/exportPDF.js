const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const generatePDF = (
  res,
  submission,
  questionsData
) => {

  doc.pipe(res);

  // ======================================
  // CONSTANTS
  // ======================================

  const PAGE_WIDTH =
doc.page.width - 40;

  // ======================================
  // HEADER
  // ======================================

  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("#000")
    .text(
      "SRIHER IQAC Report",
      {
        align: "center"
      }
    );

  doc.moveDown();

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("black");

  doc.text(
    `Name : ${submission.submittedByName || "N/A"}`
  );

  doc.text(
    `Email : ${submission.submittedByEmail || "N/A"}`
  );

  doc.text(
    `Role : ${submission.role}`
  );

  doc.text(
    `School : ${submission.school}`
  );

  doc.text(
    `Department : ${submission.department}`
  );

  doc.text(
    `Quarter : ${submission.quarter === "POOLED" ? "Yearly / pooled (Q1-Q4)" : submission.quarter}`
  );

  doc.text(
    `Status : ${submission.status}`
  );

  doc.text(
    `Answered : ${submission.answeredCount}`
  );

  doc.text(
    `Unanswered : ${submission.unansweredCount}`
  );

  doc.text(
    `Submitted Date : ${
      submission.createdAt
        ? new Date(
            submission.createdAt
          ).toLocaleDateString("en-GB")
        : "-"
    }`
  );

  doc.moveDown(2);

  // ======================================
  // ANSWER MAP
  // ======================================

  const answerMap = {};

  submission.answers?.forEach(
    (item) => {

      answerMap[item.questionNo] =
        item.answer;

    }
  );

  // ======================================
  // START SECTIONS
  // ======================================

  questionsData.forEach(
    (section) => {
            // ======================================
      // PAGE BREAK BEFORE SECTION
      // ======================================

      if (
        doc.y + 80 >
        doc.page.height - 60
      ) {

        doc.addPage();

      }

      // ======================================
      // SECTION HEADER
      // ======================================

      doc
        .strokeColor("#dc2626")
        .lineWidth(2)
        .moveTo(
          40,
          doc.y
        )
        .lineTo(
          PAGE_WIDTH,
          doc.y
        )
        .stroke();

      doc.moveDown(0.5);

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor("#dc2626")
        .text(
          `Section ${section.sectionNo} - ${section.sectionTitle}`,
          40,
          doc.y,
          {
            width: PAGE_WIDTH - 40,
            align: "left"
          }
        );

      doc.moveDown(0.5);

      doc
        .strokeColor("#dc2626")
        .lineWidth(2)
        .moveTo(
          40,
          doc.y
        )
        .lineTo(
          PAGE_WIDTH,
          doc.y
        )
        .stroke();

      doc.moveDown();

      // ======================================
      // QUESTIONS
      // ======================================

      section.questions.forEach(

        (
          question,
          index
        ) => {

          const key =
`${section.sectionNo}_${index}`;

          const answer =
answerMap[key];

          const isImage =
question.answerFormat?.includes(
"Image"
);

          const isFile =
typeof answer === "string" &&
answer.startsWith("/uploads/");

// Page Break

if (
  doc.y + 150 >
  doc.page.height - 50
) {
  doc.addPage();
}

// ======================================
// QUESTION
// ======================================

doc
  .font("Helvetica-Bold")
  .fontSize(11)
  .fillColor("black")
  .text(
    question.question,
    40,
    doc.y
  );

doc.moveDown(0.3);

doc
  .font("Helvetica")
  .fontSize(11);

          // ======================================
          // IMAGE ANSWER
          // ======================================

          if (
            isImage &&
            answer
          ) {

            const imagePath =
              path.join(
                process.cwd(),
                answer.replace("/", "")
              );

            if (
              fs.existsSync(imagePath)
            ) {

              doc.image(
imagePath,
40,
doc.y,
{
width:80,
height:80
});

// Move cursor below image
doc.y += 95;

              doc
                .fillColor("blue")
                .fontSize(10)
                .text(
"View Image",
{
underline:true,
link:`http://localhost:5000${answer}`
}
);

doc.moveDown(0.5);

              doc.fillColor("black");


            }

            else {

             doc
  .fillColor("red")
  .fontSize(11)
  .text(
    "Image Not Found"
  );

doc.moveDown(0.5);
                

            }

          }

          // ======================================
          // FILE ANSWER
          // ======================================

          else if (
            isFile
          ) {

            const ext =
              path.extname(answer)
                .toLowerCase();

           let icon = "[FILE]";

if (
    ext === ".pdf"
) {
    icon = "[PDF]";
}

else if (
    ext === ".doc" ||
    ext === ".docx"
) {
    icon = "[DOC]";
}

else if (
    ext === ".xls" ||
    ext === ".xlsx"
) {
    icon = "[XLS]";
}

else if (
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".png"
) {
    icon = "[IMG]";
}

            doc
              .fillColor("blue")
              .fontSize(11)
              .text(
`${icon} ${path.basename(answer)}`,
{
width:500,
underline:true,
link:`http://localhost:5000${answer}`
}
);

doc.moveDown(0.5);

            doc.fillColor("black");
          }

          // ======================================
          // NORMAL ANSWER
          // ======================================

          else {

            const displayAnswer =
              answer
                ? String(answer)
                : "This is a mandatory field";

            doc
              .fillColor("black")
              .fontSize(11)
              .text(
displayAnswer,
{
width: PAGE_WIDTH - 40
}
);

doc.moveDown(0.5);


          }
                    // ======================================
          // ROW SEPARATOR
          // ======================================

          doc.moveDown(0.5);

doc
.moveTo(
40,
doc.y
)
.lineTo(
PAGE_WIDTH,
doc.y
)
.strokeColor("#dddddd")
.lineWidth(1)
.stroke();

doc.moveDown();


        }

      );

      doc.moveDown(0.5);

    }

  );

  doc.end();

};

module.exports =
generatePDF;