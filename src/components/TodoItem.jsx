import { useSortable } from "@dnd-kit/react/sortable";

import { useEffect, useRef, useState, useCallback } from "react";
import { CheckBoxButton } from "./CheckBoxButton";
import { TodoEditForm } from "./TodoEditForm";
import { TodoTextDisplay } from "./TodoTextDisplay";
import { DeleteButton } from "./DeleteButton";

export const TodoItem = ({
  todo,
  index,
  onDelete,
  onToggleComplete,
  onUpdate,
}) => {
  const { ref, handleRef } = useSortable({ id: todo.id, index });
  const [isEditing, setIsEdinig] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDeadline, setEditDeadline] = useState(todo.deadline || "");
  const editFormRef = useRef(null);

  const handleToggle = () => {
    onToggleComplete(todo.id);
  };

  const handleSave = useCallback(() => {
    if (editText.trim()) {
      onUpdate(todo.id, editText, editDeadline); //сохранем в бз
    }
    setIsEdinig(false);
  }, [editText, editDeadline, todo.id, onUpdate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editFormRef.current && !editFormRef.current.contains(e.target)) {
        handleSave();
      }
      //если кликаем вне формы редактирвания, то сохран
    };

    if (isEditing) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isEditing, handleSave]);

  return (
    <div
      ref={ref}
      className=" group flex items-center justify-between p-4 gap-3 bg-white dark:bg-page-dark rounded-lg  shadow-sm hover:shadow-md dark:shadow-white transition-shadow duration-300 border-gray-100"
    >
      <div
        ref={handleRef}
        className="h-5 w-3 border-l-5 border-r-5 border-gray-300 border-dotted mx-0.5 cursor-grab active:cursor-grabbing"
      ></div>
      <div className="flex items-center gap-3 ">
        <CheckBoxButton
          completed={todo.completed}
          handleToggle={handleToggle}
        />

        {/* начинается редактирование  */}
        {isEditing ? (
          <TodoEditForm
            editFormRef={editFormRef}
            editText={editText}
            setEditText={setEditText}
            handleSave={handleSave}
            editDeadline={editDeadline}
            setEditDeadline={setEditDeadline}
          />
        ) : (
          <TodoTextDisplay todo={todo} setIsEdinig={setIsEdinig} />
        )}
      </div>
      <DeleteButton onClick={() => onDelete(todo.id)} />
    </div>
  );
};
