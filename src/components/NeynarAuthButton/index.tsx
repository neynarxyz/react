import React from "react";
import { styled } from "@pigment-css/react";
import PlanetBlackIcon from "./icons/PlanetBlackIcon";

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

// color: ${(props) => props.theme.vars.palette.primary};

const Button = styled.button`
  background-color: #ffffff;
  border: none;
  color: ${(props) => props.theme.vars.palette.primary};
  padding: 15px;
  font-size: 15px;
  font-weight: 600;
  line-height: 18.9px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
`;

export const NeynarAuthButton: React.FC<ButtonProps> = ({
  label = "Sign in with Neynar",
  onClick,
}) => (
  <Button onClick={onClick}>
    <PlanetBlackIcon />
    <span>{label}</span>
  </Button>
);
