import { CheckedIcon } from "./CheckedIcon";

export const TodoEditForm = ({
  editFormRef,
  editText,
  setEditText,
  handleSave,
  editDeadline,
  setEditDeadline,
}) => {
  return (
    <div ref={editFormRef} className="flex flex-col w-full gap-2 items-stretch">
      <input
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        className="w-full px-2 py-1 border-2 border-blue-500 rounded text-gray-700 dark:text-gray-100 "
      />
      <div className="flex flex-col sm:flex-row gap-2 w-full ">
        <input
          type="datetime-local"
          value={editDeadline}
          onChange={(e) => setEditDeadline(e.target.value)}
          className="text-gray-400 w-full sm:flex-1 px-2 py-1 border-2 border-blue-500 rounded"
        />
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-1 px-2 py-1 sm:px-3 sm:py-1 text-green-600 hover:text-green-800 cursor-pointer bg-white border-2 border-green-500 rounded hover:bg-green-50 transition-colors text-sm sm:text-base "
        >
          <CheckedIcon />
          <span className="sm:hidden">ОК</span>
          <span className="hidden sm:inline">Готово</span>
        </button>
      </div>
    </div>
  );
};
