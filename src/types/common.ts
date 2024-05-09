export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface INeynarAuthenticatedUser {
  fid: number;
  is_authenticated: boolean;
  signer_uuid: string;
  username: string;
  pfp_url: string;
}
