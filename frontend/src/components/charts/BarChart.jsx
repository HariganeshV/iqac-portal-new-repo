import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

function AnalyticsBarChart({ data }) {

    return (

        <div
            style={{
                background: "#ffffff",
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,.08)",
                marginBottom: "35px"
            }}
        >

            <h2
                style={{
                    marginBottom: "20px"
                }}
            >
                Quarter Wise Faculty Analytics
            </h2>

          <ResponsiveContainer
    width="100%"
    height={420}
>

<BarChart
    data={data}
>
    

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="quarter"
                    />

                    <YAxis
                        allowDecimals={false}
                    />

                    <Tooltip />

                    <Legend />

                    <Bar
                        dataKey="submitted"
                        fill="#2563eb"
                        name="Submitted"
                    />

                    <Bar
                        dataKey="pending"
                        fill="#f59e0b"
                        name="Pending"
                    />

                    <Bar
                        dataKey="approved"
                        fill="#16a34a"
                        name="Approved"
                    />

                    <Bar
                        dataKey="rejected"
                        fill="#dc2626"
                        name="Rejected"
                    />

                    <Bar
                        dataKey="notSubmitted"
                        fill="#6b7280"
                        name="Not Submitted"
                    />

                </BarChart>
              </ResponsiveContainer>
        </div>

    );

}

export default AnalyticsBarChart;