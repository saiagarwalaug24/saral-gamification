import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type RewardEventType = 'cross_sales' | 'posts_period' | 'is_onboarded' | null;
export type RewardWithType = 'flat_bonus' | 'upgrade_tier' | null;
export type ModalView = 'main' | 'tier_select';

export interface RewardEvent {
  type: RewardEventType;
  salesAmount: number | null;
  postsCount: number | null;
  postsDuration: string | null;
}

export interface RewardWith {
  type: RewardWithType;
  bonusAmount: number | null;
  tierName: string | null;
}

export interface Reward {
  id: string;
  event: RewardEvent;
  reward: RewardWith;
  isTimeBound: boolean;
  endDate: string | null;
  createdAt: string;
}

interface EventConfig {
  salesAmount: string;
  postsCount: string;
  postsDuration: string;
}

interface RewardConfig {
  bonusAmount: string;
  tierName: string;
}

interface ModalState {
  isOpen: boolean;
  view: ModalView;
  eventDropdownOpen: boolean;
  rewardDropdownOpen: boolean;
  selectedEventType: RewardEventType;
  eventConfig: EventConfig;
  eventConfirmed: boolean;
  selectedRewardType: RewardWithType;
  rewardConfig: RewardConfig;
  rewardConfirmed: boolean;
  isTimeBound: boolean;
  endDate: string | null;
  pendingTierName: string;
}

export interface GamificationState {
  enabled: boolean;
  rewards: Reward[];
  modal: ModalState;
}

const initialEventConfig: EventConfig = {
  salesAmount: '',
  postsCount: '',
  postsDuration: '',
};

const initialRewardConfig: RewardConfig = {
  bonusAmount: '',
  tierName: '',
};

const initialModalState: ModalState = {
  isOpen: false,
  view: 'main',
  eventDropdownOpen: false,
  rewardDropdownOpen: false,
  selectedEventType: null,
  eventConfig: { ...initialEventConfig },
  eventConfirmed: false,
  selectedRewardType: null,
  rewardConfig: { ...initialRewardConfig },
  rewardConfirmed: false,
  isTimeBound: false,
  endDate: null,
  pendingTierName: '',
};

