import React, { useState, useEffect, useMemo, useCallback } from "react";
import { styled } from "@pigment-css/react";
import Avatar from "../atoms/Avatar";
import { useLinkifyCast } from "../organisms/NeynarCastCard/hooks/useLinkifyCast";
import Box, { HBox, VBox } from "../atoms/Box";
import { WarpcastPowerBadge } from "../atoms/icons/WarpcastPowerBadge";
import { useRenderEmbeds } from "../organisms/NeynarCastCard/hooks/useRenderEmbeds";
import Reactions from "../atoms/Reactions";
import { ShareToClipboardIcon } from "../atoms/icons/ShareToClipboardIcon";
import { SKELETON_PFP_URL } from "../../constants";
import { NeynarFrameCard, type NeynarFrame } from "../organisms/NeynarFrameCard";

const StyledCastCard = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "608px",
  borderStyle: "solid",
  borderColor: theme.vars.palette.border,
  borderRadius: "15px",
  padding: "30px",
  color: theme.vars.palette.text,
  fontFamily: theme.typography.fonts.base,
  fontSize: theme.typography.fontSizes.medium,
  backgroundColor: theme.vars.palette.background,
  position: "relative",
  "@media (max-width: 600px)": {
    padding: "15px",
    fontSize: theme.typography.fontSizes.small,
    borderRadius: "0px",
  }
}));

const StyledLink = styled.a(({ theme }) => ({
  textDecoration: "none",
  color: theme.vars.palette.textMuted,
}));

const Main = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flex: 1,
}));

const Username = styled.div(({ theme }) => ({
  color: theme.vars.palette.textMuted,
}));

const UsernameTitle = styled.div(({ theme }) => ({
  fontSize: theme.typography.fontSizes.large,
  fontWeight: theme.typography.fontWeights.bold,
  "@media (max-width: 600px)": {
    fontSize: theme.typography.fontSizes.medium,
  }
}));

const ProfileMetaCell = styled.div(({ theme }) => ({
  color: theme.vars.palette.textMuted,
  "> strong": {
    color: theme.vars.palette.text,
  },
  "& + &": {
    marginLeft: "15px",
  },
}));

const Tag = styled.div(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.vars.palette.border,
  borderRadius: "5px",
  padding: "3px 6px",
  marginTop: "3px",
  marginLeft: "5px",
  backgroundColor: "transparent",
  fontSize: theme.typography.fontSizes.small,
  color: theme.vars.palette.textMuted,
  lineHeight: 1,
}));

const LinkifiedText = styled.div(() => ({
  whiteSpace: 'pre-line',
}));

const EmbedsContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  alignItems: 'center',
  padding: 0,
  border: 'none',
  borderRadius: '8px',
  width: '100%',
  marginBottom: '15px'
}));

const RepliesLikesContainer = styled.div(() => ({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
}));

const ReactionsContainer = styled.div(() => ({
  flexDirection: 'row', 
  display: 'flex', 
  alignItems: 'center', 
  paddingRight: 4
}));

const SpaceBetweenContainer = styled.div(() => ({
  flexDirection: 'row', 
  display: 'flex', 
  alignItems: 'center', 
  paddingRight: 4
}));

export type CastCardProps = {
  username: string;
  displayName: string;
  avatarImgUrl: string;
  text: string;
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
  replies: number;
  embeds: any[];
  frames: NeynarFrame[];
  channel?: {
    id: string;
    name: string;
    url: string;
  };
  viewerFid?: number;
  hasPowerBadge: boolean;
  isOwnProfile?: boolean;
  isEmbed?: boolean;
  allowReactions: boolean;
  renderEmbeds: boolean;
  renderFrames: boolean;
  onLikeBtnPress?: () => boolean;
  onRecastBtnPress?: () => boolean;
  onCommentBtnPress?: () => void;
  onFrameBtnPress?: (
    btnIndex: number,
    localFrame: NeynarFrame,
    setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>,
    inputValue?: string
  ) => Promise<NeynarFrame>;
  direct_replies?: CastCardProps[];
  containerStyles?: React.CSSProperties;
  textStyles?: React.CSSProperties;
};

