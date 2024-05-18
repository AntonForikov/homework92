import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {MessageFromDB} from "../../types";

export const sendMessage = createAsyncThunk(
  'sendMessage',
  async (message: string) => {
      try {
          await axiosApi.post('messages', {text: message});
      } catch (e) {
          console.log(e);
      }
  }
);

export const getMessages = createAsyncThunk(
    'getMessages/get',
    async () => {
        try {
           const {data} = await axiosApi.get<MessageFromDB[]>('/messages');
           return data;
        } catch (e) {
            console.log(e);
        }
    }
);