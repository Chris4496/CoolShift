import Image from "next/image";

// Source art is 751×1024 (transparent PNG)
const RATIO = 751 / 1024;

export function Mascot({
  height = 64,
  float = false,
  className = "",
  priority = false,
}: {
  height?: number;
  float?: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={height > 80 ? "/mascot.png" : "/mascot-sm.png"}
      alt="Cool Shift mascot"
      width={Math.round(height * RATIO)}
      height={height}
      priority={priority}
      className={`select-none drop-shadow-sm ${float ? "mascot-float" : ""} ${className}`}
      draggable={false}
    />
  );
}

// Circular avatar used next to chatbot messages
export function MascotAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-end justify-center overflow-hidden rounded-full bg-clp-sky"
      style={{ width: size, height: size }}
    >
      <Mascot height={Math.round(size * 1.1)} className="translate-y-[6%]" />
    </div>
  );
}
