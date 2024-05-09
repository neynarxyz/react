export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface INeynarAuthenticatedUser {
  signer_uuid: string;
  object: "user";
  fid: number;
  username: string;
  display_name?: string;
  custody_address: string;
  pfp_url?: string;
  profile: {
    bio: {
      text: string;
      mentioned_profiles?: string[];
    };
  };
  follower_count: number;
  following_count: number;
  verifications?: string[];
  verified_addresses: {
    eth_addresses?: string[];
    sol_addresses?: string[];
  };
  active_status: "active" | "inactive";
  power_badge: boolean;
  viewer_context?: {
    following: boolean;
    followed_by: boolean;
  };
}

export interface IUser {
  object: "user";
  fid: number;
  username: string;
  display_name?: string;
  custody_address: string;
  pfp_url?: string;
  profile: {
    bio: {
      text: string;
      mentioned_profiles?: string[];
    };
  };
  follower_count: number;
  following_count: number;
  verifications?: string[];
  verified_addresses: {
    eth_addresses?: string[];
    sol_addresses?: string[];
  };
  active_status: "active" | "inactive";
  power_badge: boolean;
  viewer_context?: {
    following: boolean;
    followed_by: boolean;
  };
}
