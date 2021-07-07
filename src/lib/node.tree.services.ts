export class TreeNodeRenderingService {

    constructor(){

        let nodeTreeViewTogglerBtns = document.querySelectorAll(".tree-node-toggler");
        nodeTreeViewTogglerBtns.forEach((node) => {
            node.addEventListener("click", (e: Event) => {
                this.hideTreeNode((e.target as Element).id);
            })
        })
    }

    hideTreeNode(node_id){
        console.log(node_id);
    }

}


new TreeNodeRenderingService();