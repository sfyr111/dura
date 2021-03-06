import { createDura, PlusDuraStore, EffectAPI, PlusRootState, LoadingMeta } from "../src";

describe("测试plus", function() {
  it("简单的测试", function(done) {
    const initialState = {
      name: undefined as string,
      sex: undefined as "男" | "女",
      age: undefined as number
    };

    type State = typeof initialState;

    const UserModel = {
      state: initialState,
      reducers: {
        onChangeName(payload: { name: string }) {
          return function(state: State) {
            state.name = payload.name;
            return state;
          };
        }
      },
      effects: {
        onAsyncChangeName(payload: { name: string }, meta?: LoadingMeta) {
          return async function(effectApi: EffectAPI<RootState>) {
            await effectApi.delay(1000);
            await effectRunner.address.onAsyncChangeCity({ city: "南京" });
            reducerRunner.user.onChangeName(payload);
          };
        }
      }
    };

    const initialAddressState = {
      detailName: undefined as string,
      city: undefined as string
    };

    type AddressState = typeof initialAddressState;

    const AddresModel = {
      state: initialAddressState,
      reducers: {
        onChangeCity(payload: { city: string }) {
          return function(state: AddressState) {
            state.city = payload.city;
            return state;
          };
        }
      },
      effects: {
        onAsyncChangeCity(payload: { city: string }) {
          return async function(effectApi: EffectAPI<RootState>) {
            await effectApi.delay(1000);
            reducerRunner.address.onChangeCity(payload);
          };
        }
      }
    };

    const initialModel = {
      user: UserModel,
      address: AddresModel
    };

    type RootState = PlusRootState<typeof initialModel>;

    const store = createDura(initialModel, {}) as PlusDuraStore<typeof initialModel>;

    const { reducerRunner, effectRunner } = store;

    effectRunner.user.onAsyncChangeName({ name: "张三" }, { loading: true });

    expect(store.getState().loading.user.onAsyncChangeName).toEqual(true);

    setTimeout(() => {
      expect(store.getState().loading.user.onAsyncChangeName).toEqual(false);
      expect(store.getState().user.name).toEqual("张三");
      expect(store.getState().address.city).toEqual("南京");
      done();
    }, 3000);
  });
});
