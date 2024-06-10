import { styled } from "@pigment-css/react";

const ButtonOutline = styled.button(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "var(--palette-border)",
  borderRadius: "7px",
  padding: "10px",
  backgroundColor: "transparent",
  color: "var(--palette-text)",
  fontWeight: theme.typography.fontWeights.bold,
  lineHeight: 1,
  cursor: "pointer",
  "& + &": {
    marginLeft: "10px",
  },
}));

export default ButtonOutline;
