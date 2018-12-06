class Datetime {

  /* @date      Date
     @locale    String    BCP 47

     @options   Shape {
       @localeMatcher     String      lookup, best fit
       @timeZone          String      BCP 175
       @hour12            Boolean
       @hourCycle         String      h11, h12, h23, h24
       @formatMatcher     String      basic, best fit
       @weekday           String      narrow, short, long
       @era               String      narrow, short, long
       @year              String      numeric, 2-digit
       @month             String      numeric, 2-digit
       @day               String      numeric, 2-digit
       @hour              String      numeric, 2-digit
       @minute            String      numeric, 2-digit
       @second            String      numeric, 2-digit
       @timeZoneName      String      short, long
     }
   */
  constructor (date, locale, options) {
    this.date   = date;
    this.locale = locale;

    // Default options
    this.options = {
      year:    '2-digit',
      month:   '2-digit',
      day:     '2-digit',
      hour:    '2-digit',
      minute:  '2-digit',
      second:  '2-digit',

      // Options overwrite
      ...options
    };
  }

  updateLocale(value) {
    this.locale = value;

    // Return this so we can chain the function
    return this;
  }

  updateOption (name, value) {
    value = value === 'true'      ? true : value;
    value = value === 'false'     ? false : value;
    value = value === 'undefined' ? undefined : value;
    this.options[name] = value;

    // Return this so we can chain the function
    return this;
  }

  DateTimeFormat ({
    locale  = this.locale,
    options = this.options,
    date    = this.date
  } = {}) {
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date)
  }
}

// Initiate datetime 
const date     = new Date();
const datetime = new Datetime(date);

// Interval counter
let counter;

// Add options to datetime
const setOptions = function ({ target }) {
  const date = datetime
    .updateOption(target.name, target.value)
    .DateTimeFormat();

  document.getElementById('timestamp').innerHTML = date;
}

const setLocale = function ({ target }) {
  const date = datetime
    .updateLocale(target.value)
    .DateTimeFormat();

  document.getElementById('timestamp').innerHTML = date;
}

const timeTicker = function (date, increment = 1000) {
  document.getElementById('relative').innerHTML = new Intl.RelativeTimeFormat(datetime.locale).format(date);

  clearTimeout(counter)
  if (increment < 300000000) {
    counter = setTimeout(() => timeTicker(date - increment, increment * 2), 1000);
  }
}

window.onload = function () {
  // Polyfil RelativeTimeFormat
  Intl.RelativeTimeFormat = Intl.RelativeTimeFormat || IntlRelativeFormat;

  // Event listeners
  document.getElementById('options').addEventListener('change', setOptions);
  document.getElementById('locale').addEventListener('change', setLocale);

  document.getElementById('locale').addEventListener('change', () => {
    timeTicker(Date.now(), 1000);
  });

  // Trigger initial values
  document.getElementById('timestamp').innerHTML = datetime.DateTimeFormat();
  timeTicker(Date.now(), 1000);
}
