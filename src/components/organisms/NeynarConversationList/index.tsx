import React from 'react';
import { useNeynarContext } from '../../../contexts';
import { CastCardProps } from '../../molecules/CastCard';
import { NEYNAR_API_URL } from '../../../constants';
import ConversationList from '../../molecules/ConversationList';

type FeedType = 'url' | 'hash';

export type NeynarConversationListProps = {
    type: FeedType;
    identifier: string;
    reply_depth?: number;
    include_chronological_parent_casts?: boolean;
    limit?: number;
    viewer_fid?: number;
};

async function fetchConversationByIdentifier({
    type,
    identifier,
    reply_depth = 2,
    include_chronological_parent_casts = false,
    limit = 20,
    viewer_fid,
    client_id
}: NeynarConversationListProps & { client_id: string }): Promise<any | null> {
    try {
        let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/cast/conversation?identifier=${encodeURIComponent(identifier)}&type=${type}&reply_depth=${reply_depth}&include_chronological_parent_casts=${include_chronological_parent_casts}&limit=${limit}&client_id=${client_id}`;
        
        if (viewer_fid) requestUrl += `&viewer_fid=${viewer_fid}`;
        
        const response = await fetch(requestUrl, {
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
    reply_depth = 2,
    include_chronological_parent_casts = false,
    limit = 20,
    viewer_fid,
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
            reply_depth,
            include_chronological_parent_casts,
            limit,
            viewer_fid,
            client_id
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
    }, [type, identifier, reply_depth, include_chronological_parent_casts, limit, viewer_fid, client_id]);

    if (loading) {
        return <> </>;
    }

    if (error) {
        return <> </>;
    }

    return <ConversationList casts={formatCasts(conversationData.conversation)} />;
};