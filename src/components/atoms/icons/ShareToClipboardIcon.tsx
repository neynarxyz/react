import React from 'react';
import ShareIcon from './ShareIcon';

export const ShareToClipboardIcon = ({ url }: { url: string }) => {
    const [copied, setCopied] = React.useState<boolean>(false);

    const handleShareClick = async (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy the text to clipboard:', err);
        }
    };

    return (
        <div>
            {copied ? (
                <svg 
                    style={{ cursor: 'pointer', fill: 'green' }} 
                    width="16" 
                    height="15" 
                    viewBox="0 0 16 15" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M5.99967 12.8136L1.71967 8.53364L0.559673 9.69364L5.99967 15.1336L16.4397 4.69364L15.2797 3.53364L5.99967 12.8136Z" />
                </svg>
            ) : (
                <ShareIcon onClick={handleShareClick} />
            )}
        </div>
    );
};