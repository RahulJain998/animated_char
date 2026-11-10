"use client";

import {
  Activity,
  ArrowDownToLine,
  ArrowLeftRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  Copy,
  Download,
  Eye,
  Film,
  FolderOpen,
  Hand,
  Image,
  Layers,
  Lightbulb,
  Maximize2,
  Mic2,
  Minus,
  MoreHorizontal,
  Move,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Scissors,
  Search,
  Settings2,
  Sparkles,
  Square,
  Star,
  Trash2,
  Upload,
  UserRound,
  Video,
  WandSparkles,
  X,
} from "lucide-react";
import JSZip from "jszip";
import { GIFEncoder, applyPalette, quantize } from "gifenc";
import { ArrayBufferTarget, Muxer } from "mp4-muxer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { ANIMATIONS } from "@/lib/animations";
import { BACKGROUNDS } from "@/lib/backgrounds";
import {
  ACCESSORIES,
  BEARD_STYLES,
  CHARACTER_TYPES,
  CLOTHING_COLORS,
  EYE_COLORS,
  EYE_STYLES,
  EXPRESSIONS,
  FACE_SHAPES,
  GLASSES_STYLES,
  HAIR_COLORS,
  HAIR_STYLES,
  LOWER_CLOTHING,
  MOUTH_STYLES,
  NOSE_STYLES,
  SHOE_STYLES,
  SKIN_TONES,
  UPPER_CLOTHING,
} from "@/lib/characterPresets";
import { createCharacter, createKeyframe, createObject, createScene, createSceneCharacter, createTrack } from "@/lib/projectFactory";
import { generateStoryPlan } from "@/lib/storyGenerator";
import { buildCharacterPreviewSvg, buildSceneSvg } from "@/lib/sceneSvg";
import { searchObjectLibrary } from "@/lib/objectLibrary";
import type {
  AccessoryType,
  AnimationType,
  BackgroundPreset,
  Character,
  CharacterConfig,
  CharacterType,
  ExportFormat,
  Project,
  Scene,
  SceneBackground,
  SceneCharacter,
  SceneObject,
} from "@/lib/types";

type PanelTab = "characters" | "clothes" | "objects" | "backgrounds" | "scenes" | "animations" | "story";
type Selection = { kind: "character"; id: string } | { kind: "object"; id: string } | null;
type ExportOptions = { format: ExportFormat; resolution: "720p" | "1080p" | "4K"; fps: 24 | 30 | 60 };

const navItems: { id: PanelTab; label: string; icon: typeof UserRound }[] = [
  { id: "characters", label: "Characters", icon: UserRound },
  { id: "clothes", label: "Wardrobe", icon: Scissors },
  { id: "objects", label: "Objects", icon: Layers },
  { id: "backgrounds", label: "Scenes", icon: Image },
  { id: "animations", label: "Motion", icon: Activity },
];
const animationGroups = ["Essentials", "Movement", "Gestures", "Emotions", "Actions"] as const;
const resolutionMap = { "720p": [1280, 720], "1080p": [1920, 1080], "4K": [3840, 2160] } as const;

