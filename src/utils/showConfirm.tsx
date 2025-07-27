import toast from "react-hot-toast";

interface ConfirmOptions {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function showConfirm({
  message,
  confirmLabel = "예",
  cancelLabel = "아니오",
  onConfirm,
  onCancel,
}: ConfirmOptions) {
  toast.custom((t) => (
    <div
      className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-lg"
      style={{
        background: "#222",
        color: "#fff",
        minWidth: "220px",
        borderRadius: "10px",
      }}
    >
      <span className="font-semibold">{message}</span>
      <div className="flex gap-2 mt-2">
        <button
          className="px-3 py-1 rounded bg-primary-700 text-white hover:bg-primary-500"
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm?.();
          }}
        >
          {confirmLabel}
        </button>
        <button
          className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-500"
          onClick={() => {
            toast.dismiss(t.id);
            onCancel?.();
          }}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  ));
}