export const CastCard = React.memo(
  ({
    username,
    displayName,
    avatarImgUrl,
    text = '',
    hash,
    reactions,
    replies,
    embeds = [],
    frames = [],
    channel,
    viewerFid,
    hasPowerBadge,
    isEmbed = true,
    allowReactions,
    renderEmbeds,
    renderFrames,
    onLikeBtnPress,
    onRecastBtnPress,
    onCommentBtnPress,
    onFrameBtnPress,
    direct_replies,
    containerStyles,
    textStyles
  }: CastCardProps) => {
    const [likesCount, setLikesCount] = useState<number>(reactions.likes_count);
    const [isLiked, setIsLiked] = useState<boolean>(reactions.likes.some(like => like.fid === viewerFid));
    const linkifiedText = useLinkifyCast(text, embeds);
    const isSingle = embeds?.length === 1;

    const framesUrls = useMemo(() => frames.map(frame => frame.frames_url), [frames]);
    const filteredEmbeds = useMemo(() => embeds.filter(embed => !framesUrls.includes(embed.url)), [embeds, framesUrls]);

    const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = SKELETON_PFP_URL;
    }, []);

    useEffect(() => {
      setIsLiked(reactions.likes.some(like => like.fid === viewerFid));
    }, [reactions.likes, viewerFid]);

    const handleLike = useCallback(() => {
      if (onLikeBtnPress) {
        const likeBtnPressResp = onLikeBtnPress();
        if(likeBtnPressResp){
          setLikesCount(prev => prev + 1);
          setIsLiked(!isLiked);
          return true;
        }
      }
      return false;
    }, [onLikeBtnPress]);

    const renderedEmbeds = useRenderEmbeds(filteredEmbeds, allowReactions, viewerFid);

    return (
      <StyledCastCard style={{ ...containerStyles, borderWidth: isEmbed ? "1px" : "0" }}>
        <HBox>
          <Box spacingRight="10px">
            <Avatar
              src={avatarImgUrl && avatarImgUrl.length > 0 ? avatarImgUrl : SKELETON_PFP_URL}
              onError={handleError}
              loading="lazy"
              alt={`${displayName ?? 'Skeleton'} Avatar`}
            />
          </Box>
          <Main>
            <HBox justifyContent="space-between" flexGrow={1}>
              <VBox>
                <HBox>
                  <strong>{displayName}</strong>
                  {hasPowerBadge && (
                    <Box spacingLeft="5px">
                      <WarpcastPowerBadge />
                    </Box>
                  )}
                </HBox>
                <HBox alignItems="center">
                  <Username>@{username}</Username>
                </HBox>
              </VBox>
            </HBox>

            <Box spacingVertical="15px">
              <LinkifiedText style={textStyles}>{linkifiedText}</LinkifiedText>
            </Box>
            {renderEmbeds && filteredEmbeds && filteredEmbeds.length > 0 ? (
              <EmbedsContainer style={{ margin: isSingle ? '10px 0' : '0' }}>
                {renderedEmbeds.map((embed, index) => (
                  <div key={index} style={{ width: '100%' }}>
                    {embed}
                  </div>
                ))}
              </EmbedsContainer>
            ) : <></>}
            {
              renderFrames && frames && frames.length > 0 ? (
                <EmbedsContainer>
                  {frames.map((frame: NeynarFrame) => (
                    <NeynarFrameCard 
                      key={frame.frames_url} 
                      url={frame.frames_url} 
                      initialFrame={frame} 
                      onFrameBtnPress={onFrameBtnPress!}
                    />
                  ))}
                </EmbedsContainer>
              ) : null
            }
            <ReactionsContainer style={{ justifyContent: allowReactions ? 'space-between' : 'flex-end' }}>
              {allowReactions && (
                <Reactions
                  hash={hash}
                  reactions={reactions}
                  onComment={onCommentBtnPress}
                  onRecast={onRecastBtnPress}
                  onLike={handleLike}
                  isLiked={isLiked}
                />
              )}
              {allowReactions && username && hash && <ShareToClipboardIcon url={`https://warpcast.com/${username}/${hash.slice(0, 10)}`} />}
            </ReactionsContainer>
            <SpaceBetweenContainer style={{  justifyContent: allowReactions ? '' : 'space-between' }}>
              <SpaceBetweenContainer style={{ justifyContent: allowReactions ? '' : 'space-between', gap: 6 }}>
                <div>{replies} replies</div>
                <div>·</div>
                <div>{likesCount} likes</div>
                {channel &&
                  <>
                    <div>·</div>
                    <StyledLink href={`https://warpcast.com/~/channel/${channel.id}`} target="_blank">
                      /{channel.id}
                    </StyledLink>
                  </>
                }
              </SpaceBetweenContainer>
              {!allowReactions && username && hash && <ShareToClipboardIcon url={`https://warpcast.com/${username}/${hash.slice(0, 10)}`} />}
            </SpaceBetweenContainer>
          </Main>
        </HBox>
      </StyledCastCard>
    );
  }
);
