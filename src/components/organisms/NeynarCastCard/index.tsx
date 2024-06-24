import React, { useState, useEffect, useCallback } from "react";

import { NEYNAR_API_URL } from "../../../constants";
import { useNeynarContext } from "../../../contexts";
import { CastCard } from "../../molecules/CastCard";

async function fetchCastByIdentifier({
  identifier,
  hash,
  url,
  client_id
}: {
  identifier: 'url' | 'hash';
  hash?: string;
  url?: string;
  client_id: string;
}): Promise<any | null> {
  try {
    const identifierValue = identifier === 'url' && url ? url : hash;
    let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/cast?type=${identifier}&identifier=${identifierValue}&client_id=${client_id}`;

    const response = await fetch(requestUrl);
    const data = await response.json();
    return data?.cast || null;
  } catch (error) {
    console.error("Error fetching cast by identifier", error);
    return null;
  }
}

export type NeynarCastCardProps = {
  identifier: 'url' | 'hash';
  viewerFid: number;
  hash?: string;
  url?: string;
};

export const NeynarCastCard: React.FC<NeynarCastCardProps> = ({
  identifier,
  viewerFid,
  hash,
  url
}) => {
  const { client_id } = useNeynarContext();

  const [castData, setCastData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = castData?.author.fid === viewerFid;

  useEffect(() => {
    if (identifier && (hash || url)) {
      setLoading(true);
      setError(null);
      fetchCastByIdentifier({ identifier, hash, url, client_id })
        .then((data) => {
          setCastData(data);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [identifier, hash, url, client_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!castData || error) {
    return <div>Error fetching user data</div>;
  }

  return (
    <CastCard
      username={castData.author.username}
      displayName={castData.author.display_name}
      avatarImgUrl={castData.author.pfp_url}
      text={castData.text}
      hash={castData.hash}
      likes={castData.reactions.likes_count}
      replies={castData.replies.count}
      embeds={castData.embeds}
      channel={castData.channel ? {
        id: castData.channel.id,
        name: castData.channel.name,
        url: castData.parent_url
      } : undefined}
      hasPowerBadge={castData.author.power_badge}
      isOwnProfile={isOwnProfile}
    />
  );
};
