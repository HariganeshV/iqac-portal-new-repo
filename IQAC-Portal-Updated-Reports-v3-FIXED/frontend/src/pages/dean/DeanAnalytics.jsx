import React, {
    useEffect,
    useState
} from "react";

import DeanLayout from "../../layouts/DeanLayout";

import AnalyticsBarChart
from "../../components/charts/BarChart";

import QuarterSelector
from "../../components/analytics/QuarterSelector";

import SummaryCards
from "../../components/analytics/SummaryCards";

import SubmissionTabs
from "../../components/analytics/SubmissionTabs";

import SubmissionTable
from "../../components/analytics/SubmissionTable";

import NotSubmittedTable
from "../../components/analytics/NotSubmittedTable";

import {
    getDeanAnalytics,
    downloadDeanPDF
} from "../../api/deanApi";
import schoolsDepartments from "../../data/schoolsDepartments";

function DeanAnalytics() {

    const [

        analytics,

        setAnalytics

    ] = useState(null);

    const [

        loading,

        setLoading

    ] = useState(true);

    const [

        selectedQuarter,

        setSelectedQuarter

    ] = useState("Q1");

    const [

        selectedTab,

        setSelectedTab

    ] = useState("submitted");

    const [
selectedRole,
setSelectedRole
] = useState("faculty");

const [
selectedDepartment,
setSelectedDepartment
] = useState("");

const [
departments,
setDepartments
] = useState([]);

const user =
JSON.parse(
localStorage.getItem("user")
);

useEffect(() => {

if(

user?.school &&

schoolsDepartments[user.school]

){

setDepartments(

schoolsDepartments[user.school]

);

}

}, [user]);

    useEffect(() => {

if(selectedDepartment){

loadAnalytics();

}

}, [

selectedRole,

selectedDepartment

]);


    const loadAnalytics = async () => {

    try {

        setLoading(true);

        const res =
            await getDeanAnalytics(
                selectedRole,
                selectedDepartment
            );

        setAnalytics(res.data);

    }

    catch(err){

        console.log(err);

    }

    finally{

        setLoading(false);

    }

};

        
    if(!selectedDepartment){

return(

<DeanLayout>

<div
style={{
padding:"30px"
}}
>

<h1>

📊 Dean Analytics

</h1>

<div
style={{
background:"#fff",
padding:"25px",
borderRadius:"15px",
marginTop:"25px"
}}
>

<div
style={{
display:"flex",
gap:"20px"
}}
>

<div>

<label>

Role

</label>

<br/>

<select

value={selectedRole}

onChange={(e)=>{

setSelectedRole(

e.target.value

);

setSelectedDepartment("");

}}

style={{
padding:"10px",
width:"220px"
}}

>

<option value="faculty">

Faculty

</option>

<option value="hod">

HOD

</option>

</select>

</div>

<div>

<label>

Department

</label>

<br/>

<select

value={selectedDepartment}

onChange={(e)=>

setSelectedDepartment(

e.target.value

)

}

style={{
padding:"10px",
width:"350px"
}}

>

<option value="">

Select Department

</option>

{

departments.map(dep=>(

<option

key={dep}

value={dep}

>

{dep}

</option>

))

}

</select>

</div>

</div>

</div>

</div>

</DeanLayout>

);

}

    if (loading) {

        return (

            <DeanLayout>

                <div
                    style={{
                        padding: "30px"
                    }}
                >

                    <h2>

                        Loading Analytics...

                    </h2>

                </div>

            </DeanLayout>

        );

    }

    const quarter =

    analytics?.analytics?.[
        selectedQuarter
    ];

    const summary = {

    totalFaculty:

       analytics?.summary?.totalUsers || 0,

        totalSubmitted:
    quarter?.submittedCount || 0,

totalPending:
    quarter?.pendingCount || 0,

totalApproved:
    quarter?.approvedCount || 0,

totalRejected:
    quarter?.rejectedCount || 0,

totalNotSubmitted:
    quarter?.notSubmittedCount || 0

    };

    const getCurrentData = () => {

        switch (selectedTab) {

            case "submitted":

               return quarter?.submitted || [];

            case "pending":

                return quarter?.pending || [];

            case "approved":

                return quarter?.approved || [];

            case "rejected":

                return quarter?.rejected || [];

            default:

                return [];

        }

    };

    const handleDownload =

        async (

            submission

        ) => {

            try {

                const res =

                    await downloadDeanPDF(
submission._id
);
                const url =

                    window.URL.createObjectURL(

                        new Blob([

                            res.data

                        ])

                    );

                const link =

                    document.createElement("a");

                link.href = url;

                link.download =

                    `${submission.submittedByName}.pdf`;

                link.click();

            }

            catch (err) {

                console.log(err);

            }

        };
            return (

        <DeanLayout>

            <div
                style={{
                    padding: "30px",
                    background: "#f3f4f6",
                    minHeight: "100vh"
                }}
            >

                <h1
                    style={{
                        marginBottom: "15px"
                    }}
                >
                    📊 Dean Analytics
                </h1>

                <hr
                    style={{
                        marginBottom: "25px"
                    }}
                />

                {/* ========================= */}
                {/* Faculty Overview */}
                {/* ========================= */}

                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "15px",
                        marginBottom: "30px",
                        boxShadow:
                            "0 4px 12px rgba(0,0,0,.08)"
                    }}
                >

                    <h2>

