import axios from "axios";
const api_url = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const apiClient = axios.create({
  baseURL: api_url,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important to send cookies with requests
});

// Request interceptor to add access token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${api_url}/auth/refreshToken`,
      {},
      { withCredentials: true }
    );
    const { token } = response.data.data;
    localStorage.setItem("access_token", token);
    return token;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    // Handle refresh token failure (e.g., redirect to login)
    return null;
  }
};

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers["x-auth-token"] = newAccessToken;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
