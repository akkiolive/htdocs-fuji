(function(){
    
	function putdiv(x,y){
		var div = document.createElement("div");
		document.body.insertBefore(div, document.body.firstChild);
		
		div.setAttribute("style", "z-index:100; width:5px;height:5px;background:red;border:1px solid black;position:absolute;left:"+x+"px;top:"+y+"px;");
		
		
	}

	var div = document.createElement("div");
	document.body.insertBefore(div, document.body.firstChild);
		
		
		

	document.onmousemove = function(e){
		//console.log(e.target);
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

		var x = e.x;
		var y = e.y;
		
		//div.setAttribute("style", "z-index:100;position:absolute;left:"+Number(x+10)+"px;top:"+y+"px;");
		div.style.zIndex = "1000";
		div.style.position = "absolute";
		div.style.left = Number(x+10+scrollLeft)+"px";
		div.style.top = Number(y+scrollTop)+"px";
		
		div.innerHTML = "<br>\t\t("+e.x+", "+e.y+")<br>";
		div.innerHTML += "layer \t\t("+e.layerX+", "+e.layerY+")<br>";
		div.innerHTML += "offset \t\t("+e.offsetX+", "+e.offsetY+")<br>";
		div.innerHTML += "page \t\t("+e.pageX+", "+e.pageY+")<br>";
		div.innerHTML += "screen \t\t("+e.screenX+", "+e.screenY+")<br>";
		
		
		if(sel.type==="Range"){
			var r = sel.getRangeAt(0);
			
			var nodes = e.target.childNodes;
			var find_flag = false;
			
			for(var i=0; i<nodes.length; i++){
				var range = new Range();
				range.selectNode(nodes.item(i));
				var rect = range.getBoundingClientRect();
				if(rect.left <= x && x <= rect.right)
					if(rect.top <= y && y <= rect.bottom){
						setFirstTextNode(nodes.item(i));
						find_flag = true;
						break;
					}
			}
			
			if(!find_flag) {
				console.log("not found bouding node");
				return;
			}
			
			var indexLeft = getTextIndexLeft(firstTextNode, x, y);
			
			
			r.setStart(firstTextNode, indexLeft);
		}
	};
	
	function getTextIndexLeft(textNode, x, y){
		if(textNode.nodeName != "#text")
			return;
		console.log(textNode);
		
		var range = new Range();
		range.selectNode(textNode);
		var rect = range.getBoundingClientRect();
		
		var rangeStart = new Range();
		rangeStart.setStart(textNode, 0);
		rangeStart.setEnd(textNode, 0);
		var rectStart = rangeStart.getBoundingClientRect();
		
		var rangeEnd = new Range();
		rangeEnd.setStart(textNode, textNode.length);
		rangeEnd.setEnd(textNode, textNode.length);
		var rectEnd = rangeEnd.getBoundingClientRect();
		
		if(rectStart.top == rectEnd.top){ //single line
			var prevTrue = false;
			for(var i=0; i<textNode.length; i++){
				range.setStart(textNode, i);
				range.setEnd(textNode, i);
				var rectTest = range.getBoundingClientRect();
				if(x < rectTest.left){
					//return i;
					prevTrue = true;
				}
				if(prevTrue && rectTest.left >= x){
					//putdiv(rectTest.left, rectTest.top);
					//putdiv(rectTest.right, rectTest.bottom);
					return i;
				}
			}
		}
		else{ //multi lines
			for(var i=0; i<textNode.length; i++){
				var prevTrue = false;
				rangeStart.setStart(textNode, i);
				rangeStart.setEnd(textNode, i);
				rectStart = rangeStart.getBoundingClientRect();
				
				rangeEnd.setStart(textNode, i+1);
				rangeEnd.setEnd(textNode, i+1);
				rectEnd = rangeEnd.getBoundingClientRect();
				
				if(rectStart.top != rectEnd.top)
					continue;
				
				if(x <= rectStart.left && rectStart.top <= y && y <= rectStart.bottom)
					return i
					//prevTrue = true;
				if(prevTrue && rectStart.left <= x && rectStart.top <= y && y <= rectStart.bottom)
					return i;
				
				
			}
		}
		
		return null;
	}
	
	var sel1 = document.createElement("div");
	sel1.style.zIndex = "99";
	sel1.style.position = "absolute";
	sel1.innerText = "■";
	document.body.insertBefore(sel1, document.body.firstChild);
	
	var sel2 = document.createElement("div");
	sel2.style.zIndex = "100";
	sel2.style.position = "absolute";
	sel2.innerText = "★";
	document.body.insertBefore(sel2, document.body.firstChild);
	
	
	window.onmouseup = function(){
		var sel = window.getSelection();
		var range = sel.getRangeAt(0);
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
		
		
		if(sel.type != "Range"){
			
			return;
		}
		
		
		console.log(sel);
		console.log(range);
		console.log(scrollTop);
		
		var anchorNode = sel.anchorNode;
		var focusNode = sel.focusNode;
		
		var rect = range.getBoundingClientRect();
		
		var x1 = rect.left + scrollLeft;
		var y1 = rect.top + scrollTop;
		var x2 = rect.right + scrollLeft;
		var y2 = rect.bottom + scrollTop;
		
		setGripPosition(x1, y1, x2, y2);
		
		console.log(rect);
		
		
	}
	
	function setGripPosition(x1,y1,x2,y2){
		sel1.style.left = x1+"px";
		sel1.style.top = y1+"px";
		sel2.style.left = x2+"px";
		sel2.style.top = y2+"px";
	}
	
	document.onkeydown = function(e){
		var k = e.keyCode;
		console.log(k);
		
		var sel = window.getSelection();
		
		if(sel.type != "Range")
			return;
		
		var r = sel.getRangeAt(0);
		
		
		if(k == 65){ // a key
			if(sel.anchorOffset != 0)
				r.setStart(sel.anchorNode, sel.anchorOffset-1);
			else{
				if(sel.anchorNode.previousSibling)
					setPreviousTextNode(sel.anchorNode.previousSibling);
				else if(sel.anchorNode.parentNode.previousSibling)
					setPreviousTextNode(sel.anchorNode.parentNode.previousSibling);
				else{
					var no_parent_flag = false;
					var parent = sel.anchorNode;
					var tmp = parent.previousSibling;
					
					while(!tmp){
						try{
							parent = parent.parentNode;
						}
						catch(e){
							no_parent_flag = true;
							break;
						}
						tmp = parent.previousSibling;
					}
					
					if(no_parent_flag)
						previousTextNode = null;
					else
						setPreviousTextNode(tmp);
				}
				
				if(previousTextNode){
					console.log("previousTextNode:");
					console.log(previousTextNode);
					r.setStart(previousTextNode, previousTextNode.length-1);
				}
			}
				
		}
		else if(k == 68){ // d key
			r.setStart(sel.anchorNode, sel.anchorOffset+1);	
		}
		
		sel.removeAllRanges();
		sel.addRange(r);
		
		var tmpRange = new Range();
		tmpRange.setStart(sel.anchorNode, sel.anchorOffset);
		tmpRange.setEnd(sel.anchorNode, sel.anchorOffset);
		var anchorRect = tmpRange.getBoundingClientRect();
		
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

		var x1 = anchorRect.left + scrollLeft;
		var y1 = anchorRect.bottom + scrollTop;
		var x2 = anchorRect.right + scrollLeft;
		var y2 = anchorRect.bottom + scrollTop;
		
		setGripPosition(x1, y1, 0, 0);
		
	}
	
	var firstTextNode;
	
	function setFirstTextNode(node){
		//console.log("node:");
		//console.log(node.nodeName);
		if(node.nodeName === "#text"){
			//console.log("return")
			firstTextNode = node;
			return node;
		}
		else if(node.childNodes.length)
			setFirstTextNode(node.childNodes.item(0));
		else
			setFirstTextNode(node.nextElementSibling);
	}

	var previousTextNode;
	
	function setPreviousTextNode(node){
		console.log("node:");
		console.log(node.nodeName);
		if(node.nodeName === "#text"){
			console.log("return")
			previousTextNode = node;
			return node;
		}
		else if(node.childNodes.length)
			setPreviousTextNode(node.childNodes.item(node.childNodes.length-1));
		else if(node.previousSibling)
			setPreviousTextNode(node.previousSibling);
		else if(node.parentNode.previousSibling)
			setPreviousTextNode(node.parentNode.previousSibling);
		else{
			previousTextNode = null;
			return null;
		}
	}
	
	var nextTextNode;
	
	function setNextTextNode(node){
		console.log("node:");
		console.log(node.nodeName);
		if(node.nodeName === "#text"){
			console.log("return")
			nextTextNode = node;
			return node;
		}
		else if(node.childNodes.length)
			setNextTextNode(node.childNodes.item(0));
		else
			setNextTextNode(node.nextElementSibling);
	}


	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	console.log(sel);

})();