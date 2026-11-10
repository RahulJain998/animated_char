import type { BackgroundPreset } from "./types";

export const BACKGROUNDS: {
  id: BackgroundPreset;
  label: string;
  group: "Outdoor" | "Indoor" | "Landscape";
  accent: string;
}[] = [
  { id: "village", label: "Village", group: "Outdoor", accent: "#8ed1a0" },
  { id: "farm", label: "Farm", group: "Outdoor", accent: "#b9d36a" },
  { id: "school", label: "School", group: "Outdoor", accent: "#8fb8ff" },
  { id: "classroom", label: "Classroom", group: "Indoor", accent: "#f3c98b" },
  { id: "city", label: "City", group: "Outdoor", accent: "#93b6ff" },
  { id: "road", label: "Road", group: "Outdoor", accent: "#c3c9d6" },
  { id: "forest", label: "Forest", group: "Landscape", accent: "#79b98a" },
  { id: "mountains", label: "Mountains", group: "Landscape", accent: "#a9c8e8" },
  { id: "house", label: "House", group: "Indoor", accent: "#d4a979" },
  { id: "hospital", label: "Hospital", group: "Outdoor", accent: "#ff9fa8" },
  { id: "army-camp", label: "Army Camp", group: "Outdoor", accent: "#a8b576" },
  { id: "park", label: "Park", group: "Outdoor", accent: "#9fdc8f" },
  { id: "beach", label: "Beach", group: "Landscape", accent: "#ffd28b" },
  { id: "sky", label: "Sky", group: "Landscape", accent: "#a9d8ff" },
];

function cloud(x: number, y: number, scale = 1, opacity = 0.9, fill = "#ffffff") {
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}"><circle cx="0" cy="14" r="24" fill="${fill}"/><circle cx="30" cy="0" r="32" fill="${fill}"/><circle cx="68" cy="12" r="26" fill="${fill}"/><rect x="-24" y="10" width="116" height="28" rx="14" fill="${fill}"/></g>`;
}

function tree(x: number, y: number, scale = 1, color = "#3f8f4a") {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><rect x="-8" y="-34" width="16" height="48" rx="5" fill="#7c5134"/><circle cx="0" cy="-54" r="34" fill="${color}"/><circle cx="-28" cy="-40" r="24" fill="${color}"/><circle cx="28" cy="-40" r="24" fill="${color}"/><circle cx="-10" cy="-64" r="22" fill="${shadeLocal(color, 0.12)}"/></g>`;
}

function shadeLocal(hex: string, amount: number) {
  const clean = hex.replace("#", "");
  const int = parseInt(clean, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  const mix = (v: number) =>
    Math.round(amount >= 0 ? v + (255 - v) * amount : v * (1 + amount))
      .toString(16)
      .padStart(2, "0");
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

function windowGrid(x: number, y: number, cols: number, rows: number, w: number, h: number, gapX: number, gapY: number, fill: string, opacity = 1) {
  const items: string[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      items.push(
        `<rect x="${x + c * (w + gapX)}" y="${y + r * (h + gapY)}" width="${w}" height="${h}" rx="${Math.min(4, h / 3)}" fill="${fill}" opacity="${opacity}"/>`,
      );
    }
  }
  return items.join("");
}

export function buildBackgroundSvg(preset: BackgroundPreset): string {
  switch (preset) {
    case "village":
      return `<defs>
        <linearGradient id="v-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd6ff"/><stop offset="0.62" stop-color="#d9f1ff"/><stop offset="1" stop-color="#fdf1c7"/></linearGradient>
        <linearGradient id="v-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fcf77"/><stop offset="1" stop-color="#4d9b51"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#v-sky)"/>
      <circle cx="1300" cy="150" r="76" fill="#ffe066" opacity=".95"/>
      <circle cx="1300" cy="150" r="110" fill="#ffe066" opacity=".2"/>
      ${cloud(230, 130, 1.1, 0.85)}
      ${cloud(820, 90, 0.8, 0.6)}
      ${cloud(1080, 230, 0.65, 0.5)}
      <path d="M 0 480 Q 200 400 400 470 T 800 460 T 1200 470 T 1600 430 L 1600 550 L 0 550 Z" fill="#bcdc9c"/>
      <path d="M 0 560 Q 260 500 560 550 T 1120 560 T 1600 520 L 1600 650 L 0 650 Z" fill="#9ecf83"/>
      <rect y="600" width="1600" height="300" fill="url(#v-ground)"/>
      <path d="M 700 900 Q 760 720 820 610 Q 890 720 960 900 Z" fill="#d7b889"/>
      <path d="M 760 900 Q 820 760 850 640 L 890 640 Q 900 780 930 900 Z" fill="#c9a373" opacity=".8"/>
      <g transform="translate(360 610)">
        <rect x="-130" y="-150" width="260" height="150" fill="#f6e1bd" stroke="#c9a97d" stroke-width="4"/>
        <path d="M -160 -150 L 0 -270 L 160 -150 Z" fill="#b2563f" stroke="#8e3c2d" stroke-width="4"/>
        <rect x="-34" y="-96" width="68" height="96" rx="4" fill="#8b5e34"/>
        <rect x="-108" y="-116" width="46" height="46" fill="#8fd6ff" stroke="#fff" stroke-width="4"/>
        <rect x="62" y="-116" width="46" height="46" fill="#8fd6ff" stroke="#fff" stroke-width="4"/>
        <rect x="-8" y="-260" width="16" height="50" fill="#8e3c2d"/>
      </g>
      <g transform="translate(1010 620)">
        <rect x="-110" y="-130" width="220" height="130" fill="#f2d7b0" stroke="#c9a97d" stroke-width="4"/>
        <path d="M -135 -130 L 0 -225 L 135 -130 Z" fill="#c46b4b" stroke="#963f2d" stroke-width="4"/>
        <rect x="-30" y="-86" width="60" height="86" fill="#7c5134"/>
        <rect x="-84" y="-104" width="38" height="38" fill="#8fd6ff" stroke="#fff" stroke-width="3"/>
        <rect x="46" y="-104" width="38" height="38" fill="#8fd6ff" stroke="#fff" stroke-width="3"/>
      </g>
      ${tree(160, 650, 1.5, "#3f8f4a")}
      ${tree(1440, 660, 1.2, "#468f3f")}
      ${tree(660, 690, 0.9, "#4d9b51")}
      <path d="M 0 780 Q 300 740 600 770 T 1200 770 T 1600 760" fill="none" stroke="#7ab863" stroke-width="6" opacity=".6"/>
      <g fill="#f4d35e" opacity=".8">
        <circle cx="180" cy="800" r="5"/><circle cx="240" cy="840" r="4"/><circle cx="1220" cy="810" r="5"/><circle cx="1310" cy="850" r="4"/><circle cx="580" cy="830" r="5"/>
      </g>`;
    case "farm":
      return `<defs>
        <linearGradient id="f-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#78c9ff"/><stop offset="0.6" stop-color="#cbeaff"/><stop offset="1" stop-color="#fff6d8"/></linearGradient>
        <linearGradient id="f-field" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c5d96b"/><stop offset="1" stop-color="#7aa944"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#f-sky)"/>
      <circle cx="280" cy="150" r="78" fill="#ffd93d"/>
      <circle cx="280" cy="150" r="118" fill="#ffd93d" opacity=".18"/>
      ${cloud(1050, 130, 1.2, 0.8)}
      ${cloud(700, 230, 0.7, 0.6)}
      <path d="M 0 500 Q 320 420 650 490 T 1200 480 T 1600 450 L 1600 600 L 0 600 Z" fill="#d2e79a"/>
      <rect y="560" width="1600" height="340" fill="url(#f-field)"/>
      ${Array.from({ length: 9 })
        .map((_, i) => `<path d="M ${-200 + i * 230} 900 Q ${-60 + i * 230} 700 ${160 + i * 230} 570" stroke="#a8c45a" stroke-width="26" opacity=".55"/>`)
        .join("")}
      <g transform="translate(1170 590)">
        <rect x="-170" y="-200" width="340" height="200" fill="#b7443e" stroke="#8a2f2a" stroke-width="5"/>
        <path d="M -200 -200 L 0 -340 L 200 -200 Z" fill="#8a2f2a" stroke="#6b231f" stroke-width="5"/>
        <rect x="-70" y="-130" width="140" height="130" rx="4" fill="#f6e1bd" stroke="#d4b383" stroke-width="4"/>
        <path d="M -70 -130 L 0 -200 L 70 -130" fill="#d4b383"/>
        <rect x="-120" y="-170" width="34" height="34" fill="#fef3c7" stroke="#fff" stroke-width="3"/>
        <rect x="86" y="-170" width="34" height="34" fill="#fef3c7" stroke="#fff" stroke-width="3"/>
        <path d="M -40 -220 L 40 -220 L 40 -200 L -40 -200 Z" fill="#f8fafc" opacity=".85"/>
        <path d="M -20 -210 L 20 -210" stroke="#b7443e" stroke-width="3"/>
      </g>
      <g transform="translate(1630 600)">
        <rect x="-60" y="-240" width="120" height="240" fill="#cfd8dc" stroke="#90a4ae" stroke-width="4"/>
        <path d="M -60 -240 Q 0 -300 60 -240" fill="#90a4ae"/>
        <path d="M -60 -180 L 60 -180 M -60 -120 L 60 -120 M -60 -60 L 60 -60" stroke="#b0bec5" stroke-width="4"/>
      </g>
      <g stroke="#9e7449" stroke-width="10" stroke-linecap="round">
        <path d="M 120 720 L 480 720 M 120 670 L 480 670"/>
        <path d="M 140 640 L 140 760 M 300 640 L 300 760 M 460 640 L 460 760"/>
      </g>
      ${tree(80, 680, 1.5, "#3f8f4a")}
      <path d="M 0 850 Q 400 820 800 850 T 1600 840" fill="none" stroke="#6d9e3e" stroke-width="7" opacity=".55"/>`;
    case "school":
      return `<defs>
        <linearGradient id="s-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#82cfff"/><stop offset="1" stop-color="#e6f6ff"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#s-sky)"/>
      <circle cx="1320" cy="150" r="70" fill="#ffe066"/>
      ${cloud(250, 120, 0.9, 0.75)}
      ${cloud(800, 90, 0.65, 0.55)}
      <rect y="600" width="1600" height="300" fill="#85c96b"/>
      <rect y="680" width="1600" height="220" fill="#6bb657"/>
      <g transform="translate(800 600)">
        <rect x="-460" y="-360" width="920" height="360" fill="#f7e7c8" stroke="#cfb58b" stroke-width="5"/>
        <rect x="-460" y="-360" width="920" height="60" fill="#7c5cff"/>
        <rect x="-420" y="-280" width="840" height="260" fill="#fdf6e8"/>
        ${windowGrid(-390, -250, 7, 2, 76, 66, 24, 26, "#a9d8ff", 1)}
        <rect x="-90" y="-120" width="180" height="120" rx="6" fill="#8b5e34" stroke="#5a3823" stroke-width="4"/>
        <circle cx="60" cy="-60" r="5" fill="#ffd166"/>
        <rect x="-160" y="-155" width="320" height="34" rx="8" fill="#1f2937"/>
        <text x="0" y="-131" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="24" font-weight="700" letter-spacing="6">SCHOOL</text>
        <path d="M 300 -360 L 300 -460 L 380 -460 L 380 -435 L 380 -360" fill="#cbd5e1"/>
        <path d="M 380 -460 L 470 -430 L 380 -400 Z" fill="#ef4444"/>
        <rect x="-520" y="-320" width="60" height="320" fill="#f0d8ae" stroke="#cfb58b" stroke-width="4"/>
        <rect x="460" y="-320" width="60" height="320" fill="#f0d8ae" stroke="#cfb58b" stroke-width="4"/>
      </g>
      <path d="M 740 900 Q 780 760 800 600 L 880 600 Q 860 780 900 900 Z" fill="#d8c2a0"/>
      ${tree(180, 640, 1.6, "#3f8f4a")}
      ${tree(1430, 650, 1.3, "#468f3f")}
      ${tree(1230, 600, 0.9, "#4d9b51")}`;
    case "classroom":
      return `<defs>
        <linearGradient id="c-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e9cf"/><stop offset="1" stop-color="#e7d3ad"/></linearGradient>
        <linearGradient id="c-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c99a63"/><stop offset="1" stop-color="#a87845"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#c-wall)"/>
      <rect y="620" width="1600" height="280" fill="url(#c-floor)"/>
      ${Array.from({ length: 9 })
        .map((_, i) => `<path d="M ${i * 200} 900 L ${700 + i * 30} 620" stroke="#8a6338" stroke-width="2" opacity=".2"/>`)
        .join("")}
      <rect x="120" y="120" width="880" height="400" rx="12" fill="#3a2a1f" stroke="#8b5e34" stroke-width="10"/>
      <rect x="145" y="145" width="830" height="350" rx="4" fill="#24352b"/>
      <path d="M 230 220 L 600 220 M 230 275 L 520 275 M 230 330 L 620 330 M 230 385 L 450 385" stroke="#e2e8f0" stroke-width="5" opacity=".65" stroke-linecap="round"/>
      <path d="M 690 220 Q 780 190 830 250 Q 860 310 790 350" fill="none" stroke="#fca5a5" stroke-width="4" opacity=".7"/>
      <circle cx="720" cy="390" r="32" fill="none" stroke="#93c5fd" stroke-width="4" opacity=".7"/>
      <rect x="145" y="520" width="830" height="18" fill="#8b5e34"/>
      <rect x="980" y="100" width="500" height="360" fill="#bfe3ff" stroke="#f8fafc" stroke-width="14"/>
      <path d="M 1230 100 L 1230 460 M 980 280 L 1480 280" stroke="#f8fafc" stroke-width="12"/>
      <rect x="980" y="80" width="500" height="20" fill="#f1f5f9" opacity=".5"/>
      <g transform="translate(1420 100)">
        <circle r="48" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
        <path d="M 0 0 L 0 -32 M 0 0 L 22 14" stroke="#1f2937" stroke-width="5" stroke-linecap="round"/>
        <circle r="5" fill="#1f2937"/>
      </g>
      <g transform="translate(1080 540)">
        <rect x="0" y="0" width="170" height="22" rx="6" fill="#c99a63" stroke="#8a6338" stroke-width="2"/>
        <path d="M 20 22 L 16 82 M 150 22 L 154 82" stroke="#8a6338" stroke-width="7" stroke-linecap="round"/>
      </g>
      <g transform="translate(330 600)">
        <rect x="0" y="-34" width="200" height="26" rx="7" fill="#c99a63" stroke="#8a6338" stroke-width="3"/>
        <rect x="24" y="-8" width="152" height="54" rx="6" fill="#b4844d" stroke="#8a6338" stroke-width="2"/>
        <path d="M 36 46 L 30 120 M 164 46 L 170 120" stroke="#8a6338" stroke-width="8" stroke-linecap="round"/>
        <rect x="58" y="-62" width="76" height="28" rx="5" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      </g>
      <g transform="translate(760 650)">
        <rect x="0" y="-34" width="200" height="26" rx="7" fill="#c99a63" stroke="#8a6338" stroke-width="3"/>
        <rect x="24" y="-8" width="152" height="54" rx="6" fill="#b4844d" stroke="#8a6338" stroke-width="2"/>
        <path d="M 36 46 L 30 120 M 164 46 L 170 120" stroke="#8a6338" stroke-width="8" stroke-linecap="round"/>
        <rect x="72" y="-72" width="56" height="38" rx="4" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
      </g>
      <g transform="translate(1200 650)">
        <rect x="0" y="-34" width="200" height="26" rx="7" fill="#c99a63" stroke="#8a6338" stroke-width="3"/>
        <rect x="24" y="-8" width="152" height="54" rx="6" fill="#b4844d" stroke="#8a6338" stroke-width="2"/>
        <path d="M 36 46 L 30 120 M 164 46 L 170 120" stroke="#8a6338" stroke-width="8" stroke-linecap="round"/>
        <circle cx="100" cy="-60" r="26" fill="#7dd3fc" stroke="#0284c7" stroke-width="2"/>
      </g>`;
    case "city":
      return `<defs>
        <linearGradient id="ci-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c8dff"/><stop offset="0.6" stop-color="#a7c8ff"/><stop offset="1" stop-color="#ffe0c2"/></linearGradient>
        <linearGradient id="ci-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b5563"/><stop offset="1" stop-color="#2f3541"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#ci-sky)"/>
      <circle cx="1280" cy="170" r="68" fill="#fff1a8"/>
      ${cloud(360, 120, 1, 0.6)}
      ${cloud(900, 170, 0.7, 0.5)}
      <g>
        ${[
          [40, 360, 150, 300, "#61739b"],
          [220, 300, 120, 360, "#55688f"],
          [360, 420, 160, 240, "#6d7fa8"],
          [540, 250, 140, 410, "#4d5f86"],
          [700, 380, 120, 280, "#61739b"],
          [840, 310, 180, 350, "#55688f"],
          [1040, 430, 130, 230, "#6d7fa8"],
          [1180, 290, 160, 370, "#4d5f86"],
          [1360, 380, 140, 280, "#61739b"],
          [1510, 330, 180, 330, "#55688f"],
        ]
          .map(
            ([x, y, w, h, color], index) =>
              `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/><rect x="${x}" y="${y}" width="${w}" height="14" fill="#f8fafc" opacity=".15"/>${windowGrid(
                Number(x) + 16,
                Number(y) + 32,
                Math.max(2, Math.floor(Number(w) / 34)),
                Math.max(3, Math.floor(Number(h) / 48)),
                14,
                18,
                18,
                18,
                index % 3 === 0 ? "#ffe8a3" : "#bcd9f7",
                0.8,
              )}`,
          )
          .join("")}
      </g>
      <rect y="660" width="1600" height="240" fill="url(#ci-road)"/>
      <rect y="660" width="1600" height="18" fill="#9ca3af"/>
      <rect y="870" width="1600" height="30" fill="#9ca3af"/>
      <path d="M 60 780 L 160 780 M 260 780 L 360 780 M 460 780 L 560 780 M 660 780 L 760 780 M 860 780 L 960 780 M 1060 780 L 1160 780 M 1260 780 L 1360 780 M 1460 780 L 1560 780" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>
      <g transform="translate(350 600)">
        <path d="M -4 0 L -4 140" stroke="#475569" stroke-width="10"/>
        <path d="M -4 0 Q 24 -20 44 4" fill="none" stroke="#475569" stroke-width="8"/>
        <circle cx="46" cy="4" r="9" fill="#ffe8a3" stroke="#475569" stroke-width="4"/>
      </g>
      <g transform="translate(940 600)">
        <path d="M 4 0 L 4 140" stroke="#475569" stroke-width="10"/>
        <path d="M 4 0 Q -24 -20 -44 4" fill="none" stroke="#475569" stroke-width="8"/>
        <circle cx="-46" cy="4" r="9" fill="#ffe8a3" stroke="#475569" stroke-width="4"/>
      </g>`;
    case "road":
      return `<defs>
        <linearGradient id="r-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd6ff"/><stop offset="1" stop-color="#fef3c7"/></linearGradient>
        <linearGradient id="r-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#596273"/><stop offset="1" stop-color="#303643"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#r-sky)"/>
      <circle cx="1250" cy="140" r="66" fill="#ffe066"/>
      ${cloud(280, 140, 1, 0.7)}
      ${cloud(760, 90, 0.7, 0.5)}
      <path d="M 0 470 Q 280 400 560 460 T 1080 470 T 1600 430 L 1600 620 L 0 620 Z" fill="#a4d08a"/>
      <rect y="560" width="1600" height="340" fill="#86bd70"/>
      <path d="M 0 900 L 620 560 L 980 560 L 1600 900 Z" fill="url(#r-road)"/>
      <path d="M 780 580 L 810 580 L 780 900 L 700 900 Z" fill="#facc15" opacity=".9"/>
      <path d="M 0 610 L 620 575 M 1600 610 L 980 575" stroke="#e2e8f0" stroke-width="8" opacity=".6"/>
      <g transform="translate(280 610)">
        <path d="M 0 0 L 0 -250" stroke="#475569" stroke-width="10"/>
        <path d="M 0 -250 Q -30 -270 -56 -246" fill="none" stroke="#475569" stroke-width="8"/>
        <circle cx="-58" cy="-246" r="10" fill="#ffe8a3" stroke="#475569" stroke-width="4"/>
      </g>
      <g transform="translate(1330 620)">
        <path d="M 0 0 L 0 -250" stroke="#475569" stroke-width="10"/>
        <path d="M 0 -250 Q 30 -270 56 -246" fill="none" stroke="#475569" stroke-width="8"/>
        <circle cx="58" cy="-246" r="10" fill="#ffe8a3" stroke="#475569" stroke-width="4"/>
      </g>
      <g transform="translate(1120 640)">
        <rect x="-50" y="-120" width="100" height="60" rx="8" fill="#3b82f6" stroke="#1d4ed8" stroke-width="4"/>
        <path d="M -24 -60 L -24 0" stroke="#94a3b8" stroke-width="8"/>
        <text x="0" y="-80" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="26" font-weight="700">CITY</text>
      </g>
      ${tree(80, 640, 1.4, "#3f8f4a")}
      ${tree(1540, 640, 1.2, "#468f3f")}`;
    case "forest":
      return `<defs>
        <linearGradient id="fo-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8e6ff"/><stop offset="0.55" stop-color="#e8f7db"/><stop offset="1" stop-color="#8fbd6a"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#fo-sky)"/>
      <path d="M 0 560 Q 300 430 620 520 T 1200 500 T 1600 480 L 1600 900 L 0 900 Z" fill="#6ba053"/>
      <path d="M 0 660 Q 320 570 660 650 T 1240 620 T 1600 610 L 1600 900 L 0 900 Z" fill="#4f8a45"/>
      <path d="M 0 780 Q 380 710 780 780 T 1600 760 L 1600 900 L 0 900 Z" fill="#3d733b"/>
      <g opacity=".35">
        <path d="M 500 0 L 640 0 L 900 900 L 620 900 Z" fill="#fffbd5"/>
        <path d="M 1040 0 L 1130 0 L 1420 900 L 1200 900 Z" fill="#fffbd5"/>
      </g>
      ${[
        [80, 400, 1.9, "#2f6b39"],
        [260, 480, 1.4, "#3c8146"],
        [440, 380, 2.1, "#2c6634"],
        [720, 500, 1.3, "#3c8146"],
        [930, 400, 1.8, "#2f6b39"],
        [1120, 470, 1.5, "#3c8146"],
        [1340, 390, 2.1, "#2c6634"],
        [1520, 500, 1.5, "#3c8146"],
      ]
        .map(([x, y, s, c]) => tree(Number(x), Number(y), Number(s), String(c)))
        .join("")}
      <g fill="#9ee37d" opacity=".85">
        <circle cx="380" cy="560" r="3"/><circle cx="600" cy="620" r="2.5"/><circle cx="880" cy="700" r="3"/><circle cx="1240" cy="640" r="2.5"/><circle cx="1460" cy="730" r="3"/><circle cx="220" cy="750" r="2.5"/>
      </g>
      <path d="M 0 840 Q 500 800 900 840 T 1600 830" fill="none" stroke="#2f5f36" stroke-width="8" opacity=".5"/>`;
    case "mountains":
      return `<defs>
        <linearGradient id="m-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa7ff"/><stop offset="0.5" stop-color="#b9ddff"/><stop offset="1" stop-color="#ffe7cc"/></linearGradient>
        <linearGradient id="m-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5eb7e8"/><stop offset="1" stop-color="#2f7fb5"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#m-sky)"/>
      <circle cx="1260" cy="170" r="72" fill="#fff4b8"/>
      <circle cx="1260" cy="170" r="112" fill="#fff4b8" opacity=".2"/>
      ${cloud(300, 150, 1, 0.7)}
      ${cloud(820, 90, 0.7, 0.5)}
      <path d="M 0 480 L 240 210 L 430 400 L 620 160 L 840 430 L 1050 240 L 1280 450 L 1460 300 L 1600 460 L 1600 620 L 0 620 Z" fill="#8ba9c7"/>
      <path d="M 620 160 L 680 260 L 646 236 L 620 280 L 590 240 L 558 268 Z" fill="#f1f5f9"/>
      <path d="M 240 210 L 290 310 L 260 286 L 238 320 L 212 288 L 188 312 Z" fill="#e2e8f0"/>
      <path d="M 1050 240 L 1100 340 L 1072 316 L 1048 350 L 1024 318 L 1000 342 Z" fill="#e2e8f0"/>
      <path d="M 0 620 Q 400 560 800 610 T 1600 600 L 1600 900 L 0 900 Z" fill="#6e9d68"/>
      <rect y="650" width="1600" height="250" fill="url(#m-lake)"/>
      <path d="M 0 720 Q 400 690 800 720 T 1600 710 M 0 790 Q 380 760 760 790 T 1600 780" fill="none" stroke="#bfe9ff" stroke-width="5" opacity=".5"/>
      ${tree(120, 690, 1.2, "#3d7a45")}
      ${tree(1480, 690, 1.5, "#356f3e")}
      <path d="M 700 300 Q 720 288 740 300 M 760 320 Q 780 308 800 320" fill="none" stroke="#334155" stroke-width="3" stroke-linecap="round"/>`;
    case "house":
      return `<defs>
        <linearGradient id="h-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7ead3"/><stop offset="1" stop-color="#e6cfae"/></linearGradient>
        <linearGradient id="h-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a87445"/><stop offset="1" stop-color="#7d5130"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#h-wall)"/>
      <rect y="680" width="1600" height="220" fill="url(#h-floor)"/>
      <path d="M 0 680 L 1600 680" stroke="#6b4428" stroke-width="10"/>
      <rect x="120" y="120" width="520" height="400" rx="14" fill="#bfe3ff" stroke="#f8fafc" stroke-width="16"/>
      <circle cx="440" cy="220" r="52" fill="#ffe066"/>
      <path d="M 120 420 L 260 300 L 390 420 Z" fill="#86bd70"/>
      <path d="M 300 430 L 470 320 L 640 430 Z" fill="#6ba053"/>
      <path d="M 120 470 L 640 470" stroke="#7dd3fc" stroke-width="18" opacity=".5"/>
      <path d="M 380 120 L 380 520 M 120 320 L 640 320" stroke="#f8fafc" stroke-width="14"/>
      <rect x="760" y="150" width="300" height="220" rx="10" fill="#f8fafc" stroke="#b98b5e" stroke-width="10"/>
      <circle cx="910" cy="250" r="46" fill="#ffcf5b" opacity=".8"/>
      <path d="M 790 320 L 870 260 L 940 320 Z" fill="#7c5cff" opacity=".7"/>
      <path d="M 920 330 L 1000 270 L 1060 330 Z" fill="#3ddc97" opacity=".7"/>
      <g transform="translate(1040 500)">
        <path d="M 0 0 L 0 -120" stroke="#6b4428" stroke-width="10"/>
        <path d="M -70 0 Q -80 -70 0 -82 Q 80 -70 70 0 Q 0 22 -70 0 Z" fill="#7c5cff" stroke="#5b3dd0" stroke-width="4"/>
        <rect x="30" y="-74" width="16" height="22" rx="4" fill="#ffd166"/>
      </g>
      <g transform="translate(220 580)">
        <rect x="0" y="0" width="470" height="140" rx="20" fill="#8b5e34" stroke="#5a3823" stroke-width="5"/>
        <rect x="20" y="-46" width="430" height="60" rx="18" fill="#a06a42" stroke="#5a3823" stroke-width="4"/>
        <rect x="40" y="-36" width="150" height="40" rx="12" fill="#c99a63"/>
        <rect x="230" y="-36" width="150" height="40" rx="12" fill="#c99a63"/>
        <rect x="0" y="98" width="470" height="34" rx="12" fill="#6b4428"/>
      </g>
      <ellipse cx="800" cy="820" rx="440" ry="70" fill="#b78455" opacity=".5"/>
      <ellipse cx="800" cy="820" rx="330" ry="52" fill="#d9a878" opacity=".6"/>
      <g transform="translate(560 730)">
        <rect x="-90" y="-30" width="180" height="50" rx="10" fill="#8b5e34" stroke="#5a3823" stroke-width="4"/>
        <rect x="-70" y="-46" width="60" height="20" rx="6" fill="#f8fafc"/>
        <rect x="10" y="-46" width="60" height="20" rx="6" fill="#f8fafc"/>
      </g>
      <g transform="translate(1350 420)">
        <rect x="0" y="0" width="140" height="190" rx="8" fill="#7c5134" stroke="#5a3823" stroke-width="4"/>
        <rect x="14" y="14" width="112" height="162" rx="5" fill="#a87a4d"/>
        <path d="M 24 60 L 116 60 M 24 100 L 116 100 M 24 140 L 116 140" stroke="#8a6338" stroke-width="3"/>
        <circle cx="100" cy="36" r="5" fill="#ffd166"/>
      </g>`;
    case "hospital":
      return `<defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86d4ff"/><stop offset="1" stop-color="#e8f8ff"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#hs-sky)"/>
      <circle cx="1320" cy="150" r="68" fill="#ffe066"/>
      ${cloud(250, 140, 0.9, 0.7)}
      ${cloud(800, 100, 0.65, 0.5)}
      <rect y="640" width="1600" height="260" fill="#a8b8bf"/>
      <rect y="720" width="1600" height="180" fill="#8f9ca3"/>
      <g transform="translate(800 640)">
        <rect x="-470" y="-420" width="940" height="420" fill="#f7fbfd" stroke="#c3d0d6" stroke-width="5"/>
        <rect x="-470" y="-420" width="940" height="52" fill="#e8f1f5"/>
        ${windowGrid(-430, -330, 8, 3, 68, 54, 28, 26, "#bfe3ff", 1)}
        <rect x="-120" y="-120" width="240" height="120" rx="8" fill="#8fd6ff" stroke="#cbd5e1" stroke-width="6"/>
        <path d="M 0 -120 L 0 0 M -120 -60 L 120 -60" stroke="#cbd5e1" stroke-width="5"/>
        <rect x="-170" y="-440" width="340" height="70" rx="10" fill="#e53935"/>
        <rect x="-28" y="-430" width="56" height="50" rx="5" fill="#fff"/>
        <rect x="-8" y="-446" width="16" height="82" rx="4" fill="#fff" transform="rotate(0 0 -405)"/>
        <rect x="-50" y="-415" width="100" height="18" fill="#fff"/>
        <text x="0" y="-300" text-anchor="middle" fill="#e53935" font-family="sans-serif" font-size="34" font-weight="700" letter-spacing="4">HOSPITAL</text>
      </g>
      <path d="M 760 900 Q 790 760 800 640 L 870 640 Q 870 780 900 900 Z" fill="#cbd5e1"/>
      <g transform="translate(300 760)">
        <rect x="0" y="-70" width="230" height="70" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4"/>
        <rect x="30" y="-46" width="90" height="32" rx="5" fill="#bfe3ff"/>
        <circle cx="60" cy="8" r="18" fill="#374151"/>
        <circle cx="170" cy="8" r="18" fill="#374151"/>
        <rect x="60" y="-92" width="30" height="16" rx="5" fill="#ef4444"/>
      </g>
      ${tree(1260, 660, 1.2, "#3f8f4a")}
      ${tree(1460, 640, 1.4, "#468f3f")}`;
    case "army-camp":
      return `<defs>
        <linearGradient id="a-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb2c9"/><stop offset="1" stop-color="#e8e2c8"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#a-sky)"/>
      <circle cx="1280" cy="170" r="60" fill="#f4e7b0" opacity=".8"/>
      <path d="M 0 480 L 280 300 L 500 450 L 720 280 L 940 470 L 1160 320 L 1380 460 L 1600 340 L 1600 600 L 0 600 Z" fill="#8e9d7a"/>
      <path d="M 0 560 Q 400 510 800 550 T 1600 540 L 1600 900 L 0 900 Z" fill="#b9b184"/>
      <path d="M 0 700 Q 500 660 900 700 T 1600 690 L 1600 900 L 0 900 Z" fill="#a29a70"/>
      <g transform="translate(480 640)">
        <path d="M -230 0 L 0 -170 L 230 0 Z" fill="#5d6b45" stroke="#455136" stroke-width="5"/>
        <path d="M 0 -170 L 0 0" stroke="#455136" stroke-width="4" opacity=".6"/>
        <path d="M 0 -170 L 0 -230" stroke="#3f4a2f" stroke-width="5"/>
        <path d="M 0 -230 L 56 -216 L 0 -200 Z" fill="#d9b44a"/>
      </g>
      <g transform="translate(1080 640)">
        <path d="M -200 0 L 0 -150 L 200 0 Z" fill="#667551" stroke="#455136" stroke-width="5"/>
        <path d="M 0 -150 L 0 0" stroke="#455136" stroke-width="4" opacity=".6"/>
        <path d="M 0 -150 L 0 -205" stroke="#3f4a2f" stroke-width="5"/>
        <path d="M 0 -205 L 50 -192 L 0 -178 Z" fill="#d9b44a"/>
      </g>
      <g transform="translate(780 730)">
        <rect x="-90" y="-40" width="180" height="40" rx="5" fill="#8b7d52" stroke="#675d3c" stroke-width="4"/>
        <rect x="-70" y="-70" width="140" height="34" rx="5" fill="#a19363" stroke="#675d3c" stroke-width="4"/>
      </g>
      <g transform="translate(1380 720)">
        <rect x="-50" y="-80" width="100" height="80" rx="5" fill="#8b7d52" stroke="#675d3c" stroke-width="4"/>
        <path d="M -50 -50 L 50 -50 M -50 -20 L 50 -20" stroke="#675d3c" stroke-width="3"/>
      </g>
      <path d="M 0 840 Q 380 800 760 840 T 1600 830" fill="none" stroke="#8b8258" stroke-width="8" opacity=".6"/>
      <g stroke="#6b6340" stroke-width="7" stroke-linecap="round">
        <path d="M 160 700 L 160 800 M 200 700 L 200 800 M 140 720 L 220 720 M 140 770 L 220 770"/>
      </g>`;
    case "park":
      return `<defs>
        <linearGradient id="p-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ed8ff"/><stop offset="1" stop-color="#f2ffdf"/></linearGradient>
        <linearGradient id="p-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9bda77"/><stop offset="1" stop-color="#5aa54d"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#p-sky)"/>
      <circle cx="1320" cy="140" r="68" fill="#ffe066"/>
      ${cloud(300, 140, 1, 0.8)}
      ${cloud(850, 100, 0.7, 0.6)}
      <path d="M 0 560 Q 300 480 620 540 T 1200 530 T 1600 510 L 1600 620 L 0 620 Z" fill="#b7e198"/>
      <rect y="580" width="1600" height="320" fill="url(#p-grass)"/>
      <path d="M 680 900 Q 760 780 800 660 Q 860 760 920 900 Z" fill="#d9c49a"/>
      <ellipse cx="1180" cy="780" rx="230" ry="80" fill="#5eb7e8" stroke="#3f8fb8" stroke-width="4"/>
      <ellipse cx="1180" cy="770" rx="190" ry="58" fill="#7dd3fc" opacity=".6"/>
      <g transform="translate(530 700)">
        <rect x="-90" y="-30" width="180" height="18" rx="7" fill="#a06a42" stroke="#6b4428" stroke-width="3"/>
        <rect x="-90" y="-72" width="180" height="16" rx="7" fill="#a06a42" stroke="#6b4428" stroke-width="3"/>
        <path d="M -76 -72 L -76 -8 M 76 -72 L 76 -8 M -76 -8 L -82 40 M 76 -8 L 82 40" stroke="#6b4428" stroke-width="7" stroke-linecap="round"/>
        <path d="M -76 -72 L -88 -110 M 76 -72 L 88 -110" stroke="#6b4428" stroke-width="6" stroke-linecap="round"/>
      </g>
      ${tree(150, 650, 1.6, "#3f8f4a")}
      ${tree(1420, 660, 1.3, "#468f3f")}
      ${tree(980, 600, 0.9, "#4d9b51")}
      <g fill="#f472b6"><circle cx="420" cy="790" r="5"/><circle cx="450" cy="810" r="4"/><circle cx="900" cy="840" r="5"/></g>
      <g fill="#facc15"><circle cx="360" cy="830" r="4"/><circle cx="1030" cy="760" r="4"/><circle cx="1260" cy="870" r="5"/></g>
      <g fill="#a78bfa"><circle cx="560" cy="850" r="4"/><circle cx="1300" cy="840" r="4"/></g>`;
    case "beach":
      return `<defs>
        <linearGradient id="b-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aa9ff"/><stop offset="0.5" stop-color="#ffd0a6"/><stop offset="1" stop-color="#ffe8a8"/></linearGradient>
        <linearGradient id="b-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5bd0e8"/><stop offset="1" stop-color="#1f7fb0"/></linearGradient>
        <linearGradient id="b-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7e0a8"/><stop offset="1" stop-color="#e0bf7f"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#b-sky)"/>
      <circle cx="1180" cy="330" r="84" fill="#ffcc66"/>
      <circle cx="1180" cy="330" r="130" fill="#ffcc66" opacity=".2"/>
      ${cloud(300, 160, 1, 0.65)}
      ${cloud(760, 120, 0.7, 0.45)}
      <rect y="450" width="1600" height="240" fill="url(#b-sea)"/>
      ${Array.from({ length: 5 })
        .map((_, i) => `<path d="M ${-100 + i * 380} ${520 + i * 30} Q ${60 + i * 380} ${490 + i * 30} ${240 + i * 380} ${520 + i * 30}" fill="none" stroke="#e0f7ff" stroke-width="7" opacity=".5"/>`)
        .join("")}
      <path d="M 0 650 Q 300 610 600 650 T 1200 650 T 1600 640 L 1600 900 L 0 900 Z" fill="url(#b-sand)"/>
      <g transform="translate(300 650)">
        <path d="M 0 0 Q 10 -150 60 -240" fill="none" stroke="#8b5e34" stroke-width="18" stroke-linecap="round"/>
        <path d="M 60 -240 Q 20 -280 -30 -260 Q 10 -240 20 -220 Q -30 -230 -60 -200 Q -10 -200 10 -190 Q -20 -160 0 -140 Q 30 -190 60 -240 Z" fill="#3fa34d"/>
        <path d="M 60 -240 Q 100 -290 150 -270 Q 110 -250 100 -230 Q 150 -240 180 -210 Q 130 -210 110 -200 Q 140 -170 120 -150 Q 90 -200 60 -240 Z" fill="#4caf50"/>
        <circle cx="52" cy="-220" r="9" fill="#8b5e34"/><circle cx="68" cy="-218" r="9" fill="#8b5e34"/>
      </g>
      <g transform="translate(1050 700)">
        <path d="M -10 0 L -10 -150" stroke="#94a3b8" stroke-width="8"/>
        <path d="M -130 -150 Q 0 -260 130 -150 Z" fill="#ff6b81" stroke="#c94a5d" stroke-width="4"/>
        <path d="M -130 -150 Q 0 -190 130 -150" fill="none" stroke="#ffd166" stroke-width="6"/>
        <path d="M 0 -240 L 0 -150" stroke="#c94a5d" stroke-width="4"/>
      </g>
      <g transform="translate(760 780)">
        <ellipse cx="0" cy="0" rx="34" ry="14" fill="#f8fafc" opacity=".8"/>
        <path d="M -22 -2 Q 0 -20 22 -2" fill="none" stroke="#38bdf8" stroke-width="4"/>
      </g>
      <g fill="#fff" opacity=".7">
        <circle cx="200" cy="70" r="3"/><circle cx="420" cy="100" r="2.5"/><circle cx="620" cy="60" r="3"/><circle cx="920" cy="110" r="2.5"/><circle cx="1400" cy="80" r="3"/>
      </g>`;
    case "sky":
    default:
      return `<defs>
        <linearGradient id="sk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d9bff"/><stop offset="0.5" stop-color="#8ed8ff"/><stop offset="1" stop-color="#ffe6d0"/></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sk-sky)"/>
      <circle cx="1250" cy="200" r="90" fill="#fff1a8"/>
      <circle cx="1250" cy="200" r="140" fill="#fff1a8" opacity=".18"/>
      <circle cx="1250" cy="200" r="190" fill="#fff1a8" opacity=".08"/>
      ${cloud(260, 200, 1.4, 0.85)}
      ${cloud(760, 120, 0.9, 0.65)}
      ${cloud(1040, 320, 1, 0.55)}
      ${cloud(500, 460, 0.75, 0.4)}
      ${cloud(1380, 520, 0.8, 0.35)}
      <g fill="#fff" opacity=".55">
        <circle cx="180" cy="90" r="3"/><circle cx="420" cy="60" r="2.5"/><circle cx="700" cy="250" r="3"/><circle cx="980" cy="80" r="2"/><circle cx="1480" cy="140" r="3"/>
      </g>
      <g transform="translate(400 650)">
        <path d="M 0 0 L 0 -110" stroke="#8b5e34" stroke-width="6" opacity=".6"/>
        <path d="M -60 -110 Q 0 -170 60 -110 Q 0 -90 -60 -110 Z" fill="#ff6b81" opacity=".7"/>
      </g>
      <path d="M 0 780 Q 400 740 800 780 T 1600 770 L 1600 900 L 0 900 Z" fill="#cbe7a9" opacity=".55"/>`;
  }
}

export function buildBackgroundSvgTag(preset: BackgroundPreset) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" preserveAspectRatio="xMidYMid slice">${buildBackgroundSvg(preset)}</svg>`;
}

export function backgroundThumbDataUri(preset: BackgroundPreset) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildBackgroundSvgTag(preset))}`;
}
