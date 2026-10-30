import React, { useRef, useEffect } from 'react';
import {
  Home,
  AudioLines,
  Code2,
  NotebookPen,
  UserRound,
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react';

export type NavTab = 'overview' | 'demo' | 'projects' | 'writing' | 'about';

interface MastheadProps {
  brand: string;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Masthead: React.FC<MastheadProps> = ({
  brand,
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
}) => {
  const navRef = useRef<HTMLElement | null>(null);

  const tabs: {
    key: NavTab;
    label: string;
    mobileLabel: string;
    icon: LucideIcon;
  }[] = [
    { key: 'overview', label: 'Overview', mobileLabel: 'Home', icon: Home },
    { key: 'demo', label: 'Demo Room', mobileLabel: 'Demos', icon: AudioLines },
    { key: 'projects', label: 'Projects', mobileLabel: 'Projects', icon: Code2 },
    { key: 'writing', label: 'Writing', mobileLabel: 'Notes', icon: NotebookPen },
    { key: 'about', label: 'About & Gear', mobileLabel: 'About', icon: UserRound },
  ];

  // Auto-scroll active tab into view smoothly on mobile / narrow screens
  useEffect(() => {
    if (navRef.current) {
      const activeBtn = navRef.current.querySelector<HTMLButtonElement>(
        '.morrow-nav-tab.is-active'
      );
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [activeTab]);

  return (
    <header className="morrow-masthead">
      <div className="morrow-masthead-top">
        <div
          className="morrow-masthead-brand-wrap"
          onClick={() => onTabChange('overview')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onTabChange('overview');
            }
          }}
          aria-label="Go to Overview"
        >
          <span className="morrow-brand-mark" aria-hidden="true">
            m<sup>®</sup>
          </span>
          <span className="morrow-brand">{brand}</span>
          <span className="morrow-brand-badge">2026</span>
        </div>

        <div className="morrow-masthead-actions">
          <button
            type="button"
            aria-label="Toggle light and dark mode appearance"
            className="morrow-theme-btn"
            onClick={onToggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="morrow-theme-icon" aria-hidden="true">
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </span>
            <span className="morrow-theme-label">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      <div className="morrow-nav-container">
        <nav className="morrow-masthead-nav" aria-label="Main navigation" ref={navRef}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                className={`morrow-nav-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => onTabChange(tab.key)}
                aria-current={isActive ? 'page' : undefined}
              >
                <IconComponent className="morrow-nav-icon" size={15} />
                <span className="morrow-nav-tab-label">{tab.label}</span>
                <span className="morrow-nav-mobile-label">{tab.mobileLabel}</span>
                {isActive && <span className="morrow-nav-tab-indicator" />}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
