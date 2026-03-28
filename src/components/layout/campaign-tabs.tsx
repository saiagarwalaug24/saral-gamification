'use client';

import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setActiveTab } from '@/lib/store/uiSlice';

const TABS = ['General', 'Preferences', 'Gamification'] as const;

export function CampaignTabs() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((s) => s.ui.activeTab);

  return (
    <div className="flex gap-0 border-b border-border">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => dispatch(setActiveTab(tab))}
          className={cn(
            'relative px-5 py-3 text-sm font-medium transition-colors',
            activeTab === tab
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab}
          {activeTab === tab && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
