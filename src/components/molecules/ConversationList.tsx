import React from 'react';
import Box from '../atoms/Box';
import { CastCard, CastCardProps } from './CastCard';
import { styled } from '@pigment-css/react';

const VerticalLine = styled.div(({ theme }) => ({
  borderLeft: `2px solid ${theme.vars.palette.border}`,
  marginLeft: '40px',
  paddingLeft: '20px',
  position: 'relative',
}));

export default function ConversationList(props: { casts: CastCardProps[] }) {
  return (
    <div>
      {props.casts.map((cast, index) => (
        <div key={index} style={{ position: 'relative', marginBottom: '20px' }}>
          <CastCard isEmbed={false} {...cast} />
          {cast.direct_replies && cast.direct_replies.length > 0 && (
            <VerticalLine>
              <ConversationList casts={cast.direct_replies} />
            </VerticalLine>
          )}
        </div>
      ))}
    </div>
  );
}