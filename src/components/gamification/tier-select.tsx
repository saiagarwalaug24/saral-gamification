'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  setPendingTierName,
  confirmTierSelection,
  goBackFromTierSelect,
} from '@/lib/store/gamificationSlice';
import { cn } from '@/lib/utils';
import { X, ChevronDown } from 'lucide-react';

const TIERS = [
  'Tier Name Here',
  'Tier Name Here',
  'Tier Name Here',
  'Tier Name Here',
  'Tier Name Here',
  'Tier Name Here',
];

export function TierSelectView() {
  const dispatch = useAppDispatch();
  const { pendingTierName } = useAppSelector((s) => s.gamification.modal);

  const canSave = pendingTierName.trim() !== '';

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
        <h2 className="font-display text-base font-semibold text-foreground sm:text-lg">
          Select a commission tier
        </h2>
        <button
          onClick={() => dispatch(goBackFromTierSelect())}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="px-5 pb-4 sm:px-6 sm:pb-5">
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Upgrade to <span className="text-primary">*</span>
        </label>

        {/* Dropdown trigger */}
        <div className="flex w-full items-center justify-between rounded-lg border border-primary px-3 py-2.5 text-sm ring-2 ring-primary/20">
          <span className={pendingTierName ? 'text-foreground' : 'text-muted-foreground'}>
            {pendingTierName || 'Select a tier'}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>

        {/* Tier list — always visible below */}
        <div className="mt-1 rounded-lg border border-border bg-popover shadow-lg">
          <div className="max-h-52 overflow-y-auto p-1.5">
            {TIERS.map((tier, idx) => {
              const isSelected = pendingTierName === tier;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => dispatch(setPendingTierName(tier))}
                  className={cn(
                    'flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-primary/5 text-primary'
                      : 'text-foreground hover:bg-accent'
                  )}
                >
                  {tier}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={() => dispatch(goBackFromTierSelect())}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:px-5"
        >
          Go Back
        </button>
        <button
          type="button"
          onClick={() => dispatch(confirmTierSelection())}
          disabled={!canSave}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-semibold transition-all sm:px-5',
            canSave
              ? 'bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98]'
              : 'cursor-not-allowed bg-muted text-muted-foreground'
          )}
        >
          Save
        </button>
      </div>
    </>
  );
}
