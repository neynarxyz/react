import React, { useState } from "react";
import { styled } from "@pigment-css/react";
import ExternalLinkIcon from "../atoms/icons/ExternalLinkIcon";
import { NeynarFrame } from "../organisms/NeynarFrameCard";

export type FrameCardProps = {
    frames: NeynarFrame[];
    onFrameBtnPress: (btnIndex: number, localFrame: NeynarFrame, setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>) => void;
};

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

const FrameDomain = styled.div({
    fontSize: "12px",
    color: "#aaa",
    marginTop: "4px",
    textAlign: "right",
    width: "100%",
});

const FlexContainer = styled.div({
    display: "flex",
    flexDirection: "column",
    gap: "4px",
});

function CastFrameBtn({ number, text, actionType, target, handleOnClick }: any) {
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

function CastFrame({ frame, onFrameBtnPress }: { frame: NeynarFrame, onFrameBtnPress: FrameCardProps['onFrameBtnPress'] }) {
    const [localFrame, setLocalFrame] = useState<NeynarFrame>(frame);

    const renderFrameButtons = () => {
        const buttons = localFrame.buttons.map((btn) => (
            <CastFrameBtn
                key={btn.index}
                number={btn.index}
                text={btn.title}
                actionType={btn.action_type}
                target={btn.target}
                handleOnClick={(btnIndex: number) => onFrameBtnPress(btnIndex, localFrame, setLocalFrame)}
            />
        ));
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
                {localFrame.frames_url && (
                    <>
                        <a href={localFrame.frames_url} target="_blank" rel="noopener noreferrer">
                            <FrameImage src={localFrame.image} alt={`Frame image for ${localFrame.frames_url}`} />
                        </a>
                        {renderFrameButtons()}
                    </>
                )}
            </FrameContainer>
            <FrameDomain>{extractDomain(localFrame.frames_url)}</FrameDomain>
        </>
    );
}

export const FrameCard: React.FC<FrameCardProps> = ({ frames, onFrameBtnPress }) => {
    return (
        <FlexContainer>
            {frames.map((frame: NeynarFrame, index: number) => (
                <CastFrame key={`cast-frame-${index}`} frame={frame} onFrameBtnPress={onFrameBtnPress} />
            ))}
        </FlexContainer>
    );
};

export default FrameCard;