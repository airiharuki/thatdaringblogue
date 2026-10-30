import React, { useState, useEffect } from 'react';
import { Masthead, NavTab } from './components/Masthead';
import { AudioWaveform } from './components/AudioWaveform';
import { ProjectCard } from './components/ProjectCard';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReader } from './components/ArticleReader';
import { MiniPlayer } from './components/MiniPlayer';
import { SITE_DATA } from './data/siteContent';
import { ArticleItem } from './data/types';
import { AudioLines, ArrowUpRight } from 'lucide-react';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // Filters for tabs
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [articleFilter, setArticleFilter] = useState<string>('All');

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 810);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? 'rgb(20, 24, 39)' : 'rgb(242, 238, 230)';
  }, [isDark]);

  const syncUrl = (path: string) => {
    try {
      window.history.pushState(null, '', path);
    } catch {
      // In restricted environments or if pushState fails, fallback gracefully
    }
  };

  const handleNavigate = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'writing') {
      setSelectedArticle(null);
    }
    const pathMap: Record<NavTab, string> = {
      overview: '/',
      demo: '/demo',
      projects: '/project',
      writing: '/article',
      about: '/about',
    };
    syncUrl(pathMap[tab]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize route on initial load and handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const rawPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      const hash = window.location.hash.toLowerCase().replace('#', '');

      const current = hash || rawPath;

      if (current === '/' || current === '' || current === 'overview') {
        setActiveTab('overview');
        setSelectedArticle(null);
      } else if (current === '/demo' || current === 'demo') {
        setActiveTab('demo');
        setSelectedArticle(null);
      } else if (
        current === '/project' ||
        current === '/projects' ||
        current === 'project' ||
        current === 'projects'
      ) {
        setActiveTab('projects');
        setSelectedArticle(null);
      } else if (
        current === '/article' ||
        current === '/writing' ||
        current === 'article' ||
        current === 'writing'
      ) {
        setActiveTab('writing');
        setSelectedArticle(null);
      } else if (current.includes('/article/')) {
        const slug = current.split('/article/')[1];
        const found = SITE_DATA.articles.items.find((a) => a.slug === slug);
        setActiveTab('writing');
        if (found) {
          setSelectedArticle(found);
        }
      } else if (current === '/about' || current === 'about') {
        setActiveTab('about');
        setSelectedArticle(null);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const heroWaveformColors = isDark
    ? {
        waveColor: 'rgb(231, 185, 202)',
        progressColor: 'rgb(255, 255, 255)',
        buttonColor: 'rgb(238, 232, 233)',
        textColor: 'rgb(238, 232, 233)',
      }
    : {
        waveColor: 'rgb(73, 51, 79)',
        progressColor: 'rgb(154, 69, 111)',
        buttonColor: 'rgb(53, 41, 54)',
        textColor: 'rgb(53, 41, 54)',
      };

  const trackWaveformColors = isDark
    ? {
        waveColor: 'rgb(121, 103, 141)',
        progressColor: 'rgb(231, 185, 202)',
        buttonColor: 'rgb(238, 232, 233)',
        textColor: 'rgb(238, 232, 233)',
      }
    : {
        waveColor: '#e7b9ca',
        progressColor: 'rgb(154, 69, 111)',
        buttonColor: '#26252b',
        textColor: '#26252b',
      };

  const filteredProjects =
    projectFilter === 'All'
      ? SITE_DATA.projects.items
      : SITE_DATA.projects.items.filter((p) => p.category === projectFilter);

  const articleCategories = ['All', ...new Set(SITE_DATA.articles.items.map((a) => a.category))];

  const filteredArticles =
    articleFilter === 'All'
      ? SITE_DATA.articles.items
      : SITE_DATA.articles.items.filter((a) => a.category === articleFilter);

  return (
    <div className={`morrow-canvas ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <a className="morrow-skip-link" href="#morrow-main">
        Skip to content
      </a>

      {/* Masthead */}
      <Masthead
        brand={SITE_DATA.brand}
        activeTab={activeTab}
        onTabChange={handleNavigate}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      <main id="morrow-main" className="morrow-content-wrap">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW (HOME INDEX)                            */}
        {/* ======================================================== */}
        <section
          className={`morrow-tab-panel ${activeTab === 'overview' ? 'is-active' : ''}`}
          aria-hidden={activeTab !== 'overview'}
        >
          <div className="morrow-home">
            <div className="morrow-intro">
              <p className="morrow-eyebrow">{SITE_DATA.hero.eyebrow}</p>
              <h1 className="morrow-headline">{SITE_DATA.hero.headline}</h1>
              <p className="morrow-body morrow-intro-desc">{SITE_DATA.hero.description}</p>
              <div className="morrow-intro-actions">
                <button
                  type="button"
                  className="morrow-listen-btn"
                  onClick={() => handleNavigate('demo')}
                >
                  <AudioLines size={16} />
                  <span>Enter the Demo Room</span>
                  <ArrowUpRight size={15} />
                </button>
                <button
                  type="button"
                  className="morrow-text-action-btn"
                  onClick={() => handleNavigate('writing')}
                >
                  <span>Read the notes</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

            <div className="morrow-home-index">
              <div
                onClick={() => handleNavigate('demo')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' ? handleNavigate('demo') : null)}
              >
                <span className="morrow-eyebrow">01 / SOUND</span>
                <h2>The Demo Room</h2>
                <p>Unreleased sketches &amp; works in progress</p>
                <ArrowUpRight aria-hidden="true" />
              </div>

              <div
                onClick={() => handleNavigate('writing')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' ? handleNavigate('writing') : null)}
              >
                <span className="morrow-eyebrow">02 / WORDS</span>
                <h2>Writing &amp; notes</h2>
                <p>Audio, architecture &amp; creative code</p>
                <ArrowUpRight aria-hidden="true" />
              </div>

              <div
                onClick={() => handleNavigate('projects')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' ? handleNavigate('projects') : null)}
              >
                <span className="morrow-eyebrow">03 / SYSTEMS</span>
                <h2>Projects &amp; experiments</h2>
                <p>Open-source tools &amp; sonic explorations</p>
                <ArrowUpRight aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* TAB 2: DEMO ROOM                                         */}
        {/* ======================================================== */}
        <section
          className={`morrow-tab-panel ${activeTab === 'demo' ? 'is-active' : ''}`}
          aria-hidden={activeTab !== 'demo'}
        >
          <div className="morrow-tab-heading">
            <p className="morrow-eyebrow">{SITE_DATA.catalog.subheading}</p>
            <h1 className="morrow-headline">{SITE_DATA.catalog.heading}</h1>
            <p className="morrow-body">
              Unreleased audio experiments, sketches, and work-in-progress stems.
            </p>
          </div>

          {/* Featured Record Artwork */}
          <section className="morrow-featured-card" style={{ marginBottom: 48 }}>
            <div className="morrow-sleeve-credits">
              <p className="morrow-sleeve-title">{SITE_DATA.featuredRelease.labelTitle}</p>
              <p className="morrow-sleeve-cat">{SITE_DATA.featuredRelease.catalogNumber}</p>
            </div>

            <div className="morrow-featured-waveform">
              <AudioWaveform
                audioUrl={SITE_DATA.featuredRelease.audioUrl}
                title={SITE_DATA.featuredRelease.title}
                trackHeight={220}
                barWidth={isMobile ? 3 : 4}
                barGap={isMobile ? 3 : 4}
                waveColor={heroWaveformColors.waveColor}
                progressColor={heroWaveformColors.progressColor}
                buttonColor={heroWaveformColors.buttonColor}
                textColor={heroWaveformColors.textColor}
                style={{ height: '100%', width: '100%' }}
              />
            </div>

            <div className="morrow-release-caption">
              <div>
                <p className="morrow-release-title">{SITE_DATA.featuredRelease.title}</p>
                <p className="morrow-release-subtitle">{SITE_DATA.featuredRelease.subtitle}</p>
              </div>
              <p className="morrow-release-desc">{SITE_DATA.featuredRelease.description}</p>
            </div>
          </section>

          {/* Track List */}
          <div className="morrow-track-list">
            {SITE_DATA.catalog.tracks.map((track) => (
              <div key={track.id} className="morrow-track-item">
                <div className="morrow-track-details">
                  <p className="morrow-track-item-title">{track.title}</p>
                  <p className="morrow-eyebrow">{track.details}</p>
                  <div className="morrow-track-badges">
                    {track.bpm && <span className="morrow-tag-pill">{track.bpm} BPM</span>}
                    {track.key && <span className="morrow-tag-pill">{track.key}</span>}
                  </div>
                  {track.notes && (
                    <div className="morrow-demo-note">
                      <p className="morrow-eyebrow">NOTES</p>
                      <p className="morrow-body-secondary" style={{ fontSize: 13, marginTop: 4 }}>
                        {track.notes}
                      </p>
                    </div>
                  )}
                  {track.stems && track.stems.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {track.stems.map((s) => (
                        <span
                          key={s}
                          className="morrow-eyebrow"
                          style={{ fontSize: 11, color: 'var(--muted)' }}
                        >
                          • {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="morrow-track-waveform-wrap">
                  <AudioWaveform
                    audioUrl={track.audioUrl}
                    title={track.title}
                    trackHeight={90}
                    barWidth={3}
                    barGap={2}
                    waveColor={trackWaveformColors.waveColor}
                    progressColor={trackWaveformColors.progressColor}
                    buttonColor={trackWaveformColors.buttonColor}
                    textColor={trackWaveformColors.textColor}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* TAB 3: PROJECTS                                          */}
        {/* ======================================================== */}
        <section
          className={`morrow-tab-panel ${activeTab === 'projects' ? 'is-active' : ''}`}
          aria-hidden={activeTab !== 'projects'}
        >
          <div className="morrow-tab-heading">
            <p className="morrow-eyebrow">{SITE_DATA.projects.subheading}</p>
            <h1 className="morrow-headline">{SITE_DATA.projects.heading}</h1>
            <p className="morrow-body">
              Production tools, real-time WebAssembly DSP algorithms, and open architectures engineered for low latency and high craft.
            </p>
          </div>

          <div className="morrow-filter-bar">
            {['All', 'Audio Tech', 'Creative Coding', 'Web Systems', 'Open Source Tools'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`morrow-filter-pill ${projectFilter === cat ? 'is-active' : ''}`}
                  onClick={() => setProjectFilter(cat)}
                  aria-pressed={projectFilter === cat}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="morrow-projects-grid">
            {filteredProjects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>

          <div
            className="morrow-github-cta"
            style={{ marginTop: 40, padding: '24px 0', borderTop: '1px solid var(--border)' }}
          >
            <p className="morrow-eyebrow">OPEN SOURCE CODEBASE</p>
            <p className="morrow-body" style={{ marginTop: 6 }}>
              All projects, source code, and configurations are hosted publicly on GitHub.
            </p>
            <a
              href="https://github.com/airiharuki?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="morrow-theme-btn"
              style={{ marginTop: 14, display: 'inline-flex', textDecoration: 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>View all repositories on GitHub (airiharuki) ↗</span>
            </a>
          </div>
        </section>

        {/* ======================================================== */}
        {/* TAB 4: WRITING / ARTICLES                                */}
        {/* ======================================================== */}
        <section
          className={`morrow-tab-panel ${activeTab === 'writing' ? 'is-active' : ''}`}
          aria-hidden={activeTab !== 'writing'}
        >
          {selectedArticle ? (
            <ArticleReader
              article={selectedArticle}
              onBack={() => {
                setSelectedArticle(null);
                syncUrl('/article');
              }}
            />
          ) : (
            <>
              <div className="morrow-tab-heading">
                <p className="morrow-eyebrow">ARTICLES / IDEAS / FIELD NOTES</p>
                <h1 className="morrow-headline">Writing &amp; notes</h1>
                <p className="morrow-body">
                  Thoughts on sound, creative code, and the systems in between.
                </p>
              </div>

              <div className="morrow-filter-bar">
                {articleCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`morrow-filter-pill ${articleFilter === cat ? 'is-active' : ''}`}
                    onClick={() => setArticleFilter(cat)}
                    aria-pressed={articleFilter === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="morrow-articles-list">
                {filteredArticles.map((art) => (
                  <ArticleCard
                    key={art.id}
                    article={art}
                    onSelect={(article) => {
                      setSelectedArticle(article);
                      syncUrl(`/article/${article.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ======================================================== */}
        {/* TAB 5: ABOUT & GEAR                                      */}
        {/* ======================================================== */}
        <section
          className={`morrow-tab-panel ${activeTab === 'about' ? 'is-active' : ''}`}
          aria-hidden={activeTab !== 'about'}
        >
          <div className="morrow-tab-heading">
            <p className="morrow-eyebrow">{SITE_DATA.about.eyebrow}</p>
            <h1 className="morrow-headline">{SITE_DATA.about.heading}</h1>
          </div>

          <div className="morrow-about-prose">
            {SITE_DATA.about.body.map((p, idx) => (
              <p key={idx} className="morrow-body">
                {p}
              </p>
            ))}
            <p className="morrow-eyebrow" style={{ marginTop: 24 }}>
              {SITE_DATA.about.tags}
            </p>
          </div>

          <div className="morrow-gear-section">
            <h2 className="morrow-section-h2" style={{ marginBottom: 24 }}>
              Studio &amp; Engineering Stack
            </h2>
            <div className="morrow-gear-grid">
              {SITE_DATA.about.gear.map((group) => (
                <div key={group.category} className="morrow-gear-group">
                  <h3 className="morrow-gear-cat-title">{group.category}</h3>
                  <ul className="morrow-gear-list">
                    {group.items.map((item) => (
                      <li key={item.name} className="morrow-gear-item">
                        <span className="morrow-gear-name">{item.name}</span>
                        <span className="morrow-gear-role">{item.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Docked Mini-Player */}
      <MiniPlayer onGoToMusic={() => handleNavigate('demo')} />

      {/* Footer */}
      <footer className="morrow-footer">
        <div className="morrow-footer-top">
          <p className="morrow-eyebrow morrow-footer-copy">
            © 2026 THAT DARING BLOGUE / MORROW
          </p>
          <div className="morrow-footer-links">
            <a
              href="https://github.com/airiharuki"
              target="_blank"
              rel="noopener noreferrer"
              className="morrow-footer-link"
            >
              GitHub
            </a>
            <a
              href="https://soundcloud.com"
              target="_blank"
              rel="noopener noreferrer"
              className="morrow-footer-link"
            >
              SoundCloud
            </a>
            <a
              href="https://spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="morrow-footer-link"
            >
              Spotify
            </a>
            <a
              href="https://thatdaringblogue.me"
              target="_blank"
              rel="noopener noreferrer"
              className="morrow-footer-link"
            >
              Domain
            </a>
          </div>
        </div>
        <p className="morrow-eyebrow">
          Made for listening and deep thinking, not scrolling.
        </p>
      </footer>
    </div>
  );
};

export default App;
