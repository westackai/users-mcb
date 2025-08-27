import { createSlice } from "@reduxjs/toolkit";
import { getUserDetailsThunk } from "../ReduxActions/userActions";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userProfile: null,
        loading: false,
        error: null as string | null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getUserDetailsThunk.fulfilled, (state: any, action: any) => {
            state.userProfile = action.payload;
            state.loading = false;
            state.error = null;
        }).addCase(getUserDetailsThunk.pending, (state) => {
            state.loading = true;
        }).addCase(getUserDetailsThunk.rejected, (state: any, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})


export const { } = userSlice.actions;
export default userSlice.reducer;