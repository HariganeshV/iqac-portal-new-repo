const serialize = (value) => JSON.stringify(value ?? null);

const getChangedQuestionNos = (previousAnswers = [], nextAnswers = []) => {
  const previous = new Map(
    previousAnswers.map((item) => [String(item.questionNo), serialize(item.answer)])
  );
  const next = new Map(
    nextAnswers.map((item) => [String(item.questionNo), serialize(item.answer)])
  );
  const keys = new Set([...previous.keys(), ...next.keys()]);
  return [...keys].filter((questionNo) => previous.get(questionNo) !== next.get(questionNo));
};

module.exports = { getChangedQuestionNos };
