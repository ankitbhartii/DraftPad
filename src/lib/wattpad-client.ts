/**
 * Wattpad API Client
 * Reverse-engineered from Gimenz/wattpad.js (MIT)
 * Calls the same public unauthenticated endpoints as the official Wattpad website.
 */

const API_V4 = 'https://api.wattpad.com/v4';
const API_V2 = 'https://www.wattpad.com/apiv2';
const API_V3 = 'https://www.wattpad.com/api/v3';
const STORYTEXT_URL = 'https://www.wattpad.com/apiv2/?m=storytext';

// Browser-like headers to avoid being blocked
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Origin': 'https://www.wattpad.com',
  'Referer': 'https://www.wattpad.com/',
};

export interface WattpadStory {
  id: number;
  title: string;
  description: string;
  cover: string;
  url: string;
  completed: boolean;
  mature: boolean;
  voteCount: number;
  readCount: number;
  commentCount: number;
  numParts: number;
  mainCategory?: string;
  tags: string[];
  user: {
    name: string;
    avatar: string;
  };
  lastPublishedPart?: {
    createDate: string;
  };
}

export interface WattpadPart {
  id: number;
  title: string;
  url: string;
  createDate: string;
  rating: number;
  voteCount?: number;
  readCount?: number;
  text_url?: {
    text: string;
  };
}

export interface WattpadStoryDetail extends WattpadStory {
  mainCategory: string;
  mainCategoryEnglish: string;
  parts: WattpadPart[];
}

export interface WattpadSearchResult {
  stories: WattpadStory[];
  total: number;
  nexturl?: string;
}

