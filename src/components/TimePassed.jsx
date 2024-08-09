import React, { useState, useEffect } from 'react';

const TimePassed = ({ dateTime }) => {
    const [timePassed, setTimePassed] = useState('');

    useEffect(() => {
        const calculateTimePassed = () => {
            const now = new Date();
            const postedDate = new Date(dateTime); // Ensure dateTime is parsed correctly
            const difference = now - postedDate;

            if (difference < 0) {
                setTimePassed('In the future');
                return;
            }

            const minutes = Math.floor(difference / 1000 / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30);
            const years = Math.floor(days / 365);

            if (years > 0) {
                setTimePassed(`${years} year${years > 1 ? 's' : ''} ago`);
            } else if (months > 0) {
                setTimePassed(`${months} month${months > 1 ? 's' : ''} ago`);
            } else if (weeks > 0) {
                setTimePassed(`${weeks} week${weeks > 1 ? 's' : ''} ago`);
            } else if (days > 0) {
                setTimePassed(`${days} day${days > 1 ? 's' : ''} ago`);
            } else if (hours > 0) {
                setTimePassed(`${hours} hour${hours > 1 ? 's' : ''} ago`);
            } else if (minutes > 0) {
                setTimePassed(`${minutes} minute${minutes > 1 ? 's' : ''} ago`);
            } else {
                setTimePassed('Just now');
            }
        };

        calculateTimePassed();
        const timer = setInterval(calculateTimePassed, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    return timePassed;
};

export default TimePassed;