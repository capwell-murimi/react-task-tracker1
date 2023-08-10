import { useState,useEffect } from    'react'
import { BrowserRouter  as  Router,Route,Routes } from "react-router-dom";
import Header from "./components/Header";
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
import About from './components/About';

export  default function App() {
  const   [tasks ,    setTasks]  =   useState([])
  const[showAddTask,setshowAddTask]   =   useState(false)

  useEffect(()  =>  {
    async function getTasks() {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }
    getTasks()
  },[])


  //fetch tasks
  async function fetchTasks() {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    return data;
  }

//fetch task
  async function fetchTask(id) {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    return data;
  }

//add task
  async function addTask(task) {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    const data = await res.json();
    setTasks([...tasks, data]);

  }

//delete  task
  async function deleteTask(id) {
    await fetch(`http://localhost:5000/tasks/${id}`,

      {
        method: 'DELETE',
      });

    setTasks(tasks.filter((task) => task.id !== id));
  }


//Toggle reminder
  async function toggleReminder(id) {
    const taskToToggle = await fetchTask(id);
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    });

    const data = await res.json();
    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: !task.reminder } : task));
  }
return (
  <Router>
    <div className='container'>
      <Header
        onAdd={() => setshowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      <Routes>
        <Route
          path='/'
          element={
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              ) : (
                'No Tasks To Show'
              )}
            </>
          }
        />
        <Route path='/about' element={<About />} />
      </Routes>
      <Footer />
    </div>
  </Router>
)
}
