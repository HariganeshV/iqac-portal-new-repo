const MANDATORY_SECTION_KEYWORDS = [
  "publication",
  "award",
  "grant",
  "journal",
  "extension",
  "outreach"
];

export const NOT_APPLICABLE = "Not applicable";

export const isMandatorySection = (sectionTitle = "") => {
  const title = String(sectionTitle).toLowerCase();
  return MANDATORY_SECTION_KEYWORDS.some((keyword) => title.includes(keyword));
};

export const isNotApplicable = (value) =>
  typeof value === "string" &&
  ["N/A", "No data", "Not available", "Not Available", NOT_APPLICABLE]
    .includes(value.trim());

export const hasCompleteAnswer = (value, mandatory = false) => {
  if (value === null || value === undefined || value === "") return false;
  if (typeof File !== "undefined" && value instanceof File) return true;
  if (isNotApplicable(value)) return !mandatory;
  if (Array.isArray(value)) {
    return value.length > 0 && value.every((item) => hasCompleteAnswer(item, mandatory));
  }
  if (typeof value === "object") {
    const values = Object.values(value);
    return values.length > 0 && values.every((item) => hasCompleteAnswer(item, mandatory));
  }
  return String(value).trim() !== "";
};

export const getMissingQuestions = (questionSet, answers = {}) => {
  const answerMap = new Map(
    Array.isArray(answers)
      ? answers.map((item) => [String(item.questionNo), item.answer])
      : Object.entries(answers)
  );
  const missing = [];

  questionSet.forEach((section) => {
    const mandatory = isMandatorySection(section.sectionTitle);
    (section.questions || []).forEach((question, index) => {
      const questionNo = `${section.sectionNo}_${index}`;
      if (!hasCompleteAnswer(answerMap.get(questionNo), mandatory)) {
        missing.push({ questionNo, question: question.question || section.sectionTitle });
      }
    });
    if (!section.questions?.length && !hasCompleteAnswer(answerMap.get(String(section.sectionNo)), mandatory)) {
      missing.push({ questionNo: String(section.sectionNo), question: section.sectionTitle });
    }
  });

  return missing;
};
