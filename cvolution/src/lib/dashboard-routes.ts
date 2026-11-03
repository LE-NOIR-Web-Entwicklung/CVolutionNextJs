export type DashboardArea = 'cv' | 'motivation' | 'applications' | 'settings';

// "neu" is the route of an application that has not been saved yet.
export const NEW_APPLICATION_ROUTE = 'neu';

const AREA_SEGMENTS: Record<DashboardArea, string> = {
  cv: '',
  motivation: 'motivationsschreiben',
  applications: 'bewerbungen',
  settings: 'einstellungen',
};

export type DashboardRoute = { area: DashboardArea; applicationId: string | null };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseDashboardPath(pathname: string): DashboardRoute | null {
  const segments = pathname.replace(/^\/dashboard\/?/, '').split('/').filter(Boolean);
  if (pathname !== '/dashboard' && !pathname.startsWith('/dashboard/')) return null;
  if (!segments.length) return { area: 'cv', applicationId: null };
  const area = (Object.keys(AREA_SEGMENTS) as DashboardArea[]).find((key) => AREA_SEGMENTS[key] && AREA_SEGMENTS[key] === segments[0]);
  if (!area) return null;
  if (segments.length === 1) return { area, applicationId: null };
  if (area === 'applications' && segments.length === 2 && (segments[1] === NEW_APPLICATION_ROUTE || UUID.test(segments[1]))) {
    return { area, applicationId: segments[1].toLowerCase() };
  }
  return null;
}

export function dashboardPath(area: DashboardArea, applicationId: string | null = null): string {
  const base = AREA_SEGMENTS[area] ? `/dashboard/${AREA_SEGMENTS[area]}` : '/dashboard';
  return area === 'applications' && applicationId ? `${base}/${applicationId}` : base;
}

// Links from before the sub-routes used #cv, #motivation, #applications and #settings.
export function legacyDashboardHashArea(hash: string): DashboardArea | null {
  const area = hash.replace(/^#/, '');
  return area === 'cv' || area === 'motivation' || area === 'applications' || area === 'settings' ? area : null;
}
