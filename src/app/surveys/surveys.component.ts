import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";
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

  private startSurveyListener: () => void;
  private inputListener: () => void;

  surveyAnswers = [];
  surveyBeginTime;

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
        // console.log(event.target);
        console.log((event.target as Element).classList.contains("tree-parent"));
        /* 
        Node Tree Toggling
        */

        if ((event.target as Element).classList.contains("tree-parent")) {

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
          for(const nodeToggler of nodeTogglers) {
            if(nodeToggler.id === (event.target as Element).id){  
              if(nodeToggler.classList.contains("rotate-90")){
                nodeToggler.classList.remove("rotate-90");
              } else {
                nodeToggler.classList.add("rotate-90");
              }
            }
          }
        };

        /* 
        
        Survey filling initiation

        Based on the following premises: 
        - that user's are aware that survey prescanning is not part of flow
        - Time taken to fill survey is valuable if reflects accurately the time taken to read, comprehend and react to survey - then submit
        */
        if ((event.target as Element).classList.contains("begin-survey")) {
          let surveyFormSections: HTMLCollectionOf<Element> = document.getElementsByClassName("survey-form-section");
          for(const surveyFormSection of surveyFormSections){
            if(surveyFormSection.id === (event.target as Element).id){
              if(surveyFormSection.classList.contains("opacity-25")) {
                surveyFormSection.classList.remove("opacity-25");
              } else {
                surveyFormSection.classList.add("opacity-25");
              };
            };
          };
        };

      };

    });

    this.inputListener = this.renderer.listen(document, 'change', event => {

      if (event.target instanceof HTMLElement) {
        console.log(event.target);
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

  answerSurvey() {

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
