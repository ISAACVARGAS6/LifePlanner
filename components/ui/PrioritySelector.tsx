import React from 'react';
import { Priority } from '../../types';

export interface PrioritySelectorProps {
  value: Priority;
  onChange: (newPriority: Priority) => void | Promise<void>;
}

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as Priority;
    onChange(newValue);
  };

  return (
    <div>
      <label htmlFor="priority">Prioridad:</label>
      <select id="priority" value={value} onChange={handleChange}>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
    </div>
  );
};
