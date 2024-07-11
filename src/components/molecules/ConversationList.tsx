import React from 'react';
import Box from '../atoms/Box';
import { CastCard, CastCardProps } from './CastCard';
import { styled } from '@pigment-css/react';

const StyledConversationList = styled.div(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.vars.palette.border,
  borderRadius: "0px",
  color: theme.vars.palette.text,
  fontFamily: theme.typography.fonts.base,
  fontSize: theme.typography.fontSizes.medium,
  backgroundColor: theme.vars.palette.background,
  width: 'auto',
  maxWidth: "750px",
}));

export default function ConversationList(props: { casts: CastCardProps[] }){
  return (
    <StyledConversationList>
      {props.casts.map((cast, index) => (
        <div key={index}>
          <CastCard isEmbed={false} {...cast} />
          {cast.direct_replies && cast.direct_replies.length > 0 && (
            <Box spacingLeft="20px">
              <ConversationList casts={cast.direct_replies} />
            </Box>
          )}
        </div>
      ))}
    </StyledConversationList>
  );
};