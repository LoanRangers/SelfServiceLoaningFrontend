import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

// Flag to avoid infinite retry loops
let isRetrying = false;

// Intercept responses
api.interceptors.response.use(
  (response) => response, // Return successful responses directly
  async (error) => {
    const originalRequest = error.config;
    // If status is 503 and not already retried
    if (error.response?.status === 403 && !isRetrying) {
      isRetrying = true;

      try {
        // Perform your retry logic here, e.g., wait or refresh a token
        await api.post('/auth/refresh-token/', {}, { withCredentials: true });
        console.log('Retrying request due to 503 error...');

        // Retry the original request
        return api(originalRequest);
      } finally {
        isRetrying = false;
      }
    }

    // Reject if not 503 or already retried
    return Promise.reject(error);
  }
);

export default api;
