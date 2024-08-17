import React, { useState } from "react";
import { styled } from "@pigment-css/react";
import ExternalLinkIcon from "../atoms/icons/ExternalLinkIcon";
import { NeynarFrame } from "../organisms/NeynarFrameCard";
import { LightningIcon } from "../atoms/icons/LightningIcon";

export type FrameCardProps = {
  frame: NeynarFrame | null;
  onFrameBtnPress: (
    btnIndex: number,
    localFrame: NeynarFrame,
    setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>,
    inputValue?: string
  ) => void;
};

const FrameButton = styled.button({
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "8px",
  padding: "8px 16px",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  cursor: 'pointer',
  backgroundColor: "#1E1E1E",
  color: "white",
  flex: "1 1 0",
  minWidth: "0",
  '&:hover': {
    backgroundColor: "#2E2E2E",
  }
});

const FrameContainer = styled.div({
  border: "1px solid rgba(255, 255, 255, 0.1)",
  margin: "8px 0",
  backgroundColor: "#121212",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "right",
  width: "100%",
  maxWidth: "400px",
});

const ButtonContainer = styled.div({
  margin: "8px 0",
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  width: "100%",
});

const FrameImage = styled.img({
  width: "100%",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
});

const FrameDomain = styled.div({
  fontSize: "12px",
  color: "#888",
  marginTop: "auto",
  width: "100%",
  padding: "4px 0"
});

const FlexContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  width: "100%",
});

const InputField = styled.input({
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "8px",
  padding: "8px",
  marginTop: "8px",
  width: "100%",
  fontSize: "14px",
  backgroundColor: "#1E1E1E",
  color: "white",
});

function CastFrameBtn({ number, text, actionType, target, frameUrl, handleOnClick }: any) {
  return (
    <FrameButton onClick={() => handleOnClick(number)}>
      {text}
      {(actionType === "link" || actionType === "post_redirect" || actionType === "mint") && <ExternalLinkIcon />}
      {actionType === "tx" && <LightningIcon />}
    </FrameButton>
  )
}

function CastFrame({ frame, onFrameBtnPress }: { frame: NeynarFrame, onFrameBtnPress: FrameCardProps['onFrameBtnPress'] }) {
  const [localFrame, setLocalFrame] = useState<NeynarFrame>(frame);
  const [inputValue, setInputValue] = useState<string>("");

  const renderFrameButtons = () => {
    const buttons = localFrame.buttons.map((btn) => (
      <CastFrameBtn
        key={btn.index}
        number={btn.index}
        text={btn.title}
        actionType={btn.action_type}
        target={btn.target}
        frameUrl={frame.frames_url}
        handleOnClick={(btnIndex: number) => onFrameBtnPress(btnIndex, localFrame, setLocalFrame, inputValue)}
      />
    ));
    return <ButtonContainer>{buttons}</ButtonContainer>;
  };

  const handleSetInputValue = (newValue: string) => {
    setInputValue(newValue);
  }

  const extractDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (error) {
      return '';
    }
  };

  const getImageStyle = () => {
    switch (localFrame.image_aspect_ratio) {
      case "1:1":
        return { aspectRatio: "1 / 1" };
      case "1.91:1":
        return { aspectRatio: "1.91 / 1" };
      default:
        return {};
    }
  };

  return (
    <>
      <FrameContainer>
        {localFrame.frames_url && (
          <>
            <a href={localFrame.frames_url} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
              <FrameImage src={localFrame.image} alt={`Frame image for ${localFrame.frames_url}`} style={getImageStyle()} />
            </a>
            {localFrame.input?.text && (
              <InputField
                type="text"
                placeholder={localFrame.input.text}
                value={inputValue}
                onChange={(e) => handleSetInputValue(e.target.value)}
              />
            )}
            {renderFrameButtons()}
          </>
        )}
      </FrameContainer>
      {localFrame.frames_url && <FrameDomain>{extractDomain(localFrame.frames_url)}</FrameDomain>}
    </>
  );
}

export const FrameCard: React.FC<FrameCardProps> = ({ frame, onFrameBtnPress }) => {
  return (
    <FlexContainer>
      {frame ? 
        <CastFrame frame={frame} onFrameBtnPress={onFrameBtnPress} />
      : <></>}
    </FlexContainer>
  );
};

export default FrameCard;