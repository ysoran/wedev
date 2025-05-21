# Alma Lead Management App

https://github.com/user-attachments/assets/c64c9896-5f1e-4162-9f4c-133f804819c8

This project is a Next.js application designed for managing leads. It features a public-facing form for lead submission and a secure admin dashboard for viewing and managing submitted leads.

## Getting Started

To run the application in development mode:

1.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

The application will start on `http://localhost:3000`.

### Accessing the Application

* **Public Lead Submission Form:**
    Open [http://localhost:3000](http://localhost:3000) in your browser. This is where potential leads can submit their information.

* **Admin Dashboard:**
    Access the admin dashboard via [http://localhost:3000/login](http://localhost:3000/login). You will need to sign up or log in to view and manage leads.

## Project Structure Highlights

* `app/page.tsx`: The main public-facing lead submission form.
* `app/leads/page.tsx`: The secure admin dashboard for viewing leads.
* `app/login/page.tsx`: The login page for administrative access.
* `app/signup/page.tsx`: The signup page for creating new admin accounts.
* `app/api/leads/route.ts`: API endpoint for handling lead submissions and fetching leads.
* `app/api/login/route.ts`: API endpoint for user authentication.
* `app/api/signup/route.ts`: API endpoint for new user registration.
* `data/leads.json`: (Automatically created) Stores submitted lead data.
* `data/users.json`: (Automatically created) Stores user account data.
* `store/leadStore.ts`: Zustand store for managing lead data on the client-side.
* `hooks/useAuthRedirect.ts`: Custom hook for handling authentication redirection.

## Learn More

To learn more about the technologies used in this project, refer to the following resources:

* [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
* [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction) - a small, fast, and scalable bearbones state-management solution.
* [React Hook Form Documentation](https://react-hook-form.com/get-started) - performant, flexible, and extensible forms with easy-to-use validation.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
