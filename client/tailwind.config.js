/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "volunteer-banner": "url('../components/volunteers.png')",
      },
    },
  },
  plugins: [],
};
