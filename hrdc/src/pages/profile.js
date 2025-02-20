import Link from "next/link";

export default function Profile() {
  const user = {
    name: "Krista Dicomitis", 
    privileges: ["View Documents", "Edit Documents", "Delete Documents"], 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      
      <div className="bg-white shadow-lg rounded-lg p-8 w-3/4 max-w-md text-center">
       
        <h1 className="text-2xl font-semibold text-teal-800">{user.name}</h1>
        <p className="text-gray-600 mt-2">Employee Profile</p>

      
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Privileges</h2>
          <ul className="space-y-2">
            {user.privileges.map((privilege, index) => (
              <li key={index} className="bg-green-200 text-teal-800 py-2 px-4 rounded-md">
                {privilege}
              </li>
            ))}
          </ul>
        </div>

        
        <div className="mt-6">
          <Link href="/">
            <button className="bg-teal-700 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-teal-600">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
