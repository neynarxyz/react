import React, { useState, useEffect } from "react";
import { ProfileCard } from "./components/ProfileCard";
import { useNeynarContext } from "../../contexts";

async function fetchUserByFid({ fid, viewerFid, clientId }: { fid: number, viewerFid?: number, clientId: string }): Promise<any | null> {
  try {
    const response = await fetch(`${process.env.NEYNAR_API_URL}/farcaster/user/bulk?client_id=${clientId}&fids=${fid}&viewer_fid=${viewerFid}`);
    const data = await response.json();
    return data?.users?.[0] ?? null;
  } catch (error) {
    console.error('Error fetching user by fid', error);
    return null;
  }
}

export type NeynarProfileCardProps = {
  fid: number;
  viewerFid?: number;
};

export const NeynarProfileCard: React.FC<NeynarProfileCardProps> = ({
  fid,
  viewerFid,
}) => {
  const { client_id } = useNeynarContext();

  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = userData?.fid === viewerFid;

  useEffect(() => {
    if (fid) {
      setLoading(true);
      setError(null);

      fetchUserByFid({ fid, viewerFid, clientId: client_id })
        .then((data) => {
          setUserData(data);
        }).catch((error) => {
          setError(error);
        }).finally(() => {
          setLoading(false);
        });
    }
  }, [fid, viewerFid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData || error) {
    return <div>Error fetching user data</div>;
  }

  return (
    <ProfileCard
      username={userData.username}
      displayName={userData.display_name}
      avatarImgUrl={userData.pfp_url}
      bio={userData.profile.bio.text}
      followers={userData.follower_count}
      following={userData.following_count}
      hasPowerBadge={userData.power_badge}
      isOwnProfile={isOwnProfile}
      isFollowing={userData.viewer_context?.followed_by}
    />
  );
};
