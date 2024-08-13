import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hls from 'hls.js';
import { METADATA_PROXY_URL } from "../../../../constants";
import { NeynarCastCard } from "..";
import { styled } from "@pigment-css/react";

interface OpenGraphData {
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
}

interface Embed {
  url?: string;
  cast_id?: {
    fid: number;
    hash: string;
  };
}

interface ImageWrapperProps {
  src: string;
  alt: string;
  isSingle: boolean;
  style?: React.CSSProperties;
}

interface NativeVideoPlayerProps {
  url: string;
}

const StyledLink = styled.a(({ theme }) => ({
  textDecoration: "none",
  color: theme.vars.palette.text,
  overflowWrap: "break-word",
  display: 'flex',
  alignItems: 'center',
  border: '1px solid grey',
  borderRadius: '8px',
  padding: '8px',
  gap: '8px',
}));

const openGraphCache = new Map<string, OpenGraphData>();
const pendingRequests = new Map<string, Promise<OpenGraphData>>();

const fetchOpenGraphData = async (url: string): Promise<OpenGraphData> => {
  if (openGraphCache.has(url)) {
    return openGraphCache.get(url)!;
  }

  if (pendingRequests.has(url)) {
    return pendingRequests.get(url)!;
  }

  const fetchPromise = (async () => {
    try {
      // note: `METADATA_PROXY_URL` is a public(non-Neynar) proxy to avoid CORS issues when retrieving opengraph metadata. Feel free to substitute with your own proxy if you'd rather.
      const response = await fetch(`${METADATA_PROXY_URL}?url=${url}`, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Failed to fetch Open Graph data: ${response.statusText}`);
      }

      const data = await response.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      const ogImageMeta = doc.querySelector('meta[property="og:image"]');
      const ogTitleMeta = doc.querySelector('meta[property="og:title"]');
      const ogDescriptionMeta = doc.querySelector('meta[property="og:description"]');
      const titleTag = doc.querySelector('title');

      const ogImage = ogImageMeta ? ogImageMeta.getAttribute('content') || '' : '';
      const ogTitle = ogTitleMeta ? ogTitleMeta.getAttribute('content') || '' : (titleTag ? titleTag.innerText : '');
      const ogDescription = ogDescriptionMeta ? ogDescriptionMeta.getAttribute('content') || '' : '';

      const openGraphData: OpenGraphData = { ogImage, ogTitle, ogDescription };
      openGraphCache.set(url, openGraphData);
      return openGraphData;
    } catch (error) {
      console.error("Error fetching Open Graph data", error);
      return { ogImage: '', ogTitle: '', ogDescription: '' };
    } finally {
      pendingRequests.delete(url);
    }
  })();

  pendingRequests.set(url, fetchPromise);
  return fetchPromise;
};

const ImageWrapper: React.FC<ImageWrapperProps> = ({ src, alt, isSingle, style }) => (
  <img
    src={src}
    alt={alt}
    style={{
      display: 'block',
      height: 'auto',
      maxHeight: '150px',
      width: 'auto',
      maxWidth: '100%',
      objectFit: 'cover',
      border: '1px solid grey',
      borderRadius: '10px',
      margin: '10px 0',
      ...style,
    }}
  />
);

const NativeVideoPlayer: React.FC<NativeVideoPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported() && url.endsWith('.m3u8')) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current!.play();
        });
      } else {
        videoRef.current.src = url;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current!.play();
        });
      }
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      style={{
        width: 'auto',
        maxWidth: '100%',
        maxHeight: '400px',
        borderRadius: '10px',
        margin: '10px 0',
        objectFit: 'contain',
      }}
    />
  );
};

const useRenderEmbeds = (
  embeds: Embed[],
  allowReactions: boolean,
  viewerFid?: number
): React.ReactNode[] => {
  const [renderedEmbeds, setRenderedEmbeds] = useState<React.ReactNode[]>([]);

  const processEmbeds = useCallback(async (embeds: Embed[]): Promise<React.ReactNode[]> => {
    const embedComponents = await Promise.all(embeds.map(async (embed) => {
      if (embed.url) {
        if (embed.url.endsWith('.m3u8') || embed.url.endsWith('.mp4')) {
          return <NativeVideoPlayer key={embed.url} url={embed.url} />;
        } else {
          const { ogImage, ogTitle } = await fetchOpenGraphData(embed.url);
          const domain = new URL(embed.url).hostname.replace('www.', '');
          return (
            <StyledLink key={embed.url} href={embed.url} target="_blank" rel="noreferrer">
              {ogImage && <img src={ogImage} alt={ogTitle} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ margin: 0 }}>{ogTitle || embed.url}</p>
                <p style={{ margin: 0, color: 'grey', fontSize: '12px' }}>{domain}</p>
              </div>
            </StyledLink>
          );
        }
      } else if (embed.cast_id) {
        return (
          <div style={{ maxWidth: '85%' }} key={`cast-${embed.cast_id.hash}`}>
            <NeynarCastCard
              key={embed.cast_id.fid}
              type="hash"
              identifier={embed.cast_id.hash}
              viewerFid={viewerFid}
              allowReactions={allowReactions}
              renderEmbeds={false}
            />
          </div>
        );
      }
      return null;
    }));

    return embedComponents.filter((component) => component !== null) as React.ReactNode[];
  }, [allowReactions, viewerFid]);

  useEffect(() => {
    processEmbeds(embeds).then(setRenderedEmbeds);
  }, [embeds, processEmbeds]);

  return renderedEmbeds;
};

export { useRenderEmbeds };