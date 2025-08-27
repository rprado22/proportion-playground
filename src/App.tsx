import React, { useMemo, useState } from "react";

/** -------------------------------
 *  Localization (EN/ES) strings
 *  ------------------------------- */
type Lang = "en" | "es";
const STRINGS: Record<Lang, any> = {
  en: {
    title: "Proportions Explorer",
    subtitle: "Interact with equivalent ratios & unit rates.",
    mantissa: "Parts of A : B",
    scale: "Scale factor (k) for y = kx",
    presets: "Quick presets",
    aLabel: "A parts",
    bLabel: "B parts",
    kLabel: "k (how many times bigger)",
    visuals: "Visual Model",
    doubleNumberLine: "Double Number Line (x vs y)",
    tapeDiagram: "Tape Diagram • A:B",
    tableTitle: "Proportion Table",
    teacherTips: "WIDA Sentence Frames",
    reset: "Reset",
    randomize: "Randomize",
    showHints: "Show Hints",
    hideHints: "Hide Hints",
    exitTicket: "Exit Ticket",
    language: "Español",
    sci: "Scientific notation", // not used; placeholder
    unitRate: "Unit rate",
    explain: "How it works",
    how: "Move the sliders to change the ratio A:B and the scale factor k in y = kx. Watch the double number line, tape diagram, and table update in real time.",
    frames: [
      "I can describe the ratio as __ to __.",
      "When the parts double, the total doubles.",
      "If x increases by __, then y increases by __ because y = kx.",
      "The unit rate is __ per 1."
    ],
    x: "x",
    y: "y",
    hints: [
      "Equivalent ratios live on the same straight line through the origin.",
      "Multiplying both parts by the same number keeps the ratio equivalent.",
      "The unit rate is y ÷ x (when x ≠ 0)."
    ],
    exitPrompts: [
      "Fill the missing value: __ / __ = __ / (?)",
      "A recipe uses __ cups of juice for __ cups of water. How much water for __ cups of juice?",
      "A store charges __ dollars for __ notebooks. What is the cost for __ notebooks?"
    ],
    revealAnswers: "Reveal Answers",
    hideAnswers: "Hide Answers"
  },
  es: {
    title: "Explorador de Proporciones",
    subtitle: "Interactúa con razones equivalentes y tasas unitarias.",
    mantissa: "Partes de A : B",
    scale: "Factor de escala (k) para y = kx",
    presets: "Preajustes rápidos",
    aLabel: "Partes de A",
    bLabel: "Partes de B",
    kLabel: "k (cuántas veces más grande)",
    visuals: "Modelo visual",
    doubleNumberLine: "Líneas numéricas dobles (x vs y)",
    tapeDiagram: "Diagrama de cinta • A:B",
    tableTitle: "Tabla de proporciones",
    teacherTips: "Marcos de oraciones WIDA",
    reset: "Reiniciar",
    randomize: "Aleatorizar",
    showHints: "Mostrar pistas",
    hideHints: "Ocultar pistas",
    exitTicket: "Boleto de salida",
    language: "English",
    unitRate: "Tasa unitaria",
    explain: "Cómo funciona",
    how: "Mueve los controles para cambiar la razón A:B y el factor de escala k en y = kx. Observa cómo se actualizan en tiempo real la doble recta numérica, el diagrama de cinta y la tabla.",
    frames: [
      "Puedo describir la razón como __ a __.",
      "Cuando las partes se duplican, el total se duplica.",
      "Si x aumenta en __, entonces y aumenta en __ porque y = kx.",
      "La tasa unitaria es __ por 1."
    ],
    x: "x",
    y: "y",
    hints: [
      "Las razones equivalentes están en la misma recta que pasa por el origen.",
      "Multiplicar ambas partes por el mismo número mantiene la razón equivalente.",
      "La tasa unitaria es y ÷ x (cuando x ≠ 0)."
    ],
    exitPrompts: [
      "Completa el valor que falta: __ / __ = __ / (?)",
      "Una receta usa __ tazas de jugo por __ tazas de agua. ¿Cuánta agua para __ tazas de jugo?",
      "Una tienda cobra __ dólares por __ cuadernos. ¿Cuál es el costo por __ cuadernos?"
    ],
    revealAnswers: "Mostrar respuestas",
    hideAnswers: "Ocultar respuestas"
  }
};

/** Helpers */
const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function gcd(a: number, b: number) {
  while (b) [a, b] = [b, a % b];
  return Math.abs(a);
}

function simplify(a: number, b: number) {
  const g = gcd(a, b) || 1;
  return [a / g, b / g];
}

