import {
  useState,
  useEffect
} from "react";
import Select from "react-select";

function DynamicTableQuestion({
  columns,
  value,
  onChange,
  mandatory = false
}) {

  const [rows, setRows] =
    useState(
      value || [{}]
    );
    
    useEffect(() => {

  setRows(value || [{}]);

}, [value]);
 
  const handleChange = (
  rowIndex,
  key,
  val
) => {

  const updatedRows =
    rows.map((row) => ({
      ...row
    }));

  updatedRows[rowIndex] = {
    ...updatedRows[rowIndex],
    [key]: val
  };

  setRows(updatedRows);

  onChange(updatedRows);

};

  const addRow = () => {

  const updatedRows =
    [
      ...rows.map(r => ({
        ...r
      })),
      {}
    ];

  setRows(updatedRows);

  onChange(updatedRows);

};

  const isNotAvailable = (value) =>
    ["N/A", "No data", "Not available", "Not Available"].includes(
      String(value || "").trim()
    );

  return (

    <div>

      <table
        style={{
          width:"100%",
          borderCollapse:"collapse"
        }}
      >

        <thead>

          <tr>

            {
              columns.map(
                (col) => (

                  <th
                    key={col.key}
                    style={{
                      border:"1px solid #ddd",
                      padding:"10px",
                      background:"#f3f4f6"
                    }}
                  >
                    {col.label}
                  </th>

                )
              )
            }

          </tr>

        </thead>

        <tbody>

          {
            rows.map(
              (
                row,
                rowIndex
              ) => (

                <tr
                  key={rowIndex}
                >

                  {
                    columns.map((col) => {

const inputType =
col.answerFormat || col.type;

return (

                        <td
                          key={col.key}
                          style={{
                            border:"1px solid #ddd",
                            padding:"5px"
                          }}
                        >

                          {/* TEXTAREA */}

                          {
                            (inputType === "textarea" ||
 inputType === "Textarea" ||
 inputType === "Text Area")

                            ?

                            <>
                              <textarea
                                rows="3"
                                value={
                                  row[col.key] || ""
                                }
                                disabled={isNotAvailable(row[col.key])}
                                onChange={(e)=>
                                  handleChange(
                                    rowIndex,
                                    col.key,
                                    e.target.value
                                  )
                                }
                                style={{
                                  width:"100%",
                                  background: isNotAvailable(row[col.key]) ? "#f3f4f6" : "#fff"
                                }}
                              />
                            </>

                            :

                            /* DROPDOWN */

                            (inputType === "dropdown" ||
 inputType === "Dropdown")

                            ?

                            <>
                              <select
                                value={
                                  row[col.key] || ""
                                }
                                disabled={isNotAvailable(row[col.key])}
                                onChange={(e)=>
                                  handleChange(
                                    rowIndex,
                                    col.key,
                                    e.target.value
                                  )
                                }
                                style={{
                                  width:"100%",
                                  background: isNotAvailable(row[col.key]) ? "#f3f4f6" : "#fff"
                                }}
                              >

                                <option value="">
                                  Select
                                </option>
                                {!mandatory && <option value="Not available">Not available</option>}

                                {
                                  (col.options || []).map(
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
                            </>

                            :

                            /* FILE */

                            (
inputType === "file" ||
inputType === "PDF Upload" ||
inputType === "PDF/Word Upload" ||
inputType === "Image Upload" ||
inputType === "Image Upload (JPG/JPEG/PNG)"
)

                            ?

                            <>

{
row[col.key] &&
typeof row[col.key] === "string" && (

<div
style={{
marginBottom:"10px"
}}
>

{

typeof row[col.key] === "string" &&
row[col.key].match(/\.(jpg|jpeg|png)$/i)

?

<img
src={`http://localhost:5000${row[col.key]}`}
alt="Preview"
style={{
maxWidth:"180px",
borderRadius:"8px"
}}
/>

:

<div
style={{
color:"green",
fontWeight:"600"
}}
>

Current File :

<div
style={{
marginTop:"8px",
display:"flex",
gap:"10px",
alignItems:"center"
}}
>

<a
href={`http://localhost:5000${row[col.key]}`}
target="_blank"
rel="noreferrer"
style={{
color:"#2563eb",
fontWeight:"600",
textDecoration:"none"
}}
>
👁 View
</a>

<button
type="button"
onClick={()=>
handleChange(
rowIndex,
col.key,
null
)
}
style={{
padding:"6px 12px",
cursor:"pointer"
}}
>
🔄 Replace File
</button>

</div>

{" "}

{
row[col.key]
.split("/")
.pop()
}

</div>

}

</div>

)

}

{
!(
row[col.key] &&
typeof row[col.key] === "string"
) && (

<input
type="file"

accept={

inputType === "Image Upload" ||
inputType === "Image Upload (JPG/JPEG/PNG)"

? ".jpg,.jpeg,.png"

: ".pdf,.doc,.docx"

}

onChange={(e)=>

handleChange(

rowIndex,

col.key,

e.target.files[0]

)

}
/>

)
}

</> :
           
           inputType === "Yes/No"

?

<select

value={
row[col.key] || ""
}

onChange={(e)=>

handleChange(

rowIndex,

col.key,

e.target.value

)

}

style={{
width:"100%"
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

:
                            /* MULTI SELECT */

                            (
inputType === "multiSelect" ||
inputType === "Multi Select"
)

?

<Select
  isMulti
  options={
    (col.options || []).map(item => ({
      value: item,
      label: item
    }))
  }
  value={
    (row[col.key] || []).map(item => ({
      value: item,
      label: item
    }))
  }
  onChange={(selected)=>
    handleChange(
      rowIndex,
      col.key,
      selected
        ? selected.map(item => item.value)
        : []
    )
  }
  placeholder="Select SDG Goals"
  closeMenuOnSelect={false}
/>

                            :

                            /* NORMAL INPUT */

                            <input
                              type={

inputType === "date" ||
inputType === "DD/MM/YYYY"

? "date"

:

inputType === "number" ||
inputType === "Numeric"

? "number"

:

inputType === "Decimal Number"

? "number"

:

inputType === "URL"

? "url"

:

"text"

}

                              value={
                                row[col.key] || ""
                              }

                              onChange={(e)=>
                                handleChange(
                                  rowIndex,
                                  col.key,
                                  e.target.value
                                )
                              }

                              style={{
                                width:"100%"
                              }}
                            />

                          }

                       </td>

                      );

                    })

                  }

                </tr>

              ))
          }

        </tbody>

      </table>

      <button
        type="button"
        onClick={addRow}
        style={{
          marginTop:"10px",
          padding:"10px 15px"
        }}
      >
        + Add Row
      </button>

    </div>

  );

}

export default DynamicTableQuestion;