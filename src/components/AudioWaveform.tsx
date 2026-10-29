import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  startTransition,
} from 'react';

export interface AudioWaveformProps {
  audioUrl: string;
  waveColor?: string;
  progressColor?: string;
  textColor?: string;
  buttonColor?: string;
  trackHeight?: number;
  barWidth?: number;
  barGap?: number;
  title?: string;
  trackId?: string;
  style?: React.CSSProperties;
}

interface WaveformData {
  duration: number;
  peaks: Float32Array;
}

const decodedCache = new Map<string, WaveformData>();
const inflightRequests = new Map<string, Promise<WaveformData>>();
const activeAudioElements = new Set<HTMLAudioElement>();

function pauseOtherPlayers(currentAudio: HTMLAudioElement) {
  activeAudioElements.forEach((audio) => {
    if (audio !== currentAudio && !audio.paused) {
      audio.pause();
    }
  });
}

export function normalizeAudioUrl(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    if (!parsed.hostname.includes('dropbox.com')) return url;
    const params = new URLSearchParams(parsed.search);
    const rlkey = params.get('rlkey');
    params.delete('dl');
    const directUrl = new URL(`https://dl.dropboxusercontent.com${parsed.pathname}`);
    if (rlkey) {
      directUrl.searchParams.set('rlkey', rlkey);
    }
    return directUrl.toString();
  } catch {
    return url;
  }
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function extractNormalizedPeaks(buffer: AudioBuffer, bucketCount: number): Float32Array {
  const channels: Float32Array[] = [];
  for (let c = 0; c < buffer.numberOfChannels; c += 1) {
    channels.push(buffer.getChannelData(c));
  }

  const peaks = new Float32Array(bucketCount);
  for (let i = 0; i < bucketCount; i += 1) {
    const start = Math.floor((i / bucketCount) * buffer.length);
    const end = Math.min(buffer.length, Math.floor(((i + 1) / bucketCount) * buffer.length));
    const clampedEnd = Math.max(start + 1, end);
    let maxSample = 0;

    for (let c = 0; c < channels.length; c += 1) {
      const channelData = channels[c];
      for (let s = start; s < clampedEnd; s += 1) {
        const val = Math.abs(channelData[s] ?? 0);
        if (val > maxSample) maxSample = val;
      }
    }
    peaks[i] = maxSample;
  }

  let globalMax = 0;
  for (let i = 0; i < peaks.length; i += 1) {
    if (peaks[i] > globalMax) globalMax = peaks[i];
  }
  if (globalMax > 0) {
    for (let i = 0; i < peaks.length; i += 1) {
      peaks[i] = peaks[i] / globalMax;
    }
  }
  return peaks;
}

function resamplePeaks(peaks: Float32Array, targetBars: number): number[] {
  const count = Math.max(1, targetBars);
  const result = new Array<number>(count).fill(0);
  const ratio = peaks.length / count;

  for (let i = 0; i < count; i += 1) {
    const start = Math.floor(i * ratio);
    const end = Math.max(start + 1, Math.floor((i + 1) * ratio));
    let max = 0;
    for (let j = start; j < end && j < peaks.length; j += 1) {
      if (peaks[j] > max) max = peaks[j];
    }
    result[i] = max;
  }
  return result;
}

