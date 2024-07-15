import React from 'react';
import Box from '../atoms/Box';
import { CastCard, CastCardProps } from './CastCard';
import { styled } from '@pigment-css/react';

const StyledConversationList = styled.div(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.vars.palette.border,
  borderRadius: "15px",
  color: theme.vars.palette.text,
  fontFamily: theme.typography.fonts.base,
  fontSize: theme.typography.fontSizes.medium,
  backgroundColor: theme.vars.palette.background,
  width: 'auto',
  maxWidth: "750px",
  padding: "20px",
}));

const ReplyWrapper = styled.div(() => ({
  display: "flex",
  alignItems: "flex-start",
  position: "relative",
}));

const VerticalLine = styled.div(({ theme }) => ({
  width: "2px",
  backgroundColor: theme.vars.palette.border,
  position: "absolute",
  top: "40px",
  bottom: "0",
  left: "27px",
  zIndex: "1",
}));

const HorizontalLine = styled.div(({ theme }) => ({
  width: "100%",
  height: "1px",
  backgroundColor: theme.vars.palette.border,
  margin: "20px 0",
}));

const ReplyContent = styled.div(() => ({
  marginLeft: "0px",
  zIndex: "2",
  width: "100%",
}));

export default function ConversationList(props: { casts: CastCardProps[] }) {
  return (
    <StyledConversationList>
      {props.casts.map((cast, index) => (
        <ReplyWrapper key={index}>
          {index !== 0 && <VerticalLine style={{ left: "42px" }} />}
          <ReplyContent>
            <CastCard isEmbed={false} {...cast} />
            {index === 0 && <HorizontalLine />}
            {cast.direct_replies && cast.direct_replies.length > 0 && (
              cast.direct_replies.map((reply, replyIndex) => (
                <ReplyWrapper key={replyIndex}>
                  <VerticalLine style={{ left: "42px" }} />
                  <ReplyContent>
                    <CastCard isEmbed={false} {...reply} />
                  </ReplyContent>
                </ReplyWrapper>
              ))
            )}
          </ReplyContent>
        </ReplyWrapper>
      ))}
    </StyledConversationList>
  );
}