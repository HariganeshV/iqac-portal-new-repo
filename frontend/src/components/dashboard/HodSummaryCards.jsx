function HodSummaryCards({ summary }) {

    const cards = [

        {
            title: "Total Faculty",
            value: summary?.totalFaculty || 0,
            color: "#2563eb"
        },

        {
            title: "Submitted",
            value: summary?.totalSubmitted || 0,
            color: "#10b981"
        },

        {
            title: "Pending",
            value: summary?.totalPending || 0,
            color: "#f59e0b"
        },

        {
            title: "Approved",
            value: summary?.totalApproved || 0,
            color: "#059669"
        },

        {
            title: "Rejected",
            value: summary?.totalRejected || 0,
            color: "#dc2626"
        },

        {
            title: "Not Submitted",
            value: summary?.totalNotSubmitted || 0,
            color: "#6b7280"
        }

    ];

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px",
                marginBottom: "35px"
            }}
        >

            {

                cards.map((card) => (

                    <div
                        key={card.title}
                        style={{
                            background: "#fff",
                            borderRadius: "15px",
                            padding: "25px",
                            boxShadow:
                                "0 4px 12px rgba(0,0,0,.08)",
                            borderTop:
                                `5px solid ${card.color}`
                        }}
                    >

                        <h2
                            style={{
                                color: card.color,
                                margin: 0,
                                fontSize: "34px"
                            }}
                        >
                            {card.value}
                        </h2>

                        <p
                            style={{
                                marginTop: "10px",
                                fontWeight: 600
                            }}
                        >
                            {card.title}
                        </p>

                    </div>

                ))

            }

        </div>

    );

}

export default HodSummaryCards;