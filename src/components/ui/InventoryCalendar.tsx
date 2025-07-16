import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type InventoryCalendarProps = {
  inventories: Record<string, any>[];
  title: string;
  dateKey: string;
  countKey: string;
};

type CalendarValue = Date | null | [Date | null, Date | null];

const InventoryCalendar = ({
  inventories,
  title,
  dateKey,
  countKey,
}: InventoryCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date());

  const inventoryMap = new Map<string, number>();
  inventories.forEach((item: Record<string, any>) => {
    inventoryMap.set(item[dateKey], item[countKey]);
  });

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const yyyyMMdd = date.toISOString().split("T")[0];
    const count = inventoryMap.get(yyyyMMdd);

    return count !== undefined ? (
      <div
        className={`text-xs mt-1 ${
          count > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {count}개
      </div>
    ) : null;
  };

  const handleDateChange = (
    value: CalendarValue,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSelectedDate(value);
  };

  return (
    <div className="my-4">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        tileContent={renderTileContent}
        locale="ko-KR"
      />
    </div>
  );
};

export default InventoryCalendar;
