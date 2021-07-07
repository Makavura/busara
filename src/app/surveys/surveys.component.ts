import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit,Renderer2,ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";
import { TreeProcessor } from '../../lib/nodes';
import { TreeNodeRenderingService } from '../../lib/node.tree.services';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit{
  forms: any;
  isLoading: Boolean;
  options: {};
  nodeSections;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {  }

  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('nodeSection') nodeSection: ElementRef;
  @HostListener('document: click', ['$event'])
  onGlobalClick(event: Event): void {
    if(this.elementRef.nativeElement.contains(event.target)){
      if(event.target instanceof Element) {
        if((event.target as Element).classList.contains("tree-node-toggler")){
          let treeNodeSections: HTMLCollectionOf<Element> = document.getElementsByClassName("tree-node-section"); 
          for(const treeNode of treeNodeSections) {
            if(treeNode.id === (event.target as Element).id) {
              if(treeNode.getAttribute("style") !== null && treeNode.getAttribute("style") == "display: none;") {
                this.renderer.setStyle(treeNode, "display", "block");
                event.target.classList.add("rotate-90");
              } else if(treeNode.getAttribute("style") == null) {
                this.renderer.setStyle(treeNode, "display", "block");
                event.target.classList.add("rotate-90");
              } else if(treeNode.getAttribute("style") !== null && treeNode.getAttribute("style") == "display: block;") {
                 this.renderer.setStyle(treeNode, "display", "none");
                 event.target.classList.remove("rotate-90");
              }
            }
          }
        }
      }
    }
  }

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

}
