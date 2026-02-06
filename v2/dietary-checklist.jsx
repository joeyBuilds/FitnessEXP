import { useState, useEffect } from "react";

// ─── Mako Palette (matching fitness tracker) ───
const M = {
  mint: "#c1e0d6", teal: "#5bafa0", sea: "#5d96a0", ocean: "#2d6e8a",
  navy: "#3b4a8a", abyss: "#2a2550",
  bg: "#0e1225", bgCard: "#121830", bgLight: "#161d3a",
  text: "#d0dde8", textDim: "#5a6b84", textMuted: "#384560",
  success: "#5bafa0", warning: "#e8a838", danger: "#e05555",
  protein: "#5bafa0", carb: "#e8a838", fat: "#7c6dd8", hydra: "#38b4f0",
};

const MEALS = [
  {
    id: "breakfast",
    time: "7–9 AM",
    name: "Morning Fuel",
    icon: "🌅",
    locked: false,
    items: [
      { id: "b1", text: "4 eggs scrambled w/ veggies", detail: "Tomatoes, onion, garlic, red pepper — keep this exactly as-is", protein: 28, cals: 340, status: "keep" },
      { id: "b2", text: "¼ cup pumpkin seeds + yogurt", detail: "Greek yogurt if possible — double the protein of regular", protein: 18, cals: 280, status: "keep" },
      { id: "b3", text: "1 glass water (16 oz)", detail: "Rehydrate first thing. Before coffee, before Alani.", protein: 0, cals: 0, status: "add" },
    ],
    notes: "Your breakfast is already excellent. No changes needed — just protect it.",
    totalProtein: 46,
    totalCals: 620,
  },
  {
    id: "lunch",
    time: "12–1 PM",
    name: "Midday Refuel",
    icon: "⚡",
    locked: false,
    items: [
      { id: "l1", text: "Actual meal — not optional", detail: "This is the gap that's wrecking your evening. Eat real food here.", protein: 0, cals: 0, status: "critical" },
      { id: "l2", text: "Protein source (pick one daily)", detail: "Rotisserie chicken (Costco), canned tuna, deli turkey, leftover Hello Fresh, or 2 more eggs", protein: 30, cals: 200, status: "add" },
      { id: "l3", text: "Complex carb (pick one)", detail: "Rice, sweet potato, whole grain bread, or tortilla wrap", protein: 4, cals: 180, status: "add" },
      { id: "l4", text: "Handful of greens or veggies", detail: "Bagged salad, baby carrots, cucumber — zero prep options exist", protein: 2, cals: 30, status: "add" },
    ],
    notes: "This doesn't need to be fancy. A turkey sandwich counts. A bowl of leftover Hello Fresh counts. Anything > nothing.",
    totalProtein: 36,
    totalCals: 410,
  },
  {
    id: "snack",
    time: "3–4 PM",
    name: "Afternoon Rations",
    icon: "🎯",
    locked: false,
    items: [
      { id: "s1", text: "Protein bar (Costco brand is fine)", detail: "The Kirkland bars are solid — 21g protein, reasonable macros", protein: 21, cals: 190, status: "keep" },
      { id: "s2", text: "OR Greek yogurt + handful of nuts", detail: "Better than dried mango. Protein + fat = sustained energy", protein: 18, cals: 220, status: "swap" },
      { id: "s3", text: "Skip the dried mangos", detail: "35-50g sugar per bag. It's candy in a health costume.", protein: 0, cals: 0, status: "drop" },
    ],
    notes: "This snack exists to prevent the late-night spiral. If you eat enough here, 10 PM you won't be ravenous.",
    totalProtein: 20,
    totalCals: 200,
  },
  {
    id: "dinner",
    time: "6–7:30 PM",
    name: "Hello Fresh Raid",
    icon: "🍽️",
    locked: false,
    items: [
      { id: "d1", text: "Hello Fresh meal (chicken preferred)", detail: "You're already doing this well. Prioritize the chicken/protein dishes when choosing.", protein: 35, cals: 550, status: "keep" },
      { id: "d2", text: "Extra protein if HF meal is light", detail: "Some HF meals are pasta-heavy. Add a side of chicken or an egg if protein feels low.", protein: 10, cals: 80, status: "add" },
      { id: "d3", text: "Half-box Goodles MAX if craving", detail: "Not every night. Treat it as a side, not a meal. Eat protein first.", protein: 6, cals: 400, status: "limit" },
    ],
    notes: "If you've eaten lunch and a snack, you won't need the full box of Goodles. That craving is hunger debt from skipping meals.",
    totalProtein: 45,
    totalCals: 700,
  },
  {
    id: "evening",
    time: "After 8 PM",
    name: "Late-Night Defense",
    icon: "🛡️",
    locked: false,
    items: [
      { id: "e1", text: "Casein protein or Greek yogurt", detail: "Slow-digesting protein. Kills the hunger, feeds muscle overnight.", protein: 20, cals: 130, status: "add" },
      { id: "e2", text: "Herbal tea (non-caffeinated)", detail: "Warm liquid signals 'done eating' to your brain. Chamomile is great.", protein: 0, cals: 0, status: "add" },
      { id: "e3", text: "Hard rule: kitchen closes at 9 PM", detail: "Brush your teeth. Seriously — it's a psychological barrier to snacking.", protein: 0, cals: 0, status: "critical" },
    ],
    notes: "Late-night snacking is the final boss. The yogurt + tea combo is your pre-bed shield. Brush teeth = game over for cravings.",
    totalProtein: 20,
    totalCals: 130,
  },
];

