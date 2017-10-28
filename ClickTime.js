var dataSet = [];
var timeEnded = 0;
var timeElapsed = 0;
var timeStarted;
var startStop = 0;
$(document).ready(function(){

	initLocalStorage();
	//When start button is clicked
	$("#start-button").click(function(){
		if(startStop!= 0 && timeElapsed!=0){
			alert("Start button is already clicked.");
			return;
		}
		localStorage.setItem("timeStarted", new Date());
		localStorage.setItem("startStop", parseInt(localStorage.getItem("startStop"))+1);
		navigator.geolocation.getCurrentPosition(function(position) {
			var storedDataSet = localStorage.getItem("dataSet");
			if (storedDataSet)
			{
				dataSet = JSON.parse(storedDataSet);
			}
			else
			{
				dataSet = [];
			}
			timeElapsed = ($).now();
			timeStarted = new Date(localStorage.getItem("timeStarted"));
			var newDataRow = [Intl.DateTimeFormat().resolvedOptions().timeZone, timeStarted.getHours()+":"+timeStarted.getMinutes()+":"+timeStarted.getSeconds(), position.coords.latitude, position.coords.longitude, "N/A"];
			dataSet.push(newDataRow);
			localStorage.setItem("dataSet", JSON.stringify(dataSet));
			if ( ! $.fn.DataTable.isDataTable('#stopWatchTable') ) {	
  				initDataTable(dataSet);
			}
			else
			{
				var tempData = [];
				tempData.push(newDataRow);
				var table = $('#stopWatchTable').DataTable();
				table.rows.add(tempData).draw();
			}	
		});	
	});

	//When stop button is clicked
	$("#stop-button").click(function(){
		if(parseInt(localStorage.getItem("startStop"))!=1){
			alert("Stop button is already clicked or Start button has not been clicked first.");
			return;
		}
		timeStarted = new Date(localStorage.getItem("timeStarted"));
		timeEnded = new Date();
		localStorage.setItem("startStop", parseInt(localStorage.getItem("startStop"))-1);
		navigator.geolocation.getCurrentPosition(function(position) {
			var date = new Date();
			var storedDataSet = localStorage.getItem("dataSet");
			if (storedDataSet)
			{
				dataSet = JSON.parse(storedDataSet);
			}
			else
			{
				dataSet = [];
			}
			timeElapsed = calculateTimeElapsed(timeStarted, timeEnded);
			var newDataRow = [Intl.DateTimeFormat().resolvedOptions().timeZone, date.getHours()+":"+date.getMinutes()+":"+date.getSeconds(), position.coords.latitude, position.coords.longitude, timeElapsed];
			dataSet.push(newDataRow);
			timeElapsed = 0;
			localStorage.setItem("dataSet", JSON.stringify(dataSet));
			if ( ! $.fn.DataTable.isDataTable('#stopWatchTable') ) {		
				initDataTable(dataSet);
			}
			else
			{
				var tempData = [];
				tempData.push(newDataRow);
				var table = $('#stopWatchTable').DataTable();
				table.rows.add(tempData).draw();
			}	
		});
	});

	function initDataTable(data)
	{
		$('#stopWatchTable').DataTable( {
				        data: data,
				        columns: [
			            { title: "Timezone" },
			            { title: "Time (Hours:Minutes:Seconds)" },
			            { title: "Latitude" },
			            { title: "Longitute" },
			            { title: "Time elapsed (Days:Hours:Minutes:Seconds)"}
		        		]
			    	});  
	}

	function initLocalStorage()
	{
		var tempStartStop = localStorage.getItem("startStop");
		if (tempStartStop && parseInt(tempStartStop)){
			startStop = parseInt(tempStartStop);
		}else{
			localStorage.setItem("startStop", 0);
		}
		
		var tempTimeStarted = localStorage.getItem("timeStarted");
		if (tempTimeStarted){
			timeStarted = tempTimeStarted;
		}else{
			localStorage.setItem("timeStarted", new Date());
		}
		
		var tempDataSet = localStorage.getItem("dataSet");
		if (tempDataSet){
			dataSet = JSON.parse(tempDataSet);
			initDataTable(dataSet);
		}else{
			dataSet = [];
			localStorage.setItem("dataSet", JSON.stringify(dataSet));
		}
	}
	
	//Calculate elapsed time
	function calculateTimeElapsed(timeStarted, timeEnded){
		var diff = Math.abs(timeEnded - timeStarted);
		var seconds = Math.floor(diff/1000);
		var minutes = Math.floor(seconds/60);
		seconds = seconds % 60;
		var hours = Math.floor(minutes/60);
		minutes = minutes % 60;
		var days = Math.floor(hours/24);
		return days+":"+hours+":"+minutes+":"+seconds;
	}

	//When reset button is clicked
	$("#reset-button").click(function(){
		timeEnded = 0;
		timeElapsed = 0;
		localStorage.clear();
		initLocalStorage();
		if($.fn.DataTable.isDataTable('#stopWatchTable')){
			var table = $('#stopWatchTable').DataTable();
			table.clear().draw();
		}
		alert("Table reset.");
	});
	
});