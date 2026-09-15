import React, { useState } from "react";
import Select from "react-select";

function QuestionRenderer({
  questionData,
  value,
  onChange
}) {
  
  const [replaceMode, setReplaceMode] =
  useState(false);

  const {
    question,
    answerFormat,
    options,
    sectionTitle
  } = questionData;

  const allowsNoData = ![
    "Publications",
    "Awards",
    "Grants",
    "Journals",
    "Extension / Outreach"
  ].includes(sectionTitle);

  const emptyMessage = !value
    ? "This is a mandatory field"
    : null;

  const renderSelectOptions = () => (
    <>
      <option value="">Select Option</option>
      <option value="N/A">N/A</option>
      {allowsNoData && <option value="No data">No data / record</option>}
      {options?.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </>
  );

  const mandatoryNotice = emptyMessage && (
    <div style={{ color: "#b91c1c", fontSize: "13px", marginTop: "6px" }}>
      {emptyMessage}
    </div>
  );

  switch (answerFormat) {

    case "Text":
      return (
        <>
        <input
          type="text"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={question}
          style={inputStyle}
        />
        {mandatoryNotice}
        </>
      );

    case "Numeric":
      return (
        <>
        <input
          type="number"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={question}
          style={inputStyle}
        />
        {mandatoryNotice}
        </>
      );

    case "Decimal Number":
      return (
        <>
        <input
          type="number"
          step="0.01"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={question}
          style={inputStyle}
        />
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

          <option value="N/A">N/A</option>

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

export default QuestionRenderer;