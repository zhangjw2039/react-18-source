import { Action } from "shared/ReactTypes";

export interface Update<State> {
    action: Action<State>;
}

export interface UpdateQueue<State> {
    shared: {
        pedding: Update<State> | null
    }
}

/**
 * 创建update方法
 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
    return {
        action
    };
};

/**
 * 创建updateQueue
 */
export const createUpdateQueue = <State>(): UpdateQueue<State> => {
    return {
        shared: {
            pedding: null
        }
    };
};

/**
 * 往updateQueue中添加update
 */
export const enqueueUpdate = <State>(updateQueue: UpdateQueue<State>, update: Update<State>) => {
    updateQueue.shared.pedding = update;
};

/**
 * 消费update
 */
export const processUpdateQueue = <State>(baseState: State, peddingState: Update<State> | null): {memoizedState: State} => {
    const result = {
        memoizedState: baseState
    };
    if(peddingState !== null) {
        const action = peddingState.action;
        if(action instanceof Function) {
            result.memoizedState = action(baseState);
        }else {
            result.memoizedState = action;
        }
    }
    return result;
};
