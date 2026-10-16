import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const workflow = [
  { id: 'find', number: '01', title: 'Find a business', body: 'Search a city and a type. Score who may need help answering calls.' },
  { id: 'need', number: '02', title: 'Show the need', body: 'Turn public signals into a one-page report the owner understands.' },
  { id: 'proposal', number: '03', title: 'Build the proposal', body: 'Create a proposal in your name with the price you set.' },
  { id: 'customize', number: '04', title: 'Customize the AI', body: 'Give the receptionist a name, voice, hours, services and FAQs.' },
  { id: 'price', number: '05', title: 'Set your price', body: 'Choose what the business pays each month.' },
  { id: 'live', number: '06', title: 'Go live', body: 'Test the line by voice, then hand the business a live receptionist.' }
];

const plans = {
  Starter: { monthly: 79, annual: 790, desc: 'For the operator running their first client line', lines: '1 live AI line', scans: '10 XRAY scans / month', credits: '90 pitch + 90 proposal AI credits', extras: ['Live human transfer — not included', 'Urgent voice alerts — not included', 'Client-facing branding — not included'] },
  Growth: { monthly: 149, annual: 1490, desc: 'For agencies running up to 10 client lines', lines: '10 live AI lines', scans: '25 XRAY scans / month', credits: '300 pitch + 300 proposal AI credits', extras: ['Live human transfer', 'Urgent voice alerts', 'Client-facing branding'], recommended: true },
  Empire: { monthly: 299, annual: 2990, desc: 'For high-volume operators running 25+ client lines', lines: '25 live AI lines', scans: '100 XRAY scans / month', credits: '1200 pitch + 1200 proposal AI credits', extras: ['Live human transfer', 'Urgent voice alerts', 'Client-facing branding'] }
};

