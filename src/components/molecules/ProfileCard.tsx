import { useMemo, memo } from "react";
import { styled } from "@pigment-css/react";

import Avatar from "../atoms/Avatar";
import ButtonPrimary from "../atoms/Button/ButtonPrimary";
import ButtonOutlined from "../atoms/Button/ButtonOutlined";
import { useLinkifyBio } from "../organisms/NeynarProfileCard/hooks/useLinkifyBio";
import Box, { HBox, VBox } from "../atoms/Box";
import { WarpcastPowerBadge } from "../atoms/icons/WarpcastPowerBadge";
import { formatToReadableNumber } from "../../utils/formatUtils";
import { SKELETON_PFP_URL } from "../../constants";

const StyledProfileCard = styled.div(({ theme }) => ({
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

export type ProfileCardProps = {
  fid?: number;
  username: string;
  displayName: string;
  avatarImgUrl: string;
  bio: string;
  followers: number;
  following: number;
  hasPowerBadge: boolean;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
  onCast?: () => void;
  customStyles?: React.CSSProperties;
};

export const ProfileCard = memo(
  ({
    fid,
    username,
    displayName,
    avatarImgUrl,
    bio,
    followers,
    following,
    hasPowerBadge,
    isFollowing,
    isOwnProfile,
    onCast,
    customStyles,
  }: ProfileCardProps) => {
    const linkifiedBio = useLinkifyBio(bio);

    const formattedFollowingCount = useMemo(
      () => formatToReadableNumber(following),
      [following]
    );

    const formattedFollowersCount = useMemo(
      () => formatToReadableNumber(followers),
      [followers]
    );

    const handleEditProfile = () => {
      window.open("https://warpcast.com/~/settings", "_blank");
    };

    const customNumberStyle = {
      color: customStyles?.color,
    };

    return (
      <StyledProfileCard style={customStyles}>
        {isOwnProfile && onCast && (
          <HBox
            alignItems="center"
            justifyContent="space-between"
            spacingBottom="20px"
          >
            <UsernameTitle style={customStyles}>@{username}</UsernameTitle>
            <ButtonPrimary onClick={onCast}>Cast</ButtonPrimary>
          </HBox>
        )}
        <HBox>
          <Box spacingRight="10px">
            <Avatar
              src={avatarImgUrl ?? SKELETON_PFP_URL}
              loading="lazy"
              alt={`${displayName ?? 'Skeleton'} Avatar`}
            />
          </Box>
          <Main>
            <HBox justifyContent="space-between" flexGrow={1}>
              <VBox>
                <HBox>
                  <strong>{displayName || `!${fid}`}</strong>
                  {hasPowerBadge && (
                    <Box spacingLeft="5px">
                      <WarpcastPowerBadge />
                    </Box>
                  )}
                </HBox>
                <HBox alignItems="center">
                  <Username style={customStyles}>@{username}</Username>
                  {isFollowing && <Tag style={customStyles}>Follows you</Tag>}
                </HBox>
              </VBox>
              <HBox>
                {isOwnProfile && (
                  <ButtonOutlined style={customStyles} onClick={handleEditProfile}>
                    Edit Profile
                  </ButtonOutlined>
                )}
              </HBox>
            </HBox>

            <Box spacingVertical="15px">
              <div style={customStyles}>{linkifiedBio}</div>
            </Box>

            <HBox>
              <ProfileMetaCell>
                <strong style={customNumberStyle}>{formattedFollowingCount}</strong> Following
              </ProfileMetaCell>
              <ProfileMetaCell>
                <strong style={customNumberStyle}>{formattedFollowersCount}</strong> Followers
              </ProfileMetaCell>
            </HBox>
          </Main>
        </HBox>
      </StyledProfileCard>
    );
  }
);