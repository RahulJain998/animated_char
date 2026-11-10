import { shade } from "./colors";
import type { Pose } from "./animations";
import type { CharacterConfig } from "./types";

const n = (value: number) => Math.round(value * 100) / 100;

function sanitizeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function rotatePoint(px: number, py: number, cx: number, cy: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  const dx = px - cx;
  const dy = py - cy;
  return {
    x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: cy + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
}

function longSleeve(config: CharacterConfig) {
  return !["tshirt", "farmer", "teacher"].includes(config.upper);
}

function faceMarkup(config: CharacterConfig, headCY: number, r: number) {
  const skin = config.skinTone;
  const stroke = shade(skin, -0.22);
  switch (config.faceShape) {
    case "round":
      return `<ellipse cx="0" cy="${n(headCY)}" rx="${n(r * 0.93)}" ry="${n(r * 0.94)}" fill="${skin}" stroke="${stroke}" stroke-width="1.2"/>`;
    case "square":
      return `<rect x="${n(-r * 0.78)}" y="${n(headCY - r * 0.9)}" width="${n(r * 1.56)}" height="${n(r * 1.82)}" rx="${n(r * 0.33)}" fill="${skin}" stroke="${stroke}" stroke-width="1.2"/>`;
    case "heart":
      return `<path d="M 0 ${n(headCY - r)} C ${n(-r * 0.95)} ${n(headCY - r)} ${n(-r * 0.98)} ${n(headCY + r * 0.25)} ${n(-r * 0.4)} ${n(headCY + r * 0.78)} Q 0 ${n(headCY + r * 1.15)} ${n(r * 0.4)} ${n(headCY + r * 0.78)} C ${n(r * 0.98)} ${n(headCY + r * 0.25)} ${n(r * 0.95)} ${n(headCY - r)} 0 ${n(headCY - r)} Z" fill="${skin}" stroke="${stroke}" stroke-width="1.2"/>`;
    case "long":
      return `<ellipse cx="0" cy="${n(headCY)}" rx="${n(r * 0.73)}" ry="${n(r * 1.1)}" fill="${skin}" stroke="${stroke}" stroke-width="1.2"/>`;
    default:
      return `<ellipse cx="0" cy="${n(headCY)}" rx="${n(r * 0.82)}" ry="${n(r * 1.02)}" fill="${skin}" stroke="${stroke}" stroke-width="1.2"/>`;
  }
}

function backHair(config: CharacterConfig, headCY: number, r: number, neckY: number) {
  const hair = config.hairColor;
  const dark = shade(hair, -0.18);
  switch (config.hairStyle) {
    case "long":
      return `<path d="M ${n(-r * 0.96)} ${n(headCY - r * 0.1)} C ${n(-r * 1.25)} ${n(headCY + r * 1.1)} ${n(-r * 1.02)} ${n(neckY + 55)} ${n(-r * 0.66)} ${n(neckY + 80)} L ${n(r * 0.66)} ${n(neckY + 80)} C ${n(r * 1.02)} ${n(neckY + 55)} ${n(r * 1.25)} ${n(headCY + r * 1.1)} ${n(r * 0.96)} ${n(headCY - r * 0.1)} Z" fill="${hair}" stroke="${dark}" stroke-width="1"/>`;
    case "straight":
      return `<path d="M ${n(-r * 0.94)} ${n(headCY)} L ${n(-r * 1.02)} ${n(neckY + 72)} L ${n(-r * 0.55)} ${n(neckY + 84)} L ${n(r * 0.55)} ${n(neckY + 84)} L ${n(r * 1.02)} ${n(neckY + 72)} L ${n(r * 0.94)} ${n(headCY)} Z" fill="${hair}" stroke="${dark}" stroke-width="1"/>`;
    case "ponytail":
      return `<g><ellipse cx="${n(-r * 0.96)}" cy="${n(headCY + r * 1.2)}" rx="${n(r * 0.38)}" ry="${n(r * 0.9)}" fill="${hair}" stroke="${dark}" stroke-width="1" transform="rotate(16 ${n(-r * 0.96)} ${n(headCY + r * 1.2)})"/><circle cx="${n(-r * 0.86)}" cy="${n(headCY + r * 0.55)}" r="${n(r * 0.16)}" fill="${config.accessoryColor}"/></g>`;
    case "bun":
      return `<circle cx="0" cy="${n(headCY - r * 1.22)}" r="${n(r * 0.4)}" fill="${hair}" stroke="${dark}" stroke-width="1"/>`;
    case "afro":
      return `<circle cx="0" cy="${n(headCY - r * 0.12)}" r="${n(r * 1.3)}" fill="${hair}" stroke="${dark}" stroke-width="1"/><circle cx="${n(-r * 0.9)}" cy="${n(headCY - r * 0.55)}" r="${n(r * 0.42)}" fill="${hair}"/><circle cx="${n(r * 0.9)}" cy="${n(headCY - r * 0.55)}" r="${n(r * 0.42)}" fill="${hair}"/>`;
    default:
      return "";
  }
}

function frontHair(config: CharacterConfig, headCY: number, r: number) {
  const hair = config.hairColor;
  const dark = shade(hair, -0.18);
  const light = shade(hair, 0.16);
  const cap = `<path d="M ${n(-r * 0.88)} ${n(headCY - r * 0.18)} Q ${n(-r * 0.92)} ${n(headCY - r * 0.98)} 0 ${n(headCY - r * 1.04)} Q ${n(r * 0.92)} ${n(headCY - r * 0.98)} ${n(r * 0.88)} ${n(headCY - r * 0.18)} Q ${n(r * 0.56)} ${n(headCY - r * 0.6)} 0 ${n(headCY - r * 0.58)} Q ${n(-r * 0.56)} ${n(headCY - r * 0.6)} ${n(-r * 0.88)} ${n(headCY - r * 0.18)} Z" fill="${hair}" stroke="${dark}" stroke-width="1"/>`;
  switch (config.hairStyle) {
    case "bald":
      return `<path d="M ${n(-r * 0.86)} ${n(headCY - r * 0.02)} Q ${n(-r * 0.98)} ${n(headCY + r * 0.15)} ${n(-r * 0.82)} ${n(headCY + r * 0.3)}" fill="none" stroke="${hair}" stroke-width="${n(r * 0.12)}" stroke-linecap="round"/><path d="M ${n(r * 0.86)} ${n(headCY - r * 0.02)} Q ${n(r * 0.98)} ${n(headCY + r * 0.15)} ${n(r * 0.82)} ${n(headCY + r * 0.3)}" fill="none" stroke="${hair}" stroke-width="${n(r * 0.12)}" stroke-linecap="round"/>`;
    case "curly": {
      const curls: string[] = [];
      for (let i = 0; i < 7; i += 1) {
        const angle = Math.PI + (i / 6) * Math.PI;
        curls.push(
          `<circle cx="${n(Math.cos(angle) * r * 0.72)}" cy="${n(headCY + Math.sin(angle) * r * 0.72 - r * 0.08)}" r="${n(r * 0.26)}" fill="${hair}"/>`,
        );
      }
      return `${cap}${curls.join("")}<circle cx="${n(-r * 0.2)}" cy="${n(headCY - r * 0.62)}" r="${n(r * 0.14)}" fill="${light}" opacity=".55"/>`;
    }
    case "straight": {
      const fringe = `<path d="M ${n(-r * 0.86)} ${n(headCY - r * 0.22)} L ${n(-r * 0.82)} ${n(headCY + r * 0.28)} L ${n(-r * 0.52)} ${n(headCY + r * 0.18)} L ${n(-r * 0.2)} ${n(headCY + r * 0.02)} L ${n(r * 0.06)} ${n(headCY + r * 0.18)} L ${n(r * 0.34)} ${n(headCY + r * 0.04)} L ${n(r * 0.6)} ${n(headCY + r * 0.22)} L ${n(r * 0.84)} ${n(headCY + r * 0.18)} L ${n(r * 0.86)} ${n(headCY - r * 0.22)} Q 0 ${n(headCY - r * 0.88)} ${n(-r * 0.86)} ${n(headCY - r * 0.22)} Z" fill="${hair}" stroke="${dark}" stroke-width="1"/>`;
      return fringe;
    }
    case "long":
      return `${cap}<path d="M ${n(-r * 0.86)} ${n(headCY - r * 0.1)} C ${n(-r * 1.02)} ${n(headCY + r * 0.62)} ${n(-r * 0.9)} ${n(headCY + r * 1.15)} ${n(-r * 0.62)} ${n(headCY + r * 1.35)} L ${n(-r * 0.44)} ${n(headCY + r * 0.42)} C ${n(-r * 0.64)} ${n(headCY + r * 0.1)} ${n(-r * 0.3)} ${n(headCY - r * 0.38)} ${n(-r * 0.08)} ${n(headCY - r * 0.55)} C ${n(-r * 0.3)} ${n(headCY - r * 0.72)} ${n(-r * 0.7)} ${n(headCY - r * 0.72)} ${n(-r * 0.86)} ${n(headCY - r * 0.1)} Z" fill="${hair}" stroke="${dark}" stroke-width="1"/><path d="M ${n(r * 0.86)} ${n(headCY - r * 0.1)} C ${n(r * 1.02)} ${n(headCY + r * 0.62)} ${n(r * 0.9)} ${n(headCY + r * 1.15)} ${n(r * 0.62)} ${n(headCY + r * 1.35)} L ${n(r * 0.44)} ${n(headCY + r * 0.42)} C ${n(r * 0.64)} ${n(headCY + r * 0.1)} ${n(r * 0.3)} ${n(headCY - r * 0.38)} ${n(r * 0.08)} ${n(headCY - r * 0.55)} C ${n(r * 0.3)} ${n(headCY - r * 0.72)} ${n(r * 0.7)} ${n(headCY - r * 0.72)} ${n(r * 0.86)} ${n(headCY - r * 0.1)} Z" fill="${hair}" stroke="${dark}" stroke-width="1"/>`;
    case "bun":
      return `${cap}<path d="M ${n(-r * 0.5)} ${n(headCY - r * 0.8)} Q 0 ${n(headCY - r * 1.02)} ${n(r * 0.5)} ${n(headCY - r * 0.8)}" fill="none" stroke="${light}" stroke-width="2" opacity=".5"/>`;
    case "ponytail":
      return `${cap}<path d="M ${n(-r * 0.7)} ${n(headCY - r * 0.66)} Q ${n(-r * 0.2)} ${n(headCY - r * 0.92)} ${n(r * 0.32)} ${n(headCY - r * 0.72)}" fill="none" stroke="${light}" stroke-width="3" opacity=".5"/>`;
    case "mohawk":
      return `<path d="M ${n(-r * 0.12)} ${n(headCY - r * 0.9)} Q ${n(-r * 0.06)} ${n(headCY - r * 1.5)} ${n(r * 0.1)} ${n(headCY - r * 1.42)} Q ${n(r * 0.2)} ${n(headCY - r * 0.86)} ${n(r * 0.16)} ${n(headCY - r * 0.76)} Z" fill="${hair}" stroke="${dark}" stroke-width="1"/><path d="M ${n(-r * 0.86)} ${n(headCY - r * 0.02)} Q ${n(-r * 0.98)} ${n(headCY + r * 0.15)} ${n(-r * 0.82)} ${n(headCY + r * 0.3)}" fill="none" stroke="${hair}" stroke-width="${n(r * 0.1)}" stroke-linecap="round"/><path d="M ${n(r * 0.86)} ${n(headCY - r * 0.02)} Q ${n(r * 0.98)} ${n(headCY + r * 0.15)} ${n(r * 0.82)} ${n(headCY + r * 0.3)}" fill="none" stroke="${hair}" stroke-width="${n(r * 0.1)}" stroke-linecap="round"/>`;
    case "afro":
      return `<circle cx="${n(-r * 0.3)}" cy="${n(headCY - r * 0.78)}" r="${n(r * 0.24)}" fill="${hair}"/><circle cx="${n(r * 0.05)}" cy="${n(headCY - r * 0.92)}" r="${n(r * 0.28)}" fill="${hair}"/><circle cx="${n(r * 0.4)}" cy="${n(headCY - r * 0.74)}" r="${n(r * 0.22)}" fill="${hair}"/>`;
    default:
      return `${cap}<path d="M ${n(-r * 0.58)} ${n(headCY - r * 0.66)} Q 0 ${n(headCY - r * 0.86)} ${n(r * 0.48)} ${n(headCY - r * 0.7)}" fill="none" stroke="${light}" stroke-width="3" opacity=".4" stroke-linecap="round"/>`;
  }
}

function eyeMarkup(
  config: CharacterConfig,
  cx: number,
  cy: number,
  r: number,
  pose: Pose,
) {
  const open = pose.eyeOpen;
  const style = config.eyeStyle;
  const rx = style === "wide" ? r * 0.16 : style === "round" ? r * 0.135 : r * 0.15;
  const ryBase =
    style === "sleepy" ? r * 0.07 : style === "almond" ? r * 0.092 : r * 0.12;
  const ry = ryBase * Math.max(0.05, open);
  if (open < 0.16) {
    return `<path d="M ${n(cx - rx)} ${n(cy)} Q ${n(cx)} ${n(cy + r * 0.055)} ${n(cx + rx)} ${n(cy)}" fill="none" stroke="${shade(config.skinTone, -0.45)}" stroke-width="2" stroke-linecap="round"/>`;
  }
  const iris = Math.min(rx * 0.62, ry * 0.82);
  return `<g>
    <ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="#fffaf5"/>
    <circle cx="${n(cx)}" cy="${n(cy + 0.4)}" r="${n(iris)}" fill="${config.eyeColor}"/>
    <circle cx="${n(cx)}" cy="${n(cy + 0.4)}" r="${n(iris * 0.52)}" fill="#1a1410"/>
    <circle cx="${n(cx - iris * 0.38)}" cy="${n(cy - iris * 0.3)}" r="${n(iris * 0.22)}" fill="#ffffff" opacity=".9"/>
    <path d="M ${n(cx - rx)} ${n(cy - ry * 0.6)} Q ${n(cx)} ${n(cy - ry * 1.1)} ${n(cx + rx)} ${n(cy - ry * 0.6)}" fill="none" stroke="${shade(config.skinTone, -0.4)}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>
  </g>`;
}

function browMarkup(config: CharacterConfig, cx: number, cy: number, side: -1 | 1) {
  const color = shade(config.hairColor, -0.05);
  const style = config.browStyle;
  const width = style === "thin" ? 2 : style === "thick" ? 5 : 3.3;
  const lift = style === "arched" ? 5 : style === "angry" ? -1 : 0;
  const inner = style === "angry" ? 4 : style === "worried" ? -4 : 0;
  const y1 = cy + (side === -1 ? inner : 0);
  const y2 = cy + (side === 1 ? inner : 0);
  return `<path d="M ${n(cx - 11)} ${n(y1)} Q ${n(cx)} ${n(cy - lift)} ${n(cx + 11)} ${n(y2)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
}

function noseMarkup(config: CharacterConfig, headCY: number, r: number) {
  const line = shade(config.skinTone, -0.28);
  const y = headCY + r * 0.3;
  switch (config.noseStyle) {
    case "straight":
      return `<path d="M 0 ${n(y - r * 0.16)} L 0 ${n(y + r * 0.06)} L ${n(r * 0.08)} ${n(y + r * 0.1)}" fill="none" stroke="${line}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    case "round":
      return `<ellipse cx="0" cy="${n(y + r * 0.06)}" rx="${n(r * 0.1)}" ry="${n(r * 0.07)}" fill="${shade(config.skinTone, -0.08)}" stroke="${line}" stroke-width="1"/>`;
    case "wide":
      return `<path d="M ${n(-r * 0.12)} ${n(y + r * 0.05)} Q 0 ${n(y + r * 0.12)} ${n(r * 0.12)} ${n(y + r * 0.05)}" fill="none" stroke="${line}" stroke-width="2" stroke-linecap="round"/>`;
    case "pointed":
      return `<path d="M 0 ${n(y - r * 0.12)} L ${n(r * 0.06)} ${n(y + r * 0.1)} L 0 ${n(y + r * 0.12)}" fill="none" stroke="${line}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    default:
      return `<path d="M ${n(-r * 0.055)} ${n(y + r * 0.05)} Q 0 ${n(y + r * 0.085)} ${n(r * 0.055)} ${n(y + r * 0.05)}" fill="none" stroke="${line}" stroke-width="1.8" stroke-linecap="round"/>`;
  }
}

function mouthMarkup(config: CharacterConfig, headCY: number, r: number, pose: Pose) {
  const y = headCY + r * 0.57;
  const width = r * 0.36;
  const baseCurve =
    config.mouthStyle === "grin"
      ? 7
      : config.mouthStyle === "smile"
        ? 4.5
        : config.mouthStyle === "sad"
          ? -4
          : config.mouthStyle === "angry"
            ? -3
            : 0;
  const smile = baseCurve + pose.smile * 5.5 + (config.expression === "happy" ? 1.5 : 0);
  const isOpen =
    pose.mouthOpen > 0.12 || config.mouthStyle === "open" || config.expression === "surprised";
  if (isOpen) {
    const openH = 3 + pose.mouthOpen * 13 + (config.expression === "surprised" ? 4 : 0);
    return `<g>
      <ellipse cx="0" cy="${n(y + openH * 0.2)}" rx="${n(width * 0.72)}" ry="${n(openH)}" fill="#5b1f24" stroke="#3b1114" stroke-width="1"/>
      <ellipse cx="0" cy="${n(y + openH * 0.9)}" rx="${n(width * 0.42)}" ry="${n(openH * 0.34)}" fill="#d46a70"/>
      ${smile > 1 ? `<path d="M ${n(-width * 0.55)} ${n(y - 2)} Q 0 ${n(y + 2)} ${n(width * 0.55)} ${n(y - 2)} L ${n(width * 0.52)} ${n(y + 1)} Q 0 ${n(y + 4)} ${n(-width * 0.52)} ${n(y + 1)} Z" fill="#fff"/>` : ""}
    </g>`;
  }
  const stroke = shade(config.skinTone, -0.55);
  const lip = config.mouthStyle === "grin" || smile > 4 ? "#c2565e" : stroke;
  return `<path d="M ${n(-width / 2)} ${n(y)} Q 0 ${n(y + smile)} ${n(width / 2)} ${n(y)}" fill="none" stroke="${lip}" stroke-width="2.4" stroke-linecap="round"/>`;
}

function beardMarkup(config: CharacterConfig, headCY: number, r: number) {
  if (config.beardStyle === "none") return "";
  const color = config.beardColor;
  const dark = shade(color, -0.2);
  switch (config.beardStyle) {
    case "stubble":
      return `<ellipse cx="0" cy="${n(headCY + r * 0.5)}" rx="${n(r * 0.58)}" ry="${n(r * 0.43)}" fill="${color}" opacity=".28"/><ellipse cx="0" cy="${n(headCY + r * 0.68)}" rx="${n(r * 0.34)}" ry="${n(r * 0.22)}" fill="${color}" opacity=".4"/>`;
    case "goatee":
      return `<path d="M ${n(-r * 0.2)} ${n(headCY + r * 0.56)} Q 0 ${n(headCY + r * 0.92)} ${n(r * 0.2)} ${n(headCY + r * 0.56)} Q 0 ${n(headCY + r * 0.7)} ${n(-r * 0.2)} ${n(headCY + r * 0.56)} Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
    case "full":
      return `<path d="M ${n(-r * 0.72)} ${n(headCY + r * 0.15)} C ${n(-r * 0.66)} ${n(headCY + r * 0.8)} ${n(-r * 0.3)} ${n(headCY + r * 1.02)} 0 ${n(headCY + r * 1.05)} C ${n(r * 0.3)} ${n(headCY + r * 1.02)} ${n(r * 0.66)} ${n(headCY + r * 0.8)} ${n(r * 0.72)} ${n(headCY + r * 0.15)} C ${n(r * 0.52)} ${n(headCY + r * 0.45)} ${n(-r * 0.52)} ${n(headCY + r * 0.45)} ${n(-r * 0.72)} ${n(headCY + r * 0.15)} Z" fill="${color}" stroke="${dark}" stroke-width="1"/><path d="M ${n(-r * 0.32)} ${n(headCY + r * 0.48)} Q 0 ${n(headCY + r * 0.56)} ${n(r * 0.32)} ${n(headCY + r * 0.48)} Q 0 ${n(headCY + r * 0.4)} ${n(-r * 0.32)} ${n(headCY + r * 0.48)} Z" fill="${dark}"/>`;
    case "mustache":
      return `<path d="M ${n(-r * 0.3)} ${n(headCY + r * 0.46)} Q ${n(-r * 0.1)} ${n(headCY + r * 0.38)} 0 ${n(headCY + r * 0.48)} Q ${n(r * 0.1)} ${n(headCY + r * 0.38)} ${n(r * 0.3)} ${n(headCY + r * 0.46)} Q 0 ${n(headCY + r * 0.55)} ${n(-r * 0.3)} ${n(headCY + r * 0.46)} Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
    case "handlebar":
      return `<path d="M ${n(-r * 0.38)} ${n(headCY + r * 0.46)} Q ${n(-r * 0.18)} ${n(headCY + r * 0.36)} 0 ${n(headCY + r * 0.48)} Q ${n(r * 0.18)} ${n(headCY + r * 0.36)} ${n(r * 0.38)} ${n(headCY + r * 0.46)} Q ${n(r * 0.5)} ${n(headCY + r * 0.4)} ${n(r * 0.46)} ${n(headCY + r * 0.32)} Q ${n(r * 0.24)} ${n(headCY + r * 0.32)} 0 ${n(headCY + r * 0.42)} Q ${n(-r * 0.24)} ${n(headCY + r * 0.32)} ${n(-r * 0.46)} ${n(headCY + r * 0.32)} Q ${n(-r * 0.5)} ${n(headCY + r * 0.4)} ${n(-r * 0.38)} ${n(headCY + r * 0.46)} Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
    case "chin":
      return `<path d="M ${n(-r * 0.7)} ${n(headCY + r * 0.18)} C ${n(-r * 0.62)} ${n(headCY + r * 0.72)} ${n(-r * 0.2)} ${n(headCY + r * 0.98)} 0 ${n(headCY + r * 0.98)} C ${n(r * 0.2)} ${n(headCY + r * 0.98)} ${n(r * 0.62)} ${n(headCY + r * 0.72)} ${n(r * 0.7)} ${n(headCY + r * 0.18)} L ${n(r * 0.58)} ${n(headCY + r * 0.32)} C ${n(r * 0.5)} ${n(headCY + r * 0.72)} ${n(r * 0.22)} ${n(headCY + r * 0.84)} 0 ${n(headCY + r * 0.84)} C ${n(-r * 0.22)} ${n(headCY + r * 0.84)} ${n(-r * 0.5)} ${n(headCY + r * 0.72)} ${n(-r * 0.58)} ${n(headCY + r * 0.32)} Z" fill="${color}" stroke="${dark}" stroke-width="1"/>`;
    default:
      return "";
  }
}

