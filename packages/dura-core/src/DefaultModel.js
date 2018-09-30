import ActionTypes from "./ActionTypes";


export default defaultCore = {
    namespace: "@@duraCore",
    initialState: 0,
    reducers: {
        [ActionTypes.PLUS_COUNT.split('/').reverse()[0]]: state => state + 1
    }
};