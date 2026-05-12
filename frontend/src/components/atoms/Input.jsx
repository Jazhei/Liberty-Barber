import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, id, className = '' }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
