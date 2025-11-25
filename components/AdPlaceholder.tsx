import React from 'react';

interface AdPlaceholderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  label?: string;
}

export function AdPlaceholder({
  width = '100%',
  height = '250px',
  className = '',
  label = 'Ad Space'
}: AdPlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-md ${className}`}
      style={{ width, height }}
    >
      <iframe
        src="https://otieu.com/4/10233475"
        title={label}
        width="100%"
        height="100%"
        className="absolute inset-0 border-0"
        sandbox="allow-scripts allow-popups allow-forms"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <span className="text-muted-foreground font-medium text-sm uppercase tracking-widest">
          {label}
        </span>
      </div>
    </div>
  );
}
