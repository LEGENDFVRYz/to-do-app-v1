import { useState, useEffect } from 'react'
import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css'

import { savingData, readData, formatTime, formatDate } from './components/helperFunctions';
import AddTaskForm from './components/AddTaskForm';
import EditTaskForm from './components/EditTaskForm';
import TaskCard from './components/TaskCard';
import TimeLeft from './components/TimeLeft';
import TimePassed from './components/TimePassed';

function App() {
  const [taskCounter, setTaskCounter] = fromLocal('taskCounter', 0);
  const [dataList, setDataList] = fromLocal('dataList', []);
  const [isCheckAll, setIsCheckAll] = fromLocal('isCheckAll', false);

  // New state variables for filtering tasks and managing active button
  const [activeFilter, setActiveFilter] = useState('all');
  const filteredDataList = activeFilter === 'completed' 
  ? dataList.filter(task => task.isFinished) 
  : activeFilter === 'missing'
    ? dataList.filter(task => new Date(`${task.due_date}T${task.due_time}`) < new Date())
    : activeFilter === 'today'
      ? dataList.filter(task => {
          const taskDateTime = new Date(`${task.due_date}T${task.due_time}`);
          const now = new Date();
          const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          return taskDateTime >= now && taskDateTime <= next24Hours;
        })
      : dataList;

  // Variable for Editing Tasks
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const taskToEdit = dataList.find(task => task.id === selectedTaskId);
  
  // Function for creating state sync with local storage
  function fromLocal(key, initialValue) {
    const [value, setValue] = useState(() => {
      const savedValue = localStorage.getItem(key);
      return savedValue !== null ? JSON.parse(savedValue) : initialValue;
    });
  
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);   // Triggers if value changes successfully
  
    return [value, setValue]; // Return the state
  }

  // Get data from the addTaskForm
  const getData = (data) => {
    const updatedData = { ...data, id: taskCounter, isFinished: false };       // Add unique: id to the data object
    
    setDataList((prevList) => {
      const newList = [...prevList, updatedData];
      savingData("dataList", newList);                     // Update the data in the Local Storage
      return newList;
    });
    
    setTaskCounter(prevCounter => prevCounter + 1);
    // console.log(dataList)
  };

   // Handle the data from EditTaskForm
   const updateData = (updatedTask) => {
    console.log(updatedTask);
    setDataList((prevList) => {
        const newList = prevList.map((task) => 
            task.id === selectedTaskId ? { ...task, ...updatedTask } : task
        );
        console.log("==========");
        console.log(newList);
        savingData("dataList", newList);  // Update the Local Storage
        return newList;
    });
    setSelectedTaskId(null); // Clear selected task after editing
  };

  // Task Delete Selections
  const [selectedKeyId, setSelectedKeyId] = useState(null);
  const handleDeleteClick = (keyId) => {
    setSelectedKeyId(keyId);
  };

  const deleteTask = (target_id) => {
    setDataList((prevList) => {
      const newList = prevList.filter((item) => item.id !== target_id);
      savingData("dataList", newList);                     // Update the data in the Local Storage
      return newList;
    });
    setSelectedKeyId(null);
    // console.log(dataList)
  };


  // Function to delete data and provide feedback
  const deleteAll = () => {
    localStorage.removeItem('dataList');
    setDataList([]); // This will trigger a re-render
    // alert('Data removed from local storage');
  };

  // Add an event listener for the modal confirmation button

  const checkAll = (status) => {
    const divs = document.querySelectorAll('.task-card');
    divs.forEach((div) => {
      div.style.opacity = status ? '60%' : '100%';
      div.style.textDecoration = status ? 'line-through' : 'none';
    });
  };

  const isCheckAllToggle = () => {
    const newStatus = !isCheckAll;

    // Update the data list with the new status
    const updatedDataList = dataList.map(task => ({ ...task, isFinished: newStatus }));

    checkAll(newStatus);
    savingData("dataList", updatedDataList);
    setDataList(updatedDataList)
    
    setIsCheckAll(newStatus);
  };

  // single check
  const isDone = (target_id) => {
    setDataList((prevList) => {
      const newList = prevList.map((item) => {
        if (item.id === target_id) {
          return { ...item, isFinished: !item.isFinished };       // Create a new object
        }
        return item;
      });
  
      savingData("dataList", newList);  // Update the Local Storage

      // Check if all tasks are finished
      const allFinished = newList.every((item) => item.isFinished);
      setIsCheckAll(allFinished);  // Update the `isCheckAll` state

      return newList;
    });
  };

  const handleEditClick = (id) => {
    setSelectedTaskId(id);  
  };

  // Handle filter change and active button state
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Read the dataList Once
  useEffect(() => {
    const data = readData('dataList');

    if (data) {
      setDataList(data);
      console.log(data);
    }
  }, []);

  // HTML PART
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-dark-blue fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-white" onClick={() => handleFilterChange('all')}>
            <i className="bi bi-folder-fill"></i> TASK PLANNER
          </a>
          <button
            className="navbar-toggler bg-light-blue"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className={`nav-item ${activeFilter === 'all' ? 'active' : ''}`}>
                <a className="nav-link text-white" onClick={() => handleFilterChange('all')}>
                  <i className="bi bi-house-door pe-2"></i>Home
                </a>
              </li>
              <li className={`nav-item ${activeFilter === 'completed' ? 'active' : ''}`}>
                <a className="nav-link text-white" onClick={() => handleFilterChange('completed')}>
                  <i className="bi bi-check2-circle pe-2"></i>Completed
                </a>
              </li>
              <li className={`nav-item ${activeFilter === 'missing' ? 'active' : ''}`}>
                <a className="nav-link text-white" onClick={() => handleFilterChange('missing')}>
                  <i className="bi bi-bell pe-2"></i>Missing
                </a>
              </li>
              <li className={`nav-item ${activeFilter === 'today' ? 'active' : ''}`}>
                <a className="nav-link text-white" onClick={() => handleFilterChange('today')}>
                  <i className="bi bi-heart pe-2"></i>Today Task
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="main-wrap container-fluid">
        <div className="row">

          {/* Side */}
          <aside className="container-xs col-3 bg-dark-blue d-none">
            <div className="menu container-fluid text-alt-white">
              <div className="logo">
                <h1 className="text-center fw-bold fs-2"><i className="bi bi-folder-fill"></i> TASK PLANNER</h1>
                <hr className='bg-white-100' />
              </div>

              <div className="menu-btns">
                <a href="" className="home-pg active">
                  <i className="bi bi-house-door"></i>HOME
                </a>
                <a href="" className="schedule-pg">
                  <i className="bi bi-calendar"></i>SCHEDULE
                </a>
                <a href="" className="daily-pg">
                  <i className="bi bi-bullseye"></i>GOALS
                </a>
                <a href="" className="report-pg">
                  <i className="bi bi-stickies"></i>REPORT
                </a>
              </div>
            </div>

            <div className="mini-report flex-grow-1">
              <div>
                <p className='text-center text-white fs-3 fw-bold'>NO DAILY ACTIVITIES</p>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className='container col-lg-9'>
            <div className="row">
              <div class="container">
                <div class="content-box p-3">
                  <h1 class="fw-bold text-center mb-3">START YOUR DAY!</h1>
                  <p class="fs-5 px-2 px-sm-0 px-md-8 text-center">
                    Are you ready to take control of your day and boost your productivity? We're here to help you manage your tasks effortlessly. 
                    <span>This management system is designed to handle your <b>daily tasks</b> (<i>which are tasks that occur every day</i>) and <b>one-time tasks</b> (<i>which are tasks dedicated to temporary or special projects</i>).</span>
                  </p>
                </div>
              </div>
              <div className='btn-box d-none'>
                <button type="button" className="btn btn-outline-dark-blue btn-lg" data-bs-toggle="modal" data-bs-target="#m-adding-form">
                  <i className="bi bi-info-circle-fill"> </i>NEED HELP?
                </button>
              </div>
            </div>

            <div className="row2 row task-box">
              <div className='task-menu'>
                <button type="button" className="btn btn-outline-dark-blue btn-lg" data-bs-toggle="modal" data-bs-target="#m-adding-form">
                  <i className="bi bi-plus-circle"></i> <span>ADD TASK</span>
                </button>
                <button type="button" className="btn btn-outline-dark-blue btn-lg ms-2" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal">
                  <i className="bi bi-archive"></i> <span>DELETE DATA</span> 
                </button>
                <button type="button" className="btn btn-outline-dark-blue btn-lg ms-2" onClick={isCheckAllToggle}>
                  <i className="bi bi-check2-all"></i> <span>CHECK ALL</span> 
                </button>
                {/* <hr className='my-2'/> */}
              </div>
              <div className='task-wrap'>
                {filteredDataList.map(
                    (task) => {
                      // console.log(task); console.log(index);
                        return <TaskCard 
                        key={task.id}
                        title={task.task_title} 
                        priority={task.priority} 
                        dueDate={formatDate(task.due_date)}
                        dueTime={formatTime(task.due_time)}
                        type={task.type} 
                        keyId={task.id}
                        isFinished={task.isFinished}
                        deleteFunc={handleDeleteClick}
                        checkFunc={isDone}
                        timeLeft={<TimeLeft dueDate={task.due_date} dueTime={task.due_time}/>}
                        timePassed={<TimePassed dateTime={task.date_posted}
                      />}
                        onEditClick={handleEditClick} // Pass the edit handler
                    />
                    }
                  )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal: For Adding tasks forms */}
      <AddTaskForm onData={getData}/>
      {selectedTaskId !== null && taskToEdit && (
        <EditTaskForm onData={updateData} taskData={taskToEdit} />
      )}

      {/* Modal: For alerts and notice */}
      <div className="modal fade" id="deleteConfirmationModal" tabIndex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteConfirmationModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete all data? This action cannot be undone.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" id="confirmDelete" data-bs-dismiss="modal" onClick={deleteAll}>Delete All</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="deleteSelectionModal" tabIndex="-1" aria-labelledby="deleteSelectionModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteSelectionModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this data? This action cannot be undone.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" id="confirmDelete" data-bs-dismiss="modal" onClick={() => deleteTask(selectedKeyId)}>Delete Task</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