const HYDRATION = [
  { id: "h1", text: "Morning glass (16 oz)", time: "Wake up" },
  { id: "h2", text: "Mid-morning (16 oz)", time: "10 AM" },
  { id: "h3", text: "With lunch (16 oz)", time: "12 PM" },
  { id: "h4", text: "Afternoon (16 oz)", time: "3 PM" },
  { id: "h5", text: "With dinner (16 oz)", time: "6 PM" },
];

const ALANI_RULES = [
  { id: "a1", text: "Max 1 Alani Nu per day", detail: "Non-negotiable. 200mg caffeine is your ceiling." },
  { id: "a2", text: "None after 2 PM", detail: "Caffeine half-life is 5-6 hours. A 3 PM can means caffeine in your blood at 9 PM." },
  { id: "a3", text: "Replace extras with sparkling water", detail: "You like the ritual of cracking a can. Topo Chico or La Croix scratches the same itch." },
];

const STATUS_CONFIG = {
  keep: { label: "KEEP", color: M.success, bg: `${M.success}12` },
  add: { label: "ADD", color: M.hydra, bg: `${M.hydra}12` },
  swap: { label: "SWAP", color: M.warning, bg: `${M.warning}12` },
  drop: { label: "DROP", color: M.danger, bg: `${M.danger}12` },
  limit: { label: "LIMIT", color: M.fat, bg: `${M.fat}12` },
  critical: { label: "KEY", color: M.danger, bg: `${M.danger}15` },
};

const STORAGE_KEY = "solo-leveling-diet-v1";

async function loadChecked() {
  try {
    const r = await window.storage.get(STORAGE_KEY);
    if (r && r.value) return JSON.parse(r.value);
  } catch (e) {}
  return {};
}

async function saveChecked(data) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.error("Save failed:", e); }
}

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ─── Components ───

