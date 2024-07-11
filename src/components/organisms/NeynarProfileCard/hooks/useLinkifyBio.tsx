import React from "react";
import { styled } from "@pigment-css/react";

const WARPCAST_DOMAIN = "https://warpcast.com";

const channelRegex = /(^|\s)\/\w+/g;
const mentionRegex = /@\w+/g;
const urlRegex = /((https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?)/g;
const combinedRegex = new RegExp(
  `(${channelRegex.source})|(${mentionRegex.source})|(${urlRegex.source})`,
  "g"
);

const generateUrl = (match: string): string => {
  if (channelRegex.test(match)) {
    return `${WARPCAST_DOMAIN}/~/channel${match.trim()}`;
  } else if (mentionRegex.test(match)) {
    return `${WARPCAST_DOMAIN}/${match.substring(1)}`;
  } else if (urlRegex.test(match)) {
    return match.startsWith("http") ? match : `http://${match}`;
  }
  return "";
};

const StyledLink = styled.a(({ theme }) => ({
  textDecoration: "underline",
  color: theme.vars.colors.primary,
}));

export const useLinkifyBio = (text: string | undefined): React.ReactNode[] => {
  if (!text) return [];
  
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  let match;
  while ((match = combinedRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (lastIndex < matchIndex) {
      elements.push(text.slice(lastIndex, matchIndex));
    }

    const url = generateUrl(match[0]);
    elements.push(
      <StyledLink key={matchIndex} href={url} target="_blank">
        {match[0].trim()}
      </StyledLink>
    );

    lastIndex = combinedRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
};