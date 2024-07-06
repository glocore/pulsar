import { join } from "node:path";
import path from "path";
import type { Config } from "tailwindcss";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  content: [
    join(__dirname, "index.html"),
    join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
