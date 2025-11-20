/**
 * Color space conversion utilities for theme-mixer
 * Supports conversions between OKLCH, HSL, RGB, and HEX formats
 */

/**
 * Convert OKLCH to linear RGB
 * Based on OK Lab color space conversions
 */
function oklchToLinearRgb(l: number, c: number, h: number): [number, number, number] {
    // Convert OKLCH to OKLAB
    const hRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);

    // OKLAB to linear RGB transformation matrix
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;

    const lr = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const lg = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const lb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    return [lr, lg, lb];
}

/**
 * Convert linear RGB to sRGB (gamma correction)
 */
function linearToSrgb(linear: number): number {
    if (linear <= 0.0031308) {
        return 12.92 * linear;
    }
    return 1.055 * Math.pow(linear, 1 / 2.4) - 0.055;
}

/**
 * Convert sRGB to linear RGB
 */
function srgbToLinear(srgb: number): number {
    if (srgb <= 0.04045) {
        return srgb / 12.92;
    }
    return Math.pow((srgb + 0.055) / 1.055, 2.4);
}

/**
 * Convert OKLCH to RGB (0-255 range)
 */
export function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
    const [lr, lg, lb] = oklchToLinearRgb(l, c, h);

    const r = Math.max(0, Math.min(1, linearToSrgb(lr)));
    const g = Math.max(0, Math.min(1, linearToSrgb(lg)));
    const b = Math.max(0, Math.min(1, linearToSrgb(lb)));

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}

/**
 * Convert RGB (0-255) to linear RGB
 */
function rgbToLinearRgb(r: number, g: number, b: number): [number, number, number] {
    return [
        srgbToLinear(r / 255),
        srgbToLinear(g / 255),
        srgbToLinear(b / 255)
    ];
}

/**
 * Convert linear RGB to OKLCH
 */
export function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
    const [lr, lg, lb] = rgbToLinearRgb(r, g, b);

    // Linear RGB to OKLAB
    const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

    const l = Math.cbrt(l_);
    const m = Math.cbrt(m_);
    const s = Math.cbrt(s_);

    const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    const b_ = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;

    // OKLAB to OKLCH
    const C = Math.sqrt(a * a + b_ * b_);
    let H = Math.atan2(b_, a) * 180 / Math.PI;
    if (H < 0) H += 360;

    return [L, C, H];
}

/**
 * Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (diff !== 0) {
        s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / diff + 2) / 6;
                break;
            case b:
                h = ((r - g) / diff + 4) / 6;
                break;
        }
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Convert OKLCH to HSL
 */
export function oklchToHsl(l: number, c: number, h: number): [number, number, number] {
    const [r, g, b] = oklchToRgb(l, c, h);
    return rgbToHsl(r, g, b);
}

/**
 * Convert HSL to OKLCH
 */
export function hslToOklch(h: number, s: number, l: number): [number, number, number] {
    const [r, g, b] = hslToRgb(h, s, l);
    return rgbToOklch(r, g, b);
}

/**
 * Convert OKLCH to HEX
 */
export function oklchToHex(l: number, c: number, h: number): string {
    const [r, g, b] = oklchToRgb(l, c, h);
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Convert HEX to RGB
 */
function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

/**
 * Convert HEX to OKLCH
 */
export function hexToOklch(hex: string): [number, number, number] {
    const [r, g, b] = hexToRgb(hex);
    return rgbToOklch(r, g, b);
}

/**
 * Format a color value string for CSS based on color space
 */
export function formatColorValue(
    l: number,
    c: number,
    h: number,
    format: 'oklch' | 'hsl' | 'rgb' | 'hex'
): string {
    switch (format) {
        case 'hsl': {
            const [hue, sat, light] = oklchToHsl(l, c, h);
            return `${hue} ${sat}% ${light}%`;
        }
        case 'rgb': {
            const [r, g, b] = oklchToRgb(l, c, h);
            return `${r} ${g} ${b}`;
        }
        case 'hex': {
            return oklchToHex(l, c, h);
        }
        case 'oklch':
        default:
            return `${l} ${c} ${h}`;
    }
}

/**
 * Get the CSS color function wrapper for a color space
 */
export function getColorFunction(format: 'oklch' | 'hsl' | 'rgb' | 'hex'): string {
    switch (format) {
        case 'hsl':
            return 'hsl';
        case 'rgb':
            return 'rgb';
        case 'hex':
            return '';
        case 'oklch':
        default:
            return 'oklch';
    }
}