const faqs = [
  ['What exactly am I selling?', 'A managed AI receptionist line that answers as a local business, captures booking requests, and writes a summary into a portal.'],
  ['Do I need to code?', 'No. The intended operator workflow is scan, configure, price, test, and launch.'],
  ['Can I customize the receptionist?', 'Yes. Configure the assistant name, opening line, services, hours, FAQs, voice and handoff number.'],
  ['What happens after a call?', 'The call is logged, the caller request is captured, and a concise summary is saved for the business to review.'],
  ['Can it book appointments?', 'It captures the requested time and details. The business confirms or books the appointment.'],
  ['How do I charge clients?', 'You set the monthly price the business pays and bill the business directly.'],
  ['Is it white-label?', 'Client-facing reports can carry your branding. The operator portal remains platform-branded.'],
  ['What happens when a caller says it is urgent?', 'The system flags the call and sends an alert after the call ends.']
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState('find');
  const [price, setPrice] = useState(350);
  const [minutes, setMinutes] = useState(500);
  const [plan, setPlan] = useState('Growth');
  const [annual, setAnnual] = useState(false);
  const margin = price - minutes * 0.3;
  const marginPct = Math.max(0, Math.round((margin / price) * 100));
  const currentPlan = useMemo(() => plans[plan], [plan]);

  return <>
    <header className="site-header" id="top">
      <a className="brand" href="#top" aria-label="Exelo home"><span className="brand-mark">✦</span> Exelo</a>
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        <a href="#login" onClick={() => setMenuOpen(false)}>Login</a>
        <a className="button gold small" href="#close" onClick={() => setMenuOpen(false)}>Get started →</a>
      </nav>
      <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? '×' : '☰'}</button>
    </header>

    <main>
      <section className="hero section-dark">
        <div className="hero-copy">
          <p className="eyebrow">START AN AI SIDE HUSTLE</p>
          <h1>Make an extra <span>$10k a month</span> while AI does 90% of the work.</h1>
          <p className="lead">Exelo is an AI receptionist you sell to local businesses. It answers and takes booking requests in 60 seconds. You set the price. No coding.</p>
          <p className="fine">Estimate, not a promise. It depends on how many businesses you sign.</p>
          <div className="actions"><a className="button gold" href="#close">Get started →</a><a className="button ghost" href="#how">See how it works ↓</a></div>
        </div>
        <div className="hero-visual">
          <PhoneMockup />
          <div className="call-stack"><StatusCard label="INCOMING CALL" title="Miami Skin Spa" meta="(•••) •••-0142 · 9:42 PM" /><StatusCard label="AI ANSWERED" title="Picked up as Miami Skin Spa" /><StatusCard label="BOOKING REQUEST" title="Tomorrow · 2:30 PM" /><StatusCard label="CALL SUMMARY" title="1 min 48 s" /></div>
        </div>
      </section>

      <section className="portal-demo section-dark" id="dashboard">
        <div className="section-intro"><p className="eyebrow">DEMO</p><h2>The same call,<br /><em>already written down.</em></h2><div className="chapter-list">{['Calls answered.', 'Booking requests captured.', 'Summaries written.', 'Urgent? You hear about it.'].map((x, i) => <div className="chapter" key={x}><b>0{i + 1}</b><span><strong>{x}</strong>{['Every call the AI picks up is logged — who called, when, and for how long.', 'The caller’s requested time and details, saved for the business to book.', 'What the caller wanted, in a few lines. No listening back.', 'When a caller says it’s urgent, an email reaches your account after the call.'][i]}</span></div>)}</div></div>
        <PortalMockup />
      </section>

      <section className="statement"><p className="eyebrow">THE BUSINESS</p><h2>You sell it.<br /><em>Exelo runs it.</em></h2><div className="statement-grid"><p><b>Find</b> a local business that may be missing calls.</p><p><b>Configure</b> its AI receptionist — name, voice, hours, services.</p><p><b>Set</b> what the business pays you each month.</p><p><b>Exelo</b> provides the receptionist, portal and local line.</p></div></section>

      <section className="workflow section-light" id="how"><div className="section-heading"><p className="eyebrow">HOW THE BUSINESS WORKS</p><h2>From a local business<br /><em>to a line you run.</em></h2></div><div className="workflow-grid"><div className="steps">{workflow.map(step => <button className={activeStep === step.id ? 'step active' : 'step'} key={step.id} onClick={() => setActiveStep(step.id)}><b>{step.number}</b><span><strong>{step.title}</strong>{activeStep === step.id && <small>{step.body}</small>}</span></button>)}</div><WorkflowPreview step={activeStep} /></div></section>

      <section className="infrastructure section-light"><div className="section-heading"><p className="eyebrow">MORE THAN AN AI RECEPTIONIST</p><h2>The front desk,<br /><em>run as infrastructure.</em></h2></div><div className="infra-grid"><InfoCard number="01" title="One system. Every business." text="Each client runs through the same operating layer." visual="network" /><InfoCard number="02" title="The business remembers." text="Key context stays with the business." visual="memory" /><InfoCard number="03" title="Morning starts caught up." text="The team returns to context, not a pile of missed calls." visual="continuity" /></div></section>

      <section className="calculator section-light" id="calculator"><div className="section-heading"><p className="eyebrow">ECONOMICS</p><h2>You choose what<br /><em>your client pays.</em></h2><p className="lead">Move the price and usage. The math is live.</p></div><div className="calculator-grid"><div className="calc-panel"><RangeField label="Your monthly price" value={price} min={150} max={800} step={10} suffix="/ month" onChange={setPrice} /><RangeField label="Monthly call minutes" value={minutes} min={250} max={1500} step={25} suffix="min" onChange={setMinutes} /><p className="fine">Usage is modeled at a conservative $0.30/minute. Your plan is separate and covers every line you run.</p></div><div className="calc-results"><Result label="Client price · you set it" value={`$${price}`} sub="/ mo" /><Result label="Estimated infrastructure" value={`$${Math.round(minutes * 0.3)}`} sub="/ mo" /><Result label="Your margin · typical estimate" value={`$${Math.round(margin)}`} sub={`/ mo · ${marginPct}%`} accent /></div></div></section>

      <section className="system section-dark"><div className="section-heading"><p className="eyebrow">THE SYSTEM</p><h2>Everything behind<br /><em>the receptionist.</em></h2></div><div className="system-flow">{['AI call', 'Caller request', 'Booking request', 'Call summary', 'Business action', 'Urgent alert'].map((x, i) => <div className="system-node" key={x}><span>{String(i + 1).padStart(2, '0')}</span><strong>{x}</strong><small>{['Answers as the business, day or night.', 'Asks what the caller needs and listens.', 'Time and details captured for the business to book.', 'What happened, written down in the portal.', 'The business calls back or books it.', 'An email reaches your account after the call.'][i]}</small></div>)}</div></section>

      <Pricing plan={plan} setPlan={setPlan} annual={annual} setAnnual={setAnnual} currentPlan={currentPlan} />
      <section className="comparison section-light"><p className="eyebrow">SIDE BY SIDE</p><h2>AI receptionist <em>vs. front desk</em></h2><div className="compare"><div></div><strong>AI receptionist</strong><strong>Front desk</strong><span>Availability</span><b>24/7, holidays included</b><span>Monthly cost</span><b>$300–$500 typical</b><span>After the call</span><b>Summary in the portal</b><span>Urgent caller</span><b>Email alert after the call</b></div></section>
      <section className="faq section-light" id="faq"><p className="eyebrow">FAQ</p><h2>The questions buyers<br /><em>actually ask.</em></h2><div className="faq-list">{faqs.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="closing section-dark" id="close"><p className="eyebrow">START NOW</p><h2>Keep your day job.<br /><em>Start selling AI.</em></h2><a className="button gold" href="#top">Get started →</a></section>
    </main>
    <footer><div className="brand"><span className="brand-mark">✦</span> Exelo</div><div><span>Product</span><a href="#how">How it works</a><a href="#pricing">Pricing</a><a href="#calculator">Profit calculator</a></div><div><span>Company</span><a href="#faq">Common questions</a><a href="mailto:support@example.com">Contact</a><a href="#top">Privacy</a></div><div><span>Partners</span><a href="#close">Get started</a><a href="#top">Sign in</a></div></footer>
  </>;
}

