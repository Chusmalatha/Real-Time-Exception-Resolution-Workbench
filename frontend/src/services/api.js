import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    
    if (!error.response) {
      // Network error or backend down
      message = 'Unable to connect to the backend.';
    } else if (error.response.status >= 500) {
      // Server error
      message = 'Internal server error. Please try again later.';
    } else if (error.response.status === 404) {
      // Handled by component mostly, but if we wanted a fallback
      // message = 'Resource not found.';
      return Promise.reject(error); // let component handle 404s
    } else {
      // Bad request, handled by component
      return Promise.reject(error);
    }

    // Dispatch a custom event so ToastProvider can pick it up
    window.dispatchEvent(new CustomEvent('global-api-error', { detail: message }));
    return Promise.reject(error);
  }
);

export default api;
