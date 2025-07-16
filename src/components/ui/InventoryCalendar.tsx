import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type InventoryCalendarProps = {
  roomInventories: Record<string, any>[];
  ticketInventories: Record<string, any>[];
};

type CalendarValue = Date | null | [Date | null, Date | null];

const InventoryCalendar = ({
  roomInventories,
  ticketInventories,
}: InventoryCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(new Date());

  const getDateKey = (dateStr: string) => dateStr.split("T")[0];

  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const dateKey = date.toISOString().split("T")[0];

    const hasRoomInventory = roomInventories.some(
      (item) => getDateKey(item.date) === dateKey
    );
    const hasTicketInventory = ticketInventories.some(
      (item) => getDateKey(item.date) === dateKey
    );

    if (hasRoomInventory || hasTicketInventory) {
      return <div className="text-green-600 text-xs mt-1">재고있음</div>;
    }
    return null;
  };

  const getSelectedDateString = () => {
    if (!selectedDate || Array.isArray(selectedDate)) return "";
    return selectedDate.toISOString().split("T")[0];
  };

  const selectedDateString = getSelectedDateString();

  const roomInventoriesForDate = roomInventories.filter(
    (item) => getDateKey(item.date) === selectedDateString
  );
  const ticketInventoriesForDate = ticketInventories.filter(
    (item) => getDateKey(item.date) === selectedDateString
  );

  return (
    <div className="my-4">
      <h3 className="text-xl font-bold mb-2">재고 캘린더</h3>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        tileContent={renderTileContent}
        locale="ko-KR"
      />

      {selectedDateString && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2">
            {selectedDateString} 재고 상세
          </h4>

          <h5 className="font-semibold mt-2">방 재고</h5>
          {roomInventoriesForDate.length > 0 ? (
            <ul className="list-disc ml-5">
              {roomInventoriesForDate.map((item) => (
                <li key={item.id}>
                  룸타입 {item.roomType.name}: {item.availableRooms}개
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">방 재고 없음</p>
          )}

          <h5 className="font-semibold mt-4">티켓 재고</h5>
          {ticketInventoriesForDate.length > 0 ? (
            <ul className="list-disc ml-5">
              {ticketInventoriesForDate.map((item) => (
                <li key={item.id}>
                  티켓타입 {item.ticketType.name}: 성인{" "}
                  {item.availableAdultTickets}개, 어린이{" "}
                  {item.availableChildTickets}개
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">티켓 재고 없음</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryCalendar;
