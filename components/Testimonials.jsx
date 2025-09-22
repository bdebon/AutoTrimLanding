"use client";
import React from "react";
import { Star, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import OptimizedImage from "./OptimizedImage";

const Testimonials = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const testimonials = [
    {
      text: t("testimonials.quotes.0.text"),
      name: "Benjamin Code",
      role: "Creator",
      avatar: "/assets/img/pp-rose.jpg",
      rating: 5,
    },
    {
      text: t("testimonials.quotes.1.text"),
      name: "Alex Rivera",
      role: "Video Editor",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      rating: 5,
    },
    {
      text: t("testimonials.quotes.2.text"),
      name: "Mike Johnson",
      role: "Professional Editor",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
      rating: 5,
    },
  ];


  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-950 to-black"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl mx-auto font-bold text-white mb-4"
          >
            {t("testimonials.title")}
          </h2>
          <p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            {t("testimonials.trustedBy")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                                                className="h-4 w-4 fill-primary-400 text-primary-400"
                      />
                    ))}
                  </div>
                  <MessageCircle
                                        className="h-6 w-6 text-primary-500/30"
                  />
                </div>

                <p
                                    className="text-gray-300 mb-8 leading-relaxed font-normal"
                >
                  {testimonial.text}
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-sm opacity-50" />
                    <OptimizedImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="relative w-12 h-12 rounded-full object-cover border-2 border-gray-800"
                      width={48}
                      height={48}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p
                                            className="font-semibold text-white"
                    >
                      {testimonial.name}
                    </p>
                    <p
                                            className="text-sm text-gray-500"
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="flex flex-col items-center gap-6">
            <div  className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 border-2 border-gray-900"
                />
                <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-gray-900"
                />
                <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-gray-900"
                />
              </div>
              <span  className="text-gray-400">
                {t("testimonials.joinUsers")}
              </span>
            </div>

            <a
                            href={`/${currentLocale}/download`}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-2xl hover:shadow-primary-500/25 hover:scale-105"
            >
              {t("testimonials.startTrial")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
