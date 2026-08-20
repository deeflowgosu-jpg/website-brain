import { useState } from 'react';
import { Send } from 'lucide-react';

const inputCls =
  'w-full border-0 border-b border-gold/20 bg-transparent py-3 font-body text-foreground placeholder:text-muted-foreground/50 transition-colors duration-300 focus:border-gold-bright focus:outline-none';

/**
 * ContactSection — glass-panel contact form. Pair the outer wrapper with
 * class "contact-frame" if using ScrollLine, so the trail draws an
 * animated border around it once scrolled into view.
 *
 * `onSubmit` receives the native form submit event — wire up your own
 * fetch/email/API call.
 */
export default function ContactSection({ id = 'contact', onSubmit, onSuccessMessage = 'Message sent.' }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      if (onSubmit) await onSubmit(e);
      setSent(true);
      e.target.reset();
    } finally {
      setSending(false);
    }
  };

  return (
    <section id={id} className="relative z-10 mx-auto max-w-2xl px-6 pb-32 sm:px-10">
      <div className="contact-frame relative">
        <form
          onSubmit={handleSubmit}
          className="relative m-2 rounded-sm border border-gold/15 bg-black/55 p-8 backdrop-blur-xl sm:p-10"
        >
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold/80">Contact</p>
          <h2
            className="mt-3 font-display text-3xl font-light text-foreground sm:text-4xl"
            style={{ textShadow: '0 0 32px rgba(212,175,55,0.15)' }}
          >
            Get in touch
          </h2>
          <div className="mt-6 h-px w-16 bg-gradient-to-r from-gold-bright to-transparent" />

          <div className="mt-9 space-y-7">
            <div>
              <label className="font-body text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Name</label>
              <input required name="name" type="text" placeholder="Your name" className={inputCls} />
            </div>
            <div>
              <label className="font-body text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Email</label>
              <input required name="email" type="email" placeholder="you@email.com" className={inputCls} />
            </div>
            <div>
              <label className="font-body text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Message</label>
              <textarea required name="message" rows={4} placeholder="Write a few lines…" className={`${inputCls} resize-none`} />
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="gloss-btn group mt-9 flex items-center justify-center gap-3 rounded-md border border-gold/40 bg-gold/5 px-7 py-3 transition-colors duration-300 hover:bg-gold/10 disabled:opacity-60"
          >
            <span className="relative z-[2] font-body text-sm tracking-[0.2em] text-gold-bright">
              {sending ? 'Sending…' : sent ? onSuccessMessage : 'Send message'}
            </span>
            <Send className="relative z-[2] h-4 w-4 text-gold-bright transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </section>
  );
}
