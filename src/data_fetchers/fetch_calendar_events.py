import os
import datetime
import json
from google.oauth2 import service_account
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build


def get_credentials():
    return service_account.Credentials.from_service_account_info(
        json.loads(os.environ['GOOGLE_SERVICE_ACCOUNT_INFO']),
        scopes=['https://www.googleapis.com/auth/calendar.readonly']
    )


def get_calendar_service():
    return build('calendar', 'v3', credentials=get_credentials())


def get_calendar_events(calendar_id, time_min, time_max):
    try:
        service = get_calendar_service()
        events_result = service.events().list(calendarId=calendar_id, timeMin=time_min, timeMax=time_max,
                                              maxResults=1000, singleEvents=True, orderBy='startTime').execute()
        return events_result.get('items', [])
    except HttpError as error:
        print(f'An error occurred for calendar {calendar_id}: {error}')
        return []


def fetch_calendar_events():
    calendars = [
        {'id': 'cupsandcauldrons@gmail.com', 'color': '#ff0000'},
        {'id': 'c625066fd455ccf156421554caee5af8f5576b21718313e2c2b3edfba6b00dfb@group.calendar.google.com',
         'color': '#00ff00'},
        {'id': 'f5473ead46629e811f332ca5998f4f76f00c8db7f90c8cbfa90eb8338d8eed45@group.calendar.google.com',
         'color': '#00ff00'},
        {'id': '00abe91aae5b3b7f77b43adba22bfabc82f3367d52090093a7767baeecf39eec@group.calendar.google.com',
         'color': '#00ff00'},
        {'id': 'a05ddbfc817f26fc85fa4b8388c2812ee9e4d0956980d87157e4e7977839cd15@group.calendar.google.com',
         'color': '#00ff00'},
        {'id': 'baacacacfcf18105165546a682db615fce7313f6aa01cc186f302512bae53afa@group.calendar.google.com',
         'color': '#00ff00'},
        {'id': '93a4df5ce19b40526b552699fac51726fa9d4e9187be845c0e722ad06be8a203@group.calendar.google.com',
         'color': '#00ff00'},
        {'id': '43b0274378ece9365845655f5350faaf9e38aecfb80ed1b61e371d86daa48e93@group.calendar.google.com',
         'color': '#00ff00'},
        {'id': '992705b76f49af0c45c390f5137175d0142bf2d81c9ede0b0f87478a1de81d9d@group.calendar.google.com',
         'color': '#00ff01'},
    ]

    now = datetime.datetime.utcnow()
    time_min = now.isoformat() + 'Z'
    time_max = (now + datetime.timedelta(days=365)).isoformat() + 'Z'

    calendar_events = {"items": []}

    for calendar in calendars:
        events = get_calendar_events(calendar['id'], time_min, time_max)

        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            end = event['end'].get('dateTime', event['end'].get('date'))
            calendar_events["items"].append({
                'id': event['id'],
                'summary': event['summary'],
                'start': {'dateTime': start},
                'end': {'dateTime': end},
                'color': calendar['color']
            })

    save_calendar_events(calendar_events)
    print('Calendar events successfully fetched and saved.')


def save_calendar_events(calendar_events):
    with open('dist/data/calendar_events.json', 'w') as f:
        json.dump(calendar_events, f)


if __name__ == '__main__':
    fetch_calendar_events()
