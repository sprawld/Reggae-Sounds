$(function() {
	
	var sound_options = [1,2,2,1,2,2,2,3,2,2,2,3];
$('#loading').text('Loading audio...').fadeIn();
	var sounds = $.getJSON('sound.json',function(data) {
	
$('#loading').fadeOut(function() {
	if($('#loading').length) $('#loading').text('Converting audio...').fadeIn();
});

var myAudioContext, mySource, myBuffer = [];
if ('AudioContext' in window) {
myAudioContext = new AudioContext();
} else if ('webkitAudioContext' in window) {
myAudioContext = new webkitAudioContext();
} else {
alert('Your browser does not support yet Web Audio API');
}
function play (x,y) {
mySource = myAudioContext.createBufferSource();
mySource.buffer = myBuffer[x][y];
mySource.connect(myAudioContext.destination);
if ('AudioContext' in window) mySource.start(0);
else if ('webkitAudioContext' in window) mySource.noteOn(0);
}

function decodeBase64ToArrayBuffer(base64str) {
    var l = (base64str.length/4) * 3,
        s = atob(base64str),
        a = new ArrayBuffer(l),
        b = new Uint8Array(a);
	for(var i=0;i<l;i++) b[i] = s.charCodeAt(i);
	return a;
}


var load = function (x,y) {
var arrayBuff = decodeBase64ToArrayBuffer(data[x][y]);
myAudioContext.decodeAudioData(arrayBuff, function(audioData) {
myBuffer[x][y] = audioData;
addSound();
});
};	

for(var i=0;i<12;i++) {
	myBuffer[i] = new Array(sound_options[i]);
	for(var j=0;j<sound_options[i];j++) {
		load(i,j);
	}
}

var soundCount = 0;
function addSound() {
	soundCount++;
	$('#progress').css('width',(soundCount*2)+'%');
	if(soundCount == 24) loadFaces();
}

function loadFaces() {
	$('#loading').fadeOut(function() { $('#loading').remove() });
	$('#progress').fadeOut(function() { $('#progress').remove() });
	var html = [], audio = [];
	for(var i=0;i<12;i++) {
		html.push('<img src="img/f'+parseInt(Math.random()*20+1)+'.png" id="pic'+i+'">');
	}
	$('body').prepend(html);
	$('img').on('click',function() {
		var num = parseInt($(this).attr('id').replace(/^pic/,''));
		
		var img = $(this);
		if(num != 6) {
			var src = img.attr('src');
			var newSrc = src;
			while(newSrc==src) newSrc = 'img/f'+parseInt(Math.random()*20+1)+'.png';
			img.attr('src',newSrc);
		} else {
			img.removeClass('spin');
			var offset = img.offset();
			img.addClass('spin');
		}
		
		var type = parseInt(Math.random()*sound_options[num]);
		play(num,type);
	});
}

});
	
});
