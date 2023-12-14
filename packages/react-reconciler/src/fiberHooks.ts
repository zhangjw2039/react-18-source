import { FiberNode } from "./fiber";

export function renderWithHooks(wip: FiberNode) {
    const Component = wip.type;
    const props = wip.peddingProps;
    const children = Component(props);

    return children;
}