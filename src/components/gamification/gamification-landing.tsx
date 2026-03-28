'use client';

import { useAppDispatch } from '@/lib/store/hooks';
import { enableGamification } from '@/lib/store/gamificationSlice';
import Image from 'next/image';

const FEATURES = [
  {
    icon: '/icon-trophy.png',
    title: 'Reward Your Ambassadors',
    description: 'Boost campaign performance by setting up rewards for ambassadors',
  },
  {
    icon: '/icon-crown.png',
    title: 'Set Milestones',
    description: 'Set up custom goals for sales, posts, or time-based achievements',
  },
  {
    icon: '/icon-percent.png',
    title: 'Customise Incentives',
    description: 'Create custom incentives like flat fees, free products, or special commissions.',
  },
] as const;

/**
 * Inline SVG grid with randomly filled pink cells.
 * Creates the large straight-line grid pattern with some cells
 * tinted a subtle pink, matching the Figma reference.
 */
const GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='480' viewBox='0 0 480 480'%3E%3Cdefs%3E%3Cpattern id='g' patternUnits='userSpaceOnUse' width='80' height='80'%3E%3Crect width='80' height='80' fill='none' stroke='%23e4e4e7' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='480' height='480' fill='url(%23g)'/%3E%3Crect x='0' y='0' width='80' height='80' fill='%23fce7f3' opacity='0.5'/%3E%3Crect x='160' y='0' width='80' height='80' fill='%23fce7f3' opacity='0.35'/%3E%3Crect x='320' y='80' width='80' height='80' fill='%23fce7f3' opacity='0.4'/%3E%3Crect x='80' y='160' width='80' height='80' fill='%23fce7f3' opacity='0.45'/%3E%3Crect x='240' y='160' width='80' height='80' fill='%23fce7f3' opacity='0.3'/%3E%3Crect x='400' y='160' width='80' height='80' fill='%23fce7f3' opacity='0.35'/%3E%3Crect x='0' y='240' width='80' height='80' fill='%23fce7f3' opacity='0.3'/%3E%3Crect x='160' y='320' width='80' height='80' fill='%23fce7f3' opacity='0.25'/%3E%3Crect x='320' y='320' width='80' height='80' fill='%23fce7f3' opacity='0.3'/%3E%3Crect x='80' y='400' width='80' height='80' fill='%23fce7f3' opacity='0.2'/%3E%3Crect x='400' y='400' width='80' height='80' fill='%23fce7f3' opacity='0.25'/%3E%3C/svg%3E")`;

export function GamificationLanding() {
  const dispatch = useAppDispatch();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-8 sm:py-16">
      {/* Straight-line grid with random pink cells + gradient fade */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: GRID_SVG,
          backgroundSize: '480px 480px',
          maskImage:
            'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.15) 65%, transparent 90%)',
          WebkitMaskImage:
            'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.15) 65%, transparent 90%)',
        }}
      />

      {/* Decorative gradient blobs */}
      <div
        className="pointer-events-none absolute -left-24 top-12 size-64 rounded-full opacity-20 sm:size-80"
        style={{
          background:
            'radial-gradient(circle, oklch(0.78 0.22 325) 0%, oklch(0.85 0.15 325 / 0.3) 40%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -right-20 top-4 size-56 rounded-full opacity-15 sm:size-72"
        style={{
          background:
            'radial-gradient(circle, oklch(0.78 0.22 325) 0%, oklch(0.85 0.15 325 / 0.25) 40%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mb-6 text-center">
        <h2
          className="font-display text-2xl font-bold tracking-tight sm:text-[28px]"
          style={{ color: 'oklch(0.40 0.18 325)' }}
        >
          Gamify your Campaign
        </h2>
        <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Enable gamification to start crafting your custom reward system.
        </p>
      </div>

      <button
        onClick={() => dispatch(enableGamification())}
        className="relative z-10 mb-10 rounded-full px-10 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98] sm:mb-14"
        style={{
          background: 'linear-gradient(135deg, oklch(0.68 0.25 325), oklch(0.58 0.22 310))',
        }}
      >
        Enable Gamification
      </button>

      {/* Feature cards */}
      <div className="relative z-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center rounded-2xl border border-border bg-card/80 p-5 text-center shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md sm:p-6"
          >
            <div
              className="mb-4 flex size-14 items-center justify-center overflow-hidden rounded-xl border-2"
              style={{
                backgroundColor: 'oklch(0.95 0.05 325)',
                borderColor: 'oklch(0.82 0.12 325)',
              }}
            >
              <Image
                src={feature.icon}
                alt=""
                width={32}
                height={32}
                className="size-8 object-contain"
              />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">{feature.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
