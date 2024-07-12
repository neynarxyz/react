import React from "react";
import { NEYNAR_API_URL } from "../../../constants";
import { useNeynarContext } from "../../../contexts";
import { CastCard } from "../../molecules/CastCard";

async function fetchCastByIdentifier({
  type,
  identifier,
  viewerFid,
  client_id
}: {
  type: 'url' | 'hash';
  identifier: string;
  viewerFid?: number;
  client_id: string;
}): Promise<any | null> {
  try {
    let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/cast?type=${type}&identifier=${identifier}${viewerFid ? `&viewer_fid=${viewerFid}` : ''}&client_id=${client_id}`;
    const response = await fetch(requestUrl);
    const data = await response.json();
    return data?.cast || null;
  } catch (error) {
    console.error("Error fetching cast by identifier", error);
    return null;
  }
}

export type NeynarCastCardProps = {
  type: 'url' | 'hash';
  identifier: string;
  viewerFid?: number;
  allowReactions: boolean;
  renderEmbeds?: boolean;
  customStyles?: React.CSSProperties;
};

export const NeynarCastCard: React.FC<NeynarCastCardProps> = ({
  type,
  identifier,
  viewerFid,
  allowReactions,
  renderEmbeds = true,
  customStyles
}) => {
  const { client_id } = useNeynarContext();
  const [castData, setCastData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const isOwnProfile = castData?.author.fid === viewerFid;

  React.useEffect(() => {
    if (type && identifier) {
      setLoading(true);
      setError(null);
      fetchCastByIdentifier({ type, identifier, viewerFid, client_id })
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
  }, [type, identifier, viewerFid, client_id]);

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
      reactions={castData.reactions}
      replies={castData.replies.count}
      embeds={renderEmbeds ? castData.embeds : []}
      channel={castData.channel ? {
        id: castData.channel.id,
        name: castData.channel.name,
        url: castData.parent_url
      } : undefined}
      viewerFid={viewerFid}
      allowReactions={allowReactions}
      hasPowerBadge={castData.author.power_badge}
      isOwnProfile={isOwnProfile}
      customStyles={customStyles}
    />
  );
};