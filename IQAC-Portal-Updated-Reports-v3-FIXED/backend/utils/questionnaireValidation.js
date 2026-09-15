const REQUIRED_SECTIONS_WITHOUT_NO_DATA = [
  "Publications",
  "Awards",
  "Grants",
  "Journals",
  "Extension / Outreach"
];

const isAnswered = (value) => {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.values(value).some(isAnswered);
  return String(value).trim().length > 0;
};

const getMissingRequiredQuestions = (questionSet, answers = []) => {
  const answerMap = new Map(
    answers.map((answer) => [String(answer.questionNo), answer.answer])
  );
  const missing = [];

  questionSet.forEach((section) => {
    const allowsNoData = !REQUIRED_SECTIONS_WITHOUT_NO_DATA.includes(
      section.sectionTitle
    );

    (section.questions || []).forEach((question, index) => {
      const questionNo = `${section.sectionNo}_${index}`;
      const value = answerMap.get(questionNo);
      const noData = value === "N/A" || value === "No data";

      if (!isAnswered(value) && !(allowsNoData && noData)) {
        missing.push({ questionNo, question: question.question });
      }
    });
  });

  return missing;
};

module.exports = { getMissingRequiredQuestions, isAnswered };