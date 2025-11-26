import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // FIX: Check both storages for refresh token
                const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
                
                // If no refresh token, force logout
                if (!refreshToken) throw new Error("No refresh token");

                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: refreshToken
                });

                const newAccessToken = response.data.access;

                // FIX: Update whichever storage was being used
                if (localStorage.getItem('refresh_token')) {
                    localStorage.setItem('access_token', newAccessToken);
                } else {
                    sessionStorage.setItem('access_token', newAccessToken);
                }

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                
                return axiosInstance(originalRequest);
            } catch (err) {
                // Clear everything on failure
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;