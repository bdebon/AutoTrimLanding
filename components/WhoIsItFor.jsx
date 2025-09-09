"use client";
import React from "react";
import {
  Youtube,
  Mic,
  GraduationCap,
  Briefcase,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from 'next-intl';

const WhoIsItFor = () => {
  const t = useTranslations('whoIsItFor');

  const personas = [
    {
      icon: Youtube,
      title: t('personas.youtubers.title'),
      description: t('personas.youtubers.description'),
      gradient: "from-red-500 to-red-600",
      iconBg: "from-red-50 to-red-100",
      iconColor: "text-red-600",
      stats: t('personas.youtubers.benefit'),
    },
    {
      icon: Mic,
      title: t('personas.podcasters.title'),
      description: t('personas.podcasters.description'),
      gradient: "from-purple-500 to-purple-600",
      iconBg: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      stats: t('personas.podcasters.benefit'),
    },
    {
      icon: GraduationCap,
      title: t('personas.teachers.title'),
      description: t('personas.teachers.description'),
      gradient: "from-blue-500 to-blue-600",
      iconBg: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      stats: t('personas.teachers.benefit'),
    },
    {
      icon: Briefcase,
      title: t('personas.freelancers.title'),
      description: t('personas.freelancers.description'),
      gradient: "from-green-500 to-green-600",
      iconBg: "from-green-50 to-green-100",
      iconColor: "text-green-600",
      stats: t('personas.freelancers.benefit'),
    },
    {
      icon: Users,
      title: t('personas.teams.title'),
      description: t('personas.teams.description'),
      gradient: "from-orange-500 to-orange-600",
      iconBg: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      stats: t('personas.teams.benefit'),
    },
    {
      icon: Clock,
      title: t('personas.anyCreator.title'),
      description: t('personas.anyCreator.description'),
      gradient: "from-primary-500 to-primary-600",
      iconBg: "from-primary-50 to-primary-100",
      iconColor: "text-primary-600",
      stats: t('personas.anyCreator.benefit'),
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Simple icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg">
              <Users className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mx-auto mb-6">
            {t('title')}
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Stats */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>{t('stats.happyCreators')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{t('stats.hoursSaved')}</span>
            </div>
          </div>
        </div>

        {/* Personas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {personas.map((persona, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl transition-shadow duration-200"
            >
              {/* Background glow */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${persona.gradient} opacity-10 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300`}
              ></div>
              
              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${persona.iconBg} group-hover:scale-105 transition-transform duration-200`}>
                    <persona.icon
                      className={`h-8 w-8 ${persona.iconColor}`}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {persona.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {persona.description}
                  </p>
                </div>

                {/* Stats badge */}
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${persona.gradient} text-white`}>
                    {persona.stats}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
            </div>
            <p className="text-lg text-gray-700 font-medium">
              {t('joinThousands')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;