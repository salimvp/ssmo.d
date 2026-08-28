import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Train,
  Plane,
  Bus,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const YoutubeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
import { api } from '../services/api';
import Button from './ui/Button';

export default function ContactLocation({ settings = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Query',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const mapEmbedUrl =
    settings.google_map_embed ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15668.60155252877!2d75.9220002!3d11.0270002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64e43b18c6449%3A0xa64b3dfba5b0f47e!2sTirurangadi%20Muslim%20Orphanage%2C%20Saudabad%2C%20Tirurangadi%2C%20Kerala%20676306!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      await api.submitInquiry(formData);
      setStatus({ loading: false, success: true, error: '' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Query',
        message: ''
      });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message || 'Failed to submit inquiry' });
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-dark relative overflow-hidden text-ink-light border-t border-dark-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (VISIT US - Design Principle 38) */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="eyebrow-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-light" />
            Visit & Connect
          </span>
          <h2 className="section-title text-white">
            Campus Location & Contact
          </h2>
          <p className="lead-text-dark">
            Located in the historic town of Tirurangadi, within the serene Saudabad educational complex.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="https://www.facebook.com/p/S-S-M-O-I-T-E-100067328807421/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] hover:text-[#4299E1] transition-colors">
              <FacebookIcon />
            </a>
            <a href="https://www.instagram.com/ssmo_ite_tirurangadi?igsi=dmtlZ2piOTM0Mnlm" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-[#E4405F]/10 hover:bg-[#E4405F]/20 text-[#E4405F] hover:text-[#F77737] transition-colors">
              <InstagramIcon />
            </a>
            <a href="https://youtube.com/@ssmoitevoice5882?si=OOGYIwim1u-5bp0M" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000] hover:text-[#FF4444] transition-colors">
              <YoutubeIcon />
            </a>
          </div>
        </div>

        {/* 2-Column Story Layout: Large Address + Transit on Left, Inquiry Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          
          {/* Left Column: Architectural Address & Transit Guide */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Prominent Address Card */}
            <div className="p-8 rounded-xl bg-dark-surface border border-dark-border space-y-4">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-light">
                Official Campus Address
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-sans text-white leading-snug">
                {settings.contact_address || 'Saudabad, Tirurangadi, Malappuram District, Kerala - 676306, India'}
              </h3>
              
              <div className="pt-4 border-t border-dark-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-ink-light-muted block">Direct Helpline</span>
                  <span className="font-mono text-white font-medium">
                    {settings.contact_phone || '+91 494 2460300'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-ink-light-muted block">Official Email</span>
                  <span className="text-accent-light font-medium truncate block">
                    {settings.contact_email || 'ssmottitirurangadi@gmail.com'}
                  </span>
                </div>
              </div>
            </div>

            {/* Transit Route Information */}
            <div className="p-6 rounded-xl bg-dark-surface/60 border border-dark-border space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-ink-light-secondary">
                Transit & Accessibility
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-md bg-dark border border-dark-border space-y-1">
                  <Train className="w-4 h-4 text-accent-light" />
                  <div className="text-xs font-bold text-white">Railway</div>
                  <div className="text-[11px] text-ink-light-muted">Parappanangadi (7 km)</div>
                </div>

                <div className="p-3 rounded-md bg-dark border border-dark-border space-y-1">
                  <Plane className="w-4 h-4 text-gold-dark" />
                  <div className="text-xs font-bold text-white">Airport</div>
                  <div className="text-[11px] text-ink-light-muted">Calicut (CCJ) (14 km)</div>
                </div>

                <div className="p-3 rounded-md bg-dark border border-dark-border space-y-1">
                  <Bus className="w-4 h-4 text-accent-light" />
                  <div className="text-xs font-bold text-white">Bus Stop</div>
                  <div className="text-[11px] text-ink-light-muted">Saudabad Junction</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Form Controls (Design Principle 46) */}
          <div className="lg:col-span-6 bg-dark-surface rounded-xl border border-dark-border p-6 sm:p-8 shadow-dark-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold font-sans text-white">
                Send an Office Inquiry
              </h3>
              <p className="text-xs text-ink-light-muted mt-1">
                Submissions are sent directly to the administrative desk at ITE.
              </p>
            </div>

            {status.success && (
              <div className="p-4 rounded-md bg-accent/15 border border-accent/30 text-accent-light text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you. Your inquiry has been logged successfully.</span>
              </div>
            )}

            {status.error && (
              <div className="p-4 rounded-md bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{status.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invisible Honeypot field for bot spam prevention */}
              <input
                type="text"
                name="_gotcha"
                value={formData._gotcha || ''}
                onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-light-secondary mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mohammed Farooq"
                    className="w-full px-3.5 py-2.5 rounded-md bg-dark border border-dark-border text-white text-xs placeholder-ink-light-muted focus:outline-none focus:border-accent-light focus:ring-1 focus:ring-accent-light transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-light-secondary mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-md bg-dark border border-dark-border text-white text-xs placeholder-ink-light-muted focus:outline-none focus:border-accent-light focus:ring-1 focus:ring-accent-light transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-light-secondary mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 ..."
                    className="w-full px-3.5 py-2.5 rounded-md bg-dark border border-dark-border text-white text-xs placeholder-ink-light-muted focus:outline-none focus:border-accent-light focus:ring-1 focus:ring-accent-light transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-light-secondary mb-1.5">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-dark border border-dark-border text-white text-xs focus:outline-none focus:border-accent-light transition-colors"
                  >

                    <option value="Verification & Transcripts">Verification & Transcripts</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-light-secondary mb-1.5">
                  Message / Academic Background *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Specify your inquiry or +2 marks details..."
                  className="w-full px-3.5 py-2.5 rounded-md bg-dark border border-dark-border text-white text-xs placeholder-ink-light-muted focus:outline-none focus:border-accent-light focus:ring-1 focus:ring-accent-light transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="darkPrimary"
                size="md"
                className="w-full"
                loading={status.loading}
                iconComponent={Send}
              >
                Submit Message
              </Button>
            </form>
          </div>

        </div>

        {/* Clean Interactive Map Embed */}
        <div className="rounded-xl overflow-hidden border border-dark-border bg-dark-surface">
          <div className="px-6 py-3.5 border-b border-dark-border flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-light" />
              Tirurangadi Muslim Orphanage Saudabad Campus Map
            </span>
            <a
              href="https://maps.google.com/?q=Tirurangadi+Muslim+Orphanage+Saudabad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-light hover:underline flex items-center gap-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Campus Map"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
