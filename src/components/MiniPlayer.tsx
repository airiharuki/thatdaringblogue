import React, { useState, useEffect } from 'react';

interface NowPlayingState {
  title: string;
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

interface MiniPlayerProps {
  onGoToMusic: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onGoToMusic }) => {
  const [playback, setPlayback] = useState<NowPlayingState | null>(null);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail as NowPlayingState;
      if (detail && detail.audioUrl) {
        setPlayback(detail);
      }
    };

    window.addEventListener('morrow:nowplaying', handleUpdate);
    return () => window.removeEventListener('morrow:nowplaying', handleUpdate);
  }, []);

  if (!playback) return null;

  const togglePlayback = () => {
    window.dispatchEvent(
      new CustomEvent('morrow:miniplayer-control', {
        detail: {
          audioUrl: playback.audioUrl,
          action: 'toggle',
        },
      })
    );
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playback.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = ratio * playback.duration;
    window.dispatchEvent(
      new CustomEvent('morrow:miniplayer-control', {
        detail: {
          audioUrl: playback.audioUrl,
          action: 'seek',
          time: targetTime,
        },
      })
    );
  };

  const formatSecs = (sec: number) => {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent =
    playback.duration > 0 ? (playback.currentTime / playback.duration) * 100 : 0;

  return (
    <div className="morrow-miniplayer-bar" role="region" aria-label="Persistent Audio Player">
      {/* Clickable progress track on top of the bar */}
      <div
        className="morrow-miniplayer-track"
        onClick={handleSeek}
        title="Click to seek"
        role="slider"
        aria-valuenow={playback.currentTime}
        aria-valuemin={0}
        aria-valuemax={playback.duration}
        tabIndex={0}
      >
        <div
          className="morrow-miniplayer-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="morrow-miniplayer-inner">
        <div className="morrow-miniplayer-info">
          <button
            type="button"
            className="morrow-miniplayer-btn"
            onClick={togglePlayback}
            aria-label={playback.isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {playback.isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="morrow-miniplayer-text">
            <span className="morrow-miniplayer-title">{playback.title}</span>
            <span className="morrow-miniplayer-status">
              {playback.isPlaying ? 'Now Playing' : 'Paused'}
            </span>
          </div>
        </div>

        <div className="morrow-miniplayer-meta">
          <span className="morrow-miniplayer-time">
            {formatSecs(playback.currentTime)} / {formatSecs(playback.duration)}
          </span>
          <button
            type="button"
            className="morrow-miniplayer-jump"
            onClick={onGoToMusic}
            title="Jump to track in Music showcase"
          >
            <span>Waveform</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </div>
  );
};
