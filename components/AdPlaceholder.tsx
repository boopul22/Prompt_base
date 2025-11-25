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
    <a
      href="https://otieu.com/4/10233475"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-md hover:bg-muted/70 transition-colors cursor-pointer ${className}`}
      style={{ width, height }}
    >
      <div className="text-center">
        <span className="text-muted-foreground font-medium text-sm uppercase tracking-widest">
          {label}
        </span>
      </div>
    </a>
  );
}
