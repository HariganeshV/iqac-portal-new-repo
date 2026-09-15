const hodQuestions = [

{
  sectionNo: 4,
  sectionTitle:
    "Number of Emeritus Professor / Adjunct Faculty / Visiting Faculty with Details",

  type: "table",

  tableColumns: [

    {
      key:"facultyName",
      label:"Name of the Faculty",
      type:"text",
      required:true
    },

    {
      key:"designationAffiliation",
      label:"Designation and Affiliation",
      type:"text",
      required:true
    },

    {
      key:"joiningDate",
      label:"Date/Year of Joining",
      type:"date",
      required:true
    },

    {
      key:"academicResearchInput",
      label:"Details of Academic/Research Input",
      type:"file"
    },

    {
      key:"scopusAuthorId",
      label:"SCOPUS Author ID",
      type:"number"
    }

  ]
},

{
  sectionNo: 7,
  sectionTitle:
    "Fellowship Programmes / Certificate Courses / Online Courses through DoE Offered",

  type: "table",

  tableColumns: [

    {
      key:"programmeCode",
      label:"Programme Code",
      type:"text",
      required:true
    },

    {
      key:"programmeName",
      label:"Programme Name",
      type:"text",
      required:true
    },

    {
      key:"programmeType",
      label:"Fellowship Programme / Certificate Course / Online Course through DoE",
      type:"dropdown",
      options:[
        "Fellowship Programme",
        "Certificate Course",
        "Online Course through DoE"
      ],
      required:true
    },

    {
      key:"startDate",
      label:"Date/Year of Starting the Programme",
      type:"date",
      required:true
    },

    {
      key:"duration",
      label:"Duration of the Programme",
      type:"text"
    },

    {
      key:"approvalDate",
      label:"Date of Approval by BoS / Academic Council",
      type:"date"
    },

    {
      key:"studentsAdmitted",
      label:"No. of Students Admitted",
      type:"number"
    },

    {
      key:"revenueGenerated",
      label:"Revenue Generated (In Rs.)",
      type:"number"
    },

    {
      key:"academicCouncilMinutes",
      label:"Minutes of Relevant Academic Council / BoS Meeting",
      type:"file"
    },

    {
      key:"otherRelevantDocument",
      label:"Any Other Relevant Document",
      type:"file"
    },

   {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 14,
  sectionTitle:
    "Departmental Projects Funded by DST-FIST, UGC-SAP/CAS, DPE, DBT, ICSSR, AICTE, MCI, PCI, WHO, NIH",

  type: "table",

  tableColumns: [

    {
      key:"departmentName",
      label:"Name of the Department with Recognition",
      type:"text",
      required:true
    },

    {
      key:"schemeName",
      label:"Name of the Scheme",
      type:"text",
      required:true
    },

    {
      key:"fundingAgency",
      label:"Name of the Funding Agency",
      type:"text",
      required:true
    },

    {
      key:"awardDate",
      label:"Date/Year of Award",
      type:"date",
      required:true
    },

    {
      key:"totalFundProvided",
      label:"Total Fund Provided (In Rs)",
      type:"number",
      required:true
    },

    {
      key:"sanctionedAmountForYear",
      label:"Sanctioned Amount for the Year",
      type:"number",
      required:true
    },

    {
      key:"awardDurationMonths",
      label:"Duration of the Award (Months)",
      type:"number",
      required:true
    },

    {
      key:"sanctionLetter",
      label:"PDF (Sanctioned Letter)",
      type:"file"
    },

    {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 16,
  sectionTitle:
    "Special Research Laboratories Sponsored by / Created by Industry or Corporate Bodies",

  type: "table",

  tableColumns: [

    {
      key:"researchLabName",
      label:"Name of Research Lab",
      type:"text",
      required:true
    },

    {
      key:"sponsorName",
      label:"Name of the Sponsor",
      type:"text",
      required:true
    },

    {
      key:"labLocation",
      label:"Location of Lab",
      type:"text",
      required:true
    },

    {
      key:"establishmentDate",
      label:"Date/Year of Establishment",
      type:"date",
      required:true
    },

    {
      key:"sponsorshipDurationYears",
      label:"Duration of Sponsorship (Years)",
      type:"number",
      required:true
    },

    {
      key:"grantAmountReceived",
      label:"Total Grant Received (In Rs.)",
      type:"number",
      required:true
    },

    {
      key:"sanctionOrder",
      label:"PDF Sanction Order",
      type:"file"
    },

    {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 23,
  sectionTitle:
    "Workshops/Seminars conducted by the department on IPR, Research Methodology, Good Clinical/Laboratory/Pharmacy Practices, Research Grant Writing and Industry-Academia Collaborations",

  type: "table",

  tableColumns: [

    {
      key:"eventName",
      label:"Name of the Event",
      type:"text",
      required:true
    },

    {
      key:"eventNature",
      label:"Nature",
      type:"dropdown",
      options:[
        "CME",
        "Workshop",
        "Seminar",
        "Symposium",
        "Conference",
        "Webinar"
      ]
    },

    {
      key:"eventType",
      label:"Type",
      type:"dropdown",
      options:[
        "Intellectual Property Rights (IPR)",
        "Research Methodology",
        "Good Clinical Practices",
        "Laboratory Practices",
        "Pharmacy Practices",
        "Collection Practices",
        "Research Grant Writing",
        "Industry-Academia Collaborations"
      ]
    },

    {
      key:"eventDate",
      label:"Date/Year",
      type:"date"
    },

    {
      key:"studentParticipants",
      label:"Total Number of Student Participants",
      type:"number"
    },

    {
      key:"facultyParticipants",
      label:"Total Number of Faculty Participants",
      type:"number"
    },

    {
      key:"fundingSource",
      label:"Source of Funding",
      type:"text"
    },

    {
      key:"grantReceived",
      label:"Grant Received (Rs.)",
      type:"number"
    },

    {
      key:"eventReport",
      label:"PDF Report of the Event",
      type:"file"
    },

    {
      key:"geotagPhotograph",
      label:"Geotag Photograph",
      type:"file"
    },

   {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 24,
  sectionTitle:
    "CME/CDE/CNE/CPE, Workshops, Conferences, Seminars, Professional Development Programs Organized by the Departments",

  type: "table",

  tableColumns: [

    {
      key:"eventName",
      label:"Name of the Event",
      type:"text",
      required:true
    },

    {
      key:"eventCategory",
      label:"Event Category",
      type:"dropdown",
      options:[
        "CME",
        "CDE",
        "CNE",
        "CPE",
        "Workshop",
        "Conference",
        "Seminar",
        "Professional Development Program"
      ]
    },

    {
      key:"inHouseStudents",
      label:"In-house Students",
      type:"number"
    },

    {
      key:"outsideStudents",
      label:"Outside Students",
      type:"number"
    },

    {
      key:"inHouseFaculty",
      label:"In-house Faculty",
      type:"number"
    },

    {
      key:"outsideFaculty",
      label:"Outside Faculty",
      type:"number"
    },

    {
      key:"guestSpeaker",
      label:"Name of the Guest Speaker",
      type:"text"
    },

    {
      key:"brochurePdf",
      label:"PDF Brochure",
      type:"file"
    },

    {
      key:"eventReport",
      label:"PDF Report of the Event",
      type:"file"
    },

    {
      key:"geotagPhotograph",
      label:"Geotag Photograph",
      type:"file"
    },

   {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 26,
  sectionTitle:
    "List of Students who have Cleared Civil Services, Defense Services and Other Competitive Examinations",

  type: "table",

  tableColumns: [

    {
      key:"studentName",
      label:"Name of the Student",
      type:"text",
      required:true
    },

    {
      key:"trainedByDepartment",
      label:"Trained by the Department",
      type:"dropdown",
      options:["Yes","No"],
      required:true
    },

    {
      key:"trainingFromDate",
      label:"Department Training Date (From Date)",
      type:"date"
    },

    {
      key:"trainingToDate",
      label:"Department Training Date (To Date)",
      type:"date"
    },

    {
      key:"examName",
      label:"Name of the Examination Appeared",
      type:"dropdown",
      options:[
        "NET",
        "SLET",
        "GATE",
        "GMAT",
        "CAT",
        "GRE",
        "TOEFL",
        "PLAB",
        "USMLE",
        "AYUSH",
        "Civil Services",
        "Defense Services",
        "UPSC",
        "State Government Examination",
        "AIMSPGET",
        "JIPMER Entrance Test",
        "PGIMER Entrance Test",
        "GPAT",
        "Other"
      ]
    },

    {
      key:"examDate",
      label:"Date of Exam Appeared",
      type:"date"
    },

    {
      key:"qualified",
      label:"Qualified",
      type:"dropdown",
      options:["Yes","No"]
    },

    {
      key:"scoreCard",
      label:"PDF Score Card",
      type:"file"
    },

    {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 28,
  sectionTitle:
    "Research Scholars / Post Graduate Students Getting Financial Assistance from the University / State / Central",

  type: "table",

  tableColumns: [

    {
      key:"awardDate",
      label:"Date/Year",
      type:"date",
      required:true
    },

    {
      key:"beneficiaryType",
      label:"Research Scholar / Post Graduate",
      type:"dropdown",
      options:[
        "Research Scholar",
        "Post Graduate"
      ],
      required:true
    },

    {
      key:"beneficiaryName",
      label:"Name of the Research Scholar / Post Graduate",
      type:"text",
      required:true
    },

    {
      key:"awardingAgency",
      label:"Awarding Agency",
      type:"text",
      required:true
    },

    {
      key:"fundingSource",
      label:"University / State / Central",
      type:"dropdown",
      options:[
        "University",
        "State",
        "Central"
      ]
    },

    {
      key:"amount",
      label:"Amount (Rs.)",
      type:"number",
      required:true
    },

    {
      key:"supportingDocument",
      label:"PDF Document",
      type:"file"
    }

  ]
},

{
  sectionNo: 29,
  sectionTitle:
    "Alumni Association of the Department and its Contribution Towards Department Fund / Donation of Books / Journals / Volumes / Student Placement / Student Exchanges / Institutional Endowments",

  type: "table",

  tableColumns: [

    {
      key:"supportType",
      label:"Nature of Support",
      type:"dropdown",
      options:[
        "Donation of Books",
        "Donation of Journals",
        "Donation of Volumes",
        "Student Placement",
        "Student Exchange",
        "Institutional Endowment",
        "Department Fund",
        "Others"
      ],
      required:true
    },

    {
      key:"supportDate",
      label:"Date",
      type:"date",
      required:true
    },

    {
      key:"supportValue",
      label:"Amount Received or Value of Support",
      type:"number",
      required:true
    },

   {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 35,
  sectionTitle:
    "Extension and Outreach Activities",

  type: "table",

  tableColumns: [

    {
      key:"fromDate",
      label:"From Date",
      type:"date",
      required:true
    },

    {
      key:"toDate",
      label:"To Date",
      type:"date",
      required:true
    },

    {
      key:"activityCategory",
      label:"NSS / NCC / Navy / Red Cross / YRC / Other",
      type:"dropdown",
      options:[
        "NSS",
        "NCC",
        "Navy",
        "Red Cross",
        "Youth Red Cross (YRC)",
        "Other"
      ]
    },

    {
      key:"activityName",
      label:"Name of the Activity",
      type:"text",
      required:true
    },

    {
      key:"activityType",
      label:"Camp / Community Activity / Novel Activity",
      type:"dropdown",
      options:[
        "Camp",
        "Community Activity",
        "Novel Activity"
      ]
    },

    {
      key:"venue",
      label:"Place Conducted",
      type:"text"
    },

    {
      key:"collaboratingAgency",
      label:"External Agency / Collaborating Organization",
      type:"text"
    },

    {
      key:"studentParticipants",
      label:"Number of Students Participated",
      type:"number"
    },

    {
      key:"teacherParticipants",
      label:"Number of Teachers Participated",
      type:"number"
    },

    {
      key:"beneficiaries",
      label:"Number of Beneficiaries",
      type:"number"
    },

    {
      key:"fundsReceived",
      label:"Funds Received (Rs.)",
      type:"number"
    },

    {
      key:"awardReceived",
      label:"Award Received",
      type:"dropdown",
      options:["Yes","No"]
    },

    {
      key:"activityReport",
      label:"PDF Report of the Activity",
      type:"file"
    },

    {
      key:"geotagPhotos",
      label:"Geo-tag Photographs",
      type:"file"
    },

   {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 36,
  sectionTitle:
    "MoUs with Institutions and Industries",

  type: "table",

  tableColumns: [

    {
      key:"mouTitle",
      label:"Title of the MoU",
      type:"text",
      required:true
    },

    {
      key:"partnerOrganization",
      label:"Partnering Institution / Industry / Research Lab / Corporate House",
      type:"text",
      required:true
    },

    {
      key:"contactDetails",
      label:"Contact Details",
      type:"text"
    },

    {
      key:"commencementDate",
      label:"Date/Year of Commencement",
      type:"date",
      required:true
    },

    {
      key:"durationFrom",
      label:"Duration From",
      type:"date"
    },

    {
      key:"durationTo",
      label:"Duration To",
      type:"date"
    },

    {
      key:"activitiesConducted",
      label:"Actual Activities Carried Out Under the MoU",
      type:"textarea"
    },

    {
      key:"studentsBenefited",
      label:"Number of Students Benefited",
      type:"number"
    },

    {
      key:"teachersBenefited",
      label:"Number of Teachers Benefited",
      type:"number"
    },

    {
      key:"mouDocument",
      label:"PDF MoU",
      type:"file"
    },

    {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 38,
  sectionTitle:
    "Programs Conducted Through Skills and Simulation Labs",

  type: "singleRecord",

  fields: [

    {
      key:"basicClinicalSkillModels",
      label:"Details of Basic Clinical Skill Training Models",
      type:"number"
    },

    {
      key:"advancedPatientSimulators",
      label:"Advanced Patient Simulators",
      type:"number"
    },

    {
      key:"structuredPrograms",
      label:"Structured Programs for Training and Assessment",
      type:"textarea"
    },

    {
      key:"facultyTrainingPrograms",
      label:"Faculty Training Programs",
      type:"textarea"
    },

    {
      key:"geoTagPhoto",
      label:"Geo Tag Photo",
      type:"file"
    },

    {
      key:"proofOfEstablishment",
      label:"Proof Of Establishment",
      type:"file"
    },

    {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},
{
  sectionNo: 39,
  sectionTitle:
    "Students Benefited by Scholarships and Freeships Provided by Government / Non-Government Agencies",

  type: "table",

  tableColumns: [

    {
      key:"academicYear",
      label:"Academic Year",
      type:"date"
    },

    {
  key: "studyLevel",
  label: "Study Level",
  type: "dropdown",
  options: [
    "UG 3",
    "UG 4",
    "UG 5",
    "UG 6",
    "PG 2",
    "PG 3",
    "PG 6 Years"
  ]
},

    {
  key: "gender",
  label: "Gender",
  type: "dropdown",
  options: [
    "Male",
    "Female",
    "Transgender"
  ]
},

    {
  key: "community",
  label: "Community",
  type: "dropdown",
  options: [
    "General",
    "OBC",
    "BC",
    "SC",
    "ST",
    "Others"
  ]
},

   {
  key: "agencyType",
  label: "Agency Type",
  type: "dropdown",
  options: [
    "State",
    "National",
    "International",
    "Other Trusts or Charitable Org"
  ]
},

    {
      key:"schemeName",
      label:"Scheme Name",
      type:"text"
    },

    {
      key:"govtBeneficiaries",
      label:"Government Beneficiaries",
      type:"number"
    },

    {
      key:"nongovtBeneficiaries",
      label:"Non Government Beneficiaries",
      type:"number"
    },

    {
      key:"institutionBeneficiaries",
      label:"Institution Beneficiaries",
      type:"number"
    },

    {
      key:"proofDocument",
      label:"Proof Document",
      type:"file"
    }

  ]
},

{
  sectionNo: 40,
  sectionTitle:
    "Students Undertaking Internships",

  type: "table",

  tableColumns: [

    {
      key:"studentName",
      label:"Student Name",
      type:"text"
    },

   {
  key:"gender",
  label:"Gender",
  type:"dropdown",
  options:[
    "Male",
    "Female",
    "Transgender"
  ]
},

    {
      key:"courseName",
      label:"Course Name",
      type:"text"
    },

    {
  key:"mode",
  label:"Mode",
  type:"dropdown",
  options:[
    "UG 3",
    "UG 4",
    "UG 5",
    "UG 6",
    "PG 2",
    "PG 3",
    "PG 6"
  ]
},

    {
      key:"internshipDuration",
      label:"Internship Duration",
      type:"text"
    },

    {
      key:"placedAfterInternship",
      label:"Placed After Internship",
      type:"dropdown",
      options:[
        "Yes",
        "No"
      ]
    }

  ]
},

{
  sectionNo: 41,
  sectionTitle:
    "Faculty Development Programmes Conducted",

  type: "table",

  tableColumns: [

    {
      key:"dateFrom",
      label:"Date From",
      type:"date"
    },

    {
      key:"dateTo",
      label:"Date To",
      type:"date"
    },

    {
      key:"programTitle",
      label:"Program Title",
      type:"text"
    },

    {
      key:"sponsorship",
      label:"Sponsorship",
      type:"text"
    },

    {
      key:"brochure",
      label:"Brochure",
      type:"file"
    },

    {
      key:"externalFacultyCount",
      label:"External Faculty Count",
      type:"number"
    },

    {
      key:"participantList",
      label:"Participant List",
      type:"file"
    },

    {
      key:"programReport",
      label:"Program Report",
      type:"file"
    },

    {
      key:"geoTagPhoto",
      label:"Geo Tag Photo",
      type:"file"
    },

    {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 42,
  sectionTitle:
    "Capability Enhancement and Development Schemes",

  type: "table",

  tableColumns: [

    {
      key:"schemeName",
      label:"Scheme Name",
      type:"text"
    },

    {
  key:"schemeType",
  label:"Scheme Type",
  type:"dropdown",
  options:[
    "Soft Skill",
    "Language and Communication",
    "Yoga and Wellness",
    "Analytical Skill",
    "Human Value",
    "Personality and Professional",
    "Employability Skill"
  ]
},

    {
      key:"implementationYear",
      label:"Implementation Year",
      type:"year"
    },

    {
      key:"studentsEnrolled",
      label:"Students Enrolled",
      type:"number"
    },

    {
      key:"agencyDetails",
      label:"Agency Details",
      type:"textarea"
    },

    {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 43,
  sectionTitle:
    "Students Awards and Achievements",

  type: "table",

  tableColumns: [

    {
      key:"year",
      label:"Year",
      type:"year"
    },

    {
      key:"awardName",
      label:"Award Name",
      type:"text"
    },

   {
  key:"category",
  label:"Category",
  type:"dropdown",
  options:[
    "Sports",
    "Cultural"
  ]
},

  {
  key:"level",
  label:"Level",
  type:"dropdown",
  options:[
    "State",
    "Regional (Zonal)",
    "National",
    "International"
  ]
},

    {
      key:"studentName",
      label:"Student Name",
      type:"text"
    },

    {
      key:"studentId",
      label:"Student ID",
      type:"text"
    },

   {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},

{
  sectionNo: 44,
  sectionTitle:
    "Students Participation in Sports and Cultural Activities",

  type: "table",

  tableColumns: [

    {
      key:"year",
      label:"Year",
      type:"year"
    },

    {
      key:"activityName",
      label:"Activity Name",
      type:"text"
    },

    {
  key:"activityCategory",
  label:"Activity Category",
  type:"dropdown",
  options:[
    "Sports",
    "Cultural Activities",
    "Events",
    "Competitions"
  ]
},

    {
  key:"level",
  label:"Level",
  type:"dropdown",
  options:[
    "University",
    "State",
    "Regional",
    "National",
    "International"
  ]
},

    {
      key:"participants",
      label:"Participants",
      type:"number"
    },

    {
  key: "sdgGoals",
  label: "Correlated to SDG Goals",
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
}

  ]
},
{
  sectionNo: 45,
  sectionTitle:
    "Alumni Placement Details",

  type: "table",

  tableColumns: [

    {
      key:"alumniName",
      label:"Alumni Name",
      type:"text"
    },

    {
      key:"programName",
      label:"Program Name",
      type:"text"
    },

    {
  key:"mode",
  label:"Mode",
  type:"dropdown",
  options:[
    "UG 3",
    "UG 4",
    "UG 5",
    "UG 6",
    "PG 2",
    "PG 3",
    "PG 6"
  ]
},

    {
      key:"placementDetails",
      label:"Placement Details",
      type:"textarea"
    },

    {
  key:"employmentType",
  label:"Employment Type",
  type:"dropdown",
  options:[
    "Self Employed",
    "Placed through University"
  ]
},

    {
      key:"salary",
      label:"Salary",
      type:"number"
    },

    {
      key:"offerLetter",
      label:"Offer Letter",
      type:"file"
    }

  ]
},

{
  sectionNo: 46,
  sectionTitle:
    "Alumni Higher Education Details",

  type: "table",

  tableColumns: [

    {
      key:"alumniName",
      label:"Alumni Name",
      type:"text"
    },

    {
      key:"courseName",
      label:"Course Name",
      type:"text"
    },

   {
  key:"mode",
  label:"Mode",
  type:"dropdown",
  options:[
    "UG 3",
    "UG 4",
    "UG 5",
    "UG 6",
    "PG 2",
    "PG 3",
    "PG 6"
  ]
},

    {
      key:"joinedCourse",
      label:"Joined Course",
      type:"text"
    },

    {
      key:"collegeUniversity",
      label:"College / University",
      type:"text"
    },

    {
      key:"joiningYear",
      label:"Joining Year",
      type:"date"
    },

    {
      key:"selectionLetter",
      label:"Selection Letter",
      type:"file"
    }

  ]
},

{
  sectionNo: 47,
  sectionTitle:
    "International Visitors to the Department",

  type: "table",

  tableColumns: [

    {
      key:"visitorName",
      label:"Visitor Name",
      type:"text"
    },

    {
      key:"designationAffiliation",
      label:"Designation & Affiliation",
      type:"text"
    },

    {
      key:"country",
      label:"Country",
      type:"text"
    },

    {
      key:"visitStartDate",
      label:"Visit Start Date",
      type:"date"
    },

    {
      key:"visitEndDate",
      label:"Visit End Date",
      type:"date"
    },

    {
      key:"purposeOfVisit",
      label:"Purpose Of Visit",
      type:"textarea"
    },

    {
      key:"geoTagPhotos",
      label:"Geo Tag Photos",
      type:"file"
    },

    {
      key:"briefReport",
      label:"Brief Report",
      type:"file"
    }

  ]
},

{
  sectionNo: 48,
  sectionTitle:
    "National Visitors to the Department",

  type: "table",

  tableColumns: [

    {
      key:"visitorName",
      label:"Visitor Name",
      type:"text"
    },

    {
      key:"designationAffiliation",
      label:"Designation & Affiliation",
      type:"text"
    },

    {
      key:"state",
      label:"State",
      type:"text"
    },

    {
      key:"visitStartDate",
      label:"Visit Start Date",
      type:"date"
    },

    {
      key:"visitEndDate",
      label:"Visit End Date",
      type:"date"
    },

    {
      key:"purposeOfVisit",
      label:"Purpose Of Visit",
      type:"textarea"
    },

    {
      key:"geoTagPhotos",
      label:"Geo Tag Photos",
      type:"file"
    },

    {
      key:"briefReport",
      label:"Brief Report",
      type:"file"
    }

  ]
}

];

export default hodQuestions;