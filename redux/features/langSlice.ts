import { createSlice } from '@reduxjs/toolkit';

interface LangState {
  isArabic: boolean;
}

const storedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;

const initialState: LangState = {
  isArabic: storedLang === 'ar',
};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setArabic: (state) => {
      state.isArabic = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', 'ar');
      }
    },
    setEnglish: (state) => {
      state.isArabic = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', 'en');
      }
    },
  },
});

export const { setArabic, setEnglish } = langSlice.actions;
export default langSlice.reducer;
