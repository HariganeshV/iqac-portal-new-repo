const deanQuestions = [

  // =========================================
  // QUESTION 1
  // =========================================

  {
    sectionNo: "1",

    sectionTitle: "Year of Establishment",

    type: "singleRecord",

    fields: [

      {
        key: "yearOfEstablishment",
        label: "Year of Establishment",
        answerFormat: "Numeric",
        required: true
      }

    ]

  },

  // =========================================
  // QUESTION 2
  // =========================================

  {
    sectionNo: "2",

    sectionTitle: "College / Faculty of the University",

    type: "singleRecord",

    fields: [

      {
        key: "collegeFaculty",
        label: "College / Faculty of the University",
        answerFormat: "Text",
        required: true
      }

    ]

  },

  // =========================================
  // QUESTION 5
  // =========================================

  {
    sectionNo: "5",

    sectionTitle:
      "Number of Teaching Posts Sanctioned / Filled",

    type: "singleRecord",

    fields: [

      {
        key: "sanctionedPosts",
        label: "Sanctioned Posts",
        answerFormat: "Numeric",
        required: true
      },

      {
        key: "filledPosts",
        label: "Filled Posts",
        answerFormat: "Numeric",
        required: true
      }

    ]

  },
    // =========================================
  // QUESTION 6
  // =========================================

  {
    sectionNo: "6",

    sectionTitle: "Name of Programmes Offered",

    type: "table",

    tableColumns: [

      {
        key: "programmeCode",
        label: "Programme Code",
        answerFormat: "Text"
      },

      {
        key: "programmeName",
        label: "Programme Name",
        answerFormat: "Text"
      },

      {
        key: "startDate",
        label: "Date / Year of Starting the Programme",
        answerFormat: "DD/MM/YYYY"
      },

      {
        key: "academicCouncilMinutes",
        label: "Minutes of Relevant Academic Council / BoS Meeting",
        answerFormat: "PDF/Word Upload"
      },

      {
        key: "revisedCurriculumDetails",
        label: "Details of Revised Curriculum / Syllabus",
        answerFormat: "PDF/Word Upload"
      },

      {
        key: "syllabusRevisionDate",
        label: "Syllabus Prior and Post Revision Date",
        answerFormat: "DD/MM/YYYY"
      },

      {
        key: "otherRelevantDocument",
        label: "Any Other Relevant Document",
        answerFormat: "PDF/Word Upload"
      },

      {
        key: "ictClasses",
        label: "Number of Classes Taken Using ICT",
        answerFormat: "Numeric"
      },

      {
        key: "lmsClasses",
        label: "Number of Classes Taken Using LMS / Moodle",
        answerFormat: "Numeric"
      },

      {
        key: "elearningClasses",
        label: "Number of Classes Taken Using E-Learning Resources",
        answerFormat: "Numeric"
      },

      {
        key: "mentorMenteeActivities",
        label: "Number of Mentor-Mentee Activities",
        answerFormat: "Numeric"
      }

    ]

  },
    // =========================================
  // QUESTION 8
  // =========================================

  {
    sectionNo: "8",

    sectionTitle:
      "Value Added / Certificate / Skill Development Courses",

    type: "table",

    tableColumns: [

      {
        key: "courseName",
        label: "Course Name",
        answerFormat: "Text"
      },

      {
        key: "courseType",
        label: "Course Type",
        answerFormat: "Dropdown",
        options: [
          "Value Added",
          "Certificate",
          "Skill Development",
          "Bridge Course",
          "Other"
        ]
      },

      {
        key: "numberOfStudents",
        label: "Number of Students Enrolled",
        answerFormat: "Numeric"
      },

      {
        key: "courseDuration",
        label: "Course Duration",
        answerFormat: "Text"
      },

      {
        key: "courseStartDate",
        label: "Course Start Date",
        answerFormat: "DD/MM/YYYY"
      },

      {
        key: "courseEndDate",
        label: "Course End Date",
        answerFormat: "DD/MM/YYYY"
      },

     {
  key: "sdgGoals",
  label: "Related SDG Goals",
  type: "multiSelect",
  options: [
    "SDG 1 - No Poverty",
    "SDG 2 - Zero Hunger",
    "SDG 3 - Good Health and Well-being",
    "SDG 4 - Quality Education",
    "SDG 5 - Gender Equality",
    "SDG 6 - Clean Water and Sanitation",
    "SDG 7 - Affordable and Clean Energy",
    "SDG 8 - Decent Work and Economic Growth",
    "SDG 9 - Industry, Innovation and Infrastructure",
    "SDG 10 - Reduced Inequalities",
    "SDG 11 - Sustainable Cities and Communities",
    "SDG 12 - Responsible Consumption and Production",
    "SDG 13 - Climate Action",
    "SDG 14 - Life Below Water",
    "SDG 15 - Life on Land",
    "SDG 16 - Peace, Justice and Strong Institutions",
    "SDG 17 - Partnerships for the Goals"
  ]
},

      {
        key: "courseApproval",
        label: "Course Approval Document",
        answerFormat: "PDF/Word Upload"
      },

      {
        key: "courseReport",
        label: "Course Completion Report",
        answerFormat: "PDF/Word Upload"
      }

    ]

  },
    // =========================================
  // QUESTION 9
  // =========================================

  {
    sectionNo: "9",

    sectionTitle:
      "Extension Activities / Outreach Programmes",

    type: "table",

    tableColumns: [

      {
        key: "activityName",
        label: "Activity Name",
        answerFormat: "Text"
      },

      {
        key: "organizingDepartment",
        label: "Organizing Department",
        answerFormat: "Text"
      },

      {
        key: "activityDate",
        label: "Date of Activity",
        answerFormat: "DD/MM/YYYY"
      },

      {
        key: "numberOfParticipants",
        label: "Number of Participants",
        answerFormat: "Numeric"
      },

      {
        key: "beneficiaries",
        label: "Beneficiaries",
        answerFormat: "Text"
      },

     {
  key: "sdgGoals",
  label: "Related SDG Goals",
  type: "multiSelect",
  options: [
    "SDG 1 - No Poverty",
    "SDG 2 - Zero Hunger",
    "SDG 3 - Good Health and Well-being",
    "SDG 4 - Quality Education",
    "SDG 5 - Gender Equality",
    "SDG 6 - Clean Water and Sanitation",
    "SDG 7 - Affordable and Clean Energy",
    "SDG 8 - Decent Work and Economic Growth",
    "SDG 9 - Industry, Innovation and Infrastructure",
    "SDG 10 - Reduced Inequalities",
    "SDG 11 - Sustainable Cities and Communities",
    "SDG 12 - Responsible Consumption and Production",
    "SDG 13 - Climate Action",
    "SDG 14 - Life Below Water",
    "SDG 15 - Life on Land",
    "SDG 16 - Peace, Justice and Strong Institutions",
    "SDG 17 - Partnerships for the Goals"
  ]
},

      {
        key: "activityReport",
        label: "Activity Report",
        answerFormat: "PDF/Word Upload"
      },

      {
        key: "activityPhotos",
        label: "Activity Photos",
        answerFormat: "Image Upload"
      }

    ]

  }

];

module.exports = deanQuestions;