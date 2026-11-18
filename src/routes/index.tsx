import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  Lightbulb,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import heroImage from "@/assets/landing/print-realworld.jpg";

const principles = [
  {
    title: "Look closely",
    description: "Start with what you notice. Small details can be important clues.",
    icon: Search,
  },
  {
    title: "Question the answer",
    description: "A confident answer still deserves a careful check.",
    icon: Shield,
  },
  {
    title: "Explain your thinking",
    description: "Show how you know, not only what you think the answer is.",
    icon: Brain,
  },
];

const learningSteps = [
  {
    number: "01",
    title: "Investigate",
    description: "Look carefully at the problem, model, or answer.",
    icon: Search,
  },
  {
    number: "02",
    title: "Detect",
    description: "Find the part that doesn’t fit and ask what might be wrong.",
    icon: Shield,
  },
  {
    number: "03",
    title: "Repair",
    description: "Try a correction and see whether it resolves the glitch.",
    icon: Lightbulb,
  },
  {
    number: "04",
    title: "Explain",
    description: "Share your reasoning so someone else can follow your thinking.",
    icon: Sparkles,
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="home-label">{children}</span>;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Glitch Detectives — Reasoning-First Maths for K-6" },
      {
        name: "description",
        content:
          "A playful, reasoning-first maths experience that helps children investigate mistakes, question answers, and explain their thinking.",
      },
      { property: "og:title", content: "Glitch Detectives — Reasoning-First Maths for K-6" },
      {
        property: "og:description",
        content:
          "Don't just solve. Investigate. Help children question answers, spot mistakes, and explain their thinking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="home-page">
      <section className="home-dark brand-blue-dots home-hero">
        <div className="home-container home-hero-grid">
          <div className="home-hero-copy">
            <SectionLabel>Maths for curious minds</SectionLabel>
            <h1 className="home-display">
              Don’t just accept the answer.
              <span>Investigate it.</span>
            </h1>
            <p className="home-lead">
              Glitch Detectives helps children look closely, spot mistakes, and explain their
              thinking. Because learning maths is about more than getting to an answer—it’s about
              understanding why it makes sense.
            </p>
            <div className="home-actions">
              <Link to="/play" className="home-button home-button-yellow">
                Explore Missions <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/printables" className="home-button home-button-outline">
                <FileText aria-hidden="true" /> Explore Printables
              </Link>
            </div>
            <ul className="home-trust-list">
              {["Reasoning before speed", "Mistakes are clues", "Made for curious learners"].map(
                (item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden="true" /> {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="home-hero-visual">
            <div className="home-image-frame">
              <img
                src={heroImage}
                alt="A child investigating a hands-on activity at a kitchen table"
                width={768}
                height={768}
                fetchPriority="high"
              />
              <div className="home-image-caption">
                <span className="home-caption-icon">
                  <Search aria-hidden="true" />
                </span>
                <span>
                  <strong>Every answer has a story.</strong>
                  <small>Let’s investigate.</small>
                </span>
              </div>
            </div>
            <span className="home-image-note">Curiosity is the first clue</span>
          </div>
        </div>
      </section>

      <section className="home-cream home-intro">
        <div className="home-container home-narrow home-centered">
          <SectionLabel>The answer is only the beginning</SectionLabel>
          <h2 className="home-heading">
            Instant answers are not learning.
            <br />
            <span>Understanding is.</span>
          </h2>
          <p className="home-body">
            Children deserve more than a right-or-wrong tick. They need space to notice, ask
            questions, test an idea, and explain why it works. Glitch Detectives turns maths into a
            series of small investigations—with a clear place to start and a reason to keep
            thinking.
          </p>

          <div className="home-example">
            <div className="home-example-top">
              <span className="home-example-mark">GD</span>
              <span className="home-example-title">A better question to ask</span>
              <span className="home-example-tag">Think it through</span>
            </div>
            <p>“How could we check whether this answer makes sense?”</p>
            <div className="home-example-bottom">
              <span>Notice</span>
              <ArrowRight aria-hidden="true" />
              <span>Question</span>
              <ArrowRight aria-hidden="true" />
              <span>Explain</span>
            </div>
          </div>

          <div className="home-principle-grid">
            {principles.map(({ title, description, icon: Icon }) => (
              <article className="home-principle-card" key={title}>
                <span className="home-card-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-dark brand-blue-dots home-loop">
        <div className="home-container">
          <div className="home-callout">
            <SectionLabel>Our approach</SectionLabel>
            <h2 className="home-heading">
              Maths is more than
              <br />
              finding the answer.
            </h2>
            <p>
              Children build confidence when they can see where to begin, make sense of an idea, and
              share how they reached it. Every investigation gives their thinking a chance to grow.
            </p>
            <Link to="/about" className="home-text-link">
              Learn about our approach <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="home-section-heading home-centered">
            <SectionLabel>A simple learning loop</SectionLabel>
            <h2 className="home-heading">Every glitch has a story. Let’s investigate.</h2>
            <p className="home-body">
              Four clear steps help turn a mistake into a moment for thinking.
            </p>
          </div>

          <div className="home-step-grid">
            {learningSteps.map(({ number, title, description, icon: Icon }) => (
              <article className="home-step-card" key={number}>
                <div className="home-step-top">
                  <span className="home-card-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="home-step-number">{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <p className="home-loop-footnote">
            <Sparkles aria-hidden="true" /> The goal isn’t speed. It’s understanding.
          </p>
        </div>
      </section>

      <section className="home-cream home-printables">
        <div className="home-container home-printables-grid">
          <div>
            <SectionLabel>Learning beyond the screen</SectionLabel>
            <h2 className="home-heading">Curiosity doesn’t stop at the classroom.</h2>
            <p className="home-body">
              Glitch Detectives includes a Printables area for screen-free learning. It’s another
              way to bring investigation, careful observation, and explanation into a child’s day.
            </p>
            <Link to="/printables" className="home-button home-button-dark">
              Explore Printables <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="home-printables-card">
            <img src={heroImage} alt="" width={768} height={768} loading="lazy" />
            <div>
              <span className="home-card-icon">
                <FileText aria-hidden="true" />
              </span>
              <h3>Screen-free ways to keep thinking</h3>
              <p>Discover the Printables collection.</p>
              <Link to="/printables" className="home-inline-link">
                Visit Printables <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cream home-audiences">
        <div className="home-container">
          <div className="home-section-heading home-centered">
            <SectionLabel>For families and educators</SectionLabel>
            <h2 className="home-heading">What matters is how children think.</h2>
          </div>
          <div className="home-audience-grid">
            <article className="home-audience-card">
              <h3>For families</h3>
              <p>
                Make room for curiosity, conversation, and working through an idea together. The
                focus is on how your child thinks—not how quickly they finish.
              </p>
              <Link to="/play" className="home-inline-link">
                Explore Missions <ArrowRight aria-hidden="true" />
              </Link>
            </article>
            <article className="home-audience-card">
              <h3>For educators</h3>
              <p>
                Invite learners to notice, discuss, and explain mathematical ideas. We’d be glad to
                hear what would help in your classroom or school.
              </p>
              <Link to="/contact" className="home-inline-link">
                Talk to us <ArrowRight aria-hidden="true" />
              </Link>
            </article>
            <article className="home-audience-card">
              <h3>For curious learners</h3>
              <p>
                You don’t have to know everything straight away. Start with what you notice, follow
                the clues, and see where your thinking takes you.
              </p>
              <Link to="/about" className="home-inline-link">
                Discover our approach <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="home-cream home-final">
        <div className="home-container">
          <div className="home-final-card">
            <span className="home-final-icon">
              <Search aria-hidden="true" />
            </span>
            <SectionLabel>Ready when you are</SectionLabel>
            <h2 className="home-heading">
              Let’s help children become
              <br />
              confident mathematical thinkers.
            </h2>
            <p>
              Start with an investigation, explore screen-free learning, or get in touch to learn
              more about Glitch Detectives.
            </p>
            <div className="home-actions home-actions-centered">
              <Link to="/play" className="home-button home-button-yellow">
                Explore Missions <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/contact" className="home-button home-button-light">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
