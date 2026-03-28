'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  closeModal,
  toggleEventDropdown,
  toggleRewardDropdown,
  toggleTimeBound,
  createReward,
  editEvent,
  editReward,
} from '@/lib/store/gamificationSlice';
import { cn } from '@/lib/utils';
import { X, ChevronDown, Pencil } from 'lucide-react';
import { EventDropdown } from './event-dropdown';
import { RewardDropdown } from './reward-dropdown';
import { TierSelectView } from './tier-select';
import { DatePicker } from './date-picker';

function getEventLabel(
  type: string | null,
  config: { salesAmount: string; postsCount: string; postsDuration: string }
): string | null {
  if (!type) return null;
  if (type === 'cross_sales') {
    return config.salesAmount ? `Cross $${config.salesAmount} in sales` : 'Cross $X in sales';
  }
  if (type === 'posts_period') {
    const count = config.postsCount || 'X';
    const dur = config.postsDuration || 'Y period';
    return `Posts ${count} times every ${dur}`;
  }
  return 'Is Onboarded';
}

function getRewardLabel(
  type: string | null,
  config: { bonusAmount: string; tierName: string }
): string | null {
  if (!type) return null;
  if (type === 'flat_bonus') {
    return config.bonusAmount ? `Flat $${config.bonusAmount} bonus` : 'Flat $X bonus';
  }
  if (type === 'upgrade_tier') {
    return config.tierName ? `Upgrade to ${config.tierName}` : 'Upgrade Commission Tier';
  }
  return null;
}

export function CreateRewardModal() {
  const dispatch = useAppDispatch();
  const modal = useAppSelector((s) => s.gamification.modal);

  if (!modal.isOpen) return null;

  const {
    view,
    selectedEventType,
    eventConfig,
    eventConfirmed,
    selectedRewardType,
    rewardConfig,
    rewardConfirmed,
    isTimeBound,
    endDate,
  } = modal;

  const eventLabel = getEventLabel(selectedEventType, eventConfig);
  const rewardLabel = getRewardLabel(selectedRewardType, rewardConfig);

  const canCreate = eventConfirmed && rewardConfirmed && (!isTimeBound || endDate !== null);

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => dispatch(closeModal())}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl">
          {view === 'tier_select' ? (
            <TierSelectView />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
                <h2 className="font-display text-base font-semibold text-foreground sm:text-lg">
                  Create your reward system
                </h2>
                <button
                  onClick={() => dispatch(closeModal())}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 pb-4 sm:px-6 sm:pb-5">
                <div className="space-y-5">
                  {/* Reward Event */}
                  <fieldset>
                    <legend className="mb-1.5 text-sm font-medium text-foreground">
                      Reward event <span className="text-primary">*</span>
                    </legend>
                    <div className="relative">
                      {eventConfirmed && eventLabel ? (
                        <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5">
                          <span className="text-sm text-foreground">{eventLabel}</span>
                          <button
                            type="button"
                            onClick={() => dispatch(editEvent())}
                            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            aria-label="Edit event"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => dispatch(toggleEventDropdown())}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                            modal.eventDropdownOpen
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/40'
                          )}
                          aria-expanded={modal.eventDropdownOpen}
                          aria-haspopup="listbox"
                        >
                          <span className={selectedEventType ? 'text-foreground' : 'text-muted-foreground'}>
                            {eventLabel || 'Select an event'}
                          </span>
                          <ChevronDown
                            className={cn(
                              'size-4 text-muted-foreground transition-transform',
                              modal.eventDropdownOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      )}
                      <EventDropdown />
                    </div>
                  </fieldset>

                  {/* Reward With */}
                  <fieldset
                    className={cn(
                      'transition-opacity duration-200',
                      !eventConfirmed && 'pointer-events-none opacity-40'
                    )}
                    disabled={!eventConfirmed}
                  >
                    <legend className="mb-1.5 text-sm font-medium text-foreground">
                      Reward with <span className="text-primary">*</span>
                    </legend>
                    <div className="relative">
                      {rewardConfirmed && rewardLabel ? (
                        <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5">
                          <span className="text-sm text-foreground">{rewardLabel}</span>
                          <button
                            type="button"
                            onClick={() => dispatch(editReward())}
                            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                            aria-label="Edit reward"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => dispatch(toggleRewardDropdown())}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                            modal.rewardDropdownOpen
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/40'
                          )}
                          aria-expanded={modal.rewardDropdownOpen}
                          aria-haspopup="listbox"
                        >
                          <span className={selectedRewardType ? 'text-foreground' : 'text-muted-foreground'}>
                            {rewardLabel || 'Select a reward'}
                          </span>
                          <ChevronDown
                            className={cn(
                              'size-4 text-muted-foreground transition-transform',
                              modal.rewardDropdownOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      )}
                      <RewardDropdown />
                    </div>
                  </fieldset>

                  {/* Time-bound */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-foreground">
                          Make the reward time bound
                        </span>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Choose an end date to stop this reward automatically.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isTimeBound}
                        onClick={() => dispatch(toggleTimeBound())}
                        className={cn(
                          'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
                          isTimeBound ? 'bg-primary' : 'bg-muted'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-1 left-1 size-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                            isTimeBound && 'translate-x-5'
                          )}
                        />
                      </button>
                    </div>

                    {isTimeBound && (
                      <div className="mt-3">
                        <DatePicker />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3 sm:px-6 sm:py-4">
                <button
                  type="button"
                  onClick={() => dispatch(closeModal())}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:px-5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(createReward())}
                  disabled={!canCreate}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-semibold transition-all sm:px-5',
                    canCreate
                      ? 'bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98]'
                      : 'cursor-not-allowed bg-muted text-muted-foreground'
                  )}
                >
                  Create Reward
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
