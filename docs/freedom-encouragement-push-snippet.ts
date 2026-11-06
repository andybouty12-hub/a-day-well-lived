// Add inside reminders(data, stamp), before return output.
// A discreet daily encouragement at 20:00, using the existing push pipeline.
// No addiction-related words appear on the lock screen.
if (clock === 1200) {
  const encouragements = [
    'A fresh day is another chance to choose what matters.',
    'Small, consistent choices build meaningful progress.',
    'Be patient with yourself and keep moving forward.',
    'Your effort matters, even on difficult days.',
    'Keep showing up for the life you want to build.'
  ];
  const checks = data.freedomChecks || {};
  const completedDays = Object.keys(checks).filter(d => checks[d] === true && d <= date).length;
  output.push({
    key: 'freedom:evening',
    title: '🌱 A little encouragement',
    body: encouragements[completedDays % encouragements.length]
  });
}
