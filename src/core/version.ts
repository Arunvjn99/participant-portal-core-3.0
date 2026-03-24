import { useLocation } from "react-router-dom";

export const DEFAULT_VERSION = "v1";

export const VALID_VERSIONS = ["v1", "v2"];

export function isValidVersion(version: string): boolean {
  return VALID_VERSIONS.includes(version);
}

export function getVersionFromPath(pathname: string): string {
  const parts = pathname.split("/");
  const maybeVersion = parts[1];

  if (VALID_VERSIONS.includes(maybeVersion)) {
    return maybeVersion;
  }

  return DEFAULT_VERSION;
}

/** First segment when it matches `v` + digits (e.g. v1, v2); otherwise DEFAULT_VERSION. Use for auth redirects from non-versioned routes like /enrollment. */
export function getRoutingVersion(pathname: string): string {
  const m = pathname.match(/^\/(v\d+)(\/|$)/);
  return m?.[1] ?? DEFAULT_VERSION;
}

/** Remove leading `/v1`, `/v2`, … so paths match stable routes like `/enrollment/...`. */
export function stripRoutingVersionPrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/v\d+/, "");
  return stripped || "/";
}

export function useAppVersion() {
  const location = useLocation();
  return getVersionFromPath(location.pathname);
}

export function withVersion(version: string, path: string) {
  if (path.startsWith("/")) {
    return `/${version}${path}`;
  }
  return `/${version}/${path}`;
}

/**
 * Version `/enrollment…` and `/transactions…` URLs; pass through other paths (e.g. `/profile`).
 * Use for mixed CTAs (dashboard quick actions) so enrollment and transaction flows stay on the current route version.
 */
export function withVersionIfEnrollment(version: string, path: string): string {
  if (path.startsWith("/enrollment") || path.startsWith("/transactions")) {
    return withVersion(version, path);
  }
  return path;
}
