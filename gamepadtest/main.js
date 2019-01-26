(function(){
    var canvas = document.getElementById("stage");
    var ctx = canvas.getContext("2d");

    var width = 500;
    var height = 300;
    canvas.width = width;
    canvas.height = height;

    window.addEventListener("gamepadconnected", function(e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
		console.log(navigator.getGamepads());
    });

	function makeView(){
		//empty
		var d = document.createElement("div");
		d.setAttribute("id", "pad");
		var pad = $("#pad");
		pad.empty();
		
		//get pads
		var cons = navigator.getGamepads();
		var con = cons[0];
		
		//view buttons
		pad.append($("<h2>buttons</h2>"));
		for(var i in con.buttons){
			var b = con.buttons[i];
			if(b.pressed){
				var button = $("<span style='margin:0.2em; background: red;'>"+i+"</span>");
				pad.append(button);
			}
			else{
				var button = $("<span style='margin:0.2em;'>"+i+"</span>");
				pad.append(button);
			}
		}
		
		//view axes
		pad.append($("<h2>axes</h2>"));
		for(var i in con.axes){
			var a = con.axes[i];
			var ax = $("<div>"+i+": "+a+"</div>");
			ax.css("background", "rgb("+[128*(1+a)]+","+255*a+",250)");
			pad.append(ax);
		}
			
		//append all
		document.body.appendChild(d);
	}
		
	setInterval(function(){
		//console.log(navigator.getGamepads());
		makeView();
    }, 100);


})();