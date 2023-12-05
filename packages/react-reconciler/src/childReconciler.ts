import { ReactElementType } from "shared/ReactTypes";
import { FiberNode, createFiberFromElement } from "./fiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { HostText } from "./workTags";
import { Placement } from "./fiberFlags";

function ChildReconciler(shouldTrackEffects: boolean) {

    function reconcileSingleElement(returnFiber: FiberNode, currentFiber: FiberNode | null, element: ReactElementType) {
        // 根据ReactElement生成FiberNode然后返回
        const fiber = createFiberFromElement(element);
        fiber.return = returnFiber;
        return fiber;
    }

    function reconcileSingleTextNode(returnFiber: FiberNode, currentFiber: FiberNode | null, content: string | number) {
        const fiber = new FiberNode(HostText, {content}, null);
        fiber.return = returnFiber;
        return fiber;
    }

    function placeSingleChild(fiber: FiberNode) {
        if(shouldTrackEffects && fiber.alternate === null) {
            fiber.flags = Placement;
        }
        return fiber;
    }

    return function reconcilerChildFibers(returnFiber: FiberNode, currentFiber: FiberNode | null, newChild: ReactElementType | string) {
        // 单节点模式
        if(typeof newChild === "object" && newChild !== null) {
            switch (newChild.$$type) {
                case REACT_ELEMENT_TYPE:
                    const wipFiber = reconcileSingleElement(returnFiber, currentFiber, newChild);
                    return placeSingleChild(wipFiber);
                default:
                    if(__DEV__) {
                        console.warn("未实现的reconciler的类型", newChild);
                    }
                    break;
            }
        }

        // 多节点的情况

        // 文本节点
        if(typeof newChild === "string" || typeof newChild === "number") {
            const wipFiber = reconcileSingleTextNode(returnFiber, currentFiber, newChild);
            return placeSingleChild(wipFiber);
        }

        if(__DEV__) {
            console.warn("未实现的reconciler的类型", newChild);
        }
        return null;
    };
}

export const reconcilerChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);