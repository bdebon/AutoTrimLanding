/**
 * Tracking utilities for Meta Pixel and Google Tag Manager
 */

// Declare global window types for tracking scripts
declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, string | number | boolean>
    ) => void;
    dataLayer?: Array<Record<string, string | number | boolean | undefined>>;
  }
}

export interface DownloadTrackingParams {
  platform: 'mac' | 'windows';
  downloadLink: string;
  location?: string; // Where the download was initiated (hero, pricing, download page, etc.)
}

/**
 * Track a download click event with both Meta Pixel and GTM
 */
export const trackDownload = ({
  platform,
  downloadLink,
  location = 'download_page',
}: DownloadTrackingParams): void => {
  // Meta Pixel Lead event
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'AutoTrim Download',
      content_category: 'Software Download',
      platform: platform,
      location: location,
      value: 0,
      currency: 'USD',
    });
  }

  // Google Tag Manager dataLayer event
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'download_click',
      download_platform: platform,
      download_link: downloadLink,
      download_location: location,
      event_category: 'Downloads',
      event_label: `AutoTrim ${platform === 'mac' ? 'macOS' : 'Windows'}`,
    });
  }
};

/**
 * Track a custom event
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
): void => {
  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};

/**
 * Track a Meta Pixel custom event
 */
export const trackMetaEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
): void => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};
