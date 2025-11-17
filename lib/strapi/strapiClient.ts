const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL) {
  console.warn('NEXT_PUBLIC_STRAPI_URL is not defined. Strapi requests will fail.');
}

export interface StrapiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

const buildUrl = (path: string, params?: Record<string, string | number | undefined>) => {
  const url = new URL(path, STRAPI_URL || 'http://localhost:1337');
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
};

export async function strapiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = buildUrl(path, options.params);

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: STRAPI_TOKEN ? `Bearer ${STRAPI_TOKEN}` : '',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Strapi request failed: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Strapi request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
