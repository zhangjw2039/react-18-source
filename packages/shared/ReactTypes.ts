export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElementType {
    $$type: symbol | number;
    type: ElementType;
    key: Key;
    ref: Ref;
    props: Props;
    __mark: string;
}

// action 类型 同时兼容 setState({}) 和 setState(() => ({}))
export type Action<State> = State | ((preState: State) => State);