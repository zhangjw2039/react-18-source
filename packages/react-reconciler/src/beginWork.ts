import { ReactElementType } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { UpdateQueue, processUpdateQueue } from "./updateQueue";
import { HostComponent, HostRoot, HostText } from "./workTags";
import { mountChildFibers, reconcilerChildFibers } from "./childReconciler";

/**
 * 递归---递
 */
export const beginWork = (wip: FiberNode) => {
    // 针对tag调用不同的处理
    const tag = wip.tag;
    switch (tag) {
        case HostRoot:
            return updateHostRoot(wip);
        case HostComponent:
            return updateHostComponent(wip);
        case HostText:
            return null;
        default:
            if(__DEV__) {
                console.warn("beginwork 未实现的处理");
            }
            return null;
    }
};

/**
 * 处理HostFiberNode
 */
function updateHostRoot(wip: FiberNode) {
    // memoizedState 对于首屏更新 memoizedState === null
    const baseState = wip.memoizedState;
    const updateQueue = wip.updateQueue as UpdateQueue<Element>;
    const pedding = updateQueue.shared.pedding;
    updateQueue.shared.pedding = null;

    // 计算出最新的memoizedState
    const {memoizedState} = processUpdateQueue(baseState, pedding);
    // 替换memoizedState
    wip.memoizedState = memoizedState;

    // 计算子fiberNode
    const nextChildren = wip.memoizedState;
    reconcilerChildren(wip, nextChildren);
    return wip.child;
}

/**
 * 处理HostComponent
 */
function updateHostComponent(wip: FiberNode) {
    // 只需要处理子FiberNode
    const nextProps = wip.peddingProps;
    const nextChildren = nextProps.children;
    reconcilerChildren(wip, nextChildren);
    return wip.child;
}

function reconcilerChildren(wip: FiberNode, children: ReactElementType) {
    const current = wip.alternate;

    /**
     * 针对mount 和 update的优化策略
     */
    if(current !== null) {
        wip.child = reconcilerChildFibers(wip, current.child, children);
    }else {
        wip.child = mountChildFibers(wip, null , children);
    }
}