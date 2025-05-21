import { ThumbsUp } from "lucide-react";
import { FC } from "react";

  const SuccessComponent: FC<{ setCurrentView: React.Dispatch<React.SetStateAction<'publicForm' | 'login' | 'internalUI' | 'submissionSuccess'>> }> = ({ setCurrentView }) => {
    const handleGoBack = () => {
      setCurrentView('publicForm');
    };

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <div className="bg-white shadow-xl w-full max-w-md overflow-hidden p-8 text-center rounded-lg">
          <div className="relative bg-[#D9F2D9] py-8 px-6 overflow-hidden rounded-t-lg -mx-8 -mt-8 mb-8">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#A0E6A0] rounded-full opacity-60"></div>
            <div className="absolute top-10 -right-8 w-24 h-24 bg-[#BEEBA7] rounded-full opacity-70"></div>
            <div className="relative z-10">
              <ThumbsUp className="h-16 w-16 text-green-700 mx-auto mb-4" />
              <h2 className="text-gray-900 text-3xl font-bold mb-2">Thank You!</h2>
            </div>
          </div>
          <p className="text-gray-800 text-lg mb-8">
            Your information was submitted to our team of immigration attorneys. Expect an email from <a href="mailto:hello@tryalma.ai" className="text-blue-600 hover:underline">hello@tryalma.ai</a>.
          </p>
          <div className="text-center">
            <button
              onClick={handleGoBack}
              className="inline-flex justify-center items-center py-3 px-6 rounded-lg text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition duration-300 ease-in-out"
            >
              Go Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default SuccessComponent;