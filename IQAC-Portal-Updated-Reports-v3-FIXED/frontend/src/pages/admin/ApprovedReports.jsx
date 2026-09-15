import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import schoolsDepartments from "../../data/schoolsDepartments";
import facultyQuestions from "../../data/facultyQuestions";
import hodQuestions from "../../data/hodQuestions";
import deanQuestions from "../../data/deanQuestions";
import SubmissionExcelSheet from "../../components/admin/SubmissionExcelSheet";
import {
  getApprovedSubmissions,
  downloadApprovedReportsExcel,
  downloadApprovedReportsPDF
} from "../../api/adminApi";

// A report is considered approved once it has passed the relevant reviewer.
const APPROVED_STATUSES = new Set([
  "Approved by HOD",
  "Pending Dean Review",
  "Approved by Dean",
  "Submitted to Admin",
  "Approved by Admin",
]);

const roleName = (role = "") => String(role).toLowerCase();

function ApprovedReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [quarterFilter, setQuarterFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [downloading, setDownloading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const loadApprovedReports = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      const response = await getApprovedSubmissions();
      const latest = Array.isArray(response?.data?.submissions)
        ? response.data.submissions
        : [];

      setSubmissions(latest);
    } catch (err) {
      console.error("Failed to load approved reports:", err);
      setError("Unable to load approved reports. Please restart the backend and refresh this page.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!mounted) return;
      await loadApprovedReports(true);
    };

    load();

    // Keep the Admin page synchronized with HOD/Dean approvals.
    // No manual refresh is required; every poll reads the current DB state.
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadApprovedReports(false);
      }
    }, 3000);

    const handleFocus = () => loadApprovedReports(false);
    window.addEventListener("focus", handleFocus);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const approvedSubmissions = useMemo(
    () => submissions.filter((item) => APPROVED_STATUSES.has(item?.status)),
    [submissions]
  );

  const availableSections = useMemo(() => {
    const roleEntries = [
      { role: "dean", questions: deanQuestions },
      { role: "hod", questions: hodQuestions },
      { role: "faculty", questions: facultyQuestions },
    ];

    const availableRoles = new Set(approvedSubmissions.map((item) => roleName(item?.role)));
    const seen = new Map();

    roleEntries
      .filter(({ role }) => categoryFilter === "All" || role === categoryFilter)
      .forEach(({ role, questions }) => {
      if (!availableRoles.has(role) || !Array.isArray(questions)) return;
      questions.forEach((section) => {
        const no = String(section?.sectionNo ?? "");
        if (!seen.has(no)) seen.set(no, `Question ${no} - ${section?.sectionTitle || ""}`);
      });
      });

    return Array.from(seen.entries()).sort((a, b) => {
      const an = Number.parseFloat(a[0].replace(/[^0-9.]/g, ""));
      const bn = Number.parseFloat(b[0].replace(/[^0-9.]/g, ""));
      if (Number.isNaN(an) && Number.isNaN(bn)) return a[0].localeCompare(b[0]);
      if (Number.isNaN(an)) return 1;
      if (Number.isNaN(bn)) return -1;
      return an - bn;
    });
  }, [approvedSubmissions, categoryFilter]);

  const filteredReports = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return approvedSubmissions.filter((report) => {
      const name = report?.submittedByName || report?.submittedBy?.name || "";
      const email = report?.submittedByEmail || report?.submittedBy?.email || "";
      const school = report?.school || report?.submittedBy?.school || "";
      const department = report?.department || report?.submittedBy?.department || "";
      const role = roleName(report?.role);

      return (
        (categoryFilter === "All" || role === categoryFilter) &&
        (schoolFilter === "All" || school === schoolFilter) &&
        (departmentFilter === "All" || department === departmentFilter) &&
        (quarterFilter === "All" || report?.quarter === quarterFilter) &&
        (!searchValue || [name, email, school, department].some((value) =>
          String(value).toLowerCase().includes(searchValue)
        ))
      );
    });
  }, [approvedSubmissions, search, schoolFilter, departmentFilter, categoryFilter, quarterFilter]);

  const handleDownloadExcel = async () => {
    try {
      setDownloading(true);
      const response = await downloadApprovedReportsExcel({
        school: schoolFilter,
        department: departmentFilter,
        category: categoryFilter,
        quarter: quarterFilter,
        section: sectionFilter,
        search
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "IQAC_Approved_Reports.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Approved reports Excel download failed:", err);
      alert("Excel download failed. Please restart the backend and try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      const response = await downloadApprovedReportsPDF({
        school: schoolFilter,
        department: departmentFilter,
        category: categoryFilter,
        quarter: quarterFilter,
        section: sectionFilter,
        search
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "IQAC_Approved_Reports.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Approved reports PDF download failed:", err);
      alert("PDF download failed. Please restart the backend and try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSchoolFilter("All");
    setDepartmentFilter("All");
    setCategoryFilter("All");
    setQuarterFilter("All");
    setSectionFilter("All");
  };

  return (
    <AdminLayout>
      <div style={pageStyle}>
        <div style={heroStyle}>
          <h1 style={{ margin: 0 }}>Approved Reports</h1>
          <p style={{ margin: "8px 0 0" }}>
            Approved IQAC submissions in the Data Capture Template format.
          </p>
        </div>

        <div style={filterBox}>
          <Filter label="Faculty / College">
            <select
              value={schoolFilter}
              onChange={(e) => {
                setSchoolFilter(e.target.value);
                setDepartmentFilter("All");
              }}
              style={inputStyle}
            >
              <option value="All">All Faculties / Colleges</option>
              {Object.keys(schoolsDepartments || {}).map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </Filter>

          <Filter label="Category">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={inputStyle}>
              <option value="All">All Categories</option>
              <option value="faculty">Faculty</option>
              <option value="hod">HOD</option>
              <option value="dean">Dean</option>
            </select>
          </Filter>

          <Filter label="Search">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, school or department" style={inputStyle} />
          </Filter>

          <Filter label="Department">
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} style={inputStyle}>
              <option value="All">All Departments</option>
              {schoolFilter !== "All" && (schoolsDepartments?.[schoolFilter] || []).map((department) => (
                <option key={department} value={department}>{department}</option>
              ))} 
            </select>
          </Filter>

          <Filter label="Quarter">
            <select value={quarterFilter} onChange={(e) => setQuarterFilter(e.target.value)} style={inputStyle}>
              <option value="All">All Quarters</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>
          </Filter>

          <Filter label="Main Question / Section">
            <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} style={inputStyle}>
              <option value="All">All Questions / Sections</option>
              {availableSections.map(([number, label]) => (
                <option key={number} value={number}>{label}</option>
              ))}
            </select>
          </Filter>

          <div style={{ display: "flex", alignItems: "end", gap: 10 }}>
            <button onClick={() => loadApprovedReports(true)} disabled={loading} style={refreshButton}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button onClick={handleDownloadExcel} disabled={downloading} style={downloadButton}>
              {downloading ? "Preparing Excel..." : "Download Excel"}
            </button>
            <button onClick={handleDownloadPDF} disabled={downloadingPdf} style={pdfButton}>
              {downloadingPdf ? "Preparing PDF..." : "Download PDF"}
            </button>
            <button onClick={resetFilters} style={resetButton}>Reset Filters</button>
          </div>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={countStyle}>
          {loading
            ? "Loading approved reports..."
            : `${filteredReports.length} approved report${filteredReports.length === 1 ? "" : "s"} shown`}
        </div>

        {!loading && !error && (
          <SubmissionExcelSheet
            submissions={filteredReports}
            questionSets={{
              faculty: Array.isArray(facultyQuestions) ? facultyQuestions : [],
              hod: Array.isArray(hodQuestions) ? hodQuestions : [],
              dean: Array.isArray(deanQuestions) ? deanQuestions : [],
            }}
            categoryFilter={categoryFilter}
            sectionFilter={sectionFilter}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function Filter({ label, children }) {
  return (
    <label style={labelStyle}>
      <span>{label}</span>
      {children}
    </label>
  );
}

const pageStyle = { background: "#f3f4f6", minHeight: "100vh", paddingBottom: 40 };
const heroStyle = { background: "linear-gradient(135deg,#2563eb,#1e3a8a)", color: "#fff", padding: "28px 30px", borderRadius: 15, marginBottom: 24 };
const filterBox = { background: "#fff", padding: 20, borderRadius: 15, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 15, marginBottom: 20 };
const labelStyle = { display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, color: "#374151" };
const inputStyle = { width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: 8, background: "#fff", color: "#111827", fontSize: 14 };
const refreshButton = { flex: 1, padding: "12px 14px", border: "none", borderRadius: 8, background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" };
const downloadButton = { flex: 1, padding: "12px 14px", border: "none", borderRadius: 8, background: "#16a34a", color: "#fff", fontWeight: 700, cursor: "pointer" };
const pdfButton = { flex: 1, padding: "12px 14px", border: "none", borderRadius: 8, background: "#dc2626", color: "#fff", fontWeight: 700, cursor: "pointer" };
const resetButton = { flex: 1, padding: "12px 14px", border: "none", borderRadius: 8, background: "#374151", color: "#fff", fontWeight: 700, cursor: "pointer" };
const countStyle = { marginBottom: 10, color: "#374151", fontWeight: 600 };
const errorStyle = { background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca", padding: "14px 16px", borderRadius: 10, marginBottom: 15 };

export default ApprovedReports;
