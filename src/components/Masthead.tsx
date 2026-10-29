import React from 'react';

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
  const tabs: { key: NavTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'music', label: 'Music & Demos' },
    { key: 'projects', label: 'Projects' },
    { key: 'writing', label: 'Writing' },
    { key: 'about', label: 'About & Gear' },
  ];

  return (
    <header className="morrow-masthead">
      <div className="morrow-masthead-brand-wrap" onClick={() => onTabChange('overview')} role="button" tabIndex={0}>
        <span className="morrow-brand">{brand}</span>
        <span className="morrow-brand-badge">2026</span>
      </div>

      <nav className="morrow-masthead-nav" aria-label="Main navigation">
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
              {tab.label}
              {isActive && <span className="morrow-nav-tab-indicator" />}
            </button>
          );
        })}
      </nav>

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
    </header>
  );
};
