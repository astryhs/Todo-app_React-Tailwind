export const DeadlineBlock = ({
  showDeadlineInput,
  deadline,
  setDeadline,
  setShowDeadlineInput,
}) => {
  return (
    <>
      {" "}
      {showDeadlineInput && (
        <div className="flex items-center gap-2 mt-2 text-gray-500 dark:text-gray-400">
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="p-2 border border-blue-700 rounded flex-1  "
          />
          <button
            type="button"
            onClick={() => {
              setDeadline("");
              setShowDeadlineInput(false);
            }}
            className="p-2 hover:text-gray-700 hover:dark:text-gray-100 cursor-pointer"
          >
            Отмена
          </button>
        </div>
      )}
      {!showDeadlineInput && (
        <button
          type="button"
          onClick={() => {
            setShowDeadlineInput(true);
          }}
          className="self-start mt-2 text-sm text-blue-500 hover:text-blue-700 dark:text-blue-300 hover:dark:text-blue-400"
        >
          + Добавить дедлайн
        </button>
      )}
    </>
  );
};
