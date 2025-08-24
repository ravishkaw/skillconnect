import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, type = "text", className = "", ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          disabled:bg-gray-50 disabled:text-gray-500
          ${
            error
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : ""
          }
          ${className}
        `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
