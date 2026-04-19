import { formatDateTime } from "../helpers/dateUtils";

export const TodoTextDisplay = ({ todo, setIsEdinig }) => {
  return (
    <div
      className="flex flex-col cursor-pointer"
      onDoubleClick={() => setIsEdinig(true)}
    >
      <span
        className={`text-1 ${todo.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}
      >
        {todo.text}
      </span>
      <span className="text-xs text-gray-400">
        Создано: {formatDateTime(todo.createdAt)}
      </span>
      {todo.deadline && (
        <span
          className={`text-xs ${todo.completed ? "text-gray-400" : new Date(todo.deadline) < new Date() ? "text-red-500" : "text-gray-400"}`}
        >
          Сделать до: {formatDateTime(todo.deadline)}
        </span>
      )}
    </div>
  );
};
