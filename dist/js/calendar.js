document.addEventListener('DOMContentLoaded', function () {
  let calendarEl = document.getElementById('calendar');
  let calendar = new tui.Calendar(calendarEl, {
    defaultView: 'month',
    taskView: true,
    scheduleView: true,
    useDetailPopup: true,
  });

  var todayButton = $('.today');
  var prevButton = $('.prev');
  var nextButton = $('.next');
  var range = $('.navbar--range');

  function fetchEvents() {
    fetch('data/calendar_events.json')
      .then(response => response.json())
      .then(data => {
        const events = data.items.map(event => {
          return {
            id: event.id,
            calendarId: '1',
            title: event.summary,
            category: 'time',
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            color: '#fff',
            backgroundColor: event.color
          };
        });
        calendar.clear();
        calendar.createEvents(events);
      })
      .catch(error => {
        console.error('Error fetching calendar events:', error);
      });
  }

  function displayRenderRange() {
    range.textContent = getNavbarRange(calendar.getDateRangeStart(), calendar.getDateRangeEnd(), 'month');
  }

  todayButton.addEventListener('click', function () {
    calendar.today();
    fetchEvents();
    displayRenderRange();
  });
  prevButton.addEventListener('click', function () {
    calendar.prev();
    fetchEvents();
    displayRenderRange();
  });
  nextButton.addEventListener('click', function () {
    calendar.next();
    fetchEvents();
    displayRenderRange();
  });

  fetchEvents();
  displayRenderRange();
});
