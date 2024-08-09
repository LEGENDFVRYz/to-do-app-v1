// Helper Functions 



// Save data to localStorage
export const savingData = (identifier, target) => {
    try {
        const serializedTarget = JSON.stringify(target);
        localStorage.setItem(identifier, serializedTarget);
        console.log(`Data saved: ${localStorage.getItem(identifier)}`);
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
    }
};

// Read data from localStorage
export const readData = (identifier) => {
    try {
        const serializedData = localStorage.getItem(identifier);
        
        if (serializedData === null) {
            console.log(`No data found for key "${identifier}".`);
            return null;
        }

        const data = JSON.parse(serializedData);
        return data;
    } catch (error) {
        console.error('Error reading data from localStorage:', error);
        return null;
    }
};




// Function for Military Time to 12 Hour Format
export function formatTime(timeString) {
    const [hour, minute] = timeString.split(':');
    
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? 'PM' : 'AM';
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
}

export function formatDate(dateString) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const [year, month, day] = dateString.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    
    const formattedDate = `${months[monthIndex]} ${parseInt(day, 10)}, ${year}`;
    return formattedDate;
}