export type VotingStatus = "ONGOING" | "UPCOMING" | "ENDED";

export interface TargetBlock {
  id: number;
  name: string;
}

export interface Voting {
  id: number;
  title: string;
  content: string;
  is_required: boolean;
  start_time: string;
  end_time: string;
  created_at: string;
  file_urls: string[];
  target_blocks: TargetBlock[];
  options: Option[];
  status?: VotingStatus;
  voted_option?: ResidentOption;
}

export interface Option {
  id: number;
  name: string;
  description?: string;
  vote_count?: number;
}

export interface ResidentOption {
  id: number;
  name: string;
}

export interface VoteResult {
  voting_id: number;
  voted_area: number;
  total: number;
  options: {
    id: number;
    name: string;
    vote_count: number;
    total_area: number;
    percentage: number;
  }[];
}
