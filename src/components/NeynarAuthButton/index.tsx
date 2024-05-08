import React, { useCallback, useEffect, useState, useRef } from "react";
import { styled } from "@pigment-css/react";
import PlanetBlackIcon from "./icons/PlanetBlackIcon";
import { useNeynar } from "../../contexts";
import { useAuth } from "../../contexts/AuthContextProvider";

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
  children,
  ...rest
}) => {
  const { client_id } = useNeynar();
  const { setIsAuthenticated } = useAuth();

  const [label, setLabel] = useState("Sign in with Neynar");

  // Using useRef to store the authWindow reference
  const authWindowRef = useRef<Window | null>(null);
  const neynarLoginUrl = `https://app.neynar.com/login?client_id=${client_id}`;
  const authOrigin = new URL(neynarLoginUrl).origin;

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (
        event.origin === authOrigin &&
        event.data &&
        event.data.is_authenticated
      ) {
        setIsAuthenticated(true);
        authWindowRef.current?.close();
        window.removeEventListener("message", handleMessage); // Remove listener here
      }
    },
    [client_id, setIsAuthenticated]
  );

  const handleSignIn = useCallback(() => {
    const width = 600,
      height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const windowFeatures = `width=${width},height=${height},top=${top},left=${left}`;

    authWindowRef.current = window.open(
      neynarLoginUrl,
      "_blank",
      windowFeatures
    );

    if (!authWindowRef.current) {
      console.error(
        "Failed to open the authentication window. Please check your pop-up blocker settings."
      );
      return;
    }

    window.addEventListener("message", handleMessage, false);
  }, [client_id, handleMessage]);

  useEffect(() => {
    return () => {
      window.removeEventListener("message", handleMessage); // Cleanup function to remove listener
    };
  }, [handleMessage]);

  return (
    <Button onClick={handleSignIn} {...rest}>
      <PlanetBlackIcon />
      {label}
    </Button>
  );
};
