import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface User {
  email: string;
  password: string;
  name: string;
  role?: string;
}

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(usersFilePath, 'utf8');
    if (!data.trim()) {
      console.warn('users.json is empty. Initializing with empty array.');
      return [];
    }

    const parsedData = JSON.parse(data);
    if (!Array.isArray(parsedData)) {
      console.error('users.json is not a valid array. Reinitializing.');
      await writeUsers([]);
      return [];
    }

    return parsedData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('users.json not found. Creating file with empty array.');
      await writeUsers([]);
      return [];
    }
    if (error instanceof SyntaxError) {
      let fileContent = 'Unavailable';
      try {
        fileContent = await fs.readFile(usersFilePath, 'utf8');
      } catch {}
      console.error(`Syntax error in users.json. Content: "${fileContent}"`, error);
    } else {
      console.error('Error reading users.json:', error);
    }
    throw new Error('Failed to read user data.');
  }
}

async function writeUsers(users: User[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing users.json:', error);
    throw new Error('Failed to write user data.');
  }
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    const errors: string[] = [];

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters.');
    }
    if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
      errors.push('Valid email is required.');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      errors.push('Password is required and must be at least 6 characters.');
    }

    if (errors.length > 0) {
      return NextResponse.json({ message: 'Validation failed.', errors }, { status: 400 });
    }

    const users = await readUsers();

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered.' }, { status: 409 });
    }

    const newUser: User = {
      email,
      password,
      name,
      role: 'user',
    };

    users.push(newUser);
    await writeUsers(users);

    console.log(`New user registered: ${email}`);
    return NextResponse.json({ message: 'User registered successfully!' }, { status: 201 });

  } catch (error) {
    console.error('Error processing signup:', error);
    return NextResponse.json({ message: 'Internal server error.', error: (error as Error).message }, { status: 500 });
  }
}