{

selectedRole==="faculty"

? "Faculty Overview"

: "HOD Overview"

}

</h2>

                    <p>

                        <strong>

{

selectedRole==="faculty"

? "Total Faculty :"

: "Total HOD :"

}

</strong>
                        {" "}

                        {

                            analytics?.summary?.totalUsers || 0

                        }

                    </p>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "20px"
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    background: "#2563eb",
                                    color: "#fff"
                                }}
                            >

                                <th>

{

selectedRole==="faculty"

? "Faculty Name"

: "HOD Name"

}

</th>

                                <th
                                    style={{
                                        padding: "12px"
                                    }}
                                >
                                    Email
                                </th>

                                <th
                                    style={{
                                        padding: "12px"
                                    }}
                                >
                                    Department
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                               (analytics?.userList || []).map((user)=>(

                                        <tr
                                            key={user._id}
                                        >

                                            <td
                                                style={{
                                                    padding: "12px",
                                                    borderBottom:
                                                        "1px solid #ddd"
                                                }}
                                            >
                                                {

                                                    user.name

                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding: "12px",
                                                    borderBottom:
                                                        "1px solid #ddd"
                                                }}
                                            >
                                                {

                                                   user.email

                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding: "12px",
                                                    borderBottom:
                                                        "1px solid #ddd"
                                                }}
                                            >
                                                {
   user.department ||

  analytics?.department ||

    "-"
}
                                            </td>

                                        </tr>

                                    )

                                )

                            }

                        </tbody>

                    </table>

                </div>

                {/* ========================= */}
                {/* Bar Chart */}
                {/* ========================= */}

                <AnalyticsBarChart
    data={analytics?.chartData || []}
/>

                {/* ========================= */}
                {/* Quarter Selector */}
                {/* ========================= */}

                <QuarterSelector

                    selectedQuarter={
                        selectedQuarter
                    }

                    setSelectedQuarter={
                        setSelectedQuarter
                    }

                />

                {/* ========================= */}
                {/* Summary Cards */}
                {/* ========================= */}

                <SummaryCards

                    summary={summary}

                />

                {/* ========================= */}
                {/* Tabs */}
                {/* ========================= */}

                <SubmissionTabs

    activeTab={selectedTab}

    setActiveTab={setSelectedTab}

    counts={{

    submitted: quarter?.submittedCount || 0,

    pending: quarter?.pendingCount || 0,

    approved: quarter?.approvedCount || 0,

    rejected: quarter?.rejectedCount || 0,

    notSubmitted: quarter?.notSubmittedCount || 0

}}

/>
                                {/* ========================= */}
                {/* Tables */}
                {/* ========================= */}

                {

                    selectedTab === "notSubmitted"

                        ? (

                            <NotSubmittedTable

    facultyList={

        quarter?.notSubmitted || []

    }

/>

                        )

                        : (

                            <SubmissionTable

    submissions={

        getCurrentData()

    }

    showRemarks={

        selectedTab === "rejected"

    }

    onDownload={

        handleDownload

    }

/>

                        )

                }

               
            </div>

        </DeanLayout>

    );

}

export default DeanAnalytics;