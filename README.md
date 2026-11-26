# Anand Jewels website and admin

The website and administration panel run from the same Node.js application. The existing public-site design remains in `site-assets/`; its collection and showroom content is loaded from the backend. Local development uses a JSON data file by default, while Vercel uses PostgreSQL for persistent data and sessions.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`, then set a real admin email and a unique password with at least 12 characters. Keep `.env` private.
3. Run `npm install`, then `npm start`.
4. Open `http://localhost:3000` for the website and `http://localhost:3000/admin` for the admin panel.

The first local server start creates `data/anand-jewels.json` with the current website collection and showroom information. Set `DATABASE_URL` locally if you want to test against PostgreSQL instead.

## Admin features

- Review website totals and recent customer enquiries.
- Add, edit and remove collection pieces; mark designs for the homepage.
- Add, edit and remove showroom details.
- Update homepage text, imagery, navigation and social links; manage About and Collection stories, articles and policy pages from Website content.
- Add, edit and remove editorial design cards shown on the public collection page.
- Review, call, update the status of, and remove customer enquiries.

Saved changes appear on the public website immediately. Images can use an existing file in `site-assets/` (enter its filename) or a public HTTPS image URL. Admin passwords are configured through the server environment and are never stored in the website or database.

## Deploy to Vercel

1. Create a PostgreSQL database with Neon and copy its pooled connection string.
2. Import this repository into Vercel. Set the Root Directory to the repository root (`.`), Framework Preset to `Other`, and leave Build and Output settings at their defaults.
3. Add `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters), and `DATABASE_URL` in the Vercel project's Production environment variables. Use the Neon pooled connection string for `DATABASE_URL`; never commit it to Git.
4. Deploy the `main` branch. Vercel serves the public website, rewrites `/admin` to the admin page, and runs API routes from `api/`. The first API request creates the PostgreSQL tables and seeds the current website content.
5. Test `/api/health`, `/api/public/catalog`, the public Collection page, and `/admin`. The admin login and saved changes use PostgreSQL, so they persist between Vercel function invocations.

Vercel deployments require `DATABASE_URL`; the API returns a configuration error rather than falling back to temporary serverless filesystem storage.

Run the backend checks with `npm test`.
