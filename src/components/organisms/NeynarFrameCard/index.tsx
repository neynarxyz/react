import React, { useState, useEffect } from "react";
import { useNeynarContext } from "../../../contexts";
import { NEYNAR_API_URL } from "../../../constants";
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
    hash: string;
    frames: NeynarFrame[];
};

export const NeynarFrameCard: React.FC<NeynarFrameCardProps> = ({ hash, frames }) => {
    const { client_id, showToast } = useNeynarContext();
    const [storedUser] = useLocalStorage<INeynarAuthenticatedUser | null>(
        LocalStorageKeys.NEYNAR_AUTHENTICATED_USER,
        null
    );
    const [signerValue, setSignerValue] = useState<string | null>(null);

    useEffect(() => {
        if (storedUser) {
            setSignerValue(storedUser.signer_uuid);
        } else {
            console.warn("No NEYNAR_AUTHENTICATED_USER found in local storage.");
        }
    }, [storedUser]);

    const handleFrameBtnPress = async (btnIndex: number, localFrame: NeynarFrame, setLocalFrame: (frame: NeynarFrame) => void) => {
        if (!signerValue) {
            showToast(ToastType.Error, 'Signer UUID is not available');
            return;
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
                    "cast_hash": hash,
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
                setLocalFrame(json);
            } else {
                showToast(ToastType.Error, `HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            showToast(ToastType.Error, `An error occurred: ${error}`);
        }
    };

    return (
        <FrameCard
            hash={hash}
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