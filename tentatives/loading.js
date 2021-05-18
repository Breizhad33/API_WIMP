// import {Spinner} from 'spin.js';
//
// function loadingStart() {
//   var opts = {
//     lines: 13, // The number of lines to draw
//     length: 51, // The length of each line
//     width: 15, // The line thickness
//     radius: 50, // The radius of the inner circle
//     scale: 1, // Scales overall size of the spinner
//     corners: 1, // Corner roundness (0..1)
//     speed: 1.1, // Rounds per second
//     rotate: 18, // The rotation offset
//     animation: 'spinner-line-fade-more', // The CSS animation name for the lines
//     direction: 1, // 1: clockwise, -1: counterclockwise
//     color: '#0074ff', // CSS color or array of colors
//     fadeColor: 'transparent', // CSS color or array of colors
//     top: '51%', // Top position relative to parent
//     left: '50%', // Left position relative to parent
//     shadow: '0 0 1px transparent', // Box-shadow for the lines
//     zIndex: 2000000000, // The z-index (defaults to 2e9)
//     className: 'spinner', // The CSS class to assign to the spinner
//     position: 'absolute', // Element positioning
//   };
//   if ('routingstart') {
//     var target = document.getElementById('map');
//     var spinner = new Spinner(opts);
//     on('routingstart', spin(spinner));
//     on('routesfound routingerror', stop(spinner));
//   }
//
// }
