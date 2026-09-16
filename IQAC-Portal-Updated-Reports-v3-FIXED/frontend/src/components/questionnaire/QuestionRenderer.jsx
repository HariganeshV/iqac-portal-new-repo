import React, { useState } from "react";
import Select from "react-select";
import { isMandatorySection } from "../../utils/questionnaireRules";

function QuestionInput({
  questionData,
  value,
  onChange,
  mandatory = false
}) {
  
  const [replaceMode, setReplaceMode] =
  useState(false);

  const {
    question,
    answerFormat,
    options,
    sectionTitle
  } = questionData;

  const allowsNoData = !mandatory;

  const isNotAvailable = (fieldValue) =>
    ["N/A", "No data", "Not available", "Not Available"].includes(
      String(fieldValue || "").trim()
    );

  const emptyMessage = !value || isNotAvailable(value)
    ? null
    : "This is a mandatory field";

  const renderSelectOptions = () => (
    <>
      <option value="">Select Option</option>
      {!mandatory && <option value="Not available">Not available</option>}
      {allowsNoData && <option value="No data">No data / record</option>}
      {options?.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </>
  );

  const toggleNotAvailable = () => {
    if (isNotAvailable(value)) {
      onChange("");
      return;
    }
    onChange("Not available");
  };

  const mandatoryNotice = emptyMessage && (
    <div style={{ color: "#b91c1c", fontSize: "13px", marginTop: "6px" }}>
      {emptyMessage}
    </div>
  );

  switch (answerFormat) {

    case "Text":
      return (
        <>
        <div>
          <input
            type="text"
            value={value || ""}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder={question}
            style={{ ...inputStyle, ...(isNotAvailable(value) ? { background: "#f3f4f6", color: "#6b7280" } : {}) }}
            disabled={isNotAvailable(value)}
          />
        </div>
        {mandatoryNotice}
        </>
      );

    case "Numeric":
      return (
        <>
        <div>
          <input
            type="number"
            value={value || ""}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder={question}
            style={{ ...inputStyle, ...(isNotAvailable(value) ? { background: "#f3f4f6", color: "#6b7280" } : {}) }}
            disabled={isNotAvailable(value)}
          />
        </div>
        {mandatoryNotice}
        </>
      );

    case "Decimal Number":
      return (
        <>
        <div>
          <input
            type="number"
            step="0.01"
            value={value || ""}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder={question}
            style={{ ...inputStyle, ...(isNotAvailable(value) ? { background: "#f3f4f6", color: "#6b7280" } : {}) }}
            disabled={isNotAvailable(value)}
          />
        </div>
        {mandatoryNotice}
        </>
      );

    case "DD/MM/YYYY":
      return (
        <input
          type="date"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={inputStyle}
        />
      );

    case "DD/MM/YYYY + Duration": {
      const dateValue = value && typeof value === "object" ? value.date || "" : "";
      const durationValue = value && typeof value === "object" ? value.duration || "" : "";

      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
          <label style={{ display: "grid", gap: "4px", color: "#374151", fontWeight: "600" }}>
            Start date
            <input
              type="date"
              value={dateValue}
              onChange={(event) => onChange({ date: event.target.value, duration: durationValue })}
              style={inputStyle}
            />
          </label>
          <label style={{ display: "grid", gap: "4px", color: "#374151", fontWeight: "600" }}>
            Duration
            <input
              type="text"
              value={durationValue}
              placeholder="e.g. 3 years"
              onChange={(event) => onChange({ date: dateValue, duration: event.target.value })}
              style={inputStyle}
            />
          </label>
        </div>
      );
    }

    case "URL":
      return (
        <input
          type="url"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="Enter URL"
          style={inputStyle}
        />
      );

    case "Dropdown":
      return (
        <select
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={inputStyle}
        >
          {renderSelectOptions()}
        </select>
      );

    case "Yes/No":
      return (
        <select
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={inputStyle}
        >
          <option value="">
            Select
          </option>

          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>
        </select>
      );

      case "Multi Text":
  return (
    <textarea
      rows="3"
      value={value || ""}
      onChange={(e) =>
        onChange(e.target.value)
      }
      placeholder={question}
      style={inputStyle}
    />
  );

    case "Multi Select":

  return (

    <Select

      isMulti

      options={

        options?.map(item => ({

          value: item,

          label: item

        }))

      }

      value={

        (value || []).map(item => ({

          value: item,

          label: item

        }))

      }

      onChange={(selected) =>

        onChange(

          selected

            ? selected.map(

                item => item.value

              )

            : []

        )

      }

      placeholder="Select SDG Goals"

      closeMenuOnSelect={false}

    />

  );

case "PDF Upload":
case "PDF/Word Upload":
  return (
    <>
      {typeof File !== "undefined" && value instanceof File && (
        <div style={{ color: "#166534", fontWeight: "600", marginBottom: "10px" }}>
          Selected file: {value.name}
        </div>
      )}
      {
        value &&
typeof value === "string" &&
!replaceMode ? (

          <div
            style={{
              marginBottom: "10px"
            }}
          >

            <div
              style={{
                color: "green",
                fontWeight: "600",
                marginBottom: "10px"
              }}
            >
              Current File :
              {" "}
              {value.split("/").pop()}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center"
              }}
            >

              <a
                href={`http://localhost:5000${value}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#2563eb",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                👁 View File
              </a>

              <button
                type="button"
                onClick={() => {

  setReplaceMode(true);

  onChange(null);

}}
                style={{
                  padding: "8px 14px",
                  cursor: "pointer"
                }}
              >
                🔄 Replace File
              </button>

            </div>

          </div>

        ) : (

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e)=>{

  setReplaceMode(false);

  onChange(
    e.target.files[0]
  );

}}
            style={inputStyle}
          />

        )
      }
    </>
  );

case "Image Upload":
case "Image Upload (JPG/JPEG/PNG)":
  return (
    <>
      {typeof File !== "undefined" && value instanceof File && (
        <div style={{ color: "#166534", fontWeight: "600", marginBottom: "10px" }}>
          Selected image: {value.name}
        </div>
      )}
      {
        value &&
typeof value === "string" &&
!replaceMode ? (

          <div>

            <p
              style={{
                color: "green",
                fontWeight: "600"
              }}
            >
              Current Image
            </p>

            <img
              src={`http://localhost:5000${value}`}
              alt="Uploaded"
              style={{
                maxWidth: "250px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginBottom: "10px"
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center"
              }}
            >

              <a
                href={`http://localhost:5000${value}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#2563eb",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                👁 View Image
              </a>

              <button
                type="button"
                onClick={() => {

  setReplaceMode(true);

  onChange(null);

}}
                style={{
                  padding: "8px 14px",
                  cursor: "pointer"
                }}
              >
                🔄 Replace Image
              </button>

            </div>

          </div>

        ) : (

          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e)=>{

  setReplaceMode(false);

  onChange(
    e.target.files[0]
  );

}}
            style={inputStyle}
          />

        )
      }
    </>
  );
  }
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px"
};

function QuestionRenderer({ questionData, value, onChange }) {
  const mandatory = isMandatorySection(questionData.sectionTitle);

  return (
    <div>
      <QuestionInput questionData={questionData} value={value} onChange={onChange} mandatory={mandatory} />
    </div>
  );
}

export default QuestionRenderer;