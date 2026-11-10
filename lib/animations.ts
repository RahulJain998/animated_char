import type { AnimationLayer, AnimationType, Expression } from "./types";

export interface Pose {
  bodyBob: number;
  lift: number;
  bodyRot: number;
  headRot: number;
  leftArm: number;
  rightArm: number;
  leftLeg: number;
  rightLeg: number;
  eyeOpen: number;
  mouthOpen: number;
  smile: number;
  offsetX: number;
  cry: number;
  sleepy: number;
  holding: number;
  handmade: number;
  zzz: number;
  hearts: number;
}

export interface AnimationDef {
  type: AnimationType;
  label: string;
  description: string;
  group: "Essentials" | "Movement" | "Gestures" | "Emotions" | "Actions";
  pose: (t: number) => Partial<Pose>;
}

const TAU = Math.PI * 2;

const basePose: Pose = {
  bodyBob: 0,
  lift: 0,
  bodyRot: 0,
  headRot: 0,
  leftArm: 3,
  rightArm: -3,
  leftLeg: 0,
  rightLeg: 0,
  eyeOpen: 1,
  mouthOpen: 0,
  smile: 0,
  offsetX: 0,
  cry: 0,
  sleepy: 0,
  holding: 0,
  handmade: 0,
  zzz: 0,
  hearts: 0,
};

function idle(t: number): Partial<Pose> {
  const breathe = Math.sin(t * TAU * 0.32);
  return {
    bodyBob: breathe * 2.2,
    headRot: Math.sin(t * TAU * 0.24) * 1.4,
    leftArm: 3 + breathe * 2.5,
    rightArm: -3 - breathe * 2.5,
    leftLeg: Math.sin(t * TAU * 0.2) * 0.8,
    rightLeg: -Math.sin(t * TAU * 0.2) * 0.8,
  };
}

function blink(t: number): Partial<Pose> {
  const cycle = t % 3.6;
  const closed = cycle < 0.14 || (cycle > 0.24 && cycle < 0.34);
  return { eyeOpen: closed ? 0.05 : 1 };
}

function walk(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 1.55);
  const p2 = Math.sin(t * TAU * 3.1);
  return {
    leftLeg: p * 26,
    rightLeg: -p * 26,
    leftArm: -p * 22,
    rightArm: p * 22,
    bodyBob: Math.abs(p2) * 3.2,
    bodyRot: 2,
    headRot: -1.5 + p * 1.5,
  };
}

function run(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 2.2);
  const p2 = Math.sin(t * TAU * 4.4);
  return {
    leftLeg: p * 42,
    rightLeg: -p * 42,
    leftArm: -p * 46,
    rightArm: p * 46,
    bodyBob: Math.abs(p2) * 6.5,
    bodyRot: 11,
    headRot: -8,
    lift: -Math.abs(p2) * 3,
  };
}

function jumping(t: number): Partial<Pose> {
  const cycle = (t * 0.9) % 1;
  const up = cycle < 0.62 ? Math.sin((cycle / 0.62) * Math.PI) : 0;
  return {
    lift: -up * 95,
    leftLeg: -14 * up,
    rightLeg: -20 * up,
    leftArm: 118 + up * 30,
    rightArm: -118 - up * 30,
    bodyRot: up * 5,
    headRot: -up * 4,
    mouthOpen: up * 0.22,
    smile: up * 0.25,
  };
}

function sitting(t: number): Partial<Pose> {
  return {
    lift: 66,
    leftLeg: -84 + Math.sin(t * TAU * 0.3) * 2,
    rightLeg: -84 - Math.sin(t * TAU * 0.3) * 2,
    leftArm: -12,
    rightArm: 12,
    bodyRot: -2,
    headRot: Math.sin(t * TAU * 0.35) * 2.5,
    bodyBob: Math.sin(t * TAU * 0.3) * 1.5,
  };
}

function standing(t: number): Partial<Pose> {
  return {
    ...idle(t),
    leftArm: 3,
    rightArm: -3,
    bodyBob: Math.sin(t * TAU * 0.25) * 1.2,
  };
}

function waving(t: number): Partial<Pose> {
  return {
    rightArm: -136 + Math.sin(t * TAU * 2.1) * 22,
    leftArm: 5 + Math.sin(t * TAU * 0.3) * 2,
    headRot: Math.sin(t * TAU * 0.55) * 2.5,
    bodyBob: Math.sin(t * TAU * 0.6) * 2,
    smile: 0.3,
  };
}

