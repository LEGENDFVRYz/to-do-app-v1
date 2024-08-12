import React from 'react';

export default function TaskCard({ title, priority, dueDate, dueTime, type, keyId, isFinished, deleteFunc, checkFunc, timeLeft, timePassed, onEditClick }) {

  const finishedStyle = {
    opacity: isFinished ? '60%' : '100%',
    textDecoration: isFinished ? 'line-through' : 'none',
  };

  return (
    <div style={finishedStyle} id={`task-${keyId}`} className='task-card'>
      <div className="upper container">
        <div className="row-config d-flex flex-row">
          <h3>{title}</h3>
          <div className="card-menu">
            <button type="button" className="btn btn-light-orange" onClick={() => checkFunc(keyId)}>
              <i className="bi bi-check-circle"></i>
            </button>
            <button type="button" className="btn btn-light-orange" data-bs-toggle="modal" data-bs-target="#deleteSelectionModal" onClick={() => deleteFunc(keyId)}>
              <i className="bi bi-trash3"></i>
            </button> 
            <button type="button" className="btn btn-light-orange" data-bs-toggle="modal" data-bs-target="#m-task-form" onClick={() => onEditClick(keyId)}>
              <i className="bi bi-pencil"></i>
            </button>
          </div>
        </div>

        <div className="row-config d-flex flex-row">
          <h6>{type}</h6>
          <h6>{timePassed}</h6>
        </div>
      </div>

      <hr />

      <div className="footer d-flex flex-row">
        <div className='left d-flex flex-row'>
          <div className="priority-tag fw-bold">{priority}</div>
          <div className="due"><h6><b>Due:</b> {dueDate} | {dueTime}</h6></div>
        </div>
        <div className="due-left">{timeLeft}</div>
      </div>
    </div>
  );
}
