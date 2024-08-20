import React from 'react';
import { useNeynarContext } from '../../../contexts';
import { CastCardProps } from '../../molecules/CastCard';
import { NEYNAR_API_URL } from '../../../constants';
import ConversationList from '../../molecules/ConversationList';
import customFetch from '../../../utils/fetcher';

type FeedType = 'url' | 'hash';

export type NeynarConversationListProps = {
    type: FeedType;
    identifier: string;
    replyDepth?: number;
    includeChronologicalParentCasts?: boolean;
    limit?: number;
    viewerFid?: number;
};

async function fetchConversationByIdentifier({
    type,
    identifier,
    replyDepth = 2,
    includeChronologicalParentCasts = false,
    limit = 20,
    viewerFid,
    clientId
}: NeynarConversationListProps & { clientId: string }): Promise<any | null> {
    try {
        let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/cast/conversation?identifier=${encodeURIComponent(identifier)}&type=${type}&reply_depth=${replyDepth}&include_chronological_parent_casts=${includeChronologicalParentCasts}&limit=${limit}&client_id=${clientId}`;
        
        if (viewerFid) requestUrl += `&viewer_fid=${viewerFid}`;
        
        const response = await customFetch(requestUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });
        
        const data = await response.json();
        return data || null;
    } catch (error) {
        console.error("Error fetching conversation", error);
        return null;
    }
}

function formatCast(cast: any): CastCardProps {
    return {
        username: cast.author.username,
        displayName: cast.author.display_name,
        avatarImgUrl: cast.author.pfp_url,
        text: cast.text,
        hash: cast.hash,
        reactions: cast.reactions,
        replies: cast.replies.count,
        embeds: cast.embeds,
        frames: cast.frames,
        renderEmbeds: cast.renderEmbeds,
        channel: cast.channel,
        viewerFid: 2,
        hasPowerBadge: cast.author.power_badge,
        isOwnProfile: false,
        allowReactions: true,
        direct_replies: cast.direct_replies ? cast.direct_replies.map(formatCast) : [],
    };
}

function formatCasts(conversation: any): CastCardProps[] {
    const formattedCasts = [];
    
    if (conversation.cast) {
        formattedCasts.push(formatCast(conversation.cast));
    }
    
    return formattedCasts;
}

export const NeynarConversationList: React.FC<NeynarConversationListProps> = ({
    type,
    identifier,
    replyDepth = 2,
    includeChronologicalParentCasts = false,
    limit = 20,
    viewerFid,
}) => {
    const { client_id } = useNeynarContext();
    const [conversationData, setConversationData] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        setLoading(true);
        setError(null);
        
        fetchConversationByIdentifier({
            type,
            identifier,
            replyDepth,
            includeChronologicalParentCasts,
            limit,
            viewerFid,
            clientId: client_id
        })
        .then((data) => {
            setConversationData(data);
        })
        .catch((error) => {
            setError(error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [type, identifier, replyDepth, includeChronologicalParentCasts, limit, viewerFid, client_id]);

    if (loading) {
        return <> </>;
    }

    if (error) {
        return <> </>;
    }

    return <ConversationList casts={formatCasts(conversationData.conversation)} />;
};