function talking(t: number): Partial<Pose> {
  const talk = Math.sin(t * TAU * 4.1);
  return {
    mouthOpen: 0.18 + Math.abs(talk) * 0.55,
    headRot: Math.sin(t * TAU * 0.9) * 3.5,
    rightArm: -24 + Math.sin(t * TAU * 1.15) * 16,
    leftArm: 12 + Math.sin(t * TAU * 0.8) * 10,
    bodyBob: Math.sin(t * TAU * 1.2) * 1.6,
    smile: 0.18,
  };
}

function laughing(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 2.8);
  return {
    mouthOpen: 0.72,
    smile: 0.8,
    eyeOpen: 0.25,
    bodyBob: Math.abs(p) * 6,
    bodyRot: -3 + p * 2,
    headRot: -9 + p * 3,
    leftArm: 18 + p * 7,
    rightArm: -18 - p * 7,
    leftLeg: -3,
    rightLeg: 3,
  };
}

function crying(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 1.8);
  return {
    cry: 1,
    eyeOpen: 0.12,
    mouthOpen: 0.38 + Math.abs(p) * 0.18,
    smile: -0.85,
    headRot: 10 + p * 2.5,
    bodyBob: Math.abs(p) * 2.5,
    bodyRot: -4,
    leftArm: -104 + p * 4,
    rightArm: 104 - p * 4,
  };
}

function dancing(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 1.7);
  const p2 = Math.sin(t * TAU * 3.4);
  return {
    bodyRot: p * 9,
    headRot: -p * 7,
    bodyBob: Math.abs(p2) * 5,
    leftArm: 35 + p * 58,
    rightArm: -35 + p * 58,
    leftLeg: -p * 22,
    rightLeg: p * 22,
    lift: Math.abs(p) * 5,
    mouthOpen: 0.2,
    smile: 0.6,
  };
}

function fighting(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 2.4);
  return {
    rightArm: -72 + p * 46,
    leftArm: 82 - p * 24,
    leftLeg: -18,
    rightLeg: 18,
    bodyRot: 6 + p * 3,
    headRot: -4,
    bodyBob: Math.abs(p) * 2,
    mouthOpen: 0.15,
  };
}

function sleeping(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 0.22);
  return {
    eyeOpen: 0,
    sleepy: 1,
    zzz: 1,
    headRot: 18 + p * 2,
    bodyRot: -6,
    lift: 18,
    leftArm: 1,
    rightArm: -1,
    mouthOpen: 0.14,
    bodyBob: p * 1.5,
  };
}

function eating(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 1.6);
  return {
    rightArm: 102 + p * 10,
    leftArm: 10,
    mouthOpen: Math.max(0, p) * 0.55,
    smile: 0.2,
    headRot: -2 + p * 2,
    holding: 1,
    handmade: 1,
    bodyBob: p * 1.5,
  };
}

function drinking(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 1.35);
  return {
    rightArm: 112 + p * 6,
    leftArm: 8,
    mouthOpen: Math.max(0, p) * 0.36,
    headRot: -8 - Math.max(0, p) * 6,
    holding: 2,
    handmade: 1,
    bodyBob: p * 1.2,
  };
}

function clapping(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 3.2);
  return {
    leftArm: -112 - p * 10,
    rightArm: 112 + p * 10,
    mouthOpen: 0.2,
    smile: 0.6,
    bodyBob: Math.abs(p) * 2,
    headRot: p * 2,
    handmade: 1,
  };
}

function carrying(t: number): Partial<Pose> {
  return {
    leftArm: -74 + Math.sin(t * TAU * 0.6) * 2,
    rightArm: -74 - Math.sin(t * TAU * 0.6) * 2,
    holding: 1,
    bodyRot: 3,
    headRot: -3,
    bodyBob: Math.sin(t * TAU * 1.4) * 1.5,
  };
}

function farming(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 1.1);
  return {
    bodyRot: 14 + p * 5,
    headRot: -10,
    leftArm: -68 + p * 28,
    rightArm: -80 + p * 34,
    leftLeg: -8,
    rightLeg: 8,
    bodyBob: Math.abs(p) * 3,
    holding: 1,
  };
}

function teaching(t: number): Partial<Pose> {
  const p = Math.sin(t * TAU * 0.9);
  return {
    rightArm: -116 + p * 8,
    leftArm: 10,
    mouthOpen: 0.2 + Math.abs(Math.sin(t * TAU * 3.3)) * 0.35,
    headRot: p * 3,
    bodyRot: -2,
    smile: 0.25,
  };
}

function saluting(t: number): Partial<Pose> {
  return {
    rightArm: 136,
    leftArm: 2,
    bodyRot: -2,
    headRot: 2,
    bodyBob: Math.sin(t * TAU * 0.4) * 1,
  };
}

