# Oklahoma Pagan Events Calendar

This repository contains the source code for the Oklahoma Pagan Events Calendar website, hosted at [calendar.cupsandcauldrons.com](https://calendar.cupsandcauldrons.com). The website displays events from a Google Calendar, fetched using a Python script, and rendered on a static site using FullCalendar.

## Directory Structure

- `dist/`: The compiled website, including HTML, CSS, JavaScript, and data files
  - `css/`: Contains the custom CSS files for the website
  - `js/`: Contains the custom JavaScript files for the website
  - `data/`: Contains the JSON file with the calendar events, generated by the Python script
- `fetch_calendar_events.py`: Python script to fetch events from the Google Calendar and save them as a JSON file
- `.github/workflows/`: Contains the GitHub Actions workflow file to update the calendar events and deploy the site to GitHub Pages

## Setup and Deployment

1. Fork or clone this repository.
2. Create a Google Cloud Platform project and enable the Google Calendar API.
3. Create a service account for the project and download the JSON key file.
4. Add the `GOOGLE_SERVICE_ACCOUNT_INFO` secret to your GitHub repository, containing the JSON string of your service account credentials.
5. Update the `calendarId` in the `fetch_calendar_events.py` script to match your Google Calendar ID.
6. Configure the repository settings to enable GitHub Pages, using the `dist` folder as the source.
7. The website will be deployed and updated automatically by the GitHub Actions workflow.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
