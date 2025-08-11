import React, { useEffect, useRef } from 'react';
import { ArrowRight, Play, Sparkles, Zap, CheckCircle, Clock, Shield, Globe2, ArrowDown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const { t } = useTranslation();
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const arrow1Ref = useRef(null);
  const arrow2Ref = useRef(null);
  const heroContentRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Initial hero content animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Set initial states
    gsap.set([badgeRef.current, titleRef.current, descriptionRef.current, ctaRef.current], {
      opacity: 0,
      y: 30
    });

    // Badge animation
    tl.to(badgeRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8
    })
    // Title animation
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1
    }, "-=0.4")
    // Description animation
    .to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, "-=0.6")
    // CTA buttons animation
    .to(ctaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, "-=0.4");

    // Create scroll-triggered timeline for steps
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: step1Ref.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    // Reveal Step 3 first
    scrollTl.fromTo(step3Ref.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      }
    );

    // Then reveal Step 2
    scrollTl.fromTo(step2Ref.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      },
      "-=0.6"
    );

    // Finally reveal Step 1
    scrollTl.fromTo(step1Ref.current,
      {
        opacity: 0,
        y: 40,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      },
      "-=0.6"
    );

    // Animate arrows in the timeline
    scrollTl.fromTo(arrow2Ref.current,
      {
        opacity: 0,
        scale: 0,
        rotation: -180
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      },
      "-=0.8"
    )
    .fromTo(arrow1Ref.current,
      {
        opacity: 0,
        scale: 0,
        rotation: -180
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    );

    // Animate stats
    scrollTl.fromTo(statsRef.current?.children,
      {
        opacity: 0,
        y: 30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: {
          each: 0.1,
          from: "center"
        }
      },
      "-=0.2"
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-100 via-primary-50 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-secondary-100 via-secondary-50 to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-r from-primary-200 to-transparent rounded-full blur-2xl opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        <div>
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 mb-8" style={{ opacity: 0 }}>
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Save 96% of your editing time</span>
          </div>

          <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight" style={{ opacity: 0 }}>
            Stop wasting hours
            <br />
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              trimming silence.
            </span>
          </h1>
          
          <p ref={descriptionRef} className="mt-6 text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" style={{ opacity: 0 }}>
            {t('hero.description')}
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center" style={{ opacity: 0 }}>
            <a
              href="/download"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-4 h-4 mr-2" />
              {t('hero.cta.main')}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a
              href="#demo"
              className="group inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
            >
              <Play className="w-4 h-4 mr-2" />
              {t('hero.cta.secondary')}
            </a>
          </div>
        </div>

        <div className="mt-20 relative">
          {/* Three-step Process */}
          <div className="relative max-w-5xl mx-auto">
            <div className="space-y-12">
              {/* Step 1 */}
              <div ref={step1Ref} className="space-y-4" style={{ opacity: 0 }}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full font-bold shadow-lg">
                    1
                  </div>
                  <h3 className="text-lg text-gray-900">
                    <span className="font-semibold">{t('hero.steps.step1.prefix')}</span> {t('hero.steps.step1.title')}
                  </h3>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <img 
                      src="/assets/img/hero-step-1.jpg" 
                      alt="Raw footage with silences" 
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Animated Arrow 1 */}
              <div ref={arrow1Ref} className="flex justify-center items-center gap-3 -my-4" style={{ opacity: 0 }}>
                <ArrowDown className="w-8 h-8 text-primary-500" />
              </div>

              {/* Step 2 */}
              <div ref={step2Ref} className="space-y-4" style={{ opacity: 0 }}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-full font-bold shadow-lg">
                    2
                  </div>
                  <h3 className="text-lg text-gray-900 flex items-center gap-2">
                    <span>
                      <span className="font-semibold">{t('hero.steps.step2.prefix')}</span> {t('hero.steps.step2.title')}
                    </span>
                    <img src="/assets/img/logo-autotrim.svg" alt="AutoTrim" className="h-5 w-auto" />
                  </h3>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-secondary-100 to-secondary-50 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <img 
                      src="/assets/img/hero-step-2.jpg" 
                      alt="Trimly processing" 
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Animated Arrow 2 */}
              <div ref={arrow2Ref} className="flex justify-center items-center gap-3 -my-4" style={{ opacity: 0 }}>
                <ArrowDown className="w-8 h-8 text-secondary-500" />
              </div>

              {/* Step 3 */}
              <div ref={step3Ref} className="space-y-4" style={{ opacity: 0 }}>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full font-bold shadow-lg">
                    3
                  </div>
                  <h3 className="text-lg text-gray-900 flex items-center gap-2">
                    <span>
                      <span className="font-semibold">{t('hero.steps.step3.prefix')}</span> {t('hero.steps.step3.title')}
                    </span>
                    <div className="flex items-center gap-1">
                      <img src="/assets/img/fcpx-icon.png" alt="Final Cut Pro" className="h-4 w-auto" />
                      <img src="/assets/img/premiere-icon.svg" alt="Adobe Premiere" className="h-4 w-auto" />
                      <img src="/assets/img/resolve-icon.svg" alt="DaVinci Resolve" className="h-4 w-auto" />
                    </div>
                  </h3>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <img 
                      src="/assets/img/hero-step-3.jpg" 
                      alt="Clean XML timeline" 
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div ref={statsRef} className="flex justify-center gap-4 mt-12 flex-wrap" style={{ opacity: 0 }}>
              <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex items-center gap-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                  29×
                </div>
                <div className="text-sm text-gray-600">Faster</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex items-center gap-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-secondary-500 to-secondary-600 bg-clip-text text-transparent">
                  96%
                </div>
                <div className="text-sm text-gray-600">Time saved</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex items-center gap-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm text-gray-600">Private</div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;