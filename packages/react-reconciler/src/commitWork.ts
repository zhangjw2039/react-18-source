import { Container, appendChildToContainer } from "hostConfig";
import { FiberNode } from "./fiber";
import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

let nextEffect: FiberNode | null = null

export function commitMutationEffects(finishedWork: FiberNode) {
    nextEffect = finishedWork;

    // 向下循环
    while(nextEffect !== null) {
        let child: FiberNode | null = nextEffect.child;

        if((nextEffect.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
            // 子fiberNode存在MutationMask操作
            nextEffect = child;
        }else {
            // 向上循环
            up: while(nextEffect !== null) {
                // 处理fiberNode
                commitMutationEffectsOnFiber(nextEffect)

                const sibling: FiberNode | null = nextEffect.sibling;
                
                if(sibling !== null){
                    nextEffect = sibling;
                    break up;
                }
                nextEffect = nextEffect.return; 
            }
        }
    }

}

function commitMutationEffectsOnFiber(finishedWork: FiberNode) {
    const flags = finishedWork.flags
    if((flags & Placement) !== NoFlags) {
        // 存在Placement操作
        commitPlacement(finishedWork);
        // 移除Placement
        finishedWork.flags &= ~Placement;
    }
}

function commitPlacement(finishedWork: FiberNode) {
    if(__DEV__) {
        console.warn("执行Placement操作")
    }
    const hostParent = getHostParent(finishedWork);
    if(hostParent !== null) {
        appentPlacementNodeIntoCoontainer(finishedWork, hostParent)
    }
}

// 获取父节点的宿主环境的节点
function getHostParent(fiber: FiberNode) {

    let parent = fiber.return;

    // 为什么要循环 -> parent是react函数组件 需要再次往上遍历
    while(parent !== null) {
        const parentTag = parent.tag;
        if(parentTag === HostComponent) {
            return parent.stateNode as Container;
        }
        if(parentTag === HostRoot) {
            return parent.stateNode.container as Container;
        }
        parent = parent.return;
    }

    if(__DEV__) {
        console.warn("未找到 host parent")
    }
    return null;
}

function appentPlacementNodeIntoCoontainer(finishedWork: FiberNode, hostParent: Container) {
    // 判断是否是HostComponent || HostText 
    // 如果是函数组件需要继续往下遍历
    const currentTag = finishedWork.tag;
    if(currentTag === HostComponent || currentTag === HostText) {
        appendChildToContainer(hostParent, finishedWork.stateNode);
        return;
    }

    // ***********
    const child = finishedWork.child;
    if(child !== null) {
        appentPlacementNodeIntoCoontainer(child, hostParent);
        let sibling = child.sibling;
        while(sibling !== null) {
            appentPlacementNodeIntoCoontainer(sibling, hostParent);
            sibling = sibling.sibling;
        }
    }
}