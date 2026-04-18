export const DeleteConfirmModule = ({onCancel,onConfirm,message}) => {
  return (
    <>
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-black/50 z-4 backdrop-blur-xs "></div>
        <div className="relative flex h-full items-center justify-center p-4 z-5">
          <div className="p-6 rounded-lg shadow-xl max-w-md w-full mx-4 bg-white text-gray-800 dark:bg-gray-800 dark:text-white">
            <h3 className="text-xl font-bold mb-4 ">Подтверждение удаления</h3>
            <p className="mb-6">{message}</p>
            <div className="flex justify-end gap-5">
              <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-200 hover:bg-red-300 dark:bg-red-400 dark:hover:bg-red-500  transition-colors duration-300 cursor-pointer">
                Удалить
              </button>
              <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400 transition-colors duration-300 cursor-pointer">
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
