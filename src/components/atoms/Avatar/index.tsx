import { styled } from "@pigment-css/react";
import { HTMLAttributes } from "react";

interface IAvatarProps extends HTMLAttributes<HTMLImageElement> {
  width?: string;
  height?: string;
}

const Avatar = styled.img<IAvatarProps>(() => ({
  width: (props) => props.width || "45px",
  height: (props) => props.width || "45px",
  borderRadius: "50%",
  aspectRatio: 1 / 1,
  objectFit: "cover",
}));

export default Avatar;
