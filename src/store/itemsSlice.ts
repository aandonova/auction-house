import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuctionItem } from '../types/item';
import { fetchLots } from '../services/api';

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  const data = await fetchLots();
  return data;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [] as AuctionItem[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export default itemsSlice.reducer;