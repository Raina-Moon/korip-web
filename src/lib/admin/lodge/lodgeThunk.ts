import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "../../auth/authSlice";
import { Lodge, RoomType, SeasonalPricing } from "@/types/lodge";

export const fetchLodges = createAsyncThunk<
  Lodge[],
  void,
  { rejectValue: string }
>("admin/fetchLodges", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge`,
      {
        withCredentials: true,
      }
    );
    return res.data as Lodge[];
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to fetch lodges");
  }
});

type CreateLodgePayload = Omit<
  Lodge,
  "id" | "roomTypes" | "hotSpringLodgeImage"
> & {
  lodgeImageFile: File[];
  roomTypes: Omit<RoomType, "seasonalPricing"> &
    {
      seasonalPricing?: SeasonalPricing[];
    }[];
};

export const createLodge = createAsyncThunk<
  { message: string; lodge: Lodge },
  CreateLodgePayload,
  { rejectValue: string }
>("admin/createLodge", async (newLodgeData, { dispatch, rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append("name", newLodgeData.name);
    formData.append("address", newLodgeData.address);
    formData.append("latitude", newLodgeData.latitude.toString());
    formData.append("longitude", newLodgeData.longitude.toString());
    formData.append("description", newLodgeData.description || "");
    formData.append("accommodationType", newLodgeData.accommodationType);
    formData.append("roomTypes", JSON.stringify(newLodgeData.roomTypes));

    newLodgeData.lodgeImageFile.forEach((file: File) => {
      formData.append("hotSpringLodgeImages", file);
    });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to create lodge");
  }
});

export const fetchLodgeById = createAsyncThunk<
  Lodge,
  number,
  { rejectValue: string }
>("admin/fetchLodgeById", async (lodgeId, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${lodgeId}`,
      { withCredentials: true }
    );
    return res.data as Lodge;
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      dispatch(logout());
    }
    return rejectWithValue("Failed to fetch lodge by ID");
  }
});

type UpdateLodgePayload = Omit<Lodge, "roomTypes"> & {
  roomTypes: Omit<RoomType, "seasonalPricing"> &
    {
      seasonalPricing?: SeasonalPricing[];
    }[];
  keepImgIds?: number[];
  newImageFiles: File[];
};

export const updateLodge = createAsyncThunk<
  { message: string; lodge: Lodge },
  UpdateLodgePayload,
  { rejectValue: string }
>(
  "admin/updateLodge",
  async (updatedLodgeData, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("name", updatedLodgeData.name);
      formData.append("address", updatedLodgeData.address);
      formData.append("latitude", updatedLodgeData.latitude.toString());
      formData.append("longitude", updatedLodgeData.longitude.toString());
      formData.append("description", updatedLodgeData.description || "");
      formData.append("accommodationType", updatedLodgeData.accommodationType);
      formData.append("roomTypes", JSON.stringify(updatedLodgeData.roomTypes));

      formData.append("keepImgIds", JSON.stringify(updatedLodgeData.keepImgIds || []));

      updatedLodgeData.newImageFiles.forEach((file) => {
        formData.append("hotSpringLodgeImages", file);
      })

      console.log("Updating lodge with data:", {
        name: updatedLodgeData.name,
        address: updatedLodgeData.address,
        latitude: updatedLodgeData.latitude,
        longitude: updatedLodgeData.longitude,
        description: updatedLodgeData.description,
        accommodationType: updatedLodgeData.accommodationType,
        roomTypes: updatedLodgeData.roomTypes,
        keepImgIds: updatedLodgeData.keepImgIds,
        newImageFiles: updatedLodgeData.newImageFiles
      })

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${updatedLodgeData.id}`,
        formData,
        { withCredentials: true }
      );
      return res.data as { message: string; lodge: Lodge };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to update lodge");
    }
  }
);

export const deleteLodge = createAsyncThunk<
  { message: string; lodge: Lodge },
  number,
  { rejectValue: string }
>(
  "admin/deleteLodge",
  async (lodgeId: number, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/lodge/${lodgeId}`,
        { withCredentials: true }
      );
      return res.data as { message: string; lodge: Lodge };
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(logout());
      }
      return rejectWithValue("Failed to delete lodge");
    }
  }
);
