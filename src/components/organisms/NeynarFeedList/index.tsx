import React from 'react';
import { useNeynarContext } from '../../../contexts';
import { CastCardProps } from '../../molecules/CastCard';
import { NEYNAR_API_URL } from '../../../constants';
import { FeedList } from '../../molecules/FeedList';

type FeedType = 'following' | 'filter';
type FeedFilterType = 'fids' | 'parent_url' | 'channel_id' | 'embed_url' | 'global_trending';

export type NeynarFeedListProps = {
    feed_type: FeedType;
    filter_type?: FeedFilterType;
    fid?: number;
    fids?: string;
    parent_url?: string;
    channel_id?: string;
    embed_url?: string;
    with_recasts?: boolean;
    limit?: number;
    viewerFid?: number;
};

async function fetchFeedByIdentifiers({
    feed_type,
    filter_type,
    fid,
    fids,
    parent_url,
    channel_id,
    embed_url,
    with_recasts = true,
    limit = 25,
    viewerFid,
    client_id
}: NeynarFeedListProps & { client_id: string }): Promise<any | null> {
    try {
        let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/feed?feed_type=${feed_type}&client_id=${client_id}`;
        
        if (filter_type) requestUrl += `&filter_type=${filter_type}`;
        if (fid) requestUrl += `&fid=${fid}`;
        if (fids) requestUrl += `&fids=${fids}`;
        if (parent_url) requestUrl += `&parent_url=${parent_url}`;
        if (channel_id) requestUrl += `&channel_id=${channel_id}`;
        if (embed_url) requestUrl += `&embed_url=${embed_url}`;
        requestUrl += `&with_recasts=${with_recasts}&limit=${limit}`;
        if (viewerFid) requestUrl += `&viewer_fid=${viewerFid}`;
        
        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            }
        });
        
        const data = await response.json();
        console.log(data);
        return data || null;
    } catch (error) {
        console.error("Error fetching feed", error);
        return null;
    }
}

function formatCasts(casts: any[]): CastCardProps[] {
    return casts.map((cast: any) => {
        return {
            username: cast.author.username,
            displayName: cast.author.display_name,
            avatarImgUrl: cast.author.pfp_url,
            text: cast.text,
            hash: cast.hash,
            likes: cast.reactions.likes_count,
            replies: cast.replies.count,
            embeds: cast.embeds,
            channel: cast.channel,
            viewerFid: 2,
            hasPowerBadge: cast.author.power_badge,
            isOwnProfile: false,
            allowReactions: true
            // onComment: () => {},
            // onRecast: () => {},
            // onLike: () => {}
        };
    });
}

export const NeynarFeedList: React.FC<NeynarFeedListProps> = ({
    feed_type,
    filter_type,
    fid,
    fids,
    parent_url,
    channel_id,
    embed_url,
    with_recasts = true,
    limit = 25,
    viewerFid,
}) => {
    const { client_id } = useNeynarContext();
    const [feedData, setFeedData] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        setLoading(true);
        setError(null);
        
        fetchFeedByIdentifiers({
            feed_type,
            filter_type,
            fid,
            fids,
            parent_url,
            channel_id,
            embed_url,
            with_recasts,
            limit,
            viewerFid,
            client_id
        })
        .then((data) => {
            setFeedData(data);
        })
        .catch((error) => {
            setError(error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [feed_type, filter_type, fid, fids, parent_url, channel_id, embed_url, with_recasts, limit, viewerFid, client_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching feed data</div>;
    }

    return <FeedList casts={formatCasts(feedData.casts)} cursor={feedData.cursor} />;
};