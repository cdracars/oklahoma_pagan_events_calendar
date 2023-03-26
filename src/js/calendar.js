document.addEventListener('DOMContentLoaded', function () {
  let calendarEl = document.getElementById('calendar');

  let calendar = new tui.Calendar(calendarEl, {
    defaultView: 'month',
    taskView: true,
    scheduleView: true,
    useCreationPopup: true,
    useDetailPopup: true,
    template: {
      milestone: function (model) {
        return '<span class="tui-full-calendar-text">' + model.title + '</span>';
      },
      task: function (model) {
        return '&nbsp;&nbsp;#' + model.title;
      }
    }
  });

  fetch('data/calendar_events.json')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched data:', data); // Log the fetched data
      const events = data.items.map(event => {
        return {
          id: event.id,
          calendarId: '1',
          title: event.summary,
          category: 'time',
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date
        };
      });

      calendar.createEvents(events);
    })
    .catch(error => {
      console.error('Error fetching calendar events:', error);
    });
});