const initialState: GamificationState = {
  enabled: false,
  rewards: [],
  modal: { ...initialModalState },
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    enableGamification(state) {
      state.enabled = true;
      state.modal = { ...initialModalState, isOpen: true };
    },

    openModal(state) {
      state.modal = { ...initialModalState, isOpen: true };
    },
    closeModal(state) {
      state.modal = { ...initialModalState };
    },

    toggleEventDropdown(state) {
      const wasOpen = state.modal.eventDropdownOpen;
      state.modal.eventDropdownOpen = !wasOpen;
      if (!wasOpen) state.modal.rewardDropdownOpen = false;
    },
    selectEventType(state, action: PayloadAction<RewardEventType>) {
      state.modal.selectedEventType = action.payload;
      state.modal.eventConfig = { ...initialEventConfig };
    },
    updateEventSalesAmount(state, action: PayloadAction<string>) {
      state.modal.eventConfig.salesAmount = action.payload;
    },
    updateEventPostsCount(state, action: PayloadAction<string>) {
      state.modal.eventConfig.postsCount = action.payload;
    },
    updateEventPostsDuration(state, action: PayloadAction<string>) {
      state.modal.eventConfig.postsDuration = action.payload;
    },
    confirmEvent(state) {
      state.modal.eventConfirmed = true;
      state.modal.eventDropdownOpen = false;
      state.modal.rewardDropdownOpen = true;
    },
    editEvent(state) {
      state.modal.eventConfirmed = false;
      state.modal.eventDropdownOpen = true;
      state.modal.rewardDropdownOpen = false;
      state.modal.selectedRewardType = null;
      state.modal.rewardConfirmed = false;
      state.modal.rewardConfig = { ...initialRewardConfig };
    },
    cancelEventEdit(state) {
      if (!state.modal.eventConfirmed) {
        state.modal.selectedEventType = null;
        state.modal.eventConfig = { ...initialEventConfig };
      }
      state.modal.eventDropdownOpen = false;
    },

    toggleRewardDropdown(state) {
      if (!state.modal.eventConfirmed) return;
      const wasOpen = state.modal.rewardDropdownOpen;
      state.modal.rewardDropdownOpen = !wasOpen;
      if (!wasOpen) state.modal.eventDropdownOpen = false;
    },
    selectRewardType(state, action: PayloadAction<RewardWithType>) {
      state.modal.selectedRewardType = action.payload;
      state.modal.rewardConfig = { ...initialRewardConfig };
      if (action.payload === 'upgrade_tier') {
        state.modal.rewardDropdownOpen = false;
        state.modal.view = 'tier_select';
        state.modal.pendingTierName = '';
      }
    },
    updateRewardBonusAmount(state, action: PayloadAction<string>) {
      state.modal.rewardConfig.bonusAmount = action.payload;
    },
    confirmReward(state) {
      state.modal.rewardConfirmed = true;
      state.modal.rewardDropdownOpen = false;
    },
    editReward(state) {
      state.modal.rewardConfirmed = false;
      state.modal.rewardDropdownOpen = true;
    },
    cancelRewardEdit(state) {
      if (!state.modal.rewardConfirmed) {
        state.modal.selectedRewardType = null;
        state.modal.rewardConfig = { ...initialRewardConfig };
      }
      state.modal.rewardDropdownOpen = false;
    },

    setPendingTierName(state, action: PayloadAction<string>) {
      state.modal.pendingTierName = action.payload;
    },
    confirmTierSelection(state) {
      if (!state.modal.pendingTierName) return;
      state.modal.rewardConfig.tierName = state.modal.pendingTierName;
      state.modal.rewardConfirmed = true;
      state.modal.view = 'main';
      state.modal.pendingTierName = '';
    },
    goBackFromTierSelect(state) {
      state.modal.view = 'main';
      state.modal.selectedRewardType = null;
      state.modal.rewardDropdownOpen = true;
      state.modal.pendingTierName = '';
    },

    toggleTimeBound(state) {
      state.modal.isTimeBound = !state.modal.isTimeBound;
      if (!state.modal.isTimeBound) state.modal.endDate = null;
    },
    setEndDate(state, action: PayloadAction<string | null>) {
      state.modal.endDate = action.payload;
    },

    createReward(state) {
      const m = state.modal;
      if (!m.selectedEventType || !m.selectedRewardType) return;

      const reward: Reward = {
        id: crypto.randomUUID?.() ?? Date.now().toString(),
        event: {
          type: m.selectedEventType,
          salesAmount: m.eventConfig.salesAmount ? Number(m.eventConfig.salesAmount) : null,
          postsCount: m.eventConfig.postsCount ? Number(m.eventConfig.postsCount) : null,
          postsDuration: m.eventConfig.postsDuration || null,
        },
        reward: {
          type: m.selectedRewardType,
          bonusAmount: m.rewardConfig.bonusAmount ? Number(m.rewardConfig.bonusAmount) : null,
          tierName: m.rewardConfig.tierName || null,
        },
        isTimeBound: m.isTimeBound,
        endDate: m.endDate,
        createdAt: new Date().toISOString(),
      };

      state.rewards.push(reward);
      state.modal = { ...initialModalState };
    },

    deleteReward(state, action: PayloadAction<string>) {
      state.rewards = state.rewards.filter((r) => r.id !== action.payload);
    },
  },
});

export const {
  enableGamification,
  openModal,
  closeModal,
  toggleEventDropdown,
  selectEventType,
  updateEventSalesAmount,
  updateEventPostsCount,
  updateEventPostsDuration,
  confirmEvent,
  editEvent,
  cancelEventEdit,
  toggleRewardDropdown,
  selectRewardType,
  updateRewardBonusAmount,
  confirmReward,
  editReward,
  cancelRewardEdit,
  setPendingTierName,
  confirmTierSelection,
  goBackFromTierSelect,
  toggleTimeBound,
  setEndDate,
  createReward,
  deleteReward,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;
