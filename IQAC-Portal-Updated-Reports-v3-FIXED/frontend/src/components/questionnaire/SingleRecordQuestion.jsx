import React from "react";
import Select from "react-select";
function SingleRecordQuestion({
  fields,
  value,
  onChange,
  mandatory = false
}) {

  const data = value || {};

  const handleChange = (
    key,
    val
  ) => {

    onChange({
      ...data,
      [key]: val
    });

  };

  const isNotAvailable = (value) =>
    ["N/A", "No data", "Not available", "Not Available"].includes(
      String(value || "").trim()
    );

  return (

    <div>

      {

        fields.map((field) => {

  const inputType =
    field.answerFormat || field.type;

  return (


            <div
              key={field.key}
              style={{
                marginBottom:"20px"
              }}
            >

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label
                  style={{
                    display:"block",
                    fontWeight:"600"
                  }}
                >
                  {
                    field.label ||
                    field.key
                  }
                </label>

              </div>

              {

            inputType === "textarea" ||
inputType === "Textarea" ||
inputType === "Text Area" ? (

                  <textarea
                    rows="4"
                    value={
                      data[field.key] || ""
                    }
                    onChange={(e)=>
                      handleChange(
                        field.key,
                        e.target.value
                      )
                    }
                    style={{
                      width:"100%",
                      padding:"10px"
                    }}
                  />

                ) :

             inputType === "file" ||
inputType === "PDF Upload" ||
inputType === "PDF/Word Upload" ||
inputType === "Image Upload" ||
inputType === "Image Upload (JPG/JPEG/PNG)" ? (

  <>

    {
      data[field.key] &&
      typeof File !== "undefined" &&
      data[field.key] instanceof File && (
        <div style={{ color: "#166534", fontWeight: "600", marginBottom: "10px" }}>
          Selected file: {data[field.key].name}
        </div>
      )
    }

    {
      data[field.key] &&
      typeof data[field.key] === "string" && (

        <div
          style={{
            marginBottom: "10px"
          }}
        >

          {
            data[field.key].match(/\.(jpg|jpeg|png)$/i)

            ?

            <>

              <img
                src={`http://localhost:5000${data[field.key]}`}
                alt="Uploaded"
                style={{
                  maxWidth: "220px",
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
                  href={`http://localhost:5000${data[field.key]}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: "600"
                  }}
                >
                  👁 View Image
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      field.key,
                      null
                    )
                  }
                  style={{
                    padding: "8px 14px",
                    cursor: "pointer"
                  }}
                >
                  🔄 Replace Image
                </button>

              </div>

            </>

            :

            <>

              <div
                style={{
                  color: "green",
                  fontWeight: "600",
                  marginBottom: "10px"
                }}
              >
                Current File :
                {" "}
                {
                  data[field.key]
                    .split("/")
                    .pop()
                }
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center"
                }}
              >

                <a
                  href={`http://localhost:5000${data[field.key]}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: "600"
                  }}
                >
                  👁 View File
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      field.key,
                      null
                    )
                  }
                  style={{
                    padding: "8px 14px",
                    cursor: "pointer"
                  }}
                >
                  🔄 Replace File
                </button>

              </div>

            </>

          }

        </div>

      )
    }

    {

      !(

        data[field.key] &&
        typeof data[field.key] === "string"

      ) && (

        <input
          type="file"
          accept={
inputType==="Image Upload" ||
inputType==="Image Upload (JPG/JPEG/PNG)"

? ".jpg,.jpeg,.png"

: ".pdf,.doc,.docx"
}
          onChange={(e)=>
            handleChange(
              field.key,
              e.target.files[0]
            )
          }
        />

      )

    }

  </>

) :

inputType === "Yes/No" ? (

<select
  value={data[field.key] || ""}
  onChange={(e)=>
    handleChange(
      field.key,
      e.target.value
    )
  }
  style={{
    width:"100%",
    padding:"10px"
  }}
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

) :
            inputType === "Dropdown" ? (

<select
  value={data[field.key] || ""}
  onChange={(e)=>
    handleChange(
      field.key,
      e.target.value
    )
  }
  style={{
    width:"100%",
    padding:"10px"
  }}
>

  <option value="">
    Select
  </option>

  {

    (field.options || []).map(
      (option)=>(

        <option
          key={option}
          value={option}
        >
          {option}
        </option>

      )
    )

  }

</select>

) :
          inputType === "Multi Select" ? (

<Select
  isMulti
  options={
    (field.options || []).map(item => ({
      value: item,
      label: item
    }))
  }
  value={
    (data[field.key] || []).map(item => ({
      value: item,
      label: item
    }))
  }
  onChange={(selected)=>
    handleChange(
      field.key,
      selected
        ? selected.map(item => item.value)
        : []
    )
  }
  placeholder="Select SDG Goals"
  closeMenuOnSelect={false}
/>

):

                (

                  <input
type={
inputType === "Numeric"
? "number"
: inputType === "DD/MM/YYYY"
? "date"
: inputType === "Decimal Number"
? "number"
: inputType === "URL"
? "url"
: "text"
}
                    value={
                      data[field.key] || ""
                    }
                    onChange={(e)=>
                      handleChange(
                        field.key,
                        e.target.value
                      )
                    }
                    style={{
                      width:"100%",
                      padding:"10px"
                    }}
                  />

                )

              }

            </div>

                    );

        })

      }

    </div>

  );

}

export default SingleRecordQuestion;