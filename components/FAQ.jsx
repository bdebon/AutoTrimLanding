import React, { useState, useLayoutEffect, useRef } from "react";
import {
  Plus,
  Minus,
  HelpCircle,
  Lightbulb,
  Calculator,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const contentRefs = useRef({});

  const faqs = t("faq.questions");

  const toggleFAQ = (index) => {
    const isOpening = openIndex !== index;
    const prevIndex = openIndex;
    setOpenIndex(isOpening ? index : null);

    // Animate accordion open/close
    if (isOpening && contentRefs.current[index]) {
      // Close previous if exists
      if (prevIndex !== null && contentRefs.current[prevIndex]) {
        gsap.to(contentRefs.current[prevIndex], {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
      // Open new
      gsap.fromTo(
        contentRefs.current[index],
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    } else if (!isOpening && contentRefs.current[index]) {
      // Close current
      gsap.to(contentRefs.current[index], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  };

  useLayoutEffect(() => {
    let splitInst = null;

    const ctx = gsap.context(() => {
      const icon = rootRef.current?.querySelector('[data-animate="faq-icon"]');
      const title = rootRef.current?.querySelector('[data-animate="faq-title"]');
      const items = gsap.utils.toArray(
        rootRef.current?.querySelectorAll('[data-animate="faq-item"]')
      );

      // Icon animation
      if (icon) {
        gsap.set(icon, { scale: 0, rotate: -180 });
        gsap.to(icon, {
          scale: 1,
          rotate: 0,
          duration: 0.6,
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

      // FAQ items animation
      items.forEach((item, i) => {
        const question = item.querySelector('[data-animate="faq-question"]');
        const icon = item.querySelector('[data-animate="faq-toggle"]');

        // Initial states
        gsap.set(item, { opacity: 0, y: 30 });
        if (question) gsap.set(question, { x: -20 });
        if (icon) gsap.set(icon, { scale: 0, rotate: -90 });

        const baseDelay = i * 0.08;

        // Item entrance
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: baseDelay + 0.5,
          scrollTrigger: {
            trigger: item,
            start: "top 95%",
            once: true,
          },
        });

        // Question slide
        if (question) {
          gsap.to(question, {
            x: 0,
            duration: 0.5,
            ease: "power3.out",
            delay: baseDelay + 0.6,
            scrollTrigger: {
              trigger: item,
              start: "top 95%",
              once: true,
            },
          });
        }

        // Icon animation
        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
            delay: baseDelay + 0.7,
            scrollTrigger: {
              trigger: item,
              start: "top 95%",
              once: true,
            },
          });
        }
      });
    }, rootRef);

    return () => {
      try {
        splitInst?.revert && splitInst.revert();
      } catch {}
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div 
            data-animate="faq-icon"
            className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4"
          >
            <HelpCircle className="h-6 w-6 text-gray-700" />
          </div>
          <h2 
            ref={titleRef}
            data-animate="faq-title"
            className="text-3xl sm:text-4xl font-bold text-gray-900 overflow-hidden"
            style={{ opacity: 0 }}
          >
            {t("faq.title")}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              data-animate="faq-item"
              className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <h3 
                  data-animate="faq-question"
                  className="text-gray-900 font-medium pr-4"
                >
                  {faq.q}
                </h3>
                <div data-animate="faq-toggle">
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  )}
                </div>
              </button>

              <div 
                ref={el => contentRefs.current[index] = el}
                style={{ height: 0, opacity: 0, overflow: 'hidden' }}
                className="px-6"
              >
                <p className="text-gray-600 text-sm leading-relaxed pb-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
