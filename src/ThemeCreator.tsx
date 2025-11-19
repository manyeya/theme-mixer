import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { FC, ReactNode } from 'react';
import { Palette, Monitor, Type, Layout, Sliders, Shuffle, Download, Moon, Sun } from 'lucide-react';
import { Fader, Knob } from './components/MixerControls';

// --- Type Definitions ---
type DemoButtonVariant = 'primary' | 'secondary' | 'accent' | 'destructive' | 'outline';
type Harmony = 'complementary' | 'analogous' | 'triadic' | 'split-complementary';
type Mode = 'normal' | 'brutalist' | 'professional';

// --- Helper Components ---
interface DemoButtonProps {
  children: ReactNode;
  variant?: DemoButtonVariant;
}

const DemoButton: FC<DemoButtonProps> = ({ children, variant = 'primary' }) => {
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
      style={{ ...styles[variant], borderRadius: 'var(--radius)', fontFamily: 'var(--font-heading)', '--ring-color': 'oklch(var(--ring))' } as any}
    >
      {children}
    </button>
  );
};

interface ColorPalettePreviewProps {
  colors: Array<{ name: string; bgVar: string; textVar: string }>;
}
const ColorPalettePreview: FC<ColorPalettePreviewProps> = ({ colors }) => (
  <div className="rounded-lg border bg-[#1a1a1a] border-[#333] p-4">
    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
      Palette Monitor
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {colors.map(({ name, bgVar, textVar }) => (
        <div
          key={name}
          className="h-16 flex flex-col justify-end p-2 text-[10px] border shadow-sm"
          style={{
            backgroundColor: `oklch(var(${bgVar}))`,
            color: `oklch(var(${textVar}))`,
            borderColor: 'oklch(var(--border) / 0.2)',
            borderRadius: 'var(--radius)'
          }}
        >
          <span className="font-bold uppercase">{name}</span>
          <span className="opacity-70 font-mono">{bgVar}</span>
        </div>
      ))}
    </div>
  </div>
);



const ThemeShowcase: FC = () => (
  <div
    className="rounded-lg border shadow-lg mx-auto transition-all duration-300"
    style={{
      background: 'var(--neutral-gradient)',
      borderColor: 'oklch(var(--border))',
      borderRadius: 'var(--radius)',
      maxWidth: 'var(--container-max-width)',
      padding: 'var(--padding-section)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-base)'
    }}
  >
    <div className="flex items-center justify-between">
      <p
        className="text-sm font-bold"
        style={{ color: 'oklch(var(--foreground))', fontFamily: 'var(--font-heading)' }}
      >
        Preview Window
      </p>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      </div>
    </div>


    <div
      className="rounded-md border shadow-sm flex flex-col transition-all duration-300"
      style={{
        backgroundColor: 'oklch(var(--surface))',
        borderColor: 'oklch(var(--border))',
        borderRadius: 'calc(var(--radius) * 0.75)',
        padding: 'var(--padding-card)',
        gap: 'var(--gap-base)'
      }}
    >
      <p className="font-medium" style={{ color: 'oklch(var(--surface-foreground))' }}>Surface Layer</p>
      <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
        This component uses most of the theme colors to provide a holistic preview.
      </p>

      <div className="flex flex-wrap gap-2 text-xs">
        <div style={{ backgroundColor: 'oklch(var(--primary))', color: 'oklch(var(--primary-foreground))', padding: '0.5rem 0.75rem', borderRadius: 'calc(var(--radius) * 0.5)' }}>Primary</div>
        <div style={{ backgroundColor: 'oklch(var(--secondary))', color: 'oklch(var(--secondary-foreground))', padding: '0.5rem 0.75rem', borderRadius: 'calc(var(--radius) * 0.5)' }}>Secondary</div>
        <div style={{ backgroundColor: 'oklch(var(--accent))', color: 'oklch(var(--accent-foreground))', padding: '0.5rem 0.75rem', borderRadius: 'calc(var(--radius) * 0.5)' }}>Accent</div>
      </div>

      <button
        className="text-sm px-3 py-1.5 border focus:ring-2 focus:outline-none shadow-sm w-fit"
        style={{
          borderColor: 'oklch(var(--border))',
          backgroundColor: 'oklch(var(--input))',
          borderRadius: 'calc(var(--radius) * 0.5)',
          color: 'oklch(var(--foreground))',
          '--ring-color': 'oklch(var(--ring))'
        } as any}
      >
        Interactive Element
      </button>
    </div>
  </div>
);


