import React from 'react';
import './RegisterStatus.css';

const RegisterStatus = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`register-status register-status--${type}`}>
      <div className="register-status__content">
        <span className="register-status__message">{message}</span>
        {onClose && (
          <button className="register-status__close" onClick={onClose}>
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisterStatus;