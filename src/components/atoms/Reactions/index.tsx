import React, { useEffect } from "react";
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
import customFetch from "../../../utils/fetcher";

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
  onRecast?: () => boolean;
  onLike?: () => boolean;
  isLiked: boolean;
};

const Reactions: React.FC<ReactionsProps> = ({
  hash,
  reactions,
  onComment,
  onRecast,
  onLike,
  isLiked: isLikedProp,
}) => {
  const { client_id, user, isAuthenticated } = useNeynarContext();
  const [showPopover, setShowPopover] = React.useState(false);
  const [popoverPosition, setPopoverPosition] = React.useState({ top: 0, left: 0 });
  const [signerValue, setSignerValue] = React.useState<string | null>(null);
  const [isLiked, setIsLiked] = React.useState<boolean>(isLikedProp);
  const [isRecasted, setIsRecasted] = React.useState<boolean>(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const iconRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({
    comment: null,
    recast: null,
    like: null,
  });

  useEffect(() => {
    setIsLiked(reactions.likes.some(like => like.fid === user?.fid));
    setIsRecasted(reactions.recasts.some(recast => recast.fid === user?.fid));
  }, [reactions, user]);

  useEffect(() => {
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

  useEffect(() => {
    if ((signerValue || isAuthenticated) && showPopover) {
      setShowPopover(false);
    }
  }, [signerValue, isAuthenticated, showPopover]);
  const handleAction = async (
    event: React.MouseEvent<SVGSVGElement>,
    actionName: string
  ) => {
    if (signerValue) {
      switch (actionName) {
        case "comment":
          if(onComment){
            onComment()
          } else{
            throw new Error("No comment handler function provided")
          }
          break;
        case "recast":
          if(onRecast){
            setIsRecasted(onRecast());
          } else{
            throw new Error("No recast handler function provided")
          }
          break;
        case "like":
          if(onLike){
            setIsLiked(onLike());
          } else{
            throw new Error("No like handler function provided")
          }
          break;
        default:
          break;
      }
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
            <CommentIcon onClick={(e) => handleAction(e, "comment")} />
          </div>
          <div ref={(el) => (iconRefs.current.recast = el)}>
            <RecastIcon fill={isRecasted ? "green" : undefined} onClick={(e) => handleAction(e, "recast")} />
          </div>
          <div ref={(el) => (iconRefs.current.like = el)}>
            <LikeIcon fill={isLiked ? "red" : undefined} onClick={(e) => handleAction(e, "like")} />
          </div>
        </Box>
      </Box>
    </ReactionWrapper>
  );
};

export default Reactions;