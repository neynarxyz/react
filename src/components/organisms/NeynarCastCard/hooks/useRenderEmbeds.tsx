import React from "react";
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
const domainErrorTracker = new Map<string, boolean>();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchOpenGraphData = async (url: string, retryCount = 0): Promise<OpenGraphData> => {
  const domain = new URL(url).hostname;

  if (domainErrorTracker.get(domain)) {
    return { ogImage: '', ogTitle: '', ogDescription: '' };
  }

  if (openGraphCache.has(url)) {
    return openGraphCache.get(url)!;
  }

  if (pendingRequests.has(url)) {
    return pendingRequests.get(url)!;
  }

  const fetchPromise = (async () => {
    try {
      await delay(100);
      // note: `METADATA_PROXY_URL` is a public(non-Neynar) proxy to avoid CORS issues when retrieving opengraph metadata. Feel free to substitute with your own proxy if you'd rather.
      const response = await fetch(`${METADATA_PROXY_URL}?url=${encodeURIComponent(url)}`, { method: 'GET' });

      if (!response.ok) {
        if (response.status === 429 && retryCount < 5) {
          const backoff = Math.pow(2, retryCount) * 1000;
          await delay(backoff);
          return fetchOpenGraphData(url, retryCount + 1);
        }
        domainErrorTracker.set(domain, true);
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

const requestQueue: (() => Promise<void>)[] = [];
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 5;

const enqueueRequest = (requestFn: () => Promise<void>) => {
  requestQueue.push(requestFn);
  processQueue();
};

const processQueue = async () => {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) {
    return;
  }

  activeRequests++;
  const nextRequest = requestQueue.shift();
  if (nextRequest) {
    await nextRequest();
  }
  activeRequests--;

  processQueue();
};

const ImageWrapper: React.FC<ImageWrapperProps> = ({ src, alt, style }) => (
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
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
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
      muted={true}
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

const isImageUrl = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(url) || url.startsWith('https://imagedelivery.net');
};

const useRenderEmbeds = (
  embeds: Embed[],
  allowReactions: boolean,
  viewerFid?: number
): React.ReactNode[] => {
  const [renderedEmbeds, setRenderedEmbeds] = React.useState<React.ReactNode[]>([]);

  const processEmbeds = React.useCallback(async (embeds: Embed[]): Promise<React.ReactNode[]> => {
    const embedComponents = await Promise.all(embeds.map(async (embed) => {
      if (embed.url) {
        const url = embed.url;
        if (isImageUrl(url)) {
          return <ImageWrapper key={url} src={url} alt="Embedded image" />;
        } else if (url.endsWith('.m3u8') || url.endsWith('.mp4')) {
          return <NativeVideoPlayer key={url} url={url} />;
        } else {
          return new Promise<React.ReactNode>(resolve => {
            enqueueRequest(async () => {
              const { ogImage, ogTitle } = await fetchOpenGraphData(url);
              const domain = new URL(url).hostname.replace('www.', '');
              resolve(
                <StyledLink key={url} href={url} target="_blank" rel="noreferrer">
                  {ogImage && <img src={ogImage} alt={ogTitle} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ margin: 0 }}>{ogTitle || url}</p>
                    <p style={{ margin: 0, color: 'grey', fontSize: '12px' }}>{domain}</p>
                  </div>
                </StyledLink>
              );
            });
          });
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

  React.useEffect(() => {
    processEmbeds(embeds).then(setRenderedEmbeds);
  }, [embeds, processEmbeds]);

  return renderedEmbeds;
};

export { useRenderEmbeds };