import { styled, keyframes } from "@pigment-css/react";

const fadeInOut = keyframes`
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`;

export const ToastItem = styled("div")<{ type: string }>((props) => ({
  padding: "10px 20px",
  marginBottom: "10px",
  borderRadius: "5px",
  color: "#fff",
  animation: `${fadeInOut} 4s ease-out`,
  fontFamily: props.theme.typography.fonts.base,
  fontSize: props.theme.typography.fontSizes.medium,
  variants: [
    {
      props: { type: "success" },
      style: {
        backgroundColor: "#32cd32",
      },
    },
    {
      props: { type: "error" },
      style: {
        backgroundColor: "#ff6347",
      },
    },
    {
      props: { type: "warning" },
      style: {
        backgroundColor: "#ffa500",
      },
    },
    {
      props: { type: "info" },
      style: {
        backgroundColor: "#3498db",
      },
    },
  ],
}));

export enum ToastType {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Info = "info",
}
