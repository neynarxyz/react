import { useEffect, useState } from "react";
import { styled } from "@pigment-css/react";
import { useNeynarContext } from "../../contexts";
import { NEYNAR_API_URL } from "../../constants";
import customFetch from "../../utils/fetcher";
import { ToastType } from "../atoms/Toast/ToastItem";
import { useLocalStorage } from "../../hooks";
import { INeynarAuthenticatedUser } from "../../types/common";
import { LocalStorageKeys } from "../../hooks/use-local-storage-state";
import ExternalLinkIcon from "../atoms/icons/ExternalLinkIcon";

type NeynarFrame = {
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

type CastFrameBtn = {
    number: number;
    text: string;
    actionType: string;
    target?: string;
    handleOnClick: (btnNumber: number) => void;
}

const FrameButton = styled.button({
    border: "1px solid rgba(0, 0, 0, 0.75)",
    borderRadius: "12px",
    padding: "4px 16px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    '@media (min-width: 768px)': {
        fontSize: "16px",
    },
    cursor: 'pointer'
});

const FrameContainer = styled.div({
    border: "0.5px solid rgba(128, 128, 128, 0.7)",
    margin: "8px 0",
    padding: "16px",
    backgroundColor: "transparent",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});

const ButtonContainer = styled.div({
    margin: "8px 0",
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    justifyContent: "center",
});

const FrameImage = styled.img({
    width: "100%",
    height: "auto",
    borderRadius: "8px",
});

const FrameTitle = styled.div({
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
    margin: "8px 0",
    textAlign: "center",
});

const FrameDomain = styled.div({
    fontSize: "12px",
    color: "#aaa",
    marginTop: "4px",
    textAlign: "right",
    width: "100%",
});

function fetchWithTimeout(url: string, options: RequestInit, timeout: number = 8000): Promise<Response> {
    return Promise.race([
        customFetch(url, options),
        new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
    ]);
}

function CastFrameBtn({ number, text, actionType, target, handleOnClick }: CastFrameBtn) {
    const handleClick = () => {
        if (actionType === "link" && target) {
            window.open(target, "_blank");
        } else {
            handleOnClick(number);
        }
    };

    return (
        <FrameButton onClick={handleClick}>
            {text}
            {(actionType === "link" || actionType === "post_redirect") && <ExternalLinkIcon />}
        </FrameButton>
    )
}

function CastFrame({ hash, frame }: { hash: string, frame: NeynarFrame }) {
    const [localFrame, setLocalFrame] = useState<NeynarFrame>(frame);
    const [signerValue, setSignerValue] = useState<string | null>(null);
    const { client_id, showToast } = useNeynarContext();

    const [storedUser] = useLocalStorage<INeynarAuthenticatedUser | null>(
        LocalStorageKeys.NEYNAR_AUTHENTICATED_USER,
        null
    );

    useEffect(() => {
        if (storedUser) {
            setSignerValue(storedUser.signer_uuid);
        } else {
            console.warn("No NEYNAR_AUTHENTICATED_USER found in local storage.");
        }
    }, [storedUser]);

    const handleFrameBtnPress = async (btnIndex: number) => {
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

    const renderFrameButtons = () => {
        const buttons = [];
        const buttonTags = localFrame.buttons;

        if (!buttonTags) {
            return null;
        }

        for (let i = 0; i < buttonTags.length; i++) {
            buttons.push(
                <CastFrameBtn key={buttonTags[i].index} number={buttonTags[i].index} text={buttonTags[i].title} actionType={buttonTags[i].action_type} target={buttonTags[i].target} handleOnClick={handleFrameBtnPress} />
            );
        }

        return <ButtonContainer>{buttons}</ButtonContainer>;
    };

    const extractDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch (error) {
            return '';
        }
    };

    return (
        <>
            <FrameContainer>
                {localFrame !== null && localFrame.frames_url &&
                <>
                    <a href={localFrame.frames_url} target="_blank" rel="noopener noreferrer">
                        <FrameImage src={localFrame.image} alt={`Frame image for ${localFrame.frames_url}`} />
                    </a>
                    {renderFrameButtons()}
                </>
                }
            </FrameContainer>
            <FrameDomain>{extractDomain(localFrame.frames_url)}</FrameDomain>
        </>
    );
}

export default function CastFrames({ hash, frames }: { hash: string, frames: Array<NeynarFrame> }) {
    const FlexContainer = styled.div({
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    });

    return (
        <FlexContainer>
            {frames.map((frame, index) => {
                return <CastFrame key={`cast-frame-${index}`} hash={hash} frame={frame} />;
            })}
        </FlexContainer>
    );
}