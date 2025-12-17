import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  feature: 'assets',
};

const appSateSice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setAppState: (state, action) => {
      
      state.feature = action.payload;
 
    },
   
  },
});

// Exporta las acciones
export const { setAppState } = appSateSice.actions;

// Exporta el reducer
export default appSateSice.reducer;
