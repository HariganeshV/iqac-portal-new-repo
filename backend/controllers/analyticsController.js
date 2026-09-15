const Submission = require("../models/Submission");
const User = require("../models/User");
const {
    buildHodAnalytics
} = require("../utils/hodAnalyticsHelper");

// ==============================
// OVERALL ANALYTICS
// ==============================

exports.getOverallAnalytics =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find();

      const totalSubmissions =
        submissions.length;

      const totalQuestions =
        submissions.reduce(
          (sum, item) =>
            sum + (item.totalQuestions || 0),
          0
        );

      const totalAnswered =
        submissions.reduce(
          (sum, item) =>
            sum + (item.answeredCount || 0),
          0
        );

      const totalUnanswered =
        submissions.reduce(
          (sum, item) =>
            sum + (item.unansweredCount || 0),
          0
        );

      const completionPercentage =
        totalQuestions > 0
          ? (
              (totalAnswered /
                totalQuestions) *
              100
            ).toFixed(2)
          : 0;

      res.status(200).json({
        success: true,

        analytics: {
          totalSubmissions,
          totalQuestions,
          totalAnswered,
          totalUnanswered,
          completionPercentage
        }
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };


// ==============================
// DEPARTMENT ANALYTICS
// ==============================

exports.getDepartmentAnalytics =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find();

      const departmentMap = {};

      submissions.forEach(
        (submission) => {

          const department =
            submission.department;

          if (
            !departmentMap[
              department
            ]
          ) {
            departmentMap[
              department
            ] = {

              department,

              totalSubmissions: 0,

              totalQuestions: 0,

              totalAnswered: 0,

              totalUnanswered: 0
            };
          }

          departmentMap[
            department
          ].totalSubmissions += 1;

          departmentMap[
            department
          ].totalQuestions +=
            submission.totalQuestions || 0;

          departmentMap[
            department
          ].totalAnswered +=
            submission.answeredCount || 0;

          departmentMap[
            department
          ].totalUnanswered +=
            submission.unansweredCount || 0;
        }
      );

      const analytics =
        Object.values(
          departmentMap
        ).map(
          (department) => ({
            ...department,

            completionPercentage:
              department.totalQuestions > 0
                ? (
                    (department.totalAnswered /
                      department.totalQuestions) *
                    100
                  ).toFixed(2)
                : 0
          })
        );

      res.status(200).json({
        success: true,
        count: analytics.length,
        analytics
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };


// ==============================
// SCHOOL ANALYTICS
// ==============================

exports.getSchoolAnalytics =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find();

      const schoolMap = {};

      submissions.forEach(
        (submission) => {

          const school =
            submission.school;

          if (
            !schoolMap[
              school
            ]
          ) {
            schoolMap[
              school
            ] = {

              school,

              totalSubmissions: 0,

              totalQuestions: 0,

              totalAnswered: 0,

              totalUnanswered: 0
            };
          }

          schoolMap[
            school
          ].totalSubmissions += 1;

          schoolMap[
            school
          ].totalQuestions +=
            submission.totalQuestions || 0;

          schoolMap[
            school
          ].totalAnswered +=
            submission.answeredCount || 0;

          schoolMap[
            school
          ].totalUnanswered +=
            submission.unansweredCount || 0;
        }
      );

      const analytics =
        Object.values(
          schoolMap
        ).map(
          (school) => ({
            ...school,

            completionPercentage:
              school.totalQuestions > 0
                ? (
                    (school.totalAnswered /
                      school.totalQuestions) *
                    100
                  ).toFixed(2)
                : 0
          })
        );

      res.status(200).json({
        success: true,
        count: analytics.length,
        analytics
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  };

  // ==============================
// QUESTION ANALYTICS
// ==============================

exports.getQuestionAnalytics =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find();

      const questionMap = {};

      submissions.forEach(
        (submission) => {

          if (
            !submission.answers ||
            !Array.isArray(
              submission.answers
            )
          ) {
            return;
          }

          submission.answers.forEach(
            (answer) => {

              if (
                !answer.questionNo ||
                !answer.question
              ) {
                return;
              }

              const key =
                answer.questionNo;

              if (
                !questionMap[key]
              ) {
                questionMap[key] = {
                  questionNo:
                    answer.questionNo,

                  question:
                    answer.question,

                  answeredCount: 0
                };
              }

              questionMap[
                key
              ].answeredCount += 1;
            }
          );
        }
      );

      const analytics =
        Object.values(
          questionMap
        ).sort(
          (a, b) =>
            a.questionNo -
            b.questionNo
        );

      res.status(200).json({
        success: true,
        count: analytics.length,
        analytics
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };
// ==============================
// QUESTION SUMMARY ANALYTICS
// ==============================

exports.getQuestionSummaryAnalytics =
  async (req, res) => {
    try {

      const submissions =
        await Submission.find();

      const questionMap = {};

      submissions.forEach(
        (submission) => {

          if (
            !submission.answers ||
            !Array.isArray(
              submission.answers
            )
          ) {
            return;
          }

          submission.answers.forEach(
            (answer) => {

              if (
                !answer.questionNo ||
                !answer.question
              ) {
                return;
              }

              const key =
                answer.questionNo;

              if (
                !questionMap[key]
              ) {
                questionMap[key] = {
                  questionNo:
                    answer.questionNo,

                  question:
                    answer.question,

                  answeredCount: 0
                };
              }

              questionMap[
                key
              ].answeredCount += 1;
            }
          );
        }
      );

      const analytics =
        Object.values(
          questionMap
        );

      if (
        analytics.length === 0
      ) {
        return res.status(200).json({
          success: true,
          message:
            "No question analytics found"
        });
      }

      const mostAnsweredQuestion =
        analytics.reduce(
          (prev, current) =>
            current.answeredCount >
            prev.answeredCount
              ? current
              : prev
        );

      const leastAnsweredQuestion =
        analytics.reduce(
          (prev, current) =>
            current.answeredCount <
            prev.answeredCount
              ? current
              : prev
        );

      res.status(200).json({
        success: true,

        mostAnsweredQuestion,

        leastAnsweredQuestion
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message
      });

    }
  };
// ==============================
// HOD ANALYTICS
// ==============================

exports.getHodAnalytics = async (req, res) => {

    try {

        const analytics =
            await buildHodAnalytics(
                req.user
            );

        // 👇 Temporary Debug
        console.log("HOD Analytics Response:");
        console.log(analytics);

        return res.status(200).json({

            success: true,

            ...analytics

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};