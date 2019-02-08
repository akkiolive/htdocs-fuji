(function(){
    // var canvas = document.getElementById("stage");
    // var ctx = canvas.getContext("2d");

    // var width = 500;
    // var height = 800;
    // canvas.width = width;
    // canvas.height = height;

    var chartCtx = document.getElementById("chart").getContext("2d");
	
	var config = {
		type: "line",
		data: [3,4,1,5],
		options: {
			title: {
				text: "graph title"
			}
		}			
	}
	
	
	window.onload = function(){
		window.myLine = new Chart(chartCtx, config);
	}
	
})();