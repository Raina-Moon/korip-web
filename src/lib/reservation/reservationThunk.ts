import { Reservation } from "@/types/reservation";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchReservation = createAsyncThunk<
  Reservation[],
  void,
  { rejectValue: string }
>("reservation/fetchReservation", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/reservation`,
      {
        withCredentials: true,
      }
    );
    return response.data as Reservation[];
  } catch (error) {
    return rejectWithValue("Failed to fetch reservations");
  }
});
