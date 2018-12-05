/**
 * This hooks up a series of form inputs loaded using the 'date-time-zone-picker' Handlebars helper.
 * There is a date picker, using a Bootstrap plugin, a time input, and a timezone dropdown
 * The final GMT date in ISO format is stored in a hidden form input
 */
var defaultTimezones = [
  'America/Cancun',
  'America/Chicago',
  'America/Denver',
  'America/Toronto',
  'America/Vancouver',
  'Asia/Kolkata',
  'Asia/Seoul',
  'Asia/Shanghai',
  'China/Changsha',
  'Europe/Amsterdam',
  'Europe/Brussels',
  'Europe/London'
]
function hookDateTimeZoneFields (node, opts) {
  opts = opts || {};
  node = node || document;
  var fields = node.querySelectorAll('[role=date-time-zone-picker]');
  var timezones

  if (opts.timezones && opts.timezones == 'all') {
    timezones = hookDateTimeZoneFields.timezones.sort((a, b) => {
      const ad = defaultTimezones.indexOf(a) != -1
      const bd = defaultTimezones.indexOf(b) != -1
      if (ad == bd) {
        return a < b ? -1 : 1
      }
      else {
        if (ad) {
          return -1
        }
        else {
          return 1
        }
        return ad ? -1 : 1
      }
    })
  }
  else {
    timezones = defaultTimezones
  }

  function zeroPad (num) {
    const str = '0'.repeat(20) + num

    return str.substr(-2)
  }

  var defaultTimezone = 'America/Vancouver';
  fields.forEach(function (el) {
    var $el = $(el);
    var $help= $el.find('.form-help');
    var isoInput = $el.find('input[role=iso-date]');
    var dateInput = $el.find('[role=date-time-zone-picker-date]');
    var timeInput = $el.find('[role=date-time-zone-picker-time]');
    var zoneSelect = $el.find('[role=date-time-zone-picker-timezone]');
    var selectedTimezone = zoneSelect.attr('value')
    var isoVal = isoInput.val()

    if (hookDateTimeZoneFields.timezones.indexOf(selectedTimezone) == -1) {
      selectedTimezone = 'Europe/London'
    }

    var mdate  = moment(isoInput).clone().tz(selectedTimezone)


    //Load up the initial values of the
    if(!mdate || mdate.format() == 'Invalid date') {
      dateInput.val('')
      timeInput.val('')
    }
    else {
      dateInput.val(mdate.format('YYYY-MM-DD'))
      timeInput.val(mdate.format('HH:mm'))
    }

    zoneSelect.html(timezones.map(function (tz) {
      return '<option value="' + tz + '"' + (tz == selectedTimezone ? ' selected': '') + '>' + tz + '</option>'
    }))

    function updateHiddenDate () {
      var times = timeInput.val()
      var dateVal = dateInput.val()
      var timeZone = zoneSelect.val()

      //Update based on the date picker
      if(dateVal) {
        var dateTimeStr = ''
        var parts = dateVal.split(/[\-|\/]/);
        if(parts.length == 3) {
          dateTimeStr = (parts[0]) + '-' + zeroPad(parts[1]) + '-' + zeroPad(parts[2])
        }

        if(times) {
          var split = times.split(':');
          if(split.length > 0) {
            split[0] = split[0] || 0
            dateTimeStr += 'T' + zeroPad(split[0])
            if(split.length > 1) {
              dateTimeStr += ':' + zeroPad(split[1])
            }
          }
        }

        const isostring = mdate.toISOString()
        mdate = moment.tz(dateTimeStr, timeZone)
        isoInput.val(isostring)
        $help.text(mdate.clone().tz(defaultTimezone).format('ddd MMM Do YYYY h:mm A z'));
      }
      else {
        isoInput.val('');
        $help.text('No date');
      }
    }
    //Set up the watchers
    dateInput.on('change', function () {
      updateHiddenDate()
    });
    timeInput.on('change keyup', function (e) {
      var val = $(this).val();
      var replaced = val.replace(/[^0-9:]/g, '');

      if(val != replaced) {
        var start = this.selectionStart
        var end = this.selectionEnd
        $(this).val(replaced)
        this.setSelectionRange(start-1, end-1)
      }

      updateHiddenDate()
    })
    zoneSelect.on('change', function (e) {
      updateHiddenDate()
    })
    $(dateInput).datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true
    }).on('change', updateHiddenDate)
    updateHiddenDate()
  })
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
    <select class="form-control" role="date-time-zone-picker-timezone" name="{{timeZoneNameName}}" value="{{timeZoneName}}">
    </select>
    <br /><small class="form-help"></small>
  </span>
