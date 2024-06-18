import React from "react";
import { styled } from "@pigment-css/react";
import Box, { HBox, VBox } from "../atoms/Box";
import Avatar from "../atoms/Avatar";
import { Recast } from "../atoms/icons/Recast";
import { Like } from "../atoms/icons/Like";
import { Reply } from "../atoms/icons/Reply";
import { Save } from "../atoms/icons/Save";
import { Share } from "../atoms/icons/Share";
import { WarpcastPowerBadge } from "../atoms/icons/WarpcastPowerBadge";

const CastContainer = styled.div(({ theme }) => ({
  border: `1px solid ${theme.vars.palette.border}`,
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
  backgroundColor: theme.vars.palette.background,
  color: theme.vars.palette.text,
  maxWidth: "600px",
}));

const CastHeader = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
}));

const CastText = styled.div(({ theme }) => ({
  fontSize: "15px",
  lineHeight: "1.5",
  marginBottom: "8px",
  whiteSpace: "pre-wrap",
}));

const CastImage = styled.img(({ theme }) => ({
  maxWidth: "100%",
  borderRadius: "8px",
  marginBottom: "8px",
}));

const CastLink = styled.a(({ theme }) => ({
  color: theme.vars.palette.link,
  textDecoration: "none",
}));

const Username = styled.div(({ theme }) => ({
  color: theme.vars.palette.textMuted,
}));

const IconContainer = styled(HBox)({
  flexDirection: "row",
  "& > *:not(:last-child)": {
    marginRight: "16px",
  },
});

const Main = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flex: 1,
}));

export interface CastProps {
  object: string;
  hash: string;
  thread_hash: string;
  parent_hash: string | null;
  parent_url: string | null;
  root_parent_url: string | null;
  parent_author: {
    fid: number | null;
  };
  author: {
    object: string;
    fid: number;
    custody_address: string;
    username: string;
    display_name: string;
    pfp_url: string;
    profile: {
      bio: {
        text: string;
      };
    };
    follower_count: number;
    following_count: number;
    verifications: string[];
    verified_addresses: {
      eth_addresses: string[];
      sol_addresses: string[];
    };
    active_status: string;
    power_badge: boolean;
    viewer_context: {
      following: boolean;
      followed_by: boolean;
    };
  };
  text: string;
  timestamp: string;
  embeds: {
    url?: string;
    cast_id?: {
      fid: number;
      hash: string;
    };
  }[];
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: any[];
    recasts: any[];
  };
  replies: {
    count: number;
  };
  mentioned_profiles: any[];
  viewer_context: {
    liked: boolean;
    recasted: boolean;
  };
}

function getRelativeTime(inputDate: string): string {
  const now = new Date();
  const past = new Date(inputDate);
  // @ts-ignore
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { name: "y", seconds: 31536000 }, // 1 year = 31536000 seconds
    { name: "m", seconds: 2592000 }, // 1 month = 2592000 seconds
    { name: "w", seconds: 604800 }, // 1 week = 604800 seconds
    { name: "d", seconds: 86400 }, // 1 day = 86400 seconds
    { name: "hr", seconds: 3600 }, // 1 hour = 3600 seconds
    { name: "m", seconds: 60 }, // 1 minute = 60 seconds
    { name: "s", seconds: 1 }, // 1 second = 1 second
  ];

  for (const unit of units) {
    if (diffInSeconds >= unit.seconds) {
      const value = Math.floor(diffInSeconds / unit.seconds);
      return `${value}${unit.name}`;
    }
  }

  return "just now";
}

const Cast: React.FC<CastProps> = ({
  embeds,
  text,
  author,
  reactions,
  timestamp,
  replies,
}) => {
  const renderContent = () => {
    return (
      <VBox>
        <CastText>{text}</CastText>
        {embeds && embeds.length > 0 && (
          <HBox flexWrap="wrap">
            {embeds.map((embed, index) => {
              if (embed.url) {
                if (embed.url.includes("imagedelivery")) {
                  return (
                    <CastImage
                      key={index}
                      src={embed.url}
                      alt={`Embedded Image ${index + 1}`}
                    />
                  );
                } else {
                  return (
                    <CastLink
                      key={index}
                      href={embed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {embed.url}
                    </CastLink>
                  );
                }
              }
              return null;
            })}
          </HBox>
        )}
      </VBox>
    );
  };

  const renderReactions = () => {
    const reactionsArray = [];

    if (replies.count > 0) {
      reactionsArray.push(
        <span key="replies">
          {replies.count === 1 ? "1 reply" : `${replies.count} replies`}
        </span>
      );
    }

    if (reactions.likes_count > 0) {
      if (reactionsArray.length > 0) {
        reactionsArray.push(
          <span key="separator1">
            &nbsp;<span>•</span>&nbsp;
          </span>
        );
      }
      reactionsArray.push(
        <span key="likes">
          {reactions.likes_count === 1
            ? "1 like"
            : `${reactions.likes_count} likes`}
        </span>
      );
    }

    if (reactions.recasts_count > 0) {
      if (reactionsArray.length > 0) {
        reactionsArray.push(
          <span key="separator2">
            &nbsp;<span>•</span>&nbsp;
          </span>
        );
      }
      reactionsArray.push(
        <span key="recasts">
          {reactions.recasts_count === 1
            ? "1 recast"
            : `${reactions.recasts_count} recasts`}
        </span>
      );
    }

    return reactionsArray.length > 0 ? reactionsArray : null;
  };

  return (
    <CastContainer>
      <HBox>
        <Box spacingRight="10px">
          <Avatar
            loading="lazy"
            src={author.pfp_url}
            alt={author.display_name}
          />
        </Box>
        <Main>
          <VBox>
            <HBox>
              <strong>{author.display_name}</strong>
              {author.power_badge && (
                <Box spacingLeft="5px">
                  <WarpcastPowerBadge />
                </Box>
              )}
            </HBox>
            <HBox alignItems="center">
              <Username>
                @{author.username} <span>•</span>{" "}
                <span>{getRelativeTime(timestamp)}</span>
              </Username>
            </HBox>
          </VBox>

          {renderContent()}

          <HBox justifyContent="space-between">
            <HBox>
              <IconContainer>
                <Reply />
                <Recast />
                <Like />
              </IconContainer>
            </HBox>
            <HBox>
              <IconContainer>
                <Save />
                <Share />
              </IconContainer>
            </HBox>
          </HBox>
          <HBox spacingTop="8px">{renderReactions()}</HBox>
        </Main>
      </HBox>
    </CastContainer>
  );
};

export default Cast;
