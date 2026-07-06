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

async function request(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(10000),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Wattpad API error ${res.status}: ${res.statusText} for ${url}`);
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
 * Fetch specific stories by their Wattpad IDs (for Originals, featured picks etc.)
 */
export async function getStoriesByIds(ids: (number | string)[]): Promise<WattpadStory[]> {
  const fields = 'id,title,voteCount,readCount,description,completed,mature,cover,url,user(name,avatar),numParts,mainCategory,mainCategoryEnglish';
  const results = await Promise.allSettled(
    ids.map(id =>
      request(`${API_V3}/stories/${id}?fields=${encodeURIComponent(fields)}`)
    )
  );
  return results
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map(r => r.value);
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
  // Known Wattpad Originals IDs (top books that won't appear in regular search)
  const ORIGINALS_IDS = [
    80428185,   // Through My Window – Ariana Godoy
    23249000,   // Falling For The Bad Girl
    33685796,   // After – Anna Todd
    64872087,   // The QB Bad Boy and Me
    86238901,   // Cupid's Match
    117757080,  // My Husband's Mistress
    149080375,  // Saving Everest
    175843888,  // Flawed Heart
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
