"use client";
import React, { useState, useLayoutEffect, useRef } from 'react';
import { Play, X, Film } from 'lucide-react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

const VideoDemo = () => {
  const t = useTranslations('videoDemo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  // Configure your Vimeo video ID via env: NEXT_PUBLIC_VIMEO_ID
  const VIMEO_ID = process.env.NEXT_PUBLIC_VIMEO_ID || '';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useLayoutEffect(() => {
    let splitInst = null;

    const ctx = gsap.context(() => {
      const icon = rootRef.current?.querySelector('[data-animate="demo-icon"]');
      const title = rootRef.current?.querySelector('[data-animate="demo-title"]');
      const subtitle = rootRef.current?.querySelector('[data-animate="demo-subtitle"]');
      const frame = rootRef.current?.querySelector('[data-animate="demo-frame"]');
      const thumbnail = rootRef.current?.querySelector('[data-animate="demo-thumbnail"]');
      const playButton = rootRef.current?.querySelector('[data-animate="demo-play"]');
      const playButtonInner = rootRef.current?.querySelector('[data-animate="demo-play-inner"]');
      const overlay = rootRef.current?.querySelector('[data-animate="demo-overlay"]');

      // Icon animation
      if (icon) {
        gsap.set(icon, { scale: 0, rotate: -180, opacity: 0 });
        gsap.to(icon, {
          scale: 1,
          rotate: 0,
          opacity: 0.9,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Title animation with SplitText
      if (title && titleRef.current) {
        gsap.set(titleRef.current, { y: 30 });

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top 85%",
          once: true,
          onEnter: async () => {
            try {
              const mod = await import("@activetheory/split-text");
              const SplitText = mod.default || mod;
              splitInst = new SplitText(title, { type: "words" });
              const words = splitInst.words;

              gsap.set(words, {
                yPercent: 130,
                display: "inline-block",
                willChange: "transform",
                force3D: true,
              });

              gsap.set(titleRef.current, { opacity: 1, y: 0 });

              gsap.to(words, {
                yPercent: 0,
                duration: 0.9,
                ease: "power4.out",
                stagger: { each: 0.06, from: "start" },
                delay: 0.2,
              });
            } catch (e) {
              // Fallback animation
              gsap.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.2,
              });
            }
          },
        });
      }

      // Subtitle animation
      if (subtitle) {
        gsap.set(subtitle, { y: 20, opacity: 0 });
        gsap.to(subtitle, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
          delay: 0.5,
        });
      }

      // Video frame animation with chained animations
      if (frame) {
        gsap.set(frame, { opacity: 0, y: 30, scale: 0.97 });
        
        // Set initial states for child elements
        if (thumbnail) {
          gsap.set(thumbnail, { 
            opacity: 0,
            filter: "blur(10px) brightness(0.5)"
          });
        }
        if (playButton) {
          gsap.set(playButton, { scale: 0, opacity: 0 });
        }
        if (overlay) {
          gsap.set(overlay, { opacity: 0, y: 20 });
        }

        ScrollTrigger.create({
          trigger: frame,
          start: "top 90%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();

            // Frame appears first
            tl.to(frame, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
            });

            // Thumbnail fades in
            if (thumbnail) {
              tl.to(thumbnail, {
                opacity: 0.8,
                filter: "blur(0px) brightness(1)",
                duration: 1.2,
                ease: "power2.out",
              }, "-=0.5");
            }

            // Play button appears
            if (playButton) {
              tl.to(playButton, {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
              }, "-=0.8");
            }

            // Overlay text appears
            if (overlay) {
              tl.to(overlay, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out",
              }, "-=0.4");
            }

            // Start pulse animation after play button appears
            if (playButtonInner) {
              tl.add(() => {
                gsap.to(playButtonInner, {
                  scale: 1.08,
                  duration: 1.5,
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                });
              }, "-=0.2");
            }
          }
        });
      }
    }, rootRef);

    return () => {
      try {
        splitInst?.revert && splitInst.revert();
      } catch {}
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* Demo Section */}
      <div ref={rootRef} id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div data-animate="demo-icon" className="mb-4 flex justify-center">
              <Film className="h-12 w-12 text-white/90" />
            </div>
            <h2 
              ref={titleRef}
              data-animate="demo-title"
              className="mx-auto text-3xl sm:text-4xl font-bold text-white mb-4 overflow-hidden"
              style={{ opacity: 0 }}
            >
              {t('title')}
            </h2>
            <p data-animate="demo-subtitle" className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('subtitle')}
              <br />
              <span className="font-semibold">{t('watchAction')}</span>
            </p>
          </div>

          {/* Mac-style video frame */}
          <div data-animate="demo-frame" className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 text-center">
                  <span className="text-gray-400 text-sm">{t('demoTitle')}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-b-xl overflow-hidden shadow-2xl">
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer group" onClick={openModal}>
                <img 
                  data-animate="demo-thumbnail"
                  src="/assets/img/demo-thumbnail.jpg" 
alt={t('thumbnail')}
                  className="w-full h-full object-cover"
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button data-animate="demo-play" className="group relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
                    <div data-animate="demo-play-inner" className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-full shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="h-12 w-12 ml-1" fill="currentColor" />
                    </div>
                  </button>
                </div>
                
                {/* Bottom text overlay */}
                <div data-animate="demo-overlay" className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent">
                  <p className="text-white font-bold text-xl mb-2">
                    {t('watchDemo')}
                  </p>
                  <p className="text-gray-300">
                    {t('oneClick')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-black">
                {VIMEO_ID ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${VIMEO_ID}?dnt=1&byline=0&portrait=0&title=0&autoplay=1`}
                    title={t('iframeTitle')}
                    loading="lazy"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <p className="px-6 text-center">
                      {t('noVideoId')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoDemo;