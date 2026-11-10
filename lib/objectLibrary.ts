import { shade } from "./colors";
import type { ObjectCategory, ObjectType } from "./types";

export interface ObjectDef {
  type: ObjectType;
  label: string;
  category: ObjectCategory;
  w: number;
  h: number;
  defaultColor: string;
  keywords: string[];
  draw: (color: string) => string;
}

function rounded(x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, sw = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ""}/>`;
}

const wheel = (cx: number, cy: number, r: number, hub = "#cbd5e1") =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1f232b"/><circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="${hub}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.2}" fill="#4b5563"/>`;

const OBJECTS: ObjectDef[] = [
  {
    type: "tractor",
    label: "Tractor",
    category: "farm",
    w: 230,
    h: 160,
    defaultColor: "#2f80ed",
    keywords: ["farm", "vehicle", "field", "machine"],
    draw: (c) => `<g>
      ${wheel(54, 126, 30, "#e2e8f0")}
      ${wheel(184, 118, 38, "#e2e8f0")}
      <rect x="44" y="78" width="152" height="42" rx="10" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 104 82 L 126 40 L 180 40 L 194 82 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 132 46 L 150 46 L 150 78 L 132 78 Z M 160 46 L 174 46 L 184 78 L 160 78 Z" fill="#bcd9f7" stroke="${shade(c, -0.25)}" stroke-width="1"/>
      <rect x="54" y="70" width="54" height="16" rx="5" fill="${shade(c, 0.25)}" opacity=".7"/>
      <rect x="188" y="58" width="8" height="24" rx="3" fill="#4b5563"/>
      <circle cx="104" cy="72" r="5" fill="#fef3c7" stroke="#92400e" stroke-width="1.5"/>
      <circle cx="212" cy="122" r="7" fill="#fde68a" stroke="#a16207" stroke-width="1.5"/>
    </g>`,
  },
  {
    type: "plough",
    label: "Plough",
    category: "farm",
    w: 190,
    h: 100,
    defaultColor: "#8b5e34",
    keywords: ["farm", "soil", "till"],
    draw: (c) => `<g>
      <path d="M 20 62 L 140 62 L 168 56 L 178 64 L 160 72 L 140 70 L 20 72 Z" fill="${c}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 142 70 Q 152 74 150 92 Q 136 98 126 88 Q 128 74 142 70 Z" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <path d="M 164 70 Q 174 74 172 92 Q 158 98 148 88 Q 150 74 164 70 Z" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
      <path d="M 20 62 Q 8 50 16 38 L 38 38 Q 30 48 34 62" fill="none" stroke="${shade(c, -0.2)}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="28" cy="72" r="8" fill="#475569"/>
    </g>`,
  },
  {
    type: "shovel",
    label: "Shovel",
    category: "farm",
    w: 90,
    h: 150,
    defaultColor: "#8b5e34",
    keywords: ["dig", "tool", "farm"],
    draw: (c) => `<g>
      <rect x="40" y="14" width="10" height="92" rx="4" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
      <path d="M 45 8 Q 28 14 34 30" fill="none" stroke="${shade(c, -0.15)}" stroke-width="7" stroke-linecap="round"/>
      <path d="M 26 100 L 64 100 L 70 122 Q 45 150 20 122 Z" fill="#94a3b8" stroke="#475569" stroke-width="2.5"/>
      <path d="M 30 108 L 60 108" stroke="#e2e8f0" stroke-width="3" opacity=".55"/>
    </g>`,
  },
  {
    type: "watering-can",
    label: "Watering Can",
    category: "farm",
    w: 140,
    h: 120,
    defaultColor: "#2f9e8f",
    keywords: ["water", "plant", "garden", "farm"],
    draw: (c) => `<g>
      <rect x="24" y="42" width="76" height="62" rx="9" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 96 54 L 132 36 L 138 46 L 104 68 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <ellipse cx="138" cy="40" rx="9" ry="6" fill="${shade(c, 0.2)}" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
      <path d="M 26 52 Q 6 60 18 80 Q 26 88 36 80" fill="none" stroke="${shade(c, -0.2)}" stroke-width="6" stroke-linecap="round"/>
      <rect x="36" y="34" width="52" height="12" rx="5" fill="${shade(c, 0.22)}"/>
      <circle cx="118" cy="70" r="3.5" fill="#7dd3fc"/><circle cx="128" cy="82" r="3" fill="#7dd3fc"/><circle cx="110" cy="88" r="2.5" fill="#7dd3fc"/>
    </g>`,
  },
  {
    type: "seeds",
    label: "Seed Bag",
    category: "farm",
    w: 100,
    h: 110,
    defaultColor: "#d4a24c",
    keywords: ["seed", "plant", "farm", "bag"],
    draw: (c) => `<g>
      <path d="M 24 30 Q 16 18 28 16 L 72 16 Q 84 18 76 30 L 84 92 Q 84 102 72 102 L 28 102 Q 16 102 16 92 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 28 16 Q 50 30 72 16" fill="none" stroke="${shade(c, -0.25)}" stroke-width="3"/>
      <ellipse cx="50" cy="66" rx="20" ry="22" fill="${shade(c, 0.35)}" opacity=".65"/>
      <path d="M 36 64 Q 50 52 64 64 Q 58 82 50 84 Q 42 82 36 64 Z" fill="#6b4a2d"/>
      <circle cx="30" cy="94" r="3" fill="#6b4a2d"/><circle cx="42" cy="90" r="2.5" fill="#6b4a2d"/><circle cx="66" cy="92" r="3" fill="#6b4a2d"/>
    </g>`,
  },
  {
    type: "plant",
    label: "Plant",
    category: "farm",
    w: 100,
    h: 120,
    defaultColor: "#3fa34d",
    keywords: ["plant", "grow", "pot", "farm", "nature"],
    draw: (c) => `<g>
      <path d="M 28 78 L 72 78 L 66 112 Q 64 118 58 118 L 42 118 Q 36 118 34 112 Z" fill="#c2703d" stroke="#8b4513" stroke-width="2"/>
      <rect x="25" y="72" width="50" height="10" rx="4" fill="#d98a55" stroke="#8b4513" stroke-width="1.5"/>
      <path d="M 50 76 L 50 30" stroke="#2f7d3a" stroke-width="4"/>
      <path d="M 50 56 Q 28 52 26 34 Q 46 32 50 52 Z" fill="${c}" stroke="${shade(c, -0.28)}" stroke-width="1.5"/>
      <path d="M 50 46 Q 72 40 76 22 Q 54 22 50 42 Z" fill="${shade(c, 0.12)}" stroke="${shade(c, -0.28)}" stroke-width="1.5"/>
      <path d="M 50 34 Q 38 20 48 10 Q 58 20 50 34 Z" fill="${shade(c, 0.22)}" stroke="${shade(c, -0.28)}" stroke-width="1.5"/>
    </g>`,
  },
  {
    type: "tree",
    label: "Tree",
    category: "farm",
    w: 190,
    h: 270,
    defaultColor: "#3f8f4a",
    keywords: ["tree", "nature", "forest", "wood"],
    draw: (c) => `<g>
      <rect x="82" y="150" width="26" height="112" rx="8" fill="#7c5134" stroke="#5a3823" stroke-width="2"/>
      <path d="M 95 178 L 56 142 M 95 200 L 134 158" stroke="#7c5134" stroke-width="10" stroke-linecap="round"/>
      <circle cx="95" cy="92" r="58" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <circle cx="52" cy="112" r="42" fill="${shade(c, 0.06)}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <circle cx="138" cy="112" r="44" fill="${shade(c, 0.12)}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <circle cx="95" cy="54" r="40" fill="${shade(c, 0.16)}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <circle cx="76" cy="72" r="12" fill="${shade(c, 0.28)}" opacity=".45"/>
      <circle cx="122" cy="48" r="8" fill="${shade(c, 0.3)}" opacity=".45"/>
    </g>`,
  },
  {
    type: "hay",
    label: "Hay Bale",
    category: "farm",
    w: 150,
    h: 110,
    defaultColor: "#d9b44a",
    keywords: ["hay", "farm", "grass"],
    draw: (c) => `<g>
      <rect x="14" y="26" width="122" height="72" rx="20" fill="${c}" stroke="${shade(c, -0.35)}" stroke-width="2.5"/>
      <ellipse cx="76" cy="62" rx="44" ry="28" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2" opacity=".6"/>
      <ellipse cx="76" cy="62" rx="27" ry="17" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2" opacity=".6"/>
      <path d="M 30 34 L 34 92 M 52 30 L 56 94 M 100 30 L 96 94 M 120 34 L 116 92" stroke="${shade(c, -0.16)}" stroke-width="1.5" opacity=".5"/>
    </g>`,
  },
  {
    type: "fence",
    label: "Fence",
    category: "farm",
    w: 220,
    h: 110,
    defaultColor: "#b98b5e",
    keywords: ["fence", "farm", "wood", "barrier"],
    draw: (c) => `<g>
      <rect x="18" y="20" width="16" height="84" rx="4" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
      <rect x="102" y="14" width="16" height="90" rx="4" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
      <rect x="186" y="20" width="16" height="84" rx="4" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
      <rect x="8" y="36" width="204" height="14" rx="5" fill="${shade(c, 0.1)}" stroke="${shade(c, -0.28)}" stroke-width="1.5"/>
      <rect x="8" y="72" width="204" height="14" rx="5" fill="${shade(c, 0.1)}" stroke="${shade(c, -0.28)}" stroke-width="1.5"/>
      <path d="M 26 24 L 26 100 M 110 20 L 110 100 M 194 24 L 194 100" stroke="${shade(c, -0.15)}" stroke-width="1" opacity=".5"/>
    </g>`,
  },
  {
    type: "goat",
    label: "Goat",
    category: "farm",
    w: 170,
    h: 130,
    defaultColor: "#e8ddc8",
    keywords: ["goat", "animal", "farm", "grass", "pet"],
    draw: (c) => `<g>
      <path d="M 38 64 Q 48 34 86 36 Q 130 38 142 70 Q 138 94 110 94 L 52 94 Q 34 88 38 64 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 132 60 Q 148 42 160 50 Q 170 58 158 72 Q 148 78 138 72 Z" fill="${shade(c, 0.1)}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 148 46 Q 146 28 138 20 M 156 48 Q 162 32 170 26" fill="none" stroke="#8b7d64" stroke-width="4" stroke-linecap="round"/>
      <circle cx="154" cy="59" r="3" fill="#1f2937"/>
      <path d="M 62 94 L 62 120 M 116 94 L 116 120 M 74 94 L 74 114 M 128 94 L 128 114" stroke="${shade(c, -0.4)}" stroke-width="6" stroke-linecap="round"/>
      <path d="M 42 70 Q 26 68 24 54" fill="none" stroke="${shade(c, -0.15)}" stroke-width="6" stroke-linecap="round"/>
      <path d="M 64 48 Q 82 42 102 48" fill="none" stroke="${shade(c, -0.18)}" stroke-width="2" opacity=".5"/>
    </g>`,
  },
  {
    type: "cow",
    label: "Cow",
    category: "farm",
    w: 220,
    h: 150,
    defaultColor: "#f8fafc",
    keywords: ["cow", "animal", "farm", "milk"],
    draw: (c) => `<g>
      <rect x="42" y="54" width="132" height="52" rx="24" fill="${c}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 72 54 Q 86 38 102 54 Q 118 70 96 72 Q 74 72 72 54 Z" fill="#3f4754" opacity=".85"/>
      <path d="M 136 58 Q 148 46 158 58 Q 164 72 150 72 Q 136 72 136 58 Z" fill="#3f4754" opacity=".85"/>
      <path d="M 166 62 Q 196 48 210 68 Q 212 92 188 98 Q 168 92 166 62 Z" fill="${shade(c, 0.05)}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 188 50 Q 186 34 178 28 M 202 50 Q 210 34 218 30" fill="none" stroke="#c7b299" stroke-width="4" stroke-linecap="round"/>
      <circle cx="202" cy="70" r="3.5" fill="#1f2937"/>
      <ellipse cx="208" cy="88" rx="14" ry="9" fill="#f7c6c7" opacity=".9"/>
      <path d="M 56 100 L 56 132 M 98 100 L 98 132 M 140 100 L 140 132 M 160 100 L 160 132" stroke="${shade(c, -0.45)}" stroke-width="8" stroke-linecap="round"/>
      <path d="M 44 70 Q 26 74 24 58" fill="none" stroke="${shade(c, -0.25)}" stroke-width="5" stroke-linecap="round"/>
    </g>`,
  },
  {
    type: "chicken",
    label: "Chicken",
    category: "farm",
    w: 110,
    h: 100,
    defaultColor: "#f8fafc",
    keywords: ["chicken", "hen", "animal", "farm", "bird"],
    draw: (c) => `<g>
      <ellipse cx="52" cy="60" rx="34" ry="29" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <circle cx="76" cy="36" r="17" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 68 22 Q 70 10 78 18 Q 82 8 88 20 Q 92 12 94 24" fill="#e53e3e" stroke="#991b1b" stroke-width="1"/>
      <path d="M 92 36 L 104 40 L 92 44 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
      <circle cx="82" cy="32" r="2.7" fill="#1f2937"/>
      <path d="M 36 84 L 38 96 M 52 86 L 52 96" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 24 44 Q 8 42 12 30 Q 20 34 26 34 Z" fill="${shade(c, -0.15)}" stroke="${shade(c, -0.3)}" stroke-width="1"/>
      <path d="M 38 58 Q 52 50 66 58" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2" opacity=".5"/>
    </g>`,
  },
  {
    type: "sheep",
    label: "Sheep",
    category: "farm",
    w: 170,
    h: 140,
    defaultColor: "#f1f5f9",
    keywords: ["sheep", "animal", "farm", "wool"],
    draw: (c) => `<g>
      <g fill="${c}" stroke="${shade(c, -0.28)}" stroke-width="1.6">
        <circle cx="60" cy="66" r="28"/><circle cx="90" cy="54" r="30"/><circle cx="120" cy="66" r="28"/>
        <circle cx="72" cy="88" r="26"/><circle cx="108" cy="88" r="26"/><circle cx="90" cy="78" r="30"/>
      </g>
      <path d="M 132 66 Q 156 56 166 72 Q 170 92 150 96 Q 132 92 132 66 Z" fill="#d9cbb8" stroke="#8b7d6b" stroke-width="2"/>
      <path d="M 142 62 Q 138 48 132 44 M 158 62 Q 164 48 170 44" fill="none" stroke="#8b7d6b" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="152" cy="72" r="3" fill="#1f2937"/>
      <path d="M 56 108 L 56 128 M 82 110 L 82 128 M 112 110 L 112 128 M 132 108 L 132 128" stroke="#5f5648" stroke-width="6" stroke-linecap="round"/>
    </g>`,
  },
  {
    type: "horse",
    label: "Horse",
    category: "farm",
    w: 220,
    h: 180,
    defaultColor: "#8b5e34",
    keywords: ["horse", "animal", "farm", "ride"],
    draw: (c) => `<g>
      <rect x="48" y="70" width="120" height="46" rx="22" fill="${c}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 164 72 Q 186 50 200 58 Q 210 68 200 88 Q 184 100 164 90 Z" fill="${shade(c, 0.1)}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 178 54 L 176 40 L 184 50 L 192 42 L 194 58" fill="${shade(c, -0.1)}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <circle cx="192" cy="70" r="3" fill="#1f2937"/>
      <path d="M 44 84 Q 24 92 20 116 Q 24 126 34 120 Q 38 98 58 94" fill="${shade(c, -0.1)}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 64 114 L 60 160 M 96 116 L 94 160 M 134 116 L 138 160 M 152 112 L 158 158" stroke="${shade(c, -0.42)}" stroke-width="9" stroke-linecap="round"/>
      <path d="M 70 82 Q 92 70 120 80" fill="none" stroke="${shade(c, -0.2)}" stroke-width="2" opacity=".5"/>
    </g>`,
  },
  {
    type: "chair",
    label: "Chair",
    category: "daily",
    w: 120,
    h: 150,
    defaultColor: "#b98b5e",
    keywords: ["chair", "sit", "furniture", "home"],
    draw: (c) => `<g>
      <rect x="22" y="20" width="66" height="70" rx="10" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <rect x="34" y="32" width="42" height="46" rx="5" fill="${shade(c, 0.18)}" opacity=".5"/>
      <rect x="18" y="82" width="84" height="22" rx="8" fill="${shade(c, 0.12)}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 30 104 L 24 142 M 90 104 L 96 142 M 44 104 L 42 132 M 74 104 L 76 132" stroke="${shade(c, -0.25)}" stroke-width="6" stroke-linecap="round"/>
    </g>`,
  },
  {
    type: "table",
    label: "Table",
    category: "daily",
    w: 180,
    h: 120,
    defaultColor: "#a06a42",
    keywords: ["table", "furniture", "desk", "home"],
    draw: (c) => `<g>
      <rect x="12" y="20" width="156" height="20" rx="7" fill="${shade(c, 0.1)}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 34 40 L 28 108 M 146 40 L 152 108 M 52 40 L 50 94 M 128 40 L 130 94" stroke="${shade(c, -0.18)}" stroke-width="8" stroke-linecap="round"/>
      <path d="M 34 72 L 146 72" stroke="${shade(c, -0.2)}" stroke-width="5" stroke-linecap="round"/>
    </g>`,
  },
  {
    type: "bed",
    label: "Bed",
    category: "daily",
    w: 240,
    h: 140,
    defaultColor: "#7c5cff",
    keywords: ["bed", "sleep", "furniture", "home"],
    draw: (c) => `<g>
      <rect x="14" y="54" width="212" height="46" rx="12" fill="#c8b7a6" stroke="#8b7d6b" stroke-width="2"/>
      <rect x="22" y="42" width="196" height="22" rx="10" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <rect x="30" y="34" width="62" height="24" rx="9" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="14" y="32" width="14" height="94" rx="6" fill="${shade(c, -0.2)}" stroke="${shade(c, -0.35)}" stroke-width="1.5"/>
      <rect x="212" y="70" width="14" height="56" rx="6" fill="${shade(c, -0.2)}" stroke="${shade(c, -0.35)}" stroke-width="1.5"/>
      <path d="M 26 126 L 214 126" stroke="${shade(c, -0.3)}" stroke-width="5" stroke-linecap="round"/>
    </g>`,
  },
  {
    type: "cup",
    label: "Cup",
    category: "daily",
    w: 80,
    h: 90,
    defaultColor: "#f8fafc",
    keywords: ["cup", "mug", "drink", "coffee", "tea"],
    draw: (c) => `<g>
      <path d="M 18 28 L 58 28 L 54 72 Q 52 82 40 82 Q 24 82 22 72 Z" fill="${c}" stroke="${shade(c, -0.28)}" stroke-width="2"/>
      <path d="M 58 38 Q 76 38 74 54 Q 72 68 56 66" fill="none" stroke="${shade(c, -0.2)}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="38" cy="28" rx="20" ry="6" fill="#8b5e34" opacity=".8"/>
      <path d="M 30 18 Q 24 10 30 4 M 42 18 Q 36 8 42 2" fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
    </g>`,
  },
  {
    type: "bottle",
    label: "Bottle",
    category: "daily",
    w: 70,
    h: 150,
    defaultColor: "#3ddc97",
    keywords: ["bottle", "water", "drink"],
    draw: (c) => `<g>
      <path d="M 28 10 L 42 10 L 42 32 Q 56 42 56 60 L 56 132 Q 56 142 46 142 L 24 142 Q 14 142 14 132 L 14 60 Q 14 42 28 32 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <rect x="26" y="6" width="18" height="12" rx="4" fill="${shade(c, -0.2)}"/>
      <rect x="20" y="58" width="30" height="42" rx="6" fill="#ffffff" opacity=".82"/>
      <path d="M 25 68 Q 35 60 45 68 Q 42 90 35 92 Q 28 90 25 68 Z" fill="#7dd3fc" opacity=".75"/>
    </g>`,
  },
  {
    type: "phone",
    label: "Mobile Phone",
    category: "daily",
    w: 70,
    h: 120,
    defaultColor: "#1f2937",
    keywords: ["phone", "mobile", "call", "device"],
    draw: (c) => `<g>
      <rect x="10" y="6" width="50" height="108" rx="12" fill="${c}" stroke="${shade(c, -0.4)}" stroke-width="2"/>
      <rect x="15" y="16" width="40" height="82" rx="7" fill="#7dd3fc" opacity=".9"/>
      <path d="M 18 24 Q 32 18 52 28" stroke="#fff" stroke-width="2" opacity=".6" fill="none"/>
      <circle cx="35" cy="105" r="4" fill="#475569"/>
    </g>`,
  },
  {
    type: "laptop",
    label: "Laptop",
    category: "daily",
    w: 170,
    h: 110,
    defaultColor: "#94a3b8",
    keywords: ["laptop", "computer", "work", "office"],
    draw: (c) => `<g>
      <rect x="26" y="12" width="118" height="72" rx="7" fill="${c}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <rect x="34" y="20" width="102" height="56" rx="3" fill="#1e293b"/>
      <path d="M 38 26 L 80 26 M 38 34 L 72 34 M 38 42 L 86 42" stroke="#7dd3fc" stroke-width="2" opacity=".7"/>
      <path d="M 10 84 L 160 84 L 148 98 L 22 98 Z" fill="${shade(c, -0.12)}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 62 90 L 108 90" stroke="${shade(c, -0.35)}" stroke-width="2"/>
    </g>`,
  },
  {
    type: "bicycle",
    label: "Bicycle",
    category: "daily",
    w: 200,
    h: 130,
    defaultColor: "#ef4444",
    keywords: ["bicycle", "bike", "ride", "transport"],
    draw: (c) => `<g>
      ${wheel(40, 96, 26, "#cbd5e1")}
      ${wheel(160, 96, 26, "#cbd5e1")}
      <path d="M 40 96 L 78 54 L 122 54 L 160 96 M 78 54 L 96 96 L 122 54 M 96 96 L 40 96" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 70 44 L 86 44 M 138 42 Q 150 40 154 50" stroke="${shade(c, -0.15)}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="96" cy="96" r="7" fill="#475569"/>
      <path d="M 118 46 L 128 46" stroke="#1f2937" stroke-width="6" stroke-linecap="round"/>
    </g>`,
  },
  {
    type: "car",
    label: "Car",
    category: "daily",
    w: 230,
    h: 120,
    defaultColor: "#3b82f6",
    keywords: ["car", "vehicle", "drive", "transport"],
    draw: (c) => `<g>
      <path d="M 18 74 L 38 48 L 76 40 L 132 40 L 170 58 L 206 64 Q 218 68 216 82 L 212 92 L 18 92 Q 10 84 18 74 Z" fill="${c}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 74 48 L 90 48 L 90 64 L 54 64 Z M 102 48 L 128 48 L 152 64 L 102 64 Z" fill="#bfe3ff" stroke="${shade(c, -0.25)}" stroke-width="1.5"/>
      ${wheel(62, 94, 20, "#cbd5e1")}
      ${wheel(172, 94, 20, "#cbd5e1")}
      <circle cx="204" cy="78" r="6" fill="#fde68a" stroke="#a16207" stroke-width="1"/>
      <rect x="18" y="72" width="12" height="8" rx="3" fill="#ef4444"/>
    </g>`,
  },
  {
    type: "motorcycle",
    label: "Motorcycle",
    category: "daily",
    w: 200,
    h: 130,
    defaultColor: "#111827",
    keywords: ["motorcycle", "bike", "ride", "transport"],
    draw: (c) => `<g>
      ${wheel(46, 96, 26, "#94a3b8")}
      ${wheel(158, 96, 26, "#94a3b8")}
      <path d="M 46 96 L 80 64 L 122 64 L 158 96 M 80 64 L 102 96 L 132 60" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 104 54 Q 132 46 152 56 L 146 68 L 110 68 Z" fill="${shade(c, 0.2)}" stroke="${shade(c, -0.2)}" stroke-width="2"/>
      <path d="M 134 48 L 150 36" stroke="${shade(c, -0.1)}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="96" cy="66" r="8" fill="#ef4444"/>
    </g>`,
  },
  {
    type: "book",
    label: "Book",
    category: "education",
    w: 120,
    h: 100,
    defaultColor: "#7c5cff",
    keywords: ["book", "read", "school", "study"],
    draw: (c) => `<g>
      <path d="M 12 20 Q 40 10 60 24 Q 80 10 108 20 L 108 84 Q 80 74 60 86 Q 40 74 12 84 Z" fill="${c}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 60 24 L 60 86" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 22 32 Q 38 26 50 34 M 70 34 Q 84 26 98 32 M 22 44 Q 38 38 50 46 M 70 46 Q 84 38 98 44 M 22 56 Q 38 50 50 58" fill="none" stroke="#fff" stroke-width="2" opacity=".55" stroke-linecap="round"/>
    </g>`,
  },
  {
    type: "blackboard",
    label: "Blackboard",
    category: "education",
    w: 260,
    h: 160,
    defaultColor: "#7c5cff",
    keywords: ["blackboard", "school", "classroom", "chalk", "teach"],
    draw: (c) => `<g>
      <rect x="8" y="8" width="244" height="130" rx="7" fill="#3a2a1f" stroke="${shade(c, -0.3)}" stroke-width="3"/>
      <rect x="18" y="18" width="224" height="110" rx="4" fill="#24352b"/>
      <path d="M 40 40 Q 70 34 100 44 M 40 58 L 140 58 M 40 74 L 120 74 M 40 90 L 156 90" stroke="#e2e8f0" stroke-width="2" opacity=".7" stroke-linecap="round"/>
      <path d="M 168 46 Q 186 40 198 52 Q 206 66 188 74" fill="none" stroke="#fca5a5" stroke-width="2" opacity=".8"/>
      <rect x="18" y="130" width="224" height="12" rx="4" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
      <rect x="196" y="122" width="30" height="8" rx="3" fill="#f8fafc"/>
    </g>`,
  },
  {
    type: "whiteboard",
    label: "Whiteboard",
    category: "education",
    w: 260,
    h: 160,
    defaultColor: "#94a3b8",
    keywords: ["whiteboard", "board", "classroom", "teach"],
    draw: (c) => `<g>
      <rect x="8" y="8" width="244" height="132" rx="8" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="3"/>
      <rect x="18" y="18" width="224" height="112" rx="5" fill="#fbfdff"/>
      <path d="M 38 40 L 138 40 M 38 58 Q 88 50 150 60 M 38 78 L 120 78" stroke="#3b82f6" stroke-width="3" opacity=".8" stroke-linecap="round"/>
      <circle cx="176" cy="52" r="20" fill="none" stroke="#ef4444" stroke-width="3" opacity=".8"/>
      <path d="M 160 78 L 200 78" stroke="#10b981" stroke-width="3" opacity=".8" stroke-linecap="round"/>
      <rect x="18" y="132" width="224" height="12" rx="4" fill="${shade(c, -0.12)}" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
      <rect x="200" y="124" width="24" height="8" rx="3" fill="#3b82f6"/>
    </g>`,
  },
  {
    type: "schoolbag",
    label: "School Bag",
    category: "education",
    w: 120,
    h: 140,
    defaultColor: "#f97316",
    keywords: ["bag", "school", "backpack", "student"],
    draw: (c) => `<g>
      <path d="M 22 48 Q 22 22 60 22 Q 98 22 98 48 L 102 118 Q 102 130 90 130 L 30 130 Q 18 130 18 118 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 40 28 Q 20 10 14 38 M 80 28 Q 100 10 106 38" fill="none" stroke="${shade(c, -0.22)}" stroke-width="6" stroke-linecap="round"/>
      <rect x="32" y="72" width="56" height="38" rx="7" fill="${shade(c, 0.24)}" stroke="${shade(c, -0.25)}" stroke-width="1.5"/>
      <path d="M 40 72 L 40 58 Q 60 48 80 58 L 80 72" fill="none" stroke="${shade(c, -0.2)}" stroke-width="3"/>
      <circle cx="60" cy="90" r="4" fill="${shade(c, -0.2)}"/>
    </g>`,
  },
  {
    type: "pencil",
    label: "Pencil",
    category: "education",
    w: 160,
    h: 40,
    defaultColor: "#f59e0b",
    keywords: ["pencil", "write", "school", "draw"],
    draw: (c) => `<g transform="rotate(-8 80 20)">
      <rect x="20" y="10" width="108" height="20" rx="3" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
      <path d="M 128 10 L 150 20 L 128 30 Z" fill="#f5deb3" stroke="#b08968" stroke-width="1.5"/>
      <path d="M 144 17 L 150 20 L 144 23 Z" fill="#1f2937"/>
      <rect x="10" y="10" width="14" height="20" rx="3" fill="#f472b6" stroke="#be185d" stroke-width="1.5"/>
      <path d="M 40 10 L 40 30 M 56 10 L 56 30" stroke="${shade(c, -0.2)}" stroke-width="1" opacity=".4"/>
    </g>`,
  },
  {
    type: "pen",
    label: "Pen",
    category: "education",
    w: 160,
    h: 40,
    defaultColor: "#2563eb",
    keywords: ["pen", "write", "school", "office"],
    draw: (c) => `<g transform="rotate(-8 80 20)">
      <rect x="22" y="12" width="102" height="16" rx="7" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
      <path d="M 124 12 L 146 20 L 124 28 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/>
      <circle cx="132" cy="20" r="2" fill="#1f2937"/>
      <rect x="14" y="14" width="18" height="12" rx="4" fill="${shade(c, 0.2)}"/>
      <path d="M 34 14 L 34 26" stroke="${shade(c, -0.25)}" stroke-width="2"/>
    </g>`,
  },
  {
    type: "desk",
    label: "School Desk",
    category: "education",
    w: 210,
    h: 140,
    defaultColor: "#c28b53",
    keywords: ["desk", "school", "table", "classroom"],
    draw: (c) => `<g>
      <rect x="12" y="22" width="186" height="18" rx="6" fill="${shade(c, 0.12)}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <rect x="28" y="40" width="154" height="40" rx="6" fill="${shade(c, -0.1)}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 40 80 L 34 130 M 168 80 L 174 130 M 54 80 L 52 120 M 154 80 L 156 120" stroke="${shade(c, -0.35)}" stroke-width="6" stroke-linecap="round"/>
      <path d="M 58 54 L 96 54" stroke="${shade(c, -0.25)}" stroke-width="3" opacity=".55"/>
    </g>`,
  },
  {
    type: "army-backpack",
    label: "Army Backpack",
    category: "military",
    w: 120,
    h: 140,
    defaultColor: "#556b3c",
    keywords: ["army", "backpack", "military", "bag", "training"],
    draw: (c) => `<g>
      <path d="M 20 44 Q 20 18 60 18 Q 100 18 100 44 L 102 122 Q 102 132 92 132 L 28 132 Q 18 132 18 122 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <rect x="30" y="42" width="60" height="44" rx="7" fill="${shade(c, 0.14)}" stroke="${shade(c, -0.28)}" stroke-width="1.5"/>
      <rect x="30" y="92" width="60" height="28" rx="6" fill="${shade(c, 0.08)}" stroke="${shade(c, -0.28)}" stroke-width="1.5"/>
      <path d="M 38 52 L 38 120 M 82 52 L 82 120" stroke="${shade(c, -0.2)}" stroke-width="2" opacity=".55"/>
      <path d="M 42 20 Q 30 4 22 18 M 78 20 Q 90 4 98 18" fill="none" stroke="${shade(c, -0.22)}" stroke-width="5" stroke-linecap="round"/>
      <rect x="54" y="64" width="12" height="8" rx="2" fill="#d9b44a"/>
    </g>`,
  },
  {
    type: "military-helmet",
    label: "Military Helmet",
    category: "military",
    w: 130,
    h: 100,
    defaultColor: "#556b3c",
    keywords: ["helmet", "military", "army", "training"],
    draw: (c) => `<g>
      <path d="M 12 50 C 12 10 118 10 118 50 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2.5"/>
      <path d="M 8 50 Q 65 38 122 50 L 118 62 Q 65 54 12 62 Z" fill="${shade(c, -0.2)}" stroke="${shade(c, -0.35)}" stroke-width="2"/>
      <path d="M 32 30 Q 65 20 98 30" fill="none" stroke="${shade(c, 0.25)}" stroke-width="3" opacity=".5"/>
      <path d="M 65 18 L 65 44" stroke="${shade(c, 0.18)}" stroke-width="2" opacity=".6"/>
    </g>`,
  },
  {
    type: "dog-tags",
    label: "Dog Tags",
    category: "military",
    w: 80,
    h: 100,
    defaultColor: "#94a3b8",
    keywords: ["tags", "military", "army", "accessory", "training"],
    draw: (c) => `<g>
      <path d="M 22 10 Q 8 40 18 72 M 58 10 Q 72 40 62 72" fill="none" stroke="${shade(c, -0.5)}" stroke-width="2" stroke-dasharray="3 3"/>
      <rect x="18" y="52" width="20" height="36" rx="8" fill="${c}" stroke="${shade(c, -0.4)}" stroke-width="1.5" transform="rotate(-8 28 70)"/>
      <rect x="42" y="52" width="20" height="36" rx="8" fill="${c}" stroke="${shade(c, -0.4)}" stroke-width="1.5" transform="rotate(8 52 70)"/>
      <path d="M 23 63 L 33 63 M 23 70 L 33 70 M 23 77 L 29 77" stroke="${shade(c, -0.3)}" stroke-width="1.5"/>
    </g>`,
  },
  {
    type: "sandbag",
    label: "Training Sandbag",
    category: "military",
    w: 130,
    h: 110,
    defaultColor: "#b99a6b",
    keywords: ["sandbag", "training", "military", "prop"],
    draw: (c) => `<g>
      <path d="M 20 34 Q 12 18 30 14 L 100 14 Q 118 18 110 34 L 118 84 Q 120 100 104 100 L 26 100 Q 10 100 12 84 Z" fill="${c}" stroke="${shade(c, -0.35)}" stroke-width="2.5"/>
      <path d="M 30 14 Q 65 30 100 14" fill="none" stroke="${shade(c, -0.25)}" stroke-width="3"/>
      <path d="M 26 50 L 104 50 M 24 72 L 106 72" stroke="${shade(c, -0.18)}" stroke-width="2" opacity=".5"/>
      <path d="M 52 36 L 78 36" stroke="#fff" stroke-width="3" opacity=".35" stroke-linecap="round"/>
    </g>`,
  },
  {
    type: "sun",
    label: "Sun",
    category: "nature",
    w: 150,
    h: 150,
    defaultColor: "#ffcf5b",
    keywords: ["sun", "sky", "day", "nature", "light"],
    draw: (c) => `<g>
      ${Array.from({ length: 12 })
        .map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 75 + Math.cos(a) * 48;
          const y1 = 75 + Math.sin(a) * 48;
          const x2 = 75 + Math.cos(a) * 68;
          const y2 = 75 + Math.sin(a) * 68;
          return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
        })
        .join("")}
      <circle cx="75" cy="75" r="40" fill="${c}" stroke="${shade(c, -0.2)}" stroke-width="2"/>
      <circle cx="62" cy="62" r="14" fill="#fff" opacity=".3"/>
    </g>`,
  },
  {
    type: "moon",
    label: "Moon",
    category: "nature",
    w: 130,
    h: 130,
    defaultColor: "#e2e8f0",
    keywords: ["moon", "night", "sky", "nature"],
    draw: (c) => `<g>
      <path d="M 98 18 Q 44 24 44 66 Q 44 104 92 112 Q 54 122 30 92 Q 10 58 34 30 Q 60 4 98 18 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <circle cx="38" cy="52" r="6" fill="${shade(c, -0.12)}" opacity=".6"/>
      <circle cx="56" cy="82" r="8" fill="${shade(c, -0.12)}" opacity=".5"/>
      <circle cx="28" cy="76" r="4" fill="${shade(c, -0.12)}" opacity=".55"/>
    </g>`,
  },
  {
    type: "cloud",
    label: "Cloud",
    category: "nature",
    w: 200,
    h: 110,
    defaultColor: "#f1f5f9",
    keywords: ["cloud", "sky", "weather", "nature"],
    draw: (c) => `<g>
      <circle cx="56" cy="66" r="30" fill="${c}"/>
      <circle cx="96" cy="48" r="40" fill="${c}"/>
      <circle cx="142" cy="62" r="34" fill="${c}"/>
      <rect x="26" y="62" width="146" height="36" rx="18" fill="${c}"/>
      <ellipse cx="94" cy="46" rx="24" ry="12" fill="#fff" opacity=".35"/>
    </g>`,
  },
  {
    type: "mountain",
    label: "Mountain",
    category: "nature",
    w: 280,
    h: 180,
    defaultColor: "#64748b",
    keywords: ["mountain", "nature", "landscape", "hills"],
    draw: (c) => `<g>
      <path d="M 10 170 L 88 46 L 130 108 L 172 30 L 268 170 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 172 30 L 194 70 L 184 64 L 174 76 L 164 62 L 152 72 Z" fill="#f1f5f9"/>
      <path d="M 88 46 L 104 74 L 96 70 L 88 82 L 80 68 L 72 76 Z" fill="#e2e8f0"/>
      <path d="M 48 126 L 88 46" stroke="${shade(c, 0.18)}" stroke-width="2" opacity=".5"/>
      <path d="M 216 124 L 172 30" stroke="${shade(c, 0.18)}" stroke-width="2" opacity=".5"/>
    </g>`,
  },
  {
    type: "river",
    label: "River",
    category: "nature",
    w: 320,
    h: 130,
    defaultColor: "#38bdf8",
    keywords: ["river", "water", "nature", "lake"],
    draw: (c) => `<g>
      <path d="M 0 60 Q 60 30 120 60 T 240 60 T 360 60 L 360 96 Q 300 126 240 96 T 120 96 T 0 96 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="2"/>
      <path d="M 28 70 Q 70 54 112 70 M 150 74 Q 190 58 232 72 M 244 84 Q 280 70 316 82" fill="none" stroke="#e0f2fe" stroke-width="3" opacity=".6" stroke-linecap="round"/>
    </g>`,
  },
  {
    type: "grass",
    label: "Grass Patch",
    category: "nature",
    w: 160,
    h: 100,
    defaultColor: "#4caf50",
    keywords: ["grass", "plant", "nature", "field"],
    draw: (c) => `<g>
      ${Array.from({ length: 13 })
        .map((_, i) => {
          const x = 12 + i * 11.5;
          const h = 30 + (i % 4) * 14;
          const bend = i % 2 === 0 ? 8 : -8;
          return `<path d="M ${x} 94 Q ${x + bend} ${94 - h / 2} ${x + bend * 0.5} ${94 - h}" fill="none" stroke="${shade(c, (i % 3) * 0.1 - 0.08)}" stroke-width="4" stroke-linecap="round"/>`;
        })
        .join("")}
      <ellipse cx="80" cy="94" rx="68" ry="6" fill="${shade(c, -0.35)}" opacity=".35"/>
    </g>`,
  },
  {
    type: "flower",
    label: "Flower",
    category: "nature",
    w: 80,
    h: 120,
    defaultColor: "#ff6b81",
    keywords: ["flower", "plant", "nature", "garden"],
    draw: (c) => `<g>
      <path d="M 40 118 L 40 58" stroke="#2f7d3a" stroke-width="4"/>
      <path d="M 40 94 Q 20 88 18 72 Q 34 74 40 88 Z" fill="#4caf50" stroke="#2f7d3a" stroke-width="1.2"/>
      <path d="M 40 82 Q 60 76 62 60 Q 46 62 40 76 Z" fill="#4caf50" stroke="#2f7d3a" stroke-width="1.2"/>
      <g fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="1.2">
        <circle cx="40" cy="28" r="13"/><circle cx="28" cy="40" r="13"/><circle cx="52" cy="40" r="13"/><circle cx="33" cy="53" r="13"/><circle cx="47" cy="53" r="13"/>
      </g>
      <circle cx="40" cy="42" r="10" fill="#ffd166" stroke="#d4a24c" stroke-width="1.5"/>
    </g>`,
  },
  {
    type: "rain",
    label: "Rain Cloud",
    category: "nature",
    w: 200,
    h: 150,
    defaultColor: "#94a3b8",
    keywords: ["rain", "weather", "cloud", "nature", "water"],
    draw: (c) => `<g>
      <circle cx="58" cy="58" r="30" fill="${c}"/>
      <circle cx="96" cy="42" r="38" fill="${c}"/>
      <circle cx="140" cy="58" r="32" fill="${c}"/>
      <rect x="28" y="54" width="144" height="36" rx="18" fill="${c}"/>
      ${[48, 78, 108, 138, 164].map((x, i) => `<path d="M ${x} ${100 + (i % 2) * 8} L ${x - 8} ${128 + (i % 2) * 8}" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>`).join("")}
      <ellipse cx="96" cy="40" rx="22" ry="10" fill="#fff" opacity=".2"/>
    </g>`,
  },
  {
    type: "snow",
    label: "Snowflake",
    category: "nature",
    w: 140,
    h: 140,
    defaultColor: "#e0f2fe",
    keywords: ["snow", "winter", "weather", "nature", "cold"],
    draw: (c) => `<g stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none">
      ${Array.from({ length: 6 })
        .map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const x1 = 70 + Math.cos(angle) * 12;
          const y1 = 70 + Math.sin(angle) * 12;
          const x2 = 70 + Math.cos(angle) * 56;
          const y2 = 70 + Math.sin(angle) * 56;
          const bx = 70 + Math.cos(angle) * 38;
          const by = 70 + Math.sin(angle) * 38;
          const bx1 = bx + Math.cos(angle + 0.7) * 15;
          const by1 = by + Math.sin(angle + 0.7) * 15;
          const bx2 = bx + Math.cos(angle - 0.7) * 15;
          const by2 = by + Math.sin(angle - 0.7) * 15;
          return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} M ${bx.toFixed(1)} ${by.toFixed(1)} L ${bx1.toFixed(1)} ${by1.toFixed(1)} M ${bx.toFixed(1)} ${by.toFixed(1)} L ${bx2.toFixed(1)} ${by2.toFixed(1)}"/>`;
        })
        .join("")}
      <circle cx="70" cy="70" r="7" fill="${c}"/>
    </g>`,
  },
];

export const OBJECT_LIBRARY = OBJECTS;
export const OBJECT_MAP = new Map(OBJECTS.map((o) => [o.type, o]));

export const OBJECT_CATEGORIES: { id: ObjectCategory; label: string; description: string }[] = [
  { id: "farm", label: "Farm", description: "Animals, tools and fields" },
  { id: "daily", label: "Daily Life", description: "Home and city props" },
  { id: "education", label: "Education", description: "Classroom and study" },
  { id: "military", label: "Military", description: "Training props and gear" },
  { id: "nature", label: "Nature", description: "Sky, weather and scenery" },
];

export function getObjectDef(type: ObjectType): ObjectDef {
  return OBJECT_MAP.get(type) ?? OBJECTS[0];
}

export function searchObjectLibrary(query: string, category?: ObjectCategory | "all") {
  const q = query.trim().toLowerCase();
  return OBJECTS.filter((obj) => {
    const inCategory = !category || category === "all" || obj.category === category;
    if (!inCategory) return false;
    if (!q) return true;
    return (
      obj.label.toLowerCase().includes(q) ||
      obj.type.includes(q) ||
      obj.keywords.some((k) => k.includes(q))
    );
  });
}
