import React, { useState, useRef, useEffect } from 'react';
import ShowAlert from './ShowAlert'; 
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min'; 

const EditTaskForm = ({ taskData, onData }) => {
    const [alertTrigger, setAlertTrigger] = useState(false);
    const modalRef = useRef(null);
    const modalInstanceRef = useRef(null);

    const [tempData, setTempData] = useState({
        task_title: "",
        priority: "",
        due_date: "",
        due_time: "",
        date_posted: new Date(),
        type: "One-Time Task"
    });

    useEffect(() => {
        if (taskData) {
            setTempData({
                task_title: taskData.task_title || "",
                priority: taskData.priority || "",
                due_date: taskData.due_date || "",
                due_time: taskData.due_time || "",
                date_posted: taskData.date_posted || new Date(),
                type: taskData.type || "One-Time Task"
            });
        }
    }, [taskData]);

    useEffect(() => {
        if (modalRef.current) {
            modalInstanceRef.current = new bootstrap.Modal(modalRef.current, {
                backdrop: 'static',
                keyboard: false
            });
            modalInstanceRef.current.show(); 
        }

        return () => {
            if (modalInstanceRef.current) {
                modalInstanceRef.current.dispose();
            }
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        };
    }, []); 

    const valueHandler = (e) => {
        const { name, value } = e.target;
        setTempData(prevData => ({
            ...prevData, [name]: value
        }));
        setAlertTrigger(false);
    };

    const closeModal = () => {
        if (modalInstanceRef.current) {
            modalInstanceRef.current.hide();
        }
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    };
    
    const submitForm = () => {
        let isFilled = true;

        for (const key in tempData) {
            if (key !== "date_posted" && tempData[key] === "") {
                isFilled = false;
                break;
            }
        }

        if (isFilled) {
            const currentDate = new Date();
            const updatedData = { ...tempData, date_posted: currentDate };
            onData(updatedData);
        } else {
            console.log("Cannot proceed: Some of the inputs are missing");
            setAlertTrigger(true);
        }
    };

    return (
        <div ref={modalRef} className="modal fade show" id="m-task-form" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Task</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body m-4">
                        {alertTrigger && <ShowAlert />}

                        <div className="mb-4">
                            <label htmlFor="task_title" className="form-label">Task title:</label>
                            <div className="input-group">
                                <span className="input-group-text" id="basic-addon1"><i className="bi bi-plus-square-fill"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    placeholder="Enter a title..." 
                                    id="task_title"
                                    name="task_title"
                                    value={tempData.task_title}
                                    onChange={valueHandler}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="priority" className="form-label">Prioritization:</label>
                            <div className="input-group">
                                <label className="input-group-text" htmlFor="inputGroupSelect01"><i className="bi bi-fire"></i></label>
                                <select className="form-select"
                                        aria-label="Default select example" 
                                        id="priority"
                                        name="priority"
                                        value={tempData.priority}
                                        onChange={valueHandler}>
                                    <option value="">Level of Prioritization</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="LOW">LOW</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4 d-flex">
                            <div className="pe-2 due_date col-6">
                                <label htmlFor="due_date" className="form-label">Due Date:</label>
                                <input 
                                    className="form-control"
                                    type="date" 
                                    id="due_date"
                                    name="due_date"
                                    value={tempData.due_date}
                                    onChange={valueHandler}
                                />
                            </div>
                            <div className="ps-2 due_time col-6">
                                <label htmlFor="due_time" className="form-label">Select a time:</label>
                                <input 
                                    className="form-control" 
                                    type="time" 
                                    id="due_time"
                                    name="due_time" 
                                    value={tempData.due_time}
                                    onChange={valueHandler}/>
                            </div>
                        </div>


                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-light-orange fw-bold text-white" onClick={submitForm}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTaskForm;
