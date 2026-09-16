const MANDATORY_SECTION_KEYWORDS = [
  "publication",
  "award",
  "grant",
  "journal",
  "extension",
  "outreach"
];

const NO_DATA_VALUES = new Set([
  "N/A",
  "No data",
  "Not available",
  "Not Available",
  "Not applicable"
]);

const isMandatorySection = (sectionTitle = "") => {
  const title = String(sectionTitle).toLowerCase();
  return MANDATORY_SECTION_KEYWORDS.some((keyword) => title.includes(keyword));
};

const isAnswered = (value, mandatory = false) => {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) {
    return value.length > 0 && value.every((item) => isAnswered(item, mandatory));
  }
  if (typeof value === "object") {
    const values = Object.values(value);
    return values.length > 0 && values.every((item) => isAnswered(item, mandatory));
  }

  const normalized = String(value).trim();
  if (normalized.length === 0) return false;
  if (NO_DATA_VALUES.has(normalized)) return !mandatory;

  return true;
};

const getMissingRequiredQuestions = (questionSet, answers = []) => {
  const answerMap = new Map(
    answers.map((answer) => [String(answer.questionNo), answer.answer])
  );
  const missing = [];

  questionSet.forEach((section) => {
    const mandatory = isMandatorySection(section.sectionTitle);
    if (!section.questions?.length) {
      const value = answerMap.get(String(section.sectionNo));
      if (!isAnswered(value, mandatory)) {
        missing.push({ questionNo: String(section.sectionNo), question: section.sectionTitle });
      }
      return;
    }

    (section.questions || []).forEach((question, index) => {
      const questionNo = `${section.sectionNo}_${index}`;
      const value = answerMap.get(questionNo);
      const normalized = typeof value === "string" ? value.trim() : value;
      if (!isAnswered(value, mandatory)) {
        missing.push({ questionNo, question: question.question });
      }
    });
  });

  return missing;
};

module.exports = { getMissingRequiredQuestions, isAnswered, NO_DATA_VALUES };