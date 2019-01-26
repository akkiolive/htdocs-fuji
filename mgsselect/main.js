(function(){
    var inp = document.getElementById("input");
    var label = document.getElementById("message");
    label.innerHTML = "none";

    var clicks = [];

    var notteru = 0;

    var b = ["kick", "hh", "snare", "hh"];
    inp.addEventListener("keydown", function(){ 
        clicks.push(Date.now());
        var len = clicks.length;
        if(len>=2){
            var bpm = 1.0/((clicks[len-1]-clicks[len-2])*0.001/60.0);
            label.innerHTML = bpm;
            playSound(b[(len-1)%4]);
        }
    }, false);

    var buffers = {};
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    function loadSound(url, name) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
            buffers[name] = buffer;
            console.log("loaded -> "+ url);
            }, null);
        }
        request.send(); 
    }

    function playSound(name, time=0) {
        var source = context.createBufferSource(); // creates a sound source
        source.buffer = buffers[name];                    // tell the source which sound to play
        source.connect(context.destination);       // connect the source to the context's destination (the speakers)
        source.start(time);                           // play the source now
                                                   // note: on older systems, may have to use deprecated noteOn(time);
    }

    loadSound("./wav/kick.wav", "kick");
    loadSound("./wav/snare.wav", "snare");
    loadSound("./wav/hh.wav", "hh");
    loadSound("./wav/loop.wav", "loop");
    loadSound("./wav/GUN_FIRE-GoodSoundForYou-820112263.wav", "fire1");
    loadSound("./wav/M1 Garand Single-SoundBible.com-1941178963.wav", "fire2");
    loadSound("./wav/M4A1_Single-Kibblesbob-8540445.wav", "fire3");
    loadSound("./wav/Eject Clip And Re-Load-SoundBible.com-423238371.wav", "reload");
    loadSound("./audio/select1.wav", "select1");
    loadSound("./audio/select2.wav", "select2");
    loadSound("./audio/select3.wav", "select3");
    
    var canvas = document.getElementById("stage");
    var ctx = canvas.getContext('2d');

    var width = 800;
    var height = 600;
    canvas.height = height;
    canvas.width = width;


    class Item{
        constructor(name="name"){
            this.name = name;
            this.type = "weapon";
            this.ammoFull = (Math.floor(Math.random()*10000)%9+1)*10;
            this.ammoMag = Math.floor((this.ammoFull-1)*Math.random()+1);
            //if(this.ammoMag>=40)this.ammoMag = 40;
            this.ammoInMag = Math.floor(this.ammoMag*Math.random());
            this.ammo = this.ammoInMag+Math.floor((this.ammoFull - this.ammoInMag)*Math.random());
            this.reloading = 0;
            this.x = width*0.01;
            this.y = height*0.69;
//            this.drawWidth = width*0.35;
            this.drawWidth = width*0.3;
            this.drawHeight = height*0.3;
            this.drawMargin = 10;
            this.col = 0;
            this.row = 0;
        }

        drawItem(){
            //var x = this.x;
            //var y = this.y;
            var x = this.drawMargin + (this.drawMargin+this.drawWidth)*this.col;
            var y = height-this.drawHeight-(this.drawMargin+(this.drawMargin+this.drawHeight)*this.row);
            var drawWidth = this.drawWidth;
            var drawHeight = this.drawHeight;
            {
                ctx.beginPath();
                ctx.rect(x, y, drawWidth, drawHeight);
                ctx.stroke();
            }
            {
                ctx.beginPath();
                ctx.fillText(this.name, x+drawWidth*0.01, y+drawHeight*0.1);
                ctx.fillText(this.ammoInMag +"/"+ this.ammo + " / " + this.ammoFull, x+drawWidth*0.01, y+drawHeight*0.6);
            }
            {
                for(var i=0; i<this.ammoMag; i++){
                    ctx.beginPath();
                    ctx.rect(-drawWidth*0.025+x+drawWidth-(drawWidth*i/this.ammoMag), y+drawHeight*0.7, drawWidth*0.02, drawHeight*0.2);
                    if(i<this.ammoInMag) ctx.fill();
                    ctx.stroke();
                }
            }
        }

        shot(){
            if(this.ammoInMag==0){
                if(!this.reloading && this.ammo>0) this.reload();
                return;
            }
            playSound("fire"+(Math.floor(Math.random()*12412)%2+1));
            if(this.ammoInMag > 0) this.ammoInMag -= 1;
            if(this.ammo > 0) this.ammo -= 1;
            draw();
        }

        reload(){
            this.reloading = 1;
            playSound("reload");
            setTimeout(this.reload_exact(this), 2000); //TODO no work timeout and reload instantly
        }

        reload_exact(item){
            console.log(item.ammo);
            console.log("reloaded");
            if(item.ammo >= item.ammoMag) item.ammoInMag = item.ammoMag;
            else item.ammoInMag = item.ammo;
            draw();
            console.log(item.ammo);
            item.reloading = 0;
        }
    }

    var m4 = new Item("M4 CUSTOM");
    var ak = new Item("AK-107");
    var p90 = new Item("P90");
    var mk2 = new Item("Mk2 Pistol");
    var gsr = new Item("GSR");
    var aek = new Item("AEK-971");
    m4.drawItem(width*0.01, height*0.59);

    document.addEventListener("keyup", function(e){
        if(e.keyCode==69){
            playSound("select3");
            sels.selecting = 0;
        }
    }, false);

    document.addEventListener("keydown", function(e){
        var len = sels.list.length;
        //e.preventDefault();
        //console.log(Math.floor(Math.random()*12412)%3+1);
        console.log(e.keyCode);
        if(e.keyCode==32) { //space key
            sels.list[sels.selectItemIndex].shot();
        }
        if(e.keyCode==69){ // e key
            if(!sels.selecting) playSound("select1");
            sels.selecting = 1;
        }
        if(sels.selecting){
            if(e.keyCode>=37 && e.keyCode<=40){
                playSound("select2");
            }
            if(e.keyCode==37){ //left key
                sels.selectItemIndex++;
                sels.selectItemIndex = sels.selectItemIndex%len;
                console.log(sels.list[sels.selectItemIndex].name);
            }
            if(e.keyCode==38){ //up key
                
            }
            if(e.keyCode==39){ //right key
                sels.selectItemIndex--;
                if(sels.selectItemIndex<0) sels.selectItemIndex = len-1;
                console.log(sels.list[sels.selectItemIndex].name);
            }
            if(e.keyCode==40){ //down key

            }
        }
        draw();
    },false);

    class Sels{
        constructor(){
            this.list = [];
            this.itemWidth = width*0.4;
            this.itemHeight = height*0.3;
            this.itemMargin = (width+height)/2.0*0.3;
            this.selecting = 0;
            this.selectItemIndex = 0;
        }

        contruct(){
            var len = this.list.length;     
            var si = this.selectItemIndex;       
            /*
            this.list[si].col = 0;
            this.list[si].row = 0;
            for(var i=0; i<si; i++){
                var col = 0;
                var row = 0;
                //upper
                if(i%2==0){
                    row = i/2;
                }
                //yoko
                else {
                    col = (i-1)/2+1;
                }
                ii = ;

                this.list[ii].col = col;
                this.list[ii].row = row;
                if(col!=0 || row!=0) this.list[ii].drawItem();
            }
            */
            
            
            for(var i=si; i<=si+2; i++){
                var col = i-si;
                var row = 0;
                var ii = i%len;
                this.list[ii].col = col;
                this.list[ii].row = row;
                if(col!=0 || row!=0) this.list[ii].drawItem();
            }
            for(var i=si; i>=si-2; i--){
                var col = 0;
                var row = si-i;
                var ii = i;
                if(ii<0) ii=len+ii;
                this.list[ii].col = col;
                this.list[ii].row = row;
                if(col!=0 || row!=0) this.list[ii].drawItem();
            }
        }
    }

    var sels = new Sels();
    sels.list = [m4, ak, p90, mk2, gsr, aek];

    function draw(){
        ctx.clearRect(0, 0, width, height);
        sels.list[sels.selectItemIndex].drawItem();
        if(sels.selecting) sels.contruct();
    }

    setInterval(draw, 10);

})();