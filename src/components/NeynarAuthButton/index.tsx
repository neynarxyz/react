import React, { useCallback, useEffect, useState, useRef } from "react";
import { styled } from "@pigment-css/react";
import PlanetBlackIcon from "./icons/PlanetBlackIcon";
import { useNeynarContext } from "../../contexts";
import { useAuth } from "../../contexts/AuthContextProvider";
import { useLocalStorage } from "../../hooks";
import { ToastType } from "../Toast";
import axios from "axios";
import { INeynarAuthenticatedUser, IUser } from "../../types/common";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
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
  gap: "10px",
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
}));

const ModalButton = styled.button({
  width: "100%",
  padding: "10px 0",
  backgroundColor: "#ffffff",
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
  ...rest
}) => {
  const { client_id, showToast, user } = useNeynarContext();
  const { setIsAuthenticated, isAuthenticated, setUser } = useAuth();
  const [_, setNeynarAuthenticatedUser, removeNeynarAuthenticatedUser] =
    useLocalStorage<INeynarAuthenticatedUser>("neynar_authenticated_user");
  const [showModal, setShowModal] = useState(false);

  // Using useRef to store the authWindow reference
  const authWindowRef = useRef<Window | null>(null);
  const neynarLoginUrl = `${process.env.NEYNAR_LOGIN_URL ?? "https://app.neynar.com/login"}?client_id=${client_id}`;
  const authOrigin = new URL(neynarLoginUrl).origin;

  const fetchUser = async (fid: number) => {
    let user = null;
    try {
      // TODO: Create a custom hook to fetch data
      const {
        data: { users },
      } = await axios.get<{ users: IUser[] }>(
        `${process.env.API_URL ?? "https://sdk-api.neynar.com"}/v2/farcaster/user/bulk`,
        {
          params: {
            fids: fid,
            client_id,
          },
        }
      );

      user = users[0];
    } catch (err) {
      console.error("Failed to fetch user data", err);
      showToast(ToastType.Error, "Failed to fetch user data");
    }

    return user;
  };

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
        const user = await fetchUser(Number(event.data.fid));
        if (!user) {
          return;
        }
        const _user = {
          signer_uuid: event.data.signer_uuid,
          ...user,
        };
        setNeynarAuthenticatedUser(_user);
        setUser(_user);
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
    removeNeynarAuthenticatedUser();
    setIsAuthenticated(false);
    closeModal();
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    return () => {
      window.removeEventListener("message", handleMessage); // Cleanup function to remove listener
    };
  }, [handleMessage]);

  return (
    <>
      {showModal && (
        <Modal>
          <Img src={user?.pfp_url} alt={user?.username} />
          <span>@{user?.username}</span>
          <ModalButton onClick={handleSignOut}>Sign out</ModalButton>
        </Modal>
      )}
      <Button onClick={!isAuthenticated ? handleSignIn : openModal} {...rest}>
        {!isAuthenticated ? (
          <>
            <PlanetBlackIcon />
            <span>Sign in with Neynar</span>
          </>
        ) : (
          user && (
            <>
              <Img src={user?.pfp_url} alt={user?.username} />
              <span>@{user?.username}</span>
            </>
          )
        )}
      </Button>
    </>
  );
};