async function decodeAudioWaveform(rawUrl: string): Promise<WaveformData> {
  const normalized = normalizeAudioUrl(rawUrl);
  const candidates = normalized === rawUrl ? [rawUrl] : [normalized, rawUrl];

  const cached = decodedCache.get(normalized) || decodedCache.get(rawUrl);
  if (cached) return cached;

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) {
    throw new Error('AudioContext is unavailable in this browser.');
  }

  const fetchAndDecode = (targetUrl: string): Promise<WaveformData> => {
    const existing = inflightRequests.get(targetUrl);
    if (existing) return existing;

    const promise = (async () => {
      let ctx: AudioContext | null = null;
      let timeoutId = 0;
      const controller = new AbortController();

      try {
        timeoutId = window.setTimeout(() => controller.abort(), 25000);
        const response = await fetch(targetUrl, {
          mode: 'cors',
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Network response failed (${response.status}).`);
        }
        const arrayBuffer = await response.arrayBuffer();
        ctx = new AudioCtx();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
        const data: WaveformData = {
          duration: audioBuffer.duration,
          peaks: extractNormalizedPeaks(audioBuffer, 2400),
        };
        decodedCache.set(targetUrl, data);
        decodedCache.set(normalized, data);
        decodedCache.set(rawUrl, data);
        return data;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw new Error('Waveform request timed out (25s).');
        }
        throw err;
      } finally {
        window.clearTimeout(timeoutId);
        if (ctx) {
          try {
            await ctx.close();
          } catch {
            // ignore close error
          }
        }
      }
    })();

    inflightRequests.set(targetUrl, promise);
    promise.catch(() => {
      inflightRequests.delete(targetUrl);
    });
    return promise;
  };

  let lastError: unknown = null;
  for (const candidate of candidates) {
    try {
      return await fetchAndDecode(candidate);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('Unable to decode audio waveform.');
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioUrl,
  waveColor = '#CCCCCC',
  progressColor = '#000000',
  textColor = '#000000',
  buttonColor = '#000000',
  trackHeight = 120,
  barWidth = 3,
  barGap = 2,
  title = '',
  trackId,
  style,
}) => {
  const normalizedUrl = useMemo(() => normalizeAudioUrl(audioUrl), [audioUrl]);
  const [currentSrc, setCurrentSrc] = useState(normalizedUrl);
  const [triedFallback, setTriedFallback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(true);
  const [waveformError, setWaveformError] = useState('');
  const [playbackError, setPlaybackError] = useState('');
  const [containerWidth, setContainerWidth] = useState(0);
  const [isSliderFocused, setIsSliderFocused] = useState(false);
  const [isButtonFocused, setIsButtonFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const lastEmitTimeRef = useRef(0);

  const emitPlaybackState = useCallback(
    (playing: boolean, time = currentTime, dur = duration) => {
      window.dispatchEvent(
        new CustomEvent('morrow:nowplaying', {
          detail: {
            title: title || 'Demo Track',
            audioUrl,
            isPlaying: playing,
            currentTime: time,
            duration: dur,
          },
        })
      );
    },
    [audioUrl, currentTime, duration, title]
  );

  useEffect(() => {
    const handleControl = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.audioUrl !== audioUrl) return;
      const audio = audioRef.current;
      if (!audio) return;
      if (detail.action === 'toggle') {
        if (audio.paused) {
          pauseOtherPlayers(audio);
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      } else if (detail.action === 'seek' && typeof detail.time === 'number') {
        audio.currentTime = detail.time;
        setCurrentTime(detail.time);
      }
    };
    window.addEventListener('morrow:miniplayer-control', handleControl);
    return () => window.removeEventListener('morrow:miniplayer-control', handleControl);
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    startTransition(() => {
      setCurrentSrc(normalizedUrl);
      setTriedFallback(false);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setIsLoadingWaveform(true);
      setWaveformError('');
      setPlaybackError('');
      setWaveformData(null);
      setIsVisible(false);
      setRetryCount(0);
    });
  }, [normalizedUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    activeAudioElements.add(audio);
    return () => {
      activeAudioElements.delete(audio);
    };
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      startTransition(() => setContainerWidth(width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      startTransition(() => setIsVisible(true));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0)) {
          startTransition(() => setIsVisible(true));
        }
      },
      { root: null, rootMargin: '300px 0px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [normalizedUrl]);

  useEffect(() => {
    let cancelled = false;
    if (!isVisible) return;

    if (!audioUrl) {
      startTransition(() => {
        setWaveformError('No audio URL provided.');
        setIsLoadingWaveform(false);
      });
      return;
    }

    startTransition(() => {
      setIsLoadingWaveform(true);
      setWaveformError('');
    });

    decodeAudioWaveform(audioUrl)
      .then((data) => {
        if (cancelled) return;
        startTransition(() => {
          setWaveformData(data);
          setDuration((prev) => (prev > 0 ? prev : data.duration));
          setIsLoadingWaveform(false);
        });
      })
      .catch((err) => {
        if (cancelled) return;
        const msg =
          err instanceof Error
            ? err.message
            : 'Waveform decode failed. Playback may still work.';
        startTransition(() => {
          setWaveformError(`Waveform unavailable: ${msg}`);
          setIsLoadingWaveform(false);
        });
      });

    return () => {
      cancelled = true;
    };
  }, [audioUrl, isVisible, retryCount]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) audio.pause();
    };
  }, []);

  const barCount = useMemo(() => {
    const step = Math.max(1, barWidth + barGap);
    return Math.max(16, Math.floor(containerWidth / step));
  }, [barGap, barWidth, containerWidth]);

  const bars = useMemo(
    () => (waveformData ? resamplePeaks(waveformData.peaks, barCount) : []),
    [barCount, waveformData]
  );

  const progressRatio = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.max(0, Math.min(1, currentTime / duration));
  }, [currentTime, duration]);

  const seekToRatio = useCallback(
    (ratio: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      const targetTime = Math.max(0, Math.min(1, ratio)) * duration;
      audio.currentTime = targetTime;
      startTransition(() => setCurrentTime(targetTime));
    },
    [duration]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width) return;
      const ratio = (e.clientX - rect.left) / rect.width;
      seekToRatio(ratio);
    },
    [seekToRatio]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!duration) return;
      const step = Math.max(1, duration * 0.02);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekToRatio((currentTime + step) / duration);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekToRatio((currentTime - step) / duration);
      } else if (e.key === 'Home') {
        e.preventDefault();
        seekToRatio(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        seekToRatio(1);
      }
    },
    [currentTime, duration, seekToRatio]
  );

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!waveformData) {
      startTransition(() => {
        setIsVisible(true);
        if (!isLoadingWaveform && isVisible) {
          setRetryCount((c) => c + 1);
        }
      });
    }

    if (audio.paused) {
      try {
        pauseOtherPlayers(audio);
        await audio.play();
        startTransition(() => setIsPlaying(true));
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        startTransition(() => {
          setIsPlaying(false);
          setPlaybackError('Unable to start playback.');
        });
      }
    } else {
      audio.pause();
      startTransition(() => setIsPlaying(false));
    }
  }, [isVisible, isLoadingWaveform, waveformData]);

  const activeBarIndex = Math.floor(progressRatio * bars.length);
  const resolvedHeight = style?.height ?? 300;

  return (
    <div
      style={{
        ...style,
        width: style?.width ?? '100%',
        height: resolvedHeight,
        position: 'relative',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        padding: '12px 0',
        color: textColor,
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      <audio
        ref={audioRef}
        src={currentSrc}
        preload="metadata"
        crossOrigin="anonymous"
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime || 0;
          startTransition(() => setCurrentTime(t));
          const now = performance.now();
          if (now - lastEmitTimeRef.current > 300) {
            lastEmitTimeRef.current = now;
            emitPlaybackState(true, t, e.currentTarget.duration || duration);
          }
        }}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration || 0;
          startTransition(() => setDuration(d));
        }}
        onPlay={() => {
          if (audioRef.current) pauseOtherPlayers(audioRef.current);
          startTransition(() => setIsPlaying(true));
          emitPlaybackState(true);
        }}
        onPause={() => {
          startTransition(() => setIsPlaying(false));
          emitPlaybackState(false);
        }}
        onCanPlay={() => startTransition(() => setPlaybackError(''))}
        onEnded={() => {
          if (audioRef.current) audioRef.current.currentTime = 0;
          startTransition(() => {
            setIsPlaying(false);
            setCurrentTime(0);
          });
          emitPlaybackState(false, 0);
        }}
        onError={() => {
          if (!triedFallback && normalizedUrl !== audioUrl) {
            startTransition(() => {
              setCurrentSrc(audioUrl);
              setTriedFallback(true);
            });
          } else {
            startTransition(() => {
              setPlaybackError(
                'Playback unavailable: failed to load audio from both normalized and original URLs.'
              );
              setIsPlaying(false);
            });
          }
        }}
      />

      {title ? (
        <div style={{ fontSize: 14, lineHeight: '1.2em', marginBottom: 6, opacity: 0.95 }}>
          {title}
        </div>
      ) : null}

      <div
        ref={sliderRef}
        role="slider"
        tabIndex={0}
        aria-label="Audio waveform seek"
        aria-valuemin={0}
        aria-valuemax={Math.max(0, duration)}
        aria-valuenow={Math.min(currentTime, duration)}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onFocus={() => startTransition(() => setIsSliderFocused(true))}
        onBlur={() => startTransition(() => setIsSliderFocused(false))}
        style={{
          width: '100%',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          outline: 'none',
          borderRadius: 8,
          boxShadow: isSliderFocused ? `0 0 0 2px ${buttonColor}` : 'none',
        }}
      >
        {bars.length > 0 ? (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${containerWidth || 1} ${trackHeight}`}
            preserveAspectRatio="none"
          >
            {bars.map((peak, idx) => {
              const barH = Math.max(2, peak * trackHeight);
              const x = idx * (barWidth + barGap);
              const y = (trackHeight - barH) / 2;
              const fill = idx < activeBarIndex ? progressColor : waveColor;
              return (
                <rect
                  key={idx}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={Math.min(barWidth / 2, 4)}
                  ry={Math.min(barWidth / 2, 4)}
                  fill={fill}
                />
              );
            })}
          </svg>
        ) : (
          <div
            style={{
              fontSize: 12,
              opacity: 0.8,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span>
              {isLoadingWaveform ? 'Loading waveform data…' : 'Waveform not available.'}
            </span>
            {!isLoadingWaveform && waveformError ? (
              <button
                type="button"
                onClick={() =>
                  startTransition(() => {
                    setWaveformError('');
                    setIsLoadingWaveform(true);
                    setIsVisible(true);
                    setRetryCount((c) => c + 1);
                  })
                }
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: buttonColor,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  padding: 0,
                  minWidth: 44,
                  minHeight: 44,
                }}
              >
                Retry
              </button>
            ) : null}
          </div>
        )}
      </div>

      <div
        style={{
          height: 46,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontSize: 12,
          lineHeight: '1em',
        }}
      >
        <button
          type="button"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          onClick={togglePlayback}
          onFocus={() => startTransition(() => setIsButtonFocused(true))}
          onBlur={() => startTransition(() => setIsButtonFocused(false))}
          style={{
            border: 'none',
            background: 'transparent',
            color: buttonColor,
            padding: '8px 10px',
            margin: 0,
            minWidth: 44,
            minHeight: 44,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 12,
            boxShadow: isButtonFocused ? `0 0 0 2px ${buttonColor}` : 'none',
          }}
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5z"
                fill="currentColor"
              />
            </svg>
          )}
          <span>{isPlaying ? 'Pause' : 'Play track'}</span>
        </button>

        <div style={{ marginLeft: 'auto', color: textColor }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {waveformError ? (
        <div
          role="status"
          aria-live="polite"
          style={{ fontSize: 12, lineHeight: '1.3em', color: textColor, opacity: 0.85 }}
        >
          {waveformError}
        </div>
      ) : null}

      {playbackError ? (
        <div
          role="status"
          aria-live="polite"
          style={{ fontSize: 12, lineHeight: '1.3em', color: textColor, opacity: 0.85 }}
        >
          {playbackError}
        </div>
      ) : null}
    </div>
  );
};
