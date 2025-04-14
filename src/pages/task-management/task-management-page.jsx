import AddEditTasks from '../../components/task-management/add-edit-tasks';

function TaskManagementPage(){

    const handleAddTask = (task) => {
      console.log(`Task added: ${task}`);
    };

    const closeModel = () => {
        const modal = document.getElementById('add_edit_task_modal');
        if (modal) {
            modal.close();
        }
    }

    return (
        <div>
            <button
                className="btn btn-primary"
                onClick={() => document.getElementById('add_edit_task_modal').showModal()}
            >
                Add New Task
            </button>
            <dialog id="add_edit_task_modal" className="modal">
                <div className="modal-box">
                    <AddEditTasks onAdd={handleAddTask} onCloseAction={closeModel} />
                </div>
            </dialog>
        </div>
    );
}

export default TaskManagementPage;