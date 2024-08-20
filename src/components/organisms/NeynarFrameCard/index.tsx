import React, { useState, useEffect } from "react";
import { useNeynarContext } from "../../../contexts";
import { METADATA_PROXY_URL, NEYNAR_API_URL } from "../../../constants";
import customFetch from "../../../utils/fetcher";
import FrameCard from "../../molecules/FrameCard";
import { ToastType } from "../../atoms/Toast/ToastItem";
import { useLocalStorage } from "../../../hooks";
import { INeynarAuthenticatedUser } from "../../../types/common";
import { LocalStorageKeys } from "../../../hooks/use-local-storage-state";

export type NeynarFrame = {
  version: string;
  title: string;
  image: string;
  image_aspect_ratio: string;
  buttons: {
    index: number;
    title: string;
    action_type: string;
    target?: string;
    post_url?: string;
  }[];
  input: {
    text?: string;
  };
  state: object;
  frames_url: string;
};

export type NeynarFrameCardProps = {
  url: string;
  onFrameBtnPress: (
    btnIndex: number,
    localFrame: NeynarFrame,
    setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>,
    inputValue?: string
  ) => Promise<NeynarFrame>;
  initialFrame?: NeynarFrame;
};

export const NeynarFrameCard: React.FC<NeynarFrameCardProps> = ({ url, onFrameBtnPress, initialFrame }) => {
  const { client_id, showToast } = useNeynarContext();
  const [storedUser] = useLocalStorage<INeynarAuthenticatedUser | null>(
    LocalStorageKeys.NEYNAR_AUTHENTICATED_USER,
    null
  );
  const [signerValue, setSignerValue] = useState<string | null>(null);
  const [frame, setFrame] = useState<NeynarFrame | null>(initialFrame ? initialFrame : null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (storedUser) {
      setSignerValue(storedUser.signer_uuid);
    } else {
      console.warn("No NEYNAR_AUTHENTICATED_USER found in local storage.");
    }
  }, [storedUser]);

  useEffect(() => {
    if (!initialFrame) {
      const fetchMetadata = async () => {
        try {
          const response = await fetchWithTimeout(`${NEYNAR_API_URL}/v2/farcaster/frame/crawl?url=${url}&client_id=${client_id}`, { method: "GET" });
          
          if (response.ok) {
            const data = await response.json();
            const frame: NeynarFrame = data.frame;
            
            if (Object.keys(frame).length === 0) {
              throw new Error("No frame data available");
            }
            
            setFrame(frame);
            setError(null);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.error(`An error occurred: ${error}`);
          setError(`Failed to fetch: ${(error as Error).message}`);
        }
      };

      fetchMetadata();
    }
  }, [url, showToast, initialFrame]);

  const handleFrameBtnPress = async (
    btnIndex: number,
    localFrame: NeynarFrame,
    setLocalFrame: React.Dispatch<React.SetStateAction<NeynarFrame>>,
    inputValue?: string
  ) => {
    try {
      const updatedFrame = await onFrameBtnPress(btnIndex, localFrame, setLocalFrame, inputValue);
      setLocalFrame(updatedFrame);
    } catch (error) {
      showToast(ToastType.Error, `An error occurred while processing the button press: ${error}`);
    }
  };

  if (error) {
    return (
      <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '5px' }}>
        {error}
      </div>
    );
  }

  return (
    <FrameCard
      frame={frame}
      onFrameBtnPress={handleFrameBtnPress}
    />
  );
};

function fetchWithTimeout(url: string, options: RequestInit, timeout: number = 8000): Promise<Response> {
  return Promise.race([
    customFetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
}