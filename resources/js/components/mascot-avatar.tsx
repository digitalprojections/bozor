import React from 'react';
import { AvatarConfig } from '../types/mascot-avatar';

export const MascotAvatar: React.FC<AvatarConfig> = ({
    characterType = 'blob',
    bodyColor,
    eyeType,
    mouthType,
    accessoryType,
    accessoryColor,
    skinTone,
    size = 200,
}) => {
    const viewBoxSize = 200;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
        >
            {/* Base Character Shapes */}
            {characterType === 'blob' && (
                <path
                    d="M40 100C40 60 60 40 100 40C140 40 160 60 160 100C160 140 140 170 100 170C60 170 40 140 40 100Z"
                    fill={bodyColor}
                />
            )}

            {characterType === 'vehicle' && (
                <g>
                    {/* Car Body */}
                    <path d="M30 130C30 110 50 90 100 90C150 90 170 110 170 130L170 160C170 165 165 170 160 170L40 170C35 170 30 165 30 160Z" fill={bodyColor} />
                    {/* Car Top */}
                    <path d="M50 90C50 60 70 40 100 40C130 40 150 60 150 90Z" fill={bodyColor} opacity="0.8" />
                    {/* Wheels */}
                    <circle cx="60" cy="170" r="15" fill="#333" />
                    <circle cx="140" cy="170" r="15" fill="#333" />
                    <circle cx="60" cy="170" r="7" fill="#666" />
                    <circle cx="140" cy="170" r="7" fill="#666" />
                </g>
            )}

            {characterType === 'alien' && (
                <g>
                    {/* Alien Head */}
                    <path d="M50 100C50 60 70 30 100 30C130 30 150 60 150 100C150 140 130 170 100 170C70 170 50 140 50 100Z" fill={bodyColor} />
                    {/* Antennae */}
                    <line x1="70" y1="40" x2="50" y2="10" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
                    <circle cx="50" cy="10" r="8" fill={bodyColor} />
                    <line x1="130" y1="40" x2="150" y2="10" stroke={bodyColor} strokeWidth="6" strokeLinecap="round" />
                    <circle cx="150" cy="10" r="8" fill={bodyColor} />
                </g>
            )}

            {characterType === 'salesman' && (
                <g>
                    {/* Head */}
                    <path d="M60 100C60 70 70 50 100 50C130 50 140 70 140 100C140 130 130 150 100 150C70 150 60 130 60 100Z" fill={skinTone} />
                    {/* Suit/Torso */}
                    <path d="M40 150C40 140 60 130 100 130C140 130 160 140 160 150L160 190L40 190Z" fill={bodyColor} />
                    {/* Shirt/Tie */}
                    <path d="M100 130L85 150L100 170L115 150Z" fill="white" />
                    <path d="M100 150L95 160L100 180L105 160Z" fill="#D32F2F" />
                </g>
            )}

            {/* Face Area Overlay (for blob/alien) */}
            {(characterType === 'blob' || characterType === 'alien') && (
                <circle cx="100" cy="110" r="50" fill={skinTone} opacity="0.3" />
            )}

            {/* Eyes - Positioned slightly differently for vehicle */}
            <g transform={characterType === 'vehicle' ? "translate(70, 115)" : "translate(70, 95)"}>
                {eyeType === 'round' && (
                    <>
                        <circle cx="0" cy="0" r="8" fill="#1A1A1A" />
                        <circle cx="3" cy="-3" r="2.5" fill="white" />
                        <circle cx="60" cy="0" r="8" fill="#1A1A1A" />
                        <circle cx="63" cy="-3" r="2.5" fill="white" />
                    </>
                )}
                {eyeType === 'oval' && (
                    <>
                        <ellipse cx="0" cy="0" rx="6" ry="10" fill="#1A1A1A" />
                        <circle cx="2" cy="-4" r="2" fill="white" />
                        <ellipse cx="60" cy="0" rx="6" ry="10" fill="#1A1A1A" />
                        <circle cx="62" cy="-4" r="2" fill="white" />
                    </>
                )}
                {eyeType === 'happy' && (
                    <>
                        <path d="M-10 5Q0 -5 10 5" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" fill="none" />
                        <path d="M50 5Q60 -5 70 5" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" fill="none" />
                    </>
                )}
                {eyeType === 'squint' && (
                    <>
                        <line x1="-8" y1="0" x2="8" y2="0" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" />
                        <line x1="52" y1="0" x2="68" y2="0" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" />
                    </>
                )}
            </g>

            {/* Mouth */}
            <g transform="translate(100, 135)">
                {mouthType === 'smile' && (
                    <path d="M-15 0Q0 15 15 0" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />
                )}
                {mouthType === 'laugh' && (
                    <path d="M-15 0Q0 20 15 0Z" fill="#1A1A1A" />
                )}
                {mouthType === 'neutral' && (
                    <line x1="-10" y1="0" x2="10" y2="0" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
                )}
                {mouthType === 'surprised' && (
                    <circle cx="0" cy="5" r="8" fill="#1A1A1A" />
                )}
            </g>

            {/* Accessories */}
            {accessoryType === 'hat' && (
                <g transform="translate(100, 45)">
                    <path d="M-40 0L40 0L30 -30L-30 -30Z" fill={accessoryColor} />
                    <rect x="-50" y="0" width="100" height="5" rx="2" fill={accessoryColor} />
                </g>
            )}
            {accessoryType === 'glasses' && (
                <g transform="translate(100, 95)">
                    <circle cx="-30" cy="0" r="15" stroke="#1A1A1A" strokeWidth="3" fill="none" />
                    <circle cx="30" cy="0" r="15" stroke="#1A1A1A" strokeWidth="3" fill="none" />
                    <line x1="-15" y1="0" x2="15" y2="0" stroke="#1A1A1A" strokeWidth="3" />
                    <line x1="-45" y1="0" x2="-60" y2="-5" stroke="#1A1A1A" strokeWidth="3" />
                    <line x1="45" y1="0" x2="60" y2="-5" stroke="#1A1A1A" strokeWidth="3" />
                </g>
            )}
            {accessoryType === 'bowtie' && (
                <g transform="translate(100, 165)">
                    <path d="M-15 -10L15 10L15 -10L-15 10Z" fill={accessoryColor} stroke="#1A1A1A" strokeWidth="1" />
                    <circle cx="0" cy="0" r="5" fill={accessoryColor} stroke="#1A1A1A" strokeWidth="1" />
                </g>
            )}
        </svg>
    );
};
