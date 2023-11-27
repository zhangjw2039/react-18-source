import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { ElementType, Key, Props, ReactElementType, Ref, Type } from "shared/ReactTypes";
import { void0 } from "shared/constant";
/**
 * ReactElement
 * type
 * key
 * ref
 * props
 */
export const ReactElement = function(type: Type, key: Key, ref: Ref, props: Props): ReactElementType {
    const element = {
        $$type: REACT_ELEMENT_TYPE,
        type,
        key,
        ref,
        props,
        __mark: "zhangjw2039",
    };
    return element;
};

/**
 * jsx 方法
 * elementType props ...maybeChildren
 */

export function jsx(type: ElementType, props: Props, ...maybeChildren: any[]) {
    const _props: Props = {};
    let key: Key = null;
    let ref: Ref = null;

    for (const prop in props) {
        const val = props[prop];
        if(prop === "key") {
            if(val !== void0) {
                key = val + "";
            }
            continue;
        }
        if(prop === "ref") {
            if(val !== void0) {
                ref = val;
            }
            continue;
        }
        if (Object.prototype.hasOwnProperty.call(props, prop)) {
            _props[prop] = val;
        }
    }
    const maybeChildrenLength = maybeChildren.length;
    if(maybeChildrenLength) {
        if(maybeChildrenLength === 1) {
            props.children = maybeChildren[0];
        }else {
            props.children = maybeChildren;
        }
    }
    return jsx(type, key, ref, _props);
}

export const jsxDEV = jsx;

