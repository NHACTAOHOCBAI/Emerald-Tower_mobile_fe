export type VotingStatus = 'ongoing' | 'upcoming' | 'closed';

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
  updated_at: string;
  file_urls: string[];
  target_blocks: TargetBlock[];
  options: Option[];
  status?: VotingStatus;
}

export interface Option {
  id: number;
  voting_id: number;
  name: string;
  description: string;
  vote_count?: number;
}

export interface ResidentOption {
  id: number;
  resident_id: number;
  option_id: number;
  created_at: string;
}

export interface VoteResult {
  voting_id: number;
  total_votes: number;
  options: {
    id: number;
    name: string;
    vote_count: number;
    percentage: number;
  }[];
}
