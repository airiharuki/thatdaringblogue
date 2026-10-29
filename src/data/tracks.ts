export interface TrackItem {
  id: string;
  slug: string;
  title: string;
  details: string;
  audioUrl: string;
}

export interface FeaturedRelease {
  labelTitle: string;
  catalogNumber: string;
  title: string;
  subtitle: string;
  audioUrl: string;
}

export const SITE_CONTENT = {
  brand: 'morrow®',
  hero: {
    eyebrow: 'INDEPENDENT SOUND. HUMAN FEELING.',
    headline: 'Music for the spaces in between.',
    description:
      'I’m Morrow, a producer exploring warm textures, quiet rhythms, and the beautiful imperfections of sound.',
  },
  featuredRelease: {
    labelTitle: 'CLOSER TO YOU',
    catalogNumber: 'MRW—001 / 2026',
    title: 'Closer to you',
    subtitle: 'Work in progress · Listen & explore',
    audioUrl:
      '/audio/closertoyou_fredhouse_idea_200825_fix3.mp3',
  } as FeaturedRelease,
  catalog: {
    heading: 'The demo room',
    subheading: 'FOUR SKETCHES / ALWAYS EVOLVING',
    tracks: [
      {
        id: 'xE_C4OYhe',
        slug: 'closer-to-you',
        title: 'closertoyou - v3 ',
        details: '01 / WORK IN PROGRESS · UPDATED MIX',
        audioUrl: '/audio/closertoyou_fredhouse_idea_200825_fix3.mp3',
      },
      {
        id: 'HA6DzpLQf',
        slug: 'girl-like-you',
        title: 'Girl like you',
        details: '02 / WORK IN PROGRESS',
        audioUrl:
          'https://www.dropbox.com/scl/fi/4czvr46jnkvbmb0q7bf9e/girl-like-you-v4-fixed.mp3?rlkey=thdzoy5czygxkssqytq7mh95g&dl=1',
      },
      {
        id: 'tfaBta5bZ',
        slug: 'i-dont-feel-this-way-anymore',
        title: 'I don’t feel this way anymore',
        details: '03 / DEMO',
        audioUrl: '/audio/i-dont-feel-this-way-anymore.mp3',
      },
      {
        id: 'VQj0swUhX',
        slug: 'untitled-synthwave-color-bass',
        title: 'Untitled — Synthwave / Color Bass',
        details: '04 / DEMO · 150 BPM · WORKING TITLE',
        audioUrl:
          'https://www.dropbox.com/scl/fi/pd99tdf2a05bdz7ez0js1/150bpm-synthwave-v5.mp3?rlkey=knmtf3f1p0287x1lyfpk0u1a4&dl=1',
      },
    ] as TrackItem[],
  },
  about: {
    eyebrow: 'BEHIND THE SOUND',
    heading: 'A little analog. A little elsewhere.',
    body: 'Morrow is a home for late-night sketches, found sounds, and melodies that linger. Made slowly, with curiosity. For headphones, long walks, and wherever you find a moment to yourself.',
    tags: 'Original music · Production · Sound design',
  },
  footer: {
    copyright: '© 2026 MORROW',
    tagline: 'Made for listening, not scrolling.',
  },
};
