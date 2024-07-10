import React, { memo } from "react";
import { styled } from "@pigment-css/react";
import { CastCard, CastCardProps } from "./CastCard";

const StyledFeedList = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.vars.palette.border,
  borderRadius: "15px",
  padding: "10px",
  color: theme.vars.palette.text,
  fontFamily: theme.typography.fonts.base,
  fontSize: theme.typography.fontSizes.medium,
  backgroundColor: theme.vars.palette.background,
  boxSizing: "border-box",
  gap: "10px",
  margin: "0 auto",
  width: "auto",
  maxWidth: "100%"
}));

const VBoxContainer = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "auto",
  maxWidth: "608px",
  boxSizing: "border-box"
}));

export type FeedListProps = {
  casts: CastCardProps[];
  cursor: string;
};

export const FeedList = memo(
  ({ casts, cursor }: FeedListProps) => {
    return (
      <StyledFeedList>
        <VBoxContainer>
          {casts.map((cast: CastCardProps, index: number) => (
            <CastCard key={index} {...cast} />
          ))}
        </VBoxContainer>
      </StyledFeedList>
    );
  }
);