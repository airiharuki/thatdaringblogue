import React, { useRef, useEffect } from 'react';

export type NavTab = 'overview' | 'music' | 'projects' | 'writing' | 'about';

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

  const tabs: { key: NavTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'music', label: 'Music & Demos' },
    { key: 'projects', label: 'Projects' },
    { key: 'writing', label: 'Writing' },
    { key: 'about', label: 'About & Gear' },
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
          <span className="morrow-brand">{brand}</span>
          <span className="morrow-brand-badge">2026</span>
        </div>

        <div className="morrow-masthead-actions">
          <button
            type="button"
            aria-label="Toggle light and dark mode appearance"
            className="morrow-theme-btn"
            onClick={onToggleTheme}
          >
            <span className="morrow-theme-icon" aria-hidden="true">
              {isDark ? '☼' : '☾'}
            </span>
            <span className="morrow-theme-label">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      <div className="morrow-nav-container">
        <nav className="morrow-masthead-nav" aria-label="Main navigation" ref={navRef}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`morrow-nav-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => onTabChange(tab.key)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="morrow-nav-tab-label">{tab.label}</span>
                {isActive && <span className="morrow-nav-tab-indicator" />}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
