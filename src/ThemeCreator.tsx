import { useState, useEffect, useMemo, useCallback } from 'react';
import { Moon, Sun, Copy, Check, Palette } from 'lucide-react';

// --- Helper Components ---
interface DemoButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'outline';
}

const DemoButton = ({ children, variant = 'primary' }: DemoButtonProps) => {
  const styles = {
    primary: {
      backgroundColor: 'oklch(var(--primary))',
      color: 'oklch(var(--primary-foreground))',
    },
    secondary: {
      backgroundColor: 'oklch(var(--secondary))',
      color: 'oklch(var(--secondary-foreground))',
    },
    accent: {
      backgroundColor: 'oklch(var(--accent))',
      color: 'oklch(var(--accent-foreground))',
    },
    destructive: {
        backgroundColor: 'oklch(var(--destructive))',
        color: 'oklch(var(--destructive-foreground))',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'oklch(var(--foreground))',
      borderColor: 'oklch(var(--border))',
    },
  };
  return (
    <button
      className={`px-4 py-2 font-medium transition-all duration-200 hover:opacity-80 focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${variant === 'outline' ? 'border' : ''}`}
      style={{ ...styles[variant], ringColor: 'oklch(var(--ring))', borderRadius: 'var(--radius)', fontFamily: 'var(--font-heading)' }}
    >
      {children}
    </button>
  );
};

interface ColorPalettePreviewProps {
  colors: Array<{
    name: string;
    bgVar: string;
    textVar: string;
  }>;
}

const ColorPalettePreview = ({ colors }: ColorPalettePreviewProps) => (
    <div className="p-6 rounded-lg border" style={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--card-foreground))', fontFamily: 'var(--font-heading)' }}>
            Full Color Palette
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {colors.map(({ name, bgVar, textVar }) => (
                <div
                    key={name}
                    className="h-24 flex flex-col justify-end p-2 rounded-md text-xs border"
                    style={{
                        backgroundColor: `oklch(var(${bgVar}))`,
                        color: `oklch(var(${textVar}))`,
                        borderColor: 'oklch(var(--border) / 0.5)',
                    }}
                >
                    <span className="font-semibold capitalize">{name}</span>
                    <span className="opacity-70">{bgVar}</span>
                </div>
            ))}
        </div>
    </div>
);

interface GradientPreviewProps {
  name: string;
  variable: string;
}

const GradientPreview = ({ name, variable }: GradientPreviewProps) => (
    <div>
        <div
            className="w-full h-20 rounded-md border"
            style={{
                background: `var(${variable})`,
                borderColor: 'oklch(var(--border) / 0.5)',
            }}
        />
        <p className="text-xs mt-2 text-center" style={{ color: 'oklch(var(--muted-foreground))' }}>
            {name}
        </p>
    </div>
);

