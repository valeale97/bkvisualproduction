BK Visual Production – Google Apps Script (Optional Backend)

This static site ships with front-end-only forms. To actually send emails and reserve booking slots,
create a Google Apps Script web app.

Files:
  - code.gs (paste into your Apps Script project)

What it provides
  1) Email sending for Contact + Booking
     - POST with action=send

  2) Availability + Booking via Google Calendar
     - POST with action=availability
     - POST with action=book

Why one endpoint?
  Apps Script web apps expose a single URL. We route by the 'action' field.

Setup
  1) Create a new Apps Script project
  2) Enable advanced Google services (optional) NOT required
  3) In Project Settings, set time zone to your business time zone
  4) Replace PLACEHOLDERS in code.gs:
       ADMIN_EMAIL
       CALENDAR_ID
  5) Deploy as Web App:
       Execute as: Me
       Who has access: Anyone
     Copy the Web App URL

Front-end CONFIG
  In /js/forms.js set:
    APPS_SCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/....../exec'
    CALENDAR_ID = 'your_calendar_id'
    WORKING_HOURS / BREAKS
    RECAPTCHA_SITE_KEY (for rendering)

reCAPTCHA v2
  - Front-end includes the widget when RECAPTCHA_SITE_KEY is set.
  - Server-side verification MUST be done in Apps Script using your secret key.
  - This template includes a stub (verifyRecaptcha) to implement.

Admin note
  Deleting/canceling a booking should be handled directly in Google Calendar
  or via a protected endpoint with auth. Do not expose unauthenticated delete.

Payload examples
  Contact:
    { action:'send', formType:'contact', name:'...', email:'...', message:'...', recaptchaToken:'...' }

  Availability:
    { action:'availability', startISO:'2026-01-20T00:00:00.000Z', endISO:'2026-01-21T00:00:00.000Z' }

  Book:
    { action:'book', name:'...', email:'...', startISO:'...', endISO:'...', calendarId:'...', message:'...', recaptchaToken:'...' }
