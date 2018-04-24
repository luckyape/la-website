const psi = require('psi');

// Get the PageSpeed Insights report
psi('174.7.126.60').then(data => {
  console.log(data.ruleGroups.SPEED.score);
  console.log(data.pageStats);
});

// Output a formatted report to the terminal
psi.output('174.7.126.60').then(() => {
  console.log('done');
});