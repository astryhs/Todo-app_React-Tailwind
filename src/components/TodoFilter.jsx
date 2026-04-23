import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { MdOutlineFilterList } from "react-icons/md";

export const TodoFilter = ({ filter, setFilter }) => {
  const buttonClasses = (currentFilter) =>
    `px-6 py-2 rounded transition-colors duration-150 cursor-pointer ${
      filter === currentFilter
        ? "bg-blue-500 text-white"
        : "bg-blue-200 dark:bg-gray-500 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
    }`;

  return (
    <div className="flex flex-row w-full justify-center gap-2 mb-4 ">
      <button
        onClick={() => setFilter("all")}
        className={buttonClasses("all")}
        aria-label="Все"
      >
        <MdOutlineFilterList size={18} />
      </button>
      <button
        onClick={() => setFilter("completed")}
        className={buttonClasses("completed")}
        aria-label="Выполненные"
      >
        {" "}
        <FaCheckCircle size={16} />
      </button>
      <button
        onClick={() => setFilter("active")}
        className={buttonClasses("active")}
        aria-label="Не выполненные"
      >
        <FaRegCircle size={16} />
      </button>
    </div>
  );
};
