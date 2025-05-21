export interface Lead {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    linkedinProfile: string;
    country: string;
    visasOfInterest: string[];
    resumeFileName: string;
    additionalInfo: string;
    status: 'PENDING' | 'REACHED_OUT';
    submissionDate: string;
  }