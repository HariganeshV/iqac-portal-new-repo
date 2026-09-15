import API from "./submissionApi";

export const getHodAnalytics = () =>
    API.get("/hod/analytics");