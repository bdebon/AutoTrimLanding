import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Internationalized pathnames, plus the localized pages people link to
  // without a locale (emails, docs): the middleware redirects those to the
  // visitor's language.
  matcher: [
    '/',
    '/(fr|es|zh|en)/:path*',
    '/download',
    '/pricing',
    '/guides',
    '/guides/:path*',
    '/compare/:path*'
  ]
};
