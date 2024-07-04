import React, { useState } from "react";
import { styled } from "@pigment-css/react";
import Box from "../Box";
import { NeynarAuthButton } from "../../organisms/NeynarAuthButton";
import { LocalStorageKeys } from "../../../hooks/use-local-storage-state";
import { NEYNAR_API_URL } from "../../../constants";
import { useNeynarContext } from "../../../contexts";
import { SIWN_variant } from "../../../enums";
import { CommentIcon } from "../icons/CommentIcon";
import { RecastIcon } from "../icons/RecastIcon";
import { LikeIcon } from "../icons/LikeIcon";

const ReactionWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
}));

const Popover = styled(Box)(({ theme }) => ({
  position: "absolute",
  backgroundColor: theme?.colors?.background || "#fff",
  boxShadow: theme?.shadows?.[2] || "0px 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: theme?.zIndex?.popover || 2000,
  minWidth: 215,
  width: 'auto'
}));

type ReactionsProps = {
  hash: string;
  onComment?: () => void;
  onRecast?: () => void;
  onLike?: () => void;
};

const Reactions: React.FC<ReactionsProps> = ({
  hash,
  onComment,
  onRecast,
  onLike,
}) => {
  const { client_id, isAuthenticated } = useNeynarContext();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [signerValue, setSignerValue] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isRecasted, setIsRecasted] = useState(false);

  React.useEffect(() => {
    const signer = localStorage.getItem(LocalStorageKeys.NEYNAR_AUTHENTICATED_USER);
    if (signer) {
      try {
        setSignerValue(JSON.parse(signer).signer_uuid);
      } catch (e) {
        console.error("Error parsing JSON from local storage:", e);
        setSignerValue(null);
      }
    } else {
      console.warn("No NEYNAR_AUTHENTICATED_USER found in local storage.");
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if ((signerValue || isAuthenticated) && showPopover) {
      setShowPopover(false);
    }
  }, [signerValue, isAuthenticated, showPopover]);

  const postReaction = async (type: string) => {
    if (!signerValue) {
      console.error("signerValue is null, cannot post reaction.");
      return;
    }

    const request = await fetch(
      `${NEYNAR_API_URL}/v2/farcaster/reaction?client_id=${client_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reaction_type: type,
          signer_uuid: signerValue,
          target: hash,
        }),
      }
    );
    const result = await request.json();
    if (!result.success) {
      console.error("Error posting reaction:", result);
      throw new Error("Error posting reaction");
    } else {
      if (type === "like") {
        setIsLiked(!isLiked);
      } else if (type === "recast") {
        setIsRecasted(!isRecasted);
      }
    }
  };

  const handleAction = async (
    event: React.MouseEvent<SVGSVGElement>,
    actionName: string,
    action?: () => void
  ) => {
    if (signerValue) {
      switch (actionName) {
        case "comment":
          break;
        case "recast":
          await postReaction("recast");
          break;
        case "like":
          await postReaction("like");
          break;
        default:
          break;
      }
    }
    if (action && !signerValue) {
      action();
    } else if(actionName !== 'comment') {
      setShowPopover(true);
    }
  
    const target = event.currentTarget;
    if (target) {
      const iconRect = target.getBoundingClientRect();
      setPopoverPosition({
        top: iconRect.bottom,
        left: iconRect.left + iconRect.width / 2,
      });
    }
  };  

  return (
    <ReactionWrapper>
      {showPopover && (
        <Popover>
          <NeynarAuthButton variant={SIWN_variant.NEYNAR} />
        </Popover>
      )}
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box spacingVertical="15px" style={{ display: "flex", gap: "10px" }}>
          <CommentIcon onClick={(e) => handleAction(e, "comment", onComment)} />
          <RecastIcon fill={isRecasted ? "green" : undefined} onClick={(e) => handleAction(e, "recast", onRecast)} />
          <LikeIcon fill={isLiked ? "red" : undefined} onClick={(e) => handleAction(e, "like", onLike)} />
        </Box>
      </Box>
    </ReactionWrapper>
  );
};

export default Reactions;
