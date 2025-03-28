// components/ui/Card.js
export function Card({ children }) {
    return <div className="bg-white rounded-lg shadow-md p-4">{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div className="mt-2">{children}</div>;
  }
  