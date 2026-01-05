# Lunar Birthday iCal Web

This is a web-based version of the Lunar Birthday iCal generator, built with React, TypeScript, and Vite.

## Features

- **Pure Static**: Runs entirely in the browser. No data is sent to any server.
- **Lunar & Solar Support**: Calculate birthdays based on Lunar or Solar calendars.
- **Integer Days**: Calculate special anniversaries like 10,000 days old.
- **Public Holidays**: Includes Mother's Day and Father's Day calculations.
- **iCal Generation**: Generates standard `.ics` files compatible with Google Calendar, Apple Calendar, and Outlook.
- **Persistence**: Saves your configuration to Local Storage automatically.
- **Import/Export**: Export your configuration to a JSON file for backup or sharing.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/components`: React components (UI and feature-specific).
- `src/lib`: Utility logic (Lunar calculation, iCal generation).
- `src/types.ts`: TypeScript definitions for configuration objects.

## Deployment

This project is configured to deploy to GitHub Pages automatically via GitHub Actions when changes are pushed to the `main` branch.
