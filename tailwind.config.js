/** @type {import('tailwindcss').Config} */
module.exports = {
    // Specify the files where Tailwind should scan for utility classes.
    // This is crucial for Tailwind to know which classes to include in your CSS bundle.
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js App Router
      "./pages/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js Pages Router
      "./components/**/*.{js,ts,jsx,tsx,mdx}", // For shared components
      "./src/**/*.{js,ts,jsx,tsx,mdx}", // Common for Create React App or Vite projects
    ],
    theme: {
      extend: {
        // You can extend Tailwind's default theme here.
        // For example, add custom colors, fonts, spacing, etc.
      },
    },
    plugins: [
      // Include the @tailwindcss/forms plugin to add a basic reset for form styles
      // and allow for easier styling of form elements like checkboxes and radio buttons.
      require('@tailwindcss/forms'),
    ],
  };
  