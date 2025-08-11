import React from 'react';
import { Clock, Zap, FileText, Hourglass, Timer, Check, XCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const TimeComparison = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Clock,
      value: '96%',
      label: 'Time Saved',
      description: 'On average, editors save 46 minutes per 30-minute raw video',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
    },
    {
      icon: Zap,
      value: '29×',
      label: 'Faster Than Manual Editing',
      description: 'AutoTrim processes 4 files in parallel thanks to native Rust code',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
    },
    {
      icon: FileText,
      value: '1',
      label: 'XML Timeline',
      description: 'Forget the multi-XML mess. One clean export, every time.',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            The Numbers Speak for Themselves
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.bgGradient} mb-4`}>
                  <stat.icon className="h-8 w-8 text-gray-700" strokeWidth={2} />
                </div>
                
                <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {stat.label}
                </h3>
                
                <p className="text-sm text-gray-600">
                  → {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table - Simplified */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why it's better than other tools
          </h3>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600"></th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Manual</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Other Tools</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-primary-50">AutoTrim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-700">Processing time</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center gap-2">
                      <Hourglass className="w-4 h-4 text-gray-600" />
                      <span>48 min</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center gap-2">
                      <Timer className="w-4 h-4 text-gray-600" />
                      <span>~20 min</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center bg-primary-50 font-semibold">
                    <span className="inline-flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-primary-600" />
                      <span>1m 40s</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-700">Timeline Output</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>Many files</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>Puzzle</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center bg-primary-50 font-semibold">
                    <span className="inline-flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>One XML</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-700">Privacy</td>
                  <td className="px-6 py-4 text-center">
                    <Check className="w-4 h-4 inline-block text-green-600" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>Often Cloud</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center bg-primary-50 font-semibold">
                    <span className="inline-flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>100% Local</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeComparison;