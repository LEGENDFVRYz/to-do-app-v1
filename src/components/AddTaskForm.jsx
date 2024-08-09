import React, { useState, useRef, useEffect } from 'react';
import ShowAlert from './ShowAlert'; 
import 'bootstrap/dist/js/bootstrap.bundle.min';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min'; // Ensure this import

const AddTaskForm = ({ onData }) => {
    const [alertTrigger, setAlertTrigger] = useState(false);
    const modalRef = useRef(null);
    const modalInstanceRef = useRef(null); // Ref to store the modal instance

    // Initialize the modal instance when the component mounts
    useEffect(() => {
        if (modalRef.current) {
            modalInstanceRef.current = new bootstrap.Modal(modalRef.current, {
                backdrop: 'static',
                keyboard: false
            });
        }
    }, []);

    // Store data in temporary object
    const [tempData, setTempData] = useState({
        task_title: "",
        priority: "",
        due_date: "",
        due_time: "",
        date_posted: new Date(),
        type: "One-Time Task"
    });

    // Helper function: Inserting data in temporary object
    const valueHandler = (e) => {
        const { name, value } = e.target;
        setTempData(prevData => ({
            ...prevData, [name]: value
        }));
        setAlertTrigger(false); // Reset alert when user starts editing
    }

    // Function to close the modal
    const closeModal = () => {
        if (modalInstanceRef.current) {
            modalInstanceRef.current.hide(); // This close the modal
        }
    };

    // Validation and Submission
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
            setTempData((prevData) => {
                const updatedData = { ...prevData, date_posted: currentDate };
                return updatedData;    // Ensure the updated data is returned
            });
            onData(tempData);  // Send updated data to the onData callback
            // console.log(tempList);  
            closeModal(); // Close the modal if success
        } else {
            console.log("Cannot proceed: Some of the inputs are missing");
            setAlertTrigger(true);
        }
    };

    return (
        <div ref={modalRef} className="modal fade" id="m-adding-form" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Complete the form to "Add Tasks"</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body m-4">
                        
                        {alertTrigger && <ShowAlert />}

                        {/* Task Title */}
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

                        {/* Task Priority */}
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
                                    <option value="" selected>Level of Prioritization</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="MEDUIM">MEDIUM</option>
                                    <option value="LOW">LOW</option>
                                </select>
                            </div>
                        </div>

                        {/* Task Due Date and Time*/}
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
                                <label for="due_time" className="form-label">Select a time:</label>
                                <input 
                                    className="form-control" 
                                    type="time" 
                                    id="due_time"
                                    name="due_time" 
                                    value={tempData.due_time}
                                    onChange={valueHandler}/>
                            </div>
                        </div>

                        {/* Task Type */}
                        <div className="mb-4">
                            <label htmlFor="save-as-label" className="form-label">Save as:</label>
                            <div className="saving-options">
                                {/* Save as "One-Time" */}
                                <input 
                                    type="radio"
                                    className="btn-check" 
                                    name="type" 
                                    id="temporary" 
                                    autoComplete="off"
                                    value="One-Time Task" 
                                    checked={tempData.type === "One-Time Task"} 
                                    onChange={valueHandler} />
                                <label className="btn" htmlFor="temporary"><i class="bi bi-1-circle"></i> One-Time Task</label>

                                {/* Save as "Occurring" */}
                                <input 
                                    type="radio" 
                                    className="btn-check" 
                                    name="type" 
                                    id="daily" 
                                    autoComplete="off"
                                    value="Daily Task" 
                                    checked={tempData.type === "Daily Task"}
                                    onChange={valueHandler}
                                />
                                <label className="btn" htmlFor="daily"><i className="bi bi-arrow-repeat"></i> Daily Task</label>
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

export default AddTaskForm;