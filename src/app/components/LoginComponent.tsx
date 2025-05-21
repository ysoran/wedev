import { EyeOff, LogIn, User, Lock } from "lucide-react";
import { FC, useState } from "react";

const LoginComponent: FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
    const [localUsername, setLocalUsername] = useState('');
    const [localPassword, setLocalPassword] = useState('');
    const [localLoginError, setLocalLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLocalLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setLocalLoginError('');
      if (localUsername === 'admin' && localPassword === 'password') {
        onLoginSuccess();
      } else {
        setLocalLoginError('Invalid username or password.');
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <div className="bg-white shadow-xl w-full max-w-md overflow-hidden p-8 text-center rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Admin Login</h2>
          {localLoginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              {localLoginError}
            </div>
          )}
          <form onSubmit={handleLocalLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={localUsername}
                  onChange={(e) => setLocalUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Username"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={localPassword}
                  onChange={(e) => setLocalPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
            >
              <LogIn className="mr-2" size={20} /> Login
            </button>
          </form>
        </div>
      </div>
    );
  };


  export default LoginComponent;