</script>`
});

hookDateTimeZoneFields.timezones = ["Africa/Abidjan","Africa/Accra","Africa/Addis_Ababa","Africa/Algiers","Africa/Asmera","Africa/Bamako","Africa/Bangui","Africa/Banjul","Africa/Bissau","Africa/Blantyre","Africa/Brazzaville","Africa/Bujumbura","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/Conakry","Africa/Dakar","Africa/Dar_es_Salaam","Africa/Djibouti","Africa/Douala","Africa/El_Aaiun","Africa/Freetown","Africa/Gaborone","Africa/Harare","Africa/Johannesburg","Africa/Juba","Africa/Kampala","Africa/Khartoum","Africa/Kigali","Africa/Kinshasa","Africa/Lagos","Africa/Libreville","Africa/Lome","Africa/Luanda","Africa/Lubumbashi","Africa/Lusaka","Africa/Malabo","Africa/Maputo","Africa/Maseru","Africa/Mbabane","Africa/Mogadishu","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Niamey","Africa/Nouakchott","Africa/Ouagadougou","Africa/Porto-Novo","Africa/Sao_Tome","Africa/Tripoli","Africa/Tunis","Africa/Windhoek","America/Anchorage","America/Anguilla","America/Antigua","America/Araguaina","America/Argentina/La_Rioja","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Aruba","America/Asuncion","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Buenos_Aires","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Catamarca","America/Cayenne","America/Cayman","America/Chicago","America/Chihuahua","America/Coral_Harbour","America/Cordoba","America/Costa_Rica","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Dominica","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Fortaleza","America/Glace_Bay","America/Godthab","America/Goose_Bay","America/Grand_Turk","America/Grenada","America/Guadeloupe","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Indianapolis","America/Inuvik","America/Iqaluit","America/Jamaica","America/Jujuy","America/Juneau","America/Kentucky/Monticello","America/Kralendijk","America/La_Paz","America/Lima","America/Los_Angeles","America/Louisville","America/Lower_Princes","America/Maceio","America/Managua","America/Manaus","America/Marigot","America/Martinique","America/Matamoros","America/Mazatlan","America/Mendoza","America/Menominee","America/Merida","America/Mexico_City","America/Moncton","America/Monterrey","America/Montevideo","America/Montreal","America/Montserrat","America/Nassau","America/New_York","America/Nipigon","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Ojinaga","America/Panama","America/Pangnirtung","America/Paramaribo","America/Phoenix","America/Port-au-Prince","America/Port_of_Spain","America/Porto_Velho","America/Puerto_Rico","America/Rainy_River","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Santa_Isabel","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Sitka","America/St_Barthelemy","America/St_Johns","America/St_Kitts","America/St_Lucia","America/St_Thomas","America/St_Vincent","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Thunder_Bay","America/Tijuana","America/Toronto","America/Tortola","America/Vancouver","America/Whitehorse","America/Winnipeg","America/Yakutat","America/Yellowknife","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/McMurdo","Antarctica/Palmer","Antarctica/Rothera","Antarctica/Syowa","Antarctica/Vostok","Arctic/Longyearbyen","Asia/Aden","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Baghdad","Asia/Bahrain","Asia/Baku","Asia/Bangkok","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Chita","Asia/Choibalsan","Asia/Colombo","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Katmandu","Asia/Khandyga","Asia/Kolkata","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Kuwait","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Muscat","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Phnom_Penh","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qyzylorda","Asia/Rangoon","Asia/Riyadh","Asia/Saigon","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Singapore","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Thimphu","Asia/Tokyo","Asia/Ulaanbaatar","Asia/Urumqi","Asia/Ust-Nera","Asia/Vientiane","Asia/Vladivostok","Asia/Yakutsk","Asia/Yekaterinburg","Asia/Yerevan","Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faeroe","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/St_Helena","Atlantic/Stanley","Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Currie","Australia/Darwin","Australia/Hobart","Australia/Lindeman","Australia/Melbourne","Australia/Perth","Australia/Sydney","CST6CDT","EST5EDT","Etc/GMT","Etc/GMT+1","Etc/GMT+10","Etc/GMT+11","Etc/GMT+12","Etc/GMT+2","Etc/GMT+3","Etc/GMT+4","Etc/GMT+5","Etc/GMT+6","Etc/GMT+7","Etc/GMT-1","Etc/GMT-10","Etc/GMT-11","Etc/GMT-12","Etc/GMT-13","Etc/GMT-2","Etc/GMT-3","Etc/GMT-4","Etc/GMT-5","Etc/GMT-6","Etc/GMT-7","Etc/GMT-8","Etc/GMT-9","Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belgrade","Europe/Berlin","Europe/Bratislava","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Busingen","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Guernsey","Europe/Helsinki","Europe/Isle_of_Man","Europe/Istanbul","Europe/Jersey","Europe/Kaliningrad","Europe/Kiev","Europe/Kirov","Europe/Lisbon","Europe/Ljubljana","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Mariehamn","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Nicosia","Europe/Oslo","Europe/Paris","Europe/Podgorica","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/San_Marino","Europe/Sarajevo","Europe/Simferopol","Europe/Skopje","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Ulyanovsk","Europe/Uzhgorod","Europe/Vaduz","Europe/Vatican","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zagreb","Europe/Zaporozhye","Europe/Zurich","Indian/Antananarivo","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Comoro","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Mayotte","Indian/Reunion","MST7MDT","PST8PDT","Pacific/Apia","Pacific/Auckland","Pacific/Efate","Pacific/Enderbury","Pacific/Fakaofo","Pacific/Fiji","Pacific/Funafuti","Pacific/Galapagos","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Johnston","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Midway","Pacific/Nauru","Pacific/Niue","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Ponape","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Saipan","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","Pacific/Truk","Pacific/Wake","Pacific/Wallis"]