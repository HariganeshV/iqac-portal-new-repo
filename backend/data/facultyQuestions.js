const facultyQuestions = [

  {
    sectionNo: 3,
    sectionTitle: "Faculty Details",
    repeatable: true,
    questions: [
                  {
        question: "Enter Name of the Faculty",
        answerFormat: "Text"
      },
      {
        question: "Upload Faculty Photo",
        answerFormat: "Image Upload (JPG/JPEG/PNG)"
      },
      {
        question: "Enter Designation",
        answerFormat: "Text"
      },
      {
        question: "Select Employment Type",
        answerFormat: "Dropdown",
        options: [
          "Permanent",
          "Temporary"
        ]
      },
      {
        question: "Enter Date/Year of Appointment",
        answerFormat: "DD/MM/YYYY"
      },
      {
        question: "Enter Date of Relieving (if applicable)",
        answerFormat: "DD/MM/YYYY"
      },
      {
        question: "Enter SCOPUS Author ID",
        answerFormat: "Numeric"
      },
      {
        question: "Enter VIDWAN ID",
        answerFormat: "Numeric"
      }
    ]
  },

  {
    sectionNo: 10,
    sectionTitle:
      "List of e-contents / e-courses / video lectures / demonstrations developed",
    repeatable: true,
    questions: [
         {
        question: "Date/Year of Uploaded",
        answerFormat: "DD/MM/YYYY"
      },
      {
        question:
          "Title of e-content / e-courses / video lectures / demonstrations developed",
        answerFormat: "Text"
      },
      {
        question:
          "Submitted for Learning Management System",
        answerFormat: "Dropdown",
        options: [
          "Yes",
          "No"
        ]
      },
      {
        question: "Moodle Link",
        answerFormat: "URL"
      },
      {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
    ]
  },

  {
    sectionNo: 11,
    sectionTitle:
      "Details of Research Projects and Grants Received - Extramural",
    repeatable: true,
    questions: [
           {
        question:
          "Title of the Project",
        answerFormat: "Text"
      },
      {
        question:
          "Type of Project",
        answerFormat: "Dropdown",
        options: [
          "Major",
          "Minor",
          "Industry Sponsored",
          "Any Other"
        ]
      },
      {
        question:
          "Name of the Principal Investigator",
        answerFormat: "Text"
      },
      {
        question:
          "Department of Principal Investigator",
        answerFormat: "Text"
      },
      {
        question:
          "Name of the Co-Investigator(s)",
        answerFormat: "Text"
      },
      {
        question:
          "Department of Co-Investigator(s)",
        answerFormat: "Text"
      },
      {
        question:
          "Name of the Funding Agency",
        answerFormat: "Text"
      },
      {
        question:
          "Date/Year in which started & Duration",
        answerFormat:
          "DD/MM/YYYY + Duration"
      },
      {
        question:
          "Total Grant (Rs.)",
        answerFormat: "Numeric"
      },
      {
        question:
          "Sanctioned Amount for the Year (Rs.)",
        answerFormat: "Numeric"
      },
      {
        question:
          "Project Level",
        answerFormat: "Dropdown",
        options: [
          "State",
          "National",
          "International"
        ]
      },
      {
        question:
          "Sanction Order",
        answerFormat:
          "PDF Upload"
      },
      {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
    ]
  },

  {
    sectionNo: 12,
    sectionTitle:
      "Details of Research Projects and Grants Received - Extramural Students",
    repeatable: true,
    questions: [
      {
        question:
          "Title of the Project",
        answerFormat: "Text"
      },
      {
        question:
          "Type of Project",
        answerFormat: "Dropdown",
        options: [
          "Major",
          "Minor",
          "Industry Sponsored",
          "Any Other"
        ]
      },
      {
        question:
          "Name of the Student",
        answerFormat: "Text"
      },
      {
        question:
          "Programme",
        answerFormat: "Text"
      },
      {
        question:
          "Name of the Guide",
        answerFormat: "Text"
      },
      {
        question:
          "Name of the Funding Agency",
        answerFormat: "Text"
      },
      {
        question:
          "Date/Year in which started & Duration",
        answerFormat:
          "DD/MM/YYYY + Duration"
      },
      {
        question:
          "Total Grant (Rs.)",
        answerFormat: "Numeric"
      },
      {
        question:
          "Sanctioned Amount for the Year (Rs.)",
        answerFormat: "Numeric"
      },
      {
        question:
          "Project Level",
        answerFormat: "Dropdown",
        options: [
          "State",
          "National",
          "International"
        ]
      },
      {
        question:
          "Sanction Order",
        answerFormat:
          "PDF Upload"
      },
      {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
    ]
  },

  {
    sectionNo: 13,
    sectionTitle:
      "Inter-Institutional Collaborative Projects and Associated Grants Received",
    repeatable: true,
    questions: [
      {
        question:
          "Title of the Project",
        answerFormat: "Text"
      },
      {
        question:
          "National / International Collaboration",
        answerFormat: "Dropdown",
        options: [
          "National",
          "International"
        ]
      },
      {
        question:
          "Name of the Principal Investigator",
        answerFormat: "Text"
      },
      {
        question:
          "Department of Principal Investigator",
        answerFormat: "Text"
      },
      {
        question:
          "Name of the Co-Investigator(s)",
        answerFormat: "Text"
      },
      {
        question:
          "Department of Co-Investigator(s)",
        answerFormat: "Text"
      },
      {
        question:
          "Collaborating Institution and Name of Funding Agency",
        answerFormat: "Text"
      },
      {
        question:
          "Date/Year in which started & Duration",
        answerFormat:
          "DD/MM/YYYY + Duration"
      },
      {
        question:
          "Total Grant (Rs.)",
        answerFormat: "Numeric"
      },
      {
        question:
          "Sanctioned Amount for the Year (Rs.)",
        answerFormat: "Numeric"
      },
      {
        question:
          "Upload PDF",
        answerFormat:
          "PDF Upload"
      },
      {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
    ]
  },

  {
  sectionNo: 15,
  sectionTitle:
    "Seed Money (GATE) Received by Teachers for Research from the University",
  repeatable: true,
  questions: [
   {
      question: "Name of the Project",
      answerFormat: "Text"
    },
    {
      question: "Duration of the Project",
      answerFormat: "YYYY-YYYY"
    },
    {
      question:
        "Name(s) of the Teacher(s) Working in the Project Receiving Seed Money",
      answerFormat: "Multi Text"
    },
    {
      question:
        "Amount of Seed Money Provided (Rs.)",
      answerFormat: "Numeric"
    },
    {
      question:
        "Date/Year of Receiving the Seed Money",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question:
        "PDF Sanction Order",
      answerFormat: "PDF Upload"
    },
    {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
  ]
},

{
  sectionNo: 17,
  sectionTitle:
    "Publications in Reputed Indexed Journals",
  repeatable: true,
  questions: [
      {
      question: "DOI Number",
      answerFormat: "Text"
    },
    {
      question: "Title of Paper",
      answerFormat: "Text"
    },
    {
      question: "Name(s) of Author(s)",
      answerFormat: "Multi Text"
    },
    {
      question: "Department",
      answerFormat: "Text"
    },
    {
      question:
        "Name of the Journal",
      answerFormat: "Text"
    },
    {
      question:
        "Date/Year of Publication",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question:
        "Page Number (Start-End)",
      answerFormat: "Text"
    },
    {
      question:
        "ISSN Number",
      answerFormat: "Text",
      mandatory: true
    },
    {
  question: "Indexing Database",
  answerFormat: "Multi Select",
  options: [
    "Scopus",
    "WoS",
    "PubMed"
  ]
},
    {
      question:
        "Impact Factor",
      answerFormat:
        "Decimal Number"
    },
    {
      question:
        "PDF of Published Paper",
      answerFormat:
        "PDF Upload"
    },
    {
      question:
        "APC Amount Paid by the Institution",
      answerFormat:
        "Numeric"
    },
    {
      question:
        "Proof of APC Payment by University",
      answerFormat:
        "PDF Upload"
    },
    {
      question:
        "Publication Level",
      answerFormat:
        "Dropdown",
      options: [
        "State",
        "National",
        "International"
      ]
    },
   {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
  ]
},

{
  sectionNo: 18,
  sectionTitle:
    "Details of Patents and Income Generated",
  repeatable: true,
  questions: [
    {
      question:
        "Name of the Patentee / Copyright Awardee",
      answerFormat: "Text"
    },
    {
      question:
        "Patent / Copyright",
      answerFormat:
        "Dropdown",
      options: [
        "Patent",
        "Copyright"
      ]
    },
    {
      question:
        "Status",
      answerFormat:
        "Dropdown",
      options: [
        "Filed",
        "Published",
        "Granted"
      ]
    },
    {
      question:
        "Patent / Copyright Number",
      answerFormat:
        "Text"
    },
    {
      question:
        "Patent Title",
      answerFormat:
        "Text"
    },
    {
      question:
        "Date/Year of Patent Awarded / Published",
      answerFormat:
        "DD/MM/YYYY"
    },
    {
      question:
        "Annual Income Generated (Rs.)",
      answerFormat:
        "Numeric"
    },
    {
      question:
        "Patent / Copyright Certificate",
      answerFormat:
        "PDF Upload"
    },
    {
      question:
        "Link to Patent Website",
      answerFormat:
        "URL"
    },
    {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
  ]
},

{
  sectionNo: 19,
  sectionTitle:
    "Details of Books / Chapters Published",
  repeatable: true,
  questions: [
      {
      question:
        "Name of the Book",
      answerFormat:
        "Text"
    },
    {
      question:
        "Name of the Author(s)",
      answerFormat:
        "Multi Text"
    },
    {
      question:
        "Name of the Publisher",
      answerFormat:
        "Text",
      mandatory: true
    },
    {
      question:
        "Title of the Chapter",
      answerFormat:
        "Text"
    },
    {
      question:
        "Date/Year Published",
      answerFormat:
        "DD/MM/YYYY"
    },
    {
      question:
        "ISBN Number",
      answerFormat:
        "Text",
      mandatory: true
    },
    {
      question:
        "PDF Scanned Front Cover of the Book / Chapter",
      answerFormat:
        "PDF Upload"
    },
   {
  question: "Indexing Database",
  answerFormat: "Multi Select",
  options: [
    "Scopus",
    "WoS",
    "PubMed"
  ]
},
    {
      question:
        "Publication Level",
      answerFormat:
        "Dropdown",
      options: [
        "State",
        "National",
        "International"
      ]
    },
    {
      question:
        "Page Number (From-To)",
      answerFormat:
        "Text"
    },
    {
      question:
        "Correlated to SDG Goals",
      answerFormat:
        "Multi Select",
      options: [
        "1. No Poverty",
        "2. Zero Hunger",
        "3. Good Health and Well-Being",
        "4. Quality Education",
        "5. Gender Equality",
        "6. Clean Water and Sanitation",
        "7. Affordable and Clean Energy",
        "8. Decent Work and Economic Growth",
        "9. Industry, Innovation and Infrastructure",
        "10. Reduced Inequalities",
        "11. Sustainable Cities and Communities",
        "12. Responsible Consumption and Production",
        "13. Climate Action",
        "14. Life Below Water",
        "15. Life on Land",
        "16. Peace, Justice and Strong Institutions",
        "17. Partnerships for the Goals"
      ]
    }
  ]
},

{
  sectionNo: 20,
  sectionTitle:
    "Details of Consultancy and Income Generated Including Clinical Trial",
  repeatable: true,
  questions: [
      {
      question:
        "Name of the Consultant",
      answerFormat:
        "Text"
    },
    {
      question:
        "Name of the Advisory / R&D Consultancy / Clinical Trial Project",
      answerFormat:
        "Text"
    },
    {
      question:
        "Consulting / Sponsoring Agency with Contact Details",
      answerFormat:
        "Text"
    },
    {
      question:
        "Date/Year",
      answerFormat:
        "DD/MM/YYYY"
    },
    {
      question:
        "Revenue Generated (Rs.)",
      answerFormat:
        "Numeric"
    },
    {
      question:
        "PDF Document",
      answerFormat:
        "PDF Upload"
    },
    {
      question:
        "Correlated to SDG Goals",
      answerFormat:
        "Multi Select",
      options: [
        "1. No Poverty",
        "2. Zero Hunger",
        "3. Good Health and Well-Being",
        "4. Quality Education",
        "5. Gender Equality",
        "6. Clean Water and Sanitation",
        "7. Affordable and Clean Energy",
        "8. Decent Work and Economic Growth",
        "9. Industry, Innovation and Infrastructure",
        "10. Reduced Inequalities",
        "11. Sustainable Cities and Communities",
        "12. Responsible Consumption and Production",
        "13. Climate Action",
        "14. Life Below Water",
        "15. Life on Land",
        "16. Peace, Justice and Strong Institutions",
        "17. Partnerships for the Goals"
      ]
    }
  ]
},

{
  sectionNo: 21,
  sectionTitle:
    "Awards and Recognitions Received at National and International Level",
  repeatable: true,
  questions: [
    {
      question: "Title of the Innovation",
      answerFormat: "Text"
    },
    {
      question: "Award Level",
      answerFormat: "Dropdown",
      options: [
        "State",
        "National",
        "International"
      ]
    },
    {
      question: "Name of the Awardee",
      answerFormat: "Text"
    },
    {
      question: "Name of the Awarding Agency",
      answerFormat: "Text"
    },
    {
      question:
        "Contact Details of the Awarding Agency",
      answerFormat: "Text"
    },
    {
      question: "Date/Year of Award",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question: "Award Category",
      answerFormat: "Dropdown",
      options: [
        "Department",
        "Teacher",
        "Research Scholar",
        "Student"
      ]
    },
    {
      question: "PDF Certificate",
      answerFormat: "PDF Upload"
    },
    {
      question: "Award Type",
      answerFormat: "Dropdown",
      options: [
        "Honours",
        "Oration",
        "Prize",
        "Certificate",
        "Memento",
        "Cash Award"
      ]
    },
   {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
  ]
},

{
  sectionNo: 22,
  sectionTitle:
    "Awards and Recognitions Received from Government Agencies and Professional Associations",
  repeatable: true,
  questions: [
       {
      question: "Date/Year",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question:
        "Name(s) of Teacher(s) Who Received the Award",
      answerFormat: "Multi Text"
    },
    {
      question: "Title of the Award",
      answerFormat: "Text"
    },
    {
      question: "Award Level",
      answerFormat: "Dropdown",
      options: [
        "State",
        "National",
        "International"
      ]
    },
    {
      question:
        "Name of the Awarding Agency",
      answerFormat: "Text"
    },
    {
      question: "PDF Certificate",
      answerFormat: "PDF Upload"
    },
    {
      question:
        "Correlated to SDG Goals",
      answerFormat:
        "Multi Select",
      options: [
        "1. No Poverty",
        "2. Zero Hunger",
        "3. Good Health and Well-Being",
        "4. Quality Education",
        "5. Gender Equality",
        "6. Clean Water and Sanitation",
        "7. Affordable and Clean Energy",
        "8. Decent Work and Economic Growth",
        "9. Industry, Innovation and Infrastructure",
        "10. Reduced Inequalities",
        "11. Sustainable Cities and Communities",
        "12. Responsible Consumption and Production",
        "13. Climate Action",
        "14. Life Below Water",
        "15. Life on Land",
        "16. Peace, Justice and Strong Institutions",
        "17. Partnerships for the Goals"
      ]
    }
  ]
},

{
  sectionNo: 25,
  sectionTitle:
    "CME / CDE / CNE / CPE / Workshops / Conferences / Seminars / Symposia Attended",
  repeatable: true,
  questions: [
   {
      question:
        "Name of the Student / Faculty",
      answerFormat: "Text"
    },
    {
      question:
        "Name of the Conference",
      answerFormat: "Text"
    },
    {
      question: "Attended By",
      answerFormat: "Dropdown",
      options: [
        "Faculty",
        "UG",
        "PG",
        "Ph.D"
      ]
    },
    {
      question: "Level",
      answerFormat: "Dropdown",
      options: [
        "Regional",
        "National",
        "International"
      ]
    },
    {
      question:
        "If Paper / Poster Presented, Title of the Paper / Poster",
      answerFormat: "Text"
    },
    {
      question: "Date From",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question: "Date To",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question: "Location",
      answerFormat: "Text"
    },
    {
      question: "Award if Any",
      answerFormat: "Text"
    },
    {
      question:
        "TA/DA Amount Sponsored by the Institution",
      answerFormat: "Numeric"
    },
    {
      question:
        "Proof for Sponsorship",
      answerFormat:
        "PDF/Word Upload"
    },
    {
      question:
        "Correlated to SDG Goals",
      answerFormat:
        "Multi Select",
      options: [
        "1. No Poverty",
        "2. Zero Hunger",
        "3. Good Health and Well-Being",
        "4. Quality Education",
        "5. Gender Equality",
        "6. Clean Water and Sanitation",
        "7. Affordable and Clean Energy",
        "8. Decent Work and Economic Growth",
        "9. Industry, Innovation and Infrastructure",
        "10. Reduced Inequalities",
        "11. Sustainable Cities and Communities",
        "12. Responsible Consumption and Production",
        "13. Climate Action",
        "14. Life Below Water",
        "15. Life on Land",
        "16. Peace, Justice and Strong Institutions",
        "17. Partnerships for the Goals"
      ]
    }
  ]
},

{
  sectionNo: 27,
  sectionTitle:
    "List of Doctoral, Post-Doctoral Students and Research Associates",
  repeatable: true,
  questions: [
       {
      question:
        "Name of Doctoral/Post-Doctoral Student/Research Associate",
      answerFormat: "Text"
    },
    {
      question: "Category",
      answerFormat: "Dropdown",
      options: [
        "Doctoral Student",
        "Post-Doctoral Student",
        "Research Associate"
      ]
    },
    {
      question:
        "Date/Year of Enrollment",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question:
        "With/Without Fellowship",
      answerFormat: "Dropdown",
      options: [
        "With Fellowship",
        "Without Fellowship"
      ]
    },
    {
      question:
        "Internal / External",
      answerFormat: "Dropdown",
      options: [
        "Internal",
        "External"
      ]
    },
    {
      question:
        "Granting Agency",
      answerFormat: "Text"
    },
    {
      question:
        "Duration of Fellowship",
      answerFormat: "Text"
    },
    {
      question:
        "Type of Fellowship",
      answerFormat: "Text"
    },
    {
      question:
        "Qualifying Exam (NET/GATE/etc.)",
      answerFormat: "Text"
    },
    {
      question: "PDF Document",
      answerFormat: "PDF Upload"
    },
    {
      question:
        "Grant Received for the Period",
      answerFormat: "Numeric"
    }
  ]
},

{
  sectionNo: 30,
  sectionTitle:
    "Teachers Awarded National and International Award",
  repeatable: true,
  questions: [
    {
      question: "Name of the Teacher",
      answerFormat: "Text"
    },
    {
      question: "Nature of Award",
      answerFormat: "Dropdown",
      options: [
        "State Award",
        "National Award",
        "International Award"
      ]
    },
    {
      question: "Name of the Awarding Agency",
      answerFormat: "Text"
    },
    {
      question: "Date/Year of Award",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question: "PDF Document",
      answerFormat: "PDF Upload"
    },
    {
      question: "Correlated to SDG Goals",
      answerFormat: "Multi Select",
      options: [
        "1. No Poverty",
        "2. Zero Hunger",
        "3. Good Health and Well-Being",
        "4. Quality Education",
        "5. Gender Equality",
        "6. Clean Water and Sanitation",
        "7. Affordable and Clean Energy",
        "8. Decent Work and Economic Growth",
        "9. Industry, Innovation and Infrastructure",
        "10. Reduced Inequalities",
        "11. Sustainable Cities and Communities",
        "12. Responsible Consumption and Production",
        "13. Climate Action",
        "14. Life Below Water",
        "15. Life on Land",
        "16. Peace, Justice and Strong Institutions",
        "17. Partnerships for the Goals"
      ]
    }
  ]
},

{
  sectionNo: 31,
  sectionTitle:
    "Teachers Awarded National/International Fellowship/Financial Support",
  repeatable: true,
  questions: [
       {
      question:
        "Name of the Teacher Awarded Fellowship",
      answerFormat: "Text"
    },
    {
      question: "National / International",
      answerFormat: "Dropdown",
      options: [
        "National",
        "International"
      ]
    },
    {
      question:
        "Name of the Award/Fellowship",
      answerFormat: "Text"
    },
    {
      question:
        "Specify the Advanced Study",
      answerFormat: "Text"
    },
    {
      question:
        "Degree/Fellowship Awarded From (University/Professional Body)",
      answerFormat: "Text"
    },
    {
      question: "Date/Year of Award",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question: "PDF Document",
      answerFormat: "PDF Upload"
    },
    {
      question:
        "Any Financial Support from the University",
      answerFormat: "Yes/No"
    },
    {
      question:
        "If Yes, PDF Proof",
      answerFormat: "PDF Upload"
    },
  {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
  ]
},

{
  sectionNo: 32,
  sectionTitle:
    "Incentives Provided for Career Advancement and Recognition",
  repeatable: true,
  questions: [
       {
      question: "Date/Year",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question:
        "Name(s) of Teachers",
      answerFormat: "Multi Text"
    },
    {
      question: "Designation",
      answerFormat: "Dropdown",
      options: [
        "Dean",
        "Principal",
        "HoD",
        "Professor",
        "Associate Professor",
        "Assistant Professor",
        "Lecturer",
        "Reader",
        "Tutor"
      ]
    },
    {
      question:
        "Recognition Type",
      answerFormat: "Dropdown",
      options: [
        "Career Advancement",
        "Salary Increment",
        "Website Notification",
        "Commendation Certificate",
        "Cash Award"
      ]
    },
    {
      question: "Level",
      answerFormat: "Dropdown",
      options: [
        "State",
        "National",
        "International"
      ]
    },
    {
      question: "PDF Document",
      answerFormat: "PDF Upload"
    },
    {
      question:
        "High Quality Geotag Photograph",
      answerFormat:
        "Image Upload"
    },
    {
      question:
        "Correlated to SDG Goals",
      answerFormat:
        "Multi Select",
      options: [
        "1. No Poverty",
        "2. Zero Hunger",
        "3. Good Health and Well-Being",
        "4. Quality Education",
        "5. Gender Equality",
        "6. Clean Water and Sanitation",
        "7. Affordable and Clean Energy",
        "8. Decent Work and Economic Growth",
        "9. Industry, Innovation and Infrastructure",
        "10. Reduced Inequalities",
        "11. Sustainable Cities and Communities",
        "12. Responsible Consumption and Production",
        "13. Climate Action",
        "14. Life Below Water",
        "15. Life on Land",
        "16. Peace, Justice and Strong Institutions",
        "17. Partnerships for the Goals"
      ]
    }
  ]
},

{
  sectionNo: 33,
  sectionTitle:
    "Financial Support for Membership and Conference Participation",
  repeatable: true,
  questions: [
      {
      question: "Date/Year",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question:
        "Name of Teacher",
      answerFormat: "Text"
    },
    {
      question:
        "Conference / Workshop Attended for Which Financial Support Was Provided",
      answerFormat: "Text"
    },
   {
  question:
    "Conference / Workshop",
  answerFormat: "Dropdown",
  options: [
    "Conference",
    "Workshop"
  ]
},
    {
      question:
        "Name of the Professional Body for Which Membership Fee Was Provided",
      answerFormat: "Text"
    },
    {
      question:
        "Membership Fee Provided",
      answerFormat: "Yes/No"
    },
    {
      question:
        "Amount (Rs.)",
      answerFormat: "Numeric"
    },
    {
      question:
        "PDF Document",
      answerFormat: "PDF Upload"
    },
    {
  question: "Correlated to SDG Goals",
  answerFormat: "Multi Select",
  options: [
    "1. No Poverty",
    "2. Zero Hunger",
    "3. Good Health and Well-Being",
    "4. Quality Education",
    "5. Gender Equality",
    "6. Clean Water and Sanitation",
    "7. Affordable and Clean Energy",
    "8. Decent Work and Economic Growth",
    "9. Industry, Innovation and Infrastructure",
    "10. Reduced Inequalities",
    "11. Sustainable Cities and Communities",
    "12. Responsible Consumption and Production",
    "13. Climate Action",
    "14. Life Below Water",
    "15. Life on Land",
    "16. Peace, Justice and Strong Institutions",
    "17. Partnerships for the Goals"
  ]
}
  ]
},

{
  sectionNo: 34,
  sectionTitle:
    "Details of Ph.D / DM / M.Ch / MDS Guides and Students",
  repeatable: true,
  questions: [
     {
      question:
        "Name of the Scholar",
      answerFormat: "Text"
    },
    {
      question: "Degree",
      answerFormat: "Dropdown",
      options: [
        "PhD Full Time",
        "PhD Part Time",
        "DM",
        "MDS",
        "M.Ch",
        "MS",
        "MD",
        "MSc",
        "Other PG"
      ]
    },
    {
      question:
        "Name of the Guide",
      answerFormat: "Text"
    },
    {
      question:
        "Title of the Thesis",
      answerFormat: "Text"
    },
    {
      question:
        "Date/Year Registration of Scholar",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question:
        "Date of Award of PhD/DM/MDS/M.Ch",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question:
        "Guide Ship Proof Document",
      answerFormat: "PDF Upload"
    },
    {
      question:
        "Name of Fellowship",
      answerFormat: "Text"
    },
    {
      question:
        "Nature of Fellowship",
      answerFormat: "Dropdown",
      options: [
        "Government",
        "Non-Government",
        "Institutional"
      ]
    },
    {
      question:
        "Proof of Award of Fellowship",
      answerFormat: "PDF Upload"
    },
    {
      question:
        "Grant Received for the Academic Year",
      answerFormat: "Numeric"
    }
  ]
},

{
  sectionNo: 37,
  sectionTitle:
    "Faculty Underwent Training in Development and Delivery of E-Content / E-Course",
  repeatable: true,
  questions: [
       {
      question: "Date From",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question: "Date To",
      answerFormat: "DD/MM/YYYY"
    },
    {
      question:
        "Name of the Teacher",
      answerFormat: "Text"
    },
    {
      question:
        "Name of the Programme",
      answerFormat: "Text"
    },
    {
      question:
        "Brochure / Flyer",
      answerFormat:
        "PDF/Word Upload"
    },
    {
      question:
        "PDF Certificate of Evidence",
      answerFormat:
        "PDF Upload"
    },
    {
      question:
        "Correlated to SDG Goals",
      answerFormat:
        "Multi Select",
      options: [
        "1. No Poverty",
        "2. Zero Hunger",
        "3. Good Health and Well-Being",
        "4. Quality Education",
        "5. Gender Equality",
        "6. Clean Water and Sanitation",
        "7. Affordable and Clean Energy",
        "8. Decent Work and Economic Growth",
        "9. Industry, Innovation and Infrastructure",
        "10. Reduced Inequalities",
        "11. Sustainable Cities and Communities",
        "12. Responsible Consumption and Production",
        "13. Climate Action",
        "14. Life Below Water",
        "15. Life on Land",
        "16. Peace, Justice and Strong Institutions",
        "17. Partnerships for the Goals"
      ]
    }
  ]
}

];

module.exports = facultyQuestions;