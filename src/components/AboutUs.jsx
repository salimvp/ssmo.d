import React, { useState, useEffect, useRef } from 'react';
import { Quote, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import Button from './ui/Button';

export default function AboutUs({ settings = {} }) {
  const [activeLeaderTab, setActiveLeaderTab] = useState('principal'); // 'principal' | 'manager'
  const [founderExpanded, setFounderExpanded] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // No auto-switching — user clicks tabs to change
  }, []);

  const founder = {
    name: settings.founder_name || 'MK Hajee',
    designation: settings.founder_designation || 'Founder General Secretary, Tirurangadi Muslim Orphanage Committee (1943-1983)',
    image: settings.founder_image || '/founder.jpeg',
    short_bio: settings.founder_short_bio || 'MK Hajee had been inalienably associated with every humanitarian concern of the underprivileged sections of society across Malabar, especially Tirurangadi, till his death in 1983. Being brought up as an orphan, he was aware of the sufferings and hardship of the destitute. Malabar Muslim Association had its genesis from his deep intellectual engagement with the freedom struggle and the life of trials and tribulations he had in Madras.',
    full_bio: settings.founder_full_bio || 'MK Hajee had been inalienably associated with every humanitarian concerns of the underprivileged sections of society across Malabar especially of Tirurangadi till his death in 1983. Being brought up as an orphan, he was aware of the sufferings and hardship of the destitute. Malabar Muslim Association had its genesis from his deep intellectual engagement with freedom struggle and the life of trials and tribulations he had in Madras. The idea of an orphanage which he founded as part of the humanistic and reform activities in collaboration with KM Moulavi, germinated from the establishment of Noorul Islam Madrassa. It is worth mentioning that he had the unique generosity to transform his own house into an orphanage in 1943 which later became Tirurangadi Muslim Orphanage. Thereafter he founded a series of educational and charitable institutions at Tirurangadi. PSMO College is one of the feeder organizations among a host of other institutions under this Orphanage committee. MK Hajee, therefore is a pioneer in the renaissance of Kerala Muslims by being an architect of this college which has educational and cultural insurgence in Kerala.\n\nFounder General Secretary of Tirurangadi Muslim Orphanage Committee (1943-1983)\nGeneral Secretary SSMOITE Managing Committee (1961-1983)',
    additional_credentials: settings.founder_additional_credentials || 'General Secretary SSMOITE Managing Committee (1961-1983)'
  };

  const principal = {
    name: settings.principal_name || 'Shanavas Paravannur',
    designation: settings.principal_designation || 'Principal, SSMO ITE Tirurangadi',
    image: settings.principal_image || '/principal.jpeg',
    message: settings.principal_message || 'Welcome to SSMO Institute of Teacher Education. For six decades, we have prepared educators who not only excel in primary pedagogy but also nurture the moral compass of the next generation. Our teacher trainees graduate with rigorous instructional practice, child psychology mastery, and a profound sense of social duty.'
  };

  const manager = {
    name: settings.manager_name || 'MK Bava Sahib',
    designation: settings.manager_designation || 'Manager, Tirurangadi Muslim Orphanage Committee',
    image: settings.manager_image || '/manager.jpeg',
    message: settings.manager_message || 'The founding mission of the Tirurangadi Muslim Orphanage Committee is anchored in empowering society through high-quality, value-based education. ITE remains a jewel in our institutional network, continuing to provide state-of-the-art facilities, dedicated faculty, and student support to ensure excellence in teacher education.'
  };

  const currentLeader = activeLeaderTab === 'principal' ? principal : manager;

  return (
    <section id="about" className="py-24 sm:py-32 bg-canvas-subtle relative border-t border-surface-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Split Layout (Design Principle 31) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Left Column: Dominant Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden shadow-soft-md border border-surface-border bg-surface">
              <img
                src="/our-story.jpg"
                alt="SSMO ITE Campus Sign Board, Saudabad Tirurangadi"
                className="w-full h-[420px] sm:h-[480px] object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-light">
                  Saudabad Campus
                </span>
                <p className="text-sm font-semibold mt-1">
                  Tirurangadi Muslim Orphanage Complex, Kerala
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Story */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="eyebrow mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Our Story & Philosophy
              </span>
              <h2 className="section-title text-ink-primary mt-2">
                Developing empathetic educators with academic rigour and moral purpose.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-prose-editorial">
              <strong className="text-ink-primary font-semibold">Seethi Sahib Memorial Orphanage Institute of Teacher Education (SSMO ITE), Tirurangadi</strong> is dedicated to preparing passionate, knowledgeable, and responsible educators for the future of school education.
            </p>

            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-prose-editorial">
              The institution offers a two-year Diploma in Elementary Education (D.El.Ed.), designed to equip aspiring teachers with the knowledge, skills, values, and practical experience required to effectively teach in Lower Primary and Upper Primary classrooms.
            </p>

            {/* Core Values Summary */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-md bg-surface border border-surface-border">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-ink-primary block font-semibold">NCTE Recognized</strong>
                  <span className="text-ink-muted">Approved 2-year elementary diploma</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button href="#courses" variant="primary" size="md">
                Explore Academic Program
              </Button>
            </div>
          </div>

        </div>

        {/* About the Founder Section */}
        <div id="founder" className="mb-24">
          <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-soft-md">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Founder Portrait — fixed height so expanding text never stretches it */}
              <div className="md:col-span-4 relative">
                <div className="h-[420px] md:h-[440px] relative overflow-hidden bg-dark/10">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-contain object-top filter brightness-95 md:object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>
              </div>

              {/* Founder Content */}
              <div className="md:col-span-8 p-6 sm:p-8 md:p-10 space-y-4">
                <div>
                  <span className="eyebrow mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Our Heritage
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-sans text-ink-primary mt-2">
                    About the Founder
                  </h3>
                  <p className="text-sm font-semibold text-accent mt-1">
                    {founder.name}
                  </p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {founder.designation}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Desktop: always show full bio */}
                  <p className="hidden md:block text-sm sm:text-base text-ink-secondary leading-relaxed">
                    {founder.full_bio}
                  </p>

                  {/* Mobile: toggle between short and full bio */}
                  <p className="block md:hidden text-sm sm:text-base text-ink-secondary leading-relaxed">
                    {founderExpanded ? founder.full_bio : founder.short_bio}
                  </p>

                  {founder.additional_credentials && (
                    <p className="text-xs text-ink-muted italic pt-2 border-t border-surface-border">
                      {founder.additional_credentials}
                    </p>
                  )}
                </div>

                {/* Read More button — mobile only */}
                <button
                  onClick={() => setFounderExpanded(!founderExpanded)}
                  className="md:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-light transition-colors cursor-pointer pt-2"
                >
                  {founderExpanded ? (
                    <>
                      Show Less
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Read More
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Desk Section (Principal & Manager Messages) */}
        <div className="bg-surface rounded-xl border border-surface-border p-6 sm:p-10 shadow-soft-sm">
          
          {/* Header & Toggle Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-accent font-mono">
                Institutional Leadership
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-sans text-ink-primary mt-1">
                Words from Leadership
              </h3>
            </div>

            <div className="flex items-center bg-canvas-subtle p-1 rounded-md border border-surface-border">
              <button
                onClick={() => {
                  clearInterval(intervalRef.current);
                  setActiveLeaderTab('principal');
                }}
                className={`px-4 py-1.5 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
                  activeLeaderTab === 'principal'
                    ? 'bg-accent text-white shadow-soft-sm'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                Principal's Desk
              </button>
              <button
                onClick={() => {
                  clearInterval(intervalRef.current);
                  setActiveLeaderTab('manager');
                }}
                className={`px-4 py-1.5 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
                  activeLeaderTab === 'manager'
                    ? 'bg-accent text-white shadow-soft-sm'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                Manager's Desk
              </button>
            </div>
          </div>

          {/* Leader Card */}
          <div key={activeLeaderTab} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
            
            {/* Leader Portrait */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="relative rounded-lg overflow-hidden border border-surface-border shadow-soft-sm w-44 sm:w-52 h-56 sm:h-64 mb-4">
                <img
                  src={currentLeader.image}
                  alt={currentLeader.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-ink-primary">
                {currentLeader.name}
              </h4>
              <p className="text-xs text-ink-muted mt-0.5">
                {currentLeader.designation}
              </p>
            </div>

            {/* Quote Body */}
            <div className="md:col-span-8 space-y-4">
              <div className="text-accent opacity-30">
                <Quote className="w-10 h-10 rotate-180" />
              </div>

              <blockquote className="text-base sm:text-lg font-serif italic text-ink-secondary leading-relaxed">
                "{currentLeader.message}"
              </blockquote>

              <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs text-ink-muted">
                <span>Institute of Teacher Education, Tirurangadi</span>
                <span className="font-semibold text-accent flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Academic Excellence
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
