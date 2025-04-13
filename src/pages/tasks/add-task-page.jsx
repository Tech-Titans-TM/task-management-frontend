import AddTaskForm from '../../components/AddTaskForm/AddTaskForm';

function AddTaskPage(){

    const handleAddTask = (task) => {
      console.log(`Task added: ${task}`);
    };

    return (
        <AddTaskForm onAdd={handleAddTask} />
    );
}

export default AddTaskPage;