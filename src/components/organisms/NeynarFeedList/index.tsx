import React, { useState, useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
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
    client_id?: string;
};

function formatCasts(casts: any[]): CastCardProps[] {
    return casts.map((cast: any) => {
        return {
            username: cast.author.username,
            displayName: cast.author.display_name,
            avatarImgUrl: cast.author.pfp_url,
            text: cast.text,
            hash: cast.hash,
            reactions: cast.reactions,
            replies: cast.replies.count,
            embeds: cast.embeds,
            channel: cast.channel,
            viewerFid: 2,
            hasPowerBadge: cast.author.power_badge,
            isOwnProfile: false,
            allowReactions: true
        };
    });
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const getKey = (pageIndex: number, previousPageData: any, props: NeynarFeedListProps) => {
    if (previousPageData && !previousPageData.casts.length) return null;

    let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/feed?feed_type=${props.feed_type}&client_id=${props.client_id}`;
    if (props.filter_type) requestUrl += `&filter_type=${props.filter_type}`;
    if (props.fid) requestUrl += `&fid=${props.fid}`;
    if (props.fids) requestUrl += `&fids=${props.fids}`;
    if (props.parent_url) requestUrl += `&parent_url=${props.parent_url}`;
    if (props.channel_id) requestUrl += `&channel_id=${props.channel_id}`;
    if (props.embed_url) requestUrl += `&embed_url=${props.embed_url}`;
    requestUrl += `&with_recasts=${props.with_recasts}&limit=${props.limit}`;
    if (props.viewerFid) requestUrl += `&viewer_fid=${props.viewerFid}`;
    if (previousPageData) requestUrl += `&cursor=${previousPageData.next.cursor}`;

    return requestUrl;
};

export const NeynarFeedList: React.FC<NeynarFeedListProps> = (props) => {
    const { client_id } = useNeynarContext();
    const ref = useRef<HTMLDivElement | null>(null);
    const [feedData, setFeedData] = useState<CastCardProps[]>([]);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    const { data, error, size, setSize, isValidating } = useSWRInfinite(
        (pageIndex, previousPageData) => getKey(pageIndex, previousPageData, { ...props, client_id }),
        fetcher
    );

    const allCasts = data ? data.flatMap(page => page.casts) : [];
    const uniqueCasts = Array.from(new Set(allCasts.map(cast => cast.hash)))
                            .map(hash => allCasts.find(cast => cast.hash === hash)!);
    const formattedCasts = formatCasts(uniqueCasts);

    useEffect(() => {
        setFeedData(formattedCasts);
    }, [data]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    setIsFetchingNextPage(true);
                    setSize(size + 1).then(() => setIsFetchingNextPage(false));
                }
            },
            { rootMargin: '100px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref.current, isFetchingNextPage]);

    if (!data && !error) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching feed data</div>;
    }

    return (
        <div>
            <FeedList casts={feedData} cursor={''} />
            {isValidating && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <span style={{ animation: 'blink 1.5s infinite' }}>Loading<span className="dots">...</span></span>
                    <style>{`
                        @keyframes blink {
                            0% { opacity: 1; }
                            50% { opacity: 0; }
                            100% { opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
            <div ref={ref} />
        </div>
    );
};