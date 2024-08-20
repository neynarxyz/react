import React, { useState, useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useNeynarContext } from '../../../contexts';
import { CastCardProps } from '../../molecules/CastCard';
import { NEYNAR_API_URL } from '../../../constants';
import { FeedList } from '../../molecules/FeedList';
import customFetch from '../../../utils/fetcher';

type FeedType = 'following' | 'filter';
type FeedFilterType = 'fids' | 'parent_url' | 'channel_id' | 'embed_url' | 'global_trending';

export type NeynarFeedListProps = {
    feedType: FeedType;
    filterType?: FeedFilterType;
    fid?: number;
    fids?: string;
    parentUrl?: string;
    channelId?: string;
    embedUrl?: string;
    withRecasts?: boolean;
    limit?: number;
    viewerFid?: number;
    clientId?: string;
};

type PreviousPageData = {
    casts: any[];
    next: {
        cursor: string;
    };
};

function formatCasts(casts: any[]): CastCardProps[] {
    if (!casts) return [];
    return casts.map((cast: any) => {
        return {
            username: cast?.author?.username ?? '',
            displayName: cast?.author?.display_name ?? '',
            avatarImgUrl: cast?.author?.pfp_url ?? '',
            text: cast?.text ?? '',
            hash: cast?.hash ?? '',
            reactions: cast?.reactions ?? [],
            replies: cast?.replies?.count ?? 0,
            embeds: cast?.embeds ?? [],
            frames: cast?.frames ?? [],
            renderEmbeds: cast?.renderEmbeds ?? true,
            channel: cast?.channel ?? '',
            viewerFid: 2,
            hasPowerBadge: cast?.author?.power_badge ?? false,
            isOwnProfile: false,
            allowReactions: true,
        };
    });
}

const fetcher = (url: string) => customFetch(url).then(res => res.json());

const getKey = (pageIndex: number, previousPageData: PreviousPageData | null, props: NeynarFeedListProps & { clientId: string }) => {
    if (previousPageData && (!previousPageData.casts || !previousPageData.casts.length)) return null;

    let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/feed?feed_type=${props.feedType}&client_id=${props.clientId}`;
    if (props.filterType) requestUrl += `&filter_type=${props.filterType}`;
    if (props.fid) requestUrl += `&fid=${props.fid}`;
    if (props.fids) requestUrl += `&fids=${props.fids}`;
    if (props.parentUrl) requestUrl += `&parent_url=${props.parentUrl}`;
    if (props.channelId) requestUrl += `&channel_id=${props.channelId}`;
    if (props.embedUrl) requestUrl += `&embed_url=${props.embedUrl}`;
    requestUrl += `&with_recasts=${props.withRecasts}&limit=${props.limit}`;
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
        (pageIndex: number, previousPageData: PreviousPageData | null) => getKey(pageIndex, previousPageData, { ...props, clientId: client_id }),
        fetcher
    );

    const allCasts = data ? data.flatMap(page => page?.casts ?? []) : [];
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