import { buildCharacterSvg } from "./characterSvg";
import { resolvePose } from "./animations";
import { buildBackgroundSvg } from "./backgrounds";
import { getObjectDef } from "./objectLibrary";
import type {
  AnimationLayer,
  AnimationType,
  Character,
  Keyframe,
  Project,
  Scene,
  SceneBackground,
  SceneCharacter,
  SceneObject,
  Track,
} from "./types";

export interface SceneSvgOptions {
  width?: number;
  height?: number;
  backgroundOverride?: Omit<Partial<SceneBackground>, "kind"> & { kind: "transparent" | "solid" | "image" | "scene" };
}

export interface EffectiveTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function findTrack(scene: Scene, targetId: string, targetType: "character" | "object") {
  return scene.tracks.find((track) => track.targetId === targetId && track.targetType === targetType);
}

export function sampleTrack(track: Track | undefined, frame: number, fallback: EffectiveTransform): EffectiveTransform {
  if (!track || track.keyframes.length === 0) return fallback;
  const keys = [...track.keyframes].sort((a, b) => a.frame - b.frame);
  if (frame <= keys[0].frame) {
    return {
      x: keys[0].x,
      y: keys[0].y,
      scale: keys[0].scale,
      rotation: keys[0].rotation,
      opacity: keys[0].opacity,
    };
  }
  if (frame >= keys[keys.length - 1].frame) {
    const last = keys[keys.length - 1];
    return { x: last.x, y: last.y, scale: last.scale, rotation: last.rotation, opacity: last.opacity };
  }
  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = (frame - a.frame) / Math.max(1, b.frame - a.frame);
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        scale: lerp(a.scale, b.scale, t),
        rotation: lerp(a.rotation, b.rotation, t),
        opacity: lerp(a.opacity, b.opacity, t),
      };
    }
  }
  return fallback;
}

export function animationAtFrame(
  track: Track | undefined,
  frame: number,
  fallbackAnimation: AnimationType,
  fallbackLayers: AnimationLayer[],
) {
  if (!track) return { animation: fallbackAnimation, layers: fallbackLayers };
  const withAnimation = [...track.keyframes]
    .filter((k) => k.animation && k.frame <= frame)
    .sort((a, b) => a.frame - b.frame);
  if (!withAnimation.length) return { animation: fallbackAnimation, layers: fallbackLayers };
  const key = withAnimation[withAnimation.length - 1];
  return {
    animation: key.animation ?? fallbackAnimation,
    layers: key.animationLayers?.length
      ? key.animationLayers
      : ([{ type: key.animation ?? fallbackAnimation, weight: 1, speed: 1 }] as AnimationLayer[]),
  };
}

export function effectiveCharacterTransform(scene: Scene, character: SceneCharacter, frame: number) {
  return sampleTrack(findTrack(scene, character.id, "character"), frame, {
    x: character.x,
    y: character.y,
    scale: character.scale,
    rotation: character.rotation,
    opacity: character.opacity,
  });
}

