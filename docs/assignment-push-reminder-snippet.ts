// Add this block inside reminders(data, stamp), before "return output;".
// Assignment reminders use Europe/Berlin local dates and times.
// Keep the existing task, event, and habit reminder rules unchanged.
const currentLocal = `${date}T${stamp.hour}:${stamp.minute}:00`;
const nowMs = new Date(currentLocal).getTime();
for (const assignment of data.assignments || []) {
  if (assignment.done || !/^\\d{4}-\\d{2}-\\d{2}$/.test(assignment.date || '') ||
      !/^([01]\\d|2[0-3]):[0-5]\\d$/.test(assignment.time || '')) continue;
  const deadline = new Date(`${assignment.date}T${assignment.time}:00`).getTime();
  if (!Number.isFinite(deadline)) continue;
  const remaining = Math.round((deadline - nowMs) / 60000);
  for (const [lead, label] of [
    [4320, 'Due in 3 days'],
    [1440, 'Due tomorrow'],
    [180, 'Due in 3 hours'],
    [60, 'Due in 1 hour']
  ] as const) {
    if (remaining === lead) output.push({
      key: `assignment:${assignment.id}:${lead}`,
      title: `🚨 ${label}`,
      body: `${assignment.title} · ${assignment.date} at ${assignment.time}`
    });
  }
}
