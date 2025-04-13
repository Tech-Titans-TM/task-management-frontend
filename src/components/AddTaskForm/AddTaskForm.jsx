import { useState } from 'react';
import './AddTaskForm.css';

function AddTaskForm({ onAdd }) {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task) return;
    onAdd(task);
    setTask('');
  };

  return (
    <div className='container'>
        <p className='title'>Add New Task</p>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            className='input'
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Task name"
        />

        <textarea
            className='input'
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add the task description here..."
        ></textarea>

        <div className='date-time-container'>
          <input
              type="date"
              className='input'
              style={{ width: '40%' }}
              value={task}
              onChange={(e) => setTask(e.target.value)}
          />

          <input
              type="time"
              className='input'
              style={{ width: '40%' }}
              value={task}
              onChange={(e) => setTask(e.target.value)}
          />
        </div>
        
        <div
            style={{ display: 'flex', justifyContent: 'flex-end', }}
        >
          <button type="submit" className='button'>Add Task</button>
        </div>
        </form>
    </div>
  );
}

export default AddTaskForm;