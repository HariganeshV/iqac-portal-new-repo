function NavigationButtons({

  onPrevious,
  onNext,
  onSave,

  disablePrevious,
  disableNext

}) {

  return (

    <div
      style={{
        display: "flex",
        gap: "15px",
        marginTop: "30px"
      }}
    >

      {!disablePrevious && (
  <button
    onClick={onPrevious}
    style={buttonStyle}
  >
    Previous
  </button>
)}

<button
  onClick={onSave}
  style={{
    ...buttonStyle,
    background:"#f59e0b"
  }}
>
  Save Response
</button>

{!disableNext && (
  <button
    onClick={onNext}
    style={{
      ...buttonStyle,
      background:"#2563eb"
    }}
  >
    Next
  </button>
)}

    </div>

  );
}

const buttonStyle = {

  padding: "12px 25px",

  border: "none",

  borderRadius: "8px",

  background: "#6b7280",

  color: "#fff",

  cursor: "pointer",

  fontWeight: "600"
};

export default NavigationButtons;