function glassesMarkup(config: CharacterConfig, headCY: number, r: number) {
  let style = config.glasses;
  if (config.accessories.includes("sunglasses")) style = "sunglasses";
  if (config.accessories.includes("glasses") && style === "none") style = "round";
  if (style === "none") return "";
  const frame = "#2b2b33";
  const eyeY = headCY + r * 0.02;
  const dx = r * 0.38;
  const lensW = r * 0.32;
  const lensH = r * 0.27;
  if (style === "sunglasses") {
    return `<g><rect x="${n(-dx - lensW / 2)}" y="${n(eyeY - lensH / 2)}" width="${n(lensW)}" height="${n(lensH)}" rx="${n(lensH * 0.3)}" fill="#141826" opacity=".92" stroke="${frame}" stroke-width="2.4"/><rect x="${n(dx - lensW / 2)}" y="${n(eyeY - lensH / 2)}" width="${n(lensW)}" height="${n(lensH)}" rx="${n(lensH * 0.3)}" fill="#141826" opacity=".92" stroke="${frame}" stroke-width="2.4"/><path d="M ${n(-dx + lensW / 2)} ${n(eyeY)} L ${n(dx - lensW / 2)} ${n(eyeY)}" stroke="${frame}" stroke-width="2.2"/><path d="M ${n(-dx - lensW / 2)} ${n(eyeY - 2)} L ${n(-r * 0.82)} ${n(eyeY - 2)}" stroke="${frame}" stroke-width="2"/><path d="M ${n(dx + lensW / 2)} ${n(eyeY - 2)} L ${n(r * 0.82)} ${n(eyeY - 2)}" stroke="${frame}" stroke-width="2"/><path d="M ${n(-dx - lensW * 0.3)} ${n(eyeY - lensH * 0.18)} L ${n(-dx)} ${n(eyeY - lensH * 0.35)}" stroke="#fff" stroke-width="1.5" opacity=".35"/></g>`;
  }
  if (style === "square") {
    return `<g><rect x="${n(-dx - lensW / 2)}" y="${n(eyeY - lensH / 2)}" width="${n(lensW)}" height="${n(lensH)}" rx="3" fill="#eaf4ff" opacity=".22" stroke="${frame}" stroke-width="2"/><rect x="${n(dx - lensW / 2)}" y="${n(eyeY - lensH / 2)}" width="${n(lensW)}" height="${n(lensH)}" rx="3" fill="#eaf4ff" opacity=".22" stroke="${frame}" stroke-width="2"/><path d="M ${n(-dx + lensW / 2)} ${n(eyeY)} L ${n(dx - lensW / 2)} ${n(eyeY)}" stroke="${frame}" stroke-width="2"/><path d="M ${n(-dx - lensW / 2)} ${n(eyeY - 2)} L ${n(-r * 0.82)} ${n(eyeY - 2)}" stroke="${frame}" stroke-width="1.8"/><path d="M ${n(dx + lensW / 2)} ${n(eyeY - 2)} L ${n(r * 0.82)} ${n(eyeY - 2)}" stroke="${frame}" stroke-width="1.8"/></g>`;
  }
  return `<g><circle cx="${n(-dx)}" cy="${n(eyeY)}" r="${n(lensW * 0.52)}" fill="#eaf4ff" opacity=".22" stroke="${frame}" stroke-width="2"/><circle cx="${n(dx)}" cy="${n(eyeY)}" r="${n(lensW * 0.52)}" fill="#eaf4ff" opacity=".22" stroke="${frame}" stroke-width="2"/><path d="M ${n(-dx + lensW * 0.52)} ${n(eyeY)} Q 0 ${n(eyeY - 3)} ${n(dx - lensW * 0.52)} ${n(eyeY)}" fill="none" stroke="${frame}" stroke-width="2"/><path d="M ${n(-dx - lensW * 0.52)} ${n(eyeY - 2)} L ${n(-r * 0.82)} ${n(eyeY - 2)}" stroke="${frame}" stroke-width="1.8"/><path d="M ${n(dx + lensW * 0.52)} ${n(eyeY - 2)} L ${n(r * 0.82)} ${n(eyeY - 2)}" stroke="${frame}" stroke-width="1.8"/></g>`;
}

