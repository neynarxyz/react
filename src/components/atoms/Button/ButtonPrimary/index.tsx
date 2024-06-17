import { styled } from "@pigment-css/react";

const ButtonPrimary = styled.button(({ theme }) => ({
  border: "none",
  borderRadius: "7px",
  padding: "13px 15px",
  backgroundColor: theme.colors.primary,
  color: "#fff",
  fontWeight: theme.typography.fontWeights.bold,
  lineHeight: 1,
  cursor: "pointer",
  "& + &": {
    marginLeft: "10px",
  },
}));

export default ButtonPrimary;
