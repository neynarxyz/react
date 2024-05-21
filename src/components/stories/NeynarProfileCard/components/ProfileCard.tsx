import { useMemo, memo } from "react";
import { styled } from "@pigment-css/react";
import { Box, HBox, VBox } from "../../../shared/Box";

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const StyledProfileCard = styled.div(({ theme }) => ({
  display: "flex",
  width: "100%",
  maxWidth: "608px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.colorScheme === 'dark'
    ? hexToRgba('#9FB7CA', 0.2)
    // TODO: Update light color palette
    : hexToRgba('#9FB7CA', 0.2),
  borderRadius: "15px",
  padding: "30px",
  color: theme.colorSchemes.light.palette.text,
  fontFamily: theme.typography.fonts.base,
  fontSize: theme.typography.fontSizes.medium,
  backgroundColor: theme.colorScheme === 'dark'
    ? hexToRgba('#151421', 0.8)
    // TODO: Update light color palette
    : hexToRgba('#040405', 0.1),
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

const Username = styled.div(({ theme }) => ({
  color: theme.colorSchemes.light.palette.lightGrey,
}));

const ProfileMetaCell = styled.div(({ theme }) => ({
  color: theme.colorSchemes.light.palette.lightGrey,
  "> strong": {
    color: theme.colorSchemes.light.palette.text,
  },
  "& + &": {
    marginLeft: "15px",
  },
}));

type ProfileCardProps = {
  username: string;
  displayName: string;
  avatarImgUrl: string;
  bio: string;
  followers: number;
  following: number;
  location: string;
  hasPowerBadge: boolean;
};

export const ProfileCard = memo(({
  username,
  displayName,
  avatarImgUrl,
  bio,
  followers,
  following,
  location,
  hasPowerBadge,
}: ProfileCardProps) => {
  const formattedFollowingCount = useMemo(() => {
    // TODO: Handle readable number formatting
    return following;
  }, [following]);

  const formattedFollowersCount = useMemo(() => {
    // TODO: Handle readable number formatting
    return followers;
  }, [followers]);

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
              {/* TODO: Add power badge icon */}
              {hasPowerBadge && '⚡'}
            </HBox>
            <Username>@{username}</Username>
          </VBox>
          <HBox>
            {/* TODO: Add button styles */}
            <button>Edit Profile</button>
            <button>...</button>
          </HBox>
        </HBox>

        <Box spacingVertical="15px">{bio}</Box>

        <HBox>
          <ProfileMetaCell>
            <strong>{formattedFollowingCount}</strong> Following
          </ProfileMetaCell>
          <ProfileMetaCell>
            <strong>{formattedFollowersCount}</strong> Followers
          </ProfileMetaCell>
          <ProfileMetaCell>
            {location}
          </ProfileMetaCell>
        </HBox>
      </Main>
    </StyledProfileCard>
  );
});
