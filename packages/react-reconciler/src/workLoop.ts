import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode, FiberRootNode, createWorkInProgess } from "./fiber";
import { MutationMask, NoFlags } from "./fiberFlags";
import { HostRoot } from "./workTags";

let workInProgess: FiberNode | null = null;

/**
 * 初始化workInProgess
 * @param fiber 
 */
function prepareFreshStack(root: FiberRootNode) {
    workInProgess = createWorkInProgess(root.current, {});
}

/**
 * 在fiber中调度update
 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
    const root = markUpdateFromFiberToRoot(fiber);
    renderRoot(root);
}

/**
 * 从当前fiber向上便利到fiberRoot
 */
function markUpdateFromFiberToRoot(fiber: FiberNode) {
    let node: FiberNode | null = fiber;
    let parent = fiber.return;
    while(parent !== null) {
        node = parent;
        parent = node.return;
    }
    if(node.tag === HostRoot) {
        return node.stateNode;
    }
    return null;
}

/**
 * renderRoot
 * @param root 
 */
function renderRoot(root: FiberRootNode) {
    prepareFreshStack(root);

    do {
        try {
            workLoop();
            break;
        } catch (error) {
            if(__DEV__) {
                console.log("workLoop发生错误", error);
            }
            // 发生错误时将workInProgess重置为null
            workInProgess = null;
        }
    } while (true);

    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;

    // 根据渲染完成的workInProcess树 生成真实dom
    commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
    const finishedWork = root.finishedWork;

    if(finishedWork === null){
        return;
    }

    if(__DEV__) {
        console.log("commit 阶段开始执行", finishedWork);
    }

    // 重置
    root.finishedWork = null;

    // 判断是否存在3个子阶段需要执行
    const subtreeHasEffect = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
    const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
    if(subtreeHasEffect || rootHasEffect) {
        // beforeMutation

        // mutation
        // currentFiber树和workInProgess树进行切换
        root.current = finishedWork;

        // layout
    }else {
        root.current = finishedWork;
    }
}

function workLoop() {
    while(workInProgess !== null) {
        performUnitOfWork(workInProgess);
    }
}

function performUnitOfWork(fiber: FiberNode) {
    const next = beginWork(fiber);
    //当前fiber工作完之后需要将peddingProps赋值给memoizedProps
    fiber.memoizedProps = fiber.peddingProps;

    // 判断next是否为空 如果 next === null 表示 到底了没有子FiberNode
    if(next === null) {
        completeUnitOfWork(fiber);
    }else {
        // 存在则将next 赋值给 workInProgess，继续循环调用performUnitOfWork
        workInProgess = next;
    }
}

function completeUnitOfWork(fiber: FiberNode) {
    let node: FiberNode | null = fiber;

    do {
        completeWork(node);
        const sibling = node.sibling;
        
        if(sibling !== null) {
            workInProgess = sibling;
            return;
        }
        node = node.return;
        workInProgess = node;

    } while (node !==  null);
}