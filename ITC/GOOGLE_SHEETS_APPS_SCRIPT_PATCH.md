# Google Sheets / Apps Script patch for the updated Leen ITC lead form

The source project does not include the Google Apps Script file, so the script could not be edited directly. Update the deployed Apps Script to expect this simplified payload from the app:

```json
{
  "submission_date": "ISO timestamp",
  "name": "student name",
  "phone": "+966555579299",
  "student_type": "ثانوي | دبلوم | غير ذلك"
}
```

Recommended Google Sheet headers:

1. `submission_date`
2. `name`
3. `phone`
4. `student_type`

Fields removed from the lead form and payload:

- `country`
- `heard_from`

The phone field now stores the final immutable international number by combining the selected country code with the typed local number.