/** Exit ticket item generator */
type QA = { q: string; a: string };
function makeExitTicket(lang: Lang): QA[] {
  // Random but nice numbers for 7th grade
  const a = rnd(2, 6), b = rnd(3, 9), m = rnd(2, 5);
  const c = a * m;
  const d = b * m;
  const missing = rnd(0, 1) === 0 ? "num" : "den";
  const missingVal = missing === "num" ? c : d;
  const q1 =
    (lang === "en"
      ? `${STRINGS.en.exitPrompts[0]}`
      : `${STRINGS.es.exitPrompts[0]}`).replace(
      "(?)",
      " ? "
    );
  const qa1: QA = {
    q: q1.replace("__ / __ = __ / (?)", `${a} / ${b} = ${missing === "num" ? "?" : c} / ${missing === "den" ? "?" : d}`),
    a: `${missingVal}`
  };

  const juice = rnd(2, 4), water = rnd(3, 6), wantJuice = rnd(5, 9);
  const needWater = (water / juice) * wantJuice;
  const qa2: QA = {
    q: (lang === "en"
      ? STRINGS.en.exitPrompts[1]
      : STRINGS.es.exitPrompts[1])
      .replace("__ cups of juice", `${juice} cups of juice`)
      .replace("__ cups of water", `${water} cups of water`)
      .replace("__ cups of juice", `${wantJuice} cups of juice`),
    a: `${needWater}`
  };

  const price = rnd(6, 12), qty = rnd(2, 6), want = rnd(8, 12);
  const total = (price / qty) * want;
  const qa3: QA = {
    q: (lang === "en"
      ? STRINGS.en.exitPrompts[2]
      : STRINGS.es.exitPrompts[2])
      .replace("__ dollars", `${price} dollars`)
      .replace("__ notebooks", `${qty} notebooks`)
      .replace("__ notebooks", `${want} notebooks`),
    a: `${total}`
  };
  return [qa1, qa2, qa3];
}

