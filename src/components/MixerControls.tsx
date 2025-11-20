import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Draggable, Observer);

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
    const thumbRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const percentage = ((value - min) / (max - min)) * 100;
    const isVertical = orientation === 'vertical';

    useEffect(() => {
        if (!thumbRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const thumb = thumbRef.current;

        // Calculate bounds based on container and thumb dimensions
        const containerRect = container.getBoundingClientRect();
        const thumbSize = isVertical ? 48 : 48; // thumb height/width in pixels
        const trackSize = isVertical ? containerRect.height : containerRect.width;
        const maxOffset = trackSize - thumbSize - 16; // 16px for padding (8px * 2)

        const draggable = Draggable.create(thumb, {
            type: isVertical ? "y" : "x",
            bounds: container,
            onDrag: function () {
                isDragging.current = true;
                const currentPos = isVertical ? this.y : this.x;

                // Convert position to value
                // For vertical: bottom is 0%, top is 100%
                // For horizontal: left is 0%, right is 100%
                let newPercentage;
                if (isVertical) {
                    newPercentage = 100 - ((currentPos + 8) / maxOffset * 100);
                } else {
                    newPercentage = ((currentPos + 8) / maxOffset * 100);
                }

                newPercentage = Math.max(0, Math.min(100, newPercentage));
                const newValue = min + (newPercentage / 100) * (max - min);

                // Snap to step
                const steppedValue = Math.round(newValue / step) * step;
                onChange(Math.max(min, Math.min(max, steppedValue)));
            },
            onDragEnd: function () {
                setTimeout(() => {
                    isDragging.current = false;
                }, 100);
            },
            inertia: true,
        })[0];

        return () => {
            draggable.kill();
        };
    }, [min, max, step, onChange, isVertical]);

    // Update thumb position when value changes externally
    useEffect(() => {
        if (!thumbRef.current || !containerRef.current || isDragging.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const thumbSize = isVertical ? 48 : 48;
        const trackSize = isVertical ? containerRect.height : containerRect.width;
        const maxOffset = trackSize - thumbSize - 16;

        const targetPos = isVertical
            ? (100 - percentage) / 100 * maxOffset - 8
            : percentage / 100 * maxOffset - 8;

        gsap.to(thumbRef.current, {
            [isVertical ? 'y' : 'x']: targetPos,
            duration: 0.1
        });
    }, [value, percentage, isVertical]);

    return (
        <div className={`flex ${isVertical ? 'flex-col' : 'flex-row items-center w-full'} gap-2 group`}>
            <div
                ref={containerRef}
                className={`relative ${isVertical ? `w-12 ${height}` : 'h-12 w-full'} bg-[#1a1a1a] rounded-lg border border-[#333] shadow-inner flex ${isVertical ? 'justify-center' : 'items-center'} p-1`}
            >
                {/* Track markings */}
                <div className={`absolute ${isVertical ? 'inset-y-2 left-0 right-0 flex-col' : 'inset-x-2 top-0 bottom-0 flex-row'} flex justify-between px-3 pointer-events-none opacity-30`}>
                    {[...Array(11)].map((_, i) => (
                        <div key={i} className={`${isVertical ? 'w-full h-px' : 'h-full w-px'} bg-gray-500`}></div>
                    ))}
                </div>

                {/* Track Groove */}
                <div className={`absolute ${isVertical ? 'top-2 bottom-2 w-1' : 'left-2 right-2 h-1'} bg-[#0a0a0a] rounded-full`}></div>

                {/* Custom Thumb Visual */}
                <div
                    ref={thumbRef}
                    className={`absolute ${isVertical ? 'w-8 h-12' : 'h-8 w-12'} bg-gradient-to-b from-[#444] to-[#222] border border-[#555] rounded shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing`}
                    style={{
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                        [isVertical ? 'left' : 'top']: '50%',
                        [isVertical ? 'marginLeft' : 'marginTop']: isVertical ? '-16px' : '-16px',
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
    const knobRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const valueRef = useRef(value);
    const onChangeRef = useRef(onChange);

    const percentage = ((value - min) / (max - min)) * 100;
    const rotation = (percentage / 100) * 270 - 135; // -135deg to +135deg

    // Update refs when values change
    useEffect(() => {
        valueRef.current = value;
        onChangeRef.current = onChange;
    }, [value, onChange]);

    useEffect(() => {
        if (!containerRef.current || !knobRef.current) return;

        const observer = Observer.create({
            target: containerRef.current,
            type: "pointer",
            onPress: () => {
                document.body.style.userSelect = 'none';
            },
            onDrag: (self) => {
                // Use deltaY for vertical drag control
                const deltaY = -self.deltaY; // Negative because drag up should increase
                const range = max - min;
                const sensitivity = 2; // Sensitivity multiplier
                const deltaValue = (deltaY * sensitivity * range) / 200;

                let newValue = valueRef.current + deltaValue;
                newValue = Math.max(min, Math.min(max, newValue));

                onChangeRef.current(newValue);
            },
            onRelease: () => {
                document.body.style.userSelect = '';
            },
        });

        return () => {
            observer.kill();
        };
    }, [min, max]); // Only recreate if min/max changes

    // Update rotation smoothly
    useEffect(() => {
        if (knobRef.current) {
            gsap.to(knobRef.current, {
                rotation,
                duration: 0.1,
                ease: "none"
            });
        }
    }, [rotation]);

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                ref={containerRef}
                className="relative rounded-full bg-[#1a1a1a] shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(0,0,0,0.8)] border border-[#333] cursor-ns-resize select-none"
                style={{ width: size, height: size }}
            >
                {/* Indicator dots around */}
                <div className="absolute inset-0 rounded-full border border-gray-700 opacity-30" style={{ transform: 'scale(1.2)' }}></div>

                {/* The Knob itself */}
                <div
                    ref={knobRef}
                    className="absolute inset-1 rounded-full bg-gradient-to-br from-[#333] to-[#111] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none"
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
