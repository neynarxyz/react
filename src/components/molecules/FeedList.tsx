import React, { memo } from "react";
import { styled } from "@pigment-css/react";
import { CastCard, CastCardProps } from "./CastCard";

const StyledFeedList = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.vars.palette.border,
  borderRadius: "0px",
  color: theme.vars.palette.text,
  fontFamily: theme.typography.fonts.base,
  fontSize: theme.typography.fontSizes.medium,
  backgroundColor: theme.vars.palette.background,
  gap: "5px",
  paddingTop: "10px",
  paddingBottom: "10px",
  paddingLeft: "20px",
  width: 'auto',
  maxWidth: "700px",
}));

const HorizontalLine = styled.div(({ theme }) => ({
  width: "100%",
  height: "1px",
  backgroundColor: theme.vars.palette.border,
}));

export type FeedListProps = {
  casts: CastCardProps[];
  cursor: string;
};

export const FeedList = memo(
  ({ casts, cursor }: FeedListProps) => {
    return (
      <StyledFeedList>
        {casts.map((cast: CastCardProps, index: number) => (
          <React.Fragment key={index}>
            <CastCard {...cast} />
          </React.Fragment>
        ))}
      </StyledFeedList>
    );
  }
);