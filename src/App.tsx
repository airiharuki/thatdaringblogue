import React, { useState, useEffect } from 'react';
import { AudioWaveform } from './components/AudioWaveform';
import { SITE_CONTENT } from './data/tracks';

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <main className={`morrow-canvas ${isDark ? 'theme-dark' : 'theme-light'}`}>
      {/* Masthead */}
      <header className="morrow-masthead">
        <p className="morrow-brand">{SITE_CONTENT.brand}</p>
        <a href="#music" className="morrow-nav-link">
          Music
        </a>
        <a href="#about" className="morrow-nav-link">
          About
        </a>
        <button
          type="button"
          aria-label="Switch light and dark appearance"
          className="morrow-theme-btn"
          onClick={() => setIsDark((prev) => !prev)}
        >
          Light / Dark
        </button>
      </header>

      {/* Artist Introduction */}
      <section className="morrow-intro">
        <p className="morrow-eyebrow">{SITE_CONTENT.hero.eyebrow}</p>
        <h1 className="morrow-headline">{SITE_CONTENT.hero.headline}</h1>
        <p className="morrow-body morrow-intro-desc">{SITE_CONTENT.hero.description}</p>
      </section>

      {/* Featured Record Artwork */}
      <section className="morrow-featured-card">
        <div className="morrow-sleeve-credits">
          <p className="morrow-sleeve-title">{SITE_CONTENT.featuredRelease.labelTitle}</p>
          <p className="morrow-sleeve-cat">{SITE_CONTENT.featuredRelease.catalogNumber}</p>
        </div>

        <div className="morrow-featured-waveform">
          <AudioWaveform
            audioUrl={SITE_CONTENT.featuredRelease.audioUrl}
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
          <p className="morrow-release-title">{SITE_CONTENT.featuredRelease.title}</p>
          <p className="morrow-release-subtitle">{SITE_CONTENT.featuredRelease.subtitle}</p>
        </div>
      </section>

      {/* Music Store / Demo Room */}
      <section id="music" className="morrow-store">
        <div className="morrow-catalog-header">
          <h2 className="morrow-section-h2">{SITE_CONTENT.catalog.heading}</h2>
          <p className="morrow-eyebrow">{SITE_CONTENT.catalog.subheading}</p>
        </div>

        <div className="morrow-track-list">
          {SITE_CONTENT.catalog.tracks.map((track) => (
            <div key={track.id} className="morrow-track-item">
              <div className="morrow-track-details">
                <p className="morrow-body">{track.title}</p>
                <p className="morrow-eyebrow">{track.details}</p>
              </div>
              <div className="morrow-track-waveform">
                <AudioWaveform
                  audioUrl={track.audioUrl}
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

      {/* Artist Note / About */}
      <section id="about" className="morrow-about">
        <p className="morrow-eyebrow morrow-about-eyebrow">{SITE_CONTENT.about.eyebrow}</p>
        <div className="morrow-about-content">
          <h2 className="morrow-section-h2">{SITE_CONTENT.about.heading}</h2>
          <p className="morrow-body">{SITE_CONTENT.about.body}</p>
          <p className="morrow-eyebrow">{SITE_CONTENT.about.tags}</p>
        </div>
      </section>

      {/* Closing Credits */}
      <footer className="morrow-footer">
        <p className="morrow-eyebrow morrow-footer-copy">{SITE_CONTENT.footer.copyright}</p>
        <p className="morrow-eyebrow">{SITE_CONTENT.footer.tagline}</p>
      </footer>
    </main>
  );
};

export default App;
