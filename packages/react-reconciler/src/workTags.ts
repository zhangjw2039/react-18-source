export type WorkTag = 
    | typeof FunctionComponent
    | typeof HostRoot
    | typeof HostComponent
    | typeof HostText

export const FunctionComponent = 0; // react函数组件
export const HostRoot = 3; // 最外层容器
export const HostComponent = 5; // 普通宿主环境元素
export const HostText = 6; // 文本节点s