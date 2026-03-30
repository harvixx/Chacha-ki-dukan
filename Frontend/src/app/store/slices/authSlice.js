import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMe } from "../../../features/auth/services/auth.api";

const initialState = {
    user: null,
    loading: true,
    isAuth: false,
};

export const fetchUser = createAsyncThunk(
    "auth/fetchUser",
    async (_, thunkAPI) => {
        try {
            const res = await getMe(); 
            return res.data.user;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logoutState: (state) => {
            state.user = null;
            state.isAuth = false;
        },
        updateUserSessionLocally: (state, action) => {
            state.user = action.payload;
        }
    },
    // YAHAN FIX KIYA HAI (extraReducers reducers ke bahar aur createSlice ke andar hota hai)
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuth = true;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuth = false;
            });
    }
});

export const { logoutState, updateUserSessionLocally } = authSlice.actions;
export default authSlice.reducer;