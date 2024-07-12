import React from "react";
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
import XIcon from "../icons/XIcon";

const ReactionWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
})) as typeof Box;

const Popover = styled(Box)(({ theme }) => ({
  position: "absolute",
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme?.colors?.background || "#fff",
  padding: '5px 8px',
  boxShadow: theme?.shadows?.[2] || "0px 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: theme?.zIndex?.popover || 2000,
  borderRadius: 4,
  minWidth: '245px',
  width: 'auto',
  maxWidth: '90vw',
})) as typeof Box;

const PopoverContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
}) as typeof Box;

const CloseButtonWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '8px',
}) as typeof Box;

type ReactionsProps = {
  hash: string;
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: {
      fid: number;
      fname: string;
    }[];
    recasts: {
      fid: number;
      fname: string;
    }[];
  };
  onComment?: () => void;
  onRecast?: () => void;
  onLike?: () => void;
};

const Reactions: React.FC<ReactionsProps> = ({
  hash,
  reactions,
  onComment,
  onRecast,
  onLike,
}) => {
  const { client_id, user, isAuthenticated } = useNeynarContext();
  const [showPopover, setShowPopover] = React.useState(false);
  const [popoverPosition, setPopoverPosition] = React.useState({ top: 0, left: 0 });
  const [signerValue, setSignerValue] = React.useState<string | null>(null);
  const [isLiked, setIsLiked] = React.useState<boolean>(false);
  const [isRecasted, setIsRecasted] = React.useState<boolean>(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const iconRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({
    comment: null,
    recast: null,
    like: null,
  });

  React.useEffect(() => {
    if(reactions.likes.find(like => like.fid === user?.fid)) {
      setIsLiked(true);
    };
    if(reactions.recasts.find(recast => recast.fid === user?.fid)) {
      setIsRecasted(true);
    };
  }, [reactions])

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
    } else if (actionName !== 'comment') {
      setShowPopover(true);
    }
  
    const iconElement = iconRefs.current[actionName];
    if (iconElement) {
      const iconRect = iconElement.getBoundingClientRect();
      const popoverElement = popoverRef.current;
      if (popoverElement) {
        const popoverRect = popoverElement.getBoundingClientRect();
        setPopoverPosition({
          top: iconRect.top - popoverRect.height - 10,
          left: iconRect.left + (iconRect.width / 2) - (popoverRect.width / 2),
        });
      }
    }
  };  

  return (
    <ReactionWrapper>
      {showPopover && (
        <Popover ref={popoverRef} style={{ top: popoverPosition.top, left: popoverPosition.left }}>
          <PopoverContent>
            <NeynarAuthButton variant={SIWN_variant.NEYNAR} />
          </PopoverContent>
          <CloseButtonWrapper>
            <XIcon onClick={() => setShowPopover(false)} size={16} />
          </CloseButtonWrapper>
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
          <div ref={(el) => (iconRefs.current.comment = el)}>
            <CommentIcon onClick={(e) => handleAction(e, "comment", onComment)} />
          </div>
          <div ref={(el) => (iconRefs.current.recast = el)}>
            <RecastIcon fill={isRecasted ? "green" : undefined} onClick={(e) => handleAction(e, "recast", onRecast)} />
          </div>
          <div ref={(el) => (iconRefs.current.like = el)}>
            <LikeIcon fill={isLiked ? "red" : undefined} onClick={(e) => handleAction(e, "like", onLike)} />
          </div>
        </Box>
      </Box>
    </ReactionWrapper>
  );
};

export default Reactions;