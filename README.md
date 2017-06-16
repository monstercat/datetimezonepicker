# Date Time Zone Picker
JavaScript and CSS for creating a series of inputs for getting an ISO format GMT date for a selected date and time in a specific timezone.

## Set Up Guide

## Install
Add the following to your `dependencies` in your package.json

```"datetimezonepicker": "git+ssh://git@github.com:monstercat/datetimezone-picker.git"```

Run `npm install`

## Sym Link
Set up symlinks from your public folder to the datetimezonepicker folder

```
cd /projects/my-site/public/
ln -s ../node_modules/datetimezonepicker datetimezonepicker
```

## Include the JavaScript
There are **4** javascript files to include.

```
<script type="text/javascript" src="/datetimezonepicker/js/moment.js"></script>
<script type="text/javascript" src="/datetimezonepicker/js/moment.timezone.js"></script>
<script type="text/javascript" src="/datetimezonepicker/js/bootstrap.datepicker.js"></script>
<script type="text/javascript" src="/datetimezonepicker/js/datetimezonepicker.js"></script>
```

## Include the CSS

```
<link rel="stylesheet" href="/datetimezonepicker/css/datetimezonepicker.css" />
```

## Register the Handlebars Partials
This datetimezonepicker.js file appends a handlebar partial in HTML form to the `body`. Your code needs to find that partial and register it with Handlebars. In existing projects like Iris and the Event Manager, that is already happening in the main.js file like so

```
document.addEventListener('DOMContentLoaded', function () {
    registerPartials();
});
```

## Invoke the Helper
Here's how to create the HTML. It takes in two parameters

`name`: The hidden input field will have this string as its name property.  
`value`: A JavaScript Date object or ISO date string to use. If blank the current date is used.

```
<div class="form-group">
  <label>Half-Life 3 Release Date</label>
  <div>
    {{>date-time-zone-picker name="hl3ReleaseDate" value=myDateVariable}}
  </div>
</div>
```

## Bind the Fields
Add this function call to a post-render callback or function.

`hookDateTimeZoneFields()`

# Timezones
Changing the timezone field will change the values shown to the user and convert it to the match, but will not change the GMT datetime entered. There are currently only three timezones listed but more can be added.
