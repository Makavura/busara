import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit {
  forms: any;
  isLoading: Boolean;
  options: {};

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.spinner.show();
    const headers = new HttpHeaders({ 'Authorization': "Token " });
    this.http.get(`http://fullstack-role.busara.io/api/v1/recruitment/forms/?node_type=Both`, { headers, observe: 'response' }).subscribe((response) => {
      this.forms = response.body["forms"];
      console.log(this.forms)
      this.isLoading = false;
      this.spinner.hide();
    });
  }

  onEvent = ($event) => console.log($event);
}

interface TreeNode  {
  section: [ TreeNodeSection ]
}

interface TreeNodeSection {
  created: string;
  depth: number;
  description: string;
  name: string
  questions: [ TreeNodeSectionQuestion ]
}

interface TreeNodeSectionQuestion {
  column_match: string;
  created: string;
  description: string;
  error_message: string;
  text: string;
  type: string;
  is_visible: Boolean;
  id: number;
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

interface ResponsesSubmission {
  ans: [ ResponseSubmissionAns ];
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

interface ResponseSubmissionAns {
  column_match: string;
  q_ans: string;
  q_id: string;
}