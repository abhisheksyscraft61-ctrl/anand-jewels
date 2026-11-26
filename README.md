# Anand Jewels website and admin

The website and administration panel run from the same Node.js server. The existing public-site design remains in `site-assets/`; its collection and showroom content is loaded from the backend, and website enquiries and visit requests are saved to a local JSON data file.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`, then set a real admin email and a unique password with at least 12 characters. Keep `.env` private.
3. Run `npm start`.
4. Open `http://localhost:3000` for the website and `http://localhost:3000/admin` for the admin panel.

The first server start creates `data/anand-jewels.json` with the current website collection and showroom information. The JSON file is the persistent database; back it up regularly.

## Admin features

- Review website totals and recent customer enquiries.
- Add, edit and remove collection pieces; mark designs for the homepage.
- Add, edit and remove showroom details.
- Update homepage text, imagery, navigation and social links; manage About and Collection stories, articles and policy pages from Website content.
- Add, edit and remove editorial design cards shown on the public collection page.
- Review, call, update the status of, and remove customer enquiries.

Saved changes appear on the public website immediately. Images can use an existing file in `site-assets/` (enter its filename) or a public HTTPS image URL. Admin passwords are configured through the server environment and are never stored in the website or database.

## Deployment

Run one server instance with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `PORT` and `DATA_FILE` configured. Put the server behind HTTPS in production; set `NODE_ENV=production` so admin session cookies are marked secure. Persist and back up the directory containing `DATA_FILE`. This file-based store is intended for a single server instance; use a transactional database before running multiple server instances or handling high write volume.

Run the backend checks with `npm test`.
