document.addEventListener('DOMContentLoaded', function () {
  let calendarEl = document.getElementById('calendar');

  let calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: ['dayGrid', 'timeGrid', 'list', 'interaction', 'moment'],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    dayMaxEvents: true, // when too many events in a day, show the popover
    events: 'data/calendar_events.json'
  });

  calendar.render();
});

