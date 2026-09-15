import {
  useState,
  useEffect
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import FacultyLayout from "../../layouts/FacultyLayout";

import facultyQuestionDefinitions from "../../data/facultyQuestions";

const facultyQuestions = facultyQuestionDefinitions.filter(
  (section) => String(section.sectionNo) !== "3"
);

import QuestionRenderer from "../../components/questionnaire/QuestionRenderer";
import QuestionPalette from "../../components/questionnaire/QuestionPalette";
import ProgressBar from "../../components/questionnaire/ProgressBar";
import NavigationButtons from "../../components/questionnaire/NavigationButtons";

import {
  saveSubmission,
  updateSubmission,
  getSubmissionById,
  getMySubmissions
} from "../../api/submissionApi";

import {
  useAuth
} from "../../context/AuthContext";

import {
  getPreviousQuarterAnswers,
  getPermanentFacultyAnswers
} from "../../utils/answerAutofill";

function FacultyQuestionnaire() {

  const { user } =
  useAuth();

  const navigate = useNavigate();

  const { id } =
  useParams();

const [isEditMode,
setIsEditMode] =
  useState(false);

  const [selectedQuarter, setSelectedQuarter] =
    useState("");

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [visitedSections,setVisitedSections] =
    useState([0]);

  const [answers, setAnswers] =
    useState({});

  const [submissions, setSubmissions] =
  useState([]);

   useEffect(() => {

  loadSubmissions();

  if (id) {

    loadSubmission();

  }

}, [id]);

const loadSubmission =
  async () => {

    try {

      const response =
        await getSubmissionById(
          id
        );

      const submission =
        response.data.submission;

      setIsEditMode(true);

      setSelectedQuarter(
        submission.quarter
      );

      const loadedAnswers = {};

      submission.answers.forEach(
        (item) => {

          loadedAnswers[
  item.questionNo
] =
  item.answer;

        }
      );

      const permanentAnswers =
        getPermanentFacultyAnswers(user);

      setAnswers({
        ...loadedAnswers,
        ...permanentAnswers
      });

    } catch (error) {

      console.error(error);

    }

  };

  const loadSubmissions =
  async () => {

    try {

      const response =
        await getMySubmissions();

      setSubmissions(
        response.data.submissions || []
      );

    } catch (error) {

      console.error(error);

    }

  };

  const currentSection =
    facultyQuestions[currentIndex];

  const handleAnswerChange = (
    sectionNo,
    questionIndex,
    value
  ) => {

    setAnswers((prev) => ({
      ...prev,

      [`${sectionNo}_${questionIndex}`]:
        value
    }));
  };

  const handlePrevious = () => {

  if (
    currentIndex > 0
  ) {

    const prevIndex =
      currentIndex - 1;

    setCurrentIndex(
      prevIndex
    );

    setTimeout(() => {

  document
    .getElementById("questionTop")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

}, 100);

    if (
      !visitedSections.includes(
        prevIndex
      )
    ) {

      setVisitedSections([
        ...visitedSections,
        prevIndex
      ]);

    }

  }

};

  const handleNext = () => {

  if (
    currentIndex <
    facultyQuestions.length - 1
  ) {

    const nextIndex =
      currentIndex + 1;

    setCurrentIndex(
      nextIndex
    );

    setTimeout(() => {

  document
    .getElementById("questionTop")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

}, 100);

    if (
      !visitedSections.includes(
        nextIndex
      )
    ) {

      setVisitedSections([
        ...visitedSections,
        nextIndex
      ]);

    }

  }

};

const handleSaveDraft =
  async () => {

    try {

      if (!selectedQuarter) {

        alert(
          "Please Select Quarter"
        );

        return;

      }

      const formattedAnswers =
  Object.entries(answers).map(
    ([key, value]) => {

      const [sectionNo, questionIndex] =
        key.split("_");

      const section =
        facultyQuestions.find(
          item =>
            String(item.sectionNo) ===
            String(sectionNo)
        );

      const questionObj =
        section?.questions[
          Number(questionIndex)
        ];

      return {

        questionNo: key,

        question:
          questionObj?.question || key,

        answer: value

      };

    }
  );

  const formData =
  new FormData();

formData.append(
  "role",
  "faculty"
);

formData.append(
  "school",
  user?.school
);

formData.append(
  "department",
  user?.department
);

formData.append(
  "quarter",
  selectedQuarter
);

formData.append(
  "year",
  new Date().getFullYear()
);

formData.append(
  "totalQuestions",
  facultyQuestions.length
);

const answeredSections =
facultyQuestions.filter(
(section)=>
section.questions.some(
(_,index)=>{

const value =
answers[
`${section.sectionNo}_${index}`
];

return (
value !== undefined &&
value !== null &&
value !== ""
);

}
)
).length;

formData.append(
"answeredCount",
answeredSections
);

formData.append(
"unansweredCount",
facultyQuestions.length -
answeredSections
);

formData.append(
  "status",
  "Draft"
);

formData.append(
  "answers",
  JSON.stringify(
    formattedAnswers
  )
);

  Object.entries(
  answers
).forEach(
  ([key, value]) => {

    if (
      value instanceof File
    ) {

      formData.append(
        key,
        value
      );

    }

  }
);

      let response;

      if (
        isEditMode
      ) {

        response =
  await updateSubmission(
    id,
    formData
  );

      } else {

        response = 
      await saveSubmission(
  formData
);

      }

      console.log(
        response.data
      );

      alert(
        "Response Saved Successfully"
      );

      navigate(
        "/faculty/submissions"
      );

    } catch (error) {

      console.error(
        error
      );

      alert(
        "Draft Save Failed"
      );

    }

  };

 const handleSubmit =
  async () => {

    try {

      if (
        Object.keys(
          answers
        ).length === 0
      ) {

        alert(
          "Please answer at least one question"
        );

        return;

      }
    console.log("USER =", user);

console.log("SCHOOL =", user?.school);

console.log("DEPARTMENT =", user?.department);
      
     const formattedAnswers =
  Object.entries(answers).map(
    ([key, value]) => {

      const [sectionNo, questionIndex] =
        key.split("_");

      const section =
        facultyQuestions.find(
          item =>
            String(item.sectionNo) ===
            String(sectionNo)
        );

      const questionObj =
        section?.questions[
          Number(questionIndex)
        ];

      return {

        questionNo: key,

        question:
          questionObj?.question || key,

        answer: value

      };

    }
  );

  const formData =
  new FormData();

formData.append(
  "role",
  "faculty"
);

formData.append(
  "school",
  user?.school
);

formData.append(
  "department",
  user?.department
);

formData.append(
  "quarter",
  selectedQuarter
);

formData.append(
  "year",
  new Date().getFullYear()
);

formData.append(
  "totalQuestions",
  facultyQuestions.length
);

const answeredSections =
facultyQuestions.filter(
(section)=>
section.questions.some(
(_,index)=>{

const value =
answers[
`${section.sectionNo}_${index}`
];

return (
value !== undefined &&
value !== null &&
value !== ""
);

}
)
).length;

formData.append(
"answeredCount",
answeredSections
);

formData.append(
"unansweredCount",
facultyQuestions.length -
answeredSections
);

formData.append(
  "status",
  "Pending HOD Approval"
);

formData.append(
  "answers",
  JSON.stringify(
    formattedAnswers
  )
);

  Object.entries(
  answers
).forEach(
  ([key, value]) => {

    if (
      value instanceof File
    ) {

      formData.append(
        key,
        value
      );

    }

  }
);
      let response;

if (
  isEditMode
) {

  response =
    await updateSubmission(
  id,
  formData
);

} else {

  response =
    await saveSubmission(
  formData
);

}

      console.log(
        response.data
      );

      localStorage.setItem(

        `facultySubmission_${selectedQuarter}`,

        JSON.stringify({

          quarter:
            selectedQuarter,

          answers,

          submitted:
            true,

          submittedAt:
            new Date().toISOString()

        })

      );

      alert(
  "Questionnaire Submitted Successfully"
);

navigate(
  "/faculty/submissions"
);

    } catch (error) {

      console.error(
        error
      );

      alert(
        "MongoDB Save Failed"
      );

    }

  };

  const answeredCount =
facultyQuestions.filter(
(section)=>
section.questions.some(
(_,index)=>{

const value =
answers[
`${section.sectionNo}_${index}`
];

return (
value !== undefined &&
value !== null &&
value !== ""
);

}
)
).length;

  const progress =
    Math.round(

      (answeredCount /
        facultyQuestions.length) * 100

    );

  return (

    <FacultyLayout>

      {/* Quarter Selection First */}

      {!selectedQuarter && (

        <div
          style={{
            maxWidth: "600px",
            margin: "80px auto",
            background: "#fff",
            padding: "40px",
            borderRadius: "15px",
            boxShadow:
              "0 2px 15px rgba(0,0,0,0.1)"
          }}
        >

          <h1>
            Faculty Questionnaire
          </h1>

          <p>
            Select Quarter To Continue
          </p>

          <select
  value={selectedQuarter}
  onChange={(e) => {

    const quarter =
      e.target.value;

    const existingSubmission =
      submissions.find(
        (item) =>
          item.quarter === quarter
      );

    if (existingSubmission) {

      navigate(
        "/faculty/submissions"
      );

      return;

    }

    const previousAnswers =
      getPreviousQuarterAnswers(
        submissions,
        quarter
      );

    const permanentAnswers =
      getPermanentFacultyAnswers(user);

    setAnswers({
      ...previousAnswers,
      ...permanentAnswers
    });

    setSelectedQuarter(
      quarter
    );

  }}
  style={{
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    borderRadius: "8px"
  }}
>

            <option value="">
              Select Quarter
            </option>

            <option value="Q1">
              Q1
            </option>

            <option value="Q2">
              Q2
            </option>

            <option value="Q3">
              Q3
            </option>

            <option value="Q4">
              Q4
            </option>

          </select>

        </div>

      )}

      {selectedQuarter && (

        <div
          style={{
            display: "flex",
            gap: "20px"
          }}
        >

          {/* LEFT SIDE */}

          <div
            style={{
              width: "280px",
              position: "sticky",
              top: "20px",
              height: "fit-content"
            }}
          >

            <ProgressBar
              progress={progress}
            />
            <QuestionPalette
  sections={facultyQuestions}
  currentIndex={currentIndex}
  answers={answers}
  visitedSections={visitedSections}

  onSelect={(index) => {

  setCurrentIndex(index);

  if (
    !visitedSections.includes(index)
  ) {
    setVisitedSections([
      ...visitedSections,
      index
    ]);
  }

  setTimeout(() => {

    document
      .getElementById("questionTop")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }, 100);

}}
/>

          </div>

          {/* RIGHT SIDE */}

          <div
            style={{
              flex: 1
            }}
          >

            <div
  id="questionTop"
  style={{
    background:"#ffffff",
    borderRadius:"15px",
    padding:"30px",
    boxShadow:"0 2px 10px rgba(0,0,0,0.1)"
  }}
>

  {/* Quarter Info */}

  <div
    style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      marginBottom:"20px"
    }}
  >

    <div>

      <h2
        style={{
          margin:0,
          color:"#1e3a8a"
        }}
      >
        Faculty Questionnaire
      </h2>

      <p
        style={{
          marginTop:"5px",
          color:"#6b7280"
        }}
      >
        SRIHER IQAC Data Entry
      </p>

    </div>

    <div
      style={{
        background:"#2563eb",
        color:"#fff",
        padding:"10px 18px",
        borderRadius:"999px",
        fontWeight:"600",
        fontSize:"15px"
      }}
    >
      Quarter : {selectedQuarter}
    </div>

  </div>

  <hr />

              <h2>

                Question {

                  currentSection.sectionNo

                } : {

                  currentSection.sectionTitle

                }

              </h2>

              <hr />

              {

                currentSection.questions.map(

                  (
                    question,
                    index
                  ) => (

                    <div
                      key={index}
                      style={{
                        marginTop:
                          "25px"
                      }}
                    >

                      <label
                        style={{
                          fontWeight:
                            "600",
                          display:
                            "block",
                          marginBottom:
                            "10px"
                        }}
                      >
                        {
                          question.question
                        }
                      </label>

                      <QuestionRenderer
                        questionData={
                          question
                        }
                        value={
                          answers[
                            `${currentSection.sectionNo}_${index}`
                          ]
                        }
                        onChange={
                          (
                            value
                          ) =>
                            handleAnswerChange(
                              currentSection.sectionNo,
                              index,
                              value
                            )
                        }
                      />

                    </div>

                  )

                )

              }

              <NavigationButtons

                onPrevious={
                  handlePrevious
                }

                onNext={
                  handleNext
                }

                onSave={
                  handleSaveDraft
                }

                disablePrevious={
                  currentIndex === 0
                }

                disableNext={
                  currentIndex ===
                  facultyQuestions.length - 1
                }

              />

            {
  currentIndex === facultyQuestions.length - 1 && (

    <div
      style={{
        marginTop: "20px"
      }}
    >

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "15px",
          border: "none",
          borderRadius: "10px",
          background: "#10b981",
          color: "white",
          fontWeight: "600",
          cursor: "pointer"
        }}
      >

        {
          isEditMode
            ? "Update Questionnaire"
            : "Submit Questionnaire"
        }

      </button>

    </div>

  )
}

            </div>

          </div>

        </div>

      )}

    </FacultyLayout>

  );
}

export default FacultyQuestionnaire;