import React from 'react';
import { AdPlaceholder } from './AdPlaceholder';

export function AdCard() {
    return (
        <article className="brutalist-border bg-card p-4 md:p-6 brutalist-shadow h-full flex flex-col justify-center items-center min-h-[300px]">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <span className="text-muted-foreground font-bold text-sm tracking-widest">SPONSORED</span>
                <AdPlaceholder height="200px" label="Ad Space" className="w-full" />
                <a
                    href="https://otieu.com/4/10233475"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground text-center hover:text-foreground transition-colors"
                >
                    Support us by checking out our sponsors
                </a>
            </div>
        </article>
    );
}
