function QuestionPalette({

  sections,
  currentIndex,
  answers,
  visitedSections,
  onSelect

}) {

  return (

    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >

      <h3
        style={{
          marginBottom: "20px"
        }}
      >
        Question Palette
      </h3>

      {/* Legend */}

      <div
        style={{
          marginBottom: "25px"
        }}
      >

        <Legend
          color="#2563eb"
          text="Current"
        />

        <Legend
          color="#22c55e"
          text="Answered"
        />

        <Legend
          color="#ffffff"
          border="1px solid #d1d5db"
          text="Visited"
        />

        <Legend
          color="#ef4444"
          text="Not Visited"
        />

      </div>

      {/* Palette Buttons */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3,1fr)",
          gap: "10px"
        }}
      >

        {

          sections.map(
            (
              section,
              index
            ) => {

              const isCurrent =
                currentIndex === index;

               const isAnswered =

Object.keys(answers).some(
  (key) =>
    key.startsWith(
      `${section.sectionNo}_`
    )
)

||

(
  answers[section.sectionNo] &&
  (
    Array.isArray(
      answers[section.sectionNo]
    )
      ? answers[
          section.sectionNo
        ].length > 0
      : Object.keys(
          answers[
            section.sectionNo
          ] || {}
        ).length > 0
  )
);

              const isVisited =
  visitedSections?.includes(
    index
  ) || false;

              let bgColor =
                "#ef4444";

              let textColor =
                "#ffffff";

              // Visited

              if (isVisited) {

                bgColor =
                  "#ffffff";

                textColor =
                  "#000000";

              }

              // Answered

              if (isAnswered) {

                bgColor =
                  "#22c55e";

                textColor =
                  "#ffffff";

              }

              // Current

              if (isCurrent) {

                bgColor =
                  "#2563eb";

                textColor =
                  "#ffffff";

              }

              return (

                <button
                  key={
                    section.sectionNo
                  }
                  onClick={() =>
                    onSelect(
                      index
                    )
                  }
                  style={{
                    height: "55px",

                    border:
                      bgColor ===
                      "#ffffff"
                        ? "1px solid #d1d5db"
                        : "none",

                    borderRadius:
                      "10px",

                    background:
                      bgColor,

                    color:
                      textColor,

                    fontWeight:
                      "600",

                    cursor:
                      "pointer"
                  }}
                >

                  {
                    section.sectionNo
                  }

                </button>

              );

            }
          )

        }

      </div>

    </div>

  );
}

function Legend({

  color,
  text,
  border

}) {

  return (

    <div
      style={{
        display: "flex",
        alignItems:
          "center",
        gap: "10px",
        marginBottom:
          "12px"
      }}
    >

      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius:
            "5px",
          background:
            color,
          border:
            border || "none"
        }}
      />

      <span>
        {text}
      </span>

    </div>

  );
}

export default QuestionPalette;