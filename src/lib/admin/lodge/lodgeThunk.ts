import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";
import {
  Lodge,
  RoomInventory,
  RoomType,
  SeasonalPricing,
  TicketType,
} from "@/types/lodge";
import { RootState } from "@/lib/store/store";
import { TicketInventory } from "@/types/ticket";

export const fetchLodges = createAsyncThunk<
  Lodge[],
  void,
  { rejectValue: string; state: RootState }
>("admin/fetchLodges", async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const token = getState().auth.accessToken;
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return res.data as Lodge[];
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
    }
    return rejectWithValue("Failed to fetch lodges");
  }
});

type CreateLodgePayload = Omit<
  Lodge,
  "id" | "roomTypes" | "hotSpringLodgeImage" | "images"
> & {
  lodgeImageFile: File[];
  roomTypes: (Omit<RoomType, "seasonalPricing"> & {
    seasonalPricing?: SeasonalPricing[];
  })[];
  roomTypeImages?: File[][];
  ticketTypes: TicketType[];
};

export const createLodge = createAsyncThunk<
  { message: string; lodge: Lodge },
  CreateLodgePayload,
  { rejectValue: string; state: RootState }
>(
  "admin/createLodge",
  async (newLodgeData, { dispatch, rejectWithValue, getState }) => {
    try {
      const formData = new FormData();

      formData.append("name", newLodgeData.name);
      formData.append("address", newLodgeData.address);
      formData.append("latitude", newLodgeData.latitude.toString());
      formData.append("longitude", newLodgeData.longitude.toString());
      formData.append("description", newLodgeData.description || "");
      formData.append("accommodationType", newLodgeData.accommodationType);
      formData.append("roomTypes", JSON.stringify(newLodgeData.roomTypes));
      formData.append(
        "ticketTypes",
        JSON.stringify(newLodgeData.ticketTypes || [])
      );

      if (
        !Array.isArray(newLodgeData.lodgeImageFile) ||
        newLodgeData.lodgeImageFile.length === 0
      ) {
        console.error(
          "lodgeImageFile is not an array or is empty",
          newLodgeData.lodgeImageFile
        );
        throw new Error("lodgeImageFile must be an array of File objects");
      }
      newLodgeData.lodgeImageFile.forEach((file: File) => {
        formData.append("hotSpringLodgeImages", file);
      });

      if (Array.isArray(newLodgeData.roomTypeImages)) {
        newLodgeData.roomTypeImages.forEach((roomFiles, idx) => {
          if (!Array.isArray(roomFiles) || roomFiles.length === 0) return;

          roomFiles.forEach((file: File, i: number) => {
            if (!(file instanceof File)) return;
            formData.append("roomTypeImages", file, `roomType_${idx}_${i}`);
          });
        });
      }

      const token = getState().auth.accessToken;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("res data = ", res.data);
      if (!res.data || !res.data.message || !res.data.lodge) {
        throw new Error("Response data is missing required fields");
      }

      return {
        message: res.data.message,
        lodge: res.data.lodge,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const backendMsg =
          err.response?.data?.message || err.response?.data?.error || "";
        console.error("Axios Error:", backendMsg, err);

        return rejectWithValue(
          backendMsg || "Failed to create lodge (Unknown reason)"
        );
      }
      console.error("Unknown error during createLodge:", err);

      return rejectWithValue("Failed to create lodge");
    }
  }
);

export const fetchLodgeById = createAsyncThunk<
  Lodge,
  number,
  { rejectValue: string; state: RootState }
>(
  "admin/fetchLodgeById",
  async (lodgeId, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${lodgeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as Lodge;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      }
      return rejectWithValue("Failed to fetch lodge by ID");
    }
  }
);

type KeepRoomTypeImage = {
  roomTypeId: number;
  imageId: number;
};

export type UpdateLodgePayload = Omit<Lodge, "roomTypes"> & {
  roomTypes: Omit<RoomType, "seasonalPricing"> &
    {
      seasonalPricing?: SeasonalPricing[];
    }[];
  keepImgIds?: number[];
  newImageFiles: File[];
  newRoomTypeImageFiles?: File[][];
  keepRoomTypeImgIds?: KeepRoomTypeImage[];
  ticketTypes?: TicketType[];
};

export const updateLodge = createAsyncThunk<
  { message: string; lodge: Lodge },
  UpdateLodgePayload,
  { rejectValue: string; state: RootState }
>(
  "admin/updateLodge",
  async (updatedLodgeData, { dispatch, rejectWithValue, getState }) => {
    try {
      const formData = new FormData();

      formData.append("name", updatedLodgeData.name);
      formData.append("address", updatedLodgeData.address);
      formData.append("latitude", updatedLodgeData.latitude.toString());
      formData.append("longitude", updatedLodgeData.longitude.toString());
      formData.append("description", updatedLodgeData.description || "");
      formData.append("accommodationType", updatedLodgeData.accommodationType);
      formData.append("roomTypes", JSON.stringify(updatedLodgeData.roomTypes));
      formData.append(
        "ticketTypes",
        JSON.stringify(updatedLodgeData.ticketTypes || [])
      );

      formData.append(
        "keepImgIds",
        JSON.stringify(updatedLodgeData.keepImgIds || [])
      );
      formData.append(
        "keepRoomTypeImgIds",
        JSON.stringify(updatedLodgeData.keepRoomTypeImgIds || [])
      );

      if (
        updatedLodgeData.newRoomTypeImageFiles &&
        updatedLodgeData.newRoomTypeImageFiles.length > 0
      ) {
        const counts = updatedLodgeData.newRoomTypeImageFiles.map(
          (arr) => arr.length
        );
        formData.append("roomTypeImagesCounts", JSON.stringify(counts));

        updatedLodgeData.newRoomTypeImageFiles?.forEach((fileArray) => {
          fileArray.forEach((file) => {
            formData.append("roomTypeImages", file);
          });
        });
      }

      updatedLodgeData.newImageFiles.forEach((file) => {
        formData.append("hotSpringLodgeImages", file);
      });

      const token = getState().auth.accessToken;
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${updatedLodgeData.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data as { message: string; lodge: Lodge };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      }
      return rejectWithValue("Failed to update lodge");
    }
  }
);

export const deleteLodge = createAsyncThunk<
  { message: string; lodge: Lodge },
  number,
  { rejectValue: string; state: RootState }
>(
  "admin/deleteLodge",
  async (lodgeId: number, { dispatch, rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${lodgeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data as { message: string; lodge: Lodge };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          dispatch(logout());
        }
      }
      return rejectWithValue("Failed to delete lodge");
    }
  }
);

export const fetchLodgeInventories = createAsyncThunk<
  { roomInventories: RoomInventory[]; ticketInventories: TicketInventory[] },
  number,
  { rejectValue: string; state: RootState }
>(
  "admin/lodge/fetchInventories",
  async (lodgeId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${lodgeId}/inventories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.message ?? "Failed to fetch inventories");
      }
      return rejectWithValue("Failed to fetch inventories");
    }
  }
);
