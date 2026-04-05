import axios from "axios";

// 1. Create the base instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    // If the request succeeds, just pass the data through
    return response;
  },
  (error) => {
    // If the backend throws our custom AppError, we catch it here
    const { response } = error;

    if (response) {
      // If it's a 401 Unauthorized (Token expired or missing)
      if (response.status === 401) {
        console.warn("Session expired. Redirecting to login...");
      }

      console.error("API Error:", response.data.message);
    }

    return Promise.reject(error);
  },
);

// 3. Export dedicated functions for your API endpoints to keep components clean
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
  logout: () => api.get("/auth/logout"),
};

export const tripService = {
  getLocations: () => api.get("/trips/locations"),
  searchTrips: (params) => api.get("/trips/search", { params }), // e.g., { origin: 'Ahmedabad' }
};

export const bookingService = {
  createBooking: (data) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/my-bookings"),
};

export const adminService = {
  createBus: (data) => api.post("/admin/buses", data),
  createRoute: (data) => api.post("/admin/routes", data),
  createTrip: (data) => api.post("/admin/trips", data),
};

export default api;
