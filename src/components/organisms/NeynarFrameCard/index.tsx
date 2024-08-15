import React, { useState, useEffect } from "react";
import { useNeynarContext } from "../../../contexts";
import { METADATA_PROXY_URL, NEYNAR_API_URL } from "../../../constants";
import customFetch from "../../../utils/fetcher";
import FrameCard from "../../molecules/FrameCard";
import { ToastType } from "../../atoms/Toast/ToastItem";
import { useLocalStorage } from "../../../hooks";
import { INeynarAuthenticatedUser } from "../../../types/common";
import { LocalStorageKeys } from "../../../hooks/use-local-storage-state";

export type NeynarFrame = {
    version: string;
    title: string;
    image: string;
    buttons: {
        index: number;
        title: string;
        action_type: string;
        target?: string;
        post_url?: string;
    }[];
    input: object;
    state: object;
    frames_url: string;
};

export type NeynarFrameCardProps = {
    url: string;
    onFrameBtnPress?: (btnIndex: number, localFrame: NeynarFrame) => Promise<NeynarFrame>;
    initialFrame?: NeynarFrame;
};

export const NeynarFrameCard: React.FC<NeynarFrameCardProps> = ({ url, onFrameBtnPress, initialFrame }) => {
    const { client_id, showToast } = useNeynarContext();
    const [storedUser] = useLocalStorage<INeynarAuthenticatedUser | null>(
        LocalStorageKeys.NEYNAR_AUTHENTICATED_USER,
        null
    );
    const [signerValue, setSignerValue] = useState<string | null>(null);
    const [frames, setFrames] = useState<NeynarFrame[]>(initialFrame ? [initialFrame] : []);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (storedUser) {
            setSignerValue(storedUser.signer_uuid);
        } else {
            console.warn("No NEYNAR_AUTHENTICATED_USER found in local storage.");
        }
    }, [storedUser]);

    useEffect(() => {
        if (!initialFrame) {
            const fetchMetadata = async () => {
                try {
                    // note: `METADATA_PROXY_URL` is a public(non-Neynar) proxy to avoid CORS issues when retrieving opengraph metadata. Feel free to substitute with your own proxy if you'd rather.
                    const response = await fetchWithTimeout(`${METADATA_PROXY_URL}?url=${encodeURIComponent(url)}`, { method: "GET" });
                    
                    if (response.ok) {
                        const metadata = await response.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(metadata, "text/html");

                        const version = doc.querySelector('meta[name="fc:frame"]')?.getAttribute("content") || "vNext";
                        const title = doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || "Untitled";
                        const image = doc.querySelector('meta[name="fc:frame:image"]')?.getAttribute("content") ||
                            doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
                        const state = JSON.parse(doc.querySelector('meta[name="fc:frame:state"]')?.getAttribute("content") || "{}");
                        const input = JSON.parse(doc.querySelector('meta[name="fc:frame:input:text"]')?.getAttribute("content") || "{}");
                        const frames_url = url;

                        const buttons = [];
                        for (let idx = 1; idx <= 4; idx++) {
                            const title = doc.querySelector(`meta[name="fc:frame:button:${idx}"]`)?.getAttribute("content");
                            if (title) {
                                buttons.push({
                                    index: idx,
                                    title: title,
                                    action_type: doc.querySelector(`meta[name="fc:frame:button:${idx}:action"]`)?.getAttribute("content") || "post",
                                    target: doc.querySelector(`meta[name="fc:frame:button:${idx}:target"]`)?.getAttribute("content") || undefined,
                                    post_url: doc.querySelector(`meta[name="fc:frame:button:${idx}:post_url"]`)?.getAttribute("content") || undefined
                                });
                            }
                        }

                        const frame: NeynarFrame = { version, title, image, buttons, input, state, frames_url };
                        setFrames([frame]);
                        setError(null);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } catch (error) {
                    console.error(`An error occurred: ${error}`);
                    setError(`Failed to fetch: ${(error as Error).message}`);
                }
            };

            fetchMetadata();
        }
    }, [url, showToast, initialFrame]);

    const defaultFrameBtnPress = async (btnIndex: number, localFrame: NeynarFrame): Promise<NeynarFrame> => {
        if (!signerValue) {
            showToast(ToastType.Error, 'Signer UUID is not available');
            throw new Error('Signer UUID is not available');
        }

        const button = localFrame.buttons.find(btn => btn.index === btnIndex);
        const postUrl = button?.post_url;

        try {
            const response = await fetchWithTimeout(`${NEYNAR_API_URL}/v2/farcaster/frame/action?client_id=${client_id}`, {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    "signer_uuid": signerValue,
                    "action": {
                        "button": {
                            "index": btnIndex
                        },
                        "frames_url": localFrame.frames_url,
                        "post_url": postUrl ? postUrl : localFrame.frames_url
                    }
                })
            }) as Response;
            if (response.ok) {
                const json = await response.json() as NeynarFrame;
                return json;
            } else {
                showToast(ToastType.Error, `HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            showToast(ToastType.Error, `An error occurred while processing the button press: ${error}`);
            throw error;
        }
    };

    const handleFrameBtnPress = async (btnIndex: number, localFrame: NeynarFrame, setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>) => {
        try {
            const updatedFrame = await (onFrameBtnPress ? onFrameBtnPress(btnIndex, localFrame) : defaultFrameBtnPress(btnIndex, localFrame));
            setLocalFrame(updatedFrame);
        } catch (error) {
            showToast(ToastType.Error, `An error occurred while processing the button press: ${error}`);
        }
    };

    if (error) {
        return (
            <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '5px' }}>
                {error}
            </div>
        );
    }

    return (
        <FrameCard
            frames={frames}
            onFrameBtnPress={handleFrameBtnPress}
        />
    );
};

function fetchWithTimeout(url: string, options: RequestInit, timeout: number = 8000): Promise<Response> {
    return Promise.race([
        customFetch(url, options),
        new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
    ]);
}

export default NeynarFrameCard;