'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  selectEventType,
  updateEventSalesAmount,
  updateEventPostsCount,
  updateEventPostsDuration,
  confirmEvent,
  cancelEventEdit,
  type RewardEventType,
} from '@/lib/store/gamificationSlice';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { useRef, useEffect } from 'react';

const DURATION_OPTIONS = [
  { value: '14 days', label: '14 days' },
  { value: '1 month', label: '1 month' },
  { value: '2 months', label: '2 months' },
  { value: '3 months', label: '3 months' },
  { value: '1 year', label: '1 year' },
];

interface EventOption {
  type: RewardEventType;
  getLabel: (config: {
    salesAmount: string;
    postsCount: string;
    postsDuration: string;
  }) => string;
}

const eventOptions: EventOption[] = [
  {
    type: 'cross_sales',
    getLabel: (c) =>
      c.salesAmount ? `Cross $${c.salesAmount} in sales` : 'Cross $X in sales',
  },
  {
    type: 'posts_period',
    getLabel: (c) => {
      const count = c.postsCount || 'X';
      const dur = c.postsDuration || 'Y period';
      return `Posts ${count} times every ${dur}`;
    },
  },
  {
    type: 'is_onboarded',
    getLabel: () => 'Is Onboarded',
  },
];

export function EventDropdown() {
  const dispatch = useAppDispatch();
  const { eventDropdownOpen, selectedEventType, eventConfig } = useAppSelector(
    (s) => s.gamification.modal
  );
  const salesRef = useRef<HTMLInputElement>(null);
  const postsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedEventType === 'cross_sales') salesRef.current?.focus();
    if (selectedEventType === 'posts_period') postsRef.current?.focus();
  }, [selectedEventType]);

  if (!eventDropdownOpen) return null;

  const canSave =
    selectedEventType === 'is_onboarded' ||
    (selectedEventType === 'cross_sales' &&
      eventConfig.salesAmount.trim() !== '') ||
    (selectedEventType === 'posts_period' &&
      eventConfig.postsCount.trim() !== '' &&
      eventConfig.postsDuration.trim() !== '');

  return (
    <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-border bg-popover shadow-lg">
      <div className="space-y-0.5 p-1.5">
        {eventOptions.map((opt) => {
          const active = selectedEventType === opt.type;
          return (
            <div key={opt.type}>
              <button
                type="button"
                onClick={() => dispatch(selectEventType(opt.type))}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors',
                  active
                    ? 'bg-primary/5 text-primary'
                    : 'text-foreground hover:bg-accent'
                )}
              >
                <span>{opt.getLabel(eventConfig)}</span>
                {active && <Check className="size-4 shrink-0 text-primary" />}
              </button>

              {/* Cross $X in sales — inline input */}
              {active && opt.type === 'cross_sales' && (
                <div className="mx-3 mb-2 mt-1.5">
                  <input
                    ref={salesRef}
                    type="number"
                    placeholder="eg: 100"
                    value={eventConfig.salesAmount}
                    onChange={(e) =>
                      dispatch(updateEventSalesAmount(e.target.value))
                    }
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {/* Posts X times every Y — inline inputs */}
              {active && opt.type === 'posts_period' && (
                <div className="mx-3 mb-2 mt-1.5 flex items-center gap-2">
                  <input
                    ref={postsRef}
                    type="number"
                    placeholder="eg: 4"
                    value={eventConfig.postsCount}
                    onChange={(e) =>
                      dispatch(updateEventPostsCount(e.target.value))
                    }
                    className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="relative flex-1">
                    <select
                      value={eventConfig.postsDuration}
                      onChange={(e) =>
                        dispatch(updateEventPostsDuration(e.target.value))
                      }
                      className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select duration</option>
                      {DURATION_OPTIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t border-border px-3 py-2.5">
        <button
          type="button"
          onClick={() => dispatch(cancelEventEdit())}
          className="rounded-md px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          Cancel
        </button>
        {selectedEventType && (
          <button
            type="button"
            onClick={() => canSave && dispatch(confirmEvent())}
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
        )}
      </div>
    </div>
  );
}
