document.addEventListener('DOMContentLoaded', function () {
  let calendarEl = document.getElementById('calendar');
  let calendar = new tui.Calendar(calendarEl, {
    defaultView: 'month',
    taskView: true,
    scheduleView: true,
    useDetailPopup: true,
  });

  var todayButton = document.querySelector('.today');
  var prevButton = document.querySelector('.prev');
  var nextButton = document.querySelector('.next');
  var range = document.querySelector('.navbar--range');

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
            backgroundColor: event.color,
            raw: {
              calender: event.calendar
            }
          };
        });
        calendar.clear();
        calendar.createEvents(events);
      })
      .catch(error => {
        console.error('Error fetching calendar events:', error);
      });
  }

  function getNavbarRange(tzStart, tzEnd, viewType) {
    var start = tzStart.toDate();
    var end = tzEnd.toDate();
    var middle;
    if (viewType === 'month') {
      middle = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2);

      return moment(middle).format('YYYY-MM');
    }
    if (viewType === 'day') {
      return moment(start).format('YYYY-MM-DD');
    }
    if (viewType === 'week') {
      return moment(start).format('YYYY-MM-DD') + ' ~ ' + moment(end).format('YYYY-MM-DD');
    }
    throw new Error('no view type');
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

