// Test script to verify class filtering logic

// Helper to check if class time has passed for current day
function hasClassPassed(day, time) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentDayName = daysOfWeek[currentDayIndex];
  const classDayIndex = daysOfWeek.indexOf(day);
  
  console.log(`\nChecking: ${day} at ${time}`);
  console.log(`Today is: ${currentDayName} (${currentDayIndex}), Class day: ${day} (${classDayIndex})`);
  
  // If it's a different day, compare day indices
  if (day !== currentDayName) {
    const hasPassed = classDayIndex < currentDayIndex;
    console.log(`Different day - Has passed: ${hasPassed}`);
    return hasPassed;
  }
  
  // Same day - check time
  const [timeStr, period] = time.split(' ');
  const [hours, minutes] = timeStr.split(':').map(Number);
  let classHour = hours;
  
  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    classHour += 12;
  } else if (period === 'AM' && hours === 12) {
    classHour = 0;
  }
  
  const classTime = new Date(now);
  classTime.setHours(classHour, minutes, 0, 0);
  
  const hasPassed = now > classTime;
  console.log(`Same day - Current time: ${now.toLocaleTimeString()}, Class time: ${classTime.toLocaleTimeString()}`);
  console.log(`Has passed: ${hasPassed}`);
  
  return hasPassed;
}

// Test cases
const testClasses = [
  { day: 'Monday', time: '8:00 AM' },
  { day: 'Monday', time: '6:00 PM' },
  { day: 'Tuesday', time: '10:00 AM' },
  { day: 'Wednesday', time: '7:00 PM' },
  { day: 'Thursday', time: '9:00 AM' },
  { day: 'Friday', time: '5:30 PM' },
  { day: 'Saturday', time: '10:00 AM' },
  { day: 'Sunday', time: '11:00 AM' }
];

console.log('='.repeat(60));
console.log('CLASS FILTERING TEST');
console.log('Current date/time:', new Date().toString());
console.log('='.repeat(60));

const upcomingClasses = testClasses.filter(cls => !hasClassPassed(cls.day, cls.time));

console.log('\n' + '='.repeat(60));
console.log('UPCOMING CLASSES (should appear on schedule):');
console.log('='.repeat(60));
upcomingClasses.forEach(cls => {
  console.log(`✅ ${cls.day} at ${cls.time}`);
});

console.log('\n' + '='.repeat(60));
console.log('PAST CLASSES (should be hidden from schedule):');
console.log('='.repeat(60));
const pastClasses = testClasses.filter(cls => hasClassPassed(cls.day, cls.time));
pastClasses.forEach(cls => {
  console.log(`❌ ${cls.day} at ${cls.time}`);
});
