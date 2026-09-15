const express =
  require("express");

const router =
  express.Router();

const Question =
  require("../models/Question");

router.get(
  "/:role",
  async (req, res) => {

    try {

      const questions =
        await Question.find({
          role: req.params.role
        }).sort({
          sectionNo: 1,
          questionNo: 1
        });

      res.json(questions);

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

  }
);

module.exports =
  router;