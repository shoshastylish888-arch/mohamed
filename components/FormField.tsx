import React from 'react';
import type { FormFieldType } from '../types';

interface FormFieldProps {
    label: string;
    name: string;
    type: FormFieldType;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    options?: readonly string[];
    min?: number;
    max?: number;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, type, value, onChange, options, min, max }) => {
    const commonClasses = "block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 transition-all";

    const renderInput = () => {
        switch (type) {
            case 'select':
                return (
                    <select name={name} value={value} onChange={onChange} className={`${commonClasses} pr-8`}>
                        {options?.map(option => (
                            <option key={option} value={option} className="bg-white text-gray-900">{option}</option>
                        ))}
                    </select>
                );
            case 'number':
                return (
                    <input
                        type="number"
                        name={name}
                        value={value}
                        onChange={onChange}
                        min={min}
                        max={max}
                        className={commonClasses}
                    />
                );
            case 'text':
            default:
                return (
                    <input
                        type="text"
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={commonClasses}
                    />
                );
        }
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-700">
                {label}
            </label>
            <div className="mt-2">
                {renderInput()}
            </div>
        </div>
    );
};

export default FormField;