function headAccessory(config: CharacterConfig, headCY: number, r: number) {
  const color = config.accessoryColor;
  const dark = shade(color, -0.25);
  const light = shade(color, 0.18);
  if (config.accessories.includes("helmet")) {
    return `<path d="M ${n(-r * 0.98)} ${n(headCY - r * 0.18)} C ${n(-r * 1.05)} ${n(headCY - r * 1.15)} ${n(r * 1.05)} ${n(headCY - r * 1.15)} ${n(r * 0.98)} ${n(headCY - r * 0.18)} Z" fill="${color}" stroke="${dark}" stroke-width="1.5"/><path d="M ${n(-r * 1.14)} ${n(headCY - r * 0.16)} Q 0 ${n(headCY - r * 0.34)} ${n(r * 1.14)} ${n(headCY - r * 0.16)} L ${n(r * 1.08)} ${n(headCY - r * 0.04)} L ${n(-r * 1.08)} ${n(headCY - r * 0.04)} Z" fill="${dark}"/><path d="M ${n(-r * 0.72)} ${n(headCY - r * 0.75)} Q 0 ${n(headCY - r * 1.0)} ${n(r * 0.72)} ${n(headCY - r * 0.75)}" fill="none" stroke="${light}" stroke-width="3" opacity=".5"/>`;
  }
  if (config.accessories.includes("cap")) {
    return `<path d="M ${n(-r * 0.9)} ${n(headCY - r * 0.35)} C ${n(-r * 0.9)} ${n(headCY - r * 1.15)} ${n(r * 0.9)} ${n(headCY - r * 1.15)} ${n(r * 0.9)} ${n(headCY - r * 0.35)} Z" fill="${color}" stroke="${dark}" stroke-width="1.3"/><path d="M ${n(r * 0.82)} ${n(headCY - r * 0.38)} Q ${n(r * 1.32)} ${n(headCY - r * 0.22)} ${n(r * 0.92)} ${n(headCY - r * 0.08)} L ${n(r * 0.2)} ${n(headCY - r * 0.2)} Z" fill="${dark}"/><circle cx="0" cy="${n(headCY - r * 1.08)}" r="${n(r * 0.1)}" fill="${light}"/><path d="M ${n(-r * 0.5)} ${n(headCY - r * 0.92)} Q 0 ${n(headCY - r * 1.1)} ${n(r * 0.5)} ${n(headCY - r * 0.92)}" fill="none" stroke="${light}" stroke-width="2" opacity=".5"/>`;
  }
  if (config.accessories.includes("hat")) {
    return `<ellipse cx="0" cy="${n(headCY - r * 0.2)}" rx="${n(r * 1.35)}" ry="${n(r * 0.18)}" fill="${color}" stroke="${dark}" stroke-width="1.3"/><path d="M ${n(-r * 0.72)} ${n(headCY - r * 0.26)} C ${n(-r * 0.66)} ${n(headCY - r * 1.08)} ${n(r * 0.66)} ${n(headCY - r * 1.08)} ${n(r * 0.72)} ${n(headCY - r * 0.26)} Z" fill="${color}" stroke="${dark}" stroke-width="1.3"/><path d="M ${n(-r * 0.67)} ${n(headCY - r * 0.46)} Q 0 ${n(headCY - r * 0.58)} ${n(r * 0.67)} ${n(headCY - r * 0.46)} L ${n(r * 0.69)} ${n(headCY - r * 0.3)} Q 0 ${n(headCY - r * 0.4)} ${n(-r * 0.69)} ${n(headCY - r * 0.3)} Z" fill="${dark}"/>`;
  }
  return "";
}

