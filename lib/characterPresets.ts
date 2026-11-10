import type {
  CharacterConfig,
  CharacterType,
  EyeStyle,
  FaceShape,
  GlassesStyle,
  HairStyle,
  LowerClothing,
  AccessoryType,
  ShoeStyle,
  UpperClothing,
} from "./types";

export const SKIN_TONES = [
  { label: "Porcelain", value: "#f7ddc5" },
  { label: "Peach", value: "#f2c8a0" },
  { label: "Warm", value: "#e5ae78" },
  { label: "Tan", value: "#c88954" },
  { label: "Bronze", value: "#a96b3d" },
  { label: "Deep", value: "#7d4a28" },
  { label: "Rich", value: "#5a331b" },
];

export const HAIR_COLORS = [
  "#1c1410",
  "#2f2118",
  "#4b3226",
  "#6b4a2d",
  "#a2693d",
  "#d4a24c",
  "#e5c97a",
  "#a83e32",
  "#8c8c8c",
  "#d9d9d9",
  "#5b6cff",
  "#d86bc7",
  "#3fb36b",
];

export const EYE_COLORS = [
  "#3d2a1c",
  "#6b4423",
  "#9b6a2e",
  "#4f7a3f",
  "#3f6f9e",
  "#5c8fbf",
  "#77808f",
  "#8b5cf6",
  "#2f9e8f",
];

export const CLOTHING_COLORS = [
  "#7c5cff",
  "#5b8def",
  "#2f80ed",
  "#3ddc97",
  "#1f9d55",
  "#ffb02e",
  "#f97316",
  "#ff6b81",
  "#e53e6f",
  "#a855f7",
  "#1e293b",
  "#334155",
  "#64748b",
  "#e2e8f0",
  "#f8fafc",
  "#8b5e34",
  "#4b5d3a",
  "#b91c1c",
  "#0f766e",
  "#111827",
];

export const CHARACTER_TYPES: {
  type: CharacterType;
  label: string;
  blurb: string;
  color: string;
}[] = [
  { type: "farmer", label: "Farmer", blurb: "Field work & rural stories", color: "#7fae63" },
  { type: "teacher", label: "Teacher", blurb: "Classroom & lessons", color: "#7c5cff" },
  { type: "soldier", label: "Soldier", blurb: "Military & training", color: "#7c8c5a" },
  { type: "doctor", label: "Doctor", blurb: "Hospital & care", color: "#5ad1c8" },
  { type: "police", label: "Police Officer", blurb: "Law & order", color: "#4f7dd6" },
  { type: "engineer", label: "Engineer", blurb: "Build & repair", color: "#ffb02e" },
  { type: "businessman", label: "Businessman", blurb: "Office & city life", color: "#93a4c8" },
  { type: "man", label: "Man", blurb: "Everyday character", color: "#5b8def" },
  { type: "woman", label: "Woman", blurb: "Everyday character", color: "#e56ba7" },
  { type: "boy", label: "Boy", blurb: "Young character", color: "#46c2a6" },
  { type: "girl", label: "Girl", blurb: "Young character", color: "#f38bb5" },
  { type: "child", label: "Child", blurb: "Small character", color: "#ffcf5b" },
  { type: "oldman", label: "Old Man", blurb: "Elder character", color: "#b7a28c" },
  { type: "oldwoman", label: "Old Woman", blurb: "Elder character", color: "#c6a7c9" },
  { type: "custom", label: "Custom", blurb: "Build from scratch", color: "#a78bfa" },
];

export const FACE_SHAPES: { value: FaceShape; label: string }[] = [
  { value: "oval", label: "Oval" },
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
  { value: "heart", label: "Heart" },
  { value: "long", label: "Long" },
];

export const EYE_STYLES: { value: EyeStyle; label: string }[] = [
  { value: "round", label: "Round" },
  { value: "almond", label: "Almond" },
  { value: "wide", label: "Wide" },
  { value: "sleepy", label: "Sleepy" },
  { value: "happy", label: "Happy" },
];

export const BROW_STYLES = [
  { value: "normal", label: "Natural" },
  { value: "arched", label: "Arched" },
  { value: "thick", label: "Bold" },
  { value: "thin", label: "Thin" },
  { value: "angry", label: "Angry" },
  { value: "worried", label: "Worried" },
] as const;

