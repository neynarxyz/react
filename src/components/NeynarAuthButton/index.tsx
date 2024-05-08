import React from "react";
import { styled } from "@pigment-css/react";
import PlanetBlackIcon from "./icons/PlanetBlackIcon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

const Button = styled.button<ButtonProps>((props) => ({
  backgroundColor: "#ffffff",
  border: "none",
  color: "#000000",
  padding: "15px",
  fontSize: "15px",
  fontWeight: "600",
  lineHeight: "18.9px",
  borderRadius: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  cursor: "pointer",
  textDecoration: "none",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  transition: "background-color 0.3s",
}));

export const NeynarAuthButton: React.FC<ButtonProps> = ({
  label = "Sign in with Neynar",
  children,
  ...rest
}) => (
  <Button {...rest}>
    <PlanetBlackIcon />
    {label}
  </Button>
);