function upperDetails(config: CharacterConfig, torsoW: number, shoulderY: number, hipY: number) {
  const color = config.upperColor;
  const dark = shade(color, -0.25);
  const light = shade(color, 0.2);
  const midY = (shoulderY + hipY) / 2;
  switch (config.upper) {
    case "tshirt":
      return `<path d="M ${n(-torsoW * 0.22)} ${n(shoulderY + 34)} Q 0 ${n(shoulderY + 48)} ${n(torsoW * 0.22)} ${n(shoulderY + 34)}" fill="none" stroke="${dark}" stroke-width="2" opacity=".5"/><path d="M ${n(-torsoW * 0.22)} ${n(shoulderY + 14)} Q 0 ${n(shoulderY + 30)} ${n(torsoW * 0.22)} ${n(shoulderY + 14)}" fill="none" stroke="${light}" stroke-width="4" opacity=".3"/>`;
    case "shirt":
      return `<path d="M ${n(-torsoW * 0.18)} ${n(shoulderY + 2)} L 0 ${n(shoulderY + 30)} L ${n(torsoW * 0.18)} ${n(shoulderY + 2)} L ${n(torsoW * 0.3)} ${n(shoulderY + 12)} L ${n(torsoW * 0.08)} ${n(shoulderY + 38)} L ${n(-torsoW * 0.08)} ${n(shoulderY + 38)} L ${n(-torsoW * 0.3)} ${n(shoulderY + 12)} Z" fill="${light}" opacity=".7" stroke="${dark}" stroke-width="1"/><path d="M 0 ${n(shoulderY + 30)} L 0 ${n(hipY - 18)}" stroke="${dark}" stroke-width="1.6" opacity=".55"/>${[0.36, 0.48, 0.6, 0.72]
        .map(
          (t) =>
            `<circle cx="0" cy="${n(shoulderY + (hipY - shoulderY) * t)}" r="1.8" fill="${dark}" opacity=".8"/>`,
        )
        .join("")}`;
    case "jacket":
      return `<path d="M ${n(-torsoW * 0.2)} ${n(shoulderY + 2)} L 0 ${n(shoulderY + 40)} L ${n(torsoW * 0.2)} ${n(shoulderY + 2)} L ${n(torsoW * 0.36)} ${n(shoulderY + 14)} L ${n(torsoW * 0.14)} ${n(shoulderY + 55)} L ${n(torsoW * 0.14)} ${n(hipY - 6)} L ${n(-torsoW * 0.14)} ${n(hipY - 6)} L ${n(-torsoW * 0.14)} ${n(shoulderY + 55)} L ${n(-torsoW * 0.36)} ${n(shoulderY + 14)} Z" fill="${light}" opacity=".55"/><path d="M 0 ${n(shoulderY + 40)} L 0 ${n(hipY - 6)}" stroke="${dark}" stroke-width="2"/><path d="M ${n(-torsoW * 0.08)} ${n(midY - 22)} L ${n(-torsoW * 0.08)} ${n(midY + 22)}" stroke="${dark}" stroke-width="2.5" opacity=".6"/>`;
    case "sweater":
      return `<path d="M ${n(-torsoW * 0.24)} ${n(shoulderY + 4)} Q 0 ${n(shoulderY + 26)} ${n(torsoW * 0.24)} ${n(shoulderY + 4)}" fill="none" stroke="${dark}" stroke-width="4" opacity=".55"/><path d="M ${n(-torsoW * 0.3)} ${n(hipY - 14)} Q 0 ${n(hipY - 5)} ${n(torsoW * 0.3)} ${n(hipY - 14)}" fill="none" stroke="${dark}" stroke-width="4" opacity=".55"/><path d="M ${n(-torsoW * 0.2)} ${n(shoulderY + 32)} Q 0 ${n(shoulderY + 42)} ${n(torsoW * 0.2)} ${n(shoulderY + 32)}" fill="none" stroke="${light}" stroke-width="2" opacity=".35"/>`;
    case "uniform":
      return `<path d="M ${n(-torsoW * 0.22)} ${n(shoulderY + 4)} L 0 ${n(shoulderY + 26)} L ${n(torsoW * 0.22)} ${n(shoulderY + 4)}" fill="none" stroke="${dark}" stroke-width="2" opacity=".7"/><rect x="${n(-torsoW * 0.3)}" y="${n(midY - 18)}" width="${n(torsoW * 0.16)}" height="${n(torsoW * 0.12)}" rx="2" fill="${dark}" opacity=".55"/><rect x="${n(torsoW * 0.14)}" y="${n(midY - 18)}" width="${n(torsoW * 0.16)}" height="${n(torsoW * 0.12)}" rx="2" fill="${dark}" opacity=".55"/><path d="M ${n(-torsoW * 0.28)} ${n(hipY - 22)} L ${n(-torsoW * 0.24)} ${n(hipY - 22)} M ${n(torsoW * 0.24)} ${n(hipY - 22)} L ${n(torsoW * 0.28)} ${n(hipY - 22)}" stroke="${light}" stroke-width="4" opacity=".7"/>`;
    case "police":
      return `<path d="M ${n(-torsoW * 0.22)} ${n(shoulderY + 2)} L 0 ${n(shoulderY + 28)} L ${n(torsoW * 0.22)} ${n(shoulderY + 2)}" fill="none" stroke="${dark}" stroke-width="2.4"/><path d="M ${n(-torsoW * 0.3)} ${n(shoulderY + 18)} L ${n(-torsoW * 0.3)} ${n(shoulderY + 28)} M ${n(torsoW * 0.3)} ${n(shoulderY + 18)} L ${n(torsoW * 0.3)} ${n(shoulderY + 28)}" stroke="${light}" stroke-width="4"/><path d="M ${n(-torsoW * 0.2)} ${n(midY - 24)} L ${n(-torsoW * 0.2)} ${n(midY + 24)}" stroke="${dark}" stroke-width="2.4"/><circle cx="${n(torsoW * 0.22)}" cy="${n(midY - 20)}" r="${n(torsoW * 0.07)}" fill="${config.accessoryColor}" stroke="#ffd76a" stroke-width="2"/><path d="M ${n(-torsoW * 0.28)} ${n(hipY - 24)} Q 0 ${n(hipY - 16)} ${n(torsoW * 0.28)} ${n(hipY - 24)}" fill="none" stroke="${light}" stroke-width="5" opacity=".65"/>`;
    case "army":
      return `<path d="M ${n(-torsoW * 0.22)} ${n(shoulderY + 2)} L 0 ${n(shoulderY + 30)} L ${n(torsoW * 0.22)} ${n(shoulderY + 2)}" fill="none" stroke="${dark}" stroke-width="2.4"/><rect x="${n(-torsoW * 0.3)}" y="${n(midY - 14)}" width="${n(torsoW * 0.2)}" height="${n(torsoW * 0.17)}" rx="2" fill="${dark}" opacity=".55"/><rect x="${n(torsoW * 0.1)}" y="${n(midY - 14)}" width="${n(torsoW * 0.2)}" height="${n(torsoW * 0.17)}" rx="2" fill="${dark}" opacity=".55"/><circle cx="${n(-torsoW * 0.22)}" cy="${n(shoulderY + 24)}" r="${n(torsoW * 0.05)}" fill="${light}" opacity=".6"/><circle cx="${n(torsoW * 0.24)}" cy="${n(midY + 12)}" r="${n(torsoW * 0.04)}" fill="${light}" opacity=".5"/>`;
    case "farmer":
      return `<path d="M ${n(-torsoW * 0.24)} ${n(shoulderY + 2)} L ${n(-torsoW * 0.12)} ${n(shoulderY + 26)} L ${n(-torsoW * 0.22)} ${n(hipY - 18)}" fill="none" stroke="${config.accessoryColor}" stroke-width="5" stroke-linecap="round"/><path d="M ${n(torsoW * 0.24)} ${n(shoulderY + 2)} L ${n(torsoW * 0.12)} ${n(shoulderY + 26)} L ${n(torsoW * 0.22)} ${n(hipY - 18)}" fill="none" stroke="${config.accessoryColor}" stroke-width="5" stroke-linecap="round"/><rect x="${n(-torsoW * 0.22)}" y="${n(midY - 16)}" width="${n(torsoW * 0.18)}" height="${n(torsoW * 0.17)}" rx="2" fill="${dark}" opacity=".5"/><circle cx="${n(-torsoW * 0.13)}" cy="${n(midY - 8)}" r="2" fill="${light}"/><circle cx="${n(-torsoW * 0.13)}" cy="${n(midY + 1)}" r="2" fill="${light}"/>`;
    case "teacher":
      return `<path d="M ${n(-torsoW * 0.2)} ${n(shoulderY + 4)} L 0 ${n(shoulderY + 26)} L ${n(torsoW * 0.2)} ${n(shoulderY + 4)}" fill="none" stroke="${dark}" stroke-width="2.2"/><path d="M 0 ${n(shoulderY + 26)} L 0 ${n(hipY - 14)}" stroke="${dark}" stroke-width="1.6" opacity=".6"/>${[0.34, 0.48, 0.62]
        .map(
          (t) =>
            `<circle cx="0" cy="${n(shoulderY + (hipY - shoulderY) * t)}" r="2.4" fill="${light}" stroke="${dark}" stroke-width=".6"/>`,
        )
        .join("")}`;
    case "suit":
      return `<path d="M ${n(-torsoW * 0.21)} ${n(shoulderY + 2)} L 0 ${n(shoulderY + 38)} L ${n(torsoW * 0.21)} ${n(shoulderY + 2)} L ${n(torsoW * 0.34)} ${n(shoulderY + 18)} L ${n(torsoW * 0.1)} ${n(hipY - 6)} L ${n(-torsoW * 0.1)} ${n(hipY - 6)} L ${n(-torsoW * 0.34)} ${n(shoulderY + 18)} Z" fill="${shade(color, 0.12)}"/><path d="M ${n(-torsoW * 0.19)} ${n(shoulderY + 6)} L 0 ${n(shoulderY + 36)} L ${n(torsoW * 0.19)} ${n(shoulderY + 6)} L ${n(torsoW * 0.26)} ${n(shoulderY + 16)} L ${n(torsoW * 0.06)} ${n(shoulderY + 66)} L 0 ${n(shoulderY + 52)} L ${n(-torsoW * 0.06)} ${n(shoulderY + 66)} L ${n(-torsoW * 0.26)} ${n(shoulderY + 16)} Z" fill="#f8fafc"/><path d="M 0 ${n(shoulderY + 42)} L ${n(-torsoW * 0.06)} ${n(shoulderY + 55)} L 0 ${n(midY)} L ${n(torsoW * 0.06)} ${n(shoulderY + 55)} Z" fill="${shade(config.upperColor, -0.35)}"/><path d="M 0 ${n(shoulderY + 36)} L ${n(-torsoW * 0.05)} ${n(shoulderY + 46)} L 0 ${n(shoulderY + 54)} L ${n(torsoW * 0.05)} ${n(shoulderY + 46)} Z" fill="#b91c1c"/><circle cx="0" cy="${n(midY + 8)}" r="2" fill="${dark}"/><circle cx="0" cy="${n(midY + 22)}" r="2" fill="${dark}"/>`;
    case "labcoat":
      return `<path d="M ${n(-torsoW * 0.2)} ${n(shoulderY + 2)} L 0 ${n(shoulderY + 36)} L ${n(torsoW * 0.2)} ${n(shoulderY + 2)} L ${n(torsoW * 0.34)} ${n(shoulderY + 20)} L ${n(torsoW * 0.12)} ${n(hipY + 12)} L ${n(-torsoW * 0.12)} ${n(hipY + 12)} L ${n(-torsoW * 0.34)} ${n(shoulderY + 20)} Z" fill="${light}"/><path d="M ${n(-torsoW * 0.18)} ${n(shoulderY + 6)} L 0 ${n(shoulderY + 34)} L ${n(torsoW * 0.18)} ${n(shoulderY + 6)} L ${n(torsoW * 0.24)} ${n(shoulderY + 18)} L ${n(torsoW * 0.05)} ${n(shoulderY + 60)} L 0 ${n(shoulderY + 50)} L ${n(-torsoW * 0.05)} ${n(shoulderY + 60)} L ${n(-torsoW * 0.24)} ${n(shoulderY + 18)} Z" fill="#6fa8d8"/><path d="M ${n(-torsoW * 0.2)} ${n(shoulderY + 30)} C ${n(-torsoW * 0.5)} ${n(shoulderY + 60)} ${n(-torsoW * 0.3)} ${n(shoulderY + 112)} ${n(-torsoW * 0.02)} ${n(shoulderY + 120)}" fill="none" stroke="#334155" stroke-width="3"/><circle cx="${n(-torsoW * 0.02)}" cy="${n(shoulderY + 120)}" r="5" fill="#94a3b8" stroke="#334155" stroke-width="2"/><rect x="${n(torsoW * 0.1)}" y="${n(midY)}" width="${n(torsoW * 0.15)}" height="${n(torsoW * 0.14)}" rx="2" fill="none" stroke="${shade(light, -0.25)}" stroke-width="1.2"/>`;
    case "doctor":
      return `<path d="M ${n(-torsoW * 0.2)} ${n(shoulderY + 2)} L 0 ${n(shoulderY + 28)} L ${n(torsoW * 0.2)} ${n(shoulderY + 2)}" fill="none" stroke="${dark}" stroke-width="2.2"/><path d="M ${n(-torsoW * 0.16)} ${n(shoulderY + 36)} L ${n(-torsoW * 0.16)} ${n(hipY - 12)}" stroke="${dark}" stroke-width="1.4" opacity=".5"/><rect x="${n(torsoW * 0.1)}" y="${n(midY - 10)}" width="${n(torsoW * 0.18)}" height="${n(torsoW * 0.14)}" rx="2" fill="${shade(color, 0.35)}" opacity=".7"/>`;
    default:
      return "";
  }
}

