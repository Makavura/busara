import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { NgxSpinnerService } from "ngx-spinner";
import { ResponseSubmissionAns } from 'src/lib/node.interfaces';
import { TreeProcessor } from '../../lib/nodes';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit, AfterViewInit, OnDestroy {

  forms: any;
  isLoading: Boolean;
  options: {};
  nodeSections;
  surveyAnswers: SurveyAnswer[] | any = [];

  private startSurveyListener: () => void;
  private inputListener: () => void;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.spinner.show();
    const headers = new HttpHeaders({ 'Authorization': "Token " });
    this.http.get(`http://fullstack-role.busara.io/api/v1/recruitment/forms/?node_type=Both`, { headers, observe: 'response' }).subscribe((response) => {
      this.forms = response.body["forms"];
      let treeProcessor = new TreeProcessor(this.forms[0]["pages"]);
      this.nodeSections = this.sanitizer.bypassSecurityTrustHtml(treeProcessor.renderTree());
      this.isLoading = false;
      this.spinner.hide();
    });

  }

  ngAfterViewInit() {

    this.startSurveyListener = this.renderer.listen(document, 'click', event => {

      if (event.target instanceof HTMLElement) {
        /* 
        Node Tree Toggling
        */

        if ((event.target as Element).classList.contains("tree-parent") && !(event.target as Element).classList.contains("submit-survey")) {

          /* 
          Render tree section
          */
          let treeNodeSections: HTMLCollectionOf<Element> = document.getElementsByClassName("tree-node-section");
          for (const treeNode of treeNodeSections) {
            if (treeNode.id === (event.target as Element).id) {
              if (treeNode.getAttribute("style") !== null && treeNode.getAttribute("style") == "display: none;") {
                this.renderer.setStyle(treeNode, "display", "block");
              } else if (treeNode.getAttribute("style") == null) {
                this.renderer.setStyle(treeNode, "display", "block");
              } else if (treeNode.getAttribute("style") !== null && treeNode.getAttribute("style") == "display: block;") {
                this.renderer.setStyle(treeNode, "display", "none");
              }
            };
          };

          /* 
          Toggle SVG to show status of viewing section
          */
          let nodeTogglers: HTMLCollectionOf<Element> = document.getElementsByClassName("tree-node-toggler");
          for (const nodeToggler of nodeTogglers) {
            if (nodeToggler.id === (event.target as Element).id) {
              if (nodeToggler.classList.contains("rotate-90")) {
                nodeToggler.classList.remove("rotate-90");
              } else {
                nodeToggler.classList.add("rotate-90");
              }
            }
          }
        };

        /* 
        
        Survey filling initiation
        Disable button

        Based on the following premises: 
        - that user's are aware that survey prescanning is not part of flow
        - Time taken to fill survey is valuable if reflects accurately the time taken to read, comprehend and react to survey - then submit
        */
        if ((event.target as Element).classList.contains("begin-survey")) {
          let surveyFormSections: HTMLCollectionOf<Element> = document.getElementsByClassName("survey-form-section");
          for (const surveyFormSection of surveyFormSections) {
            if (surveyFormSection.id === (event.target as Element).id) {
              if (surveyFormSection.classList.contains("opacity-25")) {
                surveyFormSection.classList.remove("opacity-25");
                let surveyAnswersObject: SurveyAnswer = {
                  ans: undefined,
                  endTime: undefined,
                  local_id: undefined,
                  location: {
                    accuracy: undefined,
                    lat: undefined,
                    lon: undefined
                  },
                  start_time: moment().format(),
                  survey_id: surveyFormSection.getAttribute('data-section-id')
                }
                if (!this.surveyAnswers.find(surveyAnswer => surveyAnswer.survey_id === surveyFormSection.getAttribute('data-section-id'))) {
                  this.surveyAnswers = this.surveyAnswers.concat(surveyAnswersObject);
                };
                this.renderer.setStyle((event.target as Element), "pointer-events", "none");
                (event.target as Element).classList.remove("bg-indigo-600");
                (event.target as Element).classList.add("bg-gray-200");
              }
            };
          };
        };

        /* 
        Survey Submission Event
        */

        if ((event.target as Element).classList.contains("submit-survey")) {
          let surveySubmissionTriggers: HTMLCollectionOf<Element> = document.getElementsByClassName("submit-survey");
          for (const surveySubmissionTrigger of surveySubmissionTriggers) {
            if (surveySubmissionTrigger.id === (event.target as Element).id) {
              /* 
              Collect Submission 
              Disable Button
              */
              if (this.surveyAnswers.find(surveyAnswer => surveyAnswer.survey_id === surveySubmissionTrigger.getAttribute('data-section-id'))) {
                const surveyAnswersObjectIndex = this.surveyAnswers.findIndex(surveyAnswer => surveyAnswer.survey_id === surveySubmissionTrigger.getAttribute('data-section-id'));
                if (surveyAnswersObjectIndex > -1) {
                  this.surveyAnswers[surveyAnswersObjectIndex].endTime = moment().format();
                  this.renderer.setStyle((event.target as Element), "pointer-events", "none");
                  (event.target as Element).classList.remove("bg-indigo-600");
                  (event.target as Element).classList.add("bg-gray-200");
                  let treeNodeSections: HTMLCollectionOf<Element> = document.getElementsByClassName("tree-node-section");
                  for (const treeNode of treeNodeSections) {
                    if (treeNode.id === (event.target as Element).id) {
                      treeNode.setAttribute("style", "display: none");
                    }
                  }
                  let nodeTogglers: HTMLCollectionOf<Element> = document.getElementsByClassName("tree-node-toggler");
                  for (const nodeToggler of nodeTogglers) {
                    if (nodeToggler.id === (event.target as Element).id) {
                      nodeToggler.classList.remove("rotate-90");
                    }
                  }
                  this.answerSurvey(this.surveyAnswers[surveyAnswersObjectIndex]);
                } else {
                  console.warn(`cannot find survey submission answer after initiation`);
                }
              };
            }
          }
        }

      };

    });

    this.inputListener = this.renderer.listen(document, 'input', event => {

      if (event.target instanceof HTMLElement) {
        /* 
        Find matching entry in survey responses
        if one does not exist
        append new
        if exists
        update q_ans
        */

        let answerObject: ResponseSubmissionAns = {
          q_ans: event.target.value,
          q_id: (event.target as Element).getAttribute('data-q-id'),
          column_match: (event.target as Element).getAttribute('data-column-match')
        }

        if (this.surveyAnswers.find(surveyAnswer => surveyAnswer.survey_id === (event.target as Element).getAttribute('data-section-id'))) {
          /*  Matching survey answer found  */
          const surveyAnswersObjectIndex = this.surveyAnswers.findIndex(surveyAnswer => surveyAnswer.survey_id === (event.target as Element).getAttribute('data-section-id'));
          if (surveyAnswersObjectIndex > -1) {

            if (!this.surveyAnswers[surveyAnswersObjectIndex].ans) {
              /*  first time, ans object non existent */
              this.surveyAnswers[surveyAnswersObjectIndex].ans = new Array(answerObject);
            } else {

              if (this.surveyAnswers[surveyAnswersObjectIndex].ans.filter(_ans => _ans.q_id == answerObject.q_id).length > 0) {
                this.surveyAnswers[surveyAnswersObjectIndex].ans.map(answer => {
                  if (answer.column_match == answerObject.column_match && answer.q_id == answerObject.q_id) {
                    answer.q_ans = answerObject.q_ans;
                    this.surveyAnswers[surveyAnswersObjectIndex].ans = this.surveyAnswers[surveyAnswersObjectIndex].ans;
                    console.log(this.surveyAnswers[surveyAnswersObjectIndex].ans);
                  }
                })
              } else {
                this.surveyAnswers[surveyAnswersObjectIndex].ans = JSON.parse(JSON.stringify(this.surveyAnswers[surveyAnswersObjectIndex].ans.concat(answerObject)));
                console.log(this.surveyAnswers[surveyAnswersObjectIndex].ans);
              }
            }
          }
        }
      };

    });



  }

  /* 
  
  Logic - RoadMap

  1. Log survey time - Initaite survey asnwer => disable form view, button- start survey, 
    which removes shadow form view
  2. Map inputs to submissionEntry - use data attributes
  3. submit answer method
  
  */

  answerSurvey(surveyResponse: SurveyAnswer) {
    console.log(surveyResponse);
  }

  ngOnDestroy() {
    this.startSurveyListener();
    this.inputListener();
  }

}

interface SurveyAnswer {
  ans: [
    QuestionAnswer
  ];
  endTime: string;
  local_id: number;
  location: {
    accuracy: number,
    lat: number,
    lon: number
  };
  start_time: string;
  survey_id: string;
}

interface QuestionAnswer {
  /* 
  
  pages
    - sections
        - questions [] source of data attribute

        set data attributes
          data-column_match
          data-q_id
          data-q_ans - Not needed - populated from innerHTML

        while populating form HTML

  */
  column_match: string;
  q_ans: string;
  q_id: string;
}
