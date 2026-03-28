'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { openModal, deleteReward, type Reward } from '@/lib/store/gamificationSlice';
import { Plus, Trash2, DollarSign, FileText, UserCheck, ArrowUpCircle, Clock } from 'lucide-react';

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getEventIcon(type: string | null) {
  switch (type) {
    case 'cross_sales': return <DollarSign className="size-4" />;
    case 'posts_period': return <FileText className="size-4" />;
    case 'is_onboarded': return <UserCheck className="size-4" />;
    default: return null;
  }
}

function getEventLabel(event: Reward['event']): string {
  switch (event.type) {
    case 'cross_sales': return `Cross $${event.salesAmount} in sales`;
    case 'posts_period': return `Posts ${event.postsCount} times every ${event.postsDuration}`;
    case 'is_onboarded': return 'Is Onboarded';
    default: return '';
  }
}

function getRewardIcon(type: string | null) {
  switch (type) {
    case 'flat_bonus': return <DollarSign className="size-4" />;
    case 'upgrade_tier': return <ArrowUpCircle className="size-4" />;
    default: return null;
  }
}

function getRewardLabel(reward: Reward['reward']): string {
  switch (reward.type) {
    case 'flat_bonus': return `Flat $${reward.bonusAmount} bonus`;
    case 'upgrade_tier': return `Upgrade to ${reward.tierName}`;
    default: return '';
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

function RewardCard({ reward }: { reward: Reward }) {
  const dispatch = useAppDispatch();

  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {getEventIcon(reward.event.type)}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">When</p>
              <p className="truncate text-sm font-medium text-foreground">{getEventLabel(reward.event)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
              {getRewardIcon(reward.reward.type)}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Then reward</p>
              <p className="truncate text-sm font-medium text-foreground">{getRewardLabel(reward.reward)}</p>
            </div>
          </div>

          {reward.isTimeBound && reward.endDate && (
            <div className="flex items-center gap-1.5 pl-0.5">
              <Clock className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Expires {formatDate(reward.endDate)}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => dispatch(deleteReward(reward.id))}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          aria-label="Delete reward"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function RewardsList() {
  const dispatch = useAppDispatch();
  const rewards = useAppSelector((s) => s.gamification.rewards);

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">Rewards</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {rewards.length === 0
              ? 'No rewards created yet. Create your first reward.'
              : `${rewards.length} reward${rewards.length !== 1 ? 's' : ''} configured`}
          </p>
        </div>
        <button
          onClick={() => dispatch(openModal())}
          className="flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="size-4" />
          Create Reward
        </button>
      </div>

      {rewards.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 sm:py-16">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
            <Plus className="size-6 text-muted-foreground" />
          </div>
          <p className="mb-1 text-sm font-medium text-foreground">No rewards yet</p>
          <p className="mb-5 text-xs text-muted-foreground">Create a reward to start gamifying your campaign</p>
          <button
            onClick={() => dispatch(openModal())}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Create Reward
          </button>
        </div>
      )}
    </div>
  );
}
