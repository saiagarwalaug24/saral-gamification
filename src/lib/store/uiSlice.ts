import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Tab = 'General' | 'Preferences' | 'Gamification';

interface UiState {
  activeTab: Tab;
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  datePicker: {
    isOpen: boolean;
    viewMonth: number;
    viewYear: number;
  };
}

function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return { month: d.getMonth(), year: d.getFullYear() };
}

const tomorrow = getTomorrowDate();

const initialState: UiState = {
  activeTab: 'Gamification',
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  datePicker: {
    isOpen: false,
    viewMonth: tomorrow.month,
    viewYear: tomorrow.year,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<Tab>) {
      state.activeTab = action.payload;
    },
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarMobileOpen(state, action: PayloadAction<boolean>) {
      state.sidebarMobileOpen = action.payload;
    },
    setDatePickerOpen(state, action: PayloadAction<boolean>) {
      state.datePicker.isOpen = action.payload;
    },
    setDatePickerViewMonth(state, action: PayloadAction<number>) {
      state.datePicker.viewMonth = action.payload;
    },
    setDatePickerViewYear(state, action: PayloadAction<number>) {
      state.datePicker.viewYear = action.payload;
    },
    datePickerGoNext(state) {
      if (state.datePicker.viewMonth === 11) {
        state.datePicker.viewMonth = 0;
        state.datePicker.viewYear += 1;
      } else {
        state.datePicker.viewMonth += 1;
      }
    },
    datePickerGoPrev(state) {
      if (state.datePicker.viewMonth === 0) {
        state.datePicker.viewMonth = 11;
        state.datePicker.viewYear -= 1;
      } else {
        state.datePicker.viewMonth -= 1;
      }
    },
  },
});

export const {
  setActiveTab,
  toggleSidebarCollapsed,
  setSidebarMobileOpen,
  setDatePickerOpen,
  setDatePickerViewMonth,
  setDatePickerViewYear,
  datePickerGoNext,
  datePickerGoPrev,
} = uiSlice.actions;

export default uiSlice.reducer;
