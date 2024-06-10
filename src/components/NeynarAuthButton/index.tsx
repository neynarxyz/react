import React, { useCallback, useEffect, useState, useRef } from "react";
import { styled } from "@pigment-css/react";
import PlanetBlackIcon from "./icons/PlanetBlackIcon";
import { useNeynarContext } from "../../contexts";
import { useAuth } from "../../contexts/AuthContextProvider";
import { useLocalStorage } from "../../hooks";
import { LocalStorageKeys } from "../../hooks/use-local-storage-state";
import { INeynarAuthenticatedUser } from "../../types/common";
import { SIWN_variant } from "../../enums";
import { FarcasterIcon } from "./icons/FarcasterIcon";
import { WarpcastIcon } from "./icons/WarpcastIcon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
  variant?: SIWN_variant;
  modalStyle?: React.CSSProperties;
  modalButtonStyle?: React.CSSProperties;
}

const Img = styled.img({
  width: "20px",
  height: "20px",
  borderRadius: "50%",
});

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
  cursor: "pointer",
  textDecoration: "none",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  transition: "background-color 0.3s",
}));

const Modal = styled.div((props) => ({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  rowGap: "20px",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  zIndex: "1000",
  fontFamily: props.theme.typography.fonts.base,
  fontSize: props.theme.typography.fontSizes.medium,
  "> img": {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
  },
  "> span": {
    color: "#000",
    fontWeight: "bold",
  },
}));

const ModalButton = styled.button({
  width: "100%",
  padding: "10px 0",
  backgroundColor: "#ffffff",
  color: "#000000",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background-color 0.2s",
  "&:hover": {
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
  },
});

export const NeynarAuthButton: React.FC<ButtonProps> = ({
  children,
  label = "Sign in with Neynar",
  icon = <PlanetBlackIcon />,
  variant = SIWN_variant.NEYNAR,
  modalStyle = {},
  modalButtonStyle = {},
  ...rest
}) => {
  const { client_id, user, isAuthenticated } = useNeynarContext();
  const { setIsAuthenticated, setUser, onAuthSuccess, onSignout } = useAuth();
  const [_, setNeynarAuthenticatedUser, removeNeynarAuthenticatedUser] =
    useLocalStorage<INeynarAuthenticatedUser>(
      LocalStorageKeys.NEYNAR_AUTHENTICATED_USER
    );
  const [showModal, setShowModal] = useState(false);

  // Using useRef to store the authWindow reference
  const authWindowRef = useRef<Window | null>(null);
  const neynarLoginUrl = `${process.env.NEYNAR_LOGIN_URL ?? "https://app.neynar.com/login"}?client_id=${client_id}`;
  const authOrigin = new URL(neynarLoginUrl).origin;

  const modalRef = useRef<HTMLDivElement>(null);

  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      if (
        event.origin === authOrigin &&
        event.data &&
        event.data.is_authenticated
      ) {
        setIsAuthenticated(true);
        authWindowRef.current?.close();
        window.removeEventListener("message", handleMessage); // Remove listener here
        const _user = {
          signer_uuid: event.data.signer_uuid,
          ...event.data.user,
        };
        setNeynarAuthenticatedUser(_user);
        setUser(_user);
        onAuthSuccess({ user: _user });
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

  const handleSignOut = () => {
    if (user) {
      const _user = user;
      removeNeynarAuthenticatedUser();
      setIsAuthenticated(false);
      closeModal();
      const { signer_uuid, ...rest } = _user;
      onSignout(rest);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    return () => {
      window.removeEventListener("message", handleMessage); // Cleanup function to remove listener
    };
  }, [handleMessage]);

  const handleOutsideClick = useCallback((event: any) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal, handleOutsideClick]);

  const getLabel = () => {
    switch (variant) {
      case SIWN_variant.FARCASTER:
        return "Sign in with Farcaster";
      case SIWN_variant.NEYNAR:
        return "Sign in with Neynar";
      case SIWN_variant.WARPCAST:
        return "Sign in with Warpcast";
      default:
        return "Sign in with Neynar";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case SIWN_variant.FARCASTER:
        return <FarcasterIcon />;
      case SIWN_variant.NEYNAR:
        return <PlanetBlackIcon />;
      case SIWN_variant.WARPCAST:
        return <WarpcastIcon />;
      default:
        return <PlanetBlackIcon />;
    }
  };

  return (
    <>
      {showModal && (
        <Modal style={modalStyle} ref={modalRef}>
          <Img src={user?.pfp_url} alt={user?.username} />
          <span>@{user?.username}</span>
          <ModalButton style={modalButtonStyle} onClick={handleSignOut}>
            Sign out
          </ModalButton>
        </Modal>
      )}
      <Button onClick={!isAuthenticated ? handleSignIn : openModal} {...rest}>
        {!isAuthenticated ? (
          <>
            {getIcon()}
            <span
              style={
                variant === SIWN_variant.NEYNAR
                  ? { marginLeft: "10px" }
                  : { marginRight: "7px" }
              }
            >
              {getLabel()}
            </span>
          </>
        ) : (
          <>
            <Img src={user?.pfp_url} alt={user?.username} />
            <span style={{ marginLeft: "10px" }}>@{user?.username}</span>
          </>
        )}
      </Button>
    </>
  );
};
