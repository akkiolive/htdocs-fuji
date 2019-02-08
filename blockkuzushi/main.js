(function(){
    var canvas = document.getElementById("stage");
    var ctx = canvas.getContext("2d");

    var width = window.innerWidth;
    var height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
	
	
	class Block{
		constructor(x, y, width, height, color){
			this.width = width;
			this.height = height;
			this.x = x;
			this.y = y;
			this.color = color;
			this.display = true;
		}
		
		draw(){
			if(!this.display) return;
			ctx.beginPath();
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.strokeStyle = "black";
			ctx.stroke();
			ctx.fillStyle = this.color;
			ctx.fill();
		}
	}
	
	class Blocks{
		constructor(){
			this.list = [];
			this.num = 0;
		}
		
		add(Block){
			this.list.push(Block);
			this.num++;
		}
		
		draw(){
			for(var i in this.list){
				this.list[i].draw();
			}
		}
	}
	
	class Bar{
		constructor(x, y, width, height, color){
			this.width = width;
			this.height = height;
			this.x = x;
			this.y = y;
			this.color = color;
		}
		
		draw(){
			ctx.beginPath();
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.fillStyle = this.color;
			ctx.fill();
		}
	}
	
    class Ball{
		constructor(x, y, r, color){
			this.x = x;
			this.y = y;
			this.r = r;
			this.lastX = this.x;
			this.lastY = this.y;
			this.color = color;
			this.speed = 4;
			this.vx = this.speed*Math.cos(Math.PI/4);
			this.vy = this.speed*Math.sin(Math.PI/4);
		}
		
		draw(){
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
			ctx.fillStyle = this.color;
			ctx.fill();
		}
		
		step(){
			this.x += this.vx;
			this.y += this.vy;
			
			//collision wall
			if(this.x > width || this.x < 0){
				this.vx = -this.vx;
				if(this.x < 0) this.x = 0;
				else this.x = width;
			}
			if(this.y > height || this.y < 0){
				this.vy = -this.vy;
				if(this.y < 0) this.y = 0;
				else this.y = height;
			}
			
			//collision block
			for(var i in blocks.list){
				var b = blocks.list[i];
				if(b.display && this.x >= b.x && this.x <= b.x+b.width){
					if(this.y >= b.y && this.y <= b.y+b.height){
						//b.display = false;
						var last = {"x": this.lastX, "y": this.lastY};
						var p = {"x": this.x, "y": this.y};
						var ul = {"x": b.x, 			"y": b.y};
						var ur = {"x": b.x + b.width, 	"y": b.y};
						var bl = {"x": b.x, 			"y": b.y + b.height};
						var br = {"x": b.x + b.width, 	"y": b.y + b.height};
						var ue = intersectionPoint(ul, ur, last, p);
						var sita = intersectionPoint(bl, br, last, p);
						var migi = intersectionPoint(ur, br, last, p);
						var hidari = intersectionPoint(ul, bl, last, p);
						ps.push(ue); ps.push(sita); ps.push(migi); ps.push(hidari);
						
						if(ue.flag){
							console.log("ue");
						}
						if(sita.flag){
							console.log("sita");
						}
						if(migi.flag){
							console.log("migi");
						}
						if(hidari.flag){
							console.log("hidari");
						}
					}
				}
			}
			
			//collision bar
			if(this.x >= bar.x && this.x <= bar.x+bar.width){
				if(this.y >= bar.y && this.y <= bar.y+bar.height){
					var theta = (this.x - (bar.x+bar.width/2))/(bar.width/2) * Math.PI/2*0.8;
					this.vx = this.speed*Math.sin(theta);
					this.vy = -this.speed*Math.cos(theta);
				}
			}
			
			this.lastX = this.x;
			this.lastY = this.y;
		}
	}
	
	var blocks = new Blocks();
	for(var i=0; i<3; i++){
		for(var j=0; j<10; j++){
			blocks.add(new Block(i/3*width*0.9+5, j/10*height*0.8, width*0.1, height*0.05, "yellow"));
		}
	}
	var bar = new Bar(width/2, height*0.85, width/8, height/100, "blue");
	var ball = new Ball(width/4, height/7, 3, "red");
	
	window.addEventListener("mousemove", function(e){
		//bar.x = e.layerX - bar.width/2;
		ball.vx = 0;
		ball.vy = 0;
		ball.x = e.layerX;
		ball.y = e.layerY;
		ball.step();
	});
	
	function anime(){
		ctx.clearRect(0, 0, width, height);
		blocks.draw();
		bar.draw();
		ball.draw();
		ball.step();
		
		for(var p of ps){
			if(!p.valid)continue;
			ctx.beginPath();
			ctx.arc(p.x, p.y, 2, 0, Math.PI*2, false);
			if(p.flag) ctx.fillStyle = "red";
			else ctx.fillStyle = "black";
			ctx.fill();
		}
		
		window.requestAnimationFrame(anime);
	}
	
	window.requestAnimationFrame(anime);


	function intersectionPoint(l1, l2, ll1, ll2){
		//y = mx + b
		var m1 = (l1.y-l2.y)/(l1.x-l2.x);
		var b1 = l1.y - l1.x*( (l1.y-l2.y)/(l1.x-l2.x) );
		
		var m2 = (ll1.y-ll2.y)/(ll1.x-ll2.x);
		var b2 = ll1.y - ll1.x*( (ll1.y-ll2.y)/(ll1.x-ll2.x) );


		if(l1.x == l2.x && ll2.x == ll2.x){
			return{
				"valid": false,
				"x": Infinity,
				"y": Infinity,
				"flag": false
			}
		}
		else if(l1.x == l2.x){
			var y = m2*l1.x+b2;
			if(ll1.y<ll2.y){
				y1=ll1.y;
				y2=ll2.y;
			}
			else{
				y1=ll2.y;
				y2=ll1.y;
			}
			var flag = false;
			if(y >= y1 && y <= y2) flag = true;			
			return {
				"valid": true,
				"x": l1.x,
				"y": y,
				"flag": flag
			}
		}
		else if(ll1.x == ll2.x){
			var y = m1*ll1.x+b1;
			if(l1.y<l2.y){
				y1=l1.y;
				y2=l2.y;
			}
			else{
				y1=l2.y;
				y2=l1.y;
			}
			var flag = false;
			if(y >= y1 && y <= y2) flag = true;			
			return {
				"valid": true,
				"x": ll1.x,
				"y": y,
				"flag": flag
			}
		}
		
		
		//m1*x + b1 = m2*x + b2
		//x = (b2-b1)/(m1-m2)
			
		var x = (b2-b1)/(m1-m2);
		var y = m1 * x + b1;
		
		var flag = false;
		
		var lx = [l1.x, l2.x]; lx.sort(function(a,b){return a-b;});
		var ly = [l1.y, l2.y]; ly.sort(function(a,b){return a-b;});
		var llx = [ll1.x, ll2.x]; llx.sort(function(a,b){return a-b;});
		var lly = [ll1.y, ll2.y]; lly.sort(function(a,b){return a-b;});
		
		if(x >= lx[0] && x <= lx[1])
			if(y >= ly[0] && y <= ly[1])
				if(x >= llx[0] && x <= llx[1])
					if(y >= lly[0] && y <= lly[1])
						flag = true;
				
		
		
		return {
			"valid": true,
			"x": x,
			"y": y,
			"flag": flag
		}
	}
	
	var arr = [3,35,235,3,543,3];
	arr.sort(function(a,b){return a-b;});
	console.log(arr);
	
	var p1 = {"x": 1, "y":1};
	var p2 = {"x": 2, "y":2};
	var p3 = {"x": 1, "y":0};
	var p4 = {"x": 1, "y":10};
	var ret = intersectionPoint(p1, p2, p3, p4);
	console.log(ret);
	
	var ps = [];
	
})();