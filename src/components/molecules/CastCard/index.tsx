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
              <div style={{whiteSpace: 'pre-line'}}>{linkifiedText}</div>
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
            <div style={{ flexDirection: 'row', justifyContent: allowReactions ? 'space-between' : 'flex-end', display: 'flex', alignItems: 'center', paddingRight: 4 }}>
              {allowReactions && (
                <Reactions
                  hash={hash}
                  onComment={onComment}
                  onRecast={onRecast}
                  onLike={onLike}
                />
              )}
              <svg style={{cursor: 'pointer' }} width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => navigator.clipboard.writeText(`https://warpcast.com/${username}/${hash.slice(0, 10)}`)}>
                <path d="M15.2003 7.49063C14.7504 7.49063 14.4504 7.79057 14.4504 8.24048V12.7396C14.4504 13.1895 14.1505 13.4894 13.7006 13.4894H3.20268C2.75277 13.4894 2.45283 13.1895 2.45283 12.7396V8.24048C2.45283 7.79057 2.15289 7.49063 1.70298 7.49063C1.25307 7.49063 0.953125 7.79057 0.953125 8.24048V12.7396C0.953125 14.0143 1.92793 14.9891 3.20268 14.9891H13.7006C14.9753 14.9891 15.9501 14.0143 15.9501 12.7396V8.24048C15.9501 7.79057 15.6502 7.49063 15.2003 7.49063ZM5.97713 4.26627L7.70178 2.54161V9.74018C7.70178 10.1901 8.00172 10.49 8.45163 10.49C8.90155 10.49 9.20149 10.1901 9.20149 9.74018V2.54161L10.9261 4.26627C11.2261 4.56621 11.676 4.56621 11.9759 4.26627C12.2759 3.96633 12.2759 3.51642 11.9759 3.21648L8.97653 0.217073C8.90155 0.142088 8.82656 0.0671031 8.75157 0.0671031C8.6016 -0.00788202 8.37665 -0.00788202 8.15169 0.0671031C8.07671 0.0671031 8.00172 0.142088 7.92674 0.217073L4.92734 3.21648C4.62739 3.51642 4.62739 3.96633 4.92734 4.26627C5.22728 4.56621 5.67719 4.56621 5.97713 4.26627Z" fill="#A0A3AD"/>
              </svg>
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