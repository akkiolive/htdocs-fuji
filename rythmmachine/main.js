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

})();