function CheckItem({ item, checked, onToggle, showStatus }) {
  const [hover, setHover] = useState(false);
  const status = showStatus && item.status ? STATUS_CONFIG[item.status] : null;
  return (
    <div
      onClick={() => onToggle(item.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px",
        background: checked ? `${M.success}08` : hover ? `${M.textMuted}08` : "transparent",
        borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
        borderLeft: checked ? `2px solid ${M.success}50` : "2px solid transparent",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 1,
        border: checked ? `2px solid ${M.success}` : `2px solid ${M.textMuted}50`,
        background: checked ? `${M.success}20` : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s", fontSize: "0.7rem", color: M.success,
      }}>{checked ? "✓" : ""}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: "0.88rem", fontWeight: 600, color: checked ? `${M.success}bb` : M.text,
          textDecoration: checked ? "line-through" : "none",
          textDecorationColor: `${M.success}40`,
          fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.3,
        }}>
          {item.text}
          {status && (
            <span style={{
              marginLeft: 8, fontSize: "0.58rem", fontWeight: 800,
              color: status.color, background: status.bg,
              padding: "2px 6px", borderRadius: 4, letterSpacing: "0.1em",
              verticalAlign: "middle",
            }}>{status.label}</span>
          )}
        </div>
        {item.detail && (
          <div style={{
            fontSize: "0.72rem", color: M.textDim, marginTop: 3,
            fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.4,
          }}>{item.detail}</div>
        )}
        {(item.protein > 0 || item.cals > 0) && (
          <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: "0.62rem", fontFamily: "'Rajdhani', sans-serif" }}>
            {item.protein > 0 && <span style={{ color: M.protein, fontWeight: 700 }}>{item.protein}g protein</span>}
            {item.cals > 0 && <span style={{ color: M.textMuted }}>{item.cals} cal</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function MealSection({ meal, checked, onToggle }) {
  const completedCount = meal.items.filter(i => checked[i.id]).length;
  const allDone = completedCount === meal.items.length;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${M.bgCard}cc 0%, ${M.bg}cc 100%)`,
      border: allDone ? `1px solid ${M.success}30` : `1px solid ${M.textMuted}18`,
      borderRadius: 14, overflow: "hidden", marginBottom: 12,
      transition: "border-color 0.3s",
    }}>
      <div style={{
        padding: "14px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${M.textMuted}12`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: "1.4rem" }}>{meal.icon}</div>
          <div>
            <div style={{
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem",
              color: allDone ? M.success : M.text, letterSpacing: "0.03em",
            }}>{meal.name}</div>
            <div style={{
              fontSize: "0.65rem", color: M.textDim, fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: "0.1em",
            }}>{meal.time}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontSize: "0.6rem", color: allDone ? M.success : M.textMuted,
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.1em",
          }}>{completedCount}/{meal.items.length}</div>
          {meal.totalProtein > 0 && (
            <div style={{ fontSize: "0.6rem", color: M.protein, fontFamily: "'Rajdhani', sans-serif", marginTop: 1 }}>
              ~{meal.totalProtein}g protein
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: "6px 4px" }}>
        {meal.items.map(item => (
          <CheckItem key={item.id} item={item} checked={checked[item.id]} onToggle={onToggle} showStatus={true} />
        ))}
      </div>
      {meal.notes && (
        <div style={{
          padding: "10px 18px 14px", borderTop: `1px solid ${M.textMuted}08`,
          fontSize: "0.72rem", color: M.textDim, fontStyle: "italic",
          fontFamily: "'Rajdhani', sans-serif", lineHeight: 1.5,
        }}>💡 {meal.notes}</div>
      )}
    </div>
  );
}

// ─── Main ───

