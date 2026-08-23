import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

const BLUE = "var(--color-brand-blue)";
const YELLOW = "var(--color-brand-yellow)";
const MINT = "var(--color-brand-mint)";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Glitch Detectives" },
      {
        name: "description",
        content:
          "Get in touch with Glitch Detectives. Ask about partnerships, school licences, or feedback on our reasoning-first K-6 maths tools.",
      },
      { property: "og:title", content: "Contact — Glitch Detectives" },
      {
        property: "og:description",
        content:
          "Questions, partnerships, or school enquiries? Contact the Glitch Detectives team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden dots-bg"
          style={{ backgroundColor: BLUE, color: "white" }}
        >
          <div
            className="pointer-events-none absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-30"
            style={{ background: MINT }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-25"
            style={{ background: YELLOW }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center">
            <span className="label-eyebrow" style={{ color: YELLOW }}>
              Contact
            </span>
            <h1 className="heading-black text-4xl sm:text-5xl lg:text-6xl uppercase mt-4">
              Let's talk
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-3xl mx-auto">
              Have a question about the platform, want to explore a school licence, or interested in
              partnering? Send us a message and we'll get back to you.
            </p>
          </div>
        </section>

        {/* Form + Info */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="heading-black uppercase text-3xl sm:text-4xl text-[var(--color-brand-blue)]">
                  Get in touch
                </h2>

                <div className="mt-10 space-y-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: MINT }}
                    >
                      <Mail className="w-5 h-5 text-[var(--color-brand-blue)]" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-[var(--color-brand-blue)] text-sm tracking-wide">
                        Email us
                      </h3>
                      <a
                        href="mailto:hello@glitchdetectives.com"
                        className="text-[var(--color-brand-blue)]/80 hover:text-[var(--color-brand-blue)] transition-colors"
                      >
                        hello@glitchdetectives.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: YELLOW }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-[var(--color-brand-blue)]"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-[var(--color-brand-blue)] text-sm tracking-wide">
                        Facebook
                      </h3>
                      <a
                        href="https://www.facebook.com/profile.php?id=61580385755702"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--color-brand-blue)]/80 hover:text-[var(--color-brand-blue)] transition-colors"
                      >
                        Visit our page
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-bg-light)] rounded-3xl p-6 sm:p-8 border border-black/5">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center text-center h-full min-h-[360px]">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="heading-black uppercase text-2xl text-[var(--color-brand-blue)]">
                      Message sent
                    </h3>
                    <p className="mt-2 text-[var(--color-brand-blue)]/70 max-w-sm">
                      Thanks for reaching out. We’ll reply as soon as we can.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-bold uppercase tracking-wide text-[var(--color-brand-blue)] mb-2"
                      >
                        I am a
                      </label>
                      <select
                        id="role"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[var(--color-brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-yellow)]"
                      >
                        <option value="">Select your role</option>
                        <option value="parent">Parent</option>
                        <option value="teacher">Teacher</option>
                        <option value="school">School Administrator</option>
                        <option value="partner">Partner / Investor</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-bold uppercase tracking-wide text-[var(--color-brand-blue)] mb-2"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[var(--color-brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-yellow)]"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-bold uppercase tracking-wide text-[var(--color-brand-blue)] mb-2"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[var(--color-brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-yellow)]"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-bold uppercase tracking-wide text-[var(--color-brand-blue)] mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[var(--color-brand-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-yellow)]"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-4 rounded-full font-bold uppercase tracking-wider text-sm inline-flex items-center justify-center gap-2 bg-[var(--color-brand-yellow)] text-[var(--color-brand-blue)] hover:scale-105 transition-transform"
                    >
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                    <p className="text-xs text-[var(--color-brand-blue)]/60 text-center">
                      This is a front-end demo form. In production, messages are sent to your team
                      inbox.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
