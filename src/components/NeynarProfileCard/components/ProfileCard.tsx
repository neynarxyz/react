import { useMemo, memo } from "react";
import { styled } from "@pigment-css/react";
import { Box, HBox, VBox } from "../../shared/Box";
import { formatToReadableNumber } from "../../../utils/formatUtils";
import { useLinkifyBio } from "../hooks/useLinkifyBio";
import { WarpcastPowerBadge } from "../icons/WarpcastPowerBadge";
import { useNeynarContext } from "../../../contexts";
import { MoreMenuIcon } from "../icons/MoreMenuIcon";

const StyledProfileCard = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "608px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "var(--palette-border)",
  borderRadius: "15px",
  padding: "30px",
  color: "var(--palette-text)",
  fontFamily: theme.typography.fonts.base,
  fontSize: theme.typography.fontSizes.medium,
  backgroundColor: "var(--palette-background)",
}));

const Avatar = styled.img(() => ({
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  aspectRatio: 1 / 1,
  objectFit: "cover",
}));

const Main = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flex: 1,
}));

const Username = styled.div(() => ({
  color: "var(--palette-textMuted)",
}));

const UsernameTitle = styled.div(({ theme }) => ({
  fontSize: theme.typography.fontSizes.large,
  fontWeight: theme.typography.fontWeights.bold,
}));

const ProfileMetaCell = styled.div(() => ({
  color: "var(--palette-textMuted)",
  "> strong": {
    color:"var(--palette-text)",
  },
  "& + &": {
    marginLeft: "15px",
  },
}));

const ButtonOutline = styled.button(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "var(--palette-border)",
  borderRadius: "7px",
  padding: "10px",
  backgroundColor: "transparent",
  color:"var(--palette-text)",
  fontWeight: theme.typography.fontWeights.bold,
  lineHeight: 1,
  cursor: "pointer",
  "& + &": {
    marginLeft: "10px",
  },
}));

const ButtonPrimary = styled.button(({ theme }) => ({
  border: "none",
  borderRadius: "7px",
  padding: "13px 15px",
  backgroundColor: theme.colors.primary,
  color: "#fff",
  fontWeight: theme.typography.fontWeights.bold,
  lineHeight: 1,
  cursor: "pointer",
  "& + &": {
    marginLeft: "10px",
  },
}));

const Tag = styled.div(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "var(--palette-border)",
  borderRadius: "5px",
  padding: "3px 6px",
  marginTop: "3px",
  marginLeft: "5px",
  backgroundColor: "transparent",
  fontSize: theme.typography.fontSizes.small,
  color:"var(--palette-textMuted)",
  lineHeight: 1,
}));

export type ProfileCardProps = {
  username: string;
  displayName: string;
  avatarImgUrl: string;
  bio: string;
  followers: number;
  following: number;
  hasPowerBadge: boolean;
};

export const ProfileCard = memo(({
  username,
  displayName,
  avatarImgUrl,
  bio,
  followers,
  following,
  hasPowerBadge,
}: ProfileCardProps) => {
  const { user, isAuthenticated } = useNeynarContext();
  const linkifiedBio = useLinkifyBio(bio);

  const formattedFollowingCount = useMemo(() =>
    formatToReadableNumber(following),
  [following]);

  const formattedFollowersCount = useMemo(() =>
    formatToReadableNumber(followers),
  [followers]);

  const isCurrentUser = isAuthenticated && user?.username === username;

  const handleEditProfile = () => {
    window.open("https://warpcast.com/~/settings", "_blank");
  };

  return (
    <StyledProfileCard>
      {isCurrentUser && (
        <HBox alignItems="center" justifyContent="space-between" spacingBottom="20px">
          <UsernameTitle>@{username}</UsernameTitle>
          <ButtonPrimary>Cast</ButtonPrimary>
        </HBox>
      )}
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
                    <WarpcastPowerBadge/>
                  </Box>
                )}
              </HBox>
              <HBox alignItems="center">
                <Username>@{username}</Username>
                {/* TODO: Check if user follows you */}
                <Tag>Follows you</Tag>
              </HBox>
            </VBox>
            <HBox>
              {isCurrentUser && (
                <ButtonOutline onClick={handleEditProfile}>Edit Profile</ButtonOutline>
              )}
              <ButtonOutline>
                {/* TODO: Handle more menu click */}
                <MoreMenuIcon/>
              </ButtonOutline>
            </HBox>
          </HBox>

          <Box spacingVertical="15px">
            <div>{linkifiedBio}</div>
          </Box>

          <HBox>
            <ProfileMetaCell>
              <strong>{formattedFollowingCount}</strong> Following
            </ProfileMetaCell>
            <ProfileMetaCell>
              <strong>{formattedFollowersCount}</strong> Followers
            </ProfileMetaCell>
          </HBox>
        </Main>
      </HBox>
    </StyledProfileCard>
  );
});
