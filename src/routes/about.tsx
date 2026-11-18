import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Heart,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Quote,
  Search,
  Shield,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import zedRobot from "@/assets/landing/hero-robot.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Glitch Detectives" },
      {
        name: "description",
        content:
          "Discover the Glitch Detectives approach: help children question answers, investigate mistakes, and explain their thinking in a calm, inclusive learning environment.",
      },
      { property: "og:title", content: "About — Glitch Detectives" },
      {
        property: "og:description",
        content:
          "We help children question answers, investigate mistakes, and explain their thinking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const steps = [
    {
      number: "01",
      tag: "Observation mode",
      title: "Investigate",
      description: "Read the answer carefully. Look at the shapes, numbers, and clues.",
      icon: Search,
    },
    {
      number: "02",
      tag: "Glitch detection",
      title: "Detect",
      description: "Spot the glitch. Where exactly did the reasoning go wrong?",
      icon: Zap,
    },
    {
      number: "03",
      tag: "Build a fix",
      title: "Repair",
      description: "Try a correction. What would make the model or answer work?",
      icon: Wrench,
    },
    {
      number: "04",
      tag: "Evidence zone",
      title: "Explain",
      description: "Teach the AI why. Your reasoning is the important part.",
      icon: Lightbulb,
    },
  ];

  const challenges = [
    {
      tag: "Learning gap",
      title: "Memorisation without understanding",
      description: "Children may learn the steps without knowing why they work.",
      icon: Brain,
    },
    {
      tag: "AI literacy",
      title: "Blind trust in AI-generated answers",
      description:
        "AI can sound certain and still be wrong. Children need practice checking, not just accepting.",
      icon: Shield,
    },
    {
      tag: "Getting started",
      title: "Blank-page anxiety and fear of mistakes",
      description:
        "A clear starting point helps learners begin. Mistakes can be clues, not failures.",
      icon: AlertTriangle,
    },
  ];

  const roleReversal = [
    {
      title: "Teaching strengthens",
      description:
        "When children explain an idea to the AI, they have to organise their own thinking.",
      icon: Lightbulb,
    },
    {
      title: "Explanation reveals",
      description: "Reasoning aloud can surface questions and misconceptions adults can support.",
      icon: MessageSquare,
    },
    {
      title: "Question outputs",
      description: "Children practise challenging confident-sounding answers—including AI’s.",
      icon: Search,
    },
  ];

  const learnerSupports = [
    {
      title: "Low-pressure learning",
      description: "Thinking takes the time it takes. Curiosity matters more than speed.",
      icon: Heart,
    },
    {
      title: "Clear starting points",
      description: "A clear prompt helps learners know where to begin.",
      icon: CheckCircle2,
    },
    {
      title: "Room to reason",
      description: "Children are encouraged to explore ideas and explain how they see them.",
      icon: MessageCircle,
    },
  ];

  const testimonials = [
    {
      name: "Maya R.",
      role: "Parent of a Grade 1 learner",
      quote:
        "She actually wants to explain her thinking now. It's like the experience gave her permission to be slow and curious.",
    },
    {
      name: "Daniel K.",
      role: "Homeschool Dad",
      quote:
        "The role-reversal moment — when my son teaches the robot — is where I've seen the biggest breakthroughs.",
    },
    {
      name: "Priya S.",
      role: "Math Tutor",
      quote:
        "Finally a platform that doesn't reward speed. My neurodivergent students feel safe making mistakes here.",
    },
  ];

  return (
    <main className="about-page">
      <section className="brand-blue-dots about-hero">
        <div className="about-container about-hero-grid">
          <div className="about-hero-copy">
            <span className="about-kicker">About Glitch Detectives · Mission in progress</span>
            <span className="about-eyebrow">Our mission</span>
            <h1 className="about-display">
              Raise children who
              <span>question answers.</span>
            </h1>
            <p className="about-hero-description">
              In a world where AI can generate answers instantly, the most valuable skill is knowing
              how to evaluate, verify, and reason. Glitch Detectives exists to build that skill—one
              mission at a time.
            </p>
            <Link to="/products" className="about-button about-button-yellow">
              <Search aria-hidden="true" /> View Products
            </Link>
            <div className="about-hero-badges">
              <div>
                <span className="about-badge-icon">
                  <Brain aria-hidden="true" />
                </span>
                <span>
                  <strong>Socially AI</strong>
                  <small>Reasoning before answers</small>
                </span>
              </div>
              <div>
                <span className="about-badge-icon about-badge-dark">
                  <Shield aria-hidden="true" />
                </span>
                <span>
                  <strong>Evidence first</strong>
                  <small>Check, question, explain</small>
                </span>
              </div>
            </div>
          </div>

          <div className="about-case-window" aria-label="Meet ZED-4, the detective robot">
            <div className="about-case-topbar">
              <span className="about-case-mark">
                <Search aria-hidden="true" />
              </span>
              <span>
                <small>Case file: ZED-4</small>
                <strong>The detective crew</strong>
              </span>
              <span className="about-active-pill">Active case</span>
            </div>
            <div className="about-case-art">
              <div className="about-case-art-label">
                <span className="about-status-dot" /> Investigation in progress
              </div>
              <img src={zedRobot} alt="ZED-4, the Glitch Detectives robot detective" />
              <span className="about-case-stamp">Question everything</span>
            </div>
            <div className="about-case-footer">
              <span>Glitch Detectives</span>
              <span>
                Clues found: <strong>∞</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-loop about-light-section">
        <div className="about-container">
          <header className="about-section-heading about-left-heading">
            <span className="about-light-kicker">The 4-step inquiry</span>
            <h2>The loop: How Glitch Detectives works</h2>
            <p>Four calm, repeatable steps that turn every mistake into a thinking moment.</p>
          </header>
          <div className="about-step-grid">
            {steps.map(({ number, tag, title, description, icon: Icon }, index) => (
              <article
                className={`about-step-card${index === steps.length - 1 ? " about-step-featured" : ""}`}
                key={number}
              >
                <div className="about-step-card-top">
                  <span className="about-step-number">{number}</span>
                  <span className="about-step-tag">{tag}</span>
                </div>
                <span className="about-mini-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="about-step-note">
                  <CheckCircle2 aria-hidden="true" />
                  {
                    [
                      "Careful observation",
                      "Find the anomaly",
                      "Hands-on resolution",
                      "Cognitive mastery",
                    ][index]
                  }
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-challenge about-pale-section">
        <div className="about-container about-challenge-grid">
          <div className="about-challenge-copy">
            <span className="about-light-kicker">Why it matters</span>
            <h2>Instant answers are not learning.</h2>
            <p>
              Getting the right answer is great, but knowing why it’s right—and when a
              confident-looking answer is actually wrong—is even better. Children need to practise
              spotting mistakes, fixing them, and explaining why an answer makes sense.
            </p>
            <blockquote className="about-quote-card">
              <Quote aria-hidden="true" />
              <p>
                “The child who can explain <strong>why</strong> an answer is wrong, including a
                wrong answer from a robot, learns ten times more than the child who only finds the
                right one.”
              </p>
              <footer>
                <span>Our learning principle</span>
                <span>Active thinking</span>
              </footer>
            </blockquote>
          </div>
          <div className="about-challenge-list">
            {challenges.map(({ tag, title, description, icon: Icon }, index) => (
              <article className="about-challenge-card" key={title}>
                <span className={`about-mini-icon${index === 1 ? " about-mini-icon-yellow" : ""}`}>
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <span className="about-card-tag">{tag}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-reversal brand-blue-dots">
        <div className="about-container">
          <header className="about-section-heading about-dark-heading">
            <span className="about-dark-kicker">A different role for AI</span>
            <h2>AI role-reversal experiences</h2>
            <p>
              Kids don’t just solve problems. They teach the robot and fix its logic—flipping the
              script on AI-era learning.
            </p>
          </header>
          <div className="about-reversal-art">
            <div className="about-reversal-art-top">
              <span className="about-mini-icon">
                <Sparkles aria-hidden="true" />
              </span>
              <span>Mission briefing: teach the robot</span>
              <span className="about-active-pill">ZED-4 is listening</span>
            </div>
            <img src={zedRobot} alt="" loading="lazy" />
            <p>“Can you show me how you know?”</p>
          </div>
          <div className="about-reversal-grid">
            {roleReversal.map(({ title, description, icon: Icon }) => (
              <article className="about-reversal-card" key={title}>
                <span className="about-mini-icon about-mini-icon-yellow">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="about-card-bottom">
                  <CheckCircle2 aria-hidden="true" /> Learn by explaining
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-inclusive about-light-section">
        <div className="about-container about-inclusive-grid">
          <div className="about-inclusive-copy">
            <span className="about-light-kicker">Inclusive by design</span>
            <span className="about-small-overline">Designed for all minds</span>
            <h2>A little more room to think.</h2>
            <p>
              Children learn in different ways and at different speeds. We aim to make the
              experience clear, calm, and welcoming—so learners can focus on the idea in front of
              them.
            </p>
            <div className="about-support-note">
              <span className="about-mini-icon">
                <Heart aria-hidden="true" />
              </span>
              <p>
                <strong>Zero countdown timers</strong>
                <span>Give children time to think without pressure.</span>
              </p>
            </div>
          </div>
          <div className="about-support-grid">
            {learnerSupports.map(({ title, description, icon: Icon }) => (
              <article className="about-support-card" key={title}>
                <span className="about-small-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-skills about-pale-section">
        <div className="about-container">
          <header className="about-section-heading about-left-heading">
            <span className="about-light-kicker">Beyond the answer</span>
            <h2>Skills that last beyond maths.</h2>
            <p>
              When children practise explaining and checking their thinking, they build habits they
              can use in new situations.
            </p>
          </header>
          <div className="about-skills-grid">
            <article className="about-skills-panel about-skills-panel-dark">
              <div className="about-skills-panel-heading">
                <span className="about-mini-icon about-mini-icon-yellow">
                  <Brain aria-hidden="true" />
                </span>
                <div>
                  <h3>Thinking skills</h3>
                  <span>Core learning</span>
                </div>
              </div>
              <ul>
                {[
                  "Reasoning step by step",
                  "Looking for patterns and clues",
                  "Using mistakes to learn",
                  "Explaining an idea clearly",
                ].map((skill) => (
                  <li key={skill}>
                    <CheckCircle2 aria-hidden="true" /> {skill}
                  </li>
                ))}
              </ul>
              <p className="about-skills-footnote">
                A toolkit for careful, independent problem-solving
              </p>
            </article>
            <article className="about-skills-panel about-skills-panel-light">
              <div className="about-skills-panel-heading">
                <span className="about-small-icon">
                  <Shield aria-hidden="true" />
                </span>
                <div>
                  <h3>Questioning skills</h3>
                  <span>Inquiry mindset</span>
                </div>
              </div>
              <ul>
                {[
                  "Checking whether an answer makes sense",
                  "Asking how a conclusion was reached",
                  "Considering evidence before deciding",
                  "Being willing to rethink an idea",
                ].map((skill) => (
                  <li key={skill}>
                    <CheckCircle2 aria-hidden="true" /> {skill}
                  </li>
                ))}
              </ul>
              <p className="about-skills-footnote">
                Questioning answers is a superpower of thoughtful learners
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-voices about-light-section">
        <div className="about-container">
          <header className="about-section-heading about-centered-heading">
            <span className="about-light-kicker">Voices</span>
            <h2>Trusted by learners</h2>
          </header>
          <div className="about-voices-grid">
            {testimonials.map(({ name, role, quote }) => (
              <article className="about-voice-card" key={name}>
                <div className="about-stars" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <p>“{quote}”</p>
                <div className="about-voice-person">
                  <span>{name[0]}</span>
                  <div>
                    <strong>{name}</strong>
                    <small>{role}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta brand-blue-dots">
        <div className="about-container">
          <div className="about-cta-card">
            <span className="about-cta-icon">
              <Search aria-hidden="true" />
            </span>
            <span className="about-dark-kicker">Your next investigation</span>
            <h2>Ready to see the platform?</h2>
            <p>
              Step into a world where children investigate, repair, and teach their way to
              mathematical understanding.
            </p>
            <div className="about-cta-actions">
              <Link to="/products" className="about-button about-button-yellow">
                <Search aria-hidden="true" /> View Products
              </Link>
              <Link to="/contact" className="about-button about-button-light">
                <MessageCircle aria-hidden="true" /> Contact Us
              </Link>
            </div>
            <small>Thoughtful tools, patient minds, and curious little detectives.</small>
          </div>
        </div>
      </section>
    </main>
  );
}