export default function DietaryChecklist() {
  const [checked, setChecked] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("meals");

  useEffect(() => {
    (async () => {
      const saved = await loadChecked();
      const today = getToday();
      if (saved && saved._date === today) {
        setChecked(saved);
      } else {
        setChecked({ _date: today });
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) saveChecked(checked);
  }, [checked, loaded]);

  const toggle = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalProtein = MEALS.reduce((s, m) => s + m.totalProtein, 0);
  const totalCals = MEALS.reduce((s, m) => s + m.totalCals, 0);
  const allMealItems = MEALS.flatMap(m => m.items);
  const checkedMealCount = allMealItems.filter(i => checked[i.id]).length;
  const checkedHydration = HYDRATION.filter(h => checked[h.id]).length;
  const checkedAlani = ALANI_RULES.filter(a => checked[a.id]).length;
  const totalCheckable = allMealItems.length + HYDRATION.length + ALANI_RULES.length;
  const totalChecked = checkedMealCount + checkedHydration + checkedAlani;
  const overallPct = Math.round((totalChecked / totalCheckable) * 100);

  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", background: M.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: M.textDim, fontFamily: "'Rajdhani', sans-serif", fontSize: "1.1rem", letterSpacing: "0.3em" }}>
          LOADING RATIONS...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${M.bg} 0%, ${M.bgCard} 50%, ${M.bg} 100%)`,
      color: M.text, fontFamily: "'Rajdhani', sans-serif", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:${M.textMuted}40; border-radius:2px; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0, opacity: 0.02, pointerEvents: "none",
        backgroundImage: `linear-gradient(${M.teal}20 1px, transparent 1px), linear-gradient(90deg, ${M.teal}20 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* Header */}
        <div style={{
          textAlign: "center", marginBottom: 20, padding: "20px 16px",
          background: `linear-gradient(160deg, ${M.bgLight}cc 0%, ${M.bgCard}cc 100%)`,
          border: `1px solid ${M.textMuted}20`, borderRadius: 16,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
            width: 200, height: 200, borderRadius: "50%",
            background: `radial-gradient(circle, ${M.teal}20 0%, transparent 60%)`,
            pointerEvents: "none",
          }} />
          <div style={{
            fontSize: "0.6rem", letterSpacing: "0.5em", color: M.textMuted,
            textTransform: "uppercase", marginBottom: 6,
          }}>SYSTEM: NUTRITION PROTOCOL</div>
          <div style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: "1.6rem", fontWeight: 900,
            color: M.teal, letterSpacing: "0.05em",
            textShadow: `0 0 20px ${M.teal}40`,
          }}>RATION CONTROL</div>
          <div style={{ fontSize: "0.78rem", color: M.textDim, marginTop: 6 }}>
            Daily dietary checklist — quest to jacked-ness
          </div>

          {/* Daily progress */}
          <div style={{ marginTop: 16 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", fontSize: "0.65rem",
              color: M.textDim, marginBottom: 4, letterSpacing: "0.1em",
            }}>
              <span>DAILY COMPLIANCE</span>
              <span>{overallPct}%</span>
            </div>
            <div style={{ height: 4, background: `${M.textMuted}18`, borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${overallPct}%`,
                background: overallPct >= 80 ? `linear-gradient(90deg, ${M.success}, ${M.teal})`
                  : overallPct >= 50 ? `linear-gradient(90deg, ${M.warning}, ${M.sea})`
                  : `linear-gradient(90deg, ${M.danger}, ${M.warning})`,
                borderRadius: 2, transition: "width 0.6s ease",
              }} />
            </div>
          </div>

          {/* Macro targets */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 14 }}>
            {[
              { label: "PROTEIN TARGET", value: `~${totalProtein}g`, color: M.protein },
              { label: "CALORIES", value: `~${totalCals.toLocaleString()}`, color: M.textDim },
              { label: "WATER", value: "80 oz", color: M.hydra },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.55rem", color: M.textMuted, letterSpacing: "0.12em", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 0, marginBottom: 18,
          background: `${M.bgCard}80`, borderRadius: 10, padding: 3,
          border: `1px solid ${M.textMuted}15`,
        }}>
          {[
            { id: "meals", label: "MEALS", icon: "🍽️", count: `${checkedMealCount}/${allMealItems.length}` },
            { id: "hydration", label: "HYDRATION", icon: "💧", count: `${checkedHydration}/${HYDRATION.length}` },
            { id: "rules", label: "RULES", icon: "⚠️", count: `${checkedAlani}/${ALANI_RULES.length}` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 0",
              background: tab === t.id ? `linear-gradient(135deg, ${M.teal}12, ${M.teal}06)` : "transparent",
              border: tab === t.id ? `1px solid ${M.teal}28` : "1px solid transparent",
              borderRadius: 8, cursor: "pointer",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
              fontSize: "0.72rem", letterSpacing: "0.1em",
              color: tab === t.id ? M.teal : M.textMuted, transition: "all 0.2s",
            }}>{t.icon} {t.label} <span style={{ opacity: 0.6 }}>{t.count}</span></button>
          ))}
        </div>

        {/* MEALS TAB */}
        {tab === "meals" && (
          <div>
            {MEALS.map(meal => (
              <MealSection key={meal.id} meal={meal} checked={checked} onToggle={toggle} />
            ))}

            {/* Legend */}
            <div style={{
              padding: "12px 16px", marginTop: 8,
              background: `${M.bgCard}88`, border: `1px solid ${M.textMuted}12`,
              borderRadius: 10,
            }}>
              <div style={{ fontSize: "0.6rem", color: M.textMuted, letterSpacing: "0.2em", marginBottom: 8 }}>ITEM LEGEND</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <div key={key} style={{
                    fontSize: "0.6rem", fontWeight: 700, color: cfg.color,
                    background: cfg.bg, padding: "3px 8px", borderRadius: 4,
                    letterSpacing: "0.08em",
                  }}>{cfg.label} = {key === "keep" ? "Already doing" : key === "add" ? "New addition" : key === "swap" ? "Replace current" : key === "drop" ? "Remove this" : key === "limit" ? "Reduce amount" : "Essential"}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HYDRATION TAB */}
        {tab === "hydration" && (
          <div style={{
            background: `linear-gradient(135deg, ${M.bgCard}cc 0%, ${M.bg}cc 100%)`,
            border: `1px solid ${M.textMuted}18`, borderRadius: 14, overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 18px", borderBottom: `1px solid ${M.textMuted}12`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ fontSize: "1.4rem" }}>💧</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: M.hydra }}>Hydration Protocol</div>
                <div style={{ fontSize: "0.65rem", color: M.textDim, letterSpacing: "0.1em" }}>TARGET: 80 OZ / DAY</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: "1.1rem", fontWeight: 800, color: checkedHydration === 5 ? M.success : M.hydra }}>
                {checkedHydration * 16} oz
              </div>
            </div>
            <div style={{ padding: "6px 4px" }}>
              {HYDRATION.map(h => (
                <div key={h.id} onClick={() => toggle(h.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    cursor: "pointer", transition: "all 0.2s",
                    background: checked[h.id] ? `${M.hydra}08` : "transparent",
                    borderLeft: checked[h.id] ? `2px solid ${M.hydra}50` : "2px solid transparent",
                    borderRadius: 8,
                  }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    border: checked[h.id] ? `2px solid ${M.hydra}` : `2px solid ${M.textMuted}50`,
                    background: checked[h.id] ? `${M.hydra}20` : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", color: M.hydra, transition: "all 0.2s",
                  }}>{checked[h.id] ? "✓" : ""}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "0.88rem", fontWeight: 600,
                      color: checked[h.id] ? `${M.hydra}bb` : M.text,
                      textDecoration: checked[h.id] ? "line-through" : "none",
                      textDecorationColor: `${M.hydra}40`,
                    }}>{h.text}</div>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: M.textMuted, fontWeight: 600 }}>{h.time}</div>
                </div>
              ))}
            </div>
            <div style={{
              padding: "12px 18px", borderTop: `1px solid ${M.textMuted}08`,
              fontSize: "0.72rem", color: M.textDim, fontStyle: "italic", lineHeight: 1.5,
            }}>💡 80 oz is perfect. On gym days, add one extra 16 oz glass. You're already close — just spread it out instead of chugging.</div>
          </div>
        )}

        {/* RULES TAB */}
        {tab === "rules" && (
          <div>
            {/* Alani Nu */}
            <div style={{
              background: `linear-gradient(135deg, ${M.bgCard}cc 0%, ${M.bg}cc 100%)`,
              border: `1px solid ${M.warning}20`, borderRadius: 14, overflow: "hidden", marginBottom: 12,
            }}>
              <div style={{
                padding: "14px 18px", borderBottom: `1px solid ${M.textMuted}12`,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ fontSize: "1.3rem" }}>⚡</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: M.warning }}>Alani Nu Protocol</div>
                  <div style={{ fontSize: "0.65rem", color: M.textDim, letterSpacing: "0.1em" }}>CAFFEINE MANAGEMENT</div>
                </div>
              </div>
              <div style={{ padding: "6px 4px" }}>
                {ALANI_RULES.map(a => (
                  <CheckItem key={a.id} item={a} checked={checked[a.id]} onToggle={toggle} showStatus={false} />
                ))}
              </div>
              <div style={{
                padding: "12px 18px", borderTop: `1px solid ${M.textMuted}08`,
                fontSize: "0.72rem", color: M.textDim, fontStyle: "italic", lineHeight: 1.5,
              }}>💡 2-3 Alani a day = up to 600mg caffeine. That's messing with your sleep, which feeds the depression, which makes training harder. One is fine. The rest is habit, not need.</div>
            </div>

            {/* Summary card */}
            <div style={{
              background: `linear-gradient(135deg, ${M.bgLight}cc 0%, ${M.bgCard}cc 100%)`,
              border: `1px solid ${M.textMuted}20`, borderRadius: 14, padding: "18px",
            }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: M.textMuted, textTransform: "uppercase", marginBottom: 14 }}>
                THE GAMEPLAN — TL;DR
              </div>
              {[
                { icon: "✅", text: "Breakfast is locked. Don't change it.", color: M.success },
                { icon: "🔴", text: "Eat actual lunch. This fixes the late-night snacking.", color: M.danger },
                { icon: "🔄", text: "Swap dried mangos for protein bar or yogurt + nuts.", color: M.warning },
                { icon: "⬇️", text: "Max 1 Alani Nu. None after 2 PM.", color: M.warning },
                { icon: "🛡️", text: "Greek yogurt + tea after 8 PM. Brush teeth at 9.", color: M.hydra },
                { icon: "🍝", text: "Goodles = side dish, not main. Eat protein first.", color: M.fat },
                { icon: "💪", text: "Target ~167g protein / day. Currently you're at ~80-90g.", color: M.protein },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0",
                  fontSize: "0.82rem", color: M.text, lineHeight: 1.4,
                }}>
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date */}
        <div style={{
          textAlign: "center", marginTop: 20,
          fontSize: "0.6rem", color: M.textMuted, letterSpacing: "0.2em",
        }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          <br />RESETS DAILY
        </div>
      </div>
    </div>
  );
}
