var UI = require('ui');
var ajax = require('ajax');

var platforms={
    2: "Hickory @ Quest",
    5: "PVCC Dickinson"
};
var stopItems=[];

for (var p in platforms) {
	var stopname=platforms[p];
    	stopItems.push( {
	    title: stopname,
	    subtitle: p
	});
}

var stopsMenu = new UI.Menu( {
    sections: [ {
    	title: "Stops",
	items: stopItems
    }]
});

var stopCard = new UI.Card( {
      title:'Timetable',
      subtitle:'Fetching...',
      scrollable: true,
      style: 'small'
});

stopsMenu.on('select', function(e) {
    showStop(e.item.subtitle);
});

function showStop(stopNum) {
    // Refresh our global card object
    stopCard.subtitle('Fetching...');
    stopCard.show();

    // Construct URL
    var URL = 'http://www.cv.nrao.edu/php/jmalone/bus.php?platform='+stopNum;
    var timetable = '';

    // Make the request
    ajax( { url: URL, type: 'json' },
      function(data) {
	// Success!
	console.log("Successfully fetched data!");

	// Extract data 
	for (var route in data.ETA) {
	  var dest = data.ETA[route].destination[0];
	  for (var bus=0; bus<data.ETA[route].arrivals.length; bus++) {
	    timetable=timetable + route+' ('+dest.substring(0,10)+') : ' 
		+data.ETA[route].arrivals[bus]+'\n';
	  }
	}
	// Show to user
	stopCard.subtitle("");
	stopCard.body(data.name+"\n"+timetable);
      },
      function(error) {
	// Failure!
	console.log('Failed fetching bus data: ' + error);
      }
    );
}

stopsMenu.show();
