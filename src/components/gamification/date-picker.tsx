'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setEndDate } from '@/lib/store/gamificationSlice';
import {
  setDatePickerOpen,
  datePickerGoNext,
  datePickerGoPrev,
} from '@/lib/store/uiSlice';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useMemo, useRef, useEffect } from 'react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function getTomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

interface CalendarCell {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

function buildCalendarGrid(viewYear: number, viewMonth: number): CalendarCell[] {
  const cells: CalendarCell[] = [];

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
  const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth, year: viewYear, isCurrentMonth: true });
  }

  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, month: nextMonth, year: nextYear, isCurrentMonth: false });
  }

  return cells;
}

export function DatePicker() {
  const dispatch = useAppDispatch();
  const { endDate, isTimeBound } = useAppSelector((s) => s.gamification.modal);
  const { isOpen, viewMonth, viewYear } = useAppSelector((s) => s.ui.datePicker);
  const tomorrow = useMemo(() => getTomorrow(), []);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        dispatch(setDatePickerOpen(false));
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [isOpen, dispatch]);

  if (!isTimeBound) return null;

  const cells = buildCalendarGrid(viewYear, viewMonth);

  const canGoPrev =
    viewYear > tomorrow.getFullYear() ||
    (viewYear === tomorrow.getFullYear() && viewMonth > tomorrow.getMonth());

  const handleSelect = (cell: CalendarCell) => {
    const selected = new Date(cell.year, cell.month, cell.day);
    if (selected < tomorrow) return;
    dispatch(setEndDate(selected.toISOString()));
    dispatch(setDatePickerOpen(false));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => dispatch(setDatePickerOpen(!isOpen))}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors',
          endDate
            ? 'border-border bg-background text-foreground'
            : 'border-border bg-background text-muted-foreground hover:border-primary/30'
        )}
      >
        <Calendar className="size-4 text-muted-foreground" />
        {endDate ? formatDate(endDate) : 'Select End Date'}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-1 w-[280px] rounded-lg border border-border bg-popover p-3 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => canGoPrev && dispatch(datePickerGoPrev())}
              disabled={!canGoPrev}
              className={cn(
                'flex size-7 items-center justify-center rounded-md transition-colors',
                canGoPrev
                  ? 'text-foreground hover:bg-accent'
                  : 'cursor-not-allowed text-muted-foreground/30'
              )}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-semibold text-foreground">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={() => dispatch(datePickerGoNext())}
              className="flex size-7 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-0">
            {DAYS.map((d) => (
              <div key={d} className="py-1 text-center text-xs font-medium text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0">
            {cells.map((cell, i) => {
              const cellDate = new Date(cell.year, cell.month, cell.day);
              const isDisabled = cellDate < tomorrow;
              const isSelected = endDate ? isSameDay(cellDate, new Date(endDate)) : false;
              const isToday = isSameDay(cellDate, new Date());

              return (
                <button
                  key={`cell-${i}`}
                  type="button"
                  onClick={() => !isDisabled && cell.isCurrentMonth && handleSelect(cell)}
                  disabled={isDisabled || !cell.isCurrentMonth}
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full text-sm transition-colors',
                    !cell.isCurrentMonth && 'cursor-default text-muted-foreground/30',
                    cell.isCurrentMonth && isDisabled && 'cursor-not-allowed text-muted-foreground/30',
                    cell.isCurrentMonth && !isDisabled && !isSelected && 'text-foreground hover:bg-accent',
                    isSelected && 'bg-primary font-semibold text-primary-foreground',
                    isToday && !isSelected && cell.isCurrentMonth && !isDisabled && 'font-semibold text-primary'
                  )}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