export const ANIMATIONS: AnimationDef[] = [
  { type: "idle", label: "Idle", description: "Gentle breathing loop", group: "Essentials", pose: idle },
  { type: "blink", label: "Eye Blinking", description: "Natural blink cycle", group: "Essentials", pose: blink },
  { type: "stand", label: "Standing", description: "Calm standing pose", group: "Essentials", pose: standing },
  { type: "walk", label: "Walking", description: "Classic walk cycle", group: "Movement", pose: walk },
  { type: "run", label: "Running", description: "Full speed run cycle", group: "Movement", pose: run },
  { type: "run-left", label: "Running Left", description: "Run toward the left", group: "Movement", pose: run },
  { type: "run-right", label: "Running Right", description: "Run toward the right", group: "Movement", pose: run },
  { type: "jump", label: "Jumping", description: "Jump with lift", group: "Movement", pose: jumping },
  { type: "sit", label: "Sitting", description: "Seated pose", group: "Movement", pose: sitting },
  { type: "walk-object", label: "Walk with Object", description: "Walk while holding", group: "Movement", pose: carrying },
  { type: "carry", label: "Carrying Objects", description: "Arms forward carry", group: "Movement", pose: carrying },
  { type: "wave", label: "Waving Hands", description: "Friendly wave", group: "Gestures", pose: waving },
  { type: "talk", label: "Talking", description: "Mouth and hand motion", group: "Gestures", pose: talking },
  { type: "teach", label: "Teaching", description: "Pointing and explaining", group: "Gestures", pose: teaching },
  { type: "salute", label: "Saluting", description: "Military salute", group: "Gestures", pose: saluting },
  { type: "clap", label: "Clapping", description: "Excited claps", group: "Gestures", pose: clapping },
  { type: "laugh", label: "Laughing", description: "Joyful laughter", group: "Emotions", pose: laughing },
  { type: "cry", label: "Crying", description: "Sad tears", group: "Emotions", pose: crying },
  { type: "dance", label: "Dancing", description: "Party moves", group: "Emotions", pose: dancing },
  { type: "sleep", label: "Sleeping", description: "Sleep with Zzz", group: "Emotions", pose: sleeping },
  { type: "fight", label: "Fighting", description: "Combat stance", group: "Actions", pose: fighting },
  { type: "eat", label: "Eating", description: "Snack motion", group: "Actions", pose: eating },
  { type: "drink", label: "Drinking", description: "Sip a drink", group: "Actions", pose: drinking },
  { type: "farm", label: "Farming", description: "Tilling the field", group: "Actions", pose: farming },
];

export const ANIMATION_MAP = new Map(ANIMATIONS.map((a) => [a.type, a]));

export function getAnimationDef(type: AnimationType): AnimationDef {
  return ANIMATION_MAP.get(type) ?? ANIMATIONS[0];
}

function blinkAmount(t: number) {
  const cycle = t % 4.1;
  if (cycle < 0.12 || (cycle > 0.22 && cycle < 0.32)) return 0.05;
  return 1;
}

export function resolvePose(
  layers: AnimationLayer[],
  time: number,
  autoBlink: boolean,
  expression: Expression,
): Pose {
  const active = layers.length ? layers : [{ type: "idle" as AnimationType, weight: 1, speed: 1 }];
  const total = active.reduce((sum, layer) => sum + Math.max(0.001, layer.weight), 0);
  const result: Pose = { ...basePose };

  for (const layer of active) {
    const def = getAnimationDef(layer.type);
    const partial = def.pose(time * Math.max(0.05, layer.speed));
    const weight = Math.max(0.001, layer.weight) / total;
    for (const key of Object.keys(partial) as (keyof Pose)[]) {
      const value = partial[key];
      if (typeof value === "number") {
        result[key] += value * weight;
      }
    }
  }

  if (expression === "angry") {
    result.smile -= 0.55;
    result.headRot += 1.5;
  } else if (expression === "sad") {
    result.smile -= 0.7;
  } else if (expression === "happy" || expression === "smile") {
    result.smile += 0.45;
  } else if (expression === "surprised") {
    result.mouthOpen = Math.max(result.mouthOpen, 0.35);
  }

  const closedEyes = result.sleepy > 0.5 || result.cry > 0.5;
  if (closedEyes) {
    result.eyeOpen = Math.min(result.eyeOpen, 0.08);
  } else if (autoBlink && result.eyeOpen > 0.4) {
    result.eyeOpen = Math.min(result.eyeOpen, blinkAmount(time));
  }

  result.eyeOpen = Math.min(1, Math.max(0, result.eyeOpen));
  result.mouthOpen = Math.min(1, Math.max(0, result.mouthOpen));
  result.smile = Math.min(1, Math.max(-1, result.smile));
  return result;
}

export function makeLayer(type: AnimationType): AnimationLayer {
  return { type, weight: 1, speed: 1 };
}
