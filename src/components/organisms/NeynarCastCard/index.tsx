import React from "react";
import { NEYNAR_API_URL } from "../../../constants";
import { useNeynarContext } from "../../../contexts";
import { CastCard } from "../../molecules/CastCard";
import customFetch from "../../../utils/fetcher";
import { type NeynarFrame } from "../NeynarFrameCard";

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
    const response = await customFetch(requestUrl);
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
  allowReactions?: boolean;
  renderEmbeds?: boolean;
  onLikeBtnPress?: () => boolean;
  onRecastBtnPress?: () => boolean;
  onCommentBtnPress?: () => void;
  onFrameBtnPress?: (
    btnIndex: number,
    localFrame: NeynarFrame,
    setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>,
    inputValue?: string
  ) => Promise<NeynarFrame>;
  customStyles?: React.CSSProperties;
};

export const NeynarCastCard: React.FC<NeynarCastCardProps> = ({
  type,
  identifier,
  viewerFid,
  allowReactions = false,
  renderEmbeds = true,
  onLikeBtnPress,
  onRecastBtnPress,
  onCommentBtnPress,
  onFrameBtnPress,
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
    return <div>Error: could not fetch cast data</div>;
  }
  if (renderEmbeds && !onFrameBtnPress) {
    return <div>Error: onFrameBtnPress must be provided when renderEmbeds is true.</div>;
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
      embeds={castData.embeds ?? []}
      frames={castData.frames ?? []}
      renderEmbeds={renderEmbeds}
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
      onLikeBtnPress={onLikeBtnPress}
      onRecastBtnPress={onRecastBtnPress}
      onCommentBtnPress={onCommentBtnPress}
      onFrameBtnPress={onFrameBtnPress}
    />
  );
};