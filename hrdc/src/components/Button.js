// components/ui/button.jsx
export function Button({ children, onClick, className, variant = "default" }) {
    const baseStyles = "px-4 py-2 rounded-md font-semibold transition-all";
    const variants = {
      default: "bg-blue-500 text-white hover:bg-blue-600",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    };
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  