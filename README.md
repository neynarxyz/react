# @neynar/react

## Introduction

`@neynar/react` is the official Frontend SDK from [Neynar](https://neynar.com/). This SDK includes React components to build Farcaster clients.

You can also test the components out in our [Storybook](https://neynar-react.vercel.app).

## Installation

1. Install the `@neynar/react` package using npm or yarn.

   For **yarn**:
   ```bash
   yarn add @neynar/react
   ```

   For **npm**:
   ```bash
   npm install @neynar/react
   ```

2. Make sure that the following peer dependencies are installed.

   ```json
   {
    "hls.js": "^1.5.13",
    "@pigment-css/react": "^0.0.9",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "swr": "^2.2.5"
   }
   ```

   or if you want to install them all at once:

   For **yarn**:
   ```bash
   yarn add react react-dom @pigment-css/react hls.js swr
   ```

   For **npm**:
   ```bash
   npm install react react-dom @pigment-css/react hls.js swr
   ```

3. Import the following CSS file in your project's root file (e.g., `layout.tsx` for a Next.js app).

   ```tsx
   import "@neynar/react/dist/style.css";
   ```

## Components
_Note_: If you are using `<NeynarAuthButton />` or if you're using `<NeynarCastCard />` with `allowReactions` enabled (using Neynar reactions), please set your authorized origin to your local (localhost:6006 for Storybook) and production environments at [dev.neynar.com](https://dev.neynar.com).

### `<NeynarAuthButton />`
This component lets you embed a Sign In With Neynar button in your app, which you can use for read-only or read + write access to the user's Farcaster account.

Params:
- `label?` (string): The text to display on the button. Default: "Sign in with Neynar"
- `icon?` (ReactNode): The icon to display on the button. Default: Neynar logo
- `variant?` (SIWN_variant): The variant of the button. Default: "primary"
- `modalStyle?` (CSSProperties): The style of the modal. Default: {}
- `modalButtonStyle?` (CSSProperties): The style of the modal button. Default: {}

Usage:
```tsx
import { NeynarAuthButton } from "@neynar/react";

<NeynarAuthButton 
  primary={true} 
  label="Sign In with Neynar" 
/>
```

### `<NeynarProfileCard />`
This component displays a user's Farcaster profile information.

Params:
- `fid` (number): The FID of the user to display.
- `viewerFid?` (number): The FID of the viewer. Default: undefined.
- `customStyles?` (CSSProperties): Custom styles for the profile card. Default: {}

Usage:
```tsx
import { NeynarProfileCard } from "@neynar/react";

<NeynarProfileCard 
  fid={1} 
  viewerFid={1} 
/>
```

### `<NeynarCastCard />`
This component displays a specific cast (post) on Farcaster.

Params:
- `type` ('url' | 'hash'): The type of identifier used for the cast.
- `identifier` (string): The identifier (either URL or hash) for the cast.
- `viewerFid?` (number): The FID of the viewer. Default: undefined.
- `allowReactions?` (boolean, default = true): Whether to allow reactions on the cast, and when this is true the component default to using Neynar reactions
- `customStyles?` (CSSProperties): Custom styles for the cast card. Default: {}

Usage:
```tsx
import { NeynarCastCard } from "@neynar/react";

<NeynarCastCard 
  type="url" 
  identifier="https://warpcast.com/dylsteck.eth/0xda6b1699" 
  viewerFid={1}  
/>
```

### `<NeynarFeedList />`
This component displays a list of casts (posts) on Farcaster.

Params:
- `feedType` ('following' | 'filter'): The type of feed to display.
- `filterType?` ('fids' | 'parent_url' | 'channel_id' | 'embed_url' | 'global_trending'): The filter type to apply to the feed. Default: undefined.
- `fid?` (number): The FID to filter the feed by. Default: undefined.
- `fids?` (string): The FIDs to filter the feed by. Default: undefined.
- `parentUrl?` (string): The parent URL to filter the feed by. Default: undefined.
- `channelId?` (string): The channel ID to filter the feed by. Default: undefined.
- `embedUrl?` (string): The embed URL to filter the feed by. Default: undefined.
- `withRecasts?` (boolean): Whether to include recasts in the feed. Default: true.
- `limit?` (number): The number of casts to display. Default: undefined.
- `viewerFid?` (number): The FID of the viewer. Default: undefined.
- `clientId?` (string): The client ID for the Neynar API. Default: undefined.

Usage:
```tsx
import { NeynarFeedList } from "@neynar/react";

<NeynarFeedList 
  feed_type="filter" 
  filter_type="fids" 
  fids="2"
  viewerFid={2} 
/>
```

### `<NeynarConversationList />`
This component displays a conversation (thread) of casts (posts) on Farcaster.

Params:
- `type` ('url' | 'hash'): The type of identifier used for the conversation.
- `identifier` (string): The identifier (either URL or hash) for the conversation.
- `replyDepth?` (number): The depth of replies to include in the conversation. Default: 2.
- `includeChronologicalParentCasts?` (boolean): Whether to include chronological parent casts in the conversation. Default: false.
- `limit?` (number): The number of casts to display. Default: 20.
- `viewerFid?` (number): The FID of the viewer. Default: undefined.

Usage:
```tsx
import { NeynarConversationList } from "@neynar/react";

<NeynarConversationList 
  type="url" 
  identifier="https://warpcast.com/dwr.eth/0x1b0792bc" 
  replyDepth={2}
  limit={50}
  viewerFid={1}  
/>
```

## Example app

Check out our [example app](https://github.com/neynarxyz/farcaster-examples/tree/main/wownar-react-sdk) for a demonstration of how to use `@neynar/react`.