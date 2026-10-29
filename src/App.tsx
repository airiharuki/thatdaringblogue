import React, { useState, useEffect } from 'react';
import { Masthead, NavTab } from './components/Masthead';
import { AudioWaveform } from './components/AudioWaveform';
import { ProjectCard } from './components/ProjectCard';
import { ArticleCard } from './components/ArticleCard';
import { ArticleModal } from './components/ArticleModal';
import { MiniPlayer } from './components/MiniPlayer';
import { SITE_DATA } from './data/siteContent';
import { ArticleItem } from './data/types';

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

  const filteredArticles =
    articleFilter === 'All'
      ? SITE_DATA.articles.items
      : SITE_DATA.articles.items.filter((a) => a.category === articleFilter);

  return (
    <div className={`morrow-canvas ${isDark ? 'theme-dark' : 'theme-light'}`}>
      {/* Masthead */}
      <Masthead
        brand={SITE_DATA.brand}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      <main className="morrow-content-wrap">
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW                                          */}
        {/* ======================================================== */}
        <section
          className={`morrow-tab-panel ${activeTab === 'overview' ? 'is-active' : ''}`}
          aria-hidden={activeTab !== 'overview'}
        >
          {/* Artist & Engineer Intro */}
          <section className="morrow-intro">
            <p className="morrow-eyebrow">{SITE_DATA.hero.eyebrow}</p>
            <h1 className="morrow-headline">{SITE_DATA.hero.headline}</h1>
            <p className="morrow-body morrow-intro-desc">{SITE_DATA.hero.description}</p>
            <p className="morrow-body-secondary">{SITE_DATA.hero.secondary}</p>
          </section>

          {/* Featured Record Artwork */}
          <section className="morrow-featured-card">
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

          {/* Overview: Featured Projects Snippet */}
          <section className="morrow-section-block">
            <div className="morrow-section-header-row">
              <div>
                <h2 className="morrow-section-h2">Featured Projects & Tools</h2>
                <p className="morrow-eyebrow">ENGINEERED FOR WEBAUDIO & REALTIME DSP</p>
              </div>
              <button
                type="button"
                className="morrow-text-action-btn"
                onClick={() => setActiveTab('projects')}
              >
                View all projects →
              </button>
            </div>
            <div className="morrow-projects-grid">
              {SITE_DATA.projects.items.slice(0, 2).map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </section>

          {/* Overview: Recent Writing Snippet */}
          <section className="morrow-section-block">
            <div className="morrow-section-header-row">
              <div>
                <h2 className="morrow-section-h2">Technical Writing</h2>
                <p className="morrow-eyebrow">DSP NOTES, AUDIO ENGINEERING & ARCHITECTURE</p>
              </div>
              <button
                type="button"
                className="morrow-text-action-btn"
                onClick={() => setActiveTab('writing')}
              >
                Read all articles →
              </button>
            </div>
            <div className="morrow-articles-list">
              {SITE_DATA.articles.items.slice(0, 2).map((art) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  onSelect={(article) => setSelectedArticle(article)}
                />
              ))}
            </div>
          </section>
        </section>

        {/* ======================================================== */}
        {/* TAB 2: MUSIC & DEMOS                                     */}
        {/* ======================================================== */}
        <section
          className={`morrow-tab-panel ${activeTab === 'music' ? 'is-active' : ''}`}
          aria-hidden={activeTab !== 'music'}
        >
          <div className="morrow-tab-heading">
            <p className="morrow-eyebrow">{SITE_DATA.catalog.subheading}</p>
            <h1 className="morrow-headline">{SITE_DATA.catalog.heading}</h1>
            <p className="morrow-body">
              Unreleased audio experiments, sketches, and work-in-progress stems. Rendered with our
              real-time Web Audio API waveform engine with instant sub-pixel seeking.
            </p>
          </div>

          {/* Featured Record in Music View */}
          <div className="morrow-featured-card" style={{ marginBottom: 48 }}>
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
          </div>

          {/* Track Catalog */}
          <div className="morrow-track-list">
            {SITE_DATA.catalog.tracks.map((track) => (
              <div key={track.id} className="morrow-track-item">
                <div className="morrow-track-details">
                  <p className="morrow-track-item-title">{track.title}</p>
                  <p className="morrow-eyebrow">{track.details}</p>
                  {track.bpm && track.key && (
                    <div className="morrow-track-badges">
                      <span className="morrow-tag-pill">{track.bpm} BPM</span>
                      <span className="morrow-tag-pill">{track.key}</span>
                    </div>
                  )}
                  {track.notes && <p className="morrow-track-notes">{track.notes}</p>}
                </div>
                <div className="morrow-track-waveform">
                  <AudioWaveform
                    audioUrl={track.audioUrl}
                    title={track.title}
                    trackHeight={110}
                    barWidth={3}
                    barGap={3}
                    waveColor={trackWaveformColors.waveColor}
                    progressColor={trackWaveformColors.progressColor}
                    buttonColor={trackWaveformColors.buttonColor}
                    textColor={trackWaveformColors.textColor}
                    style={{ height: '100%', width: '100%' }}
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
              Production tools, real-time WebAssembly DSP algorithms, and open architectures
              engineered for low latency and high craft.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="morrow-filter-bar">
            {['All', 'Audio Tech', 'Creative Coding', 'Web Systems', 'Open Source Tools'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`morrow-filter-pill ${projectFilter === cat ? 'is-active' : ''}`}
                  onClick={() => setProjectFilter(cat)}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="morrow-projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="morrow-github-cta" style={{ marginTop: 40, padding: '24px 0', borderTop: '1px solid var(--border)' }}>
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
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>View all repositories on GitHub (airiharuki) ↗</span>
            </a>
          </div>
        </section>

        {/* ======================================================== */}
        {/* TAB 4: WRITING (TECHNICAL BLOG)                          */}
        {/* ======================================================== */}
        <section
          className={`morrow-tab-panel ${activeTab === 'writing' ? 'is-active' : ''}`}
          aria-hidden={activeTab !== 'writing'}
        >
          <div className="morrow-tab-heading">
            <p className="morrow-eyebrow">{SITE_DATA.articles.subheading}</p>
            <h1 className="morrow-headline">{SITE_DATA.articles.heading}</h1>
            <p className="morrow-body">
              In-depth engineering articles on the Web Audio API, digital signal processing,
              aliasing mitigation, and modern web systems. Click any post to open the reader
              overlay.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="morrow-filter-bar">
            {['All', 'Audio DSP & Web Audio', 'Architecture & Systems'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`morrow-filter-pill ${articleFilter === cat ? 'is-active' : ''}`}
                onClick={() => setArticleFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="morrow-articles-list">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelect={(art) => setSelectedArticle(art)}
              />
            ))}
          </div>
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

          {/* Gear & Tooling Setup */}
          <div className="morrow-gear-section">
            <h2 className="morrow-section-h2" style={{ marginBottom: 24 }}>
              Studio & Engineering Stack
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

      {/* Closing Credits */}
      <footer className="morrow-footer">
        <div className="morrow-footer-top">
          <p className="morrow-eyebrow morrow-footer-copy">{SITE_DATA.footer.copyright}</p>
          <div className="morrow-footer-links">
            {SITE_DATA.footer.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="morrow-footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <p className="morrow-eyebrow">{SITE_DATA.footer.tagline}</p>
      </footer>

      {/* Persistent Mini Player at bottom */}
      <MiniPlayer onGoToMusic={() => setActiveTab('music')} />

      {/* Reader Modal Overlay */}
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
};

export default App;
