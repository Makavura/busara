import * as moment from 'moment';
import {
    TreeNode, TreeNodeSection, TreeNodeSectionQuestion, Q_Option,
    ResponseSubmissionAns, ResponsesSubmission
} from './node.interfaces';
import { Guid } from 'js-guid';

export class TreeProcessor {

    nodesSections: [TreeNodeSection];
    /* 
    
    Keep tabs of input elements

    column_match
    q_id
    q_ans

    use data attributes to store column match and q_id
    Fetch data attributes using renderer2 element referencing

    */
    nodeMapping = [];
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

    renderCollapsibleNodeSectionQuestions(questions: [TreeNodeSectionQuestion], section_id) {
        let collapsibleSectionHtmlContent = ``;

        questions.map((question: TreeNodeSectionQuestion) => {

            if (question.is_visible) {

                let guid = Guid.newGuid();
                const mapRadioOptions = (q_options: [Q_Option], radioOptionName: string) => {
                    let listed_radio_q_options = '';
                    q_options.map((q_option: Q_Option) => {
                        listed_radio_q_options = listed_radio_q_options + `
                        <div class="flex items-center">
                            <input id="${q_option.id}" data-section-id="${section_id}" name="${radioOptionName}" data-column-match="${question.column_match}" data-q-id="${question.id}" type="radio" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                            <label for="${q_option.name}" class="ml-3 block text-sm font-medium text-gray-700">
                                ${q_option.name}
                            </label>
                        </div>                       
                        `;
                    })

                    return listed_radio_q_options;
                }

                let _ = '';

                switch (question.type) {
                    case "select":
                        /* 
                            considerations for q_options mapping
    
                            q_options: [] { id: number, name: string, sort_order: number }
                        */
                        let radio_options = mapRadioOptions(question.q_options, question.column_match);
                        _ = `

                        <fieldset id="${guid}" class="px-4 py-5 bg-white space-x-6 sm:px-6">
                            <div>
                                <legend class="text-base font-medium text-gray-900">${question.description}</legend>
                                <p class="text-sm text-gray-500">${question.text}</p>
                            </div>
                            <div class="mt-4 space-y-4" id="${question.column_match}">
                                ${radio_options}
                            </div>
                        </fieldset>
                       `

                        break;

                    case "text":


                        _ = `
                        <div  id="${guid}">
                             <div class="px-4 py-1 bg-white space-x-6 sm:px-6">
                                <div class="flex flex-col">
                                    <div class="col-span-3 sm:col-span-2">
                                        <label for="company-website" class="block text-sm font-medium text-gray-700">
                                            ${question.description}
                                        </label>
                                    </div>    
                                    <div class="mt-1 flex rounded-md shadow-sm">
                                        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                                        </svg>
                                        </span>
                                        <input type="text" data-section-id="${section_id}" name="company-website" data-column-match="${question.column_match}" data-q-id="${question.id}"  id="${question.column_match}" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="${question.text}">
                                    </div>
                                    <span class="text-xs text-red-300 py-2">
                                    ${question.error_message}
                                    </span>
                                </div>
                            </div>
                        </div>
                        `

                        break;

                    case "tel":

                        _ = `
                        <div  id="${guid}">
                             <div class="px-4 py-1 bg-white space-x-6 sm:px-6">
                                <div class="flex flex-col">
                                    <div class="col-span-3 sm:col-span-2">
                                        <label for="company-website" class="block text-sm font-medium text-gray-700">
                                            ${question.description}
                                        </label>
                                    </div>    
                                    <div class="mt-1 flex rounded-md shadow-sm">
                                        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </span>
                                        <input type="tel" data-section-id="${section_id}" name="${question.description}" id="${question.column_match}" data-column-match="${question.column_match}" data-q-id="${question.id}" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300" placeholder="${question.text}">
                                    </div>
                                    <span class="text-xs text-red-300 py-2">
                                            ${question.error_message}
                                    </span>
                                </div>
                            </div>
                        </div>
                        `

                        break;

                    default:
                        break;
                }

                collapsibleSectionHtmlContent = collapsibleSectionHtmlContent + _;

            }

        });

        return collapsibleSectionHtmlContent;
    }

    renderCollapsibleNodeSection(section: TreeNodeSection) {
        let collapsibleNodeSectionContent: TreeNodeSection = section;
        let guid = Guid.newGuid();
        const differentDescriptionFromName = () => {
            /* 
            Bug? - Descripiton.length !== name.length when  visually Descripiton.length == name.length. WHY???
            */
            if (collapsibleNodeSectionContent.description.replace(/\s+/g, '') !== collapsibleNodeSectionContent.name.replace(/\s+/g, '')) {
                return collapsibleNodeSectionContent.description
            } else {
                return '';
            }
        };
        // let description = differentDescriptionFromName();
        const _date = new Date(collapsibleNodeSectionContent.created)
        let date = moment(_date).format('DD/MM/YYYY');
        let collapsibleHtmlSectionQuestionsContent = this.renderCollapsibleNodeSectionQuestions(section.sections[0].questions, section.id);
        let htmlSectionContent = `
        <div class="border  m-5 py-5  bg-white shadow overflow-hidden sm:rounded-lg tree-parent" id="${guid}">

            <div class="flex content-start" id="${guid}">    

                    <svg xmlns="http://www.w3.org/2000/svg" id="${guid}"  class="h-6 w-6 ml-5 mr-2 fill-current text-green-600 tree-node-toggler" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>

                <div class="">
                    ${collapsibleNodeSectionContent.name}
                </div>

            </div>

            
            
            <div class="content  tree-node-section p-4 text-sm" id="${guid}"  style="display: none;" #questionSection>

                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button id="${guid}" data-section-id="${section.id}" class="begin-survey inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Begin Survey
                    </button>
                </div>

               <div class="survey-form-section opacity-25" data-section-id="${section.id}"  id="${guid}">
                    <div class="">
                            <p> 
                                <span>
                                    Number of Questions: 
                                </span>
                                ${collapsibleNodeSectionContent.sections[0].questions.length}
                            </p>
                            <p> 
                                <span>
                                    Created On: 
                                </span>
                                    ${date}
                            </p>
                    </div>
                    <div class="">
                            <div class="mt-5 md:mt-0">
                                <form id="${collapsibleNodeSectionContent.id}" class="shadow-lg sm:rounded-md sm:overflow-hidden" >
                                    ${collapsibleHtmlSectionQuestionsContent}
                                </form>
                            </div>
                    </div>
                    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button id="${guid}" data-section-id="${section.id}" class="submit-survey inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Submit Survey
                        </button>
                    </div>
                </div>


               
            </div>

        </div>    
        `

        return htmlSectionContent;
    }

    init() {
        this.renderTree();
    }
}