import * as moment from 'moment';
import {
    TreeNode, TreeNodeSection, TreeNodeSectionQuestion,
    ResponseSubmissionAns, ResponsesSubmission
} from './node.interfaces';

export class TreeProcessor {

    nodesSections: [TreeNodeSection];
    constructor(nodesSections) {
        this.nodesSections = nodesSections;
    }

    renderTree() {

        let nodeSectionsContent = '';
        this.nodesSections.map((section: TreeNodeSection) => {
            nodeSectionsContent = nodeSectionsContent + this.renderCollapsibleNodeSection(section);
        });
        return nodeSectionsContent;
    }

    renderCollapsibleNodeSection(section: TreeNodeSection) {
        let collapsibleNodeSectionContent: TreeNodeSection = section;
        const differentDescriptionFromName = () => {
            /* 
            Bug? - Descripiton.length !== name.length when  visually Descripiton.length == name.length. WHY???
            */
            // console.log(collapsibleNodeSectionContent.name.replace(/\s+/g, '').length, collapsibleNodeSectionContent.description.replace(/\s+/g, '').length);
            // console.log(collapsibleNodeSectionContent.name.split("").length, collapsibleNodeSectionContent.description.split("").length);
            if (collapsibleNodeSectionContent.description.replace(/\s+/g, '') !== collapsibleNodeSectionContent.name.replace(/\s+/g, '')) {
                return collapsibleNodeSectionContent.description
            } else {
                return '';
            }
        };
        let description = differentDescriptionFromName();
        const _date = new Date(collapsibleNodeSectionContent.created)
        let date = moment(_date).format('DD/MM/YYYY');
        let htmlSectionContent = `
        <div class="border  m-5 py-5  bg-white shadow overflow-hidden sm:rounded-lg">
            <button id="collapsible-button"
                class="border border-b-2 shadow-sm text-sm ml-2 px-2 font-medium rounded-md py-2 hover:bg-blue-300">
                ${collapsibleNodeSectionContent.name}
            </button>
            <div class="content sm:px-6 px-4">
               <p> 

               </p>
               <div class="">
                    <p> 
                        <span>
                            Depth: 
                        </span>
                        ${collapsibleNodeSectionContent.depth}
                    </p>
                    <p> 
                        <span>
                            Created On: 
                        </span>
                            ${date}
                    </p>
               </div>
               <div class="">

                    <p>
                    Questions
                    </p>


                    <div class="mt-5 md:mt-0">
                        <form id="">
                            <div class="shadow-lg sm:rounded-md sm:overflow-hidden">
                                <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                                    <div class="flex flex-col">
                                        <div class="col-span-3 sm:col-span-2">
                                            <label for="company-website" class="block text-sm font-medium text-gray-700">
                                                Website
                                            </label>
                                        </div>    
                                        <div class="mt-1 flex rounded-md shadow-sm">
                                            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            http://
                                            </span>
                                            <input type="text" name="company-website" id="company-website" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="www.example.com">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>    
        `

        return htmlSectionContent;
    }

    renderCollapsibleNodeSectionQuestions(questions: [TreeNodeSectionQuestion]) {
        let collapsibleSectionHtmlContent = ``;


        let probableQuestionNodes = [
            {

            }
        ];
        questions.map((question: TreeNodeSectionQuestion) => {

        });
    }
    init() {
        this.renderTree();
    }
}