const ThemeShowcase = () => (
    <div 
        className="p-4 rounded-lg border space-y-4" 
        style={{ 
            background: 'var(--neutral-gradient)', 
            borderColor: 'oklch(var(--border))',
            borderRadius: 'var(--radius)'
        }}
    >
        <p 
            className="text-sm font-semibold"
            style={{ color: 'oklch(var(--foreground))', fontFamily: 'var(--font-heading)' }}
        >
            Theme Showcase
        </p>

        <div 
            className="p-4 rounded-md space-y-4 border" 
            style={{ 
                backgroundColor: 'oklch(var(--surface))', 
                borderColor: 'oklch(var(--border))',
                borderRadius: 'calc(var(--radius) * 0.75)'
            }}
        >
            <p className="font-medium" style={{ color: 'oklch(var(--surface-foreground))' }}>Surface Layer</p>
            <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
                This component uses most of the theme colors to provide a holistic preview.
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
                <div style={{ backgroundColor: 'oklch(var(--primary))', color: 'oklch(var(--primary-foreground))', padding: '0.5rem 0.75rem', borderRadius: 'calc(var(--radius) * 0.5)'}}>Primary</div>
                <div style={{ backgroundColor: 'oklch(var(--secondary))', color: 'oklch(var(--secondary-foreground))', padding: '0.5rem 0.75rem', borderRadius: 'calc(var(--radius) * 0.5)'}}>Secondary</div>
                <div style={{ backgroundColor: 'oklch(var(--accent))', color: 'oklch(var(--accent-foreground))', padding: '0.5rem 0.75rem', borderRadius: 'calc(var(--radius) * 0.5)'}}>Accent</div>
                <div style={{ backgroundColor: 'oklch(var(--destructive))', color: 'oklch(var(--destructive-foreground))', padding: '0.5rem 0.75rem', borderRadius: 'calc(var(--radius) * 0.5)'}}>Destructive</div>
            </div>

            <button 
                className="text-sm px-3 py-1.5 border focus:ring-2 focus:outline-none" 
                style={{ 
                    borderColor: 'oklch(var(--border))', 
                    backgroundColor: 'oklch(var(--input))', 
                    borderRadius: 'calc(var(--radius) * 0.5)', 
                    color: 'oklch(var(--foreground))', 
                    ringColor: 'oklch(var(--ring))' 
                }}
            >
                Interactive Element
            </button>
        </div>
    </div>
);


