import React from "react";
import { isMandatorySection, isNotApplicable, NOT_APPLICABLE } from "../../utils/questionnaireRules";

function QuestionAvailabilityToggle({ sectionTitle, questionLabel, value, onChange, children }) {
  const mandatory = isMandatorySection(sectionTitle);
  const unavailable = isNotApplicable(value);
  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={unavailable}
      onClick={() => onChange(unavailable ? "" : NOT_APPLICABLE)}
      style={{ display: "inline-flex", alignItems: "center", gap: "10px", border: 0, background: "transparent", color: "#111827", cursor: "pointer", padding: 0 }}
    >
      <span style={{ position: "relative", width: "44px", height: "24px", borderRadius: "999px", background: unavailable ? "#2563eb" : "#9ca3af", transition: "background .2s" }}>
        <span style={{ position: "absolute", top: "3px", left: unavailable ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
      </span>
      <span>{unavailable ? "Not applicable: On" : "Not applicable: Off"}</span>
    </button>
  );

  return (
    <div>
      {(questionLabel || mandatory) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "12px" }}>
          {questionLabel && <h2 style={{ margin: 0 }}>{questionLabel}</h2>}
          {mandatory && (
            <div style={{ color: "#dc2626", fontWeight: "600", fontSize: "13px" }}>
              <span aria-hidden="true">*</span> This question is mandatory
            </div>
          )}
          {!mandatory && toggle}
        </div>
      )}
      {!mandatory && !questionLabel && <div style={{ marginBottom: "12px" }}>{toggle}</div>}
      {unavailable && !mandatory ? (
        <div style={{ padding: "14px", background: "#f3f4f6", color: "#4b5563", borderRadius: "6px" }}>
          This question is marked not applicable. All subquestions are not applicable.
        </div>
      ) : children}
    </div>
  );
}

export default QuestionAvailabilityToggle;
