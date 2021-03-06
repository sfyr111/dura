import { create, DuraStore, RootModel, Model } from "../src/index";

describe("单元测试", function() {
  it("测试传入第三方createStore", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    type IState = typeof initialState;

    const user = {
      state: initialState,
      reducers: {
        /**
         * 修改用户姓名
         * @param payload
         */
        onChangeName(payload?: { name: string }) {
          return function(state: IState) {
            return { ...state, ...payload };
          };
        }
      }
    };

    const initModel = {
      user
    };

    const store = create({
      initialModel: initModel,
      createStore: () => false
    }) as DuraStore<typeof initModel>;

    expect(store.getState).toBeUndefined();
  });

  it("测试传入第三方的compose", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    type IState = typeof initialState;

    const user = {
      state: initialState,
      reducers: {
        /**
         * 修改用户姓名
         * @param payload
         */
        onChangeName(payload: { name: string }) {
          return function(state: IState) {
            return { ...state, ...payload };
          };
        }
      }
    };

    const initModel = {
      user
    };

    const store = create({
      initialModel: initModel,
      compose: (...a) => a[2]
    }) as DuraStore<typeof initModel>;

    const reducerRunner = store.reducerRunner;

    expect(store.getState().user.name).toBeUndefined();

    reducerRunner.user.onChangeName({ name: "李四" });

    expect(store.getState().user.name).toEqual("李四");

    reducerRunner.user.onChangeName({ name: "张三" });

    expect(store.getState().user.name).toEqual("张三");
  });

  it("测试reducers", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    type IState = typeof initialState;

    const user = {
      state: initialState,
      reducers: {
        /**
         * 修改用户姓名
         * @param payload
         */
        onChangeName(payload: { name: string }) {
          return function(state: IState) {
            return { ...state, ...payload };
          };
        }
      }
    };

    const initModel = {
      user
    };

    const store = create({
      initialModel: initModel
    }) as DuraStore<typeof initModel>;

    const reducerRunner = store.reducerRunner;

    expect(store.getState().user.name).toBeUndefined();

    reducerRunner.user.onChangeName({ name: "李四" });

    expect(store.getState().user.name).toEqual("李四");

    reducerRunner.user.onChangeName({ name: "张三" });

    expect(store.getState().user.name).toEqual("张三");
  });

  it("测试initialState", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };
    type IState = typeof initialState;
    const user = {
      state: initialState,
      reducers: {
        /**
         * 修改用户姓名
         * @param payload
         */
        onChangeName(payload: { name: string }) {
          return function(state: IState) {
            return { ...state, ...payload };
          };
        }
      }
    };
    const initModel = {
      user
    };
    const store = create({
      initialModel: initModel,
      initialState: { user: { name: "张三", sex: undefined } }
    }) as DuraStore<typeof initModel>;

    expect(store.getState().user.name).toEqual("张三");
  });

  it("测试plugin", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    type IState = typeof initialState;

    const user = {
      state: initialState,
      reducers: {
        /**
         * 修改用户姓名
         * @param payload
         */
        onChangeName(payload: { name: string }) {
          return function(state: IState) {
            return { ...state, ...payload };
          };
        }
      }
    };

    const initModel = {
      user
    };

    const store = create({
      initialModel: initModel,
      plugins: [
        {
          name: "test",
          model: {
            state: {}
          },
          onWrapModel: (name: string, model: Model<any>) => model,
          onCreateMiddleware: (rootModel: RootModel) => store => next => action => next(action),
          onStoreCreated: (store: DuraStore, rootModel: RootModel) => false
        }
      ]
    }) as DuraStore<typeof initModel>;
  });

  it("测试middlewares", function() {
    const initialState = {
      name: undefined,
      sex: undefined
    };

    type IState = typeof initialState;

    const user = {
      state: initialState,
      reducers: {
        /**
         * 修改用户姓名
         * @param payload
         */
        onChangeName(payload: { name: string }) {
          return function(state: IState) {
            return { ...state, ...payload };
          };
        }
      }
    };

    const initModel = {
      user
    };

    const middleware = store => next => action => {
      next({ ...action, payload: { name: "middleware" } });
    };

    const store = create({
      initialModel: initModel,
      middlewares: [middleware]
    }) as DuraStore<typeof initModel, {}>;

    const reducerRunner = store.reducerRunner;

    expect(store.getState().user.name).toBeUndefined();

    reducerRunner.user.onChangeName({ name: "李四" });

    expect(store.getState().user.name).toEqual("middleware");
  });
});
