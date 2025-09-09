"use client";
import React from "react";
import {
  Upload,
  Cpu,
  Sliders,
  Sparkles,
  Film,
  MonitorPlay,
  RefreshCcw,
  Globe,
  Zap,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { useTranslations } from 'next-intl';

const PerksGrid = () => {
  const t = useTranslations('perksGrid');
  const perks = [
    {
      icon: Upload,
      title: t('perks.dragDrop.title'),
      desc: t('perks.dragDrop.description'),
      size: "normal",
      iconBg: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      gradient: "from-blue-500/10 to-blue-600/20",
      featured: true,
    },
    {
      icon: Sparkles,
      title: t('perks.smartPresets.title'),
      desc: t('perks.smartPresets.description'),
      size: "normal",
      iconBg: "from-yellow-50 to-yellow-100",
      iconColor: "text-yellow-600",
      gradient: "from-yellow-500/10 to-yellow-600/20",
      featured: false,
    },
    {
      icon: Sliders,
      title: t('perks.fineTune.title'),
      desc: t('perks.fineTune.description'),
      size: "large",
      gifPath: "/assets/img/perks1.gif",
      iconBg: "from-green-50 to-green-100",
      iconColor: "text-green-600",
      gradient: "from-green-500/10 to-green-600/20",
      featured: false,
    },
    {
      icon: Film,
      title: t('perks.xmlExport.title'),
      desc: t('perks.xmlExport.description'),
      size: "normal",
      iconBg: "from-red-50 to-red-100",
      iconColor: "text-red-600",
      gradient: "from-red-500/10 to-red-600/20",
      featured: true,
    },
    {
      icon: MonitorPlay,
      title: t('perks.localProcessing.title'),
      desc: t('perks.localProcessing.description'),
      size: "normal",
      iconBg: "from-indigo-50 to-indigo-100",
      iconColor: "text-indigo-600",
      gradient: "from-indigo-500/10 to-indigo-600/20",
      featured: false,
    },
    {
      icon: Cpu,
      title: t('perks.parallelProcessing.title'),
      desc: t('perks.parallelProcessing.description'),
      size: "large",
      gifPath: "/assets/img/perks3.gif",
      iconBg: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      gradient: "from-purple-500/10 to-purple-600/20",
      featured: true,
    },
    {
      icon: RefreshCcw,
      title: t('perks.repetitionRemover.title'),
      desc: t('perks.repetitionRemover.description'),
      comingSoon: true,
      size: "normal",
      iconBg: "from-pink-50 to-pink-100",
      iconColor: "text-pink-600",
      gradient: "from-pink-500/10 to-pink-600/20",
      featured: false,
    },
    {
      icon: Globe,
      title: t('perks.multilingual.title'),
      desc: t('perks.multilingual.description'),
      size: "normal",
      iconBg: "from-teal-50 to-teal-100",
      iconColor: "text-teal-600",
      gradient: "from-teal-500/10 to-teal-600/20",
      featured: false,
    },
    {
      icon: Zap,
      title: t('perks.blazingPreview.title'),
      desc: t('perks.blazingPreview.description'),
      size: "normal",
      iconBg: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      gradient: "from-orange-500/10 to-orange-600/20",
      featured: false,
    },
    {
      icon: Cpu,
      title: t('perks.optimizedPro.title'),
      desc: t('perks.optimizedPro.description'),
      size: "normal",
      iconBg: "from-cyan-50 to-cyan-100",
      iconColor: "text-cyan-600",
      gradient: "from-cyan-500/10 to-cyan-600/20",
      featured: true,
    },
  ];


  return (
    <section
      id="features"
      className="relative bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-24 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-green-100 to-blue-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Title with SplitText */}
          <div className="mb-6">
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mx-auto"
            >
              {t('title')}
            </h2>
          </div>

          {/* Description */}
          <p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto] lg:auto-rows-min">
          {perks.map((perk, index) => (
            <div
              key={index}
              className={`
                group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl
                border border-gray-100/50 hover:border-primary-200 overflow-hidden
                transition-all duration-500 hover:-translate-y-2
                ${perk.size === "large" ? "lg:col-span-2 lg:row-span-2" : ""}
              `}
            >
              {/* Background glow */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${perk.gradient} opacity-0 rounded-3xl blur-xl scale-110`}
              ></div>

              {/* Featured badge */}
              {perk.featured && (
                <div
                  className="absolute top-4 right-4 z-10"
                >
                  <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full text-xs font-bold text-white">
                    <Star className="h-3 w-3" fill="currentColor" />
                    <span>{t('badges.popular')}</span>
                  </div>
                </div>
              )}

              {perk.gifPath && perk.size === "large" ? (
                <div className="relative flex flex-col h-full">
                  {/* Image section - Much taller for better GIF visibility */}
                  <div className="relative h-64 lg:h-96 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                      src={perk.gifPath}
                      alt={perk.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
                    
                    {/* Floating icon */}
                    <div 
                      className="absolute top-4 left-4"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${perk.iconBg} shadow-lg backdrop-blur-sm`}>
                        <perk.icon className={`w-6 h-6 ${perk.iconColor}`} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content section - Reduced padding to give more space to GIF */}
                  <div className="p-6 flex-1 flex flex-col relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {perk.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 flex-1 text-sm">{perk.desc}</p>
                    
                    {perk.comingSoon && (
                      <div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                          <Sparkles className="h-3 w-3" />
                          {t('badges.comingSoon')}
                        </span>
                      </div>
                    )}
                    
                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <ArrowUpRight className="h-5 w-5 text-primary-500" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${perk.iconBg} group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                      <perk.icon className={`w-8 h-8 ${perk.iconColor}`} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {perk.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 flex-1">{perk.desc}</p>
                  
                  {perk.comingSoon && (
                    <div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                        <Sparkles className="h-3 w-3" />
                        {t('badges.comingSoon')}
                      </span>
                    </div>
                  )}
                  
                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                    <ArrowUpRight className="h-5 w-5 text-primary-500" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200/50">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">{t('lovedBy')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerksGrid;