function lowerMarkup(
  config: CharacterConfig,
  legX: number,
  hipY: number,
  legLen: number,
  legWidth: number,
  side: -1 | 1,
) {
  const lower = config.lowerColor;
  const dark = shade(lower, -0.25);
  const skin = config.skinTone;
  const shorts = config.lower === "shorts";
  const skirt = config.lower === "skirt";
  if (skirt) {
    return `<rect x="${n(legX - legWidth / 2)}" y="${n(hipY)}" width="${n(legWidth)}" height="${n(legLen - 8)}" rx="${n(legWidth * 0.42)}" fill="${skin}"/><path d="M ${n(legX - legWidth / 2)} ${n(hipY + legLen * 0.95)} L ${n(legX - legWidth * 0.36)} ${n(-4)} L ${n(legX + legWidth * 0.36)} ${n(-4)} L ${n(legX + legWidth / 2)} ${n(hipY + legLen * 0.95)} Z" fill="${shade(skin, -0.05)}"/>`;
  }
  return `<rect x="${n(legX - legWidth / 2)}" y="${n(hipY)}" width="${n(legWidth)}" height="${n(legLen - 8)}" rx="${n(legWidth * 0.34)}" fill="${lower}" stroke="${dark}" stroke-width=".8"/>${
    shorts
      ? `<rect x="${n(legX - legWidth / 2 + 1)}" y="${n(hipY + legLen * 0.48)}" width="${n(legWidth - 2)}" height="${n(legLen * 0.5)}" rx="${n(legWidth * 0.34)}" fill="${skin}"/>`
      : ""
  }<path d="M ${n(legX + (side === -1 ? legWidth * 0.18 : -legWidth * 0.18))} ${n(hipY + legLen * 0.12)} L ${n(legX + (side === -1 ? legWidth * 0.18 : -legWidth * 0.18))} ${n(hipY + legLen * 0.72)}" stroke="${dark}" stroke-width="1.2" opacity=".35"/>`;
}

