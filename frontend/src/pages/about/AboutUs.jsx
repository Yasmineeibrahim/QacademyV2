// src/pages/AboutUs.jsx
import React, { useEffect, useRef, useState } from 'react'
import './AboutUs.css'

/* ── tiny hook: triggers when element enters viewport ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ── Section wrapper with fade-in-up animation ── */
const FadeSection = ({ children, delay = 0 }) => {
  const [ref, visible] = useInView()
  const delayClass = {
    0: 'au-fade--d0',
    0.08: 'au-fade--d08',
    0.12: 'au-fade--d12',
    0.15: 'au-fade--d15',
    0.16: 'au-fade--d16',
    0.24: 'au-fade--d24',
  }[delay] || 'au-fade--d0'

  return (
    <div
      ref={ref}
      className={`au-fade ${visible ? 'au-fade--visible' : ''} ${delayClass}`}
    >
      {children}
    </div>
  )
}

/* ── Badge ── */
const Badge = ({ text }) => (
  <span className="au-badge">{text}</span>
)

/* ── Section heading ── */
const SectionHeading = ({ badge, title, subtitle }) => (
  <div className="au-section-heading">
    <Badge text={badge} />
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </div>
)

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const AboutUs = () => {
  return (
    <div className="au-page">

      {/* ── HERO BANNER ── */}
      <div className="au-hero">
        {[300, 500, 700].map((size, i) => (
          <div key={i} className={`au-hero__ring au-hero__ring--${size}`} />
        ))}
        <Badge text="About Us" />
        <h1>
          Who We Are &amp;<br />
          <span>Why We Exist</span>
        </h1>
        <p>
          A team of engineers and educators on a mission to make first-year university
          courses finally click — for every student, everywhere.
        </p>
      </div>

      {/* ── 1. OUR BACKGROUND STORY ── */}
      <section className="au-background">
        <div className="container">
          <FadeSection>
            <SectionHeading
              badge="Our Story"
              title="Our Background"
              subtitle="How a frustrating lecture turned into a platform."
            />
          </FadeSection>

          <div className="au-background__grid">
            {[
              {
                year: '2019',
                title: 'The Problem',
                text: 'A group of Cairo University engineering students struggled through first-year courses with outdated materials and overcrowded lectures. They knew there had to be a better way.',
              },
              {
                year: '2021',
                title: 'The Experiment',
                text: 'A handful of top graduates started recording supplementary explanation videos for their juniors. Within weeks, thousands of students were watching and sharing them.',
              },
              {
                year: '2023',
                title: 'The Platform',
                text: 'What began as a shared Google Drive folder evolved into a structured learning platform — with vetted educators, organised courses, and a growing community of engineers.',
              },
            ].map((item, i) => (
              <FadeSection key={i} delay={i * 0.12}>
                <div className="au-story-card">
                  <div className="au-story-card__year">{item.year}</div>
                  <div className="au-story-card__accent" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. HOW WE STARTED ── */}
      <section className="au-started">
        <div className="container">
          <FadeSection>
            <SectionHeading
              badge="Origins"
              title="How We Started"
              subtitle="From a dorm room conversation to thousands of students."
            />
          </FadeSection>

          <div className="au-started__grid">
            {/* Timeline */}
            <FadeSection>
              <div className="au-timeline">
                {[
                  { step: '01', label: 'The Idea', desc: 'Three engineering graduates decided to record the explanations they wish they had received as students.' },
                  { step: '02', label: 'First Educators', desc: 'They recruited five more specialists — each an expert in a core first-year subject.' },
                  { step: '03', label: 'Community Grows', desc: 'Students shared the videos organically. 500 viewers became 5,000 in under three months.' },
                  { step: '04', label: 'Platform Launch', desc: 'With proper structure, enrollment, and feedback loops, the platform officially launched.' },
                ].map((item, i, arr) => (
                  <div key={i} className="au-timeline__item">
                    {i < arr.length - 1 && <div className="au-timeline__line" />}
                    <div className="au-timeline__circle">{item.step}</div>
                    <div className="au-timeline__content">
                      <p>{item.label}</p>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeSection>

            {/* Stats block */}
            <FadeSection delay={0.15}>
              <div className="au-stats">
                <div className="au-stats__ring" />
                {[
                  { value: '6+', label: 'Expert Educators' },
                  { value: '5,500+', label: 'Students Enrolled' },
                  { value: '16+', label: 'Courses Available' },
                  { value: '4.8★', label: 'Average Rating' },
                ].map((stat, i) => (
                  <div key={i} className="au-stat">
                    <p className="au-stat__value">{stat.value}</p>
                    <p className="au-stat__label">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ── 3. VISION & MISSION ── */}
      <section className="au-vision-mission">
        <div className="container">
          <FadeSection>
            <SectionHeading
              badge="Direction"
              title="Our Vision & Mission"
            />
          </FadeSection>

          <div className="au-vision-mission__grid">
            {/* Vision */}
            <FadeSection delay={0}>
              <div className="au-vision-card">
                <div className="au-vision-card__ring" />
                <div className="au-vision-card__emoji">🔭</div>
                <Badge text="Vision" />
                <h3>A world where no engineering student is left behind.</h3>
                <p>
                  We envision a future where every engineering student — regardless of their
                  university, professor, or resources — has access to world-class explanations
                  that make the fundamentals truly click.
                </p>
              </div>
            </FadeSection>

            {/* Mission */}
            <FadeSection delay={0.12}>
              <div className="au-mission-card">
                <div className="au-mission-card__ring" />
                <div className="au-mission-card__emoji">🎯</div>
                <Badge text="Mission" />
                <h3>Deliver expert-crafted courses that complement your university curriculum.</h3>
                <p>
                  Our mission is to bridge the gap between confusing lectures and real understanding —
                  through structured video courses, qualified educators, and a supportive student community
                  focused on engineering excellence.
                </p>
              </div>
            </FadeSection>

            {/* Values */}
            <FadeSection delay={0.24}>
              <div className="au-values-card">
                <div className="au-values-card__emoji">💡</div>
                <Badge text="Values" />
                <h3>Clarity. Integrity. Student-first thinking.</h3>
                <div className="au-values-list">
                  {['Explain first, test later', 'Quality over quantity', 'Honest, jargon-free teaching', 'Always improving with feedback'].map((v, i) => (
                    <div key={i} className="au-values-list__item">
                      <div className="au-values-list__dot" />
                      <span className="au-values-list__text">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ── 4. POLICY & RULES — Premium ── */}
      <section className="au-policy">
        <div className="container">
          <FadeSection>
            <div className="au-policy__intro">
              <span className="au-policy__label">Guidelines</span>
              <h2>Our Policy &amp; Rules</h2>
              <p>A fair, transparent, and respectful environment for every student and educator on our platform.</p>
            </div>
          </FadeSection>

          <div className="au-policy__grid">
            {[
              {
                title: 'Academic Integrity',
                rules: [
                  'All course content is original and educator-owned.',
                  'Sharing or redistributing videos without permission is prohibited.',
                  'Plagiarism or misrepresentation will result in account removal.',
                ],
              },
              {
                title: 'Community Conduct',
                rules: [
                  'Treat every student and educator with respect.',
                  'Constructive feedback is encouraged; harassment is not tolerated.',
                  'Spam, hate speech, or off-topic promotions will be removed.',
                ],
              },
              {
                title: 'Privacy & Data',
                rules: [
                  'Your personal data is never sold to third parties.',
                  'Enrolled course access is personal and non-transferable.',
                  'You may request account deletion at any time.',
                ],
              },
              {
                title: 'Enrolment & Refunds',
                rules: [
                  'Course access begins immediately upon successful enrolment.',
                  'Refund requests must be submitted within 7 days of purchase.',
                  'Courses completed more than 50% are not eligible for refund.',
                ],
              },
              {
                title: 'Content Standards',
                rules: [
                  'All courses are reviewed before publishing.',
                  'Outdated content is updated within 60 days of a curriculum change.',
                  'Educators must hold verifiable credentials in their subject.',
                ],
              },
              {
                title: 'Enforcement',
                rules: [
                  'Violations are reviewed by our moderation team within 48 hours.',
                  'Serious breaches result in immediate suspension.',
                  'Appeals can be submitted via our contact page.',
                ],
              },
            ].map((section, i) => (
              <FadeSection key={i} delay={(i % 3) * 0.08}>
                <div className="au-policy-block">
                  <div className="au-policy-block__header">
                    <span className="au-policy-block__number">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="au-policy-block__title">{section.title}</h3>
                  </div>
                  <ul className="au-policy-block__rules">
                    {section.rules.map((rule, j) => (
                      <li key={j} className="au-policy-block__rule">
                        <span className="au-policy-block__rule-marker" />
                        <p className="au-policy-block__rule-text">{rule}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="au-cta">
        <FadeSection>
          <p className="au-cta__eyebrow">Ready to start?</p>
          <h2>Join thousands of engineers who get it now.</h2>
          <p>Browse our courses and find the one that finally makes it click.</p>
          <a href="/courses" className="au-cta__btn">Browse Courses →</a>
        </FadeSection>
      </section>

    </div>
  )
}

export default AboutUs