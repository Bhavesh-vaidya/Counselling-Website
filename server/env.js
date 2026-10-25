// Loads environment variables from server/.env (works no matter which folder
// you start the server from), then falls back to a project-root .env.
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, '.env') });
dotenv.config(); // optional fallback (does not override values already set)
