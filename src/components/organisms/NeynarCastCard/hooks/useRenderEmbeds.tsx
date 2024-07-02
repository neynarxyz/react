import React from 'react';
import { METADATA_PROXY_URL, NEYNAR_API_URL } from '../../../../constants';
import { NeynarCastCard } from '..';
import { styled } from '@pigment-css/react';

type OpenGraphData = {
  'og:image'?: string;
  'og:title'?: string;
  'og:description'?: string;
};

const StyledLink = styled.a(({ theme }) => ({
  textDecoration: "underline",
  color: theme.vars.palette.text,
  overflowWrap: 'break-word',
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

    const ogImage = ogImageMeta ? ogImageMeta.getAttribute('content') || '' : '';
    const ogTitle = ogTitleMeta ? ogTitleMeta.getAttribute('content') || '' : '';
    const ogDescription = ogDescriptionMeta ? ogDescriptionMeta.getAttribute('content') || '' : '';

    return { ogImage, ogTitle, ogDescription };
  } catch (error) {
    console.error("Error fetching Open Graph data", error);
    return { ogImage: '', ogTitle: '' , ogDescription: '' };
  }
}

async function fetchCastByIdentifier({
  type,
  identifier,
  viewerFid,
  client_id
}: {
  type: 'url' | 'hash';
  identifier: string;
  viewerFid?: number;
  client_id: string;
}) {
  try {
    let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/cast?type=${identifier}&identifier=${identifier}${viewerFid ? `&viewer_fid=${viewerFid}` : ''}&client_id=${client_id}`;

    const response = await fetch(requestUrl);
    const data = await response.json();
    return data?.cast || null;
  } catch (error) {
    console.error("Error fetching cast by identifier", error);
    return null;
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

export const useRenderEmbeds = (embeds: Embed[], allowReactions: boolean, viewerFid?: number,): React.ReactNode[] => {
  const [renderedEmbeds, setRenderedEmbeds] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    const processEmbeds = async () => {
      const embedComponents = await Promise.all(embeds.map(async (embed) => {
        if (embed.url) {
          if (isImageUrl(embed.url)) {
            return <ImageWrapper key={embed.url} src={embed.url} alt={embed.url} isSingle={embeds.length === 1} />;
          } else {
            const { ogImage, ogTitle, ogDescription } = await fetchOpenGraphData(embed.url);
            return (
              <div key={embed.url} style={{
                display: 'flex',
                alignItems: 'center',
                height: '100px',
                width: '100%',
                maxWidth: '80%',
                padding: '10px',
                border: '1px solid grey',
                borderRadius: '10px',
                margin: '10px 0',
                wordWrap: 'break-word',
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}>
                {ogImage && <img src={ogImage} alt={ogTitle} style={{ marginRight: '10px', height: '100%', width: '100px', objectFit: 'cover', borderRadius: '5px' }} />}
                <StyledLink href={embed.url} target="_blank" rel="noreferrer">
                  {ogTitle || embed.url}
                </StyledLink>
              </div>
            );
          }
        } else if (embed.cast_id) {
          return (
            <div style={{ maxWidth: '85%' }} key={`cast-${embed?.cast_id.hash}`}>
              <NeynarCastCard key={embed.cast_id.fid} type="hash" identifier={embed.cast_id.hash} viewerFid={viewerFid} allowReactions={allowReactions}  />
            </div>
          );
        }
        return null;
      }));

      setRenderedEmbeds(embedComponents.filter((component) => component !== null));
    };

    processEmbeds();
  }, [embeds, viewerFid]);

  return renderedEmbeds;
};

export const EmbedContainer: React.FC<{ embeds: Embed[], viewerFid: number, allowReactions: boolean }> = ({ embeds, viewerFid, allowReactions }) => {
  const renderedEmbeds = useRenderEmbeds(embeds, allowReactions, viewerFid);

  const hasTwoImages = renderedEmbeds.length === 2 && renderedEmbeds.every(embed => 
    React.isValidElement(embed) && (embed as React.ReactElement<any>).type === ImageWrapper
  );

  const hasImageAndLink = renderedEmbeds.length === 2 && renderedEmbeds.some(embed => 
    React.isValidElement(embed) && (embed as React.ReactElement<any>).type === ImageWrapper
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: hasImageAndLink || hasTwoImages ? 'row' : 'column',
      gap: '10px',
      alignItems: 'stretch',
      width: '100%',
      overflow: 'hidden'
    }}>
      {renderedEmbeds.map((embed, index) => (
        <div key={index} style={{ flex: hasImageAndLink || hasTwoImages ? '1' : 'none', width: '100%', height: '100%', overflow: 'hidden' }}>
          {React.isValidElement(embed) && (embed as React.ReactElement<any>).type === ImageWrapper ? 
            React.cloneElement(embed as React.ReactElement<any>, { style: { height: '150px', width: '150px' } }) 
            : embed}
        </div>
      ))}
    </div>
  );
};
