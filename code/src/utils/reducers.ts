import {
  createSlice,
  configureStore,
  getDefaultMiddleware
} from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage
};

const initialState = {
  mapZoom: 13
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMapZoom: (state, action) => {
      state.mapZoom = action.payload;
    }
  }
});

const persistedReducer = persistReducer(persistConfig, slice.reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

export default store;
export const persistor = persistStore(store);

export const { setMapZoom } = slice.actions;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
