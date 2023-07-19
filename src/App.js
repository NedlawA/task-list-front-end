import React, { useEffect, useState } from 'react';
import TaskList from './components/TaskList.js';
import './App.css';
import axios from 'axios';
import NewTaskForm from './components/NewTaskForm.js';

const kBaseUrl = 'https://task-list-api-c17.onrender.com/';

const taskAPIToJson = task => {
  const { description, id, is_complete: isComplete, title } = task;
  return { description, id, isComplete, title };
};

const getTasks = async () => {
  try {
    const response = await axios.get(`${kBaseUrl}/tasks`);
    return response.data.map(taskAPIToJson);
  } catch (err) {
    console.log(err);
    throw new Error('error fetching tasks');
  }
};

const updateTask = async (id, markComplete) => {
  const endpoint = markComplete ? 'mark_complete' : 'mark_incomplete';
  try {
    const response = await axios.patch(`${kBaseUrl}/tasks/${id}/${endpoint}`);
    return taskAPIToJson(response.data.task);
  } catch (err) {
    console.log(err);
    throw new Error(`error updating task ${id}`);
  }
};

const deleteTaskAsync = async id => {
  try {
    await axios.delete(`${kBaseUrl}/tasks/${id}`);
  } catch (err) {
    console.log(err);
    throw new Error(`error deleting task ${id}`);
  }
};
const addTaskAsync = async taskData => {
  const { title, isComplete } = taskData;

  const description = 'created in Task List Front End';
  const completedAt = isComplete ? new Date() : null;

  const body = { title, description, 'completed_at': completedAt };

  try {
    const response = await axios.post(`${kBaseUrl}/tasks`, body);

    return taskAPIToJson(response.data.task);

  } catch (err) {
    console.log(err);

    throw new Error('error creating task');
  }
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    refreshTasks();
  }, []);

  const refreshTasks = async () => {
    try {
      const tasks = await getTasks();
      setTasks(tasks);
    } catch (err) {
      console.log(err.message);
    }
  };

  const setComplete = async id => {
    const task = tasks.find(task => task.id === id);
    if (!task) { return; }
    try {
      const newTask = await updateTask(id, !task.isComplete);
      setTasks(prev => {
        return prev.map(task => {
          if (task.id === newTask.id) {
            return newTask;
          } else {
            return task;
          }
        });
      });
    } catch (err) { console.log(err.message); }
  };

  const deleteTask = async id => {
    try {
      await deleteTaskAsync(id);
      setTasks(prev => {
        return prev.filter(task => task.id !== id);
      });
    } catch (err) { console.log(err.message); }
  };
  const addTask = async taskData => {
    try {
      const task = await addTaskAsync(taskData);
      setTasks(oldTasks => [ ...oldTasks, task ]);
    } catch (err) {
      console.log(err.message);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Ada&apos;s Task List</h1>
      </header>
      <main>
        <div>
          <TaskList tasks={tasks} onClickCallback={setComplete} onDeleteCallback={deleteTask} />
        </div>
        <NewTaskForm onAddTaskCallback={addTask} />
      </main>
    </div>
  );
};

export default App;
