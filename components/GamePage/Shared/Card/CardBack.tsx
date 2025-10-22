import React, { useState } from 'react';
import { Box, Image, ImageProps } from '@chakra-ui/react';

export const CardBack = (props: ImageProps) => {
    // Default to image; fall back to inline SVG only if the image fails to load
    const [useSvg, setUseSvg] = useState(false);

    if (!useSvg) {
        return (
            <Image
                src="/Cardback.webp"
                alt="Card Back"
                onError={() => {
                    // If the webp fails, immediately use the inline SVG fallback
                    setUseSvg(true);
                }}
                {...props}
                userSelect="none"
                draggable={false}
            />
        );
    }

    // Inline SVG fallback approximating the cardback
    // Use a 5:7 aspect ratio (300x420) to better match typical card dimensions
    return (
        <Box as="svg" viewBox="0 0 300 420" width="100%" height="100%" pointerEvents="none">
            <defs>
                {/* Repeating diamond tile pattern */}
                <pattern id="cb_tile" width="28" height="28" patternUnits="userSpaceOnUse">
                    <rect width="28" height="28" fill="none" />
                    {/* Large diamond */}
                    <path d="M14 2 L26 14 L14 26 L2 14 Z" fill="#3b3e43" opacity="0.35"/>
                    {/* Small inner diamond */}
                    <path d="M14 8 L20 14 L14 20 L8 14 Z" fill="#4a4f55" opacity="0.35"/>
                </pattern>
                {/* Soft vertical vignette to add depth */}
                <linearGradient id="cb_vignette" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05"/>
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.18"/>
                </linearGradient>
            </defs>
            {/* Outer white rim */}
            <rect x="3" y="3" rx="24" ry="24" width="294" height="414" fill="#ffffff"/>
            {/* Dark inner panel base */}
            <rect x="13" y="13" rx="20" ry="20" width="274" height="394" fill="#2f3237"/>
            {/* Pattern overlay */}
            <rect x="13" y="13" rx="20" ry="20" width="274" height="394" fill="url(#cb_tile)"/>
            {/* Gentle vignette */}
            <rect x="13" y="13" rx="20" ry="20" width="274" height="394" fill="url(#cb_vignette)"/>
            {/* Soft inner stroke to mimic bevel */}
            <rect x="14" y="14" rx="19" ry="19" width="272" height="392" fill="none" stroke="#44474d" strokeWidth="2" opacity="0.75"/>
        </Box>
    );
};

export default CardBack;
