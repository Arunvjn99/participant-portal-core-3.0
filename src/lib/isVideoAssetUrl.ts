const VIDEO_URL = /\.(webm|mp4|ogg|ogv|mov)(\?|#|$)/i;

/** True when URL path looks like a browser-playable video (query/hash allowed). */
export function isVideoAssetUrl(url: string): boolean {
  return VIDEO_URL.test(url.trim());
}
