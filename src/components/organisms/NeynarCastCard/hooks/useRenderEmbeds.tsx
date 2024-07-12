import React, { useEffect, useRef } from "react";
import Hls from 'hls.js';
import { METADATA_PROXY_URL } from "../../../../constants";
import { NeynarCastCard } from "..";
import { styled } from "@pigment-css/react";

type OpenGraphData = {
  "og:image"?: string;
  "og:title"?: string;
  "og:description"?: string;
};

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

async function fetchOpenGraphData(url: string): Promise<{ ogImage: string, ogTitle: string, ogDescription: string }> {
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
    return { ogImage, ogTitle, ogDescription };
  } catch (error) {
    console.error("Error fetching Open Graph data", error);
    return { ogImage: '', ogTitle: '', ogDescription: '' };
  }
}

type ImageWrapperProps = {
  src: string;
  alt: string;
  isSingle: boolean;
  style?: React.CSSProperties;
};

const ImageWrapper: React.FC<ImageWrapperProps> = ({ src, alt, isSingle, style }) => (
  <img
    src={src}
    alt={alt}
    style={{
      display: 'block',
      height: '150px',
      width: '150px',
      objectFit: 'cover',
      border: '1px solid grey',
      borderRadius: '10px',
      margin: '10px 0',
      ...style,
    }}
  />
);

type Embed = {
  url?: string;
  cast_id?: {
    fid: number;
    hash: string;
  };
};

const isImageUrl = (url: string): boolean => {
  return url.startsWith('https://imagedelivery.net') || /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(url);
};

const isM3u8Url = (url: string): boolean => {
  return url.endsWith('.m3u8');
};

const isMp4Url = (url: string): boolean => {
  return url.endsWith('.mp4');
};

const NativeVideoPlayer: React.FC<{ url: string }> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported() && isM3u8Url(url)) {
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

const removeLinksFromText = (text: string, urls: string[]): string => {
  let modifiedText = text;
  urls.forEach(url => {
    const linkRegex = new RegExp(url, 'g');
    modifiedText = modifiedText.replace(linkRegex, '');
  });
  return modifiedText;
};

export const useRenderEmbeds = (embeds: Embed[], allowReactions: boolean, viewerFid?: number): React.ReactNode[] => {
  const [renderedEmbeds, setRenderedEmbeds] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    const processEmbeds = async () => {
      const embedComponents = await Promise.all(embeds.map(async (embed) => {
        if (embed.url) {
          if (isImageUrl(embed.url)) {
            return <ImageWrapper key={embed.url} src={embed.url} alt={embed.url} isSingle={embeds.length === 1} />;
          } else if (isM3u8Url(embed.url) || isMp4Url(embed.url)) {
            return <NativeVideoPlayer key={embed.url} url={embed.url} />;
          } else {
            const { ogImage, ogTitle, ogDescription } = await fetchOpenGraphData(embed.url);
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
            <div style={{ maxWidth: '85%' }} key={`cast-${embed?.cast_id.hash}`}>
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

      setRenderedEmbeds(embedComponents.filter((component) => component !== null));
    };

    processEmbeds();
  }, [embeds, viewerFid, allowReactions]);

  return renderedEmbeds;
};

export const EmbedContainer: React.FC<{ embeds: Embed[], viewerFid: number, allowReactions: boolean, text: string }> = ({ embeds, viewerFid, allowReactions, text }) => {
  const renderedEmbeds = useRenderEmbeds(embeds, allowReactions, viewerFid);
  const embedUrls = embeds.map(embed => embed.url).filter(url => url) as string[];
  const modifiedText = removeLinksFromText(text, embedUrls);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5px',
      alignItems: 'stretch',
      width: '100%',
      overflow: 'hidden'
    }}>
      <div>{modifiedText}</div>
      {renderedEmbeds.map((embed, index) => (
        <div key={index} style={{ width: '100%', overflow: 'hidden' }}>
          {React.isValidElement(embed) && (embed as React.ReactElement<any>).type === ImageWrapper ?
            React.cloneElement(embed as React.ReactElement<any>, { style: { height: '150px', width: '100%' } })
            : embed}
        </div>
      ))}
    </div>
  );
};