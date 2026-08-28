import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Play } from 'lucide-react';

export default function WhySSMO() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 100);
  };
  const narrativePoints = [
    {
      number: '01',
      title: 'Decades of Dedicated Teacher Preparation',
      summary: 'Rooted in a 60-year tradition of pedagogical integrity, our curriculum goes far beyond rote textbook instruction to build true classroom mastery.'
    },
    {
      number: '02',
      title: 'Distinguished Master Educator Faculty',
      summary: 'Mentored by faculties holding advanced B.Ed, M.Ed credentials with deep experience in teaching.'
    },
    {
      number: '03',
      title: 'Expert Classes & TLM Workshops',
      summary: 'Interactive and engaging expert classes and hands on workshops for teaching learning materials.'
    },
    {
      number: '04',
      title: 'Extensive Practical School Internships',
      summary: 'Over 100 days of direct school immersion and micro-teaching practice across top government and aided schools.'
    }
  ];

  return (
    <section id="why-ssmo" className="py-24 sm:py-32 bg-dark relative overflow-hidden text-ink-light border-t border-dark-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="eyebrow-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-light" />
            Why Choose SSMO ITE
          </span>
          <h2 className="section-title text-white">
            An institution engineered specifically for exceptional primary educators.
          </h2>
          <p className="lead-text-dark">
            We don't offer generic degrees. For over six decades, our entire campus, faculty, and resources have been dedicated exclusively to teacher education.
          </p>
          <div className="pt-2">
            <Link
              to="/faculties"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors shadow-dark-sm"
            >
              <Users className="w-4 h-4" />
              Meet Our Faculties and Staff
            </Link>
          </div>
        </div>

        {/* Custom Visual Narrative Grid (Design Principle 34: NOT repetitive 3-box cards!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Numbered Narrative Flow with Thin Architectural Lines */}
          <div className="lg:col-span-7 divide-y divide-dark-border">
            {narrativePoints.map((item) => (
              <div
                key={item.number}
                className="py-7 sm:py-8 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 group"
              >
                {/* Number */}
                <div className="sm:col-span-2 font-mono text-2xl sm:text-3xl font-extrabold text-accent-light opacity-80 group-hover:opacity-100 transition-opacity">
                  {item.number}
                </div>

                {/* Content */}
                <div className="sm:col-span-10 space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold font-sans text-white group-hover:text-accent-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-light-secondary leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Video Thumbnail with Play Overlay */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-xl overflow-hidden border border-dark-border shadow-dark-md bg-dark-surface group cursor-pointer">
              {!isPlaying ? (
                /* Thumbnail with Play Button */
                <div onClick={handlePlay} className="relative w-full h-80 sm:h-96">
                  <img
                    src="/video-thumbnail.jpg"
                    alt="SSMO ITE Campus Video"
                    className="w-full h-full object-cover filter brightness-50 group-hover:brightness-60 transition-all duration-300"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-dark/50" />
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </div>
                  {/* Bottom Label */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-light">
                      Campus Documentary
                    </span>
                    <p className="text-xs text-ink-light-secondary mt-0.5">
                      Click to play video
                    </p>
                  </div>
                </div>
              ) : (
                /* Video Player */
                <video
                  ref={videoRef}
                  src="https://dnrfscucvxkibcswoekr.supabase.co/storage/v1/object/public/ssmo-assets/videos/why-ssmo-video.mp4"
                  controls
                  playsInline
                  className="w-full h-80 sm:h-96 object-cover"
                />
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
