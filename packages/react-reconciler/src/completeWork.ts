import { Container, appendInitialChild, createInstance, createTextInstance } from "hostConfig";
import { FiberNode } from "./fiber";
import { FunctionComponent, HostComponent, HostRoot, HostText } from "./workTags";
import { NoFlags } from "./fiberFlags";

/**
 * 递归---归
 */
export const completeWork = (wip: FiberNode) => {
    const newProps = wip.peddingProps;
    const current = wip.alternate;
    switch (wip.tag) {
        case HostComponent:
            if(current !== null && wip.stateNode) {
                // update
            }else {
                // 1. 构建 DOM树
                const instance = createInstance(wip.type, newProps);
                // // 2. 将DOM插入到DOM树中
                appendAllChildren(instance, wip); // 构建一颗离屏DOM树
                wip.stateNode = instance;
            }
            bubbleProperties(wip);
            return null;
        case HostRoot:
            bubbleProperties(wip); 
            return null;
        case HostText:
            if(current !== null && wip.stateNode) {
                // update
            }else {
                // 1. 构建 DOM树
                const instance = createTextInstance(newProps.content);
                wip.stateNode = instance;
            }
            bubbleProperties(wip); 
            return null;
        case FunctionComponent:
            bubbleProperties(wip); 
            return null;
        default:
            if(__DEV__) {
                console.log("未实现的类型completeWork", wip);
            }
            return null;
    }
};

function appendAllChildren(parent: Container, wip: FiberNode) {
    let node = wip.child;

    while(node !== null) {
        if(node.tag === HostComponent || node.tag === HostText) {
            appendInitialChild(parent, node.stateNode);
        }else if(node.child !== null) { // 如果是函数组件则找到函数组件的child
            node.child.return = node;
            node = node.child;
            continue;
        }

        if(node === wip) {
            return;
        }

        // 当前的while循环用用户结束函数组件的归的阶段
        while(node.sibling === null) {
            if(node.return === null || node.return === wip) {
                return
            }
            node = node.return
        }
        
        node.sibling.return = node.return;
		node = node.sibling;
    }
}

function bubbleProperties(wip: FiberNode) {
    let subtreeFlags = NoFlags;
    let child = wip.child;

    while(child !== null) {
        subtreeFlags |= child.subtreeFlags;
        subtreeFlags |= child.flags;
        child.return = wip;
        child = child.sibling;
    }

    wip.subtreeFlags |= subtreeFlags;
}