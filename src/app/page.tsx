'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { CampaignTabs } from '@/components/layout/campaign-tabs';
import { GamificationLanding } from '@/components/gamification/gamification-landing';
import { RewardsList } from '@/components/gamification/rewards-list';
import { CreateRewardModal } from '@/components/gamification/create-reward-modal';
import { useAppSelector } from '@/lib/store/hooks';
import { Bell, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const activeTab = useAppSelector((s) => s.ui.activeTab);
  const gamificationEnabled = useAppSelector((s) => s.gamification.enabled);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 pl-14 sm:px-6 lg:pl-6">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm" aria-label="Breadcrumb">
            <span className="hidden text-muted-foreground sm:inline">Campaigns</span>
            <ChevronRight className="hidden size-3.5 text-muted-foreground/60 sm:inline" aria-hidden="true" />
            <span className="hidden text-muted-foreground sm:inline">Campaign Name</span>
            <ChevronRight className="hidden size-3.5 text-muted-foreground/60 sm:inline" aria-hidden="true" />
            <span className="font-medium text-foreground">Campaign Settings</span>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                5
              </span>
            </button>
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-200 to-amber-400">
              <span className="text-xs font-bold text-amber-800">JD</span>
            </div>
          </div>
        </header>

        <CampaignTabs />

        <div className="flex flex-1 flex-col overflow-auto">
          {activeTab === 'Gamification' ? (
            gamificationEnabled ? (
              <RewardsList />
            ) : (
              <GamificationLanding />
            )
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{activeTab}</p>
                <p className="mt-1 text-xs text-muted-foreground">This section is under development</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateRewardModal />
    </div>
  );
}
