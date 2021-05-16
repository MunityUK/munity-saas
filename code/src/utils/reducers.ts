import { createSlice, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

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

const store = configureStore({
  reducer: slice.reducer
});

export default store;
export const { setMapZoom } = slice.actions;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;