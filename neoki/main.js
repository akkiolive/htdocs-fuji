(function(){
    class Sleep{
        constructor(date, time, isSleep, moment=null){
            this.date = date;
            this.time = time;
            this.isSleep = isSleep;
            this.id = undefined;
            this.moment = moment;
        }
    }

    class Sleeps{
        constructor(){
            this.list = [];
            this.num = 0;
        }

        add(sleep){
            sleep.id = this.num;
            this.list.push(sleep);
            this.num++;
        }

        remove(id){
            for(var i in this.list){
                if(id == this.list[i].id){
                    this.list.splice(i, 1);
                    console.log(id + "was deleted.");
                    break;
                }
            }
        }
    }

    var sleeps = new Sleeps();

    $("#datepicker").datepicker();
    $("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd (D)");
    $("#timepicker").timepicker();
    $("#timepicker").timepicker({
        "timeFormat":"H:i",
        "scrollDefault": "now"
    });

    var addButtonVisible = 0;
    $("#addButton").click(function(){
        if(!addButtonVisible){
            $("#datepicker").datepicker("setDate", new Date());
            $("#timepicker").timepicker("setTime", new Date());
            $("#addButton-icon").attr("class", "fa fa-times");
            $("#addButton-icon").html("記録画面を閉じる");    
            $("#addField").css("display", "block");
            addButtonVisible = 1;
        }
        else{
            $("#addButton-icon").attr("class", "fa fa-plus");
            $("#addButton-icon").html("記録する");
            $("#addField").css("display", "none");
            addButtonVisible = 0;
        }

    });


    function addSleep(isSleep){
        var date = document.getElementById("datepicker").value;
        var time = document.getElementById("timepicker").value;
        var m = new Date(date + " " + time);
        sleeps.add(new Sleep(date, time, isSleep, m));
        putJSON();
        makeView();
    }

    $("#addSleep").click(function(){
        addSleep(1);
    });

    $("#addWake").click(function(){
        addSleep(0);
    });


    function getJSON(){
        $.ajax({
            url: 'php/get.php',
            type: 'post', // getかpostを指定(デフォルトは前者)
            dataType: 'json', // 「json」を指定するとresponseがJSONとしてパースされたオブジェクトになる
            data: { // 送信データを指定(getの場合は自動的にurlの後ろにクエリとして付加される)
            },
        })
        // ・ステータスコードは正常で、dataTypeで定義したようにパース出来たとき
        .done(function (response) {
            console.log(response);
            sleeps = new Sleeps();
            for(var i in response.list){
                sleeps.add(response.list[i]);
            }
        })
        // ・サーバからステータスコード400以上が返ってきたとき
        // ・ステータスコードは正常だが、dataTypeで定義したようにパース出来なかったとき
        // ・通信に失敗したとき
        .fail(function () {
            console.log("failed");
        });
    }
    
    function putJSON(){
        var sleeps_json = JSON.stringify(sleeps);
        $.ajax({
            url: 'php/put.php',
            type: 'post', // getかpostを指定(デフォルトは前者)
            dataType: 'text', // 「json」を指定するとresponseがJSONとしてパースされたオブジェクトになる
            data: { // 送信データを指定(getの場合は自動的にurlの後ろにクエリとして付加される)
                "json": sleeps_json
            },
        })
        // ・ステータスコードは正常で、dataTypeで定義したようにパース出来たとき
        .done(function (response) {
            console.log(response);
        })
        // ・サーバからステータスコード400以上が返ってきたとき
        // ・ステータスコードは正常だが、dataTypeで定義したようにパース出来なかったとき
        // ・通信に失敗したとき
        .fail(function () {
            console.log("failed");
        });
    }

    //putJSON();
    getJSON();



    function makeView(){
        $("#view").empty();
        var today = new Date();
        for(var i=0; i<31; i++){
            var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
            var text = date.getFullYear()+"-"+[date.getMonth()+1]+"-"+date.getDate()+" ("+day[date.getDay()]+")";
            $("#view").append("<div class='box'>"+text+"</div>");
        }
        for(var i in sleeps.list){
            var s = sleeps.list[i];
            $("#view").append(s.date+"<br>");
        }
    }

    makeView();


    var ctx = document.getElementById("mainChart").getContext("2d");
    var chart = new Chart(ctx,{
        type: "line",
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My chart!",
                backgroundColor: "rgb(255, 99, 132)",
                border: "rgb(12, 12, 12)",
                data: [0,1,2,3,23,4,5,6,3,2,1]
            }]
        },
        options: {}
    });

    var scatterChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
            {

                label: 'Scatter Dataset',
                backgroundColor: "rgba(246,156,85,1)",
                borderColor: "rgba(246,156,85,1)",
                fill: false,
                borderWidth : 15,
                pointRadius : 3,
                data: [
                    {
                        x: new Date(1993, 2, 4),
                        y: 9
                    }, {
                        x: new Date(1993, 2, 5),
                        y: 9
                    }
                ]
            }],
        },
        options: {
            legend : {
                display : false
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks : {
                        beginAtzero :true,
                        stepSize : 1
                    }
                }],
                yAxes : [{
                    scaleLabel : {
                        display : false
                    },
                    ticks : {
                        beginAtZero :true,
                        max : 10
                    }
                }]
            }
        }
    });

})();