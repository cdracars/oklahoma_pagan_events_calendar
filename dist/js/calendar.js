/**
 * Event listener for DOMContentLoaded event.
 * Initializes the calendar once the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
  initCalendar();

  /**
   * Initializes the calendar and its related components.
   */
  function initCalendar() {
    const calendar = createCalendar();
    const calendarTypes = [
      'Site', 'Astrological', 'Central', 'North-East', 'North-West', 'Online', 'South-Central', 'South-East', 'South-West'
    ];

    const filterContainer = document.querySelector('.calendar-filter');
    const dropdown = buildCalendarFilterDropdown(calendarTypes);
    filterContainer.appendChild(dropdown);
    document.getElementById('calendarFilter').addEventListener('change', updateCalendarDisplay);

    setupNavigationButtons(calendar);

    updateCalendarDisplay();

    /**
     * Creates and initializes a new Toast UI Calendar instance.
     * @returns {tui.Calendar} The initialized calendar instance.
     */
    function createCalendar() {
      const calendarEl = document.getElementById('calendar');
      return new tui.Calendar(calendarEl, {
        defaultView: 'month',
        taskView: true,
        scheduleView: true,
        useDetailPopup: true,
      });
    }

    /**
     * Builds the calendar filter dropdown.
     * @param {Array<string>} calendarTypes - Array of calendar type strings.
     * @returns {HTMLSelectElement} The created dropdown element.
     */
    function buildCalendarFilterDropdown(calendarTypes) {
      const dropdown = document.createElement('select');
      dropdown.id = 'calendarFilter';

      const allOption = createOption('', 'All');
      dropdown.appendChild(allOption);

      calendarTypes.forEach(type => {
        const calendarOption = createOption(type, type);
        dropdown.appendChild(calendarOption);
      });

      /**
       * Creates an option element with the given value and text.
       * @param {string} value - The value of the option element.
       * @param {string} text - The text content of the option element.
       * @returns {HTMLOptionElement} The created option element.
       */
      function createOption(value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        return option;
      }

      return dropdown;
    }

    /**
     * Sets up the navigation buttons and their event listeners.
     * @param {tui.Calendar} calendar - The calendar instance.
     * @returns {Object} An object containing the navigation buttons and the updateNavbarRange function.
     */
    function setupNavigationButtons(calendar) {
      const todayButton = document.querySelector('.today');
      const prevButton = document.querySelector('.prev');
      const nextButton = document.querySelector('.next');
      const range = document.querySelector('.navbar--range');

      todayButton.addEventListener('click', () => updateCalendarDisplay('today'));
      prevButton.addEventListener('click', () => updateCalendarDisplay('prev'));
      nextButton.addEventListener('click', () => updateCalendarDisplay('next'));

      /**
       * Updates the navbar range text based on the calendar's current date range.
       */
      function updateNavbarRange() {
        const viewType = 'month';
        const tzStart = calendar.getDateRangeStart();
        const tzEnd = calendar.getDateRangeEnd();
        const start = tzStart.toDate();
        const end = tzEnd.toDate();
        const middle = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2);
        const rangeText = moment(middle).format('YYYY-MM');

        range.textContent = rangeText;
      }

      return { todayButton, prevButton, nextButton, updateNavbarRange };
    }

     /**
      * Updates the calendar display based on the provided action and the selected calendar type.
      * @param {string|null} action - The navigation action to perform (e.g. 'today', 'prev', or 'next').
      */
     function updateCalendarDisplay(action = null) {
       if (action === 'today') {
         calendar.today();
       } else if (action === 'prev') {
         calendar.prev();
       } else if (action === 'next') {
         calendar.next();
       }

       const selectedCalendarType = document.getElementById('calendarFilter').value;
       fetchEvents(selectedCalendarType)
         .then(events => {
           calendar.clear();
           calendar.createEvents(events);
         })
         .catch(error => {
           console.error('Error fetching calendar events:', error);
         });

       const { updateNavbarRange } = setupNavigationButtons(calendar);
       updateNavbarRange();
     }

     /**
      * Fetches calendar events based on the provided calendar type.
      * @async
      * @param {string} targetCalendarType - The calendar type to filter events by.
      * @returns {Promise<Array>} A promise that resolves to an array of calendar events.
      */
     async function fetchEvents(targetCalendarType) {
       try {
         const response = await fetch('data/calendar_events.json');
         const data = await response.json();

         return data.items
           .filter(event => !targetCalendarType || event.calendar === targetCalendarType)
           .map(event => ({
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
           }));
       } catch (error) {
         console.error('Error fetching calendar events:', error);
         return [];
       }
     }
  }
});
