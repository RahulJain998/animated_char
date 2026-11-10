import { createCharacterConfig } from "./characterPresets";
import type {
  AnimationType,
  BackgroundPreset,
  CharacterType,
  ObjectType,
  StoryPlan,
  StoryScenePlan,
} from "./types";

const roles: { words: string[]; type: CharacterType; name: string }[] = [
  { words: ["farmer"], type: "farmer", name: "Farmer" },
  { words: ["teacher", "student", "school"], type: "teacher", name: "Teacher" },
  { words: ["soldier", "army"], type: "soldier", name: "Soldier" },
  { words: ["doctor", "nurse", "hospital"], type: "doctor", name: "Doctor" },
  { words: ["police", "officer", "cop"], type: "police", name: "Officer" },
  { words: ["engineer", "builder"], type: "engineer", name: "Engineer" },
  { words: ["businessman", "businesswoman", "office"], type: "businessman", name: "Alex" },
  { words: ["woman", "girl", "mother", "she"], type: "woman", name: "Maya" },
  { words: ["boy", "child", "kid", "he"], type: "boy", name: "Sam" },
  { words: ["man", "farmer", "he"], type: "man", name: "Alex" },
];

const props: { words: string[]; type: ObjectType }[] = [
  { words: ["tractor"], type: "tractor" },
  { words: ["plough", "plow"], type: "plough" },
  { words: ["shovel"], type: "shovel" },
  { words: ["watering can", "water"], type: "watering-can" },
  { words: ["seed"], type: "seeds" },
  { words: ["plant", "crop"], type: "plant" },
  { words: ["tree"], type: "tree" },
  { words: ["hay"], type: "hay" },
  { words: ["fence"], type: "fence" },
  { words: ["goat"], type: "goat" },
  { words: ["cow"], type: "cow" },
  { words: ["chicken"], type: "chicken" },
  { words: ["sheep"], type: "sheep" },
  { words: ["horse"], type: "horse" },
  { words: ["chair"], type: "chair" },
  { words: ["table", "desk"], type: "table" },
  { words: ["bed"], type: "bed" },
  { words: ["cup"], type: "cup" },
  { words: ["bottle"], type: "bottle" },
  { words: ["phone", "mobile"], type: "phone" },
  { words: ["laptop", "computer"], type: "laptop" },
  { words: ["bicycle", "bike"], type: "bicycle" },
  { words: ["car"], type: "car" },
  { words: ["motorcycle", "motorbike"], type: "motorcycle" },
  { words: ["book"], type: "book" },
  { words: ["blackboard"], type: "blackboard" },
  { words: ["whiteboard"], type: "whiteboard" },
  { words: ["school bag", "backpack"], type: "schoolbag" },
  { words: ["pencil"], type: "pencil" },
  { words: ["pen"], type: "pen" },
  { words: ["sun"], type: "sun" },
  { words: ["moon"], type: "moon" },
  { words: ["cloud"], type: "cloud" },
  { words: ["mountain"], type: "mountain" },
  { words: ["river"], type: "river" },
  { words: ["grass"], type: "grass" },
  { words: ["flower"], type: "flower" },
  { words: ["rain"], type: "rain" },
  { words: ["snow"], type: "snow" },
];

function chooseBackground(text: string): BackgroundPreset {
  if (/class|lesson|teach|school|student/.test(text)) return "classroom";
  if (/hospital|doctor|nurse/.test(text)) return "hospital";
  if (/city|street|road|car/.test(text)) return "city";
  if (/forest|woods|tree/.test(text)) return "forest";
  if (/beach|sea|ocean/.test(text)) return "beach";
  if (/mountain|hiking/.test(text)) return "mountains";
  if (/army|soldier|training/.test(text)) return "army-camp";
  if (/park|play/.test(text)) return "park";
  if (/farm|field|goat|cow|tractor|crop/.test(text)) return "farm";
  return "village";
}

function chooseAnimation(text: string): AnimationType {
  if (/fight|battle/.test(text)) return "fight";
  if (/sleep|nap/.test(text)) return "sleep";
  if (/laugh|funny/.test(text)) return "laugh";
  if (/cry|sad|upset/.test(text)) return "cry";
  if (/dance/.test(text)) return "dance";
  if (/teach|explain|lesson/.test(text)) return "teach";
  if (/salut/.test(text)) return "salute";
  if (/wave|goodbye|hello/.test(text)) return "wave";
  if (/talk|speak|say/.test(text)) return "talk";
  if (/eat|eats|ate/.test(text)) return "eat";
  if (/drink|drinks/.test(text)) return "drink";
  if (/farm|work|working|plant/.test(text)) return "farm";
  if (/jump/.test(text)) return "jump";
  if (/run|chase|runs|running/.test(text)) return "run-right";
  if (/walk|goes|go |going/.test(text)) return "walk";
  return "idle";
}

export function generateStoryPlan(prompt: string): StoryPlan {
  const sentences = prompt
    .split(/(?<=[.!?])\s+|\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 6);
  const beats = sentences.length > 1 ? sentences : [prompt.trim()];
  const scenes: StoryScenePlan[] = beats.map((sentence, index) => {
    const text = sentence.toLowerCase();
    const matchedRoles = roles.filter((role) => role.words.some((word) => text.includes(word)));
    const uniqueRoles = matchedRoles.filter(
      (role, i) => matchedRoles.findIndex((other) => other.type === role.type) === i,
    );
    const selectedRoles = uniqueRoles.length ? uniqueRoles.slice(0, 3) : [roles[6]];
    const characters = selectedRoles.map((role, roleIndex) => {
      const config = createCharacterConfig(role.type, role.name);
      const animation = chooseAnimation(text);
      const x = 440 + roleIndex * 390;
      const movingX = /run|chase|walk|go |going/.test(text) ? x + 240 : x;
      return {
        role: role.type,
        name: role.name,
        x,
        y: 790,
        scale: config.height > 1 ? 0.9 : 1,
        animation,
        facing: roleIndex === 0 ? ("right" as const) : ("left" as const),
        flip: roleIndex > 0,
        keyframes: [
          { frame: 0, x, y: 790, animation: "idle" as AnimationType },
          { frame: 48, x: movingX, y: 790, animation },
          { frame: 104, x: movingX, y: 790, animation: "idle" as AnimationType },
        ],
      };
    });

    const objects = props
      .filter((prop) => prop.words.some((word) => text.includes(word)))
      .slice(0, 8)
      .map((prop, objectIndex) => ({
        type: prop.type,
        x: 980 + (objectIndex % 3) * 170,
        y: prop.type === "sun" || prop.type === "moon" ? 160 : 740,
        scale: prop.type === "tree" ? 1.15 : 0.85,
      }));

    return {
      title: `Scene ${index + 1}`,
      narration: sentence,
      background: chooseBackground(text),
      transition: index === 0 ? "fade" : "cut",
      fps: 30,
      durationFrames: 150,
      characters,
      objects,
    };
  });

  const title = prompt.trim().split(/[.!?\n]/)[0]?.slice(0, 48) || "My Story";
  return {
    title: title.length === 48 ? `${title}…` : title,
    synopsis: prompt.trim(),
    scenes,
  };
}
