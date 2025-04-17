import { useState, useEffect } from 'react';
import { TaskDto } from '../../utils/api/tasks/dtos/task.dto';
import {
  PencilSquareIcon,
  DocumentPlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

function AddEditTasks({ action = "ADD", onAdd, onDelete, onCloseAction, taskData = TaskDto }) {
  const [task, setTask] = useState(taskData);

  const priorityLevels = ['Low', 'Medium', 'High'];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task) return;
    onAdd(task);
    setTask(TaskDto);
    onCloseAction();
  };

  // Reset task state when taskData changes
  useEffect(() => {
    setTask(taskData);
  }, [taskData]);

  return (
    <div className='container'>
        <div className='flex justify-between place-items-center mb-4'>
          {/* Popup model title */}
          <p className='text-2xl font-bold mb-4'>{action == "EDIT" ? "Edit Task" : "Add New Task"}</p>

          {/* Popup model close button */}
          <button className='btn text-red-700 p-0 font-bold text-[15px]' onClick={() => {
            setTask(TaskDto);
            onCloseAction();
          }}>
            X
          </button>

        </div>

        {/* Popup model form to add/edit tasks */}
        <form onSubmit={handleSubmit} className='form-control'>
          <input
              type="text"
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
              placeholder="Task name"
              required
          />

          <textarea
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              placeholder="Add the task description here..."
              required
          ></textarea>

          <div className='flex flex-row justify-between mb-4 w-full'>
            <div className='flex flex-col w-48'>
              <label>Due Date</label>
              <input
                type="date"
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full'
                value={task.dueDate}
                // Set the minimum date to today
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                required
              />
            </div>

            <div className='flex flex-col w-48'>
              <label>Due Time</label>
              <input
                  type="time"
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full'
                  value={task.dueTime}
                  onChange={(e) => setTask({ ...task, dueTime: e.target.value })}
                  required
              />
            </div>
          </div>
          
          <label>Priority</label>
          <div className="flex gap-4 mb-4">
            {priorityLevels.map((level) => (
              <label 
                key={level} 
                className={`btn bg-gray-700 ${
                  task.priority === level ? 'btn-active' : ''
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={level}
                  checked={task.priority === level}
                  onChange={(e) => setTask({ ...task, priority: e.target.value })}
                  className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                />
                {level}
              </label>
            ))}
          </div>

          <div className='flex flex-col mb-4 w-80'>
            <label>Status</label>
            <select
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full'
                value={task.status}
                onChange={(e) => setTask({ ...task, status: e.target.value })}
            >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Display the add/edit/delete buttons accordingly */}
          <div className={'flex flex-row ' + (action == "EDIT" ? 'justify-between' : 'justify-end')}>
            {action == "EDIT" && (
              <button
                type="button"
                className='btn btn-error mr-2'
                onClick={() => {
                  onDelete(task._id);
                  onCloseAction();
                }}
              >
                <TrashIcon className="h-4 w-4" />
                Delete Task
              </button>
            )}
            <button type="submit" className='btn btn-primary'>{ action == "EDIT" ? (<><PencilSquareIcon className="h-4 w-4"/>Save changes</>) : (<><DocumentPlusIcon className="h-4 w-4" />Add Task</>)}</button>
          </div>
        </form>
    </div>
  );
}

export default AddEditTasks;