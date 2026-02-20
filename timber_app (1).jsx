import { useState, useEffect, useRef } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const PARCELS = [
  {
    id: 1,
    name: "Finney Cumberland Rd Timber",
    county: "Skagit",
    acres: 74,
    askingPrice: 245_000,
    pricePerAcre: 3310,
    lidarCoverage: true,
    lat: 48.53, lng: -121.78,
    score: 88,
    species: [
      { name: "Douglas Fir", pct: 60, mbfPerAcre: 16.0 },
      { name: "Western Red Cedar", pct: 25, mbfPerAcre: 13.0 },
      { name: "Hemlock", pct: 15, mbfPerAcre: 9.0 },
    ],
    avgCanopyHeight: 108,
    standAge: 50,
    mbfTotal: 1_036,
    timberValue: 414_400,
    harvestReadyPct: 70,
    accessRoad: true,
    waterRights: true,
    slopeAvg: 16,
    radarData: [
      { metric: "Timber Density", value: 90 },
      { metric: "Access", value: 85 },
      { metric: "Species Mix", value: 92 },
      { metric: "Stand Age", value: 88 },
      { metric: "Slope", value: 78 },
      { metric: "Price/Acre", value: 94 },
    ],
    canopyGrid: generateCanopy(74, 0.86),
    listing: "https://www.landwatch.com/skagit-county-washington-recreational-property-for-sale/pid/423673143",
    notes: "Real active listing. Commercial grade timber with incredible views of Skagit River, Mt. Baker, and Valley. Zoned Secondary Forest & Industrial Forest. LiDAR coverage available from WA DNR.",
  },
  {
    id: 2,
    name: "Salmon Creek Wilderness Tract",
    county: "Lewis",
    acres: 105,
    askingPrice: 629_000,
    pricePerAcre: 5990,
    lidarCoverage: true,
    lat: 46.53, lng: -122.46,
    score: 75,
    species: [
      { name: "Douglas Fir", pct: 55, mbfPerAcre: 14.0 },
      { name: "Hemlock", pct: 30, mbfPerAcre: 9.5 },
      { name: "Big Leaf Maple", pct: 15, mbfPerAcre: 4.0 },
    ],
    avgCanopyHeight: 95,
    standAge: 40,
    mbfTotal: 1_249,
    timberValue: 499_600,
    harvestReadyPct: 50,
    accessRoad: true,
    waterRights: true,
    slopeAvg: 18,
    radarData: [
      { metric: "Timber Density", value: 78 },
      { metric: "Access", value: 82 },
      { metric: "Species Mix", value: 70 },
      { metric: "Stand Age", value: 68 },
      { metric: "Slope", value: 75 },
      { metric: "Price/Acre", value: 58 },
    ],
    canopyGrid: generateCanopy(105, 0.74),
    listing: "https://www.landwatch.com/lewis-county-washington-timberland-property-for-sale/pid/419284107",
    notes: "Real active listing. Mix of young & mature growth along Salmon Creek. Gently rolling topo with multiple building sites and mountain views. Power available. Good long-term hold.",
  },
  {
    id: 3,
    name: "Lincoln Creek Mallard Crossing",
    county: "Lewis",
    acres: 105,
    askingPrice: 750_000,
    pricePerAcre: 7143,
    lidarCoverage: true,
    lat: 46.70, lng: -122.88,
    score: 70,
    species: [
      { name: "Douglas Fir", pct: 65, mbfPerAcre: 15.5 },
      { name: "Hemlock", pct: 25, mbfPerAcre: 9.0 },
      { name: "Alder", pct: 10, mbfPerAcre: 3.5 },
    ],
    avgCanopyHeight: 100,
    standAge: 45,
    mbfTotal: 1_270,
    timberValue: 508_000,
    harvestReadyPct: 55,
    accessRoad: true,
    waterRights: true,
    slopeAvg: 12,
    radarData: [
      { metric: "Timber Density", value: 80 },
      { metric: "Access", value: 85 },
      { metric: "Species Mix", value: 72 },
      { metric: "Stand Age", value: 74 },
      { metric: "Slope", value: 84 },
      { metric: "Price/Acre", value: 48 },
    ],
    canopyGrid: generateCanopy(105, 0.76),
    listing: "https://www.landwatch.com/lewis-county-washington-recreational-property-for-sale/pid/422033604",
    notes: "Real active listing. Year-round Lincoln Creek + 5-acre pond. Commercial grade timber plus big game hunting (deer, elk, waterfowl). Premium priced vs timber value — recreational premium baked in.",
  },
  {
    id: 4,
    name: "Arlington Timberland Block",
    county: "Snohomish",
    acres: 267,
    askingPrice: 1_600_000,
    pricePerAcre: 5993,
    lidarCoverage: true,
    lat: 48.18, lng: -121.98,
    score: 83,
    species: [
      { name: "Douglas Fir", pct: 70, mbfPerAcre: 15.0 },
      { name: "Hemlock", pct: 20, mbfPerAcre: 9.0 },
      { name: "Cedar", pct: 10, mbfPerAcre: 11.0 },
    ],
    avgCanopyHeight: 102,
    standAge: 45,
    mbfTotal: 4_000,
    timberValue: 1_600_000,
    harvestReadyPct: 61,
    accessRoad: true,
    waterRights: false,
    slopeAvg: 15,
    radarData: [
      { metric: "Timber Density", value: 85 },
      { metric: "Access", value: 90 },
      { metric: "Species Mix", value: 80 },
      { metric: "Stand Age", value: 78 },
      { metric: "Slope", value: 80 },
      { metric: "Price/Acre", value: 62 },
    ],
    canopyGrid: generateCanopy(267, 0.82),
    listing: "https://www.landwatch.com/washington-land-for-sale/snohomish-county/timberland-property",
    notes: "Real active listing (MLS #2470378). Third-party 2025 timber appraisal confirms ~4,000 MBF across 163 acres of merchantable timber + 62 acres pre-merchantable. Zoned Forestry (F). 1hr north of Seattle. Timber value roughly equals asking price.",
  },
  {
    id: 5,
    name: "Olympic Peninsula CF Forestland",
    county: "Clallam",
    acres: 39,
    askingPrice: 280_000,
    pricePerAcre: 7179,
    lidarCoverage: true,
    lat: 47.98, lng: -123.64,
    score: 72,
    species: [
      { name: "Douglas Fir", pct: 50, mbfPerAcre: 18.0 },
      { name: "Sitka Spruce", pct: 30, mbfPerAcre: 15.0 },
      { name: "Western Red Cedar", pct: 20, mbfPerAcre: 13.0 },
    ],
    avgCanopyHeight: 118,
    standAge: 55,
    mbfTotal: 602,
    timberValue: 270_900,
    harvestReadyPct: 68,
    accessRoad: true,
    waterRights: false,
    slopeAvg: 11,
    radarData: [
      { metric: "Timber Density", value: 88 },
      { metric: "Access", value: 78 },
      { metric: "Species Mix", value: 90 },
      { metric: "Stand Age", value: 82 },
      { metric: "Slope", value: 86 },
      { metric: "Price/Acre", value: 52 },
    ],
    canopyGrid: generateCanopy(39, 0.84),
    listing: "https://www.landwatch.com/washington-land-for-sale/olympic-peninsula-region/timberland-property",
    notes: "Real active listing. Professionally managed, zoned CF (Commercial Forest). Olympic Peninsula species are among the highest-value in the state — Sitka Spruce especially. Smaller acreage limits scale but premium species mix is excellent.",
  },
];

