import { SiteContent } from './types';

export const SITE_DATA: SiteContent = {
  brand: 'that daring blogue',
  domain: 'thatdaringblogue.me',
  tagline: 'Technical writing, audio experiments & software engineering.',
  hero: {
    eyebrow: 'SOUND & SYSTEMS / ENGINEERING & SYNTHESIS',
    headline: 'Where code meets acoustics.',
    description:
      'A technical journal, audio laboratory, and software sketchbook exploring Web Audio, real-time DSP, systems architecture, and electronic music production.',
    secondary:
      'Built with the Morrow design language — warm textures, quiet rhythms, and deliberate engineering.',
  },
  featuredRelease: {
    labelTitle: 'CLOSER TO YOU',
    catalogNumber: 'MRW—001 / 2026',
    title: 'Closer to you',
    subtitle: 'Work in progress · Listen & explore with real-time waveform decoding',
    audioUrl: '/audio/closertoyou_fredhouse_idea_200825_fix3.mp3',
    releaseYear: '2026',
    description:
      'Warm analog Juno pad swells paired with chopped vocal textures and a driving four-on-the-floor groove. Mastered with gentle tape saturation.',
  },
  catalog: {
    heading: 'The Demo Room',
    subheading: 'UNRELEASED SKETCHES / STEMS / PROTOTYPES',
    tracks: [
      {
        id: 'xE_C4OYhe',
        slug: 'closer-to-you',
        title: 'closertoyou - v3',
        details: '01 / WORK IN PROGRESS · UPDATED MIX',
        audioUrl: '/audio/closertoyou_fredhouse_idea_200825_fix3.mp3',
        bpm: 124,
        key: 'F# Minor',
        stems: ['Drums', 'Bass', 'Vocal Chops', 'Juno Pad'],
        notes: 'Resampled through 1/4" tape emulation; sub-bass tightened around 42Hz.',
      },
      {
        id: 'HA6DzpLQf',
        slug: 'girl-like-you',
        title: 'Girl like you',
        details: '02 / WORK IN PROGRESS',
        audioUrl:
          'https://www.dropbox.com/scl/fi/4czvr46jnkvbmb0q7bf9e/girl-like-you-v4-fixed.mp3?rlkey=thdzoy5czygxkssqytq7mh95g&dl=1',
        bpm: 118,
        key: 'E Minor',
        stems: ['Acoustic Plucks', '808', 'Lead Vox', 'Atmosphere'],
        notes: 'Explores vocal formant shifting and bitcrushed reverb decay.',
      },
      {
        id: 'tfaBta5bZ',
        slug: 'i-dont-feel-this-way-anymore',
        title: 'I don’t feel this way anymore',
        details: '03 / DEMO',
        audioUrl: '/audio/i-dont-feel-this-way-anymore.mp3',
        bpm: 96,
        key: 'D Minor',
        stems: ['Fender Rhodes', 'Upright Bass', 'Room Percussion'],
        notes: 'Late-night ambient sketch recorded with single ribbon mic setup.',
      },
      {
        id: 'VQj0swUhX',
        slug: 'untitled-synthwave-color-bass',
        title: 'Untitled — Synthwave / Color Bass',
        details: '04 / DEMO · 150 BPM · WORKING TITLE',
        audioUrl:
          'https://www.dropbox.com/scl/fi/pd99tdf2a05bdz7ez0js1/150bpm-synthwave-v5.mp3?rlkey=knmtf3f1p0287x1lyfpk0u1a4&dl=1',
        bpm: 150,
        key: 'A Minor',
        stems: ['Chroma Chords', 'Resonator Lead', 'Sub', 'Cyber Kick'],
        notes: 'Exploring vocoded spectral resonance layers tuned to pentatonic intervals.',
      },
    ],
  },
  projects: {
    heading: 'Projects & Experiments',
    subheading: 'OPEN SOURCE TOOLS, DSP MODULES & WEB ARCHITECTURES',
    items: [
      {
        id: 'proj-wavecanvas',
        title: 'WaveCanvas Engine',
        tagline: 'Zero-rebound Web Audio waveform renderer for modern browsers',
        description:
          'High-performance audio visualizer decoding real-time peaks via Web Audio API AudioContext. Supports dynamic bar resampling, smooth sub-pixel rendering, keyboard seeking, and single-audio-element playback coordination across multiple instances.',
        category: 'Audio Tech',
        year: '2026',
        status: 'Production',
        tags: ['TypeScript', 'Web Audio API', 'Canvas 2D', 'Vite', 'React'],
        githubUrl: 'https://github.com/airiharuki/thatdaringblogue',
        liveUrl: 'https://thatdaringblogue.me',
        highlights: [
          'Sub-millisecond peak extraction from raw ArrayBuffers',
          'Linear interpolation bar resampling on window resize',
          'Zero external heavy audio visualization dependencies',
        ],
      },
      {
        id: 'proj-harmonicsat',
        title: 'HarmonicSat DSP',
        tagline: 'Real-time soft-knee tape & tube saturation algorithm',
        description:
          'An audio processing algorithm modeling odd and even harmonic distortion with soft-clipping polynomial curves. Compiled into WebAssembly for low-latency web playback and native VST/AU compatibility.',
        category: 'Audio Tech',
        year: '2025',
        status: 'Open Source',
        tags: ['C++', 'WebAssembly', 'Audio DSP', 'Faust'],
        githubUrl: 'https://github.com/airiharuki',
        highlights: [
          '2x Oversampling polyphase filter to suppress Nyquist aliasing',
          'Configurable blend between 2nd-order (tube) and 3rd-order (tape) harmonics',
        ],
      },
      {
        id: 'proj-daring-journal',
        title: 'that daring blogue Engine',
        tagline: 'Minimalist editorial publishing architecture with persistent audio',
        description:
          'The custom React + Vite SPA engine driving this site. Features instantaneous view switching, markdown reader overlay with hotkey navigation, and continuous non-interrupting audio stream coordination across all views.',
        category: 'Web Systems',
        year: '2026',
        status: 'Production',
        tags: ['React 18', 'TypeScript', 'CSS Variables', 'SPA Architecture'],
        githubUrl: 'https://github.com/airiharuki/thatdaringblogue',
        liveUrl: 'https://thatdaringblogue.me',
        highlights: [
          'Persistent background audio playback across view switches',
          'Design token system featuring Morrow Light (#f2eee6) & Dark (rgb(20, 24, 39))',
          'Clean reader modal with keyboard navigation & code block clipboard',
        ],
      },
      {
        id: 'proj-spectrogram-gl',
        title: 'Spectrogram-GL',
        tagline: 'GPU-accelerated audio waterfall spectrum visualizer',
        description:
          'Real-time Fourier Transform (FFT) waterfall analyzer rendered on HTML5 WebGL shaders. Maps frequency bins to perceptual Mel scale with customizable heatmaps.',
        category: 'Creative Coding',
        year: '2025',
        status: 'Active Beta',
        tags: ['WebGL', 'GLSL', 'Web Audio API', 'FFT Analysis'],
        githubUrl: 'https://github.com/airiharuki',
        highlights: [
          '60fps GPU shader waterfall plotting 2048 FFT bins',
          'Custom color ramp interpolation in fragment shader',
        ],
      },
    ],
  },
  articles: {
    heading: 'Technical Writing & Notes',
    subheading: 'ARTICLES ON DSP, WEB ARCHITECTURE, AND CREATIVE CODE',
    items: [
      {
        id: 'art-resilient-waveforms',
        slug: 'resilient-web-audio-waveforms',
        title: 'Designing a Resilient Audio Waveform Engine in the Browser',
        date: 'Oct 28, 2026',
        readTime: '7 min read',
        category: 'Audio DSP & Web Audio',
        summary:
          'A breakdown of how to decode audio buffers with the Web Audio API, extract normalized peaks, resample bars dynamically on viewport changes, and overcome cross-origin audio pitfalls.',
        tags: ['Web Audio API', 'TypeScript', 'Performance', 'Audio DSP'],
        content: `
# Designing a Resilient Audio Waveform Engine in the Browser

Visualizing sound in the web browser appears deceptively simple at first glance. Drop an \`<audio>\` element onto the DOM, inspect a few properties, draw some vertical lines, and call it a day. 

However, building an audio waveform player that handles arbitrary audio durations, decodes real audio peaks accurately, resamples cleanly on window resizing, and gracefully tolerates network hiccups requires a deliberate architecture.

In this article, we break down the engineering behind the **WaveCanvas Engine** powering the players on this site.

---

## 1. The Raw Pipeline: ArrayBuffer to Normalized Peaks

Browsers offer the **Web Audio API** \`AudioContext.decodeAudioData()\` method, which decodes an encoded audio stream (MP3, WAV, FLAC, AAC) into an uncompressed multi-channel \`AudioBuffer\` in memory.

\`\`\`typescript
const response = await fetch(audioUrl, { mode: 'cors' });
const arrayBuffer = await response.arrayBuffer();

const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
\`\`\`

Once decoded, an \`AudioBuffer\` contains 44,100 or 48,000 floating-point samples per second per channel. A 3-minute song comprises roughly **8 million floating point values**.

Attempting to draw 8 million bars on every frame will grind any browser's rendering thread to an absolute standstill.

### Peak Extraction Algorithm

We partition the buffer into \`bucketSize\` sample chunks and calculate the root-mean-square or peak value for each bucket:

\`\`\`typescript
export function extractNormalizedPeaks(
  audioBuffer: AudioBuffer,
  targetResolution = 2400
): Float32Array {
  const channelData = audioBuffer.getChannelData(0);
  const totalSamples = channelData.length;
  const bucketSize = Math.max(1, Math.floor(totalSamples / targetResolution));
  const peaks = new Float32Array(targetResolution);

  let globalMax = 0;
  for (let i = 0; i < targetResolution; i++) {
    const start = i * bucketSize;
    const end = Math.min(start + bucketSize, totalSamples);
    let peak = 0;

    for (let j = start; j < end; j++) {
      const val = Math.abs(channelData[j]);
      if (val > peak) peak = val;
    }

    peaks[i] = peak;
    if (peak > globalMax) globalMax = peak;
  }

  // Normalize all values between 0.0 and 1.0
  if (globalMax > 0) {
    for (let i = 0; i < targetResolution; i++) {
      peaks[i] /= globalMax;
    }
  }

  return peaks;
}
\`\`\`

> **Key Takeaway**: By pre-extracting a fixed high-resolution intermediate peak array (e.g. 2,400 points) and caching it, subsequent screen renders only need to resample from 2,400 numbers rather than re-reading 8,000,000 raw samples.

---

## 2. Dynamic Viewport Resampling

Screen widths vary from 375px mobile displays to 3840px ultrawide monitors. A fixed number of bars looks either cramped or sparse.

When the container width changes (detected via \`ResizeObserver\`), we calculate the target bar count:

\`\`\`typescript
const barWidth = 3; // pixels
const barGap = 3;   // pixels
const barCount = Math.floor(containerWidth / (barWidth + barGap));
\`\`\`

Then we downsample our 2,400-point normalized peaks array to \`barCount\` with a sub-bucket max scan:

\`\`\`typescript
export function resamplePeaks(peaks: Float32Array, targetCount: number): Float32Array {
  if (peaks.length === targetCount) return peaks;
  const result = new Float32Array(targetCount);
  const step = peaks.length / targetCount;

  for (let i = 0; i < targetCount; i++) {
    const start = Math.floor(i * step);
    const end = Math.floor((i + 1) * step);
    let max = 0;
    for (let j = start; j < end; j++) {
      if (peaks[j] > max) max = peaks[j];
    }
    result[i] = max;
  }
  return result;
}
\`\`\`

---

## 3. Decoupled Audio Coordination

When multiple audio players exist on the same page, starting playback on one must automatically pause all others without messy state entanglement.

Rather than lifting all audio refs into an overarching god-component, we maintain a module-scoped Set of registered HTMLAudioElements:

\`\`\`typescript
const activeAudioElements = new Set<HTMLAudioElement>();

export function pauseOtherPlayers(currentAudio: HTMLAudioElement) {
  activeAudioElements.forEach((audio) => {
    if (audio !== currentAudio && !audio.paused) {
      audio.pause();
    }
  });
}
\`\`\`

Whenever any component instance triggers \`audio.play()\`, it registers itself and signals \`pauseOtherPlayers()\`. This keeps components isolated, self-contained, and easily reusable anywhere in the UI.

---

## Conclusion

By caching decoded peaks, dynamically resampling with linear interpolation, and isolating playback coordination, we achieve 60fps waveform interaction with minimal memory footprint and zero audio stutter.
        `,
      },
      {
        id: 'art-analog-warmth-dsp',
        slug: 'analog-warmth-dsp-saturation',
        title: 'Analog Warmth, Digital Precision: Modeling Saturation in DSP',
        date: 'Oct 14, 2026',
        readTime: '9 min read',
        category: 'Audio DSP & Web Audio',
        summary:
          'Exploring nonlinear transfer functions, harmonic generation, and oversampling techniques to bring vintage hardware saturation into browser-based and native digital audio.',
        tags: ['DSP', 'Mathematics', 'C++', 'WebAssembly', 'Acoustics'],
        content: `
# Analog Warmth, Digital Precision: Modeling Saturation in DSP

In the analog domain, running a tape machine or vacuum tube preamplifier hot results in pleasing compression and musical harmonic distortion. In digital audio, exceeding 0 dBFS results in harsh, unpleasant clipping.

How do we mathematically capture that signature "analog warmth" inside digital software without introducing digital artifacts?

---

## 1. Linear vs. Nonlinear Systems

A pure linear system can alter amplitude and phase, but it **cannot generate new frequencies**. A pure 1 kHz sine wave passed through an ideal linear filter will only ever emerge as a 1 kHz sine wave.

Saturation, by contrast, is inherently nonlinear. A nonlinear transfer function $f(x)$ introduces harmonic overtones at integer multiples of the fundamental frequency:

* **Symmetric transfer functions** (e.g. $f(x) = \tanh(x)$ or cubic polynomials) produce **odd harmonics** ($3f, 5f, 7f...$), characteristic of magnetic tape and transformer saturation.
* **Asymmetric transfer functions** introduce a bias or even powers of $x$, generating **even harmonics** ($2f, 4f, 6f...$), characteristic of triode vacuum tubes.

---

## 2. Polynomial Soft-Clipping

A classic computationally efficient soft-clipping curve is the normalized cubic polynomial:

\`\`\`cpp
// Normalized cubic soft-clipping transfer function
float softClip(float x) {
    if (x <= -1.0f) {
        return -2.0f / 3.0f;
    } else if (x >= 1.0f) {
        return 2.0f / 3.0f;
    } else {
        return x - (x * x * x) / 3.0f;
    }
}
\`\`\`

Notice the smooth derivative at $x = \pm 1.0$:

$$\frac{d}{dx}\left(x - \frac{x^3}{3}\right) = 1 - x^2$$

At $x = \pm 1$, the slope smoothly approaches zero, preventing harsh corner discontinuities that cause high-frequency splatter.

---

## 3. The Nyquist Problem: Combating Aliasing

The primary pitfall with generating harmonics digitally is the **Nyquist theorem**. If a sound has high frequency content (e.g., 10 kHz) and we generate 3rd and 5th harmonics (30 kHz and 50 kHz) at a 44.1 kHz sample rate:

$$f_{\text{alias}} = |f_{\text{harmonic}} - f_s|$$

The 30 kHz harmonic mirrors off the 22.05 kHz Nyquist ceiling and folds back down to **14.1 kHz** — an inharmonic, metallic overtone that sounds dissonant and distinctly "digital."

### Oversampling Pipeline

To eliminate aliasing:
1. **Upsample** the signal $2\times$ or $4\times$ via a polyphase half-band FIR filter.
2. Apply the **nonlinear saturation** transfer curve at the higher sample rate.
3. Apply a steep **steep anti-aliasing lowpass filter** to cut frequencies above the original Nyquist boundary.
4. **Downsample** back to the project sample rate.

\`\`\`
[Input @ 44.1kHz] 
       │
       ▼
 [2x Upsampling]  ──> (88.2 kHz)
       │
       ▼
[Nonlinear DSP]   ──> (Produces 30 kHz harmonics safely under 44.1 kHz ceiling)
       │
       ▼
[Anti-Alias LPF]  ──> (Cuts everything > 20 kHz)
       │
       ▼
[2x Decimation]   ──> [Output @ 44.1kHz]
\`\`\`

---

## 4. WebAssembly Execution

By writing this inner saturation loop in C++ and compiling to **WebAssembly via Emscripten**, we run SIMD-accelerated 4x oversampled audio processing inside browser AudioWorklets at a constant buffer latency of less than 2.9 milliseconds.
        `,
      },
      {
        id: 'art-zero-lag-state',
        slug: 'zero-lag-state-coordination',
        title: 'Zero-Lag State Coordination Across Decoupled Web Components',
        date: 'Sep 29, 2026',
        readTime: '5 min read',
        category: 'Architecture & Systems',
        summary:
          'How to coordinate single-instance media players, tabbed SPA state, and theme transitions using native browser events without bloated state management libraries.',
        tags: ['Architecture', 'JavaScript', 'TypeScript', 'Performance'],
        content: `
# Zero-Lag State Coordination Across Decoupled Web Components

As modern front-end applications grow, developers frequently reach for heavy state management stores (Redux, Zustand, MobX) simply to coordinate communication between two distant components.

In this piece, we explore why lightweight DOM event buses and micro-subscriptions often deliver superior runtime performance, smaller bundle sizes, and zero unnecessary re-renders.

---

## 1. The Cost of Over-Centralized State

When global state managers update a property (e.g., \`nowPlaying: { id: '...', time: 14.2 }\`), every component hooked into that slice of state risks re-evaluating its render tree 60 times a second.

For audio playback and animations, this pattern introduces micro-stutters and garbage collection churn.

Instead, we separate:
* **Structural State** (Active Tab, Light/Dark Theme, Selected Article Modal)
* **High-Frequency Stream State** (Audio playback time, peak meters, scroll positions)

---

## 2. Native CustomEvent Coordination

The browser DOM includes a built-in, highly optimized event bus: \`window.dispatchEvent\` and \`CustomEvent\`.

\`\`\`typescript
// Fired by the active player only on significant state changes
window.dispatchEvent(
  new CustomEvent('morrow:playback', {
    detail: {
      trackId: 'xE_C4OYhe',
      title: 'closertoyou - v3',
      isPlaying: true,
      duration: 184.2,
    },
  })
);
\`\`\`

Any listening component (like a docked mini-player) subscribes once on mount and detaches on unmount:

\`\`\`typescript
useEffect(() => {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    setNowPlaying(detail);
  };
  window.addEventListener('morrow:playback', handler);
  return () => window.removeEventListener('morrow:playback', handler);
}, []);
\`\`\`

---

## 3. The Result

- **Zero Bundle Overhead**: Leverages what the browser already ships natively.
- **Isolated Rerenders**: Only the component that cares about the event re-renders.
- **Robust Decoupling**: Components can be mounted, unmounted, or refactored independently without breaking global store typings.
        `,
      },
    ],
  },
  about: {
    eyebrow: 'BEHIND THE SOUND & CODE',
    heading: 'A little analog. A little elsewhere.',
    body: [
      'that daring blogue is an independent creative laboratory founded by Morrow — an electronic music producer, audio software developer, and creative technologist based in the digital ether.',
      'The goal is simple: create warm, tactile sonic sketches and pair them with open, rigorously documented technical software. Built for deep listening, thoughtful engineering, and curious minds.',
    ],
    tags: 'Electronic Music · Audio DSP · Web Audio · Systems Architecture · Sound Design',
    gear: [
      {
        category: 'Hardware & Synths',
        items: [
          { name: 'Sequential Prophet Rev2', role: '8-voice analog polyphonic synthesizer' },
          { name: 'Moog Sub 37', role: 'Paraphonic analog synthesizer for bass & leads' },
          { name: 'Universal Audio Apollo Twin X', role: 'Thunderbolt 3 audio interface with DSP' },
          { name: 'Genelec 8030C Monitors', role: 'Nearfield reference monitors with Iso-Pods' },
          { name: 'Beyerdynamic DT 1990 Pro', role: 'Open-back 250 ohm reference headphones' },
        ],
      },
      {
        category: 'Software & DSP Tooling',
        items: [
          { name: 'Ableton Live 12 Suite', role: 'Primary digital audio workstation' },
          { name: 'Web Audio API & AudioWorklet', role: 'Browser DSP & real-time synthesis' },
          { name: 'FabFilter Total Bundle', role: 'Pro-Q 3, Pro-C 2, Saturn 2 for precision mixing' },
          { name: 'Soundtoys 5', role: 'Decapitator, EchoBoy, Crystallizer for analog color' },
          { name: 'TypeScript & Vite', role: 'Frontend software engineering stack' },
        ],
      },
    ],
  },
  footer: {
    copyright: '© 2026 THAT DARING BLOGUE / MORROW',
    tagline: 'Made for listening and deep thinking, not scrolling.',
    links: [
      { label: 'GitHub', url: 'https://github.com/airiharuki' },
      { label: 'SoundCloud', url: 'https://soundcloud.com' },
      { label: 'Spotify', url: 'https://spotify.com' },
      { label: 'Domain', url: 'https://thatdaringblogue.me' },
    ],
  },
};
