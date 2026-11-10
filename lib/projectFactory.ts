import { createCharacterConfig } from "./characterPresets";
import { uid } from "./ids";
import type {
  AnimationLayer,
  Character,
  CharacterConfig,
  CharacterType,
  Keyframe,
  Project,
  Scene,
  SceneCharacter,
  SceneObject,
  StoryPlan,
  Track,
} from "./types";
import { getObjectDef } from "./objectLibrary";

export function createScene(name = "Scene 1"): Scene {
  return {
    id: uid("scene"),
    name,
    background: { kind: "preset", preset: "farm", color: "#ffffff" },
    objects: [],
    characters: [],
    tracks: [],
    fps: 30,
    durationFrames: 180,
    loopStart: 0,
    loopEnd: 180,
    transition: "fade",
    narration: "",
  };
}

export function createSceneCharacter(characterId: string, x = 800, y = 780): SceneCharacter {
  return {
    id: uid("inst"),
    characterId,
    x,
    y,
    scale: 1,
    rotation: 0,
    opacity: 1,
    flip: false,
    animation: "idle",
    animationSpeed: 1,
    animationLayers: [{ type: "idle", weight: 1, speed: 1 }],
  };
}

export function createObject(type: SceneObject["type"], x = 800, y = 650, color?: string): SceneObject {
  const def = getObjectDef(type);
  return {
    id: uid("obj"),
    type,
    x,
    y,
    scale: 1,
    rotation: 0,
    opacity: 1,
    color: color ?? def.defaultColor,
    flip: false,
    label: def.label,
  };
}

export function createCharacter(type: CharacterType, name?: string): Character {
  const config = createCharacterConfig(type, name);
  return { id: uid("char"), config };
}

export function createKeyframe(frame: number, base: {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  animation?: SceneCharacter["animation"];
  animationLayers?: AnimationLayer[];
}): Keyframe {
  return {
    id: uid("key"),
    frame,
    x: base.x,
    y: base.y,
    scale: base.scale,
    rotation: base.rotation,
    opacity: base.opacity,
    animation: base.animation,
    animationLayers: base.animationLayers?.map((l) => ({ ...l })),
  };
}

export function createTrack(targetId: string, targetType: "character" | "object"): Track {
  return { id: uid("track"), targetId, targetType, keyframes: [] };
}

export function createEmptyProject(name = "Untitled Story"): Project {
  const scene = createScene();
  return {
    id: uid("project"),
    name,
    characters: [],
    scenes: [scene],
    activeSceneId: scene.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createDemoProject(): Project {
  const farmer = createCharacter("farmer", "Farmer");
  const farmerConfig: CharacterConfig = { ...farmer.config };
  farmer.config = farmerConfig;

  const scene = createScene("Farm Morning");
  scene.background = { kind: "preset", preset: "farm", color: "#ffffff" };
  scene.durationFrames = 180;
  scene.loopEnd = 180;
  scene.narration = "The farmer begins his day in the field.";

  const inst = createSceneCharacter(farmer.id, 730, 800);
  inst.scale = 1.02;
  scene.characters.push(inst);

  const tree = createObject("tree", 1320, 690);
  tree.scale = 1.15;
  const fence = createObject("fence", 300, 760);
  fence.scale = 1.1;
  const sun = createObject("sun", 260, 150);
  sun.scale = 0.8;
  const hay = createObject("hay", 1090, 790);
  hay.scale = 0.9;
  scene.objects.push(tree, fence, sun, hay);

  const track = createTrack(inst.id, "character");
  track.keyframes = [
    createKeyframe(0, {
      ...inst,
      animation: "idle",
      animationLayers: [{ type: "idle", weight: 1, speed: 1 }],
    }),
    createKeyframe(40, {
      ...inst,
      x: 730,
      animation: "walk",
      animationLayers: [{ type: "walk", weight: 1, speed: 1 }],
    }),
    createKeyframe(90, {
      ...inst,
      x: 980,
      animation: "wave",
      animationLayers: [{ type: "wave", weight: 1, speed: 1 }],
    }),
    createKeyframe(130, {
      ...inst,
      x: 980,
      animation: "idle",
      animationLayers: [{ type: "idle", weight: 1, speed: 1 }],
    }),
  ];
  scene.tracks.push(track);

  return {
    id: uid("project"),
    name: "Farm Morning",
    characters: [farmer],
    scenes: [scene],
    activeSceneId: scene.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function applyStoryPlan(plan: StoryPlan, appendTo?: Project): Project {
  const base = appendTo ?? createEmptyProject(plan.title);
  const characters = appendTo ? [...appendTo.characters] : [];
  const scenes = appendTo ? [...appendTo.scenes] : [];
  const characterByKey = new Map<string, Character>();

  plan.scenes.forEach((scenePlan, sceneIndex) => {
    const scene = createScene(scenePlan.title || `Scene ${scenes.length + 1}`);
    scene.background = {
      kind: "preset",
      preset: scenePlan.background,
      color: "#ffffff",
    };
    scene.transition = scenePlan.transition;
    scene.fps = scenePlan.fps;
    scene.durationFrames = scenePlan.durationFrames;
    scene.loopEnd = scenePlan.durationFrames;
    scene.narration = scenePlan.narration;

    for (const objectPlan of scenePlan.objects) {
      const object = createObject(objectPlan.type, objectPlan.x, objectPlan.y, objectPlan.color);
      object.scale = objectPlan.scale;
      object.rotation = objectPlan.rotation ?? 0;
      scene.objects.push(object);
    }

    for (const charPlan of scenePlan.characters) {
      const key = `${charPlan.role}|${charPlan.name}`;
      let character = characterByKey.get(key);
      if (!character) {
        character = createCharacter(charPlan.role, charPlan.name);
        characterByKey.set(key, character);
        const existing = characters.find((c) => c.config.name === character!.config.name);
        if (existing) character = existing;
        else characters.push(character);
        characterByKey.set(key, character);
      }

      const inst = createSceneCharacter(character.id, charPlan.x, charPlan.y);
      inst.scale = charPlan.scale;
      inst.animation = charPlan.animation;
      inst.animationSpeed = 1;
      inst.flip = charPlan.flip;
      inst.animationLayers = [{ type: charPlan.animation, weight: 1, speed: 1 }];
      scene.characters.push(inst);

      if (charPlan.keyframes.length) {
        const track = createTrack(inst.id, "character");
        const sorted = [...charPlan.keyframes].sort((a, b) => a.frame - b.frame);
        track.keyframes = sorted.map((k) =>
          createKeyframe(k.frame, {
            x: k.x,
            y: k.y,
            scale: k.scale ?? inst.scale,
            rotation: k.rotation ?? 0,
            opacity: k.opacity ?? 1,
            animation: k.animation,
            animationLayers: [{ type: k.animation, weight: 1, speed: 1 }],
          }),
        );
        scene.tracks.push(track);
      }
    }

    if (sceneIndex === 0 && !appendTo) {
      scene.name = plan.scenes[0].title || "Scene 1";
    }
    scenes.push(scene);
  });

  if (!scenes.length) scenes.push(createScene());

  return {
    ...base,
    name: plan.title || base.name,
    characters,
    scenes,
    activeSceneId: appendTo ? scenes[scenes.length - 1].id : scenes[0].id,
    updatedAt: Date.now(),
  };
}
