import React, { useRef } from 'react';

// --- Mixer Components ---

interface FaderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    label: string;
    height?: string;
    color?: string;
}

export const Fader: React.FC<FaderProps & { orientation?: 'vertical' | 'horizontal' }> = ({
    value,
    min,
    max,
    step = 1,
    onChange,
    label,
    height = "h-48",
    color = "bg-blue-500",
    orientation = 'vertical'
}) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const isVertical = orientation === 'vertical';

    return (
        <div className={`flex ${isVertical ? 'flex-col' : 'flex-row items-center w-full'} gap-2 group`}>
            <div className={`relative ${isVertical ? `w-12 ${height}` : 'h-12 w-full'} bg-[#1a1a1a] rounded-lg border border-[#333] shadow-inner flex ${isVertical ? 'justify-center' : 'items-center'} p-1`}>
                {/* Track markings */}
                <div className={`absolute ${isVertical ? 'inset-y-2 left-0 right-0 flex-col' : 'inset-x-2 top-0 bottom-0 flex-row'} flex justify-between px-3 pointer-events-none opacity-30`}>
                    {[...Array(11)].map((_, i) => (
                        <div key={i} className={`${isVertical ? 'w-full h-px' : 'h-full w-px'} bg-gray-500`}></div>
                    ))}
                </div>

                {/* Track Groove */}
                <div className={`absolute ${isVertical ? 'top-2 bottom-2 w-1' : 'left-2 right-2 h-1'} bg-[#0a0a0a] rounded-full`}></div>

                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className={`absolute inset-0 w-full h-full opacity-0 ${isVertical ? 'cursor-ns-resize' : 'cursor-ew-resize'} z-10`}
                    style={{ appearance: isVertical ? 'slider-vertical' : 'none' } as any}
                />

                {/* Custom Thumb Visual */}
                <div
                    className={`absolute ${isVertical ? 'w-8 h-12' : 'h-8 w-12'} bg-gradient-to-b from-[#444] to-[#222] border border-[#555] rounded shadow-xl flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out`}
                    style={isVertical ? {
                        bottom: `calc(${percentage}% - 24px)`,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                    } : {
                        left: `calc(${percentage}% - 24px)`,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                >
                    <div className={`${isVertical ? 'w-full h-1' : 'h-full w-1'} ${color} opacity-80 shadow-[0_0_5px_currentColor]`}></div>
                </div>
            </div>

            <div className={`text-center ${isVertical ? '' : 'min-w-[4rem]'}`}>
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">{label}</div>
                <div className="bg-[#0a0a0a] text-[#00ffcc] font-mono text-xs px-2 py-1 rounded border border-[#333] min-w-[3rem]">
                    {value.toFixed(step < 1 ? 2 : 0)}
                </div>
            </div>
        </div>
    );
};

interface KnobProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    label: string;
    size?: number;
}

export const Knob: React.FC<KnobProps> = ({ value, min, max, onChange, label, size = 64 }) => {
    const startY = useRef<number>(0);
    const startValue = useRef<number>(0);

    const percentage = ((value - min) / (max - min)) * 100;
    const rotation = (percentage / 100) * 270 - 135; // -135deg to +135deg

    const handleMouseDown = (e: React.MouseEvent) => {
        startY.current = e.clientY;
        startValue.current = value;
        document.body.style.cursor = 'ns-resize';
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const deltaY = startY.current - e.clientY;
        const range = max - min;
        const sensitivity = 200; // pixels for full range
        const deltaValue = (deltaY / sensitivity) * range;

        let newValue = startValue.current + deltaValue;
        newValue = Math.max(min, Math.min(max, newValue));

        onChange(newValue);
    };

    const handleMouseUp = () => {
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="relative rounded-full bg-[#1a1a1a] shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(0,0,0,0.8)] border border-[#333]"
                style={{ width: size, height: size }}
                onMouseDown={handleMouseDown}
            >
                {/* Indicator dots around */}
                <div className="absolute inset-0 rounded-full border border-gray-700 opacity-30" style={{ transform: 'scale(1.2)' }}></div>

                {/* The Knob itself */}
                <div
                    className="absolute inset-1 rounded-full bg-gradient-to-br from-[#333] to-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {/* Marker Line */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1/3 bg-orange-500 rounded-full shadow-[0_0_5px_orange]"></div>
                </div>
            </div>

            <div className="text-center">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">{label}</div>
                <div className="bg-[#0a0a0a] text-orange-400 font-mono text-xs px-2 py-1 rounded border border-[#333] min-w-[3rem]">
                    {Math.round(value)}
                </div>
            </div>
        </div>
    );
};

interface ConsoleButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    color?: 'blue' | 'red' | 'green' | 'orange';
    className?: string;
}

export const ConsoleButton: React.FC<ConsoleButtonProps> = ({ active, onClick, children, color = 'blue', className = '' }) => {
    const colorStyles = {
        blue: active ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] border-blue-400' : 'bg-[#222] text-gray-400 border-[#333] hover:bg-[#2a2a2a]',
        red: active ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] border-red-400' : 'bg-[#222] text-gray-400 border-[#333] hover:bg-[#2a2a2a]',
        green: active ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)] border-green-400' : 'bg-[#222] text-gray-400 border-[#333] hover:bg-[#2a2a2a]',
        orange: active ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)] border-orange-400' : 'bg-[#222] text-gray-400 border-[#333] hover:bg-[#2a2a2a]',
    };

    return (
        <button
            onClick={onClick}
            className={`
        px-4 py-3 rounded font-bold text-xs uppercase tracking-wider border-b-4 active:border-b-0 active:translate-y-[4px] transition-all
        ${colorStyles[color]}
        ${className}
      `}
        >
            {children}
        </button>
    );
};

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="w-full border-b border-[#333] pb-1 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#666]">{children}</h3>
    </div>
);
