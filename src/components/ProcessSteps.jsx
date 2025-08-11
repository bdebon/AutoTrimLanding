import React from 'react';

const ProcessSteps = () => {
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

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How to Automatically Trim Video Silences in Seconds
          </h2>
          <p className="text-xl text-gray-600">
            From raw clips to a clean timeline — here's how AutoTrim works
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step content */}
              <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg max-w-[960px] mx-auto">
                {/* GIF */}
                <div className="aspect-video bg-gray-100">
                  <img 
                    src={step.gif} 
                    alt={step.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Text content */}
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full font-bold text-lg">
                      {step.number}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Step {step.number} – {step.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-gray-300 to-transparent -bottom-16"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;