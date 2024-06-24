import React from "react";

const ImageWrapper = ({ src, alt, isSingle }: { src: string, alt: string, isSingle: boolean }) => (
  <img
    src={src}
    alt={alt}
    style={{
      display: "block",
      height: "200px",
      width: isSingle ? "auto" : "100%",
      objectFit: "cover",
      border: "1px solid grey",
      borderRadius: "10px",
      margin: "10px 0",
    }}
  />
);

export const useRenderEmbeds = (embeds: any[]): React.ReactNode[] => {
  const isSingle = embeds.length === 1;
  const renderedEmbeds: React.ReactNode[] = [];

  embeds.forEach((embed: any) => {
    if (embed.url) {
      renderedEmbeds.push(
        <ImageWrapper key={embed.url} src={embed.url} alt={embed.url} isSingle={isSingle} />
      );
    }
  });

  return renderedEmbeds;
};
