export const DeleteCompletedButton = ({ handleDeleteCompleted }) => {
  return (
    <button
      onClick={handleDeleteCompleted}
      className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500 transition-colors duration-300 cursor-pointer mt-4"
    >
      Удалить выполненные
    </button>
  );
};
