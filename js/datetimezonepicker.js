/**
 * This hooks up a series of form inputs loaded using the 'date-time-zone-picker' Handlebars helper.
 * There is a date picker, using a Bootstrap plugin, a time input, and a timezone dropdown
 * The final GMT date in ISO format is stored in a hidden form input
 */
function hookDateTimeZoneFields (node, opts) {
  opts = opts || {};
  node = node || document;
  var fields = node.querySelectorAll('[role=date-time-zone-picker]');
  var timezones = ['America/Vancouver', 'America/Toronto', 'Europe/London'];
  var defaultTimezone = 'America/Vancouver';
  fields.forEach(function (el) {
    var selectedTimezone = defaultTimezone;
    var $el = $(el);
    var $help= $el.find('.form-help');
    var isoInput = $el.find('input[role=iso-date]');
    var date = new Date(isoInput.val());
    var mdate;
    if(date.toString() == 'Invalid Date') {
      mdate = moment(new Date()).tz(selectedTimezone);
    }
    else {
      mdate = moment(date).tz(selectedTimezone);
    }
    var dateInput = $el.find('[role=date-time-zone-picker-date]');
    var timeInput = $el.find('[role=date-time-zone-picker-time]');
    var zoneSelect = $el.find('[role=date-time-zone-picker-timezone]');

    var updateDate = function () {
      var times = timeInput.val();
      var dateVal = dateInput.val();

      //Update based on the date picker
      if(dateVal) {
        var parts = dateVal.split(/[\-|\/]/);
        if(parts.length == 3) {
          mdate.year(parts[0]);
          mdate.month(parseInt(parts[1]) - 1); //Months are 0 to 11 index
          mdate.date(parts[2]);
        }

        if(times) {
          var split = times.split(':');
          if(split.length > 0) {
            split[0] = split[0] || 0;
            mdate.hour(parseInt(split[0]));
            if(split.length > 1) {
              mdate.minute(parseInt(split[1]));
            }
          }
          else {
            mdate.hour(0);
          }
        }
        else {
          mdate.hour(0);
        }
        isoInput.val(mdate.toISOString());
        $help.text(mdate.clone().tz(defaultTimezone).format('ddd MMM Do YYYY h:mm A z'));
      }
      else {
        isoInput.val('');
        $help.text('No date');
      }
    }

    var updateInputs = function () {
      //Update the view to match the date passed in to the handlebars helper
      if(mdate.format() == 'Invalid date') {
        dateInput.val('');
        timeInput.val('');
      }
      else {
        dateInput.val(mdate.format('YYYY-MM-DD'));
        timeInput.val(mdate.format('HH:mm'));
      }
      timeInput.ignoreChange = true
     }

    //dateInput.value = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    dateInput.on('change', function () {
      updateDate();
    });
    timeInput.on('change keyup', function (e) {
      var val = $(this).val();
      var replaced = val.replace(/[^0-9:]/g, '');

      if(val != replaced) {
        var start = this.selectionStart;
        var end = this.selectionEnd;
        $(this).val(replaced);
        this.setSelectionRange(start-1, end-1);
      }

      //Sometimes the code cahnges the value of this input because of timezone changes
      //and we just want to update the display without actually changing the data
      if(timeInput.ignoreChange) {
        timeInput.ignoreChange = false;
        return
      }
      updateDate();
    });
    zoneSelect.on('change', function (e) {
      selectedTimezone = zoneSelect.val();
      mdate = mdate.clone().tz(selectedTimezone); //Convert the moment date to the new timezone
      //updateDate();
      updateInputs();
    });
    $(dateInput).datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true
    }).on('change', updateDate);

    updateInputs();
    updateDate();
    zoneSelect.html(timezones.map(function (tz) {
      return '<option value="' + tz + '">' + tz + '</option>'
    }))
  });
}

//Add the partial to the DOM so it can be loaded with Handlebars helpers
document.addEventListener('DOMContentLoaded', function () {
  document.body.innerHTML += `
<script type="text/template"
        data-template="date-time-zone-picker"
        data-partial
        >
  <span role="date-time-zone-picker" class="date-time-zone-picker form-inline {{class}}">
    <input type="hidden" role="iso-date" name="{{name}}" value="{{value}}" /><br />
    <input class="form-control" type="text" role="date-time-zone-picker-date" placeholder="Date" size="10" />
    <input class="form-control" type="text" role="date-time-zone-picker-time" placeholder="HH:MM" size="5" />
    <select class="form-control" role="date-time-zone-picker-timezone">
    </select>
    <small class="form-help"></small>
  </span>
</script>`
});