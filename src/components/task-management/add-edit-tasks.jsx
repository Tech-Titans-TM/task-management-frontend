import { useState } from 'react';

function AddEditTasks({ onAdd, onCloseAction }) {
  const [task, setTask] = useState({
    name: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: '',
    status: 'Pending',
  });

  const priorityLevels = ['Low', 'Medium', 'High'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task) return;
    onAdd(task);
    setTask({
      name: '',
      description: '',
      dueDate: '',
      dueTime: '',
      priority: '',
      status: 'Pending',
    });
    onCloseAction();
  };

  return (
    <div className='container'>
        <div className='flex justify-between place-items-center mb-4'>
          <p className='text-2xl font-bold mb-4'>Add New Task</p>
          <button className='btn text-red-700 p-0 font-bold text-[15px]' onClick={onCloseAction}>
            X
          </button>
        </div>
        <form onSubmit={handleSubmit} className='form-control'>
          <input
              type="text"
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
              placeholder="Task name"
          />

          <textarea
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              placeholder="Add the task description here..."
          ></textarea>

          <div className='flex flex-row justify-between mb-4 w-full'>
            <div className='flex flex-col w-48'>
              <label>Due Date</label>
              <input
                type="date"
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full'
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              />
            </div>

            <div className='flex flex-col w-48'>
              <label>Due Time</label>
              <input
                  type="time"
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full'
                  value={task.dueTime}
                  onChange={(e) => setTask({ ...task, dueTime: e.target.value })}
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

          <div className='flex justify-end'>
            <button type="submit" className='btn btn-primary'>Add Task</button>
          </div>
        </form>
    </div>
  );
}

export default AddEditTasks;