/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

const Button = styled.button`
  background: hotpink;
  color: white;
  font-size: 16px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: palevioletred;
  }
`;

export const NeynarSigninButton: React.FC<ButtonProps> = ({
  children,
  onClick,
}) => <Button onClick={onClick}>{children}</Button>;