function shoeMarkup(config: CharacterConfig, x: number, y: number) {
  const color = config.shoeColor;
  const dark = shade(color, -0.3);
  const light = shade(color, 0.3);
  if (config.shoes === "boots") {
    return `<g><path d="M ${n(x - 15)} ${n(y - 18)} L ${n(x + 14)} ${n(y - 18)} L ${n(x + 18)} ${n(y - 7)} Q ${n(x + 26)} ${n(y - 4)} ${n(x + 24)} ${n(y)} L ${n(x - 16)} ${n(y)} Q ${n(x - 18)} ${n(y - 8)} ${n(x - 15)} ${n(y - 18)} Z" fill="${color}" stroke="${dark}" stroke-width="1"/><path d="M ${n(x - 16)} ${n(y - 2)} L ${n(x + 24)} ${n(y - 2)}" stroke="${light}" stroke-width="2" opacity=".5"/></g>`;
  }
  if (config.shoes === "sandals") {
    return `<g><path d="M ${n(x - 14)} ${n(y - 3)} L ${n(x + 22)} ${n(y - 3)} Q ${n(x + 26)} ${n(y)} ${n(x + 22)} ${n(y + 2)} L ${n(x - 14)} ${n(y + 2)} Q ${n(x - 17)} ${n(y)} ${n(x - 14)} ${n(y - 3)} Z" fill="${shade(color, 0.4)}" stroke="${dark}" stroke-width="1"/><path d="M ${n(x - 8)} ${n(y - 4)} Q ${n(x + 2)} ${n(y - 13)} ${n(x + 12)} ${n(y - 4)}" fill="none" stroke="${color}" stroke-width="3"/></g>`;
  }
  if (config.shoes === "formal") {
    return `<g><path d="M ${n(x - 14)} ${n(y - 12)} L ${n(x + 12)} ${n(y - 12)} L ${n(x + 18)} ${n(y - 6)} Q ${n(x + 29)} ${n(y - 3)} ${n(x + 26)} ${n(y + 1)} L ${n(x - 16)} ${n(y + 1)} Q ${n(x - 18)} ${n(y - 5)} ${n(x - 14)} ${n(y - 12)} Z" fill="${color}" stroke="${dark}" stroke-width="1"/><path d="M ${n(x - 15)} ${n(y - 2)} L ${n(x + 26)} ${n(y - 2)}" stroke="${light}" stroke-width="1.5" opacity=".45"/></g>`;
  }
  return `<g><path d="M ${n(x - 14)} ${n(y - 13)} L ${n(x + 11)} ${n(y - 13)} Q ${n(x + 16)} ${n(y - 10)} ${n(x + 20)} ${n(y - 5)} Q ${n(x + 28)} ${n(y - 2)} ${n(x + 25)} ${n(y + 1)} L ${n(x - 16)} ${n(y + 1)} Q ${n(x - 18)} ${n(y - 6)} ${n(x - 14)} ${n(y - 13)} Z" fill="${color}" stroke="${dark}" stroke-width="1"/><path d="M ${n(x - 16)} ${n(y - 2)} Q ${n(x)} ${n(y + 2)} ${n(x + 25)} ${n(y + 1)}" stroke="#fff" stroke-width="3" opacity=".9"/><path d="M ${n(x - 2)} ${n(y - 11)} Q ${n(x + 2)} ${n(y - 6)} ${n(x - 1)} ${n(y - 3)}" stroke="${light}" stroke-width="1.4"/></g>`;
}

