import React from 'react'
import AddEditTasks from '../../components/task-management/add-edit-tasks'


const TaskManagement = () => {
    return (
        <div>Task-management
            {/* prefrebly in a modal */}
            <AddEditTasks />
        </div>

    )
}

export default TaskManagement