import AddEditTasks from '../../components/task-management/add-edit-tasks';

function AddEditTasksPage(){

    const handleAddTask = (task) => {
      console.log(`Task added: ${task}`);
    };

    return (
        <AddEditTasks onAdd={handleAddTask} />
    );
}

export default AddEditTasksPage;