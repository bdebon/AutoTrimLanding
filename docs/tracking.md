# Analytics & Tracking

This project uses Google Tag Manager and Meta Pixel for analytics and conversion tracking.

## Setup

### Google Tag Manager
- Uses official `@next/third-parties/google` package
- Container ID: `GTM-MTPT8QGT`
- Automatically tracks page views on route changes

### Meta Pixel
- Pixel ID: `2240864149721547`
- Tracks PageView events automatically
- Component: `app/FacebookPixel.tsx`

## Tracked Events

### Download Events
When users click download buttons, the following is tracked:

**Meta Pixel**: `Lead` event with:
- `platform`: 'mac' or 'windows'
- `location`: 'download_page'

**GTM**: `download_click` event with:
- `download_platform`: 'mac' or 'windows'
- `download_link`: GitHub release URL
- `download_location`: where the click occurred

## Usage

To track custom downloads from other pages:

```typescript
import { trackDownload } from '@/lib/tracking';

trackDownload({
  platform: 'mac',
  downloadLink: 'https://...',
  location: 'hero' // or 'pricing', etc.
});
```

## Testing

1. Open browser console
2. Check: `typeof dataLayer !== 'undefined'` (GTM loaded)
3. Check: `typeof fbq !== 'undefined'` (Meta Pixel loaded)
4. Click download button
5. Verify `dataLayer` contains `download_click` event
6. Use Meta Pixel Helper Chrome extension to see events

## Configuration Files

- `app/layout.tsx` - Script initialization
- `app/FacebookPixel.tsx` - Page view tracking
- `lib/tracking.ts` - Tracking utilities
- `components/Download.jsx` - Download event tracking
