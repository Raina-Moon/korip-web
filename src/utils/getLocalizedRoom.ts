import { RoomType } from "@/types/lodge";
import { getLocalizedField } from "./getLocalizedField";

export const getLocalizedRoom = (room: RoomType, locale: string) => {
  return {
    ...room,
    localizedName: getLocalizedField(room.name, room.nameEn, locale),
    localizedDescription: getLocalizedField(room.description, room.descriptionEn, locale),
  };
};
