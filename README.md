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

2. Make sure peer dependencies are installed: `react`, `react-dom`, and `@pigment-css/react`.

   ```json
   {
    "hls.js": "^1.5.13",
    "@pigment-css/react": "^0.0.9",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "swr": "^2.2.5"
  }
   ```

   or if you want to install all at once:

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
- `fid` (number): The Farcaster ID of the user to display.
- `viewerFid?` (number): The Farcaster ID of the viewer. Default: undefined.

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
- `viewerFid?` (number): The Farcaster ID of the viewer. Default: undefined.
- `allowReactions?` (boolean, default = true): Whether to allow reactions on the cast, and when this is true the component default to using Neynar reactions

Usage:
```tsx
import { NeynarCastCard } from "@neynar/react";

<NeynarCastCard 
  type="url" 
  identifier="https://warpcast.com/dylsteck.eth/0xda6b1699" 
  viewerFid={1}  
/>
```

## Example app

Check out our [example app](https://github.com/neynarxyz/farcaster-examples/tree/main/wownar-react-sdk) for a demonstration of how to use `@neynar/react`.