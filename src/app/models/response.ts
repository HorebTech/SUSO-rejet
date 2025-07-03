export interface RejectResponse {
  status: string;
  message: string;
  timestamp: string;  // ISO string
  executed_by: string;
  workspace: string;
  stats: {
    total: number;
    commented: number;
    rejected: number;
    errors: number;
  };
  status_breakdown: {
    [key: string]: number;  // exemple: { "AlreadyRejected": 2 }
  };
  variables_stats: {
    [key: string]: number;  // exemple: { "S101Quniq_sexe": 1 }
  };
  actions: RejectAction[];
  details: string[];
}

export interface RejectAction {
  interview_id: string;
  variable: string;
  comment_added: boolean;
  rejected: boolean;
  already_rejected: boolean;
}