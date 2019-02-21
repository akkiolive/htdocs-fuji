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
	
var displayType = "month";

function setDisplayMonth(day, type){
	displayType = type;
	if(type==="month"){
		firstDay = new Date(day);
		firstDay = new Date( firstDay.setDate(1) );
		endDay = new Date(day);
		endDay = new Date( endDay.setMonth( endDay.getMonth() + 1) );
		endDay = new Date( endDay.setDate(0) );	
	}
	else if(type === "week"){
		firstDay = new Date(day);
		while(firstDay.getDay() != 0)
			firstDay.setDate( firstDay.getDate()-1 );
		endDay = new Date(day);
		while(endDay.getDay() != 6)
			endDay.setDate( endDay.getDate()+1 );
	}
	console.log(firstDay);
	console.log(endDay);

}

function isSameDate(day1, day2){
	var year1 = day1.getFullYear();
	var month1 = day1.getMonth();
	var date1 = day1.getDate();
	var year2 = day2.getFullYear();
	var month2 = day2.getMonth();
	var date2 = day2.getDate();
	
	if(year1==year2 && month1==month2 && date1==date2) return true;
	else return false;
	
}

function display(wrap){
	var table = $("<table class='table' id='table1'></table>");
	var thead = $("<thead></thead>");
	var tr = $("<tr></tr>");
	tr.class()
	thead.append(tr);
	
	var tmpDay = new Date(firstDay);
	tmpDay.setDate( firstDay.getDate()-1 );
	for(var date=firstDay.getDate(); ; date++){
		if(isSameDate(endDay, tmpDay)) break;
		tmpDay.setDate( tmpDay.getDate()+1 );
		
		var th = $("<th scope='col'>" + tmpDay.getDate() + "<br>(" + daysName[tmpDay.getDay()] + ")" + "</th>");
		if(tmpDay.getDay() == 0)
			th.addClass("red");
		else if(tmpDay.getDay() == 6)
			th.addClass("blue");
		else
			th.addClass("black");
		
		if(date==firstDay.getDate())
			tr.append( $("<th scope='col'>"+String(Number(firstDay.getMonth())+1)+"月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>") );
		
	
		tr.append(th);
		
		table.append(thead);
	}
	
	var tbody = $("<tbody></tbody>");
	
	for(var h of habits.list){
		var tr = $("<tr></tr>");
		var th = $("<th scope='row'>" + h.name + "</th>");
		tr.append(th);
		
		var today = new Date(firstDay);
		var year = today.getFullYear();
		var month = today.getMonth();
		
		
		var tmpDay = new Date(firstDay);
		tmpDay.setDate( firstDay.getDate()-1 );
			
		for(var date=firstDay.getDate(); ; date++){
			if(isSameDate(endDay, tmpDay)) break;
			tmpDay.setDate( tmpDay.getDate()+1 );
			
			var key = String(year) + String(month+1) + String(date);
			var td = new $("<td></td>");
			
			if(h.check[key] == true){
				td.html("o");
				td.addClass("bg-red");
			}
			else{
				td.html("x");
				td.addClass("bg-silver");
			}
			
			tr.append(td);
			
		}
		
		tbody.append(tr);
	}
		

	
	table.append(tbody);

	wrap.append(table);
	
	var tds = $("#table1 tbody td");
	var today = new Date(firstDay);
	var year = today.getFullYear();
	var month = today.getMonth();
	//console.log(tds);
	for(var i in habits.list){
		var tmpDay = new Date(firstDay);
		tmpDay.setDate( tmpDay.getDate()-1 );
		for(var date=0; ; date++){
			if(isSameDate(endDay, tmpDay)) break;
			tmpDay.setDate( tmpDay.getDate()+1 );
			var h = habits.list[i];
			var index = date + i*(endDay.getDate()-firstDay.getDate()+1);
			var key = String(year) + String(month+1) + String(date+firstDay.getDate());
			$(tds[ index ]).attr("onclick", "habits.list["+i+"]"+".toggleFromKey("+key+");\
											go("+firstDay.getTime()+");");
		}
	}
}



function navBar(wrap){
	var nowDisplayDay = new Date(firstDay);
	var prevMonth = new Date(nowDisplayDay);
	var nextMonth = new Date(nowDisplayDay);
	prevMonth.setMonth( nowDisplayDay.getMonth()-1 );
	nextMonth.setMonth( nowDisplayDay.getMonth()+1 );
	var prevWeek = new Date(nowDisplayDay);
	var nextWeek = new Date(nowDisplayDay);
	prevWeek.setDate( nowDisplayDay.getDate()-7 );
	nextWeek.setDate( nowDisplayDay.getDate()+7 );
	var nav = {
		span:[
			"<span class='fas fa-arrow-left'></span>"+monthName[ prevMonth.getMonth() ],
			monthName[ nowDisplayDay.getMonth() ],
			monthName[ nextMonth.getMonth() ]+"<span class='fas fa-arrow-right'></span>",
			"<span class='fas fa-arrow-left'></span>Prev week",
			"This week",
			"Next week<span class='fas fa-arrow-right'></span>",
		],
		navFunc:[
			"go("+prevMonth.getTime()+", \"month\")",
			"go("+nowDisplayDay.getTime()+", \"month\")",
			"go("+nextMonth.getTime()+", \"month\")",
			"go("+prevWeek.getTime()+", \"week\")",
			"go("+Date.now()+", \"week\")",
			"go("+nextWeek.getTime()+", \"week\")"
		]
	}
	var div = $("<div style='text-align:center;'></div>");
	var div2 = $("<div style='text-align:center;'></div>");
	for(var i in nav.span){
		var a = $("<a href='#' class='btn btn-primary' onclick='"+nav.navFunc[i]+"'><span>"+nav.span[i]+"</span></a>");
		if(i<3) div.append(a);
		else div2.append(a);
	}
	wrap.append(div);	
	wrap.append(div2);	
}


function go(day, type=displayType){
	
	setDisplayMonth(new Date(day), type);
	
	var wrap = $("#wrapper");
	wrap.empty();
	navBar(wrap);
	display(wrap);
}

go(new Date(), displayType);


