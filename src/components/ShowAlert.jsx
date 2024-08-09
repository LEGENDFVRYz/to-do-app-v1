import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function ShowAlert() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      // setAlertTrigger(false); // Not Working, since we don't have access to it
    }, 5000);
    return () => clearTimeout(timer); // Cleanup the timer if the component is unmounted
  }, []);

  if (!visible) return null;  // Don't Render if visible is false

  return (
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      <i className="bi bi-exclamation-triangle-fill m-2"></i>
      <strong>Input Error!</strong> Please check your input to proceed.
    </div>
  );
}
