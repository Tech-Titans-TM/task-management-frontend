import { useState, useEffect } from 'react';
import AddEditTasks from '../../components/task-management/add-edit-tasks';
import { 
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../../utils/api/tasks/tasks.service';
import { TaskDto } from '../../utils/api/tasks/dtos/task.dto';
import {
    PencilSquareIcon,
    PlusCircleIcon,
} from '@heroicons/react/24/outline';

function TaskManagementPage(){

    const [activeTab, setActiveTab] = useState('All');
    const [currentAction, setCurrentAction] = useState('ADD');
    const [selectedTask, setSelectedTask] = useState(TaskDto);
    const [searchString, setSearchString] = useState('');
    const [tasksCompletedPercentage, setTasksCompletedPercentage] = useState(0);

    // Get the logged-in user from session storage
    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

    // Define the tabs layout
    const tabs = [
        { label: 'All', key: 'All' },
        { label: 'In Progress', key: 'In Progress' },
        { label: 'Pending', key: 'Pending' },
        { label: 'Completed', key: 'Completed' },
        { label: <progress class="progress progress-success w-56" value={tasksCompletedPercentage} max="100"></progress>, key: 'progress_bar' },
    ];

    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);

    // Handle task addition
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

    // Handle task editing
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

    // Handle task deletion
    const handleDeleteTask = (taskId) => {
        deleteTask(taskId)
            .then(() => {
                fetchTasks(loggedInUser);
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    };

    // Close the modal and reset the selected task
    const closeModel = () => {
        const modal = document.getElementById('add_edit_task_modal');
        if (modal) {
            modal.close();
        }
        setCurrentAction('ADD');
        setSelectedTask(TaskDto);
    }

    // Fetch all tasks from the backend using the getAllTasks function
    const fetchTasks = async (loggedInUser) => {
        let data = await getAllTasks(loggedInUser.userId);
        data = data.map(task => ({
          ...task,
          id: task._id,
        }));
        setTasks(data);
    };

    // Fetch tasks when the component mounts
    useEffect(() => {
      try {
        fetchTasks(loggedInUser);
      }
      catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }, []);

    // Filter tasks based on the search string
    useEffect(() => {
        const filtered = tasks.filter((task) => {
            const taskName = task.name.toLowerCase();
            const taskDescription = task.description.toLowerCase();
            const search = searchString.toLowerCase();
            return taskName.includes(search) || taskDescription.includes(search);
        });
        setFilteredTasks(filtered);
    }, [searchString, tasks]);

    // Calculate the percentage of completed tasks
    useEffect(() => {
        const completedTasks = tasks.filter(task => task.status === 'Completed').length;
        setTasksCompletedPercentage((completedTasks / tasks.length) * 100);
    }, [tasks]);

    return (
        <div>
            <p className='text-2xl font-bold mb-4'>The tasks you have planned</p>
            
            <div className='flex justify-end'>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-xs mr-4"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setCurrentAction('ADD');
                        document.getElementById('add_edit_task_modal').showModal()
                    }}
                >
                    <PlusCircleIcon className="h-4 w-4" />
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
                    onClick={() => {
                        if (tab.key !== 'progress_bar') {
                            setActiveTab(tab.key);
                        }
                    }}
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
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                        {filteredTasks.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">No tasks available</td>
                            </tr>
                        ) : (
                            filteredTasks.map((task, index) => (
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
                                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-CA') : ''} {task.dueTime ? new Date(task.dueTime).toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                }) : ''}</td>
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
                                    className="btn btn-primary btn-sm btn-neutral mr-2"
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
                                        <PencilSquareIcon className="h-4 w-4" />
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