import { useEffect, useRef, useState, useCallback } from "react";
import { CheckBoxButton } from "./CheckBoxButton";
import { TodoEditForm } from "./TodoEditForm";
import { TodoTextDisplay } from "./TodoTextDisplay";
import { DeleteButton } from "./DeleteButton";

export const TodoItem = ({ todo, onDelete, onToggleComplete, onUpdate }) => {
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
    <div className=" group flex items-center justify-between p-4 gap-3 bg-white dark:bg-page-dark rounded-lg  shadow-sm hover:shadow-md dark:shadow-white transition-shadow duration-300 border-gray-100">
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
 <DeleteButton onClick={() => onDelete(todo.id)}/>
    </div>
  );
};