export default function App() {
  const [lang, setLang] = useState<Lang>("en");

  // Core state: parts for A:B, and scale factor k so that y = kx
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [k, setK] = useState(1.5);
  const [showHints, setShowHints] = useState(true);
  const [qas, setQAs] = useState<QA[]>(() => makeExitTicket(lang));

  const L = STRINGS[lang];

  // Derived values
  const [sa, sb] = useMemo(() => simplify(a, b), [a, b]);
  const unitRate = useMemo(() => (a === 0 ? 0 : b / a), [a, b]);

  // For double number line demo: generate integer x (0..10) and y = kx
  const points = useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    for (let i = 0; i <= 10; i++) arr.push({ x: i, y: +(k * i).toFixed(2) });
    return arr;
  }, [k]);

  /** Presets for quick demo (chips) */
  const presets = [
    { label: "Smoothie 2:3", a: 2, b: 3, k: 1.5 },
    { label: "Trail Mix 2:5", a: 2, b: 5, k: 2 },
    { label: "Class Paint 3:4", a: 3, b: 4, k: 1.25 }
  ];

  function handleRandomize() {
    setA(rnd(1, 6));
    setB(rnd(1, 6));
    setK(+((Math.random() * 2 + 0.5).toFixed(2))); // 0.5..2.5
    setQAs(makeExitTicket(lang));
  }

  function handleReset() {
    setA(3); setB(2); setK(1.5);
    setQAs(makeExitTicket(lang));
  }

  function switchLang() {
    setLang(prev => (prev === "en" ? "es" : "en"));
    // regenerate items in new language
    setQAs(makeExitTicket(lang === "en" ? "es" : "en"));
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <div className="title">
            {L.title} • {lang === "en" ? "Explorador de Proporciones" : "Proportions Explorer"}
          </div>
          <div className="subtitle">{L.subtitle}</div>
        </div>
        <div className="pill-row">
          <button className="pill ghost" onClick={switchLang}>
            {L.language}
          </button>
          <button className="pill" onClick={handleReset}>↻ {L.reset}</button>
          <button className="pill alt" onClick={handleRandomize}>🎲 {L.randomize}</button>
          <button className="pill warn" onClick={() => setShowHints(s => !s)}>
            {showHints ? `🙈 ${L.hideHints}` : `💡 ${L.showHints}`}
          </button>
        </div>
      </header>

      <div className="row">
        {/* LEFT: Controls + Visuals */}
        <div className="card">
          <div className="section-title">{L.mantissa}</div>

          <div className="controls">
            <div className="control">
              <h4>{L.aLabel}: <b>{a}</b></h4>
              <input className="range" type="range" min={0} max={12} value={a} onChange={e => setA(+e.target.value)} />
              <div className="small">0—12</div>
            </div>
            <div className="control">
              <h4>{L.bLabel}: <b>{b}</b></h4>
              <input className="range" type="range" min={0} max={12} value={b} onChange={e => setB(+e.target.value)} />
              <div className="small">0—12</div>
            </div>
            <div className="control" style={{ gridColumn: "1 / span 2" }}>
              <h4>{L.scale}: <b>{k}</b></h4>
              <input className="range" type="range" min={0} max={30} step={1}
                value={Math.round(k * 10)}
                onChange={e => setK(+(+e.target.value / 10).toFixed(2))}
              />
              <div className="small">0.0 — 3.0</div>
              <div className="kpi">
                <div className="big">{L.unitRate}: <span className="tag">{(unitRate).toFixed(2)} {L.y} / 1 {L.x}</span></div>
                <div className="small">{L.explain}: {L.how}</div>
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div style={{marginTop:8}}>
            <div className="small"><b>{L.presets}</b></div>
            <div className="pill-row">
              {presets.map(p => (
                <button key={p.label} className="pill" onClick={() => { setA(p.a); setB(p.b); setK(p.k); }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visuals */}
          <div className="visuals">
            <div className="section-title" style={{marginTop:12}}>{L.visuals}</div>

            {/* Double number line */}
            <div className="canvas">
              <div className="section-title small">{L.doubleNumberLine}</div>
              <div className="dnl">
                <DNL label={L.x} values={points.map(p => p.x)} highlightIndex={Math.min(10, 1)} />
                <DNL label={L.y} values={points.map(p => p.y)} highlightIndex={Math.min(10, 1)} color="#10b981" />
              </div>
            </div>

            {/* Tape diagram */}
            <div className="canvas">
              <div className="section-title small">{L.tapeDiagram}</div>
              <Tape a={a} b={b} />
              <div className="small">
                Simplified ratio: <b>{sa}:{sb}</b>
              </div>
            </div>

            {/* Proportion table */}
            <div className="canvas">
              <div className="section-title small">{L.tableTitle}</div>
              <PropTable a={a} b={b} />
            </div>
          </div>
        </div>

        {/* RIGHT: Hints / WIDA frames */}
        <div className="right">
          <div className="card hint">
            <h3>{L.teacherTips}</h3>
            <ul>
              {STRINGS[lang].frames.map((f: string, i: number) => (
                <li key={i} style={{marginBottom:6}}>{f}</li>
              ))}
            </ul>
            {showHints && (
              <>
                <hr style={{opacity:.3, margin:"12px 0"}} />
                {STRINGS[lang].hints.map((h: string, i: number) => (
                  <p key={i} style={{margin:"6px 0"}}>💡 <b>Hint:</b> {h}</p>
                ))}
              </>
            )}
          </div>

          {/* Exit Ticket */}
          <div className="card" style={{marginTop:16}}>
            <div className="section-title">{L.exitTicket}</div>
            <div className="qa">
              {qas.map((qa, i) => <QAItem key={i} idx={i+1} qa={qa} />)}
            </div>
            <div className="footer">
              Grade 7 • CCSS: 7.RP.A.1–3 • Language: English/Spanish
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ----- Components ----- */

function DNL({
  label, values, highlightIndex = 1, color = "#0ea5e9"
}: { label: string; values: number[]; highlightIndex?: number; color?: string }) {
  // Marks from first to last value
  const min = values[0], max = values[values.length - 1] || 1;
  const pos = (v: number) => ((v - min) / (max - min || 1)) * 100;
  return (
    <div>
      <div className="line-label"><span><b>{label}</b></span><span>{min}</span><span>{max}</span></div>
      <div className="line">
        {values.map((v, i) => (
          <div key={i} className="tick" style={{ left: `${pos(v)}%` }} />
        ))}
        <div className="marker" style={{ left: `${pos(values[highlightIndex] ?? min)}%`, background: color }} />
      </div>
    </div>
  );
}

function Tape({ a, b }: { a: number; b: number }) {
  const tilesA = Math.max(1, a);
  const tilesB = Math.max(1, b);
  return (
    <div className="tape">
      <div style={{minWidth:60, fontWeight:700}}>A:{a}</div>
      <div className="tape-bar" aria-label="A tiles">
        {Array.from({ length: tilesA }).map((_, i) => <div key={i} className="tile a" />)}
      </div>
      <div style={{minWidth:60, fontWeight:700, marginLeft:12}}>B:{b}</div>
      <div className="tape-bar" aria-label="B tiles">
        {Array.from({ length: tilesB }).map((_, i) => <div key={i} className="tile b" />)}
      </div>
    </div>
  );
}

function PropTable({ a, b }: { a: number; b: number }) {
  const rows = Array.from({ length: 6 }).map((_, i) => {
    const m = i + 1;
    return { m, A: a * m, B: b * m };
  });
  const [sa, sb] = simplify(a, b);
  return (
    <table>
      <thead>
        <tr>
          <th>×m</th>
          <th>A</th>
          <th>B</th>
          <th>A:B</th>
          <th>A/B</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.m}>
            <td>{r.m}</td>
            <td>{r.A}</td>
            <td>{r.B}</td>
            <td>{sa * r.m}:{sb * r.m}</td>
            <td>{(r.B / (r.A || 1)).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function QAItem({ qa, idx }: { qa: QA; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{margin:"10px 0"}}>
      <div><b>Q{idx}.</b> {qa.q}</div>
      <div className="details" onClick={() => setOpen(o=>!o)}>
        {open ? "🙈 Hide Answer" : "👀 Reveal Answer"}
      </div>
      {open && <div><b>A:</b> {qa.a}</div>}
    </div>
  );
}
