import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import companyReducer from './slices/companySlice';
import notificationReducer from './slices/notificationSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    companies: companyReducer,
    notifications: notificationReducer,
    theme: themeReducer,
  },
});
