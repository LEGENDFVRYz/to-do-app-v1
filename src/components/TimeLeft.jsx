import React, { useState, useEffect } from 'react';

const TimeLeft = ({ dueDate, dueTime }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const dueDateTime = new Date(`${dueDate}T${dueTime}:00`);
            const difference = dueDateTime - now;

            if (difference <= 0) {
                setTimeLeft('Past due');
                return;
            }

            const minutes = Math.floor(difference / 1000 / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30);
            const years = Math.floor(days / 365);

            if (years > 0) {
                setTimeLeft(`${years} year${years > 1 ? 's' : ''} left`);
            } else if (months > 0) {
                setTimeLeft(`${months} month${months > 1 ? 's' : ''} left`);
            } else if (weeks > 0) {
                setTimeLeft(`${weeks} week${weeks > 1 ? 's' : ''} left`);
            } else if (days > 0) {
                setTimeLeft(`${days} day${days > 1 ? 's' : ''} left`);
            } else if (hours > 0) {
                setTimeLeft(`${hours} hour${hours > 1 ? 's' : ''} left`);
            } else if (minutes > 0) {
                setTimeLeft(`${minutes} minute${minutes > 1 ? 's' : ''} left`);
            } else {
                setTimeLeft('Less than a minute left');
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(timer);

    }, [dueDate, dueTime]); 

    return timeLeft;
};

export default TimeLeft;
