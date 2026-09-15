import axios from "axios";

const API =
  "http://localhost:5000/api/questions";

export const getFacultyQuestions =
  async () => {

    const response =
      await axios.get(
        `${API}/faculty`
      );

    return response.data;
  };