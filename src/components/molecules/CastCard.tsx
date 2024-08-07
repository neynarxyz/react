import React, { memo, useState, useEffect } from "react";
import { styled } from "@pigment-css/react";
import Avatar from "../atoms/Avatar";
import { useLinkifyCast } from "../organisms/NeynarCastCard/hooks/useLinkifyCast";
import Box, { HBox, VBox } from "../atoms/Box";
import { WarpcastPowerBadge } from "../atoms/icons/WarpcastPowerBadge";
import { useRenderEmbeds } from "../organisms/NeynarCastCard/hooks/useRenderEmbeds";
import Reactions from "../atoms/Reactions";
import { ShareToClipboardIcon } from "../atoms/icons/ShareToClipboardIcon";
import { SKELETON_PFP_URL } from "../../constants";
import CastFrames from "./CastFrames";
import { useNeynarContext } from "../../contexts";

type NeynarFrame = {
    image: string;
    frames_url: string;
    post_url?: string;
    buttons: {
        index: number;
        title: string;
    }[];
};

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
  frames: any[];
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
  onComment?: () => void;
  onRecast?: () => void;
  onLike?: (newVal: boolean) => void;
  direct_replies?: CastCardProps[];
  customStyles?: React.CSSProperties;
};

export const CastCard = memo(
  ({
    username,
    displayName,
    avatarImgUrl,
    text = '',
    hash,
    reactions,
    replies,
    embeds,
    frames,
    channel,
    viewerFid,
    hasPowerBadge,
    isOwnProfile,
    isEmbed = true,
    allowReactions,
    onComment,
    onRecast,
    onLike,
    direct_replies,
    customStyles
  }: CastCardProps) => {
    const [likesCount, setLikesCount] = useState(reactions.likes_count);
    const [isLiked, setIsLiked] = useState(reactions.likes.some(like => like.fid === viewerFid));
    const linkifiedText = useLinkifyCast(text, embeds);
    const isSingle = embeds?.length === 1;

    const framesUrls = frames.map(frame => frame.frames_url);
    const filteredEmbeds = embeds.filter(embed => !framesUrls.includes(embed.url));

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = SKELETON_PFP_URL;
    };

    useEffect(() => {
      setIsLiked(reactions.likes.some(like => like.fid === viewerFid));
    }, [reactions.likes, viewerFid]);

    const handleLike = (newVal: boolean) => {
      setLikesCount(prev => newVal ? prev + 1 : prev - 1);
      setIsLiked(newVal);
      if (onLike) {
        onLike(newVal);
      }
    };

    return (
      <StyledCastCard style={{ ...customStyles, borderWidth: isEmbed ? "1px" : "0" }}>
        <HBox>
          <Box spacingRight="10px">
            <Avatar
              src={avatarImgUrl ?? SKELETON_PFP_URL}
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
              <LinkifiedText>{linkifiedText}</LinkifiedText>
            </Box>
            {filteredEmbeds && filteredEmbeds.length > 0 && (
              <EmbedsContainer style={{ margin: isSingle ? '10px 0' : '0' }}>
                {useRenderEmbeds(filteredEmbeds, allowReactions, viewerFid).map((embed, index) => (
                  <div key={index} style={{ width: '100%' }}>
                    {embed}
                  </div>
                ))}
              </EmbedsContainer>
            )}
            {frames && frames.length > 0 && (
              <EmbedsContainer>
                <CastFrames hash={hash} frames={frames as any} />
              </EmbedsContainer>
            )}
            <ReactionsContainer style={{ justifyContent: allowReactions ? 'space-between' : 'flex-end' }}>
              {allowReactions && (
                <Reactions
                  hash={hash}
                  reactions={reactions}
                  onComment={onComment}
                  onRecast={onRecast}
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
