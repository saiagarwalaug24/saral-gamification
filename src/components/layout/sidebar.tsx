'use client';

import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleSidebarCollapsed, setSidebarMobileOpen } from '@/lib/store/uiSlice';
import {
  Home,
  BarChart3,
  Megaphone,
  LayoutGrid,
  CreditCard,
  ChevronLeft,
  Settings,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: <Home className="size-5" />, href: '#' },
  { label: 'Insights', icon: <BarChart3 className="size-5" />, href: '#' },
  { label: 'Campaigns', icon: <Megaphone className="size-5" />, href: '#', active: true },
  { label: 'Applications', icon: <LayoutGrid className="size-5" />, href: '#' },
  { label: 'Payments', icon: <CreditCard className="size-5" />, href: '#' },
];

export function Sidebar() {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const mobileOpen = useAppSelector((s) => s.ui.sidebarMobileOpen);

  const closeMobile = () => dispatch(setSidebarMobileOpen(false));
  const showLabel = !collapsed || mobileOpen;

  return (
    <>
      <button
        onClick={() => dispatch(setSidebarMobileOpen(true))}
        className="fixed left-3 top-3 z-50 flex size-9 items-center justify-center rounded-lg bg-card text-foreground shadow-md lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-200',
          'hidden lg:flex',
          collapsed ? 'lg:w-[68px]' : 'lg:w-[220px]',
          mobileOpen && '!fixed inset-y-0 left-0 z-50 !flex w-[260px] shadow-xl'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          {showLabel && (
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-xs font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-display text-sm font-bold tracking-wide text-foreground">SARAL</span>
            </div>
          )}
          {collapsed && !mobileOpen && (
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
              <span className="font-display text-xs font-bold text-primary-foreground">S</span>
            </div>
          )}

          <button
            onClick={() => (mobileOpen ? closeMobile() : dispatch(toggleSidebarCollapsed()))}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={mobileOpen ? 'Close menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {mobileOpen ? (
              <X className="size-4" />
            ) : (
              <ChevronLeft className={cn('size-4 transition-transform', collapsed && 'rotate-180')} />
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-4" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={closeMobile}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                item.active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {item.icon}
              {showLabel && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="border-t border-border px-3 py-3">
          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Settings className="size-5" />
            {showLabel && <span>Settings</span>}
          </a>
        </div>
      </aside>
    </>
  );
}
