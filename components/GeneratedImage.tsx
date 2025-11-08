import React from 'react';
import type { AspectRatio } from '../types';

interface GeneratedImageProps {
    src?: string;
    aspectRatio: AspectRatio;
    isLoading: boolean;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const GeneratedImage: React.FC<GeneratedImageProps> = ({ src, aspectRatio, isLoading }) => {
    
    const aspectRatioClass = {
        '1:1': 'aspect-square',
        '3:4': 'aspect-[3/4]',
        '4:3': 'aspect-[4/3]',
        '9:16': 'aspect-[9/16]',
        '16:9': 'aspect-[16/9]',
    }[aspectRatio] || 'aspect-square';

    const handleDownload = () => {
        if (!src) return;
        const link = document.createElement('a');
        link.href = src;
        link.download = `shoshastylish-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className={`w-full bg-gray-300 rounded-lg animate-pulse-fast ${aspectRatioClass}`}></div>
        );
    }

    return (
        <div className={`relative group w-full rounded-lg overflow-hidden shadow-md ${aspectRatioClass}`}>
            <img src={src} alt="Generated fashion photoshoot" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                    onClick={handleDownload}
                    className="flex items-center bg-white/20 backdrop-blur-md text-white font-semibold py-2 px-4 rounded-full hover:bg-white/30 transition-colors"
                >
                    <DownloadIcon />
                    Download
                </button>
            </div>
        </div>
    );
};

export default GeneratedImage;