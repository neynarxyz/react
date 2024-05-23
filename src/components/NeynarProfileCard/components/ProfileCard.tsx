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
            <Username>@{username}</Username>
          </VBox>
          <HBox>
            {isCurrentUser && (
              <ButtonOutline onClick={handleEditProfile}>Edit Profile</ButtonOutline>
            )}
            <ButtonOutline>
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
    </StyledProfileCard>
  );
});
