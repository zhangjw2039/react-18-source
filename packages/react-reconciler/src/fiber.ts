import { Key, Props, ReactElementType, Ref } from "shared/ReactTypes";
import { Flags, NoFlags } from "./fiberFlags";
import { Container } from "hostConfig";
import { FunctionComponent, HostComponent, WorkTag } from "./workTags";

export class FiberNode {

    tag: WorkTag;
    key: Key;
    stateNode: any;
    type: any;
    ref: Ref;

    return: FiberNode | null;
    sibling: FiberNode | null;
    child: FiberNode | null;
    index: number;

    peddingProps: Props | null;
    memoizedProps: Props | null;
    memoizedState: any;
    alternate: FiberNode | null;
    flags: Flags;
    subtreeFlags: Flags;
    updateQueue: any;

    constructor(tag: WorkTag, peddingProps: Props, key: Key) {
        // 实例
        this.tag = tag;
        this.key = key;
        // HostComponent => div DOM节点
        this.stateNode = null;
        // FunctionComponent => 函数组件本身
        this.type = null;

        // 用于描述FiberNode与FiberNode之间的关系--构成树状结构
        // return 指向父FiberNode
        this.return = null;
        // sibling 指向右边的兄弟FiberNode
        this.sibling = null;
        // child 指向子FiberNode
        this.child = null;
        // 该FiberNode在父FiberNode节点中的下标
        this.index = 0;

        this.ref = null;

        // 作为工作单元
        // peddingProps 工作之前peddingProps的状态-- {class: 'div1'}
        this.peddingProps = peddingProps;
        // memoizedProps 工作完成之后props的状态-- {class: 'div2'}
        this.memoizedProps = null;
        // 更新之后的state
        this.memoizedState = null;
        // 更新状态存储单位
        this.updateQueue = null;

        // 对应workInProgess中的FiberNode
        this.alternate = null;
        // 副作用
        this.flags = NoFlags;
        this.subtreeFlags = NoFlags;
    }
}

// FiberRootNode
export class FiberRootNode {
    // 指向RootFiber的DOM元素
    container: Container;
    // 指向HostRootFiber
    current: FiberNode;
    // 更新完成的HostFiberNode
    finishedWork: FiberNode | null;

    constructor(container: Container, hostRootFiber: FiberNode) {
        this.container = container;
        this.current = hostRootFiber;
        // hostRootFiber 的 stateNode 指向当前的fiberRootNode
        hostRootFiber.stateNode = this;
        this.finishedWork = null;
    }
}

// 创建workInProgess
export const createWorkInProgess = (current: FiberNode, peddingProps: Props): FiberNode => {
    let wip = current.alternate;

    // 初始化的时候wip
    if(wip === null) {
        wip = new FiberNode(current.tag, peddingProps, current.key);
        wip.stateNode = current.stateNode;

        wip.alternate = current;
        current.alternate = wip;
    }else {
        wip.peddingProps = peddingProps;
        // 清除掉副作用
        wip.flags = NoFlags;
        wip.subtreeFlags = NoFlags;
    }
    wip.type = current.type;
    wip.updateQueue = current.updateQueue;
    wip.child = current.child;
    wip.memoizedProps = current.memoizedProps;
    wip.memoizedState = current.memoizedState;

    return wip;
};

export function createFiberFromElement(element: ReactElementType): FiberNode {
    const { type, key, props } = element;
    let fiberTag: WorkTag = FunctionComponent;

    if(typeof type === "string") {
        fiberTag = HostComponent;
    }else if(typeof type === "function" && __DEV__) {
        console.log("未定义的type类型", element);
    }

    const fiberNode = new FiberNode(fiberTag, props, key);
    fiberNode.type = type;
    return fiberNode;
}