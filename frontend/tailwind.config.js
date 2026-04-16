/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem"
      },
      boxShadow: {
        soft: "0 14px 34px rgba(15, 23, 42, 0.08)",
        lift: "0 26px 60px rgba(15, 23, 42, 0.14)"
      }
    }
  },
  plugins: []
};