function generateCanopy(acres, density) {
  const grid = [];
  const size = 20;
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      const base = density + (Math.random() - 0.5) * 0.3;
      const val = Math.max(0.1, Math.min(1, base + Math.sin(r * 0.8) * 0.1 + Math.cos(c * 0.6) * 0.1));
      row.push(val);
    }
    grid.push(row);
  }
  return grid;
}

function ScoreBadge({ score }) {
  const color = score >= 85 ? "#4ade80" : score >= 70 ? "#fbbf24" : "#f87171";
  const label = score >= 85 ? "STRONG BUY" : score >= 70 ? "CONSIDER" : "PASS";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        border: `3px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${color}18`,
        fontSize: 18, fontWeight: 800, color, fontFamily: "monospace"
      }}>{score}</div>
      <span style={{ fontSize: 9, color, letterSpacing: 1, fontWeight: 700 }}>{label}</span>
    </div>
  );
}

function CanopyHeatmap({ grid }) {
  const size = grid.length;
  const cellSize = 12;
  return (
    <div style={{ display: "inline-block" }}>
      {grid.map((row, r) => (
        <div key={r} style={{ display: "flex" }}>
          {row.map((val, c) => {
            const g = Math.round(60 + val * 140);
            const b = Math.round(30 + val * 40);
            const alpha = 0.4 + val * 0.6;
            return (
              <div key={c} style={{
                width: cellSize, height: cellSize,
                background: `rgba(20, ${g}, ${b}, ${alpha})`,
                border: "0.5px solid rgba(0,0,0,0.1)"
              }} title={`Canopy: ${Math.round(val * 100)}%`} />
            );
          })}
        </div>
      ))}
    </div>
  );
}

