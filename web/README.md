# Lunar Birthday iCalendar Web

This is a web-based version of the Lunar Birthday iCalendar generator, built with React, TypeScript, and Vite.

## Features

-   Pure Static: Runs entirely in the browser. No data is sent to any server.
-   Lunar & Solar Support: Calculate birthdays based on Lunar or Solar calendars.
-   Integer Days: Calculate special anniversaries like 10,000 days old.
-   Observances: Caculate floating holiday like 2nd Sunday of May (Mother's Day)
-   iCalendar Generation: Generates standard `.ics` files compatible with Google Calendar, Apple Calendar, and Outlook.
-   Persistence: Saves your configuration to Local Storage automatically.
-   Import/Export: Export your configuration to a JSON file for backup or sharing.

## Development

1. Install dependencies:

    ```shell
    npm install
    ```

2. Start the development server:

    ```shell
    npm run dev
    ```

3. Lint code with ESLint

    ```shell
    npm run lint
    ```

4. Build for production:
    ```shell
    npm run build
    ```

## Project Structure

-   `src/components`: React components (UI and feature-specific).
-   `src/lib`: Utility logic (Lunar calculation, iCalendar generation).
-   `src/types.ts`: TypeScript definitions for configuration objects.

## Deployment

This project is configured to deploy to GitHub Pages automatically via GitHub Actions when changes are pushed to the `master` branch.
