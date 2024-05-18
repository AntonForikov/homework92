import {createSlice} from "@reduxjs/toolkit";
import {MessageFromDB} from "../../types";
import {RootState} from "../../app/store.ts";
import {getMessages} from "./messageThunk.ts";

interface MessageState {
    messages: MessageFromDB[],
    messagesLoading: boolean
}

const initialState: MessageState = {
    messages: [],
    messagesLoading: false
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMessages.pending, state => {
            state.messagesLoading = true;
        }).addCase(getMessages.fulfilled, (state, {payload: messages}) => {
            state.messagesLoading = false;
            if (messages) state.messages = messages;
        }).addCase(getMessages.rejected, (state) => {
            state.messagesLoading = false;
        });
    }
});

export const messageReducer = messageSlice.reducer;

export const selectMessages = (state: RootState) => state.messages.messages;
export const selectMessagesLoading = (state: RootState) => state.messages.messagesLoading;


