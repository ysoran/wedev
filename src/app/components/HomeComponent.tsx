import { FC, useState } from "react";
import { Lead } from "../types/types";
import { FileText, XCircle } from "lucide-react";

const Home: FC<{ onSuccessfulSubmission: () => void }> = ({ onSuccessfulSubmission }) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [linkedinProfile, setLinkedinProfile] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [visasOfInterest, setVisasOfInterest] = useState<string[]>([]);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const visaOptions: string[] = [
      "O-1", "EB-1A", "EB-2 NIW", "I don't know"
    ];

    const countries: string[] = [
      "United States", "Canada", "United Kingdom", "Australia", "Germany", "France",
      "India", "China", "Brazil", "Mexico", "Japan", "South Africa", "Other"
    ];

    const handleVisaToggle = (visa: string) => {
      setVisasOfInterest(prev =>
        prev.includes(visa) ? prev.filter(v => v !== visa) : [...prev, visa]
      );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      setResumeFile(file);
    };

    const validateFormClient = () => {
      const errors: { [key: string]: string } = {};
      if (!firstName.trim()) errors.firstName = 'First Name is required.';
      if (!lastName.trim()) errors.lastName = 'Last Name is required.';
      if (!email.trim()) {
        errors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email address is invalid.';
      }
      if (!linkedinProfile.trim()) {
        errors.linkedinProfile = 'LinkedIn Profile is required.';
      } else if (!/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(linkedinProfile)) {
        errors.linkedinProfile = 'LinkedIn Profile URL is invalid. (e.g., https://www.linkedin.com/in/username)';
      }
      if (!country) errors.country = 'Country is required.';
      if (visasOfInterest.length === 0) errors.visasOfInterest = 'At least one Visa of Interest is required.';
      if (!resumeFile) errors.resumeFile = 'Resume/CV upload is required.';

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmissionError(null);
      setIsSubmitting(true);

      if (!validateFormClient()) {
        setIsSubmitting(false);
        return;
      }

      const newLead: Omit<Lead, 'id' | 'status' | 'submissionDate'> = {
        firstName,
        lastName,
        email,
        linkedinProfile,
        country,
        visasOfInterest,
        resumeFileName: resumeFile ? resumeFile.name : 'N/A',
        additionalInfo,
      };

      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLead),
        });

        const result = await response.json();

        if (response.ok) {
          onSuccessfulSubmission();

          setFirstName('');
          setLastName('');
          setEmail('');
          setLinkedinProfile('');
          setCountry('');
          setVisasOfInterest([]);
          setResumeFile(null);
          setAdditionalInfo('');
          setFormErrors({});
        } else {
          if (response.status === 400 && result.errors) {
            setSubmissionError('Form submission failed: ' + result.errors.join(', '));
          } else {
            setSubmissionError(result.message || 'An unexpected error occurred during submission.');
          }
        }
      } catch (error) {
        setSubmissionError('Network error or problem connecting to the server.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <div className="bg-white shadow-xl w-full max-w-lg overflow-hidden">

          <div className="relative bg-[#D9F2D9] py-8 px-6 pb-16 overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#A0E6A0] rounded-full opacity-60"></div>
            <div className="absolute top-10 -right-8 w-24 h-24 bg-[#BEEBA7] rounded-full opacity-70"></div>
            <div className="absolute -bottom-10 right-10 w-28 h-28 bg-[#A0E6A0] rounded-full opacity-50"></div>
            <div className="absolute -bottom-20 left-0 w-40 h-40 bg-[#BEEBA7] rounded-full opacity-60"></div>
            <div className="relative z-10 text-left">
              <h1 className="text-gray-900 text-xl font-bold mb-2">alm&agrave;</h1>
              <h2 className="text-gray-900 text-3xl font-bold leading-tight">
                Get An Assessment <br /> Of Your Immigration Case
              </h2>
            </div>
          </div>

          <div className="p-8 pt-0">
              <h3 className="text-gray-800 text-lg font-bold text-center mb-2 mt-8">Want to understand your visa options?</h3>
              <p className="text-gray-800 text-center text-sm mb-8 font-bold">
              Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.
            </p>

            {submissionError && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg relative mb-6 flex items-center justify-center text-center">
                <XCircle className="h-6 w-6 mr-3 text-red-600" />
                <span className="block sm:inline font-semibold">{submissionError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-4 py-2 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:outline-none text-gray-800 bg-transparent`}
                  placeholder="First Name"
                />
                {formErrors.firstName && <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>}
              </div>

              <div>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-4 py-2 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:outline-none text-gray-800 bg-transparent`}
                  placeholder="Last Name"
                />
                {formErrors.lastName && <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>}
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:outline-none text-gray-800 bg-transparent`}
                  placeholder="Email"
                />
                {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
              </div>

              <div>
                <input
                  type="url"
                  id="linkedinProfile"
                  value={linkedinProfile}
                  onChange={(e) => setLinkedinProfile(e.target.value)}
                  className={`w-full px-4 py-2 border ${formErrors.linkedinProfile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:outline-none text-gray-800 bg-transparent`}
                  placeholder="LinkedIn / Personal Website URL"
                />
                {formErrors.linkedinProfile && <p className="mt-1 text-xs text-red-600">{formErrors.linkedinProfile}</p>}
              </div>

              <div>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`w-full px-4 py-2 border ${formErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-blue-500 focus:outline-none bg-transparent ${country === '' ? 'text-gray-500' : 'text-gray-800'}`}
                >
                  <option value="" disabled hidden>Select your Country of Residence</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {formErrors.country && <p className="mt-1 text-xs text-red-600">{formErrors.country}</p>}
              </div>

              <div className="pt-4">
                <h3 className="text-gray-800 text-lg font-bold mb-4 text-center">Visa categories of interest?</h3>
                <div className="flex flex-col space-y-3">
                  {visaOptions.map(visa => (
                    <label key={visa} className="flex items-center text-gray-700">
                      <input
                        type="checkbox"
                        checked={visasOfInterest.includes(visa)}
                        onChange={() => handleVisaToggle(visa)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-base">{visa}</span>
                    </label>
                  ))}
                </div>
                {formErrors.visasOfInterest && <p className="mt-1 text-xs text-red-600">{formErrors.visasOfInterest}</p>}
              </div>

              <div className="pt-4">
                <h3 className="text-gray-800 text-lg font-bold mb-4 text-center">How can we help you?</h3>
                <textarea
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none text-gray-800 resize-none bg-transparent"
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              <div>
                <label htmlFor="resumeFile" className="block text-gray-800 text-lg font-bold mb-4 text-center">Resume/CV Upload</label>
                <div className="flex items-center justify-center space-x-3">
                  <label htmlFor="resumeFile" className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm cursor-pointer hover:bg-blue-600 transition duration-200">
                    <FileText className="mr-2" size={20} />
                    {resumeFile ? 'Change File' : 'Upload File'}
                  </label>
                  <input
                    type="file"
                    id="resumeFile"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  {resumeFile && <span className="text-sm text-gray-600 truncate">{resumeFile.name}</span>}
                  {!resumeFile && <span className="text-sm text-gray-500">No file selected</span>}
                </div>
                {formErrors.resumeFile && <p className="mt-1 text-xs text-red-600 text-center">{formErrors.resumeFile}</p>}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-6 rounded-lg text-lg font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default Home;