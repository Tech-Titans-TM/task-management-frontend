
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import AddTaskPage from './pages/tasks/add-task-page';

function App() {


  return (
    <div>
        <h1>Task Manager</h1>
        <nav>
          <Link to="/add-new-task">Add new task</Link>
        </nav>

      <Routes>
        <Route path="/add-new-task" element={<AddTaskPage />} />
      </Routes>
    </div>
  )
}

export default App
