import type { CSSProperties } from 'react';
import { useThemeStore } from '../store/themeStore';

export function useChartTheme() {
  const dark = useThemeStore((s) => s.dark);

  return {
    dark,
    grid: dark ? '#1E1E26' : '#E5E3DD',
    tick: dark ? '#4A4A62' : '#9494AC',
    tooltip: {
      backgroundColor: dark ? '#141418' : '#FFFFFF',
      borderRadius: 14,
      border: `1px solid ${dark ? '#1E1E26' : '#E5E3DD'}`,
      fontSize: 13,
      fontFamily: 'Manrope, sans-serif',
      boxShadow: dark
        ? '0 12px 40px rgba(0,0,0,0.4)'
        : '0 12px 40px rgba(0,0,0,0.08)',
      color: dark ? '#EAEAEF' : '#17171C',
      padding: '10px 14px',
    } as CSSProperties,
    pieStroke: dark ? '#09090C' : '#F5F4F0',
    colors: {
      emerald: '#10b981',
      indigo: '#6366F1',
      amber: '#F59E0B',
      rose: '#F43F5E',
      sky: '#0EA5E9',
      violet: '#8B5CF6',
      slate: dark ? '#2E2E3A' : '#CCC9C1',
    },
  };
}
