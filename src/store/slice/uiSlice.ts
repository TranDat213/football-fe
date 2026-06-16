import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'dark' | 'light';
  sidebarExpanded: boolean;
  dashboardActiveTab: string;
}

const initialState: UiState = {
  theme: 'dark', // default theme is premium dark mode
  sidebarExpanded: false, // collapsed by default for a clean aesthetic
  dashboardActiveTab: 'ops',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    setSidebarExpanded: (state, action: PayloadAction<boolean>) => {
      state.sidebarExpanded = action.payload;
    },
    setDashboardActiveTab: (state, action: PayloadAction<string>) => {
      state.dashboardActiveTab = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarExpanded,
  setDashboardActiveTab,
} = uiSlice.actions;

export default uiSlice.reducer;
