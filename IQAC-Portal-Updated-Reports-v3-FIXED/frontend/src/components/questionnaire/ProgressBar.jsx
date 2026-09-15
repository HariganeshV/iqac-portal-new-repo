function ProgressBar({ progress }) {

  return (

    <div
      style={{
        marginBottom: "20px"
      }}
    >

      <h3>
        Progress : {progress}%
      </h3>

      <div
        style={{
          width: "100%",
          height: "12px",
          background: "#e5e7eb",
          borderRadius: "20px"
        }}
      >

        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#22c55e",
            borderRadius: "20px"
          }}
        />

      </div>

    </div>

  );
}

export default ProgressBar;