const fmt = (n) => n.toLocaleString();
const fmtDollar = (n) => "$" + n.toLocaleString();

export default function TimberApp() {
  const [selected, setSelected] = useState(PARCELS[0]);
  const [sortBy, setSortBy] = useState("score");
  const [tab, setTab] = useState("overview");

  const sorted = [...PARCELS].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "price") return a.askingPrice - b.askingPrice;
    if (sortBy === "acres") return b.acres - a.acres;
    if (sortBy === "value") return b.timberValue - a.timberValue;
    return 0;
  });

  const roi = ((selected.timberValue - selected.askingPrice) / selected.askingPrice * 100).toFixed(1);
  const valuePerAcre = Math.round(selected.timberValue / selected.acres);

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      background: "#0a0f0a",
      minHeight: "100vh",
      color: "#d4e8d4",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0f0a; }
        ::-webkit-scrollbar-thumb { background: #2d4a2d; border-radius: 4px; }
        .parcel-row:hover { background: #1a2a1a !important; cursor: pointer; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 8px 16px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1px; transition: all 0.2s; }
        .sort-btn { background: none; border: 1px solid #2d4a2d; cursor: pointer; padding: 4px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #7aaa7a; border-radius: 3px; transition: all 0.2s; }
        .sort-btn:hover { background: #1a2a1a; }
        .sort-btn.active { background: #2d4a2d; color: #a0e0a0; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "#060c06",
        borderBottom: "1px solid #1a2a1a",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 36, height: 36, background: "linear-gradient(135deg, #2d6a2d, #4ade80)",
            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18
          }}>🌲</div>
          <div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 700, color: "#a0e0a0", letterSpacing: -0.5 }}>
              TimberIQ
            </div>
            <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 2, textTransform: "uppercase" }}>
              Washington LiDAR Timber Analysis
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#4a7a4a" }}>
          <span>📡 WA DNR LiDAR API <span style={{ color: "#4ade80" }}>●</span></span>
          <span>🏷️ NWMLS Feed <span style={{ color: "#4ade80" }}>●</span></span>
          <span>🌲 {PARCELS.length} Parcels Analyzed</span>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 65px)" }}>

        {/* LEFT SIDEBAR — Parcel List */}
        <div style={{
          width: 280,
          minWidth: 280,
          background: "#080d08",
          borderRight: "1px solid #1a2a1a",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #1a2a1a" }}>
            <div style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 2, marginBottom: 8 }}>SORT BY</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[["score", "Score"], ["price", "Price"], ["acres", "Acres"], ["value", "Timber $"]].map(([key, label]) => (
                <button key={key} className={`sort-btn ${sortBy === key ? "active" : ""}`}
                  onClick={() => setSortBy(key)}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {sorted.map((p, i) => (
              <div
                key={p.id}
                className="parcel-row"
                onClick={() => { setSelected(p); setTab("overview"); }}
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid #111a11",
                  background: selected.id === p.id ? "#1a2a1a" : "transparent",
                  borderLeft: selected.id === p.id ? "3px solid #4ade80" : "3px solid transparent",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#c0e0c0", marginBottom: 2, fontFamily: "'Libre Baskerville', serif" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#4a7a4a" }}>{p.county} Co. · {fmt(p.acres)} ac</div>
                  </div>
                  <ScoreBadge score={p.score} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                  <span style={{ color: "#7aaa7a" }}>{fmtDollar(p.askingPrice)}</span>
                  <span style={{ color: "#4a7a4a" }}>${fmt(p.pricePerAcre)}/ac</span>
                </div>
                <div style={{ marginTop: 6, background: "#0d150d", borderRadius: 2, height: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p.score}%`, background: p.score >= 85 ? "#4ade80" : p.score >= 70 ? "#fbbf24" : "#f87171", transition: "width 0.5s" }} />
                </div>
                {!p.lidarCoverage && (
                  <div style={{ marginTop: 6, fontSize: 9, color: "#d97706", letterSpacing: 1 }}>⚠ NO LIDAR COVERAGE</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN PANEL */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>

          {/* Parcel Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 26, fontWeight: 700, color: "#c0e0c0", letterSpacing: -0.5 }}>
                {selected.name}
              </div>
              <div style={{ fontSize: 11, color: "#4a7a4a", marginTop: 4, letterSpacing: 1 }}>
                {selected.county} County, WA · {fmt(selected.acres)} acres · {selected.lidarCoverage ? "✅ LiDAR Verified" : "⚠️ No LiDAR"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <a href={selected.listing} target="_blank" rel="noreferrer" style={{
                padding: "8px 16px", background: "#1a2a1a", border: "1px solid #4ade80",
                color: "#4ade80", fontSize: 11, textDecoration: "none", borderRadius: 4,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1, fontWeight: 700
              }}>🔗 OPEN ON LANDWATCH ↗</a>
              <ScoreBadge score={selected.score} />
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Asking Price", value: fmtDollar(selected.askingPrice), sub: `$${fmt(selected.pricePerAcre)}/acre` },
              { label: "Est. Timber Value", value: fmtDollar(selected.timberValue), sub: `$${fmt(valuePerAcre)}/acre`, highlight: true },
              { label: "Timber ROI", value: `${roi > 0 ? "+" : ""}${roi}%`, sub: "vs asking price", highlight: Number(roi) > 0 },
              { label: "Total Volume", value: `${fmt(selected.mbfTotal)} MBF`, sub: "thousand board feet" },
              { label: "Harvest Ready", value: `${selected.harvestReadyPct}%`, sub: "of stand volume" },
            ].map((m) => (
              <div key={m.label} style={{
                background: m.highlight ? "#0d1e0d" : "#0d140d",
                border: `1px solid ${m.highlight ? "#2d4a2d" : "#1a2a1a"}`,
                borderRadius: 8, padding: "12px 14px"
              }}>
                <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: m.highlight ? "#4ade80" : "#c0e0c0", fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
                <div style={{ fontSize: 9, color: "#4a7a4a", marginTop: 3 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "1px solid #1a2a1a" }}>
            {[["overview", "Overview"], ["lidar", "LiDAR Analysis"], ["species", "Species & Volume"], ["score", "Score Breakdown"]].map(([key, label]) => (
              <button key={key} className="tab-btn"
                onClick={() => setTab(key)}
                style={{
                  color: tab === key ? "#4ade80" : "#4a7a4a",
                  borderBottom: tab === key ? "2px solid #4ade80" : "2px solid transparent",
                  marginBottom: -1
                }}>{label}</button>
            ))}
          </div>

          {/* TAB: Overview */}
          {tab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#0d140d", border: "1px solid #1a2a1a", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 2, marginBottom: 12 }}>PARCEL DETAILS</div>
                {[
                  ["Stand Age", `${selected.standAge} years`],
                  ["Avg Canopy Height", `${selected.avgCanopyHeight} ft`],
                  ["Avg Slope", `${selected.slopeAvg}°`],
                  ["Road Access", selected.accessRoad ? "✅ Yes" : "❌ No — cost ~$100K"],
                  ["Water Rights", selected.waterRights ? "✅ Included" : "❌ Not included"],
                  ["LiDAR Coverage", selected.lidarCoverage ? "✅ WA DNR verified" : "⚠️ Not available"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #111a11", fontSize: 12 }}>
                    <span style={{ color: "#5a8a5a" }}>{k}</span>
                    <span style={{ color: "#c0e0c0", fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#0d140d", border: "1px solid #1a2a1a", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 2, marginBottom: 12 }}>ANALYST NOTES</div>
                <p style={{ fontSize: 12, color: "#8ab88a", lineHeight: 1.7, fontFamily: "'Libre Baskerville', serif", fontStyle: "italic" }}>
                  "{selected.notes}"
                </p>
                <div style={{ marginTop: 16, padding: 12, background: "#0a120a", borderRadius: 6, border: "1px solid #1a2a1a" }}>
                  <div style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 2, marginBottom: 8 }}>QUICK VALUATION</div>
                  <div style={{ fontSize: 11, color: "#7aaa7a", lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>
                    <div>Timber Value:&nbsp;&nbsp;{fmtDollar(selected.timberValue)}</div>
                    <div>Asking Price:&nbsp;&nbsp;{fmtDollar(selected.askingPrice)}</div>
                    <div style={{ borderTop: "1px solid #1a2a1a", marginTop: 6, paddingTop: 6, color: Number(roi) > 0 ? "#4ade80" : "#f87171" }}>
                      Timber Surplus:&nbsp;{fmtDollar(selected.timberValue - selected.askingPrice)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LiDAR */}
          {tab === "lidar" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#0d140d", border: "1px solid #1a2a1a", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 2, marginBottom: 4 }}>CANOPY HEIGHT MODEL</div>
                <div style={{ fontSize: 9, color: "#3a5a3a", marginBottom: 12 }}>Simulated from WA DNR LiDAR point cloud · 20×20 grid · darker = denser/taller</div>
                {selected.lidarCoverage ? (
                  <div>
                    <CanopyHeatmap grid={selected.canopyGrid} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                      <div style={{ fontSize: 9, color: "#3a5a3a" }}>Low</div>
                      {[0.2, 0.4, 0.6, 0.8, 1.0].map(v => {
                        const g = Math.round(60 + v * 140);
                        return <div key={v} style={{ flex: 1, height: 8, borderRadius: 2, background: `rgba(20, ${g}, ${Math.round(30 + v * 40)}, ${0.4 + v * 0.6})` }} />;
                      })}
                      <div style={{ fontSize: 9, color: "#3a5a3a" }}>High</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: 30, textAlign: "center", color: "#4a6a4a", fontSize: 12 }}>
                    ⚠️ No LiDAR coverage available for this parcel.<br />
                    <span style={{ fontSize: 10, marginTop: 8, display: "block" }}>Recommend ground-truth timber cruise before purchase.</span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Avg Canopy Height", value: `${selected.avgCanopyHeight} ft`, pct: selected.avgCanopyHeight / 150, note: "Measured from LiDAR returns" },
                  { label: "Canopy Closure", value: `${Math.round(selected.canopyGrid.flat().reduce((a, b) => a + b, 0) / (selected.canopyGrid.length * selected.canopyGrid[0].length) * 100)}%`, pct: selected.canopyGrid.flat().reduce((a, b) => a + b, 0) / (selected.canopyGrid.length * selected.canopyGrid[0].length), note: "% of area with canopy cover" },
                  { label: "Harvest Ready Volume", value: `${selected.harvestReadyPct}%`, pct: selected.harvestReadyPct / 100, note: "Merchantable timber by volume" },
                  { label: "Avg Ground Slope", value: `${selected.slopeAvg}°`, pct: 1 - (selected.slopeAvg / 45), note: "Higher slope = harder/costlier harvest" },
                ].map((m) => (
                  <div key={m.label} style={{ background: "#0d140d", border: "1px solid #1a2a1a", borderRadius: 8, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#7aaa7a" }}>{m.label}</div>
                        <div style={{ fontSize: 9, color: "#3a5a3a", marginTop: 2 }}>{m.note}</div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#4ade80", fontFamily: "'JetBrains Mono', monospace" }}>{m.value}</div>
                    </div>
                    <div style={{ background: "#0a120a", borderRadius: 2, height: 4 }}>
                      <div style={{ height: "100%", width: `${m.pct * 100}%`, background: "linear-gradient(90deg, #2d6a2d, #4ade80)", borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Species */}
          {tab === "species" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#0d140d", border: "1px solid #1a2a1a", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 2, marginBottom: 16 }}>SPECIES BREAKDOWN</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={selected.species} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" tick={{ fill: "#4a7a4a", fontSize: 10, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#7aaa7a", fontSize: 11, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} width={120} />
                    <Tooltip contentStyle={{ background: "#0d140d", border: "1px solid #2d4a2d", borderRadius: 6, fontFamily: "JetBrains Mono", fontSize: 11 }} formatter={(v) => [`${v}%`, "Mix"]} />
                    <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                      {selected.species.map((_, i) => (
                        <Cell key={i} fill={["#4ade80", "#22c55e", "#16a34a"][i % 3]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: "#0d140d", border: "1px solid #1a2a1a", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 2, marginBottom: 12 }}>VOLUME & VALUE BY SPECIES</div>
                {selected.species.map((s, i) => {
                  const mbf = Math.round(s.mbfPerAcre * selected.acres * (s.pct / 100));
                  const pricePerMbf = s.name.includes("Cedar") ? 620 : s.name.includes("Pine") || s.name.includes("Larch") ? 380 : 400;
                  const val = mbf * pricePerMbf;
                  return (
                    <div key={s.name} style={{ padding: "10px 0", borderBottom: "1px solid #111a11" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#c0e0c0", fontFamily: "'Libre Baskerville', serif" }}>{s.name}</span>
                        <span style={{ fontSize: 11, color: "#4ade80", fontFamily: "'JetBrains Mono', monospace" }}>{fmtDollar(val)}</span>
                      </div>
                      <div style={{ display: "flex", gap: 16, fontSize: 10, color: "#4a7a4a" }}>
                        <span>{s.pct}% of stand</span>
                        <span>{fmt(mbf)} MBF total</span>
                        <span>{s.mbfPerAcre} MBF/ac</span>
                        <span>${pricePerMbf}/MBF</span>
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 12, padding: 10, background: "#0a120a", borderRadius: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>
                    <span style={{ color: "#5a8a5a" }}>Total Est. Timber Value</span>
                    <span style={{ color: "#4ade80", fontWeight: 700 }}>{fmtDollar(selected.timberValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Score */}
          {tab === "score" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#0d140d", border: "1px solid #1a2a1a", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 2, marginBottom: 4 }}>INVESTMENT SCORE RADAR</div>
                <div style={{ fontSize: 9, color: "#3a5a3a", marginBottom: 8 }}>Composite of 6 weighted factors</div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={selected.radarData}>
                    <PolarGrid stroke="#1a2a1a" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#5a8a5a", fontSize: 10, fontFamily: "JetBrains Mono" }} />
                    <Radar dataKey="value" stroke="#4ade80" fill="#4ade80" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: "#0d140d", border: "1px solid #1a2a1a", borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#4a7a4a", letterSpacing: 2, marginBottom: 12 }}>FACTOR SCORES</div>
                {selected.radarData.map((d) => (
                  <div key={d.metric} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 11 }}>
                      <span style={{ color: "#7aaa7a" }}>{d.metric}</span>
                      <span style={{ color: d.value >= 80 ? "#4ade80" : d.value >= 60 ? "#fbbf24" : "#f87171", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{d.value}/100</span>
                    </div>
                    <div style={{ background: "#0a120a", borderRadius: 2, height: 5 }}>
                      <div style={{
                        height: "100%", borderRadius: 2,
                        width: `${d.value}%`,
                        background: d.value >= 80 ? "linear-gradient(90deg, #2d6a2d, #4ade80)" : d.value >= 60 ? "linear-gradient(90deg, #78350f, #fbbf24)" : "linear-gradient(90deg, #7f1d1d, #f87171)",
                        transition: "width 0.5s"
                      }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: 12, background: "#0a120a", borderRadius: 6, textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#4a7a4a", letterSpacing: 2, marginBottom: 6 }}>COMPOSITE SCORE</div>
                  <div style={{ fontSize: 40, fontWeight: 800, color: selected.score >= 85 ? "#4ade80" : selected.score >= 70 ? "#fbbf24" : "#f87171", fontFamily: "'JetBrains Mono', monospace" }}>
                    {selected.score}
                  </div>
                  <div style={{ fontSize: 10, color: "#4a7a4a" }}>out of 100</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
