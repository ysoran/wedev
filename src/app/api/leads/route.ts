import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Lead } from '@/app/types/types';

const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json');

async function readLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(leadsFilePath, 'utf8');
    if (!data.trim()) {
        console.warn('leads.json is empty or contains only whitespace. Initializing as empty array.');
        return [];
    }
    const parsedData = JSON.parse(data) as Lead[];

    if (!Array.isArray(parsedData)) {
        console.error('Content of leads.json is not a JSON array:', parsedData);
        await writeLeads([]);
        return [];
    }

    return parsedData;

  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('leads.json not found, initializing with empty array and creating file.');
      await writeLeads([]);
      return [];
    }
    if (error instanceof SyntaxError) {
        let fileContent = 'Could not read file content due to error.';
        try {
            fileContent = await fs.readFile(leadsFilePath, 'utf8');
        } catch (readErr) {
            // ignore
        }
        console.error(`Error parsing leads.json (SyntaxError). File content: "${fileContent}"`, error);
    } else {
        console.error('Error reading leads file:', error);
    }
    throw new Error('Failed to read leads data.');
  }
}

async function writeLeads(leads: Lead[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(leadsFilePath), { recursive: true });
    await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing leads file:', error);
    throw new Error('Failed to write leads data.');
  }
}

export async function POST(req: Request) {
  try {
    const newLeadData: Partial<Lead> = await req.json();

    const errors: string[] = [];

    if (!newLeadData.firstName || typeof newLeadData.firstName !== 'string' || newLeadData.firstName.trim() === '') {
      errors.push('First Name is required.');
    }
    if (!newLeadData.lastName || typeof newLeadData.lastName !== 'string' || newLeadData.lastName.trim() === '') {
      errors.push('Last Name is required.');
    }
    if (!newLeadData.email || typeof newLeadData.email !== 'string' || !/\S+@\S+\.\S+/.test(newLeadData.email)) {
      errors.push('Valid Email is required.');
    }
    if (!newLeadData.linkedinProfile || typeof newLeadData.linkedinProfile !== 'string' || !/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(newLeadData.linkedinProfile)) {
      errors.push('Valid LinkedIn Profile URL is required.');
    }
    if (!newLeadData.country || typeof newLeadData.country !== 'string' || newLeadData.country.trim() === '') {
      errors.push('Country is required.');
    }
    if (!newLeadData.visasOfInterest || !Array.isArray(newLeadData.visasOfInterest) || newLeadData.visasOfInterest.length === 0) {
      errors.push('At least one Visa of Interest is required.');
    }
    if (typeof newLeadData.resumeFileName !== 'string' || newLeadData.resumeFileName.trim() === '') {
        errors.push('Resume file name is invalid or missing.');
    }

    if (errors.length > 0) {
      return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
    }

    const lead: Lead = {
      id: Date.now(),
      firstName: newLeadData.firstName as string,
      lastName: newLeadData.lastName as string,
      email: newLeadData.email as string,
      linkedinProfile: newLeadData.linkedinProfile as string,
      country: newLeadData.country as string,
      visasOfInterest: newLeadData.visasOfInterest as string[],
      resumeFileName: newLeadData.resumeFileName as string,
      additionalInfo: newLeadData.additionalInfo || '',
      status: 'PENDING',
      submissionDate: new Date().toLocaleString(),
    };

    const currentLeads = await readLeads();
    currentLeads.push(lead);
    await writeLeads(currentLeads);

    console.log('New lead saved to leads.json:', lead);
    return NextResponse.json({ message: 'Lead submitted successfully!', lead }, { status: 201 });

  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json({ message: 'Internal server error.', error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const allLeads = await readLeads();

    const sortedLeads = allLeads.sort((a, b) => {
      const dateA = new Date(a.submissionDate);
      const dateB = new Date(b.submissionDate);
      return dateB.getTime() - dateA.getTime();
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLeads = sortedLeads.slice(startIndex, endIndex);

    const totalLeads = allLeads.length;
    const totalPages = Math.ceil(totalLeads / limit);

    console.log(`Returning leads (page ${page} of ${totalPages}, limit ${limit}). Total leads: ${totalLeads}`);
    return NextResponse.json({
      leads: paginatedLeads,
      totalLeads,
      currentPage: page,
      totalPages,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leads with pagination:', error);
    return NextResponse.json({ message: 'Failed to fetch leads.', error: (error as Error).message }, { status: 500 });
  }
}