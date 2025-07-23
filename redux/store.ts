import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './services/apiSlice';
import authReducer from './features/authSlice';
import langReducer from './features/langSlice';

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authReducer,
		lang: langReducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<(typeof store)['getState']>;
export type AppDispatch = (typeof store)['dispatch'];
