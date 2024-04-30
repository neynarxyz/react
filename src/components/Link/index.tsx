import { styled } from "@pigment-css/react";

export const Link = styled("a", { shouldForwardProp: (prop) => prop !== "outlined" })<{
  outlined?: boolean;
}>(({ theme }) => ({
  fontSize: "1rem",
  background: "rgba(0 0 0 / 0.04)",
  padding: "0.8rem 1rem",
  letterSpacing: "1px",
  borderRadius: "8px",
  textAlign: "center",
  ...theme.applyStyles("dark", {
    background: "rgba(255 255 255 / 0.1)",
  }),
  variants: [
    {
      props: { outlined: true },
      style: {
        background: "transparent",
        color: `hsl(${theme.vars.palette.primary})`,
        border: `1px solid hsl(${theme.vars.palette.border})`,
      },
    },
  ],
}));
