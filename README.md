# @neynar/react

## Introduction

`@neynar/react` is the official Frontend SDK from [Neynar](https://neynar.com/). This SDK includes React components to build Farcaster clients.

## Installation

1) Install the `@neynar/react` package using npm or yarn.

- For yarn

  ```bash
  yarn add @neynar/react
  ```

- For npm

  ```bash
  npm install @neynar/react
  ```

2. Make sure peer dependencies are installed: `react`, `react-dom`, and `@pigment-css/react`.

```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "@pigment-css/react": "^0.0.9"
}
```

or if you want to install all at once:

- For yarn

  ```bash
  yarn add react react-dom @pigment-css/react
  ```

- For npm

  ```bash
  yarn add react react-dom @pigment-css/react
  ```

3. Import the following CSS file in your project's root file(eg. `layout.tsx` for a Next.js app)
  
  ```tsx
  import "@neynar/react/dist/style.css";
  ```

## Example app

Check out our [example app](https://github.com/neynarxyz/farcaster-examples/tree/main/wownar-react-sdk) for a demonstration of how to use `@neynar/react`.