// --- Main App Component ---
export default function ThemeCreator() {
  const [hue, setHue] = useState(260); // OKLCH blue is around 260
  const [neutralChroma, setNeutralChroma] = useState(0.02);
  const [primaryChroma, setPrimaryChroma] = useState(0.15);
  const [lightness, setLightness] = useState(98);
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const [harmony, setHarmony] = useState('complementary');
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [scale, setScale] = useState(1.250); // Major Third
  const [radius, setRadius] = useState(0.5);
  const [headingFont, setHeadingFont] = useState('Inter');
  const [bodyFont, setBodyFont] = useState('Inter');

  const FONT_LIST = [
    // Sans-Serif
    "Inter", "Roboto", "Poppins", "Lato", "Montserrat", "Open Sans", "Source Sans Pro",
    // Serif
    "Merriweather", "Playfair Display", "Lora", "Roboto Slab",
    // Mono
    "Roboto Mono", "Source Code Pro", "Fira Code"
  ];

  // Effect to dynamically load selected Google Fonts
  useEffect(() => {
    const uniqueFonts = [...new Set([headingFont, bodyFont])];
    if (uniqueFonts.length === 0) return;

    const fontQuery = uniqueFonts.map(font => `family=${font.replace(/ /g, '+')}:wght@400;500;600;700`).join('&');
    const linkId = 'google-fonts-stylesheet';
    let link = document.getElementById(linkId);

    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
  }, [headingFont, bodyFont]);


  const themeConfig = useMemo(() => {
    const baseHue = hue;
    let secondaryHue;
    let accentHue;

    switch (harmony) {
      case 'analogous':
        secondaryHue = (baseHue + 30) % 360;
        accentHue = (baseHue - 30 + 360) % 360;
        break;
      case 'triadic':
        secondaryHue = (baseHue + 120) % 360;
        accentHue = (baseHue + 240) % 360;
        break;
      case 'split-complementary':
        const complement = (baseHue + 180) % 360;
        secondaryHue = (complement - 30 + 360) % 360;
        accentHue = (complement + 30) % 360;
        break;
      case 'complementary':
      default:
        secondaryHue = (baseHue + 180) % 360;
        accentHue = secondaryHue;
        break;
    }
    
    const l = lightness / 100;
    const dl = 1 - l;

    const typography = {
        '--font-sans': `"${bodyFont}", sans-serif`,
        '--font-heading': `"${headingFont}", sans-serif`,
        '--font-size-sm': `${(1 / scale).toFixed(3)}rem`,
        '--font-size-base': '1rem',
        '--font-size-lg': `${scale.toFixed(3)}rem`,
        '--font-size-xl': `${Math.pow(scale, 2).toFixed(3)}rem`,
        '--font-size-2xl': `${Math.pow(scale, 3).toFixed(3)}rem`,
        '--font-size-3xl': `${Math.pow(scale, 4).toFixed(3)}rem`,
        '--font-size-4xl': `${Math.pow(scale, 5).toFixed(3)}rem`,
    };

    const baseTheme = {
        ...typography,
        '--radius': `${radius}rem`,
    }

    const lightSurface = `${l * 0.995} ${neutralChroma * 1.25} ${baseHue}`;
    const darkSurface = `${dl + 0.06} ${neutralChroma * 1.25} ${baseHue}`;

    const gradients = {
        '--primary-gradient': `linear-gradient(145deg, oklch(0.75 ${primaryChroma * 1.1} ${baseHue}), oklch(var(--primary)))`,
        '--secondary-gradient': `linear-gradient(145deg, oklch(${l * 0.98} ${neutralChroma * 2.5} ${secondaryHue}), oklch(var(--secondary)))`,
        '--accent-gradient': `linear-gradient(145deg, oklch(${l} ${primaryChroma * 0.6} ${accentHue}), oklch(var(--accent)))`,
        '--neutral-gradient': `linear-gradient(145deg, oklch(${l} ${neutralChroma * 1.5} ${baseHue}), oklch(var(--background)))`,
    };

    const darkGradients = {
        '--primary-gradient': `linear-gradient(145deg, oklch(0.75 ${primaryChroma * 1.1} ${baseHue}), oklch(var(--primary)))`,
        '--secondary-gradient': `linear-gradient(145deg, oklch(${dl + 0.15} ${neutralChroma * 2.5} ${secondaryHue}), oklch(var(--secondary)))`,
        '--accent-gradient': `linear-gradient(145deg, oklch(${dl + 0.15} ${primaryChroma * 0.6} ${accentHue}), oklch(var(--accent)))`,
        '--neutral-gradient': `linear-gradient(145deg, oklch(${dl + 0.05} ${neutralChroma * 1.5} ${baseHue}), oklch(var(--background)))`,
    };

    return {
      light: {
        ...baseTheme,
        '--background': `${l} ${neutralChroma} ${baseHue}`,
        '--foreground': `${dl + 0.15} ${neutralChroma} ${baseHue}`,
        '--surface': lightSurface,
        '--surface-foreground': `${dl + 0.15} ${neutralChroma} ${baseHue}`,
        '--card': lightSurface,
        '--card-foreground': `${dl + 0.15} ${neutralChroma} ${baseHue}`,
        '--popover': lightSurface,
        '--popover-foreground': `${dl + 0.15} ${neutralChroma} ${baseHue}`,
        '--primary': `0.7 ${primaryChroma} ${baseHue}`,
        '--primary-foreground': `0.1 ${primaryChroma * 0.2} ${baseHue}`,
        '--secondary': `${l * 0.95} ${neutralChroma * 2} ${secondaryHue}`,
        '--secondary-foreground': `${dl + 0.25} ${neutralChroma * 2} ${secondaryHue}`,
        '--muted': `${l * 0.97} ${neutralChroma} ${baseHue}`,
        '--muted-foreground': `${dl + 0.4} ${neutralChroma} ${baseHue}`,
        '--accent': `${l * 0.98} ${primaryChroma * 0.5} ${accentHue}`,
        '--accent-foreground': `${dl + 0.3} ${primaryChroma * 0.5} ${accentHue}`,
        '--destructive': `0.65 0.22 25`, // OKLCH red is ~25 hue
        '--destructive-foreground': `0.98 0.05 25`,
        '--border': `${l * 0.9} ${neutralChroma} ${baseHue}`,
        '--input': `${l * 0.9} ${neutralChroma} ${baseHue}`,
        '--ring': `0.7 ${primaryChroma} ${baseHue}`,
        ...gradients,
      },
      dark: {
        ...baseTheme,
        '--background': `${dl + 0.03} ${neutralChroma} ${baseHue}`,
        '--foreground': `${l} ${neutralChroma} ${baseHue}`,
        '--surface': darkSurface,
        '--surface-foreground': `${l} ${neutralChroma} ${baseHue}`,
        '--card': darkSurface,
        '--card-foreground': `${l} ${neutralChroma} ${baseHue}`,
        '--popover': darkSurface,
        '--popover-foreground': `${l} ${neutralChroma} ${baseHue}`,
        '--primary': `0.7 ${primaryChroma} ${baseHue}`,
        '--primary-foreground': `0.1 ${primaryChroma * 0.2} ${baseHue}`,
        '--secondary': `${dl + 0.1} ${neutralChroma * 2} ${secondaryHue}`,
        '--secondary-foreground': `${l * 0.9} ${neutralChroma * 2} ${secondaryHue}`,
        '--muted': `${dl + 0.1} ${neutralChroma} ${baseHue}`,
        '--muted-foreground': `${l * 0.6} ${neutralChroma} ${baseHue}`,
        '--accent': `${dl + 0.1} ${primaryChroma * 0.5} ${accentHue}`,
        '--accent-foreground': `${l * 0.9} ${primaryChroma * 0.5} ${accentHue}`,
        '--destructive': `0.65 0.22 25`,
        '--destructive-foreground': `0.98 0.05 25`,
        '--border': `${dl + 0.15} ${neutralChroma} ${baseHue}`,
        '--input': `${dl + 0.15} ${neutralChroma} ${baseHue}`,
        '--ring': `0.7 ${primaryChroma} ${baseHue}`,
        ...darkGradients,
      }
    };
  }, [hue, harmony, baseFontSize, scale, radius, lightness, neutralChroma, primaryChroma, headingFont, bodyFont]);

  useEffect(() => {
    const root = document.documentElement;
    const theme = isDark ? themeConfig.dark : themeConfig.light;
    root.style.fontSize = `${baseFontSize}px`;
    root.classList.toggle('dark', isDark);
    for (const [key, value] of Object.entries(theme)) {
      root.style.setProperty(key, value);
    }
  }, [isDark, themeConfig, baseFontSize]);

  const generateCssString = useCallback(() => {
    const lightTheme = themeConfig.light;
    const darkTheme = themeConfig.dark;
    let css = `@layer base {\n  :root {\n`;
    for (const [key, value] of Object.entries(lightTheme)) {
      css += `    ${key}: ${value};\n`;
    }
    css += `  }\n\n  .dark {\n`;
    for (const [key, value] of Object.entries(darkTheme)) {
      css += `    ${key}: ${value};\n`;
    }
    css += `  }\n}\n`;
    return css;
  }, [themeConfig]);

  const copyToClipboard = () => {
    const cssToCopy = generateCssString();
    navigator.clipboard.writeText(cssToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
        console.warn('Clipboard API failed, falling back to execCommand.', err);
        const textArea = document.createElement('textarea');
        textArea.value = cssToCopy;
        textArea.style.position = 'fixed';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (execErr) {
            console.error('Fallback copy failed:', execErr);
        }
        document.body.removeChild(textArea);
    });
};

  const PRESET_HUES = [
    { name: 'Blue', value: 260 },
    { name: 'Violet', value: 285 },
    { name: 'Rose', value: 10 },
    { name: 'Green', value: 145 },
    { name: 'Orange', value: 50 },
  ];

  const COLOR_HARMONIES = [
    { id: 'complementary', name: 'Complementary' },
    { id: 'analogous', name: 'Analogous' },
    { id: 'triadic', name: 'Triadic' },
    { id: 'split-complementary', name: 'Split-Comp' },
  ];

  const TYPE_SCALES = [
    { name: 'Minor Third', ratio: 1.200 },
    { name: 'Major Third', ratio: 1.250 },
    { name: 'Perfect Fourth', ratio: 1.333 },
    { name: 'Augmented Fourth', ratio: 1.414 },
    { name: 'Golden Ratio', ratio: 1.618 },
  ];

  const PALETTE_COLORS = [
    { name: "Primary", bgVar: "--primary", textVar: "--primary-foreground" },
    { name: "Secondary", bgVar: "--secondary", textVar: "--secondary-foreground" },
    { name: "Accent", bgVar: "--accent", textVar: "--accent-foreground" },
    { name: "Destructive", bgVar: "--destructive", textVar: "--destructive-foreground" },
    { name: "Background", bgVar: "--background", textVar: "--foreground" },
    { name: "Foreground", bgVar: "--foreground", textVar: "--background" },
    { name: "Surface", bgVar: "--surface", textVar: "--surface-foreground" },
    { name: "Muted", bgVar: "--muted", textVar: "--muted-foreground" },
    { name: "Border", bgVar: "--border", textVar: "--foreground" },
    { name: "Input", bgVar: "--input", textVar: "--foreground" },
    { name: "Ring", bgVar: "--ring", textVar: "--primary-foreground" },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-8 transition-colors duration-300" style={{ backgroundColor: 'oklch(var(--background))', color: 'oklch(var(--foreground))', fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
            <Palette className="w-8 h-8" style={{ color: 'oklch(var(--primary))' }} />
            Shadcn Theme Creator
          </h1>
          <p className="text-lg" style={{ color: 'oklch(var(--muted-foreground))' }}>
            Interactively create a custom OKLCH theme for your shadcn/ui components.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'oklch(var(--card-foreground))', fontFamily: 'var(--font-heading)' }}>Theme Controls</h2>
              <div className="flex items-center justify-between mb-6">
                <span className="font-medium">Mode</span>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-full transition-colors hover:bg-accent"
                  aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <div className="space-y-2 mb-6">
                <label className="font-medium">Color Harmony</label>
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_HARMONIES.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setHarmony(item.id)}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-all duration-200 focus:outline-none ${harmony === item.id ? 'ring-2 ring-offset-2 ring-offset-background' : 'hover:bg-accent'}`}
                      style={{
                        backgroundColor: harmony === item.id ? 'oklch(var(--primary))' : 'transparent',
                        color: harmony === item.id ? 'oklch(var(--primary-foreground))' : 'oklch(var(--muted-foreground))',
                        borderColor: 'oklch(var(--border))',
                        ringColor: 'oklch(var(--ring))'
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-medium">Presets</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_HUES.map(preset => (
                    <button
                        key={preset.name}
                        onClick={() => setHue(preset.value)}
                        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${hue === preset.value ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
                        style={{
                            backgroundColor: `oklch(0.7 ${primaryChroma} ${preset.value})`,
                            color: `oklch(0.1 ${primaryChroma * 0.2} ${preset.value})`,
                            borderColor: `oklch(0.8 ${neutralChroma} ${preset.value})`,
                            ringColor: 'oklch(var(--ring))',
                        }}
                    >
                        {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))' }}>
                <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Color Properties</h2>
                <div className="space-y-2 mb-6">
                    <label htmlFor="hue-slider" className="font-medium">Hue: {hue}°</label>
                    <input id="hue-slider" type="range" min="0" max="360" value={hue} onChange={(e) => setHue(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
                        style={{ background: 'linear-gradient(to right, oklch(0.7 0.2 0), oklch(0.7 0.2 60), oklch(0.7 0.2 120), oklch(0.7 0.2 180), oklch(0.7 0.2 240), oklch(0.7 0.2 300), oklch(0.7 0.2 360))' }}/>
                </div>
                <div className="space-y-2 mb-6">
                    <label htmlFor="primary-chroma-slider" className="font-medium">Primary Chroma: {primaryChroma.toFixed(3)}</label>
                    <input id="primary-chroma-slider" type="range" min="0.05" max="0.3" step="0.005" value={primaryChroma} onChange={(e) => setPrimaryChroma(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
                        style={{ background: `linear-gradient(to right, oklch(0.7 0.05 ${hue}), oklch(0.7 0.3 ${hue}))` }} />
                </div>
                <div className="space-y-2 mb-6">
                    <label htmlFor="neutral-chroma-slider" className="font-medium">Neutral Chroma: {neutralChroma.toFixed(3)}</label>
                    <input id="neutral-chroma-slider" type="range" min="0" max="0.1" step="0.001" value={neutralChroma} onChange={(e) => setNeutralChroma(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
                        style={{ background: `linear-gradient(to right, oklch(0.5 0 ${hue}), oklch(0.5 0.1 ${hue}))` }} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lightness-slider" className="font-medium">Base Lightness: {lightness}%</label>
                    <input id="lightness-slider" type="range" min="90" max="100" step="0.5" value={lightness} onChange={(e) => setLightness(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
                        style={{ background: `linear-gradient(to right, oklch(0.9 ${neutralChroma} ${hue}), oklch(1 ${neutralChroma} ${hue}))` }} />
                </div>
            </div>

             {/* --- Font Mixer --- */}
            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Font Mixer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="heading-font-select" className="font-medium">Heading Font</label>
                  <select
                    id="heading-font-select"
                    value={headingFont}
                    onChange={(e) => setHeadingFont(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:outline-none"
                    style={{
                      backgroundColor: 'oklch(var(--input))',
                      borderColor: 'oklch(var(--border))',
                      color: 'oklch(var(--foreground))',
                      ringColor: 'oklch(var(--ring))',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    {FONT_LIST.map(font => <option key={font} value={font}>{font}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="body-font-select" className="font-medium">Body Font</label>
                   <select
                    id="body-font-select"
                    value={bodyFont}
                    onChange={(e) => setBodyFont(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:outline-none"
                    style={{
                      backgroundColor: 'oklch(var(--input))',
                      borderColor: 'oklch(var(--border))',
                      color: 'oklch(var(--foreground))',
                      ringColor: 'oklch(var(--ring))',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-sans)'
                    }}
                  >
                    {FONT_LIST.map(font => <option key={font} value={font}>{font}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))' }}>
                <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Typography & Radius</h2>
                <div className="space-y-2 mb-6">
                    <label htmlFor="font-size-slider" className="font-medium">Base Font Size: {baseFontSize}px</label>
                    <input id="font-size-slider" type="range" min="12" max="20" step="1" value={baseFontSize} onChange={(e) => setBaseFontSize(parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{ background: 'oklch(var(--primary))' }} />
                </div>
                <div className="space-y-2 mb-6">
                    <label className="font-medium">Typographic Scale</label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {TYPE_SCALES.map(item => (
                            <button key={item.name} onClick={() => setScale(item.ratio)}
                                className={`px-3 py-1.5 text-sm border transition-all duration-200 focus:outline-none ${scale === item.ratio ? 'ring-2 ring-offset-2 ring-offset-background' : 'hover:bg-accent'}`}
                                style={{
                                    backgroundColor: scale === item.ratio ? 'oklch(var(--primary))' : 'transparent',
                                    color: scale === item.ratio ? 'oklch(var(--primary-foreground))' : 'oklch(var(--muted-foreground))',
                                    borderColor: 'oklch(var(--border))',
                                    ringColor: 'oklch(var(--ring))',
                                    borderRadius: 'var(--radius)'
                                }}>
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="radius-slider" className="font-medium">Border Radius: {radius.toFixed(2)}rem</label>
                    <input id="radius-slider" type="range" min="0" max="2" step="0.05" value={radius} onChange={(e) => setRadius(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{ background: 'oklch(var(--primary))' }} />
                </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'oklch(var(--card-foreground))', fontFamily: 'var(--font-heading)' }}>Generated CSS</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-2 font-semibold text-sm transition-all duration-200"
                  style={{ 
                    backgroundColor: copied ? `oklch(0.7 0.2 150)` : 'oklch(var(--primary))',
                    color: copied ? `oklch(0.1 0.05 150)` : 'oklch(var(--primary-foreground))',
                    borderRadius: 'var(--radius)'
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy CSS'}
                </button>
              </div>
              <pre className="text-sm overflow-x-auto p-4 rounded-md" style={{ backgroundColor: 'oklch(var(--muted))', borderRadius: 'var(--radius)' }}>
                <code>{generateCssString()}</code>
              </pre>
            </div>
            
            <ColorPalettePreview colors={PALETTE_COLORS} />

            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--card-foreground))', fontFamily: 'var(--font-heading)' }}>
                    Gradients
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <GradientPreview name="Primary" variable="--primary-gradient" />
                    <GradientPreview name="Secondary" variable="--secondary-gradient" />
                    <GradientPreview name="Accent" variable="--accent-gradient" />
                    <GradientPreview name="Neutral" variable="--neutral-gradient" />
                </div>
            </div>

            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--card-foreground))', fontFamily: 'var(--font-heading)' }}>Component Preview</h3>
              <div className="space-y-6">
                <div className="flex gap-3 flex-wrap items-center">
                  <DemoButton variant="primary">Primary</DemoButton>
                  <DemoButton variant="secondary">Secondary</DemoButton>
                  <DemoButton variant="accent">Accent</DemoButton>
                  <DemoButton variant="outline">Outline</DemoButton>
                  <DemoButton variant="destructive">Destructive</DemoButton>
                </div>
                
                <ThemeShowcase />

                <div className="space-y-2">
                    <label htmlFor="demo-input" className="text-sm font-medium">Input Field</label>
                    <input id="demo-input" type="text" placeholder="Enter some text..."
                      className="w-full p-2 border text-sm focus:ring-2 focus:outline-none"
                      style={{ 
                        backgroundColor: 'oklch(var(--input))',
                        borderColor: 'oklch(var(--border))',
                        color: 'oklch(var(--foreground))',
                        ringColor: 'oklch(var(--ring))',
                        borderRadius: 'var(--radius)'
                      }} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border" style={{ backgroundColor: 'oklch(var(--card))', borderColor: 'oklch(var(--border))' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'oklch(var(--card-foreground))', fontFamily: 'var(--font-heading)' }}>Typography Preview</h3>
              <div className="space-y-4">
                <p style={{ fontSize: 'var(--font-size-4xl)', lineHeight: '1.1', fontFamily: 'var(--font-heading)' }} className="font-bold">Aa - Heading 1</p>
                <p style={{ fontSize: 'var(--font-size-3xl)', lineHeight: '1.2', fontFamily: 'var(--font-heading)' }} className="font-semibold">Aa - Heading 2</p>
                <p style={{ fontSize: 'var(--font-size-2xl)', lineHeight: '1.3', fontFamily: 'var(--font-heading)' }} className="font-semibold">Aa - Heading 3</p>
                <p style={{ fontSize: 'var(--font-size-xl)', lineHeight: '1.4', fontFamily: 'var(--font-heading)' }} className="font-medium">Aa - Heading 4</p>
                <p style={{ fontSize: 'var(--font-size-lg)'}}>Aa - Large Paragraph</p>
                <p style={{ fontSize: 'var(--font-size-base)', color: 'oklch(var(--muted-foreground))' }}>
                    Aa - The quick brown fox jumps over the lazy dog. This is the body text, perfect for long-form content and descriptions.
                </p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'oklch(var(--muted-foreground))' }}>Aa - Small text for captions and footnotes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