export function effectiveObjectTransform(scene: Scene, object: SceneObject, frame: number) {
  return sampleTrack(findTrack(scene, object.id, "object"), frame, {
    x: object.x,
    y: object.y,
    scale: object.scale,
    rotation: object.rotation,
    opacity: object.opacity,
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderBackground(background: SceneBackground, override?: SceneSvgOptions["backgroundOverride"]) {
  const kind = override?.kind && override.kind !== "scene" ? override.kind : background.kind;
  if (kind === "transparent") return "";
  if (kind === "solid") {
    return `<rect width="1600" height="900" fill="${escapeXml(override?.color ?? background.color ?? "#ffffff")}"/>`;
  }
  if (kind === "image") {
    const image = override?.image ?? background.image;
    if (image) {
      return `<image href="${escapeXml(image)}" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice"/>`;
    }
  }
  if (kind === "preset" || (kind as string) === "preset") {
    return buildBackgroundSvg(override?.preset ?? background.preset);
  }
  if (background.kind === "solid") {
    return `<rect width="1600" height="900" fill="${escapeXml(background.color)}"/>`;
  }
  if (background.kind === "image" && background.image) {
    return `<image href="${escapeXml(background.image)}" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice"/>`;
  }
  return buildBackgroundSvg(background.preset);
}

function depthKey(type: SceneObject["type"] | "character") {
  if (type === "character") return 0;
  if (["sun", "moon", "cloud", "mountain", "river", "rain", "snow"].includes(type)) return -1;
  if (["tree", "fence", "plant", "flower", "grass"].includes(type)) return 0;
  return 1;
}

export function buildSceneContent(project: Project, scene: Scene, frame: number, options: SceneSvgOptions = {}): string {
  const charMap = new Map<string, Character>(project.characters.map((c) => [c.id, c]));
  const time = frame / Math.max(1, scene.fps);
  const layersToRender: { y: number; depth: number; order: number; markup: string }[] = [];
  let order = 0;

  for (const object of scene.objects) {
    const def = getObjectDef(object.type);
    const transform = effectiveObjectTransform(scene, object, frame);
    const flip = object.flip ? -1 : 1;
    const markup = `<g transform="translate(${transform.x} ${transform.y}) rotate(${transform.rotation}) scale(${transform.scale * flip} ${transform.scale}) translate(${-def.w / 2} ${-def.h / 2})" opacity="${clamp(transform.opacity, 0, 1)}">${def.draw(object.color)}</g>`;
    layersToRender.push({ y: transform.y, depth: depthKey(object.type), order: order++, markup });
  }

  for (const sceneChar of scene.characters) {
    const character = charMap.get(sceneChar.characterId);
    if (!character) continue;
    const transform = effectiveCharacterTransform(scene, sceneChar, frame);
    const track = findTrack(scene, sceneChar.id, "character");
    const anim = animationAtFrame(track, frame, sceneChar.animation, sceneChar.animationLayers);
    const layers = anim.layers.map((layer) => ({
      ...layer,
      speed: layer.speed * (sceneChar.animationSpeed || 1),
    }));
    const pose = resolvePose(layers, time, character.config.autoBlink, character.config.expression);
    const flip = sceneChar.flip ? -1 : 1;
    const markup = `<g transform="translate(${transform.x} ${transform.y}) rotate(${transform.rotation}) scale(${transform.scale * flip} ${transform.scale})" opacity="${clamp(transform.opacity, 0, 1)}">${buildCharacterSvg(character.config, pose, `${sceneChar.id}-${Math.floor(frame)}`)}</g>`;
    layersToRender.push({ y: transform.y, depth: 1, order: order++, markup });
  }

  const sorted = layersToRender.sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    if (a.y !== b.y) return a.y - b.y;
    return a.order - b.order;
  });

  return `${renderBackground(scene.background, options.backgroundOverride)}${sorted.map((l) => l.markup).join("")}`;
}

export function buildSceneSvg(project: Project, scene: Scene, frame: number, options: SceneSvgOptions = {}): string {
  const width = options.width ?? 1600;
  const height = options.height ?? 900;
  const content = buildSceneContent(project, scene, frame, options);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet">${content}</svg>`;
}

export function buildCharacterPreviewSvg(
  character: Character,
  options: { animation?: AnimationType; layers?: AnimationLayer[]; speed?: number; time?: number } = {},
) {
  const layers = options.layers ?? [
    { type: options.animation ?? character.config.animation, weight: 1, speed: options.speed ?? 1 },
  ];
  const pose = resolvePose(
    layers.map((l) => ({ ...l, speed: l.speed * (options.speed ?? 1) })),
    options.time ?? 0.55,
    character.config.autoBlink,
    character.config.expression,
  );
  const content = buildCharacterSvg(character.config, pose, `preview-${character.id}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-180 -610 360 640" width="360" height="640" preserveAspectRatio="xMidYMid meet">${content}</svg>`;
}

export function getSceneDuration(scene: Scene) {
  return Math.max(1, scene.durationFrames);
}

export function keyframeValueAt(track: Track | undefined, frame: number): Keyframe | undefined {
  if (!track) return undefined;
  return track.keyframes.find((k) => Math.abs(k.frame - frame) < 0.5);
}
