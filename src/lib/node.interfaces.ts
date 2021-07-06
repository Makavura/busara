export interface TreeNode {
    section: [TreeNodeSection]
}

export interface TreeNodeSection {
    created: string;
    depth: number;
    description: string;
    name: string
    id: number;
    sections: [ TreeNodeSectionQuestions ]
}

export interface TreeNodeSectionQuestions {
    questions: [ TreeNodeSectionQuestion ]
}
export interface TreeNodeSectionQuestion {
    column_match: string;
    created: string;
    description: string;
    error_message: string;
    text: string;
    type: string;
    is_visible: Boolean;
    id: number;
    q_options: [ Q_Option ]
}

/* 
Tree View Survey Listing
forms []
  - pages []
      - sections []
          - questions []
 
Requirements:
- submission interface - ResponseSubmission
*/

export interface ResponsesSubmission {
    ans: [ResponseSubmissionAns];
    end_time: string;
    local_id: number;
    location: {
        accuracy: number,
        lat: number,
        lon: number
    }
    start_time: string;
    survey_id: string;
}

export interface ResponseSubmissionAns {
    column_match: string;
    q_ans: string;
    q_id: string;
}

export interface Q_Option {
    id: number;
    name: string;
    sort_order: number;
}