	class Habit{
		constructor(name){
			this.name = name;
			this.check = {};
			this.id = undefined;
		}
		
		write(day, value=true){
			var year = day.getFullYear();
			var month = day.getMonth();
			var date = day.getDate();
			var key = String(year) + String(month+1) + String(date);
			this.check[key] = value;
		}
		
		writeFromKey(key, value=true){
			this.check[key] = value;
		}
		
		toggleFromKey(key){
			this.check[key] = !this.check[key];
		}
	}
	
	class Habits{
		constructor(){
			this.list = [];
			this.num = 0;
		}
		
		add(habit){
			habit.id = this.num;
			this.list.push(habit);
			this.num++;
		}
	}
    
	var daysName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	
	var habits  = new Habits();
	var h1 = new Habit("薬を塗る");
	h1.write(new Date());
	habits.add( h1 );
	habits.add(new Habit("薬を飲む") );
	habits.add(new Habit("８時５５分に電話する") );
	
	
	var firstDay = new Date();
	firstDay = new Date( firstDay.setDate(1) );
	var endDay = new Date();
	endDay = new Date( endDay.setMonth( endDay.getMonth() + 1) );
	endDay = new Date( endDay.setDate(0) );
	console.log(firstDay);
	console.log(endDay);
		
	
	function setDisplayMonth(day){
		firstDay = new Date(day);
		firstDay = new Date( firstDay.setDate(1) );
		endDay = new Date(day);
		endDay = new Date( endDay.setMonth( endDay.getMonth() + 1) );
		endDay = new Date( endDay.setDate(0) );	
	}
	
	function display(wrap){
		var table = $("<table class='table' id='table1'></table>");
		var thead = $("<thead></thead>");
		var tr = $("<tr></tr>");
		thead.append(tr);
		
		for(var date=firstDay.getDate(); date<=endDay.getDate(); date++){
			var tmpDay = new Date(firstDay);
			tmpDay.setDate(tmpDay.getDate()+date-1);
			
			var th = $("<th scope='col'>" + date + "<br>(" + daysName[tmpDay.getDay()] + ")" + "</th>");
			th.css("text-align", "center");
			if(tmpDay.getDay() == 0)
				th.attr("class", "red");
			else if(tmpDay.getDay() == 6)
				th.attr("class", "blue");
			else
				th.attr("class", "black");
			
			if(date==firstDay.getDate())
				tr.append( $("<th scope='col'>"+String(Number(firstDay.getMonth())+1)+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>") );
			
		
			tr.append(th);
			
			table.append(thead);
		}
		
		var tbody = $("<tbody></tbody>");
		
		for(var h of habits.list){
			var tr = $("<tr></tr>");
			var th = $("<th scope='row'>" + h.name + "</th>");
			th.css("text-align", "center");
			tr.append(th);
			
			var today = new Date(firstDay);
			var year = today.getFullYear();
			var month = today.getMonth();
			
			
			for(var date=firstDay.getDate(); date<=endDay.getDate(); date++){
				var key = String(year) + String(month+1) + String(date);
				var td = new $("<td></td>");
				
				if(h.check[key] == true){
					td.html("o");
					td.attr("class", "bg-red");
				}
				else{
					td.html("x");
					td.attr("class", "bg-silver");
				}
				td.css("text-align", "center");
				td.css("vertical-align", "center");
				
				tr.append(td);
				
			}
			
			tbody.append(tr);
		}
			

		table.css("width", "100%");
		table.append(tbody);

		wrap.append(table);
		
		var tds = $("#table1 tbody td");
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth();
				
		for(var i in habits.list){
			for(var date=firstDay.getDate(); date<=endDay.getDate(); date++){		
				var h = habits.list[i];
				var index = date-1 + i*(endDay.getDate());
				var key = String(year) + String(month+1) + String(date);
				$(tds[ index ]).attr("onclick", "habits.list["+i+"]"+".toggleFromKey("+key+");\
												go("+firstDay.getTime()+");\
												console.log("+index+");");
			}
		}
	}
	
	
	
	function navBar(wrap){
		var nowDisplayDay = new Date(firstDay);
		var prevMonth = new Date(nowDisplayDay);
		var nextMonth = new Date(nowDisplayDay);
		prevMonth.setMonth( nowDisplayDay.getMonth()-1 );
		nextMonth.setMonth( nowDisplayDay.getMonth()+1 );
		var nav = {
			span:[
				"<span class='fas fa-arrow-left'></span>"+monthName[ prevMonth.getMonth() ],
				monthName[ nowDisplayDay.getMonth() ],
				monthName[ nextMonth.getMonth() ]+"<span class='fas fa-arrow-right'></span>"
			],
			navFunc:[
				"go("+prevMonth.getTime()+")",
				"go("+nowDisplayDay.getTime()+")",
				"go("+nextMonth.getTime()+")"
			]
		}
		var div = $("<div style='text-align:center;'></div>");
		for(var i in nav.span){
			var a = $("<a href='#' class='btn btn-primary' onclick='"+nav.navFunc[i]+"'><span>"+nav.span[i]+"</span></a>");
			div.append(a);
		}
		wrap.append(div);	
	}
	
	
	function go(day){
		
		setDisplayMonth(new Date(day));
		
		var wrap = $("#wrapper");
		console.log(wrap);
		wrap.empty();
		navBar(wrap);
		display(wrap);
	}
	
	go(new Date());


