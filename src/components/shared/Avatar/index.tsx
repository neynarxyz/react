import { styled } from "@pigment-css/react";

const Avatar = styled.img(() => ({
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  aspectRatio: 1 / 1,
  objectFit: "cover",
}));

export default Avatar;
