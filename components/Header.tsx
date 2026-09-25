'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/landing/Logo';
import { btn } from '@/components/landing/ui';
import { trackEvent } from '@/lib/tracking';

const Header = () => {
  const t = useTranslations('landing');
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const home = `/${currentLocale}`;
  const navLinks = [
    { href: `${home}#silences`, label: t('nav.silences') },
    { href: `${home}#hesitations`, label: t('nav.hesitations') },
    { href: `${home}#multicam`, label: t('nav.multicam') },
    { href: `${home}#difference`, label: t('nav.difference') },
    { href: `${home}#faq`, label: t('nav.faq') },
  ];

  const link =
    'rounded-pill px-3 py-2 font-ui text-[14px] font-medium text-at-muted transition-colors hover:text-at-text';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'border-at-hairline bg-at-app/85 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[66px] w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo href={home} />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className={link}>
              {l.label}
            </a>
          ))}
          <Link
            href={`${home}/download`}
            onClick={() => trackEvent('cta_clicked', { location: 'header', type: 'download' })}
            className={`${btn.primary} ml-3 h-10! px-5! text-[14px]!`}
          >
            {t('cta.download')}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-pill border border-at-border bg-at-chip text-at-text md:hidden"
          aria-label={isMobileMenuOpen ? t('nav.menuClose') : t('nav.menuOpen')}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {isMobileMenuOpen ? (
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="border-t border-at-hairline bg-at-app px-4 pb-6 pt-2 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block rounded-control px-3 py-3 font-ui text-[16px] font-medium text-at-text hover:bg-at-card"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            href={`${home}/download`}
            className={`${btn.primary} mt-3 w-full`}
            onClick={() => {
              trackEvent('cta_clicked', { location: 'header', type: 'download' });
              setIsMobileMenuOpen(false);
            }}
          >
            {t('cta.download')}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