export const NOSE_STYLES = [
  { value: "button", label: "Button" },
  { value: "straight", label: "Straight" },
  { value: "round", label: "Round" },
  { value: "wide", label: "Wide" },
  { value: "pointed", label: "Pointed" },
] as const;

export const MOUTH_STYLES = [
  { value: "smile", label: "Smile" },
  { value: "neutral", label: "Neutral" },
  { value: "grin", label: "Grin" },
  { value: "sad", label: "Sad" },
  { value: "angry", label: "Angry" },
  { value: "open", label: "Open" },
] as const;

export const EXPRESSIONS = [
  { value: "smile", label: "Smile" },
  { value: "neutral", label: "Neutral" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "angry", label: "Angry" },
  { value: "surprised", label: "Surprised" },
] as const;

export const HAIR_STYLES: { value: HairStyle; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "long", label: "Long" },
  { value: "curly", label: "Curly" },
  { value: "straight", label: "Straight" },
  { value: "bald", label: "Bald" },
  { value: "ponytail", label: "Ponytail" },
  { value: "bun", label: "Bun" },
  { value: "afro", label: "Afro" },
  { value: "mohawk", label: "Mohawk" },
];

export const BEARD_STYLES = [
  { value: "none", label: "Clean" },
  { value: "stubble", label: "Stubble" },
  { value: "goatee", label: "Goatee" },
  { value: "full", label: "Full beard" },
  { value: "mustache", label: "Moustache" },
  { value: "handlebar", label: "Handlebar" },
  { value: "chin", label: "Chin strap" },
] as const;

export const GLASSES_STYLES: { value: GlassesStyle; label: string }[] = [
  { value: "none", label: "None" },
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
  { value: "sunglasses", label: "Sunglasses" },
];

export const UPPER_CLOTHING: { value: UpperClothing; label: string }[] = [
  { value: "tshirt", label: "T-Shirt" },
  { value: "shirt", label: "Shirt" },
  { value: "jacket", label: "Jacket" },
  { value: "sweater", label: "Sweater" },
  { value: "uniform", label: "Uniform" },
  { value: "police", label: "Police Uniform" },
  { value: "army", label: "Army Uniform" },
  { value: "farmer", label: "Farmer Overalls" },
  { value: "teacher", label: "Teacher Outfit" },
  { value: "doctor", label: "Scrubs" },
  { value: "labcoat", label: "Lab Coat" },
  { value: "suit", label: "Business Suit" },
];

export const LOWER_CLOTHING: { value: LowerClothing; label: string }[] = [
  { value: "jeans", label: "Jeans" },
  { value: "pants", label: "Pants" },
  { value: "shorts", label: "Shorts" },
  { value: "trousers", label: "Trousers" },
  { value: "skirt", label: "Skirt" },
];

export const SHOE_STYLES: { value: ShoeStyle; label: string }[] = [
  { value: "sneakers", label: "Sneakers" },
  { value: "formal", label: "Formal" },
  { value: "boots", label: "Boots" },
  { value: "sandals", label: "Sandals" },
];

export const ACCESSORIES: { value: AccessoryType; label: string }[] = [
  { value: "cap", label: "Cap" },
  { value: "hat", label: "Hat" },
  { value: "helmet", label: "Helmet" },
  { value: "glasses", label: "Glasses" },
  { value: "sunglasses", label: "Sunglasses" },
  { value: "watch", label: "Watch" },
  { value: "belt", label: "Belt" },
  { value: "bag", label: "Bag" },
  { value: "gloves", label: "Gloves" },
  { value: "cane", label: "Cane" },
];

const BASE: CharacterConfig = {
  type: "man",
  name: "Alex",
  skinTone: "#e5ae78",
  faceShape: "oval",
  eyeStyle: "almond",
  eyeColor: "#3d2a1c",
  browStyle: "normal",
  noseStyle: "button",
  mouthStyle: "smile",
  earSize: 1,
  hairStyle: "short",
  hairColor: "#2f2118",
  beardStyle: "none",
  beardColor: "#2f2118",
  glasses: "none",
  expression: "smile",
  height: 1,
  bodySize: 1,
  headSize: 1,
  armLength: 1,
  legLength: 1,
  upper: "tshirt",
  upperColor: "#5b8def",
  lower: "jeans",
  lowerColor: "#334155",
  shoes: "sneakers",
  shoeColor: "#1f2937",
  accessories: [],
  accessoryColor: "#111827",
  animation: "idle",
  animationSpeed: 1,
  animationLayers: [{ type: "idle", weight: 1, speed: 1 }],
  facing: "right",
  autoBlink: true,
};

