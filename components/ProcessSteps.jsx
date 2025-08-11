import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProcessSteps = () => {
  const rootRef = useRef(null);
  const steps = [
    {
      number: '1',
      title: 'Drop your files',
      description: 'Drag & drop your clips. They appear instantly in the queue, ready to go.',
      gif: '/assets/img/gif1.gif',
      alt: 'Drag and drop video files into AutoTrim interface for automatic silence removal',
    },
    {
      number: '2',
      title: 'Trim in parallel',
      description: 'Hit "Process" and let AutoTrim analyze all files at once. Preview your timeline as soon as a clip is done.',
      gif: '/assets/img/gif2.gif',
      alt: 'AutoTrim processing multiple video files in parallel with automatic silence detection',
    },
    {
      number: '3',
      title: 'One timeline, all clips',
      description: 'AutoTrim automatically merges ALL your processed clips into ONE single timeline. Everything is already assembled and ready to edit - just export and go.',
      gif: '/assets/img/gif3.gif',
      alt: 'Single unified timeline export with all clips already assembled in AutoTrim',
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const title = rootRef.current?.querySelector('[data-animate="how-title"]');
      const desc = rootRef.current?.querySelector('[data-animate="how-desc"]');
      const cards = gsap.utils.toArray(rootRef.current?.querySelectorAll('[data-animate="how-card"]'));

      // Title + description: prevent FOUC and animate on scroll
      if (title && desc) {
        gsap.set([title, desc], { y: 30 }); // opacity handled by SSR inline style
        gsap.to(title, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once: true },
        });
        gsap.to(desc, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 85%', once: true },
          delay: 0.2,
        });
      }

      // Cards on scroll, with inner stagger, GIF entrance, alternating offset, and index-based chaining
      cards.forEach((card, i) => {
        const idx = Number(card.getAttribute('data-idx')) || i;
        const isEven = idx % 2 === 0;
        const badge = card.querySelector('[data-animate="how-badge"]');
        const h3 = card.querySelector('[data-animate="how-h3"]');
        const p = card.querySelector('[data-animate="how-p"]');
        const gif = card.querySelector('[data-animate="how-gif"]');

        // Initial states
        gsap.set(card, { opacity: 0, y: 42, x: isEven ? -24 : 24 });
        if (gif) gsap.set(gif, { opacity: 0, y: 18, scale: 0.98 });
        if (badge) gsap.set(badge, { opacity: 0, y: 18 });
        if (h3) gsap.set(h3, { opacity: 0, y: 18 });
        if (p) gsap.set(p, { opacity: 0, y: 18 });

        const baseDelay = idx * 0.06; // subtle chaining

        // Card entrance
        gsap.to(card, {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.95,
          ease: 'power3.out',
          delay: baseDelay,
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        });

        // GIF entrance
        if (gif) {
          gsap.to(gif, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            delay: baseDelay + 0.05,
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          });
        }

        // Title word wave via SplitText (graceful fallback)
        if (h3) {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 90%',
            once: true,
            onEnter: async () => {
              try {
                const mod = await import('@activetheory/split-text');
                const SplitText = mod.default || mod;
                const split = new SplitText(h3, { type: 'words' });
                const words = split.words;
                gsap.set(words, { yPercent: 130, display: 'inline-block', willChange: 'transform', force3D: true });
                gsap.set(h3, { opacity: 1, y: 0 });
                gsap.to(words, {
                  yPercent: 0,
                  duration: 0.9,
                  ease: 'power4.out',
                  stagger: { each: 0.06, from: 'start' },
                  delay: baseDelay + 0.08,
                });
              } catch (e) {
                // Fallback: simple fade/slide
                gsap.to(h3, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: 'power3.out',
                  delay: baseDelay + 0.08,
                });
              }
            },
          });
        }

        // Badge and paragraph staggered
        const inner = [badge, p].filter(Boolean);
        if (inner.length) {
          gsap.to(inner, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.08,
            delay: baseDelay + 0.12,
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          });
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div ref={rootRef} className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 data-animate="how-title" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" style={{ opacity: 0 }}>
            How to Automatically Trim Video Silences in Seconds
          </h2>
          <p data-animate="how-desc" className="text-xl text-gray-600" style={{ opacity: 0 }}>
            From raw clips to a clean timeline — here's how AutoTrim works
          </p>
        </div>

        <div className="grid gap-10 sm:gap-12 md:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative h-full ${index === 0 ? 'md:col-span-2' : ''}`}
            >
              {/* Step content */}
              <div data-animate="how-card" data-idx={index} className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">
                {/* GIF */}
                <div className="aspect-video bg-gray-100">
                  <img 
                    data-animate="how-gif"
                    src={step.gif} 
                    alt={step.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Text content */}
                <div className="p-8 md:p-12 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span data-animate="how-badge" className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full font-bold text-lg">
                      {step.number}
                    </span>
                    <h3 data-animate="how-h3" className="text-2xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p data-animate="how-p" className="text-lg text-gray-600 leading-relaxed mt-2">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;