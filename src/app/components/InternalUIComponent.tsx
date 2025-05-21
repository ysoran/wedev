import { FC, useEffect } from "react";

const InternalUIComponent: FC<{ onLogout: () => void }> = ({ onLogout }) => {
    useEffect(() => {
        window.location.href = '/leads';
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-lg text-gray-700">Redirecting to Leads Dashboard...</p>
            <button onClick={onLogout} className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
        </div>
    );
  };

  export default InternalUIComponent;