function heldItem(config: CharacterConfig, pose: Pose, hand: { x: number; y: number }) {
  if (pose.holding === 2) {
    return `<g transform="translate(${n(hand.x + 4)} ${n(hand.y - 6)}) rotate(-12)"><rect x="-5" y="-14" width="10" height="20" rx="3" fill="#5b8def" stroke="#2f4a6b" stroke-width="1.2"/><rect x="-3" y="-19" width="6" height="6" rx="1.5" fill="#e2e8f0"/><rect x="-5" y="-8" width="10" height="3" fill="#e2e8f0" opacity=".7"/></g>`;
  }
  if (pose.holding === 1) {
    return `<g transform="translate(${n(hand.x + 3)} ${n(hand.y - 5)})"><circle cx="0" cy="0" r="7" fill="#e53e3e" stroke="#991b1b" stroke-width="1.2"/><path d="M 0 -7 Q 2 -11 5 -10" fill="none" stroke="#3f6212" stroke-width="2" stroke-linecap="round"/></g>`;
  }
  if (config.upper === "farmer" && !config.accessories.includes("cane")) {
    return "";
  }
  return "";
}

export function buildCharacterSvg(config: CharacterConfig, pose: Pose, idPrefix = "char"): string {
  const safe = sanitizeId(idPrefix) || "char";
  const h = config.height;
  const legLen = 152 * config.legLength * h;
  const torsoH = 146 * h * (0.94 + config.bodySize * 0.06);
  const torsoW = 112 * Math.pow(config.bodySize, 0.85);
  const hipY = -legLen - 4;
  const shoulderY = hipY - torsoH;
  const neckY = shoulderY - 8;
  const r = 61 * config.headSize;
  const headCY = neckY - r * 1.02;
  const legSpread = torsoW * 0.23;
  const legWidth = 27 * Math.pow(config.bodySize, 0.35);
  const armLen = 118 * config.armLength * (0.88 + h * 0.12);
  const shoulderX = torsoW / 2 + 5;
  const armY = shoulderY + 28;
  const skin = config.skinTone;
  const skinShade = shade(skin, -0.16);
  const sleeveLong = longSleeve(config);
  const sleeveLen = sleeveLong ? armLen - 4 : 36;
  const glove = config.accessories.includes("gloves");
  const handColor = glove ? config.accessoryColor : skin;
  const rightHandStart = { x: shoulderX, y: armY + armLen };
  const leftHandStart = { x: -shoulderX, y: armY + armLen };
  const rightHand = rotatePoint(rightHandStart.x, rightHandStart.y, shoulderX, armY, pose.rightArm);
  const leftHand = rotatePoint(leftHandStart.x, leftHandStart.y, -shoulderX, armY, pose.leftArm);
  const eyebrowColor = config.hairColor;
  const wrinkle =
    config.type === "oldman" || config.type === "oldwoman";
  const skirt = config.lower === "skirt";

  const legs = [-1, 1]
    .map((side) => {
      const s = side as -1 | 1;
      const legX = s * legSpread;
      const angle = s === -1 ? pose.leftLeg : pose.rightLeg;
      return `<g transform="rotate(${n(angle)} ${n(legX)} ${n(hipY)})">${lowerMarkup(config, legX, hipY, legLen, legWidth, s)}${shoeMarkup(config, legX + 2, -1)}</g>`;
    })
    .join("");

  const arms = [-1, 1]
    .map((side) => {
      const s = side as -1 | 1;
      const sx = s * shoulderX;
      const angle = s === -1 ? pose.leftArm : pose.rightArm;
      const hand = s === -1 ? leftHand : rightHand;
      return `<g transform="rotate(${n(angle)} ${n(sx)} ${n(armY)})">
        <rect x="${n(sx - 10.5)}" y="${n(armY - 4)}" width="21" height="${n(armLen + 8)}" rx="10.5" fill="${skin}" stroke="${skinShade}" stroke-width=".7"/>
        <rect x="${n(sx - 11.5)}" y="${n(armY - 4)}" width="23" height="${n(sleeveLen)}" rx="11.5" fill="${config.upperColor}" stroke="${shade(config.upperColor, -0.22)}" stroke-width=".8"/>
        ${sleeveLong ? `<path d="M ${n(sx - 11)} ${n(armY + sleeveLen - 7)} L ${n(sx + 11)} ${n(armY + sleeveLen - 7)}" stroke="${shade(config.upperColor, -0.24)}" stroke-width="1.2" opacity=".5"/>` : `<rect x="${n(sx - 11.5)}" y="${n(armY + sleeveLen - 7)}" width="23" height="4" rx="2" fill="${shade(config.upperColor, -0.22)}" opacity=".6"/>`}
        <circle cx="${n(sx)}" cy="${n(armY + armLen)}" r="10.5" fill="${handColor}" stroke="${shade(handColor, -0.22)}" stroke-width=".8"/>
        ${config.accessories.includes("watch") && s === -1 ? `<rect x="${n(sx - 10.5)}" y="${n(armY + armLen - 15)}" width="21" height="6" rx="2" fill="${config.accessoryColor}" stroke="${shade(config.accessoryColor, -0.3)}" stroke-width=".8"/>` : ""}
      </g>`;
    })
    .join("");

  const torsoPath = `M ${n(-torsoW / 2)} ${n(shoulderY + 16)} Q ${n(-torsoW / 2)} ${n(shoulderY + 2)} ${n(-torsoW / 2 + 14)} ${n(shoulderY - 2)} L ${n(torsoW / 2 - 14)} ${n(shoulderY - 2)} Q ${n(torsoW / 2)} ${n(shoulderY + 2)} ${n(torsoW / 2)} ${n(shoulderY + 16)} L ${n(torsoW * 0.38)} ${n(hipY + 2)} Q 0 ${n(hipY + 12)} ${n(-torsoW * 0.38)} ${n(hipY + 2)} Z`;

  const eyeY = headCY + r * 0.02;
  const eyeDX = r * 0.38;

  const head = `<g transform="rotate(${n(pose.headRot)} 0 ${n(neckY)})">
    <rect x="${n(-13)}" y="${n(neckY - 14)}" width="26" height="${n(r * 0.62)}" rx="9" fill="${skin}" stroke="${skinShade}" stroke-width=".6"/>
    ${backHair(config, headCY, r, neckY)}
    <circle cx="${n(-r * 0.82)}" cy="${n(headCY + r * 0.12)}" r="${n(9 * config.earSize)}" fill="${skin}" stroke="${skinShade}" stroke-width=".7"/>
    <circle cx="${n(r * 0.82)}" cy="${n(headCY + r * 0.12)}" r="${n(9 * config.earSize)}" fill="${skin}" stroke="${skinShade}" stroke-width=".7"/>
    ${faceMarkup(config, headCY, r)}
    <ellipse cx="${n(-r * 0.5)}" cy="${n(headCY + r * 0.18)}" rx="${n(r * 0.22)}" ry="${n(r * 0.34)}" fill="${shade(skin, -0.06)}" opacity=".28"/>
    ${eyeMarkup(config, -eyeDX, eyeY, r, pose)}
    ${eyeMarkup(config, eyeDX, eyeY, r, pose)}
    ${browMarkup(config, -eyeDX, eyeY - r * 0.28, -1)}
    ${browMarkup(config, eyeDX, eyeY - r * 0.28, 1)}
    ${noseMarkup(config, headCY, r)}
    ${mouthMarkup(config, headCY, r, pose)}
    ${beardMarkup(config, headCY, r)}
    ${wrinkle ? `<path d="M ${n(-r * 0.28)} ${n(headCY + r * 0.32)} Q ${n(-r * 0.22)} ${n(headCY + r * 0.37)} ${n(-r * 0.16)} ${n(headCY + r * 0.32)} M ${n(r * 0.16)} ${n(headCY + r * 0.32)} Q ${n(r * 0.22)} ${n(headCY + r * 0.37)} ${n(r * 0.28)} ${n(headCY + r * 0.32)}" fill="none" stroke="${shade(skin, -0.3)}" stroke-width="1" opacity=".55"/><path d="M ${n(-r * 0.4)} ${n(headCY - r * 0.14)} Q ${n(-r * 0.48)} ${n(headCY - r * 0.07)} ${n(-r * 0.4)} ${n(headCY)} M ${n(r * 0.4)} ${n(headCY - r * 0.14)} Q ${n(r * 0.48)} ${n(headCY - r * 0.07)} ${n(r * 0.4)} ${n(headCY)}" fill="none" stroke="${shade(skin, -0.3)}" stroke-width="1" opacity=".4"/>` : ""}
    ${pose.cry > 0.5 ? `<g opacity="${n(pose.cry * 0.9)}"><path d="M ${n(-eyeDX)} ${n(eyeY + r * 0.12)} Q ${n(-eyeDX - 4)} ${n(eyeY + r * 0.38)} ${n(-eyeDX)} ${n(eyeY + r * 0.48)} Q ${n(-eyeDX + 4)} ${n(eyeY + r * 0.38)} ${n(-eyeDX)} ${n(eyeY + r * 0.12)} Z" fill="#6ec8ff"/><path d="M ${n(eyeDX)} ${n(eyeY + r * 0.12)} Q ${n(eyeDX - 4)} ${n(eyeY + r * 0.38)} ${n(eyeDX)} ${n(eyeY + r * 0.48)} Q ${n(eyeDX + 4)} ${n(eyeY + r * 0.38)} ${n(eyeDX)} ${n(eyeY + r * 0.12)} Z" fill="#6ec8ff"/></g>` : ""}
    ${glassesMarkup(config, headCY, r)}
    ${frontHair(config, headCY, r)}
    ${headAccessory(config, headCY, r)}
    ${pose.zzz > 0.5 ? `<g opacity="${n(0.95 * pose.zzz)}"><text x="${n(r * 0.95)}" y="${n(headCY - r * 0.85)}" font-family="sans-serif" font-size="${n(r * 0.42)}" font-weight="700" fill="#c4b5fd">Z</text><text x="${n(r * 1.18)}" y="${n(headCY - r * 1.14)}" font-family="sans-serif" font-size="${n(r * 0.3)}" font-weight="700" fill="#a78bfa">z</text><text x="${n(r * 1.34)}" y="${n(headCY - r * 1.36)}" font-family="sans-serif" font-size="${n(r * 0.22)}" font-weight="700" fill="#8b5cf6">z</text></g>` : ""}
  </g>`;

  const belt =
    config.accessories.includes("belt") || !["jeans", "pants", "trousers"].includes(config.lower)
      ? `<rect x="${n(-torsoW * 0.4)}" y="${n(hipY - 14)}" width="${n(torsoW * 0.8)}" height="9" rx="3" fill="${config.accessoryColor}" stroke="${shade(config.accessoryColor, -0.3)}" stroke-width=".8"/>${config.accessories.includes("belt") ? `<rect x="${n(-7)}" y="${n(hipY - 15)}" width="14" height="11" rx="2" fill="${shade(config.accessoryColor, 0.25)}" stroke="${shade(config.accessoryColor, -0.3)}" stroke-width=".8"/>` : ""}`
      : "";

  const bag = config.accessories.includes("bag")
    ? `<path d="M ${n(-torsoW * 0.26)} ${n(shoulderY + 8)} L ${n(torsoW * 0.28)} ${n(hipY - 24)}" stroke="${shade(config.accessoryColor, -0.18)}" stroke-width="7" stroke-linecap="round" opacity=".9"/><rect x="${n(torsoW * 0.17)}" y="${n(hipY - 30)}" width="${n(torsoW * 0.36)}" height="${n(torsoW * 0.34)}" rx="6" fill="${config.accessoryColor}" stroke="${shade(config.accessoryColor, -0.3)}" stroke-width="1.2"/><path d="M ${n(torsoW * 0.17)} ${n(hipY - 17)} L ${n(torsoW * 0.53)} ${n(hipY - 17)}" stroke="${shade(config.accessoryColor, -0.25)}" stroke-width="1.5"/>`
    : "";

  const cane = config.accessories.includes("cane")
    ? `<g><path d="M ${n(torsoW * 0.62)} ${n(shoulderY + 94)} C ${n(torsoW * 0.8)} ${n(shoulderY + 74)} ${n(torsoW * 0.9)} ${n(shoulderY + 84)} ${n(torsoW * 0.75)} ${n(shoulderY + 106)} L ${n(torsoW * 0.6)} ${n(-4)}" fill="none" stroke="${shade(config.accessoryColor, -0.15)}" stroke-width="5" stroke-linecap="round"/><path d="M ${n(torsoW * 0.62)} ${n(shoulderY + 94)} C ${n(torsoW * 0.78)} ${n(shoulderY + 74)} ${n(torsoW * 0.88)} ${n(shoulderY + 84)} ${n(torsoW * 0.73)} ${n(shoulderY + 104)}" fill="none" stroke="${shade(config.accessoryColor, 0.25)}" stroke-width="2" stroke-linecap="round" opacity=".5"/></g>`
    : "";

  const skirtOverlay = skirt
    ? `<path d="M ${n(-torsoW * 0.4)} ${n(hipY - 8)} L ${n(torsoW * 0.4)} ${n(hipY - 8)} L ${n(torsoW * 0.58)} ${n(hipY + legLen * 0.48)} Q 0 ${n(hipY + legLen * 0.56)} ${n(-torsoW * 0.58)} ${n(hipY + legLen * 0.48)} Z" fill="${config.lowerColor}" stroke="${shade(config.lowerColor, -0.25)}" stroke-width="1"/><path d="M ${n(-torsoW * 0.12)} ${n(hipY + 2)} L ${n(-torsoW * 0.2)} ${n(hipY + legLen * 0.47)} M ${n(torsoW * 0.12)} ${n(hipY + 2)} L ${n(torsoW * 0.2)} ${n(hipY + legLen * 0.47)}" stroke="${shade(config.lowerColor, -0.2)}" stroke-width="1" opacity=".5"/>`
    : "";

  const held = heldItem(config, pose, rightHand);

  return `<g>
    <ellipse cx="0" cy="0" rx="${n(legSpread + 26)}" ry="7" fill="#000" opacity=".16"/>
    <g transform="translate(${n(pose.offsetX)} ${n(pose.lift)})">
      ${legs}
      <g transform="translate(0 ${n(pose.bodyBob)}) rotate(${n(pose.bodyRot)} 0 ${n(hipY)})">
        ${arms}
        <path d="${torsoPath}" fill="${config.upperColor}" stroke="${shade(config.upperColor, -0.25)}" stroke-width="1.2"/>
        ${upperDetails(config, torsoW, shoulderY, hipY)}
        ${skirtOverlay}
        ${belt}
        ${bag}
        ${head}
      </g>
      ${cane}
      ${held}
    </g>
    ${pose.cry > 0.5 ? "" : ""}
  </g>`;
}

export function characterBounds(config: CharacterConfig) {
  const h = config.height;
  const legLen = 152 * config.legLength * h;
  const torsoH = 146 * h * (0.94 + config.bodySize * 0.06);
  const r = 61 * config.headSize;
  const totalH = legLen + torsoH + r * 2.5;
  const width = Math.max(140, 132 * config.bodySize, r * 2.3);
  return { width, height: totalH };
}
