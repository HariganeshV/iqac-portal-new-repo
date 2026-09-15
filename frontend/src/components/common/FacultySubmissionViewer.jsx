import facultyQuestions from "../../data/facultyQuestions";

function FacultySubmissionViewer({

    submission,

    onClose

}) {

    if (!submission) return null;

    return (

<div
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.5)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:9999
}}
>

<div
style={{
background:"#fff",
width:"90%",
maxHeight:"90vh",
overflowY:"auto",
borderRadius:"12px",
padding:"25px",
position:"relative"
}}
>

<button
onClick={onClose}

style={{
position:"sticky",
top:"0",
float:"right",
background:"#dc2626",
color:"#fff",
border:"none",
padding:"10px 15px",
borderRadius:"6px",
cursor:"pointer",
zIndex:10000
}}
>
✕ Close
</button>

<h2>
Faculty Submission Details
</h2>

<p>
<b>Name:</b>{" "}
{
submission.submittedByName || "-"
}
</p>

<p>
<b>Email:</b>{" "}
{
 submission.submittedByEmail || "-"
}
</p>

<p>
<b>Quarter:</b>
{" "}
{submission.quarter}
</p>

<p>
<b>School:</b>
{" "}
{submission.school}
</p>

<p>
<b>Department:</b>
{" "}
{submission.department}
</p>

<p>
<b>Status:</b>
{" "}
{submission.status}
</p>

<p>
<b>Answered:</b>
{" "}
{submission.answeredCount}
</p>

<p>
<b>Unanswered:</b>
{" "}
{submission.unansweredCount}
</p>

<p>
<b>Submitted Date:</b>
{" "}
{
  new Date(
   submission.createdAt
  ).toLocaleDateString()
}
</p>

{
facultyQuestions.map(
(section)=>{

return(

<div
key={section.sectionNo}
style={{
marginTop:"25px"
}}
>

<div
style={{
background:"#dbeafe",
padding:"12px",
fontWeight:"bold",
fontSize:"18px"
}}
>
Section {section.sectionNo}
-
{section.sectionTitle}
</div>

<table
style={{
width:"100%",
borderCollapse:"collapse"
}}
>

<tbody>

{
Array.isArray(section.questions) &&
section.questions.map((question, index) => {

const key =
`${section.sectionNo}_${index}`;

const answer =
submission.answers?.find(
(a)=>
a.questionNo === key
);

return(

<tr key={key}>

<td
style={{
padding:"12px",
border:"1px solid #ddd",
width:"50%"
}}
>
{question.question}
</td>

<td
style={{
padding:"12px",
border:"1px solid #ddd"
}}
>

{
answer?.answer ? (

typeof answer.answer === "string" ? (

answer.answer.match(/\.(jpg|jpeg|png)$/i) ? (

<img
src={`http://localhost:5000${answer.answer}`}
alt="Faculty Upload"
style={{
maxWidth:"250px",
maxHeight:"250px",
borderRadius:"8px"
}}
/>

) : answer.answer.startsWith("/uploads/") ? (

<a
href={`http://localhost:5000${answer.answer}`}
target="_blank"
rel="noopener noreferrer"
style={{
color:"#2563eb",
fontWeight:"600",
textDecoration:"underline"
}}
>

{
answer.answer.toLowerCase().endsWith(".pdf")
? "[PDF] View PDF"

: answer.answer.toLowerCase().endsWith(".doc") ||
answer.answer.toLowerCase().endsWith(".docx")

? "[DOC] View Document"

: answer.answer.toLowerCase().endsWith(".xls") ||
answer.answer.toLowerCase().endsWith(".xlsx")

? "[XLS] View Excel"

: "[FILE] View File"
}

</a>

) : (

answer.answer

)

) : (

String(answer.answer)

)

) : (

"NIL"

)
}

</td>

</tr>

);

}
)
}

</tbody>

</table>

</div>

);

}
)
}

</div>

</div>

    );

}

export default FacultySubmissionViewer;