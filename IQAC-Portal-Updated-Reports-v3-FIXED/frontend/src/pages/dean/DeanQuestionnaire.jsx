import {
  useState,
  useEffect
} from "react";

import {
  useParams
} from "react-router-dom";

import {
  saveDeanSubmission,
updateDeanSubmission,
submitDeanSubmission,
getMyDeanSubmissions
} from "../../api/deanApi";

import { useAuth } from "../../context/AuthContext";

import {
  getPreviousQuarterAnswers
} from "../../utils/answerAutofill";

import { useNavigate } from "react-router-dom";

import DeanLayout from "../../layouts/DeanLayout";

import deanQuestions from "../../data/deanQuestions";

import DynamicTableQuestion from "../../components/questionnaire/DynamicTableQuestion";

import SingleRecordQuestion from "../../components/questionnaire/SingleRecordQuestion";

import ProgressBar from "../../components/questionnaire/ProgressBar";

import QuestionPalette from "../../components/questionnaire/QuestionPalette";

import NavigationButtons from "../../components/questionnaire/NavigationButtons";

function DeanQuestionnaire() {

    const { user } = useAuth();
    console.log(user);

const navigate =
  useNavigate();

  const { id } =
  useParams();

const [isEditMode,
setIsEditMode] =
  useState(false);

  const handleQuarterSelect =
  async (value) => {

    try {

      const response =
        await getMyDeanSubmissions();

      const submissions =
        response.data.submissions;

      const existing =
        submissions.find(
          (item) =>
            item.quarter === value
        );

      if (existing) {

        navigate(
  "/dean/submissions"
);

      } else {

        setAnswers(
          getPreviousQuarterAnswers(
            submissions,
            value
          )
        );

        setSelectedQuarter(
          value
        );

      }

    } catch (error) {

      console.log(error);

      setSelectedQuarter(
        value
      );

    }

  };

  const loadSubmission =
  async () => {

    try {

      const response =
        await getMyDeanSubmissions();

      const submission =
        response.data.submissions.find(
          (item) =>
            item._id === id
        );

      if (!submission)
        return;

      setIsEditMode(true);

      setSelectedQuarter(
        submission.quarter
      );

      const loadedAnswers = {};

submission.answers.forEach((item) => {

  loadedAnswers[item.questionNo] =
    item.answer;

});

setAnswers(loadedAnswers);


    } catch (error) {

      console.log(error);

    }

  };

  const [currentIndex, setCurrentIndex] =
    useState(0);

const [answers, setAnswers] =
  useState({});

const [selectedQuarter,
setSelectedQuarter] =
  useState("");

const [visitedSections, setVisitedSections] =
  useState([0]);

  useEffect(() => {

  if (id) {

    loadSubmission();

  }

}, [id]);

  const currentQuestion =
  deanQuestions[currentIndex];

  const handleAnswerChange = (
    sectionNo,
    value
  ) => {

    setAnswers((prev) => ({
      ...prev,
      [sectionNo]: value
    }));

  };

  const prepareAnswers = (
  data,
  formData,
  prefix = ""
) => {

  if(data instanceof File){

formData.append(
prefix,
data
);

return "";

}

// OLD FILE PATH

if(

typeof data==="string"

&&

data.startsWith("/uploads/")

){

return data;

}

  if (
    Array.isArray(data)
  ) {

    return data.map(
      (item,index)=>

      prepareAnswers(
        item,
        formData,
        `${prefix}_${index}`
      )
    );

  }

  if (
    data &&
    typeof data === "object"
  ) {

    const obj = {};

    Object.keys(data).forEach(
      (key)=>{

        obj[key] =
          prepareAnswers(
            data[key],
            formData,
            prefix
              ? `${prefix}_${key}`
              : key
          );

      }
    );

    return obj;

  }

  return data;

};

  const handlePrevious = () => {

    if (currentIndex > 0) {

      setCurrentIndex(
        currentIndex - 1
      );

    }

  };

  const handleNext = () => {

    if (
      currentIndex <
      deanQuestions.length - 1
    ) {

      const next =
        currentIndex + 1;

      setCurrentIndex(next);

      if (
        !visitedSections.includes(
          next
        )
      ) {

        setVisitedSections([
          ...visitedSections,
          next
        ]);

      }

    }

  };

  const handleSaveDraft =
  async () => {

    try {

      const formData =
        new FormData();
      
        const formattedAnswers =
  Object.entries(
    answers
  ).map(
    ([key,value])=>({

      questionNo:key,

      question:key,

      answer:
        prepareAnswers(
          value,
          formData,
          key
        )

    })
  );

      formData.append(
        "role",
        "dean"
      );

      formData.append(
        "school",
        user?.school
      );

      formData.append(
    "department",
    user?.department || ""
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
        deanQuestions.length
      );

      formData.append(
  "answeredCount",
  answeredCount
);

formData.append(
  "unansweredCount",
  deanQuestions.length -
    answeredCount
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

      if (isEditMode) {

        await updateDeanSubmission(
    id,
    formData
);

      }

      else {

        await saveDeanSubmission(
          formData
        );

      }

      alert(
        "Draft Saved Successfully"
      );

      navigate(
  "/dean/submissions"
);

    }

    catch (error) {

      console.error(error);

      alert(
        "Draft Save Failed"
      );

    }

  };

const handleSubmit =
  async () => {

    try {

      const formData =
        new FormData();

      const formattedAnswers =
  Object.entries(
    answers
  ).map(
    ([key,value])=>({

      questionNo:key,

      question:key,

      answer:
        prepareAnswers(
          value,
          formData,
          key
        )

    })
  );

      formData.append(
        "role",
        "dean"
      );

      formData.append(
        "school",
        user?.school
      );

      formData.append(
    "department",
    user?.department || ""
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
        deanQuestions.length
      );

      formData.append(
  "answeredCount",
  answeredCount
);

formData.append(
  "unansweredCount",
  deanQuestions.length -
    answeredCount
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

       if (isEditMode) {

  await updateDeanSubmission(
    id,
    formData
  );

  await submitDeanSubmission(id);

}

else {

  const response =
    await saveDeanSubmission(
      formData
    );

  await submitDeanSubmission(
    response.data.submission._id
  );

}

      alert(
        "Questionnaire Submitted to Admin Successfully"
      );

      navigate(
  "/dean/submissions"
);

    }

    catch (error) {

      console.error(error);

      alert(
        "Submit Failed"
      );

    }

  };

  const answeredCount =
Object.values(answers).filter(
(answer)=>{

if(answer==null)
return false;

if(typeof answer==="string")
return answer.trim()!== "";

if (Array.isArray(answer))

return answer.some(row =>
Object.values(row).some(v => v)
);

if(typeof answer==="object")
return Object.values(answer)
.some(v=>v);

return false;

}
).length;

  const progress =
    Math.round(
      (
        answeredCount /
        deanQuestions.length
      ) * 100
    );

  return (

    <DeanLayout>
      
      {
!selectedQuarter && (

  <div
    style={{
      maxWidth:"600px",
      margin:"80px auto",
      background:"#fff",
      padding:"40px",
      borderRadius:"15px",
      boxShadow:
        "0 2px 15px rgba(0,0,0,0.1)"
    }}
  >

    <h1>
     Dean Questionnaire
    </h1>

    <p>
      Select Quarter To Continue
    </p>

    <select
  value={selectedQuarter}
  onChange={(e)=>
    handleQuarterSelect(
      e.target.value
    )
  }
      style={{
        width:"100%",
        padding:"15px",
        marginTop:"20px",
        borderRadius:"8px"
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

)
}

      {
selectedQuarter && (

<div
  style={{
    display:"flex",
    gap:"20px"
  }}
>

        {/* LEFT PANEL */}

        <div
          style={{
            width:"280px"
          }}
        >

          <ProgressBar
            progress={progress}
          />

          <QuestionPalette
  sections={deanQuestions}
  currentIndex={currentIndex}
  answers={answers}
  visitedSections={
    visitedSections
  }
  onSelect={(index)=>{

    setCurrentIndex(index);

    if (
      !visitedSections.includes(
        index
      )
    ) {

      setVisitedSections([
        ...visitedSections,
        index
      ]);

    }

  }}
/>

        </div>

        {/* RIGHT PANEL */}

        <div
          style={{
            flex:1
          }}
        >

          <div
            style={{
              background:"#fff",
              padding:"30px",
              borderRadius:"15px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.1)"
            }}
          >

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
      Dean Questionnaire
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
      fontWeight:"600"
    }}
  >
    Quarter : {selectedQuarter}
  </div>

</div>

<hr />

<h2>

  Question {currentQuestion.sectionNo}

</h2>

<p
  style={{
    fontWeight:"600",
    marginBottom:"20px"
  }}
>
  {currentQuestion.sectionTitle}
</p>

<hr />

           {
  currentQuestion.type === "table" && (

    <DynamicTableQuestion
      columns={
        currentQuestion.tableColumns
      }
      value={
        answers[
          currentQuestion.sectionNo
        ]
      }
      onChange={(value)=>
        handleAnswerChange(
          currentQuestion.sectionNo,
          value
        )
      }
    />

  )
}

{
  currentQuestion.type ===
  "singleRecord" && (

    <SingleRecordQuestion
      fields={
        currentQuestion.fields
      }
      value={
        answers[
          currentQuestion.sectionNo
        ]
      }
      onChange={(value)=>
        handleAnswerChange(
          currentQuestion.sectionNo,
          value
        )
      }
    />

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
    deanQuestions.length - 1
  }
/>

{
  currentIndex === deanQuestions.length - 1 && (

    <div
      style={{
        marginTop:"20px"
      }}
    >

      <button
        onClick={handleSubmit}
        style={{
          width:"100%",
          padding:"15px",
          border:"none",
          borderRadius:"10px",
          background:"#10b981",
          color:"#fff",
          fontWeight:"600",
          cursor:"pointer"
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

)
}

    </DeanLayout>

  );

}

export default DeanQuestionnaire;