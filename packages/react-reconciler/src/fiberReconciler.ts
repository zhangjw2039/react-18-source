import { Container } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";
import { createUpdate, createUpdateQueue, enqueueUpdate } from "./updateQueue";
import { ReactElementType } from "shared/ReactTypes";
import { scheduleUpdateOnFiber } from "./workLoop";

/**
 * 在 react.createRoot内部调用的就是createContainer
 */
export function createContainer(container: Container) {
    const hostRootFiber = new FiberNode(HostRoot, {}, null);
    const root = new FiberRootNode(container, hostRootFiber);
    // 为hostRootFiber添加updateQueue
    hostRootFiber.updateQueue = createUpdateQueue();
    return root;
}

/**
 * react.createRoot().redner() 
 * 在render方法中调用的就是updateContainer
 */
export function updateContainer(element: ReactElementType | null, root: FiberRootNode) {
    const hostRootFiber = root.current;
    // 创建更新
    const update = createUpdate(element);
    // 将更新插入到hostRootFiber中更新单位中
    enqueueUpdate(hostRootFiber.updateQueue, update);
    scheduleUpdateOnFiber(hostRootFiber);
    return element;
}