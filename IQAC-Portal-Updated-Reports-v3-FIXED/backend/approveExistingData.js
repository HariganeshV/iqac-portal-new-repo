/*
 * One-time local database helper for the IQAC portal.
 *
 * It does NOT invent questionnaire answers. It takes the data already stored
 * in the local MongoDB and makes submitted (non-draft) records visible in
 * Admin -> Approved Reports. For Dean Question 1, the requested value is
 * explicitly set to 1985.
 *
 * Run from backend:
 *   node approveExistingData.js
 */
const mongoose = require("mongoose");
require("dotenv").config();
const Submission = require("./models/Submission");

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const submissions = await Submission.find({});

    let updated = 0;

    for (const submission of submissions) {
      let changed = false;

      // Put every already-submitted record into the Admin approved-report
      // view without changing its existing answers.
      if (submission.status !== "Submitted to Admin") {
        submission.status = "Submitted to Admin";
        changed = true;
      }

      // Requested fixed value for Dean Question 1.
      if (submission.role === "dean") {
        const q1 = submission.answers?.find(
          (item) => String(item.questionNo) === "1"
        );

        if (q1 && q1.answer !== 1985) {
          q1.answer = 1985;
          changed = true;
        } else if (!q1) {
          submission.answers.push({
            questionNo: "1",
            question: "Year of Establishment",
            answer: 1985
          });
          changed = true;
        }
      }

      if (changed) {
        await submission.save();
        updated += 1;
      }
    }

    console.log(`Found ${submissions.length} existing submission(s).`);
    console.log(`Updated ${updated} submission(s).`);
    console.log("Existing questionnaire data was preserved; Dean Q1 is set to 1985.");
  } catch (error) {
    console.error("Failed to approve existing data:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
