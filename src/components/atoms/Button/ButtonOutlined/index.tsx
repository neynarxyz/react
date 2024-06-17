import { styled } from "@pigment-css/react";

const ButtonOutlined = styled.button(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme.vars.palette.border,
  borderRadius: "7px",
  padding: "10px",
  backgroundColor: "transparent",
  color: theme.vars.palette.text,
  fontWeight: theme.typography.fontWeights.bold,
  lineHeight: 1,
  cursor: "pointer",
  "& + &": {
    marginLeft: "10px",
  },
}));

export default ButtonOutlined;
