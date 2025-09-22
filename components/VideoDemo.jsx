"use client";
import React, { useState } from 'react';
import { Play, X, Film } from 'lucide-react';
import { useTranslations } from 'next-intl';
import OptimizedImage from "./OptimizedImage";

const VideoDemo = () => {
  const t = useTranslations('videoDemo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Configure your Vimeo video ID via env: NEXT_PUBLIC_VIMEO_ID
  const VIMEO_ID = process.env.NEXT_PUBLIC_VIMEO_ID || '';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  return (
    <>
      {/* Demo Section */}
      <div id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-4 flex justify-center">
              <Film className="h-12 w-12 text-white/90" />
            </div>
            <h2 
              className="mx-auto text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              {t('title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('subtitle')}
              <br />
              <span className="font-semibold">{t('watchAction')}</span>
            </p>
          </div>

          {/* Mac-style video frame */}
          <div className="relative max-w-4xl mx-auto">
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
                <OptimizedImage
                  src="/assets/img/demo-thumbnail.jpg"
                  alt={t('thumbnail')}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  loading="lazy"
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="group relative" aria-label={t('playDemo')}>
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
                    <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-full shadow-2xl group-hover:scale-110 transition-transform animate-pulse">
                      <Play className="h-12 w-12 ml-1" fill="currentColor" aria-hidden="true" />
                    </div>
                  </button>
                </div>
                
                {/* Bottom text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent">
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