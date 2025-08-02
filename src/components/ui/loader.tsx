import { type FunctionComponent, useState, useEffect } from "react";

const Loader: FunctionComponent = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Logo section */}
      <div className="mb-12 text-center">
        <div className="relative">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">
            CSI NMAMIT
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
        </div>
        <p className="text-slate-600 mt-4 font-medium">Computer Society of India</p>
      </div>

      {/* Advanced loader animation */}
      <div className="relative mb-8">
        {/* Outer rotating ring with gradient */}
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-0.5 animate-spin">
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-full"></div>
          </div>
        </div>
        
        {/* Inner pulsing elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse shadow-lg shadow-blue-500/30"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 0',
              animation: `orbit 2s linear infinite`,
              animationDelay: `${i * 0.66}s`,
              transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-35px)`
            }}
          />
        ))}
      </div>

      {/* Loading text with animation */}
      <div className="text-center space-y-4">
        <p className="text-slate-700 font-medium text-lg">
          Loading{dots}
        </p>
        
        {/* Subtle progress indicator */}
        <div className="flex space-x-1 justify-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce opacity-60"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.2s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #3B82F6 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <style jsx>{`
        @keyframes orbit {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateY(-35px) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateY(-35px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;