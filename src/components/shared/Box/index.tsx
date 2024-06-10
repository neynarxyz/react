import { HTMLAttributes } from "react";
import { styled } from "@pigment-css/react";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  alignItems?: "center" | "flex-start" | "flex-end";
  justifyContent?: "center" | "flex-start" | "flex-end" | 'space-between' | 'space-around' | 'space-evenly';
  flexGrow?: number;
  flexShrink?: number;
  // Spacing styles
  spacing?: string;
  spacingTop?: string;
  spacingRight?: string;
  spacingBottom?: string;
  spacingLeft?: string;
  spacingVertical?: string;
  spacingHorizontal?: string;
};

export const Box = styled.div<BoxProps>({
  display: "flex",
  alignItems: props => props.alignItems || "flex-start",
  justifyContent: props => props.justifyContent || "flex-start",
  flexGrow: props => props.flexGrow || 'initial',
  flexShrink: props => props.flexShrink || 'initial',
  // Spacing styles
  marginTop: props => props.spacing ?? props.spacingVertical ?? props.spacingTop,
  marginRight: props => props.spacing ?? props.spacingHorizontal ?? props.spacingRight,
  marginBottom: props => props.spacing ?? props.spacingVertical ?? props.spacingBottom,
  marginLeft: props => props.spacing ?? props.spacingHorizontal ?? props.spacingLeft,
});

export const VBox = styled(Box)({
  flexDirection: "column",
});

export const HBox = styled(Box)({
  flexDirection: "row",
});