function PhoneMockup() { return <div className="phone"><div className="phone-notch" /><div className="phone-time">9:42 <span>AI line</span></div><div className="phone-avatar">MS</div><strong>Miami Skin Spa</strong><small>Business line</small><div className="ringing">RINGING ···<b>(•••) •••-0142</b><small>Mobile · 9:42 PM</small></div><div className="ai-strip">✦ Ava is answering <small>AI receptionist</small></div><div className="phone-actions"><i>×</i><i>⌕</i></div></div> }
function StatusCard({ label, title, meta }) { return <div className="status-card"><span>{label}</span><strong>{title}</strong>{meta && <small>{meta}</small>}</div> }
function PortalMockup() { return <div className="portal"><aside><b>EXELO</b><span>Businesses</span><span>Leads & Outreach</span><span>Resources</span><span>Support</span><span>Settings</span></aside><div className="portal-main"><p className="eyebrow">BUSINESSES · MIAMI SKIN SPA</p><div className="portal-title"><h3>Miami Skin Spa</h3><span className="live">● AI line · Live</span></div><div className="metrics"><Metric n="12" label="Calls answered" /><Metric n="41" label="Minutes used" /><Metric n="3" label="Booking requests" /></div><div className="activity"><p className="eyebrow">RECENT ACTIVITY</p><strong>Answered · 9:42 PM</strong><span>AI line picked up as Miami Skin Spa</span><hr /><strong>Booking request · Tomorrow · 2:30 PM</strong><span>Saved into the call summary. You book it.</span><hr /><strong>Call summary</strong><span>Wants a quote for a facial package. Tomorrow afternoon if possible.</span></div></div></div> }
function Metric({ n, label }) { return <div className="metric"><strong>{n}</strong><span>{label}</span></div> }
function WorkflowPreview({ step }) { const labels = {find: ['Exelo · Find a business', 'San Diego dentist', '68', 'Harborview Dental', 'No website · 22 reviews · no hours listed'], need: ['Opportunity report', 'Harborview Dental', '68 need score', 'Website · None found', 'Online booking · None'], proposal: ['Proposal', 'AI receptionist for Harborview Dental', '$349 / mo', 'Answers the business line day and night', 'Booking requests and details captured'], customize: ['Customize', 'Harborview Dental', 'Assistant name · Ava', 'Services · Cleanings, exams, whitening', 'Hours · Mon–Fri 8am–6pm'], price: ['Price & status', 'Harborview Dental', '$349 / month', 'Voice · Rachel · calm, reassuring', 'The line is live'], live: ['AI receptionist', 'Harborview Dental', 'Live', 'Local number · (619) ···-0148', 'Test by voice'] }; const x = labels[step]; return <div className="workflow-preview"><div className="window-bar"><i></i><i></i><i></i><span>{x[0]}</span></div><div className="preview-search">⌕ &nbsp; {x[1]}</div><div className="preview-score"><b>{x[2]}</b><div><strong>{x[3]}</strong><small>{x[4]}</small></div></div><div className="preview-lines"><span>Public listing data</span><span>Saved for the business to review</span><span>Same operating layer for every client</span></div></div> }
function InfoCard({ number, title, text, visual }) { return <article className={`info-card ${visual}`}><div><p className="eyebrow">{number}</p><h3>{title}</h3><p>{text}</p></div><div className="info-visual">{visual === 'network' ? <><span className="core">EXELO</span><i>Dental</i><i>Salon</i><i>HVAC</i></> : visual === 'memory' ? <><b>Today · 9:42 PM</b><span>Facial package · quote</span><span>Business confirms the request</span><span>Open on Sundays?</span></> : <><b>6 PM</b><hr /><b>8 AM</b><span>Team offline → Exelo running → morning handoff</span></>}</div></article> }
function RangeField({ label, value, min, max, step, suffix, onChange }) { return <label className="range-field"><span>{label}<b>{value} {suffix}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label> }
function Result({ label, value, sub, accent }) { return <div className={accent ? 'result accent' : 'result'}><span>{label}</span><strong>{value}</strong><small>{sub}</small></div> }
function Pricing({ plan, setPlan, annual, setAnnual, currentPlan }) { return <section className="pricing section-light" id="pricing"><div className="section-heading centered"><p className="eyebrow">PRICING</p><h2>Simple pricing.<br /><em>Made to scale with you.</em></h2><p className="lead">Start with your first client line. Move up as your roster grows.</p></div><div className="pricing-controls"><div>{Object.keys(plans).map(x => <button className={plan === x ? 'selected' : ''} key={x} onClick={() => setPlan(x)}>{x}</button>)}</div><div><button className={!annual ? 'selected' : ''} onClick={() => setAnnual(false)}>Monthly</button><button className={annual ? 'selected' : ''} onClick={() => setAnnual(true)}>Annual · 3 months free</button></div></div><div className="pricing-card"><div><p className="eyebrow">{plan.toUpperCase()}</p><h3>{currentPlan.desc}</h3><div className="plan-price"><span>$</span>{annual ? currentPlan.annual : currentPlan.monthly}<small>/ {annual ? 'year' : 'month'}</small></div><p className="fine">3-day money-back guarantee</p><a className="button gold" href="#close">Get started →</a></div><ul><li>{currentPlan.lines}</li><li>{currentPlan.scans}</li><li>{currentPlan.credits}</li>{currentPlan.extras.map(x => <li key={x}>{x}</li>)}</ul></div></section> }

createRoot(document.getElementById('root')).render(<App />);
