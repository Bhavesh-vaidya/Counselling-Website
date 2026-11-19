// Loads environment variables from server/.env (works no matter which folder
// you start the server from), then falls back to a project-root .env.
// On Netlify the variables come from the Netlify dashboard instead.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

if (!process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.join(here, '.env') });
  dotenv.config(); // optional fallback (does not override values already set)
}
