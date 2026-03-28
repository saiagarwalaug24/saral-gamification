'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  selectRewardType,
  updateRewardBonusAmount,
  confirmReward,
  cancelRewardEdit,
} from '@/lib/store/gamificationSlice';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useRef, useEffect } from 'react';

export function RewardDropdown() {
  const dispatch = useAppDispatch();
  const { rewardDropdownOpen, selectedRewardType, rewardConfig, eventConfirmed, selectedEventType } =
    useAppSelector((s) => s.gamification.modal);
  const bonusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedRewardType === 'flat_bonus') bonusRef.current?.focus();
  }, [selectedRewardType]);

  if (!rewardDropdownOpen || !eventConfirmed) return null;

  const canSave =
    selectedRewardType === 'flat_bonus' && rewardConfig.bonusAmount.trim() !== '';

  /* Upgrade Commission Tier is only enabled for "Cross $X in sales" */
  const isTierEnabled = selectedEventType === 'cross_sales';

  return (
    <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-border bg-popover shadow-lg">
      <div className="space-y-0.5 p-1.5">
        {/* Flat $X bonus */}
        <div>
          <button
            type="button"
            onClick={() => dispatch(selectRewardType('flat_bonus'))}
            className={cn(
              'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors',
              selectedRewardType === 'flat_bonus'
                ? 'bg-primary/5 text-primary'
                : 'text-foreground hover:bg-accent'
            )}
          >
            <span>
              {rewardConfig.bonusAmount
                ? `Flat $${rewardConfig.bonusAmount} bonus`
                : 'Flat $X bonus'}
            </span>
            {selectedRewardType === 'flat_bonus' && (
              <Check className="size-4 shrink-0 text-primary" />
            )}
          </button>

          {selectedRewardType === 'flat_bonus' && (
            <div className="mx-3 mb-2 mt-1.5">
              <input
                ref={bonusRef}
                type="number"
                placeholder="Enter bonus amount"
                value={rewardConfig.bonusAmount}
                onChange={(e) => dispatch(updateRewardBonusAmount(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
        </div>

        {/* Upgrade Commission Tier — navigates to tier select screen (only for cross_sales) */}
        <button
          type="button"
          disabled={!isTierEnabled}
          onClick={() => isTierEnabled && dispatch(selectRewardType('upgrade_tier'))}
          className={cn(
            'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors',
            !isTierEnabled
              ? 'cursor-not-allowed text-muted-foreground/50'
              : selectedRewardType === 'upgrade_tier'
                ? 'bg-primary/5 text-primary'
                : 'text-foreground hover:bg-accent'
          )}
        >
          <span>Upgrade Commission Tier</span>
          {selectedRewardType === 'upgrade_tier' && isTierEnabled && (
            <Check className="size-4 shrink-0 text-primary" />
          )}
        </button>
      </div>

      {/* Footer — only for flat_bonus */}
      {selectedRewardType === 'flat_bonus' && (
        <div className="flex items-center justify-end gap-2 border-t border-border px-3 py-2.5">
          <button
            type="button"
            onClick={() => dispatch(cancelRewardEdit())}
            className="rounded-md px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => canSave && dispatch(confirmReward())}
            disabled={!canSave}
            className={cn(
              'rounded-md px-5 py-1.5 text-xs font-semibold transition-all',
              canSave
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'cursor-not-allowed bg-muted text-muted-foreground'
            )}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
