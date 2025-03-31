import axios from "axios";

const API_KEY = "OKLLGRaNit0P64WfnuVpCSMuGjys28erRwhgdypZ6AdlXjdERlx0a0mA";
const BASE_URL = "https://api.pexels.com/v1";

export const fetchImages = (query, perPage = 40) => {
  return axios.get(`${BASE_URL}/search`, {
    headers: { Authorization: API_KEY },
    params: { query, per_page: perPage },
  });
};


