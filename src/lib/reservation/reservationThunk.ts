import { Reservation } from "@/types/reservation";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CreateReservationPayload {
  lodgeId: number;
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomCount: number;
}

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

export const createReservation = createAsyncThunk<
  Reservation,
  CreateReservationPayload,
  { rejectValue: string }
>("reservation/createReservation", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/reservation`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data as Reservation;
  } catch (error) {
    return rejectWithValue("Failed to create reservation");
  }
});

export const confirmReservation = createAsyncThunk<
  Reservation,
    { reservationId: number },
    { rejectValue: string }
>("reservation/confirmReservation", async ({ reservationId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/reservation/confirm`,
      { reservationId },
        {withCredentials: true,}
    );
        return response.data as Reservation;
    } catch (error) {
        return rejectWithValue("Failed to confirm reservation")
        
    }
})