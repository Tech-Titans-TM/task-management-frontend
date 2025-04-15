import { useState, useEffect } from 'react';
import AddEditTasks from '../../components/task-management/add-edit-tasks';
import { getAllTasks } from '../../utils/api/tasks/tasks.service';

function TaskManagementPage(){

    const [activeTab, setActiveTab] = useState('All');

    const tabs = [
        { label: 'All', key: 'All' },
        { label: 'In Progress', key: 'In Progress' },
        { label: 'Pending', key: 'Pending' },
        { label: 'Completed', key: 'Completed' },
    ];

    const [tasks, setTasks] = useState([
        { name: 'Task 1', description: 'abc', dueDate: '2023-10-01', dueTime: '10:52', priority: 'High', status: 'Pending' },
        { name: 'Task 2', description: 'xyz', dueDate: '2023-10-02', dueTime: '11:52', priority: 'Medium', status: 'Completed' },
        { name: 'Task 3', description: '123', dueDate: '2023-10-03', dueTime: '12:52', priority: 'Low', status: 'In Progress' },
        { name: 'Task 4', description: '456', dueDate: '2023-10-04', dueTime: '13:52', priority: 'High', status: 'Pending' },
        { name: 'Task 5', description: '789', dueDate: '2023-10-05', dueTime: '14:52', priority: 'Medium', status: 'Completed' },
    ]);

    const handleAddTask = (task) => {
      console.log(`Task added: ${task}`);
    };

    const closeModel = () => {
        const modal = document.getElementById('add_edit_task_modal');
        if (modal) {
            modal.close();
        }
    }

    const fetchTasks = async (loggedInUser) => {
        let data = await getAllTasks(loggedInUser.userId);
        data = data.map(task => ({
          ...task,
          id: task._id,
        }));
        setTasks(data);
    };

    useEffect(() => {
      try {
        const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
        fetchTasks(loggedInUser);
      }
      catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }, []);

    return (
        <div>
            <p className='text-2xl font-bold mb-4'>The tasks you have planned</p>
            
            <div className='flex justify-end'>
                <button
                    className="btn btn-primary"
                    onClick={() => document.getElementById('add_edit_task_modal').showModal()}
                >
                    Add New Task
                </button>
            </div>

            {/* Tabs layout Headers */}
            <div role="tablist" className="tabs tabs-bordered mb-4">
                {tabs.map((tab) => (
                <a
                    key={tab.key}
                    role="tab"
                    className={`tab ${activeTab === tab.key ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                >
                    {tab.label}
                </a>
                ))}
            </div>

            {/* Tabs layout Contents */}
            <div className="p-4 border border-base-300 rounded-box">
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>Task name</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">No tasks available</td>
                            </tr>
                        ) : (
                            tasks.map((task, index) => (
                            (activeTab == 'All' || activeTab == task.status) && (<tr key={index}>
                                <td>{task.name}</td>
                                <td>{task.description}</td>
                                <td>
                                <span className={`badge ${
                                    task.priority === 'High' ? 'badge-error' :
                                    task.priority === 'Medium' ? 'badge-warning' :
                                    'badge-success'
                                }`}>
                                    {task.priority}
                                </span>
                                </td>
                                <td>
                                <span className={`badge ${
                                    task.status === 'Completed' ? 'badge-success' :
                                    task.status === 'Pending' ? 'badge-info' :
                                    task.status === 'In Progress' ? 'badge-warning' :
                                    'badge-neutral'
                                }`}>
                                    {task.status}
                                </span>
                                </td>
                                <td>
                                <button className="btn btn-sm btn-neutral mr-2">Edit</button>
                                </td>
                            </tr>)
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit task dialog */}
            <dialog id="add_edit_task_modal" className="modal">
                <div className="modal-box">
                    <AddEditTasks onAdd={handleAddTask} onCloseAction={closeModel} />
                </div>
            </dialog>
        </div>
    );
}

export default TaskManagementPage;