// --- Main App Component ---
export default function App() {
  const [mode, setMode] = useState<Mode>('normal');
  const [hue, setHue] = useState(260); // OKLCH blue is around 260
  const [neutralChroma, setNeutralChroma] = useState(0.02);
  const [primaryChroma, setPrimaryChroma] = useState(0.15);
  const [lightness, setLightness] = useState(98);
  const [isDark, setIsDark] = useState(false);
  const [harmony, setHarmony] = useState<Harmony>('complementary');
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [scale, setScale] = useState(1.250); // Major Third
  const [radius, setRadius] = useState(0.5);
  const [headingFont, setHeadingFont] = useState('Inter');
  const [bodyFont, setBodyFont] = useState('Inter');

  // Layout State
  const [containerWidth, setContainerWidth] = useState(42); // rem
  const [gapBase, setGapBase] = useState(1.5); // rem
  const [paddingCard, setPaddingCard] = useState(1.5); // rem
  const [paddingSection] = useState(2); // rem

  const FONT_LIST = [
    "Inter", "Roboto", "Poppins", "Lato", "Montserrat", "Open Sans", "Source Sans Pro",
    "Merriweather", "Playfair Display", "Lora", "Roboto Slab",
    "Roboto Mono", "Source Code Pro", "Fira Code"
  ];

  // Effect to apply presets when mode changes
  useEffect(() => {
    if (mode === 'brutalist') {
      setRadius(0);
      setHarmony('complementary');
      setHeadingFont('Roboto Mono');
      setBodyFont('Roboto Mono');
      setScale(1.250);
    } else if (mode === 'professional') {
      setRadius(0.5);
      setHarmony('analogous');
      setHeadingFont('Inter');
      setBodyFont('Inter');
      setPrimaryChroma(p => Math.min(p, 0.08));
      setNeutralChroma(n => Math.min(n, 0.02));
      setScale(1.333);
      setLightness(98.5);
    }
  }, [mode]);

  useEffect(() => {
    const uniqueFonts = [...new Set([headingFont, bodyFont])];
    if (uniqueFonts.length === 0) return;

    const fontQuery = uniqueFonts.map(font => `family=${font.replace(/ /g, '+')}:wght@400;500;600;700`).join('&');
    const linkId = 'google-fonts-stylesheet';
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

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
    const isBrutalist = mode === 'brutalist';

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
      '--container-max-width': `${containerWidth}rem`,
      '--gap-base': `${gapBase}rem`,
      '--padding-card': `${paddingCard}rem`,
      '--padding-section': `${paddingSection}rem`,
    };

    const gradients = isBrutalist ? {
      '--primary-gradient': `oklch(var(--primary))`,
      '--secondary-gradient': `oklch(var(--secondary))`,
      '--accent-gradient': `oklch(var(--accent))`,
      '--neutral-gradient': `oklch(var(--background))`,
    } : {
      '--primary-gradient': `linear-gradient(145deg, oklch(0.75 ${primaryChroma * 1.1} ${baseHue}), oklch(var(--primary)))`,
      '--secondary-gradient': `linear-gradient(145deg, oklch(${l * 0.98} ${neutralChroma * 2.5} ${secondaryHue}), oklch(var(--secondary)))`,
      '--accent-gradient': `linear-gradient(145deg, oklch(${l} ${primaryChroma * 0.6} ${accentHue}), oklch(var(--accent)))`,
      '--neutral-gradient': `linear-gradient(145deg, oklch(${l} ${neutralChroma * 1.5} ${baseHue}), oklch(var(--background)))`,
    };

    const darkGradients = isBrutalist ? gradients : {
      '--primary-gradient': `linear-gradient(145deg, oklch(0.75 ${primaryChroma * 1.1} ${baseHue}), oklch(var(--primary)))`,
      '--secondary-gradient': `linear-gradient(145deg, oklch(${dl + 0.15} ${neutralChroma * 2.5} ${secondaryHue}), oklch(var(--secondary)))`,
      '--accent-gradient': `linear-gradient(145deg, oklch(${dl + 0.15} ${primaryChroma * 0.6} ${accentHue}), oklch(var(--accent)))`,
      '--neutral-gradient': `linear-gradient(145deg, oklch(${dl + 0.05} ${neutralChroma * 1.5} ${baseHue}), oklch(var(--background)))`,
    };

    if (isBrutalist) {
      const complementHue = (baseHue + 180) % 360;
      const highChroma = 0.25;

      // --- Brutalist Light Theme (High contrast: dark text on light bg) ---
      const lightBgColor = `0.98 ${highChroma * 0.7} ${baseHue}`;
      const lightFgColor = `0.35 ${highChroma} ${complementHue}`;

      const brutalistLightTheme = {
        ...baseTheme,
        '--background': lightBgColor,
        '--foreground': lightFgColor,
        '--surface': lightBgColor,
        '--surface-foreground': lightFgColor,
        '--card': lightBgColor,
        '--card-foreground': lightFgColor,
        '--popover': lightBgColor,
        '--popover-foreground': lightFgColor,
        '--primary': lightFgColor,
        '--primary-foreground': lightBgColor,
        '--secondary': lightFgColor,
        '--secondary-foreground': lightBgColor,
        '--muted': lightBgColor,
        '--muted-foreground': lightFgColor,
        '--accent': lightFgColor,
        '--accent-foreground': lightBgColor,
        '--destructive': `0.55 0.25 25`,
        '--destructive-foreground': `0.99 0.05 25`,
        '--border': lightFgColor,
        '--input': `oklch(from ${lightBgColor} l calc(l - 0.05))`,
        '--ring': lightFgColor,
        ...gradients,
      };

      // --- Brutalist Dark Theme (High contrast: light text on dark bg) ---
      const darkBgColor = `0.25 ${highChroma * 0.9} ${baseHue}`;
      const darkFgColor = `0.95 ${highChroma * 0.9} ${complementHue}`;

      const brutalistDarkTheme = {
        ...baseTheme,
        '--background': darkBgColor,
        '--foreground': darkFgColor,
        '--surface': darkBgColor,
        '--surface-foreground': darkFgColor,
        '--card': darkBgColor,
        '--card-foreground': darkFgColor,
        '--popover': darkBgColor,
        '--popover-foreground': darkFgColor,
        '--primary': darkFgColor,
        '--primary-foreground': darkBgColor,
        '--secondary': darkFgColor,
        '--secondary-foreground': darkBgColor,
        '--muted': darkBgColor,
        '--muted-foreground': darkFgColor,
        '--accent': darkFgColor,
        '--accent-foreground': darkBgColor,
        '--destructive': `0.65 0.25 25`,
        '--destructive-foreground': `0.99 0.05 25`,
        '--border': darkFgColor,
        '--input': `oklch(from ${darkBgColor} l calc(l + 0.05))`,
        '--ring': darkFgColor,
        ...darkGradients,
      };

      return { light: brutalistLightTheme, dark: brutalistDarkTheme };
    }


    const lightSurface = `${l * 0.995} ${neutralChroma * 1.25} ${baseHue}`;
    const darkSurface = `${dl + 0.06} ${neutralChroma * 1.25} ${baseHue}`;
    const lightBorder = `${l * 0.9} ${neutralChroma} ${baseHue}`;
    const darkBorder = `${dl + 0.15} ${neutralChroma} ${baseHue}`;

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
        '--destructive': `0.65 0.22 25`,
        '--destructive-foreground': `0.98 0.05 25`,
        '--border': lightBorder,
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
        '--border': darkBorder,
        '--input': `${dl + 0.15} ${neutralChroma} ${baseHue}`,
        '--ring': `0.7 ${primaryChroma} ${baseHue}`,
        ...darkGradients,
      }
    };
  }, [hue, harmony, scale, radius, lightness, neutralChroma, primaryChroma, headingFont, bodyFont, mode, containerWidth, gapBase, paddingCard, paddingSection]);


  useEffect(() => {
    const root = document.documentElement;
    // Removed: root.style.fontSize = `${baseFontSize}px`; - this was causing global layout shifts
    root.classList.toggle('dark', isDark);
  }, [isDark]);

  // Removed generateCssString and copyToClipboard as they are no longer used directly in the new UI (logic moved to inline handlers or simplified)


  const MODES = [{ id: 'normal', name: 'Normal' }, { id: 'brutalist', name: 'Brutalist' }, { id: 'professional', name: 'Professional' }];
  const COLOR_HARMONIES = [{ id: 'complementary', name: 'Complementary' }, { id: 'analogous', name: 'Analogous' }, { id: 'triadic', name: 'Triadic' }, { id: 'split-complementary', name: 'Split-Comp' }];
  const PALETTE_COLORS = [
    { name: "Primary", bgVar: "--primary", textVar: "--primary-foreground" }, { name: "Secondary", bgVar: "--secondary", textVar: "--secondary-foreground" },
    { name: "Accent", bgVar: "--accent", textVar: "--accent-foreground" }, { name: "Destructive", bgVar: "--destructive", textVar: "--destructive-foreground" },
    { name: "Background", bgVar: "--background", textVar: "--foreground" }, { name: "Foreground", bgVar: "--foreground", textVar: "--background" },
    { name: "Surface", bgVar: "--surface", textVar: "--surface-foreground" }, { name: "Muted", bgVar: "--muted", textVar: "--muted-foreground" },
    { name: "Border", bgVar: "--border", textVar: "--foreground" }, { name: "Input", bgVar: "--input", textVar: "--foreground" },
    { name: "Ring", bgVar: "--ring", textVar: "--primary-foreground" },
  ];

  const generateRandomTheme = useCallback(() => {
    setHue(Math.floor(Math.random() * 360));
    setPrimaryChroma(0.1 + Math.random() * 0.2);
    setNeutralChroma(Math.random() * 0.05);
    setLightness(90 + Math.random() * 10);
    setHarmony(COLOR_HARMONIES[Math.floor(Math.random() * COLOR_HARMONIES.length)].id as Harmony);
  }, []);

  const themeStyles = isDark ? themeConfig.dark : themeConfig.light;

  // --- Scoped Style Application ---
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current) return;

    const styles = themeStyles as Record<string, string>;
    Object.entries(styles).forEach(([key, value]) => {
      previewRef.current?.style.setProperty(key, value);
    });

    // Apply base font size to the preview container only
    previewRef.current.style.fontSize = `${baseFontSize}px`;

  }, [themeStyles, baseFontSize]);

  // --- Tabs State ---
  const [activeTab, setActiveTab] = useState<'showcase' | 'palette' | 'typography' | 'components'>('showcase');

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-gray-300 font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-12 border-b border-[#333] bg-[#1a1a1a] flex items-center justify-between px-4 flex-shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          <h1 className="text-sm font-bold tracking-[0.2em] text-gray-100">THEMEMIXER <span className="text-[10px] text-gray-500 font-normal ml-1">PRO</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={generateRandomTheme}
            className="p-1.5 hover:bg-[#222] rounded text-gray-400 hover:text-white transition-colors"
            title="Randomize"
          >
            <Shuffle size={14} />
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-1.5 rounded transition-colors ${isDark
              ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
              : 'bg-[#222] text-gray-400 hover:bg-[#333] hover:text-white'
              }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <div className="h-4 w-px bg-[#333]"></div>
          <button
            onClick={() => {
              const css = `:root {\n${Object.entries(themeStyles).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;
              navigator.clipboard.writeText(css);
              alert('CSS copied to clipboard!');
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)]"
          >
            <Download size={12} /> Export CSS
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section: Live Preview (Scoped) */}
        <div className="flex-1 bg-[#0a0a0a] relative flex flex-col min-h-0">
          {/* Preview Header & Tabs */}
          <div className="h-10 border-b border-[#333] bg-[#1a1a1a] flex justify-between items-center px-4 flex-shrink-0">
            <div className="flex items-center gap-4 h-full">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mr-4">
                <Monitor size={12} /> Preview
              </h2>
              <div className="flex h-full">
                {[
                  { id: 'showcase', label: 'Showcase' },
                  { id: 'palette', label: 'Palette' },
                  { id: 'typography', label: 'Typography' },
                  { id: 'components', label: 'Components' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`h-full px-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab.id
                      ? 'border-blue-500 text-white bg-[#222]'
                      : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#222]'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-red-500">LIVE</span>
            </div>
          </div>

          {/* Preview Content Area */}
          <div
            ref={previewRef}
            className="flex-1 overflow-y-auto bg-[oklch(var(--background))] text-[oklch(var(--foreground))] relative transition-colors duration-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <div className="max-w-4xl mx-auto p-8">
              {activeTab === 'showcase' && <ThemeShowcase />}
              {activeTab === 'palette' && <ColorPalettePreview colors={PALETTE_COLORS} />}
              {activeTab === 'typography' && (
                <div className="space-y-8">
                  <div className="p-8 border border-dashed border-[oklch(var(--border))] rounded-lg">
                    <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Typography Scale</h1>
                    <p className="text-xl mb-8 opacity-80">Checking font weights, line heights, and readability.</p>

                    <div className="space-y-6">
                      <div>
                        <span className="text-xs opacity-50 uppercase tracking-wider">Heading 1</span>
                        <h1 style={{ fontSize: 'var(--font-size-4xl)', fontFamily: 'var(--font-heading)' }} className="font-bold mt-1">The quick brown fox</h1>
                      </div>
                      <div>
                        <span className="text-xs opacity-50 uppercase tracking-wider">Heading 2</span>
                        <h2 style={{ fontSize: 'var(--font-size-3xl)', fontFamily: 'var(--font-heading)' }} className="font-bold mt-1">Jumps over the lazy dog</h2>
                      </div>
                      <div>
                        <span className="text-xs opacity-50 uppercase tracking-wider">Body Text</span>
                        <p style={{ fontSize: 'var(--font-size-base)' }} className="mt-2 max-w-2xl leading-relaxed opacity-90">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'components' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold opacity-50 uppercase">Buttons</h3>
                      <div className="flex flex-wrap gap-4">
                        <DemoButton variant="primary">Primary Action</DemoButton>
                        <DemoButton variant="secondary">Secondary</DemoButton>
                        <DemoButton variant="outline">Outline</DemoButton>
                        <DemoButton variant="destructive">Destructive</DemoButton>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold opacity-50 uppercase">Cards</h3>
                      <div className="p-6 rounded-lg border bg-[oklch(var(--card))] text-[oklch(var(--card-foreground))] shadow-sm" style={{ borderColor: 'oklch(var(--border))' }}>
                        <h4 className="font-bold mb-2">Card Title</h4>
                        <p className="text-sm opacity-80">This is a card component to test background and border variables.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Mixer Console (Ableton Live Style) */}
        <div className="h-[280px] flex-shrink-0 bg-[#121212] border-t border-[#333] flex flex-col z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex-1 p-4 grid grid-cols-4 gap-4 overflow-hidden">

            {/* Module 1: Global Settings */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded flex flex-col shadow-lg overflow-hidden">
              <div className="p-2 border-b border-[#333] bg-[#222] rounded-t">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-center text-gray-400 flex items-center justify-center gap-2">
                  <Sliders size={10} /> Global
                </h2>
              </div>
              <div className="p-3 flex-1 flex flex-col gap-2 overflow-hidden">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Mode</div>
                  <div className="grid grid-cols-1 gap-1">
                    {MODES.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setMode(item.id as Mode)}
                        className={`px-2 py-1 rounded text-[9px] font-medium uppercase tracking-wide border transition-all ${mode === item.id
                          ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                          : 'bg-[#222] text-gray-400 border-[#333] hover:bg-[#2a2a2a] hover:border-[#444]'
                          }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-1">Harmony</div>
                  <div className="grid grid-cols-2 gap-1">
                    {COLOR_HARMONIES.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setHarmony(item.id as Harmony)}
                        className={`px-2 py-1 rounded text-[9px] font-medium uppercase tracking-wide border transition-all ${harmony === item.id
                          ? 'bg-orange-600 text-white border-orange-400 shadow-[0_0_8px_rgba(234,88,12,0.4)]'
                          : 'bg-[#222] text-gray-400 border-[#333] hover:bg-[#2a2a2a] hover:border-[#444]'
                          }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Module 2: Color */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded flex flex-col shadow-lg overflow-hidden">
              <div className="p-2 border-b border-[#333] bg-[#222] rounded-t">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-center text-gray-400 flex items-center justify-center gap-2">
                  <Palette size={10} /> Color
                </h2>
              </div>
              <div className="p-3 flex-1 flex flex-col gap-2 overflow-hidden justify-center">
                <div className="flex items-center justify-center gap-2">
                  <Knob
                    value={primaryChroma * 100}
                    min={5}
                    max={30}
                    onChange={(v) => setPrimaryChroma(v / 100)}
                    label="P.Chr"
                    size={40}
                  />
                  <Knob
                    value={hue}
                    min={0}
                    max={360}
                    onChange={setHue}
                    label="Hue"
                    size={56}
                  />
                  <Knob
                    value={neutralChroma * 100}
                    min={0}
                    max={10}
                    onChange={(v) => setNeutralChroma(v / 100)}
                    label="N.Chr"
                    size={40}
                  />
                </div>
                <div className="px-4">
                  <Fader
                    value={lightness}
                    min={90}
                    max={100}
                    step={0.5}
                    onChange={setLightness}
                    label="Light"
                    color="bg-orange-500"
                    orientation="horizontal"
                    height="h-8"
                  />
                </div>
              </div>
            </div>

            {/* Module 3: Typography */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded flex flex-col shadow-lg overflow-hidden">
              <div className="p-2 border-b border-[#333] bg-[#222] rounded-t">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-center text-gray-400 flex items-center justify-center gap-2">
                  <Type size={10} /> Typography
                </h2>
              </div>
              <div className="p-3 flex-1 flex flex-col gap-2 overflow-hidden">
                <div className="grid grid-cols-3 gap-2">
                  <Knob
                    value={baseFontSize}
                    min={12}
                    max={24}
                    onChange={setBaseFontSize}
                    label="Size"
                    size={48}
                  />
                  <Knob
                    value={scale * 100}
                    min={120}
                    max={162}
                    onChange={(v) => setScale(v / 100)}
                    label="Scale"
                    size={48}
                  />
                  <Knob
                    value={radius * 10}
                    min={0}
                    max={20}
                    onChange={(v) => setRadius(v / 10)}
                    label="Radius"
                    size={48}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-500">Head</label>
                    <select
                      value={headingFont}
                      onChange={(e) => setHeadingFont(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-gray-300 text-[9px] p-1 rounded focus:border-blue-500 outline-none"
                    >
                      {FONT_LIST.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-gray-500">Body</label>
                    <select
                      value={bodyFont}
                      onChange={(e) => setBodyFont(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-gray-300 text-[9px] p-1 rounded focus:border-blue-500 outline-none"
                    >
                      {FONT_LIST.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 4: Layout */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded flex flex-col shadow-lg overflow-hidden">
              <div className="p-2 border-b border-[#333] bg-[#222] rounded-t">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-center text-gray-400 flex items-center justify-center gap-2">
                  <Layout size={10} /> Layout
                </h2>
              </div>
              <div className="p-3 flex-1 flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-3 gap-2">
                  <Knob
                    value={containerWidth}
                    min={50}
                    max={100}
                    onChange={setContainerWidth}
                    label="Width"
                    size={48}
                  />
                  <Knob
                    value={gapBase * 10}
                    min={10}
                    max={40}
                    onChange={(v) => setGapBase(v / 10)}
                    label="Gap"
                    size={48}
                  />
                  <Knob
                    value={paddingCard * 10}
                    min={10}
                    max={30}
                    onChange={(v) => setPaddingCard(v / 10)}
                    label="Pad"
                    size={48}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
