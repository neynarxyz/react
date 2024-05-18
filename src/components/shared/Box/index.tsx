import { HTMLAttributes } from "react";
import { styled } from "@pigment-css/react";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
    alignItems?: "center" | "flex-start" | "flex-end";
    justifyContent?: "center" | "flex-start" | "flex-end" | 'space-between' | 'space-around' | 'space-evenly';
    flexGrow?: number;
    flexShrink?: number;
};

export const Box = styled.div<BoxProps>({
    display: "flex",
    alignItems: props => props.alignItems || "flex-start",
    justifyContent: props => props.justifyContent || "flex-start",
    flexGrow: props => props.flexGrow || 'initial',
    flexShrink: props => props.flexShrink || 'initial',
});

export const VBox = styled(Box)({
    flexDirection: "column",
});

export const HBox = styled(Box)({
    flexDirection: "row",
});
