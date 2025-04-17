import { useState, useEffect } from 'react';
import AddEditTasks from '../../components/task-management/add-edit-tasks';
import { 
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../../utils/api/tasks/tasks.service';
import { TaskDto } from '../../utils/api/tasks/dtos/task.dto';

function TaskManagementPage(){

    const [activeTab, setActiveTab] = useState('All');
    const [currentAction, setCurrentAction] = useState('ADD');
    const [selectedTask, setSelectedTask] = useState(TaskDto);

    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

    const tabs = [
        { label: 'All', key: 'All' },
        { label: 'In Progress', key: 'In Progress' },
        { label: 'Pending', key: 'Pending' },
        { label: 'Completed', key: 'Completed' },
    ];

    const [tasks, setTasks] = useState([]);

    const handleAddTask = (task) => {
        task = {
            ...task,
            dueDate : task.dueDate ? new Date(`${task.dueDate}T00:00:00`).toISOString() : null,
            dueTime : task.dueTime ? new Date(`${task.dueDate}T${task.dueTime}`).toISOString() : null,
        }
      createTask(loggedInUser.userId, task)
        .then(() => {
          fetchTasks(loggedInUser);
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
    };

    const handleEditTask = (task) => {
        task = {
            _id: task.id,
            user: loggedInUser.userId,
            name: task.name,
            description: task.description,
            dueDate : task.dueDate ? new Date(`${task.dueDate}T00:00:00`).toISOString() : null,
            dueTime : task.dueTime ? new Date(`${task.dueDate}T${task.dueTime}`).toISOString() : null,
            priority: task.priority,
            status: task.status,
        }

      // Call the updateTask function from the service to sent the request to the backend
      updateTask(task)
        .then(() => {
          fetchTasks(loggedInUser);
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    };

    const handleDeleteTask = (taskId) => {
        deleteTask(taskId)
            .then(() => {
                fetchTasks(loggedInUser);
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    };

    const closeModel = () => {
        const modal = document.getElementById('add_edit_task_modal');
        if (modal) {
            modal.close();
        }
        setCurrentAction('ADD');
        setSelectedTask(TaskDto);
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
                    onClick={() => {
                        setCurrentAction('ADD');
                        document.getElementById('add_edit_task_modal').showModal()
                    }}
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
                                <button 
                                    className="btn btn-sm btn-neutral mr-2"
                                    onClick={() => {
                                                setCurrentAction('EDIT');
                                                setSelectedTask({
                                                    ...task,
                                                    dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-CA') : '',
                                                    dueTime: task.dueTime ? new Date(task.dueTime).toLocaleTimeString('en-GB', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false,
                                                    }) : '',
                                                });
                                                document.getElementById('add_edit_task_modal').showModal()
                                            }
                                        }
                                    >
                                        Edit
                                </button>
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
                    <AddEditTasks
                        onAdd={currentAction == "EDIT" ? handleEditTask : handleAddTask}
                        onDelete={handleDeleteTask}
                        onCloseAction={closeModel}
                        action={currentAction}
                        taskData={selectedTask}
                    />
                </div>
            </dialog>
        </div>
    );
}

export default TaskManagementPage;