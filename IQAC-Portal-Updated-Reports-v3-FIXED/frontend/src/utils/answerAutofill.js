const QUARTER_ORDER = {
  Q1: 1,
  Q2: 2,
  Q3: 3,
  Q4: 4,
};

const hasAnswer = (value) => {
  if (value === undefined || value === null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    return Object.values(value).some(hasAnswer);
  }
  return String(value).trim() !== "";
};

// Copy answers only from quarters that were filled before the selected quarter.
// The nearest previous quarter wins when the same question exists more than once.
export const getPreviousQuarterAnswers = (
  submissions = [],
  selectedQuarter,
  year = new Date().getFullYear()
) => {
  const selectedOrder = QUARTER_ORDER[selectedQuarter] || 0;

  const previousSubmissions = submissions
    .filter((submission) => {
      const order = QUARTER_ORDER[submission?.quarter] || 0;
      return (
        Number(submission?.year) === Number(year) &&
        order > 0 &&
        order < selectedOrder
      );
    })
    .sort((a, b) => {
      const quarterDiff =
        (QUARTER_ORDER[b?.quarter] || 0) -
        (QUARTER_ORDER[a?.quarter] || 0);

      if (quarterDiff) return quarterDiff;

      return (
        new Date(b?.updatedAt || b?.createdAt || 0) -
        new Date(a?.updatedAt || a?.createdAt || 0)
      );
    });

  const result = {};

  previousSubmissions.forEach((submission) => {
    (submission?.answers || []).forEach((item) => {
      const key = String(item?.questionNo ?? "");

      if (
        key &&
        !Object.prototype.hasOwnProperty.call(result, key) &&
        hasAnswer(item?.answer)
      ) {
        result[key] = item.answer;
      }
    });
  });

  return result;
};

// Permanent details come only from the registered User record.
// These are intentionally limited to the Faculty Details fields that exist
// in the current questionnaire, so unrelated questionnaire fields are never
// populated from the user's profile.
export const getPermanentFacultyAnswers = (user) => {
  const result = {};

  if (hasAnswer(user?.name)) result["3_0"] = user.name;
  if (hasAnswer(user?.facultyPhoto)) result["3_1"] = user.facultyPhoto;
  if (hasAnswer(user?.designation)) result["3_2"] = user.designation;
  if (hasAnswer(user?.employmentType)) result["3_3"] = user.employmentType;
  if (hasAnswer(user?.dateOfAppointment || user?.dateOfJoining)) {
    result["3_4"] = user.dateOfAppointment || user.dateOfJoining;
  }
  if (hasAnswer(user?.dateOfRelieving)) result["3_5"] = user.dateOfRelieving;
  if (hasAnswer(user?.scopusAuthorId)) result["3_6"] = user.scopusAuthorId;
  if (hasAnswer(user?.vidwanId)) result["3_7"] = user.vidwanId;

  return result;
};
