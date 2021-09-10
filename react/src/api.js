import axios from "axios";
import Cookies from "js-cookie";
import { Auth } from "./helpers";

let isRefreshing = false;
let awaitingRefresh = [];

function clearAwaitingRefresh(success) {
  if (success) {
    awaitingRefresh.forEach(req => {
      try {
        req.headers["Authorization"] =
          "Bearer " + localStorage.getItem("token");
        instance.request(req);
        awaitingRefresh = [];
      } catch (e) {
        console.log(e);
      }
    });
  } else {
    awaitingRefresh = [];
  }
}

export function refreshTokenAxios() {
  isRefreshing = true;
  const formData = new FormData();
  formData.append("grant_type", "refresh_token");
  formData.append("client_id", "QWGyvnVnh6oqk4nD6WpCjc5phlSUCudkYHjEkyiW");
  formData.append("refresh_token", localStorage.getItem("refreshToken"));

  return axios.post(
    `https://dashboard.zepto-ai.com/api/user/refresh/`,
    formData
  );
}

let errorCount = 0;

const instance = axios.create({
  baseURL: "https://dashboard.zepto-ai.com/api/"
});

instance.interceptors.request.use(request => {
  if (request.params && localStorage.getItem("employee"))
    request.params.employee = localStorage.getItem("employee");
  else if (localStorage.getItem("employee"))
    request.params = { employee: localStorage.getItem("employee") };
  request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return request;
});
instance.interceptors.response.use(
  function handleResponse(response) {
    errorCount = 0;
    return response;
  },
  function handleError(error) {
    if (
      error.config &&
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      if (!isRefreshing) {
        awaitingRefresh.push(error.config);
        return refreshTokenAxios()
          .then(result => {
            isRefreshing = false;
            localStorage.setItem("token", result.data.access_token);
            localStorage.setItem("refreshToken", result.data.refresh_token);
            clearAwaitingRefresh(true);
            return;
          })
          .catch(error => {
            isRefreshing = false;
            clearAwaitingRefresh(false);
            Auth.signout();
            window.location.reload(false);
          });
      } else {
        awaitingRefresh.push(error.config);
        return;
      }
    }

    if (
      error.config &&
      error.response &&
      error.response.status === 500 &&
      errorCount <= 5
    ) {
      errorCount++;
    }

    return Promise.reject(error);
  }
);
export default instance;
