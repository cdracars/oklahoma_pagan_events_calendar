import os
import datetime
import json
from google.oauth2 import service_account
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build


def fetch_calendar_events():
    # Set up Google Calendar API credentials
    credentials = service_account.Credentials.from_service_account_info(
        json.loads(os.environ['GOOGLE_SERVICE_ACCOUNT_INFO']),
        scopes=['https://www.googleapis.com/auth/calendar.readonly']
    )

    # Build the Calendar API client
    service = build('calendar', 'v3', credentials=credentials)

    # Define the time range for calendar events
    now = datetime.datetime.utcnow()
    time_min = now.isoformat() + 'Z'
    time_max = (now + datetime.timedelta(days=365)).isoformat() + 'Z'
    try:
        # Fetch events from the calendar
        events_result = service.events().list(calendarId='cupsandcauldrons@gmail.com', timeMin=time_min, timeMax=time_max,
                                              maxResults=1000, singleEvents=True, orderBy='startTime').execute()
        events = events_result.get('items', [])

        if not events:
            print('No upcoming events found.')
            return

        # Convert the events to a JSON format suitable for FullCalendar
        calendar_events = []
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            end = event['end'].get('dateTime', event['end'].get('date'))
            calendar_events.append({
                'id': event['id'],
                'title': event['summary'],
                'start': start,
                'end': end
            })

        # Save the events to the dist/data/calendar_events.json file
        with open('dist/data/calendar_events.json', 'w') as f:
            json.dump(calendar_events, f)

        print('Calendar events successfully fetched and saved.')

    except HttpError as error:
        print(f'An error occurred: {error}')
        return None


if __name__ == '__main__':
    fetch_calendar_events()