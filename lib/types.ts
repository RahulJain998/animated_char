export type CharacterType =
  | "farmer"
  | "teacher"
  | "soldier"
  | "doctor"
  | "police"
  | "engineer"
  | "businessman"
  | "man"
  | "woman"
  | "boy"
  | "girl"
  | "child"
  | "oldman"
  | "oldwoman"
  | "custom";

export type FaceShape = "oval" | "round" | "square" | "heart" | "long";
export type EyeStyle = "round" | "almond" | "wide" | "sleepy" | "happy";
export type BrowStyle = "normal" | "arched" | "thick" | "thin" | "angry" | "worried";
export type NoseStyle = "button" | "straight" | "round" | "wide" | "pointed";
export type MouthStyle = "smile" | "neutral" | "grin" | "sad" | "angry" | "open";
export type Expression = "smile" | "neutral" | "angry" | "sad" | "happy" | "surprised";
export type HairStyle =
  | "short"
  | "long"
  | "curly"
  | "straight"
  | "bald"
  | "ponytail"
  | "bun"
  | "afro"
  | "mohawk";
export type BeardStyle = "none" | "stubble" | "goatee" | "full" | "mustache" | "handlebar" | "chin";
export type GlassesStyle = "none" | "round" | "square" | "sunglasses";
export type UpperClothing =
  | "tshirt"
  | "shirt"
  | "jacket"
  | "sweater"
  | "uniform"
  | "police"
  | "army"
  | "farmer"
  | "teacher"
  | "doctor"
  | "labcoat"
  | "suit";
export type LowerClothing = "jeans" | "pants" | "shorts" | "trousers" | "skirt";
export type ShoeStyle = "sneakers" | "formal" | "boots" | "sandals";
export type AccessoryType =
  | "cap"
  | "hat"
  | "helmet"
  | "glasses"
  | "sunglasses"
  | "watch"
  | "belt"
  | "bag"
  | "gloves"
  | "cane";

export type AnimationType =
  | "idle"
  | "blink"
  | "walk"
  | "run"
  | "run-left"
  | "run-right"
  | "jump"
  | "sit"
  | "stand"
  | "wave"
  | "talk"
  | "laugh"
  | "cry"
  | "dance"
  | "fight"
  | "sleep"
  | "eat"
  | "drink"
  | "clap"
  | "walk-object"
  | "carry"
  | "farm"
  | "teach"
  | "salute";

export type Facing = "left" | "right";

export interface AnimationLayer {
  type: AnimationType;
  weight: number;
  speed: number;
}

export interface CharacterConfig {
  type: CharacterType;
  name: string;
  skinTone: string;
  faceShape: FaceShape;
  eyeStyle: EyeStyle;
  eyeColor: string;
  browStyle: BrowStyle;
  noseStyle: NoseStyle;
  mouthStyle: MouthStyle;
  earSize: number;
  hairStyle: HairStyle;
  hairColor: string;
  beardStyle: BeardStyle;
  beardColor: string;
  glasses: GlassesStyle;
  expression: Expression;
  height: number;
  bodySize: number;
  headSize: number;
  armLength: number;
  legLength: number;
  upper: UpperClothing;
  upperColor: string;
  lower: LowerClothing;
  lowerColor: string;
  shoes: ShoeStyle;
  shoeColor: string;
  accessories: AccessoryType[];
  accessoryColor: string;
  animation: AnimationType;
  animationSpeed: number;
  animationLayers: AnimationLayer[];
  facing: Facing;
  autoBlink: boolean;
}

export interface Character {
  id: string;
  config: CharacterConfig;
}

export type BackgroundPreset =
  | "village"
  | "farm"
  | "school"
  | "classroom"
  | "city"
  | "road"
  | "forest"
  | "mountains"
  | "house"
  | "hospital"
  | "army-camp"
  | "park"
  | "beach"
  | "sky";

export interface SceneBackground {
  kind: "transparent" | "solid" | "preset" | "image";
  preset: BackgroundPreset;
  color: string;
  image?: string;
  imageName?: string;
}

export type SceneTransition = "cut" | "fade" | "slide" | "zoom";

export type ObjectCategory = "farm" | "daily" | "education" | "military" | "nature";

export type ObjectType =
  | "tractor"
  | "plough"
  | "shovel"
  | "watering-can"
  | "seeds"
  | "plant"
  | "tree"
  | "hay"
  | "fence"
  | "goat"
  | "cow"
  | "chicken"
  | "sheep"
  | "horse"
  | "chair"
  | "table"
  | "bed"
  | "cup"
  | "bottle"
  | "phone"
  | "laptop"
  | "bicycle"
  | "car"
  | "motorcycle"
  | "book"
  | "blackboard"
  | "whiteboard"
  | "schoolbag"
  | "pencil"
  | "pen"
  | "desk"
  | "army-backpack"
  | "military-helmet"
  | "dog-tags"
  | "sandbag"
  | "sun"
  | "moon"
  | "cloud"
  | "mountain"
  | "river"
  | "grass"
  | "flower"
  | "rain"
  | "snow";

export interface SceneObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  color: string;
  flip: boolean;
  label?: string;
}

export interface SceneCharacter {
  id: string;
  characterId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  flip: boolean;
  animation: AnimationType;
  animationSpeed: number;
  animationLayers: AnimationLayer[];
}

export interface Keyframe {
  id: string;
  frame: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  animation?: AnimationType;
  animationLayers?: AnimationLayer[];
}

export interface Track {
  id: string;
  targetId: string;
  targetType: "character" | "object";
  keyframes: Keyframe[];
}

export interface Scene {
  id: string;
  name: string;
  background: SceneBackground;
  objects: SceneObject[];
  characters: SceneCharacter[];
  tracks: Track[];
  fps: number;
  durationFrames: number;
  loopStart: number;
  loopEnd: number;
  transition: SceneTransition;
  narration?: string;
}

export interface Project {
  id: string;
  name: string;
  characters: Character[];
  scenes: Scene[];
  activeSceneId: string;
  createdAt: number;
  updatedAt: number;
}

export interface StoryCharacterPlan {
  role: CharacterType;
  name: string;
  x: number;
  y: number;
  scale: number;
  animation: AnimationType;
  facing: Facing;
  flip: boolean;
  keyframes: {
    frame: number;
    x: number;
    y: number;
    animation: AnimationType;
    scale?: number;
    rotation?: number;
    opacity?: number;
  }[];
}

export interface StoryObjectPlan {
  type: ObjectType;
  x: number;
  y: number;
  scale: number;
  color?: string;
  rotation?: number;
}

export interface StoryScenePlan {
  title: string;
  narration: string;
  background: BackgroundPreset;
  transition: SceneTransition;
  fps: number;
  durationFrames: number;
  characters: StoryCharacterPlan[];
  objects: StoryObjectPlan[];
}

export interface StoryPlan {
  title: string;
  synopsis: string;
  scenes: StoryScenePlan[];
}

export type ExportFormat = "webm" | "mp4" | "gif" | "png" | "sprite" | "sequence";

export interface ExportSettings {
  format: ExportFormat;
  resolution: "720p" | "1080p" | "4K";
  fps: 24 | 30 | 60;
  background: "scene" | "transparent" | "solid" | "image";
  solidColor: string;
  image?: string;
  imageName?: string;
  sceneId: string;
}
