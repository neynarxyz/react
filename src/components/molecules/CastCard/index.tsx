import React, { memo } from "react";
import { styled } from "@pigment-css/react";

import Avatar from "../../atoms/Avatar";
import { useLinkifyBio } from "../../organisms/NeynarProfileCard/hooks/useLinkifyBio";
import Box, { HBox, VBox } from "../../atoms/Box";
import { WarpcastPowerBadge } from "../../atoms/icons/WarpcastPowerBadge";
import { useRenderEmbeds } from "../../organisms/NeynarCastCard/hooks/useRenderEmbeds";
import Reactions from "./Reactions";

const StyledCastCard = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "608px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.vars.palette.border,
  borderRadius: "15px",
  padding: "30px",
  color: theme.vars.palette.text,
  fontFamily: theme.typography.fonts.base,
  fontSize: theme.typography.fontSizes.medium,
  backgroundColor: theme.vars.palette.background,
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

export type CastCardProps = {
  username: string;
  displayName: string;
  avatarImgUrl: string;
  text: string;
  hash: string;
  likes: number;
  replies: number;
  embeds: any[];
  channel?: {
    id: string;
    name: string;
    url: string;
  };
  viewerFid?: number;
  hasPowerBadge: boolean;
  isOwnProfile?: boolean;
  allowReactions: boolean;
  onComment?: () => void;
  onRecast?: () => void;
  onLike?: () => void;
};

export const CastCard = memo(
  ({
    username,
    displayName,
    avatarImgUrl,
    text,
    hash,
    likes,
    replies,
    embeds,
    channel,
    viewerFid,
    hasPowerBadge,
    isOwnProfile,
    allowReactions,
    onComment,
    onRecast,
    onLike,
  }: CastCardProps) => {
    const linkifiedText = useLinkifyBio(text);
    const isSingle = embeds?.length === 1;

    return (
      <StyledCastCard>
        <HBox>
          <Box spacingRight="10px">
            <Avatar
              src={avatarImgUrl}
              loading="lazy"
              alt={`${displayName} Avatar`}
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
              <div>{linkifiedText}</div>
            </Box>
            {embeds && embeds.length > 0 && (
              <div style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                padding: isSingle ? '0' : '10px',
                border: 'none',
                borderRadius: '8px',
                width: '100%',
                margin: isSingle ? '10px 0' : '0',
              }}>
                {useRenderEmbeds(embeds, allowReactions, viewerFid).map((embed, index) => (
                  <div key={index}>
                    {embed}
                  </div>
                ))}
              </div>
            )}
            {allowReactions && (
              <Reactions
                hash={hash}
                onComment={onComment}
                onRecast={onRecast}
                onLike={onLike}
              />
            )}
            <Box spacingVertical="15px" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div>{replies ?? 0} replies</div>
              <div>·</div>
              <div>{likes ?? 0} likes</div>
              {channel && 
                <>
                  <div>·</div>
                  <StyledLink href={`https://warpcast.com/~/channel/${channel.id}`} target="_blank">
                    /{channel.name.toLowerCase()}
                  </StyledLink>
                </>
              }
            </Box>
          </Main>
        </HBox>
      </StyledCastCard>
    );
  }
);