export function baseConfig(): CharacterConfig {
  return {
    ...BASE,
    animationLayers: [{ type: "idle", weight: 1, speed: 1 }],
    accessories: [],
  };
}

function preset(patch: Partial<CharacterConfig>): CharacterConfig {
  return {
    ...baseConfig(),
    ...patch,
    animationLayers: patch.animationLayers
      ? patch.animationLayers.map((l) => ({ ...l }))
      : [{ type: "idle", weight: 1, speed: 1 }],
    accessories: patch.accessories ? [...patch.accessories] : [],
  };
}

export function createCharacterConfig(type: CharacterType, name?: string): CharacterConfig {
  const label = CHARACTER_TYPES.find((c) => c.type === type)?.label ?? "Character";
  const defaultName = name ?? label;
  switch (type) {
    case "farmer":
      return preset({
        type,
        name: defaultName,
        skinTone: "#c88954",
        hairStyle: "short",
        hairColor: "#4b3226",
        beardStyle: "stubble",
        beardColor: "#4b3226",
        upper: "farmer",
        upperColor: "#5f7f4b",
        lower: "jeans",
        lowerColor: "#3b4f63",
        shoes: "boots",
        shoeColor: "#4a3423",
        accessories: ["hat", "belt"],
        accessoryColor: "#c9a45c",
        bodySize: 1.05,
        expression: "happy",
      });
    case "teacher":
      return preset({
        type,
        name: defaultName,
        skinTone: "#e5ae78",
        hairStyle: "long",
        hairColor: "#6b4a2d",
        glasses: "round",
        upper: "teacher",
        upperColor: "#7c5cff",
        lower: "trousers",
        lowerColor: "#334155",
        shoes: "formal",
        shoeColor: "#2b2b2b",
        accessories: ["watch", "bag"],
        accessoryColor: "#b45309",
        bodySize: 0.98,
        expression: "smile",
      });
    case "soldier":
      return preset({
        type,
        name: defaultName,
        skinTone: "#c88954",
        hairStyle: "short",
        hairColor: "#1c1410",
        upper: "army",
        upperColor: "#556b3c",
        lower: "pants",
        lowerColor: "#414f31",
        shoes: "boots",
        shoeColor: "#2b2b23",
        accessories: ["helmet", "belt"],
        accessoryColor: "#3f4a2f",
        bodySize: 1.08,
        expression: "neutral",
      });
    case "doctor":
      return preset({
        type,
        name: defaultName,
        skinTone: "#f2c8a0",
        hairStyle: "short",
        hairColor: "#3d2a1c",
        upper: "labcoat",
        upperColor: "#f4f7fb",
        lower: "trousers",
        lowerColor: "#3f6f9e",
        shoes: "formal",
        shoeColor: "#e2e8f0",
        accessories: ["watch"],
        accessoryColor: "#0f766e",
        expression: "smile",
      });
    case "police":
      return preset({
        type,
        name: defaultName,
        skinTone: "#e5ae78",
        hairStyle: "short",
        hairColor: "#2f2118",
        upper: "police",
        upperColor: "#253b76",
        lower: "pants",
        lowerColor: "#1e293b",
        shoes: "boots",
        shoeColor: "#111827",
        accessories: ["cap", "belt"],
        accessoryColor: "#1e293b",
        bodySize: 1.05,
        expression: "neutral",
      });
    case "engineer":
      return preset({
        type,
        name: defaultName,
        skinTone: "#c88954",
        hairStyle: "short",
        hairColor: "#4b3226",
        upper: "uniform",
        upperColor: "#f59e0b",
        lower: "jeans",
        lowerColor: "#334155",
        shoes: "boots",
        shoeColor: "#4a3423",
        accessories: ["helmet", "belt"],
        accessoryColor: "#ffcf5b",
        expression: "smile",
      });
    case "businessman":
      return preset({
        type,
        name: defaultName,
        skinTone: "#f2c8a0",
        hairStyle: "short",
        hairColor: "#2f2118",
        upper: "suit",
        upperColor: "#1e293b",
        lower: "trousers",
        lowerColor: "#1e293b",
        shoes: "formal",
        shoeColor: "#111827",
        accessories: ["watch", "belt"],
        accessoryColor: "#b45309",
        expression: "neutral",
      });
    case "woman":
      return preset({
        type,
        name: defaultName,
        skinTone: "#f2c8a0",
        hairStyle: "long",
        hairColor: "#6b4a2d",
        upper: "shirt",
        upperColor: "#e56ba7",
        lower: "pants",
        lowerColor: "#334155",
        shoes: "formal",
        shoeColor: "#7c2d4a",
        accessories: ["bag"],
        accessoryColor: "#b45309",
        bodySize: 0.92,
        expression: "smile",
      });
    case "boy":
      return preset({
        type,
        name: defaultName,
        skinTone: "#e5ae78",
        hairStyle: "short",
        hairColor: "#3d2a1c",
        upper: "tshirt",
        upperColor: "#3ddc97",
        lower: "shorts",
        lowerColor: "#3b82f6",
        shoes: "sneakers",
        shoeColor: "#ef4444",
        height: 0.8,
        headSize: 1.12,
        bodySize: 0.86,
        legLength: 0.9,
        expression: "happy",
      });
    case "girl":
      return preset({
        type,
        name: defaultName,
        skinTone: "#f2c8a0",
        hairStyle: "ponytail",
        hairColor: "#8c4a2f",
        upper: "tshirt",
        upperColor: "#f38bb5",
        lower: "skirt",
        lowerColor: "#7c3aed",
        shoes: "sneakers",
        shoeColor: "#f472b6",
        height: 0.78,
        headSize: 1.14,
        bodySize: 0.84,
        legLength: 0.9,
        expression: "smile",
      });
    case "child":
      return preset({
        type,
        name: defaultName,
        skinTone: "#e5ae78",
        hairStyle: "curly",
        hairColor: "#4b3226",
        upper: "tshirt",
        upperColor: "#ffb02e",
        lower: "shorts",
        lowerColor: "#2f80ed",
        shoes: "sneakers",
        shoeColor: "#3ddc97",
        height: 0.66,
        headSize: 1.2,
        bodySize: 0.82,
        legLength: 0.85,
        armLength: 0.9,
        expression: "happy",
      });
    case "oldman":
      return preset({
        type,
        name: defaultName,
        skinTone: "#e5ae78",
        hairStyle: "bald",
        hairColor: "#d9d9d9",
        beardStyle: "full",
        beardColor: "#d9d9d9",
        glasses: "round",
        upper: "sweater",
        upperColor: "#8b5e34",
        lower: "trousers",
        lowerColor: "#64748b",
        shoes: "formal",
        shoeColor: "#3f2d20",
        accessories: ["cane", "watch"],
        accessoryColor: "#8b5e34",
        height: 0.96,
        bodySize: 0.95,
        expression: "smile",
      });
    case "oldwoman":
      return preset({
        type,
        name: defaultName,
        skinTone: "#f2c8a0",
        hairStyle: "bun",
        hairColor: "#d9d9d9",
        glasses: "round",
        upper: "sweater",
        upperColor: "#a855f7",
        lower: "skirt",
        lowerColor: "#64748b",
        shoes: "formal",
        shoeColor: "#4a2c1a",
        accessories: ["cane", "bag"],
        accessoryColor: "#7c3aed",
        height: 0.94,
        bodySize: 0.94,
        expression: "smile",
      });
    case "man":
      return preset({
        type,
        name: defaultName,
        upper: "tshirt",
        upperColor: "#5b8def",
        lower: "jeans",
        lowerColor: "#334155",
        shoes: "sneakers",
        shoeColor: "#111827",
      });
    case "custom":
    default:
      return preset({ type, name: defaultName });
  }
}

export function uniqueName(base: string, existing: string[]): string {
  const clean = base.trim() || "Character";
  if (!existing.includes(clean)) return clean;
  let i = 2;
  while (existing.includes(`${clean} ${i}`)) i += 1;
  return `${clean} ${i}`;
}

export function characterRoleLabel(type: CharacterType) {
  return CHARACTER_TYPES.find((c) => c.type === type)?.label ?? "Character";
}
