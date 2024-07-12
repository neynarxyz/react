import React, { memo } from "react";
import { styled } from "@pigment-css/react";
import Avatar from "../atoms/Avatar";
import { useLinkifyCast } from "../organisms/NeynarCastCard/hooks/useLinkifyCast";
import Box, { HBox, VBox } from "../atoms/Box";
import { WarpcastPowerBadge } from "../atoms/icons/WarpcastPowerBadge";
import { useRenderEmbeds } from "../organisms/NeynarCastCard/hooks/useRenderEmbeds";
import Reactions from "../atoms/Reactions";
import { ShareToClipboardIcon } from "../atoms/icons/ShareToClipboardIcon";
import { SKELETON_PFP_URL } from "../../constants";

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
  position: "relative"
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
  isEmbed?: boolean;
  allowReactions: boolean;
  onComment?: () => void;
  onRecast?: () => void;
  onLike?: () => void;
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
    likes,
    replies,
    embeds,
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
    const linkifiedText = useLinkifyCast(text, embeds);
    const isSingle = embeds?.length === 1;
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = SKELETON_PFP_URL;
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
              <div style={{ whiteSpace: 'pre-line' }}>{linkifiedText}</div>
            </Box>
            {embeds && embeds.length > 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1px',
                alignItems: 'center',
                padding: 0,
                border: 'none',
                borderRadius: '8px',
                width: '100%',
                margin: isSingle ? '10px 0' : '0',
                marginBottom: '15px',
              }}>
                {useRenderEmbeds(embeds, allowReactions, viewerFid).map((embed, index) => (
                  <div key={index} style={{ width: '100%' }}>
                    {embed}
                  </div>
                ))}
              </div>
            )}
            <div style={{ flexDirection: 'row', justifyContent: allowReactions ? 'space-between' : 'flex-end', display: 'flex', alignItems: 'center', paddingRight: 4 }}>
              {allowReactions && (
                <Reactions
                  hash={hash}
                  onComment={onComment}
                  onRecast={onRecast}
                  onLike={onLike}
                />
              )}
              {username && hash && <ShareToClipboardIcon url={`https://warpcast.com/${username}/${hash.slice(0, 10)}`} />}
            </div>
            <Box spacingVertical="15px" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div>{replies ?? 0} replies</div>
              <div>·</div>
              <div>{likes ?? 0} likes</div>
              {channel &&
                <>
                  <div>·</div>
                  <StyledLink href={`https://warpcast.com/~/channel/${channel.id}`} target="_blank">
                    /{channel.id}
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