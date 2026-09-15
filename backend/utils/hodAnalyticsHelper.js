const User = require("../models/User");
const Submission = require("../models/Submission");

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

async function buildHodAnalytics(hodUser) {

    // ===============================
    // HOD DETAILS
    // ===============================

    const school = hodUser.school;

    const department = hodUser.department;

    // ===============================
    // LOAD FACULTY
    // ===============================

    const facultyList = await User.find({

        role: "faculty",

        school,

        department

    })
    .select(
        "name email department school"
    )
    .sort({
        name: 1
    });

    // ===============================
    // LOAD SUBMISSIONS
    // ===============================

    const submissions =
        await Submission.find({

            role: "faculty",

            school,

            department

        })

        .populate(
            "submittedBy",
            "name email"
        )

        .sort({

            createdAt: -1

        });

    // ===============================
    // BASIC SUMMARY
    // ===============================

    const summary = {

        totalFaculty:

            facultyList.length,

        totalSubmitted: 0,

        totalPending: 0,

        totalApproved: 0,

        totalRejected: 0,

        totalNotSubmitted: 0

    };

    // ===============================
    // BAR CHART
    // ===============================

    const chartData = [];

    // ===============================
    // QUARTER DATA
    // ===============================

    const quarterData = {};

    // ===============================
    // LOOP ALL QUARTERS
    // ===============================

    for (const quarter of QUARTERS) {

        // Next Part-la logic varum

        quarterData[quarter] = {

            submittedFaculty: [],

            pendingFaculty: [],

            approvedFaculty: [],

            rejectedFaculty: [],

            notSubmittedFaculty: []

        };

    }

    for (const quarter of QUARTERS) {

    // ===============================
    // CURRENT QUARTER SUBMISSIONS
    // ===============================

    const quarterSubmissions = submissions.filter(

        (submission) =>

            submission.quarter === quarter

    );

    // ===============================
    // SUBMITTED
    // ===============================

    const submittedFaculty = quarterSubmissions.map((submission) => ({
    _id: submission._id,

    submittedBy: submission.submittedBy,

    submittedByName: submission.submittedByName,

    submittedByEmail: submission.submittedByEmail,

    department: submission.department,

    school: submission.school,

    quarter: submission.quarter,

    answeredCount: submission.answeredCount,

    totalQuestions: submission.totalQuestions,

    createdAt: submission.createdAt,

    status: submission.status,

    hodRemarks: submission.hodRemarks,

    answers: submission.answers || [],

    tableData: submission.tableData || {},

    uploadedFiles: submission.uploadedFiles || []
}));

    // ===============================
    // PENDING
    // ===============================

    const pendingFaculty = submittedFaculty.filter(
    (submission) =>
        submission.status === "Pending HOD Approval"
);

const approvedFaculty = submittedFaculty.filter(
    (submission) =>
        submission.status === "Approved by HOD"
);

const rejectedFaculty = submittedFaculty.filter(
    (submission) =>
        submission.status === "Rejected by HOD"
);


    // ===============================
    // NOT SUBMITTED
    // ===============================

    const submittedIds =
        quarterSubmissions.map(

            (submission) =>

                submission.submittedBy._id.toString()

        );

    const notSubmittedFaculty =
        facultyList.filter(

            (faculty) =>

                !submittedIds.includes(
                    faculty._id.toString()
                )

        );

    // ===============================
    // STORE QUARTER DATA
    // ===============================

    quarterData[quarter] = {

        submittedFaculty,

        pendingFaculty,

        approvedFaculty,

        rejectedFaculty,

        notSubmittedFaculty

    };

    // ===============================
    // BAR CHART
    // ===============================

    chartData.push({

        quarter,

        submitted:
            submittedFaculty.length,

        pending:
            pendingFaculty.length,

        approved:
            approvedFaculty.length,

        rejected:
            rejectedFaculty.length,

        notSubmitted:
            notSubmittedFaculty.length

    });

}
// ===============================
// DEFAULT SUMMARY (Q1)
// ===============================

const defaultQuarter = "Q1";

summary.totalSubmitted =
    quarterData[defaultQuarter]
        .submittedFaculty.length;

summary.totalPending =
    quarterData[defaultQuarter]
        .pendingFaculty.length;

summary.totalApproved =
    quarterData[defaultQuarter]
        .approvedFaculty.length;

summary.totalRejected =
    quarterData[defaultQuarter]
        .rejectedFaculty.length;

summary.totalNotSubmitted =
    quarterData[defaultQuarter]
        .notSubmittedFaculty.length;

// ===============================
// RETURN
// ===============================

return {

    summary,

    facultyList,

    chartData,

    quarterData

};

}

module.exports = {

    buildHodAnalytics

};