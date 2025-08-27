import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserDetailsApiRequest } from "@/networks/api";


const getUserDetailsThunk = createAsyncThunk("user/getUserDetails", async () => {
    try {
        const response = await getUserDetailsApiRequest();
        return response?.data?.data;
    } catch (error) {
        return error;
    }
})

export { getUserDetailsThunk };