async function request(url: string, timeoutMs = 7000): Promise<any> {
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(timeoutMs),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Wattpad API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Search Wattpad for stories by query
 */
export async function searchStories(
  query: string,
  limit = 20,
  offset = 0,
  mature = false
): Promise<WattpadSearchResult> {
  const fields = [
    'stories(id,title,voteCount,readCount,commentCount,description,completed',
    'mature,cover,url,isPaywalled,length,user(name,avatar),numParts',
    'lastPublishedPart(createDate),tags,mainCategory)',
    'total,nexturl',
  ].join(',');

  const params = new URLSearchParams({
    query,
    limit: String(limit),
    offset: String(offset),
    mature: String(mature),
    fields,
  });

  const data = await request(`${API_V4}/search/stories?${params}`);
  return data;
}

/**
 * Get full story details including parts list
 */
export async function getStory(storyId: number | string): Promise<WattpadStoryDetail> {
  const fields = [
    'id,title,description,cover,url,completed,mature,voteCount,readCount,commentCount',
    'numParts,tags,mainCategory,mainCategoryEnglish',
    'user(name,avatar)',
    'parts(id,title,url,createDate,voteCount,readCount,length)',
  ].join(',');

  const params = new URLSearchParams({ fields });
  // Use the v3 REST API which is more reliable than apiv2
  const data = await request(`${API_V3}/stories/${storyId}?${params}`);
  return data;
}

/**
 * Get the text content of a single chapter/part.
 * Uses the apiv2 storytext endpoint discovered from Wattpad's HTML page source.
 * URL format: https://www.wattpad.com/apiv2/?m=storytext&id={partId}&page=
 */
export async function getChapterText(partId: number | string): Promise<string> {
  const url = `${STORYTEXT_URL}&id=${partId}&page=`;
  const res = await fetch(url, {
    headers: {
      ...HEADERS,
      'Accept': 'text/html,*/*',
    },
    signal: AbortSignal.timeout(12000),
    cache: 'no-store',
  });
  if (res.ok) {
    const text = await res.text();
    return text || '<p>Chapter text unavailable.</p>';
  }
  return '<p>Chapter text unavailable.</p>';
}

/**
 * Get home page trending stories
 */
export async function getTrending(limit = 20): Promise<WattpadStory[]> {
  const fields = [
    'stories(id,title,voteCount,readCount,description,completed',
    'mature,cover,url,user(name,avatar),numParts,tags,mainCategory)',
  ].join(',');

  const params = new URLSearchParams({
    limit: String(limit),
    fields,
  });

  const data = await request(`${API_V3}/trending?${params}`);
  return data?.stories ?? [];
}

/**
 * Get stories by category using search (more reliable than category browse endpoint)
 */
export async function searchByCategory(category: string, limit = 20, mature = false): Promise<WattpadStory[]> {
  const fields = 'stories(id,title,voteCount,readCount,description,completed,mature,cover,url,user(name,avatar),numParts,mainCategory)';
  const params = new URLSearchParams({
    query: category,
    limit: String(limit),
    mature: String(mature),
    fields,
  });
  const data = await request(`${API_V4}/search/stories?${params}`);
  return data?.stories ?? [];
}

/**
 * Fetch specific stories by their Wattpad IDs — all in parallel with per-request timeout.
 */
export async function getStoriesByIds(ids: (number | string)[]): Promise<WattpadStory[]> {
  const fields = 'id,title,voteCount,readCount,description,completed,mature,cover,url,user(name,avatar),numParts,mainCategory';
  const results = await Promise.allSettled(
    ids.map(id =>
      request(`${API_V3}/stories/${id}?fields=${encodeURIComponent(fields)}`, 6000)
    )
  );
  return results
    .filter((r): r is PromiseFulfilledResult<any> =>
      r.status === 'fulfilled' && !!r.value?.id && !!r.value?.cover && !!r.value?.title
    )
    .map(r => r.value as WattpadStory);
}

/**
 * Get all home page shelves in parallel (server-side).
 * Fetches 15 genre shelves + Wattpad Originals simultaneously.
 */
export async function getHomeShelves(): Promise<{
  originals: WattpadStory[];
  topPicks: WattpadStory[];
  romance: WattpadStory[];
  teenfiction: WattpadStory[];
  fantasy: WattpadStory[];
  mystery: WattpadStory[];
  scifi: WattpadStory[];
  horror: WattpadStory[];
  werewolf: WattpadStory[];
  action: WattpadStory[];
  humor: WattpadStory[];
  historical: WattpadStory[];
  vampire: WattpadStory[];
  lgbtq: WattpadStory[];
  newadult: WattpadStory[];
}> {
  // ── Top 40 Wattpad Originals — all fetched in parallel for fast SSR ──
  const ORIGINALS_IDS = [
    // Classic originals (most popular)
    80428185,   // Through My Window – Ariana Godoy
    406237427,  // Hell University (English Version) – KnightInBlack
    18024139,   // Chasing Red – isabelleronin
    276397008,  // Always Red – isabelleronin
    17846448,   // The Hoodie Girl – yuenwrites
    128716730,  // Still With Me – AvaViolet
    890487,     // Float – ToastedBagels
    105872,     // A and D – fallenbabybubu
    73995048,   // Belle Morte – Bella_Higgin
    24288443,   // The Locker Exchange – 4nnrae
    206445908,  // Sidelined: The QB and Me
    76849200,   // Crossbones (Kingdom of Bones #1)
    113049401,  // Dark Tides (Kingdom of Bones #2)
    32044269,   // 24 Hours in Paris
    262772583,  // True (Male x Male) – Evan_Binley
    206445142,  // Saving Everest
    206439698,  // Cupid's Match
    301996676,  // POSSESSIVE SERIES | C.C.
    406502745,  // From a Knight to a Lady
    327021014,  // Crimson Heart – HYBE_STORIES
    294966028,  // DARK MOON: THE BLOOD ALTAR
    294965960,  // 7FATES: CHAKHO
    // WEBTOON New Releases
    406496461,  // I Gain Infinite Gold Just By Waiting
    406497098,  // Please Obsess Over Me
    406496269,  // Betrayal of Dignity
    406496775,  // My Sister is a Monster
    406497274,  // The Golden Forest
    406496213,  // An Entwined Destiny: The Servant and Guide
    406496912,  // Necromancer Academy and the Genius Summoner
    406496379,  // God-Tier Enhancement: My Upgrades Never Fail
    406496310,  // Finding Camellia
    406496721,  // My Elegant Tyrant
    406496566,  // Karma Haunts the Villainous Wife
    406496647,  // Magic Monopoly
    386755842,  // The First Night with the Duke
    389640875,  // The Remarried Empress
    390375614,  // The Greatest Estate Developer
    386798884,  // Explosive Romance
    384856681,  // Miss Pendleton
    390374508,  // Noble in Name, Vulgar at Heart
  ];

  const [originals, topPicks, romance, teenfiction, fantasy, mystery, scifi, horror,
    werewolf, action, humor, historical, vampire, lgbtq, newadult] = await Promise.allSettled([
    getStoriesByIds(ORIGINALS_IDS),
    searchByCategory('best wattpad stories completed', 20),
    searchByCategory('romance love story', 20),
    searchByCategory('teen fiction high school', 20),
    searchByCategory('fantasy magic adventure', 20),
    searchByCategory('mystery thriller suspense', 20),
    searchByCategory('science fiction dystopia', 20),
    searchByCategory('horror scary paranormal', 20),
    searchByCategory('werewolf wolf mate', 20, true),
    searchByCategory('action adventure hero', 20),
    searchByCategory('humor funny comedy', 20),
    searchByCategory('historical romance regency', 20),
    searchByCategory('vampire blood immortal', 20, true),
    searchByCategory('lgbtq gay love', 20),
    searchByCategory('new adult college university', 20),
  ]);

  const unwrap = (r: PromiseSettledResult<WattpadStory[]>) =>
    r.status === 'fulfilled' ? r.value : [];

  return {
    originals: unwrap(originals),
    topPicks: unwrap(topPicks),
    romance: unwrap(romance),
    teenfiction: unwrap(teenfiction),
    fantasy: unwrap(fantasy),
    mystery: unwrap(mystery),
    scifi: unwrap(scifi),
    horror: unwrap(horror),
    werewolf: unwrap(werewolf),
    action: unwrap(action),
    humor: unwrap(humor),
    historical: unwrap(historical),
    vampire: unwrap(vampire),
    lgbtq: unwrap(lgbtq),
    newadult: unwrap(newadult),
  };
}