function cloneProject(project: Project): Project {
  return JSON.parse(JSON.stringify(project)) as Project;
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function OptionSelect({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="control-field">
      <span>{label}</span>
      <span className="select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown size={13} />
      </span>
    </label>
  );
}

function RangeControl({ label, value, min, max, step = 0.01, suffix = "", onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-field">
      <span className="range-title">{label}<b>{value.toFixed(step < 1 ? 2 : 0)}{suffix}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function ColorSwatches({ label, colors, value, onChange }: {
  label: string;
  colors: readonly (string | { label: string; value: string })[];
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="color-control">
      <div className="field-caption">{label}</div>
      <div className="swatch-row">
        {colors.map((item) => {
          const color = typeof item === "string" ? item : item.value;
          const title = typeof item === "string" ? item : item.label;
          return <button aria-label={title} title={title} className={`swatch ${value === color ? "active" : ""}`} key={color} style={{ backgroundColor: color }} onClick={() => onChange(color)} />;
        })}
        <label className="custom-swatch" title="Custom color"><Plus size={13} /><input type="color" value={value} onChange={(event) => onChange(event.target.value)} /></label>
      </div>
    </div>
  );
}

function PanelTitle({ title, meta, icon }: { title: string; meta?: string; icon?: ReactNode }) {
  return <div className="panel-title"><span>{icon}{title}</span>{meta && <small>{meta}</small>}</div>;
}

function makeStoryProject(prompt: string, project: Project) {
  const plan = generateStoryPlan(prompt);
  const characters = [...project.characters];
  const scenes = plan.scenes.map((scenePlan, index) => {
    const scene = createScene(scenePlan.title || `Scene ${index + 1}`);
    scene.background = { kind: "preset", preset: scenePlan.background, color: "#ffffff" };
    scene.transition = scenePlan.transition;
    scene.durationFrames = scenePlan.durationFrames;
    scene.loopEnd = scenePlan.durationFrames;
    scene.fps = scenePlan.fps;
    scene.narration = scenePlan.narration;
    for (const objectPlan of scenePlan.objects) {
      const object = createObject(objectPlan.type, objectPlan.x, objectPlan.y);
      object.scale = objectPlan.scale;
      object.rotation = objectPlan.rotation ?? 0;
      scene.objects.push(object);
    }
    for (const charPlan of scenePlan.characters) {
      let character = characters.find((candidate) => candidate.config.type === charPlan.role && candidate.config.name === charPlan.name);
      if (!character) {
        character = createCharacter(charPlan.role, charPlan.name);
        characters.push(character);
      }
      const instance = createSceneCharacter(character.id, charPlan.x, charPlan.y);
      instance.scale = charPlan.scale;
      instance.animation = charPlan.animation;
      instance.flip = charPlan.flip;
      instance.animationLayers = [{ type: charPlan.animation, weight: 1, speed: 1 }];
      scene.characters.push(instance);
      const track = createTrack(instance.id, "character");
      track.keyframes = charPlan.keyframes.map((key) => createKeyframe(key.frame, {
        x: key.x, y: key.y, scale: key.scale ?? charPlan.scale, rotation: key.rotation ?? 0, opacity: key.opacity ?? 1,
        animation: key.animation, animationLayers: [{ type: key.animation, weight: 1, speed: 1 }],
      }));
      scene.tracks.push(track);
    }
    return scene;
  });
  return { ...project, name: plan.title || project.name, characters, scenes, activeSceneId: scenes[0]?.id ?? project.activeSceneId, updatedAt: Date.now() };
}

export default function Home() {
  const [project, setProject] = useState<Project | null>(null);
  const [panel, setPanel] = useState<PanelTab>("characters");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [objectCategory, setObjectCategory] = useState("all");
  const [storyPrompt, setStoryPrompt] = useState("");
  const [storyReady, setStoryReady] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({ format: "webm", resolution: "720p", fps: 30 });
  const [exportBackground, setExportBackground] = useState<"scene" | "transparent" | "solid" | "image">("scene");
  const [exportSolidColor, setExportSolidColor] = useState("#14141c");
  const [layerAnimation, setLayerAnimation] = useState<AnimationType>("blink");
  const [status, setStatus] = useState("All changes saved");
  const [zoom, setZoom] = useState(100);
  const [showCharacterEditor, setShowCharacterEditor] = useState(true);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; kind: "character" | "object"; x: number; y: number; startX: number; startY: number } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("animagic-project");
      const loaded = saved ? JSON.parse(saved) as Project : null;
      if (loaded?.scenes?.length) {
        setProject(loaded);
        setSelectedCharacterId(loaded.characters[0]?.id ?? null);
      } else {
        setProject((awaitDemoProject()));
      }
    } catch (error) {
      console.error("Could not load the saved Animagic project.", error);
      setProject((awaitDemoProject()));
      setStatus("Could not load saved project");
    }
  }, []);

  useEffect(() => {
    if (!project) return;
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem("animagic-project", JSON.stringify({ ...project, updatedAt: Date.now() }));
        setStatus("All changes saved");
      } catch (error) {
        console.error("Could not save the Animagic project.", error);
        setStatus("Save failed — storage may be full");
      }
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [project]);

  const scene = useMemo(() => project?.scenes.find((item) => item.id === project.activeSceneId) ?? project?.scenes[0] ?? null, [project]);
  const activeCharacter = useMemo(() => project?.characters.find((item) => item.id === selectedCharacterId) ?? project?.characters[0] ?? null, [project, selectedCharacterId]);
  const selectedSceneCharacter = selection?.kind === "character" ? scene?.characters.find((item) => item.id === selection.id) ?? null : null;
  const selectedObject = selection?.kind === "object" ? scene?.objects.find((item) => item.id === selection.id) ?? null : null;

  const updateProject = useCallback((updater: (value: Project) => Project) => {
    setProject((current) => current ? updater(current) : current);
    setStatus("Saving…");
  }, []);
  const updateScene = useCallback((updater: (current: Scene) => Scene) => {
    updateProject((current) => ({
      ...current,
      scenes: current.scenes.map((item) => item.id === current.activeSceneId ? updater(item) : item),
      updatedAt: Date.now(),
    }));
  }, [updateProject]);
  const updateCharacter = useCallback(<K extends keyof CharacterConfig,>(key: K, value: CharacterConfig[K]) => {
    if (!activeCharacter) return;
    updateProject((current) => ({
      ...current,
      characters: current.characters.map((item) => item.id === activeCharacter.id ? { ...item, config: { ...item.config, [key]: value } } : item),
      updatedAt: Date.now(),
    }));
  }, [activeCharacter, updateProject]);

  const addCharacter = (type: CharacterType) => {
    if (!project) return;
    const def = CHARACTER_TYPES.find((item) => item.type === type);
    const character = createCharacter(type, `${def?.label ?? "Character"} ${project.characters.length + 1}`);
    updateProject((current) => ({ ...current, characters: [...current.characters, character] }));
    const instance = createSceneCharacter(character.id, 800 + scene!.characters.length * 100, 790);
    updateScene((current) => ({ ...current, characters: [...current.characters, instance] }));
    setSelectedCharacterId(character.id);
    setSelection({ kind: "character", id: instance.id });
  };

  const addObject = (type: SceneObject["type"]) => {
    if (!scene) return;
    const object = createObject(type, 790 + scene.objects.length * 32, 710);
    updateScene((current) => ({ ...current, objects: [...current.objects, object] }));
    setSelection({ kind: "object", id: object.id });
  };

  const setBackground = (background: SceneBackground) => updateScene((current) => ({ ...current, background }));

  const addScene = () => {
    if (!project || !scene) return;
    const nextScene = createScene(`Scene ${project.scenes.length + 1}`);
    nextScene.background = { ...scene.background };
    nextScene.characters = scene.characters.map((item) => ({ ...item, id: `inst_${crypto.randomUUID().slice(0, 8)}` }));
    updateProject((current) => ({ ...current, scenes: [...current.scenes, nextScene], activeSceneId: nextScene.id }));
    setFrame(0);
    setSelection(null);
  };

  const duplicateScene = () => {
    if (!scene) return;
    const copied = cloneProject({ ...project!, scenes: [scene] }).scenes[0];
    copied.id = `scene_${crypto.randomUUID().slice(0, 8)}`;
    copied.name = `${scene.name} copy`;
    const targetIds = new Map<string, string>();
    copied.objects = copied.objects.map((item) => {
      const id = `obj_${crypto.randomUUID().slice(0, 8)}`;
      targetIds.set(item.id, id);
      return { ...item, id };
    });
    copied.characters = copied.characters.map((item) => {
      const id = `inst_${crypto.randomUUID().slice(0, 8)}`;
      targetIds.set(item.id, id);
      return { ...item, id };
    });
    copied.tracks = copied.tracks.map((track) => ({
      ...track,
      id: `track_${crypto.randomUUID().slice(0, 8)}`,
      targetId: targetIds.get(track.targetId) ?? track.targetId,
      keyframes: track.keyframes.map((keyframe) => ({ ...keyframe, id: `key_${crypto.randomUUID().slice(0, 8)}` })),
    }));
    updateProject((current) => ({ ...current, scenes: [...current.scenes, copied], activeSceneId: copied.id }));
    setFrame(0);
  };

  const duplicateCharacter = () => {
    if (!activeCharacter) return;
    const copy = cloneProject({ ...project!, characters: [activeCharacter] }).characters[0];
    copy.id = `char_${crypto.randomUUID().slice(0, 8)}`;
    copy.config.name = `${copy.config.name} copy`;
    updateProject((current) => ({ ...current, characters: [...current.characters, copy] }));
    if (scene) {
      const instance = createSceneCharacter(copy.id, 860, 790);
      updateScene((current) => ({ ...current, characters: [...current.characters, instance] }));
      setSelection({ kind: "character", id: instance.id });
    }
    setSelectedCharacterId(copy.id);
  };

  const handleStagePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!stageRef.current || !scene || event.button !== 0) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1600;
    const y = ((event.clientY - rect.top) / rect.height) * 900;
    const currentSelection = selection ?? (scene.characters[0] ? { kind: "character" as const, id: scene.characters[0].id } : scene.objects[0] ? { kind: "object" as const, id: scene.objects[0].id } : null);
    if (!currentSelection) return;
    setSelection(currentSelection);
    if (currentSelection.kind === "character") {
      const item = scene.characters.find((candidate) => candidate.id === currentSelection.id);
      if (!item) return;
      dragRef.current = { id: item.id, kind: "character", x: item.x, y: item.y, startX: x, startY: y };
    } else {
      const item = scene.objects.find((candidate) => candidate.id === currentSelection.id);
      if (!item) return;
      dragRef.current = { id: item.id, kind: "object", x: item.x, y: item.y, startX: x, startY: y };
    }
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleStagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !stageRef.current) return;
    const drag = dragRef.current;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1600;
    const y = ((event.clientY - rect.top) / rect.height) * 900;
    const dx = x - drag.startX;
    const dy = y - drag.startY;
    if (drag.kind === "character") {
      updateScene((current) => ({ ...current, characters: current.characters.map((item) => item.id === drag.id ? { ...item, x: drag.x + dx, y: drag.y + dy } : item) }));
    } else {
      updateScene((current) => ({ ...current, objects: current.objects.map((item) => item.id === drag.id ? { ...item, x: drag.x + dx, y: drag.y + dy } : item) }));
    }
  };

  const addKeyframe = () => {
    if (!scene || !selection) return;
    updateScene((current) => {
      const targetType = selection.kind;
      const targetId = selection.id;
      let track = current.tracks.find((item) => item.targetId === targetId && item.targetType === targetType);
      const tracks = [...current.tracks];
      if (!track) {
        track = createTrack(targetId, targetType);
        tracks.push(track);
      }
      const keyframes = track.keyframes.filter((item) => item.frame !== frame);
      if (targetType === "character") {
        const target = current.characters.find((item) => item.id === targetId);
        if (!target) return current;
        keyframes.push(createKeyframe(frame, { ...target }));
      } else {
        const target = current.objects.find((item) => item.id === targetId);
        if (!target) return current;
        keyframes.push(createKeyframe(frame, { ...target }));
      }
      keyframes.sort((a, b) => a.frame - b.frame);
      track.keyframes = keyframes;
      return { ...current, tracks };
    });
  };

  const updateSelectedTransform = (key: "x" | "y" | "scale" | "rotation" | "opacity", value: number) => {
    if (!selection) return;
    updateScene((current) => selection.kind === "character"
      ? { ...current, characters: current.characters.map((item) => item.id === selection.id ? { ...item, [key]: value } : item) }
      : { ...current, objects: current.objects.map((item) => item.id === selection.id ? { ...item, [key]: value } : item) });
  };

  useEffect(() => {
    if (!playing || !scene) return;
    const timer = window.setInterval(() => {
      setFrame((value) => value >= scene.durationFrames ? 0 : value + 1);
    }, 1000 / scene.fps);
    return () => window.clearInterval(timer);
  }, [playing, scene]);

  const svg = useMemo(() => project && scene ? buildSceneSvg(project, scene, frame) : "", [project, scene, frame]);
  const matchingObjects = useMemo(() => searchObjectLibrary(search, objectCategory as "all" | "farm" | "daily" | "education" | "military" | "nature"), [objectCategory, search]);
  const selectedTrack = selection && scene ? scene.tracks.find((item) => item.targetId === selection.id && item.targetType === selection.kind) : undefined;

  const generateStory = () => {
    if (!project || !storyPrompt.trim()) return;
    setProject(makeStoryProject(storyPrompt, project));
    setStoryReady(true);
    setSelection(null);
    setFrame(0);
    setPanel("scenes");
  };

  const uploadBackground = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Choose an image file for the background");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setStatus("Image must be smaller than 4 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setBackground({ kind: "image", preset: "village", color: "#ffffff", image: reader.result, imageName: file.name });
    };
    reader.onerror = () => setStatus("Could not read the selected image");
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const exportVideo = async () => {
    if (!project || !scene) return;
    setStatus("Rendering export…");
    const [width, height] = resolutionMap[exportOptions.resolution];
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: exportOptions.format === "gif" });
    if (!context) {
      setStatus("Export failed: canvas is unavailable");
      return;
    }
    const totalFrames = Math.min(scene.durationFrames, exportOptions.fps * 10);
    const renderFrame = async (frameIndex: number) => {
      const svgFrame = buildSceneSvg(project, scene, frameIndex, {
        width, height,
        backgroundOverride: exportBackground === "scene"
          ? { kind: "scene" }
          : exportBackground === "image"
            ? { kind: "image", image: scene.background.kind === "image" ? scene.background.image : undefined }
            : exportBackground === "solid"
              ? { kind: "solid", color: exportSolidColor }
              : { kind: "transparent" },
      });
      const image = new window.Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgFrame)}`;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Could not render a scene frame"));
      });
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
    };
    try {
      if (exportOptions.format === "png") {
        await renderFrame(frame);
        canvas.toBlob((blob) => {
          if (blob) {
            triggerDownload(blob, `${project.name || "animagic"}-frame-${frame}.png`);
            setStatus("PNG frame exported");
          } else setStatus("PNG export failed");
        }, "image/png");
      } else if (exportOptions.format === "sprite" || exportOptions.format === "sequence") {
        const zip = new JSZip();
        const framesToExport = exportOptions.format === "sprite" ? Math.min(totalFrames, 12) : totalFrames;
        const columns = Math.ceil(Math.sqrt(framesToExport));
        const sprite = document.createElement("canvas");
        sprite.width = width * columns;
        sprite.height = height * Math.ceil(framesToExport / columns);
        const spriteContext = sprite.getContext("2d");
        if (!spriteContext) throw new Error("Could not create a sprite sheet canvas");
        for (let index = 0; index < framesToExport; index += 1) {
          await renderFrame(index);
          if (exportOptions.format === "sequence") {
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
            if (blob) zip.file(`frame-${String(index).padStart(4, "0")}.png`, blob);
          } else {
            spriteContext.drawImage(canvas, (index % columns) * width, Math.floor(index / columns) * height);
          }
        }
        if (exportOptions.format === "sprite") {
          const blob = await new Promise<Blob | null>((resolve) => sprite.toBlob(resolve, "image/png"));
          if (blob) zip.file("sprite-sheet.png", blob);
        }
        const blob = await zip.generateAsync({ type: "blob" });
        triggerDownload(blob, `${project.name || "animagic"}-${exportOptions.format}.zip`);
        setStatus(exportOptions.format === "sprite" ? "Sprite sheet exported" : "PNG sequence exported");
      } else if (exportOptions.format === "gif") {
        const gif = GIFEncoder();
        for (let index = 0; index < totalFrames; index += Math.max(1, Math.round(exportOptions.fps / 12))) {
          await renderFrame(index);
          const pixels = context.getImageData(0, 0, width, height).data;
          const palette = quantize(pixels, 256);
          gif.writeFrame(applyPalette(pixels, palette), width, height, { palette, delay: Math.round(1000 * Math.max(1, Math.round(exportOptions.fps / 12)) / exportOptions.fps) });
        }
        gif.finish();
        triggerDownload(new Blob([gif.bytes()], { type: "image/gif" }), `${project.name || "animagic"}.gif`);
        setStatus("GIF exported");
      } else if (exportOptions.format === "webm") {
        if (!window.MediaRecorder || !canvas.captureStream) throw new Error("WebM recording is not supported in this browser");
        const stream = canvas.captureStream(exportOptions.fps);
        const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm" });
        const parts: BlobPart[] = [];
        recorder.ondataavailable = (event) => { if (event.data.size) parts.push(event.data); };
        const completion = new Promise<void>((resolve, reject) => {
          recorder.onstop = () => resolve();
          recorder.onerror = () => reject(new Error("WebM recording failed"));
        });
        recorder.start();
        for (let index = 0; index < totalFrames; index += 1) {
          await renderFrame(index);
          await new Promise((resolve) => window.setTimeout(resolve, 1000 / exportOptions.fps));
        }
        recorder.stop();
        await completion;
        stream.getTracks().forEach((track) => track.stop());
        triggerDownload(new Blob(parts, { type: "video/webm" }), `${project.name || "animagic"}.webm`);
        setStatus("WebM exported");
      } else {
        if (!("VideoEncoder" in window) || !("VideoFrame" in window)) {
          throw new Error("MP4 export requires WebCodecs support in a current desktop browser");
        }
        const target = new ArrayBufferTarget();
        const muxer = new Muxer({
          target,
          fastStart: "in-memory",
          video: { codec: "avc", width, height, frameRate: exportOptions.fps },
        });
        const config: VideoEncoderConfig = {
          codec: "avc1.42001f",
          width,
          height,
          bitrate: exportOptions.resolution === "4K" ? 24_000_000 : exportOptions.resolution === "1080p" ? 12_000_000 : 6_000_000,
          framerate: exportOptions.fps,
        };
        const support = await VideoEncoder.isConfigSupported(config);
        if (!support.supported) throw new Error("This browser does not support H.264 WebCodecs encoding");
        let encoderError: Error | null = null;
        const encoder = new VideoEncoder({
          output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
          error: (error) => { encoderError = error; },
        });
        encoder.configure(support.config ?? config);
        for (let index = 0; index < totalFrames; index += 1) {
          await renderFrame(index);
          const videoFrame = new VideoFrame(canvas, {
            timestamp: Math.round(index * 1_000_000 / exportOptions.fps),
            duration: Math.round(1_000_000 / exportOptions.fps),
          });
          encoder.encode(videoFrame, { keyFrame: index % (exportOptions.fps * 2) === 0 });
          videoFrame.close();
        }
        await encoder.flush();
        encoder.close();
        if (encoderError) throw encoderError;
        muxer.finalize();
        if (!target.buffer) throw new Error("MP4 rendering produced no output");
        triggerDownload(new Blob([target.buffer], { type: "video/mp4" }), `${project.name || "animagic"}.mp4`);
        setStatus("MP4 exported");
      }
      setExportOpen(false);
    } catch (error) {
      console.error("Animagic export failed.", error);
      setStatus(error instanceof Error ? `Export failed: ${error.message}` : "Export failed");
    }
  };

  if (!project || !scene) return <main className="loading-screen"><div className="brand-mark"><Sparkles size={22} /></div><span>Opening your studio…</span></main>;

  const sceneSvg = svg;
  const selectedTransform = selectedSceneCharacter ?? selectedObject;
  const currentSceneIndex = project.scenes.findIndex((item) => item.id === scene.id);
  const savedCharacter = selection?.kind === "character" ? project.characters.find((item) => item.id === selectedSceneCharacter?.characterId) : null;
  const motionInstance = selectedSceneCharacter ?? scene.characters[0] ?? null;
  const motionCharacter = project.characters.find((item) => item.id === motionInstance?.characterId) ?? activeCharacter;

  return (
    <main className="studio-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><Sparkles size={19} fill="currentColor" /></div><div><strong>animagic</strong><small>STUDIO</small></div></div>
        <div className="project-title"><input aria-label="Project name" value={project.name} onChange={(event) => updateProject((current) => ({ ...current, name: event.target.value }))} /><span className="saved-state"><i />{status}</span></div>
        <div className="header-actions">
          <button className="text-button" onClick={() => { try { const file = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" }); triggerDownload(file, `${project.name || "animagic"}.animagic.json`); } catch (error) { console.error(error); setStatus("Could not download project"); } }}><ArrowDownToLine size={15} /> Save project</button>
          <button className="icon-button" title="Open project JSON" onClick={() => document.getElementById("project-import")?.click()}><FolderOpen size={17} /></button>
          <input id="project-import" type="file" accept=".json,.animagic.json,application/json" hidden onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            file.text().then((text) => {
              const parsed = JSON.parse(text) as Project;
              if (!parsed.scenes?.length || !parsed.characters) throw new Error("This file is not a valid Animagic project");
              setProject(parsed); setFrame(0); setSelection(null);
            }).catch((error) => { console.error("Project import failed.", error); setStatus("Project import failed — invalid file"); });
            event.target.value = "";
          }} />
          <button className="primary-button" onClick={() => setExportOpen(true)}><Download size={15} /> Export</button>
          <button className="avatar-button" aria-label="Account"><span>R</span></button>
        </div>
      </header>

      <div className="workspace">
        <aside className="left-rail">
          <div className="rail-label">CREATE</div>
          {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`rail-item ${panel === id ? "active" : ""}`} onClick={() => setPanel(id)}><Icon size={18} /><span>{label}</span></button>)}
          <div className="rail-separator" />
          <button className={`rail-item ${panel === "story" ? "active" : ""}`} onClick={() => setPanel("story")}><WandSparkles size={18} /><span>AI Story</span><i className="new-dot" /></button>
          <div className="rail-bottom"><button className="rail-item" title="Help"><CircleHelp size={18} /><span>Help</span></button><div className="user-avatar">RJ</div></div>
        </aside>

        <aside className="asset-panel">
          <div className="asset-panel-heading">
            <div><small>WORKSPACE</small><h2>{panel === "clothes" ? "Wardrobe" : panel === "objects" ? "Object library" : panel === "backgrounds" || panel === "scenes" ? "Scenes" : panel === "animations" ? "Motion library" : panel === "story" ? "Story builder" : "Characters"}</h2></div>
            <button className="icon-button subtle" onClick={() => panel === "scenes" || panel === "backgrounds" ? addScene() : addCharacter("custom")} title="Add new"><Plus size={17} /></button>
          </div>
          {panel === "characters" && <div className="asset-content">
            <button className="wide-create" onClick={() => addCharacter("custom")}><Plus size={15} /> Create a character</button>
            <PanelTitle title="Your cast" meta={`${project.characters.length} characters`} />
            <div className="character-list">
              {project.characters.map((character) => <button className={`character-card ${activeCharacter?.id === character.id ? "selected" : ""}`} key={character.id} onClick={() => { setSelectedCharacterId(character.id); setShowCharacterEditor(true); }}>
                <div className="tiny-character" dangerouslySetInnerHTML={{ __html: buildSceneSvg({ ...project, scenes: [{ ...scene, characters: scene.characters.filter((item) => item.characterId === character.id), objects: [] }] }, { ...scene, background: { kind: "transparent", preset: "sky", color: "#ffffff" }, characters: [createSceneCharacter(character.id, 800, 780)], objects: [] }, 0, { width: 120, height: 120 }) }} />
                <span><b>{character.config.name}</b><small>{CHARACTER_TYPES.find((item) => item.type === character.config.type)?.label}</small></span><MoreHorizontal size={15} />
              </button>)}
            </div>
            <PanelTitle title="Start with a role" meta="15 presets" />
            <div className="preset-grid">
              {CHARACTER_TYPES.map((item, index) => <button key={item.type} className="preset-tile" onClick={() => addCharacter(item.type)}><span className="preset-emoji" style={{ "--tile-color": `${item.color}24`, color: item.color } as CSSProperties}>{["🌱", "📚", "🪖", "🩺", "🚓", "🛠️", "💼", "🧑", "👩", "👦", "👧", "🧒", "👴", "👵", "✨"][index]}</span><span>{item.label}</span><Plus size={12} /></button>)}
            </div>
          </div>}
          {panel === "clothes" && <div className="asset-content wardrobe-content">
            {activeCharacter ? <>
              <PanelTitle title="Outfit" meta="Color-ready" />
              <div className="wardrobe-section"><OptionSelect label="Top" value={activeCharacter.config.upper} options={UPPER_CLOTHING} onChange={(value) => updateCharacter("upper", value as CharacterConfig["upper"])} /><ColorSwatches label="Top color" colors={CLOTHING_COLORS} value={activeCharacter.config.upperColor} onChange={(value) => updateCharacter("upperColor", value)} /></div>
              <div className="wardrobe-section"><OptionSelect label="Bottom" value={activeCharacter.config.lower} options={LOWER_CLOTHING} onChange={(value) => updateCharacter("lower", value as CharacterConfig["lower"])} /><ColorSwatches label="Bottom color" colors={CLOTHING_COLORS} value={activeCharacter.config.lowerColor} onChange={(value) => updateCharacter("lowerColor", value)} /></div>
              <div className="wardrobe-section"><OptionSelect label="Shoes" value={activeCharacter.config.shoes} options={SHOE_STYLES} onChange={(value) => updateCharacter("shoes", value as CharacterConfig["shoes"])} /><ColorSwatches label="Shoe color" colors={CLOTHING_COLORS} value={activeCharacter.config.shoeColor} onChange={(value) => updateCharacter("shoeColor", value)} /></div>
              <div className="section-rule" /><PanelTitle title="Accessories" meta="Tap to toggle" />
              <div className="accessory-grid">{ACCESSORIES.map((item) => <button key={item.value} onClick={() => { const selected = activeCharacter.config.accessories.includes(item.value); updateCharacter("accessories", selected ? activeCharacter.config.accessories.filter((value) => value !== item.value) : [...activeCharacter.config.accessories, item.value]); }} className={`accessory-pill ${activeCharacter.config.accessories.includes(item.value) ? "active" : ""}`}>{activeCharacter.config.accessories.includes(item.value) && <Check size={12} />}{item.label}</button>)}</div>
              <ColorSwatches label="Accessory color" colors={CLOTHING_COLORS} value={activeCharacter.config.accessoryColor} onChange={(value) => updateCharacter("accessoryColor", value)} />
            </> : <div className="empty-panel"><UserRound size={23} /><span>Create a character to style their outfit.</span></div>}
          </div>}
          {panel === "animations" && <div className="asset-content motion-content">
            {motionCharacter ? <>
              <div className="motion-preview" dangerouslySetInnerHTML={{ __html: buildCharacterPreviewSvg(motionCharacter, { animation: motionInstance?.animation ?? motionCharacter.config.animation, time: frame / Math.max(1, scene.fps), speed: motionInstance?.animationSpeed ?? motionCharacter.config.animationSpeed }) }} />
              <div className="motion-preview-caption"><span><span className="live-dot" /> LIVE PREVIEW</span><span>{motionInstance?.animationSpeed ?? 1}× speed</span></div>
              <PanelTitle title="Motion library" meta={`${ANIMATIONS.length} moves`} />
              {animationGroups.map((group) => <div className="motion-group" key={group}><div className="motion-group-title">{group}</div><div className="motion-list">{ANIMATIONS.filter((animation) => animation.group === group).map((animation) => <button key={animation.type} className={`motion-card ${motionInstance?.animation === animation.type ? "active" : ""}`} onClick={() => {
                const target = motionInstance ?? scene.characters.find((item) => item.characterId === motionCharacter.id);
                if (!target) { setStatus("Add this character to the scene to animate it"); return; }
                setSelection({ kind: "character", id: target.id });
                updateScene((current) => ({ ...current, characters: current.characters.map((item) => item.id === target.id ? { ...item, animation: animation.type, animationLayers: [{ type: animation.type, weight: 1, speed: item.animationSpeed }] } : item) }));
              }}><span className="motion-play"><Play size={11} fill="currentColor" /></span><span><b>{animation.label}</b><small>{animation.description}</small></span><Plus size={12} /></button>)}</div></div>)}
            </> : <div className="empty-panel"><Activity size={23} /><span>Create a character to explore motion presets.</span></div>}
          </div>}
          {panel === "objects" && <div className="asset-content">
            <div className="search-field"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search props..." /><kbd>⌘ K</kbd></div>
            <div className="category-pills"><button className={objectCategory === "all" ? "active" : ""} onClick={() => setObjectCategory("all")}>All</button>{["farm", "daily", "education", "military", "nature"].map((item) => <button key={item} className={objectCategory === item ? "active" : ""} onClick={() => setObjectCategory(item)}>{item}</button>)}</div>
            <PanelTitle title="Prop library" meta={`${matchingObjects.length} items`} />
            <div className="object-grid">{matchingObjects.map((item) => <button className="object-tile" key={item.type} onClick={() => addObject(item.type)}><span className="object-preview" dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${item.w} ${item.h}">${item.draw(item.defaultColor)}</svg>` }} /><span>{item.label}</span><Plus size={12} /></button>)}</div>
          </div>}
          {(panel === "backgrounds" || panel === "scenes") && <div className="asset-content">
            <div className="scene-stack">
              {project.scenes.map((item, index) => <button key={item.id} className={`scene-card ${item.id === scene.id ? "selected" : ""}`} onClick={() => { updateProject((current) => ({ ...current, activeSceneId: item.id })); setFrame(0); setSelection(null); }}>
                <span className={`scene-thumb scene-thumb-${item.background.preset}`}><span>{index === 0 ? "01" : String(index + 1).padStart(2, "0")}</span><i>{item.characters.length} cast · {item.objects.length} props</i></span>
                <span className="scene-card-info"><b>{item.name}</b><small>{item.durationFrames} frames · {item.fps} fps</small></span>
                {item.id === scene.id && <Check size={14} />}
              </button>)}
            </div>
            <div className="button-row"><button className="outline-button" onClick={addScene}><Plus size={14} /> New scene</button><button className="outline-button" onClick={duplicateScene}><Copy size={13} /> Duplicate</button></div>
            <div className="section-rule" /><PanelTitle title="Background" meta="Choose a look" />
            <div className="background-grid">{BACKGROUNDS.map((item) => <button key={item.id} className={`background-tile ${scene.background.preset === item.id && scene.background.kind === "preset" ? "selected" : ""}`} onClick={() => setBackground({ kind: "preset", preset: item.id, color: "#ffffff" })}><span className={`background-thumb scene-thumb-${item.id}`} /><span>{item.label}</span></button>)}</div>
            <div className="background-options">
              <button className={`background-mode ${scene.background.kind === "transparent" ? "active" : ""}`} onClick={() => setBackground({ kind: "transparent", preset: scene.background.preset, color: "#ffffff" })}><span className="checker-preview" />Transparent</button>
              <label className="background-mode upload-mode"><Upload size={15} />Upload image<input type="file" accept="image/*" onChange={uploadBackground} /></label>
            </div>
            {scene.background.kind === "image" && <small className="file-name">{scene.background.imageName}</small>}
            <ColorSwatches label="Solid color" colors={["#111827", "#f8fafc", "#e7b07c", "#94a3b8", "#a9d8ff"]} value={scene.background.color} onChange={(color) => setBackground({ kind: "solid", preset: scene.background.preset, color })} />
          </div>}
          {panel === "story" && <div className="asset-content story-panel">
            <div className="story-glow"><div className="story-spark"><Sparkles size={21} /></div><span>STORY MAGIC</span><h3>Turn your idea<br />into an animation.</h3><p>Describe a moment, and build a scene-by-scene storyboard to edit.</p></div>
            <label className="story-label">YOUR STORY IDEA</label>
            <textarea value={storyPrompt} onChange={(event) => { setStoryPrompt(event.target.value); setStoryReady(false); }} placeholder="A farmer is working in his field. A goat comes and eats the grass. The farmer runs after the goat." rows={6} />
            <div className="prompt-suggestion"><Lightbulb size={14} /><span>Try: “A teacher introduces a curious robot to the class.”</span></div>
            <button className="generate-button" disabled={!storyPrompt.trim()} onClick={generateStory}><Sparkles size={15} /> Generate storyboard</button>
            {storyReady && <div className="story-success"><Check size={15} /><span>Storyboard created. Open Scenes to review and edit each beat.</span></div>}
            <div className="ai-note"><span className="local-dot" />Runs locally in your browser. Generated scenes are editable.</div>
            <div className="story-example"><b>What gets created</b><span><Check size={13} />Characters matched to story roles</span><span><Check size={13} />Backgrounds & relevant props</span><span><Check size={13} />Movement keyframes from story beats</span></div>
          </div>}
        </aside>

        <section className="editor-area">
          <div className="editor-topline">
            <div className="breadcrumb"><span>MY PROJECTS</span><b>/</b><strong>{project.name}</strong><b>/</b><strong className="muted">{scene.name}</strong></div>
            <div className="editor-top-actions"><button className="text-button" onClick={() => setShowExportPreview((value) => !value)}><Eye size={14} /> {showExportPreview ? "Editor view" : "Preview"}</button><button className="icon-button" title="Duplicate scene" onClick={duplicateScene}><Copy size={15} /></button><button className="icon-button" title="More options"><MoreHorizontal size={17} /></button></div>
          </div>
          <div className="canvas-toolbar"><div className="canvas-mode"><span className="live-dot" />{showExportPreview ? "PREVIEW" : "CANVAS"}<span className="toolbar-divider" />{scene.name}</div>
            <div className="canvas-tools"><button className="active" title="Select / move"><Move size={15} /></button><button title="Hand tool"><Hand size={15} /></button><button title="Center stage" onClick={() => setZoom(100)}><Maximize2 size={14} /></button><span className="toolbar-divider" /><button onClick={() => setZoom((value) => Math.max(50, value - 10))}><Minus size={14} /></button><span className="zoom-value">{zoom}%</span><button onClick={() => setZoom((value) => Math.min(140, value + 10))}><Plus size={14} /></button></div>
          </div>
          <div className={`canvas-workspace ${showExportPreview ? "preview-mode" : ""}`}>
            <div className="stage-wrap" style={{ width: `${zoom}%` }}>
              <div className={`stage ${scene.background.kind === "transparent" ? "transparent-stage" : ""}`} ref={stageRef} onPointerDown={handleStagePointerDown} onPointerMove={handleStagePointerMove} onPointerUp={() => { dragRef.current = null; }} onPointerCancel={() => { dragRef.current = null; }}>
                <div className="stage-art" dangerouslySetInnerHTML={{ __html: sceneSvg }} />
                {!showExportPreview && selectedTransform && <div className="selection-guide" style={{ left: `${selectedTransform.x / 16}%`, top: `${selectedTransform.y / 9}%` }}><span className="selection-handle top-left" /><span className="selection-handle top-right" /><span className="selection-handle bottom-left" /><span className="selection-handle bottom-right" /><span className="selection-tag">{selection?.kind === "object" ? selectedObject?.label : savedCharacter?.config.name}</span></div>}
                <span className="safe-label">16:9 SAFE AREA</span>
              </div>
            </div>
            {!showExportPreview && <div className="canvas-bottomline"><span><span className="live-dot" /> {scene.characters.length} character{scene.characters.length === 1 ? "" : "s"} · {scene.objects.length} objects</span><span><ArrowLeftRight size={13} /> Drag selected item to move</span><span>{scene.fps} FPS · {Math.ceil(scene.durationFrames / scene.fps)}s</span></div>}
          </div>
          <div className="timeline">
            <div className="timeline-heading"><div><Clapperboard size={15} /><b>Timeline</b><span className="timeline-scene-name">{scene.name}</span></div><div className="timeline-actions"><button title="Add keyframe" onClick={addKeyframe}><Plus size={14} /> Keyframe</button><button title="Add track" onClick={addKeyframe}><Layers size={14} /> Track</button><button title="Timeline settings"><Settings2 size={15} /></button></div></div>
            <div className="transport"><div className="transport-buttons"><button title="Go to start" onClick={() => { setFrame(0); setPlaying(false); }}><RotateCcw size={14} /></button><button className="play-button" title={playing ? "Pause" : "Play"} onClick={() => setPlaying((value) => !value)}>{playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</button><button title="Stop" onClick={() => { setPlaying(false); setFrame(0); }}><Square size={12} fill="currentColor" /></button></div><span className="timecode">{String(Math.floor(frame / scene.fps)).padStart(2, "0")}:{String(Math.floor((frame % scene.fps) / scene.fps * 60)).padStart(2, "0")} <i>/</i> {String(Math.floor(scene.durationFrames / scene.fps)).padStart(2, "0")}:00</span><div className="timeline-scrubber"><input aria-label="Timeline frame" type="range" min={0} max={scene.durationFrames} value={frame} onChange={(event) => setFrame(Number(event.target.value))} /><div className="frame-ticks"><span>0s</span><span>{Math.floor(scene.durationFrames / 3 / scene.fps)}s</span><span>{Math.floor(scene.durationFrames * 2 / 3 / scene.fps)}s</span><span>{Math.ceil(scene.durationFrames / scene.fps)}s</span></div></div><button className="fps-select" onClick={() => updateScene((current) => ({ ...current, fps: current.fps === 30 ? 24 : current.fps === 24 ? 60 : 30 }))}>{scene.fps} FPS <ChevronDown size={12} /></button><button className="duration-chip" onClick={() => updateScene((current) => ({ ...current, durationFrames: current.durationFrames + current.fps, loopEnd: current.loopEnd + current.fps }))}><Plus size={12} /> 1s</button></div>
            <div className="track-list">
              {[...scene.characters.map((item) => ({ id: item.id, kind: "character" as const, label: project.characters.find((character) => character.id === item.characterId)?.config.name ?? "Character" })), ...scene.objects.map((item) => ({ id: item.id, kind: "object" as const, label: item.label ?? "Object" }))].slice(0, 5).map((item, index) => {
                const track = scene.tracks.find((candidate) => candidate.targetId === item.id && candidate.targetType === item.kind);
                return <div className={`track-row ${selection?.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => { setSelection({ kind: item.kind, id: item.id }); if (item.kind === "character") { const instance = scene.characters.find((candidate) => candidate.id === item.id); if (instance) setSelectedCharacterId(instance.characterId); } }}>
                  <span className="track-label"><i style={{ background: item.kind === "character" ? "#8c76ff" : "#3bd3b2" }} />{item.label}</span><div className="track-lane">{(track?.keyframes ?? []).map((key) => <button title={`Frame ${key.frame}`} key={key.id} style={{ left: `${key.frame / scene.durationFrames * 100}%` }} className="keyframe-diamond" onClick={(event) => { event.stopPropagation(); setFrame(key.frame); }} />)}<span className="playhead" style={{ left: `${frame / scene.durationFrames * 100}%` }} /></div>
                </div>;
              })}
              {scene.characters.length + scene.objects.length === 0 && <div className="timeline-empty"><span>Add a character or prop to start animating.</span></div>}
            </div>
          </div>
        </section>

        <aside className="properties-panel">
          <div className="properties-header"><div><small>INSPECTOR</small><h2>Properties</h2></div><button className="icon-button subtle"><MoreHorizontal size={16} /></button></div>
          {selection && selectedTransform ? <>
            <div className="selected-item-card"><span className={`selected-icon ${selection.kind}`}>{selection.kind === "character" ? <UserRound size={17} /> : <Layers size={16} />}</span><span><b>{selection.kind === "character" ? savedCharacter?.config.name : selectedObject?.label}</b><small>{selection.kind === "character" ? "Character instance" : "Scene object"}</small></span><button title="Delete selected item" onClick={() => {
              if (selection.kind === "character") updateScene((current) => ({ ...current, characters: current.characters.filter((item) => item.id !== selection.id), tracks: current.tracks.filter((track) => track.targetId !== selection.id) }));
              else updateScene((current) => ({ ...current, objects: current.objects.filter((item) => item.id !== selection.id), tracks: current.tracks.filter((track) => track.targetId !== selection.id) }));
              setSelection(null);
            }}><Trash2 size={14} /></button></div>
            <div className="inspector-section"><PanelTitle title="Transform" icon={<Move size={14} />} /><div className="xy-grid"><label><span>X</span><input type="number" value={Math.round(selectedTransform.x)} onChange={(event) => updateSelectedTransform("x", Number(event.target.value))} /></label><label><span>Y</span><input type="number" value={Math.round(selectedTransform.y)} onChange={(event) => updateSelectedTransform("y", Number(event.target.value))} /></label></div><RangeControl label="Scale" value={selectedTransform.scale} min={0.3} max={2.5} step={0.05} onChange={(value) => updateSelectedTransform("scale", value)} /><RangeControl label="Rotation" value={selectedTransform.rotation} min={-180} max={180} step={1} suffix="°" onChange={(value) => updateSelectedTransform("rotation", value)} /><RangeControl label="Opacity" value={selectedTransform.opacity} min={0} max={1} step={0.05} onChange={(value) => updateSelectedTransform("opacity", value)} /></div>
            {selection.kind === "character" && savedCharacter && <div className="inspector-section"><PanelTitle title="Animation" icon={<Activity size={14} />} /><OptionSelect label="Active motion" value={selectedSceneCharacter?.animation ?? "idle"} options={ANIMATIONS.map(({ type, label }) => ({ value: type, label }))} onChange={(value) => updateScene((current) => ({ ...current, characters: current.characters.map((item) => item.id === selection.id ? { ...item, animation: value as AnimationType, animationLayers: [{ type: value as AnimationType, weight: 1, speed: item.animationSpeed }] } : item) }))} /><RangeControl label="Speed" value={selectedSceneCharacter?.animationSpeed ?? 1} min={0.2} max={3} step={0.1} suffix="×" onChange={(value) => updateScene((current) => ({ ...current, characters: current.characters.map((item) => item.id === selection.id ? { ...item, animationSpeed: value } : item) }))} /><div className="layer-controls"><OptionSelect label="Add motion layer" value={layerAnimation} options={ANIMATIONS.map(({ type, label }) => ({ value: type, label }))} onChange={(value) => setLayerAnimation(value as AnimationType)} /><button className="outline-button" onClick={() => updateScene((current) => ({ ...current, characters: current.characters.map((item) => item.id === selection.id ? { ...item, animationLayers: [...item.animationLayers.filter((layer) => layer.type !== item.animation), { type: item.animation, weight: 0.65, speed: item.animationSpeed }, { type: layerAnimation, weight: 0.35, speed: item.animationSpeed }] } : item) }))}><Plus size={12} /> Layer</button></div><div className="animation-layer-note"><Layers size={13} />Blend two motions; set the base and overlay in the motion library.</div></div>}
            {selection.kind === "object" && selectedObject && <div className="inspector-section"><PanelTitle title="Appearance" icon={<Settings2 size={14} />} /><ColorSwatches label="Object color" colors={CLOTHING_COLORS} value={selectedObject.color} onChange={(color) => updateScene((current) => ({ ...current, objects: current.objects.map((item) => item.id === selection.id ? { ...item, color } : item) }))} /><button className="outline-button full-button" onClick={() => updateScene((current) => ({ ...current, objects: current.objects.map((item) => item.id === selection.id ? { ...item, flip: !item.flip } : item) }))}><ArrowLeftRight size={14} /> Flip object</button></div>}
            {selection.kind === "character" && <button className="outline-button full-button" onClick={duplicateCharacter}><Copy size={14} /> Duplicate character</button>}
          </> : <div className="empty-properties"><div className="empty-target"><Move size={18} /></div><b>Nothing selected</b><span>Select an item on the canvas or timeline to edit its properties.</span></div>}
          <div className="inspector-divider" />
          <div className="inspector-section appearance-editor">
            <button className="collapsible-title" onClick={() => setShowCharacterEditor((value) => !value)}><span><UserRound size={14} /> Character design</span><ChevronDown size={14} className={showCharacterEditor ? "" : "rotated"} /></button>
            {showCharacterEditor && activeCharacter && <>
              <label className="control-field"><span>Name</span><input className="text-input" value={activeCharacter.config.name} onChange={(event) => updateCharacter("name", event.target.value)} /></label>
              <OptionSelect label="Character type" value={activeCharacter.config.type} options={CHARACTER_TYPES.map(({ type, label }) => ({ value: type, label }))} onChange={(value) => updateCharacter("type", value as CharacterType)} />
              <div className="section-caption">FACE & EXPRESSION</div>
              <OptionSelect label="Face shape" value={activeCharacter.config.faceShape} options={FACE_SHAPES} onChange={(value) => updateCharacter("faceShape", value as CharacterConfig["faceShape"])} />
              <ColorSwatches label="Skin tone" colors={SKIN_TONES} value={activeCharacter.config.skinTone} onChange={(value) => updateCharacter("skinTone", value)} />
              <OptionSelect label="Eyes" value={activeCharacter.config.eyeStyle} options={EYE_STYLES} onChange={(value) => updateCharacter("eyeStyle", value as CharacterConfig["eyeStyle"])} />
              <ColorSwatches label="Eye color" colors={EYE_COLORS} value={activeCharacter.config.eyeColor} onChange={(value) => updateCharacter("eyeColor", value)} />
              <OptionSelect label="Eyebrows" value={activeCharacter.config.browStyle} options={BROW_OPTIONS} onChange={(value) => updateCharacter("browStyle", value as CharacterConfig["browStyle"])} />
              <OptionSelect label="Nose" value={activeCharacter.config.noseStyle} options={NOSE_STYLES} onChange={(value) => updateCharacter("noseStyle", value as CharacterConfig["noseStyle"])} />
              <OptionSelect label="Mouth" value={activeCharacter.config.mouthStyle} options={MOUTH_STYLES} onChange={(value) => updateCharacter("mouthStyle", value as CharacterConfig["mouthStyle"])} />
              <OptionSelect label="Expression" value={activeCharacter.config.expression} options={EXPRESSIONS} onChange={(value) => updateCharacter("expression", value as CharacterConfig["expression"])} />
              <OptionSelect label="Glasses" value={activeCharacter.config.glasses} options={GLASSES_STYLES} onChange={(value) => updateCharacter("glasses", value as CharacterConfig["glasses"])} />
              <RangeControl label="Ear size" value={activeCharacter.config.earSize} min={0.6} max={1.5} step={0.05} onChange={(value) => updateCharacter("earSize", value)} />
              <label className="toggle-row"><span><Eye size={14} /> Auto blink</span><input type="checkbox" checked={activeCharacter.config.autoBlink} onChange={(event) => updateCharacter("autoBlink", event.target.checked)} /></label>
              <div className="section-caption">HAIR & FACIAL HAIR</div>
              <OptionSelect label="Hair style" value={activeCharacter.config.hairStyle} options={HAIR_STYLES} onChange={(value) => updateCharacter("hairStyle", value as CharacterConfig["hairStyle"])} />
              <ColorSwatches label="Hair color" colors={HAIR_COLORS} value={activeCharacter.config.hairColor} onChange={(value) => updateCharacter("hairColor", value)} />
              <OptionSelect label="Beard style" value={activeCharacter.config.beardStyle} options={BEARD_STYLES} onChange={(value) => updateCharacter("beardStyle", value as CharacterConfig["beardStyle"])} />
              <ColorSwatches label="Beard color" colors={HAIR_COLORS} value={activeCharacter.config.beardColor} onChange={(value) => updateCharacter("beardColor", value)} />
              <div className="section-caption">BODY PROPORTIONS</div>
              <RangeControl label="Height" value={activeCharacter.config.height} min={0.65} max={1.35} step={0.05} onChange={(value) => updateCharacter("height", value)} />
              <RangeControl label="Body size" value={activeCharacter.config.bodySize} min={0.7} max={1.4} step={0.05} onChange={(value) => updateCharacter("bodySize", value)} />
              <RangeControl label="Head size" value={activeCharacter.config.headSize} min={0.7} max={1.4} step={0.05} onChange={(value) => updateCharacter("headSize", value)} />
              <RangeControl label="Arm length" value={activeCharacter.config.armLength} min={0.65} max={1.35} step={0.05} onChange={(value) => updateCharacter("armLength", value)} />
              <RangeControl label="Leg length" value={activeCharacter.config.legLength} min={0.65} max={1.35} step={0.05} onChange={(value) => updateCharacter("legLength", value)} />
            </>}
          </div>
          <div className="inspector-footer"><span><span className="local-dot" /> Autosaved locally</span><button onClick={() => { if (activeCharacter) updateProject((current) => ({ ...current, characters: current.characters.map((item) => item.id === activeCharacter.id ? createCharacter(item.config.type, item.config.name) : item) })); }}><RotateCcw size={12} /> Reset look</button></div>
        </aside>
      </div>

      {exportOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setExportOpen(false); }}><div className="export-modal">
        <div className="modal-heading"><div className="export-icon"><Video size={19} /></div><button className="icon-button" onClick={() => setExportOpen(false)}><X size={17} /></button><small>RENDER SETTINGS</small><h2>Export your animation</h2><p>Choose an output format and resolution for <b>{scene.name}</b>.</p></div>
        <div className="export-preview" dangerouslySetInnerHTML={{ __html: buildSceneSvg(project, scene, frame, { width: 560, height: 315 }) }} />
        <button className="preview-toggle" onClick={() => setShowExportPreview((value) => !value)}><Eye size={14} /> {showExportPreview ? "Preview enabled in editor" : "Preview current frame"}<span>{frame} / {scene.durationFrames}</span></button>
        <div className="export-options">
          <label><span>FORMAT</span><select value={exportOptions.format} onChange={(event) => setExportOptions((value) => ({ ...value, format: event.target.value as ExportFormat }))}>{[["webm", "WebM video"], ["mp4", "MP4 video (WebCodecs)"], ["gif", "GIF animation"], ["png", "PNG image"], ["sprite", "PNG sprite sheet"], ["sequence", "PNG frame sequence"]].map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label><span>RESOLUTION</span><select value={exportOptions.resolution} onChange={(event) => setExportOptions((value) => ({ ...value, resolution: event.target.value as ExportOptions["resolution"] }))}>{["720p", "1080p", "4K"].map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
          <label><span>FRAME RATE</span><select value={exportOptions.fps} onChange={(event) => setExportOptions((value) => ({ ...value, fps: Number(event.target.value) as ExportOptions["fps"] }))}>{[24, 30, 60].map((value) => <option value={value} key={value}>{value} FPS</option>)}</select></label>
        </div>
        <div className="export-options background-export">
          <label><span>BACKGROUND</span><select value={exportBackground} onChange={(event) => setExportBackground(event.target.value as typeof exportBackground)}><option value="scene">Use scene background</option><option value="transparent">Transparent</option><option value="solid">Solid color</option><option value="image" disabled={scene.background.kind !== "image"}>Custom image</option></select></label>
          {exportBackground === "solid" && <label><span>SOLID COLOR</span><input type="color" value={exportSolidColor} onChange={(event) => setExportSolidColor(event.target.value)} /></label>}
        </div>
        {exportOptions.format === "mp4" && exportBackground === "transparent" && <div className="export-note">H.264 MP4 does not carry alpha. Use transparent WebM or PNG for transparency.</div>}
        <div className="export-footnote"><span><Check size={13} /> Background & scene animation included</span><span><Film size={13} /> Up to 10 seconds per export</span></div>
        <div className="modal-actions"><button className="outline-button" onClick={() => setExportOpen(false)}>Cancel</button><button className="primary-button" onClick={exportVideo}><Download size={15} /> Render & download</button></div>
      </div></div>}
    </main>
  );
}

const BROW_OPTIONS = [
  { value: "normal", label: "Natural" }, { value: "arched", label: "Arched" }, { value: "thick", label: "Bold" },
  { value: "thin", label: "Thin" }, { value: "angry", label: "Angry" }, { value: "worried", label: "Worried" },
];

function awaitDemoProject(): Project {
  const farmer = createCharacter("farmer", "Milo");
  const scene = createScene("Farm Morning");
  scene.background = { kind: "preset", preset: "farm", color: "#ffffff" };
  scene.narration = "Milo is getting ready for a busy day on the farm.";
  const instance = createSceneCharacter(farmer.id, 720, 790);
  instance.scale = 1;
  scene.characters.push(instance);
  const props: [SceneObject["type"], number, number, number][] = [
    ["tree", 1370, 620, 1.3], ["fence", 280, 770, 1.15], ["sun", 270, 160, 0.9], ["hay", 1060, 790, 0.9], ["goat", 1080, 690, 0.72],
  ];
  scene.objects = props.map(([type, x, y, scale]) => ({ ...createObject(type, x, y), scale }));
  const track = createTrack(instance.id, "character");
  track.keyframes = [
    createKeyframe(0, { ...instance, animation: "idle" }),
    createKeyframe(50, { ...instance, x: 820, animation: "walk" }),
    createKeyframe(110, { ...instance, x: 980, animation: "wave" }),
    createKeyframe(150, { ...instance, x: 980, animation: "idle" }),
  ];
  scene.tracks.push(track);
  return { id: `project_${crypto.randomUUID().slice(0, 8)}`, name: "Farm Morning", characters: [farmer], scenes: [scene], activeSceneId: scene.id, createdAt: Date.now(), updatedAt: Date.now() };
}
