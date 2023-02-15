/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error => daisyui doesn't have any types
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    theme: ["business"],
  },
}
