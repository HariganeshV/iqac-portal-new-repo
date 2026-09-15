const PDFDocument =
  require("pdfkit");

const Submission =
  require("../models/Submission");

exports.downloadSubmissionReport =
  async (req, res) => {
    try {

      const submission =
  await Submission.findById(
    req.params.id
  );

      if (!submission) {
        return res.status(404).json({
          success: false,
          message:
            "Submission not found"
        });
      }

      const doc =
        new PDFDocument({
          margin: 40
        });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${submission.role}_report.pdf`
      );

      doc.pipe(res);

      doc
        .fontSize(18)
        .text(
          "SRIHER IQAC Portal Report",
          {
            align: "center"
          }
        );

      doc.moveDown();

      doc
  .fontSize(12)
  .text(
    `Name: ${
      submission.submittedByName ||
      "N/A"
    }`
  );

doc.text(
  `Email: ${
      submission.submittedByEmail ||
      "N/A"
    }`
);

      doc.text(
        `Role: ${submission.role}`
      );

      doc.text(
        `School: ${submission.school}`
      );

      doc.text(
        `Department: ${submission.department}`
      );

      doc.text(
        `Quarter: ${submission.quarter}`
      );

      doc.text(
        `Year: ${submission.year}`
      );

      doc.text(
        `Status: ${submission.status}`
      );

      doc.moveDown();

      doc
        .fontSize(14)
        .text("Questionnaire");

      doc.moveDown();

      if (
        submission.answers &&
        submission.answers.length >
          0
      ) {

        submission.answers.forEach(
          (item) => {

            doc
              .fontSize(12)
              .text(
                `Q${item.questionNo}`
              );

            doc.text(
              `Question: ${
                item.question ||
                "-"
              }`
            );

            doc.text(
              `Answer: ${
                item.answer ||
                "-"
              }`
            );

            doc.moveDown();
          }
        );

      } else {

        doc.text(
          "No answers available"
        );

      }

      if (
        submission.hodRemarks
      ) {
        doc.text(
          `HOD Remarks: ${submission.hodRemarks}`
        );
      }

      if (
        submission.deanRemarks
      ) {
        doc.text(
          `Dean Remarks: ${submission.deanRemarks}`
        );
      }

      doc.end();

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };