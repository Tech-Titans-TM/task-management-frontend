import { useState } from 'react';
import './add-edit-tasks.css';

function AddEditTasks({ onAdd }) {
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
    setTask(null);
  };

  return (
    <div className='container'>
        <p className='title'>Add New Task</p>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            className='input'
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
            placeholder="Task name"
        />

        <textarea
            className='input'
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            placeholder="Add the task description here..."
        ></textarea>

        <div className='date-time-container'>
          <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
            <label>Due Date</label>
            <input
              type="date"
              className='input'
              style={{ width: '100%' }}
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
            <label>Due Time</label>
            <input
                type="time"
                className='input'
                style={{ width: '100%' }}
                value={task.dueTime}
                onChange={(e) => setTask({ ...task, dueTime: e.target.value })}
            />
          </div>
        </div>
        
        <label>Priority</label>
        <div className="priority-group">
          {priorityLevels.map((level) => (
            <label key={level} className={`priority-option ${task.priority === level ? 'active' : ''}`}>
              <input
                type="radio"
                name="priority"
                value={level}
                checked={task.priority === level}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
              />
              {level}
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
          <label>Status</label>
          <select
              className='input'
              style={{ width: '100%' }}
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
          >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
          </select>
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

export default AddEditTasks;