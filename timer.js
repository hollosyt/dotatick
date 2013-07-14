

var currTimer;
var originalStart;
var rune;
var bell;
var fanfare;
var mainTimer;
var roshTimer;
var aegisTimer;

var preGameTimer;
var roar;
var isPreGame = true;


var startPreGameTimer = function(val)
{
pregame = new moment();
isPreGame=true;
pregame.add('minutes',$('#resetMin').val());
pregame.add('seconds',$('#resetSec').val());
originalStart = pregame;
mainTimer = $('#timer').tinyTimer({ to: pregame.toDate(), 
						onEnd: startPostGameTimer
					}).data("tinyTimer");;
}

var startPostGameTimer = function(val)
{
	resetMainTimer();
	startTimer();
}

var startTimer = function(val)
{
isPreGame = false;
originalStart = new moment();
mainTimer = $('#timer').tinyTimer({ from: originalStart.toDate(), 
						onTick: tick
					}).data("tinyTimer");;
};

var tick = function(val)
{
	

	if(val.S % 120 == 0 && $('#playRune:checked').val())
	{
		if(rune) rune.play();
	}

	if(val.s == $('#stackSec').val()  && $('#playStackPull:checked').val())
	{
		if(bell) bell.play();
	}
};

var resetMainTimer = function()
{
	if(mainTimer)
	{
		mainTimer.options.onTick = function(){};
		clearInterval(mainTimer.interval);

	    mainTimer.stop();
		$('#timer').remove();
		$('#timerContainer').prepend('<span id="timer"></span>');
		mainTimer = null;
	}
}

var aegisReclaim = function(val)
{
	fanfare.play();
}
var roshRespawn = function(val)
{
	
	roar.play();
}


$(function(){

soundManager.setup({
  // optional: ignore Flash where possible, use 100% HTML5 mode
  preferFlash: true,
  volume:75,
 // debugFlash:true,
  url: 'swf/',
  onready: function() {
     SC.initialize({client_id: "3198a4c8b57de73aa18ee2080e4d7dc6"});

SC.stream("/tracks/56310255", function(sound){ //Long bell
	bell = sound;
	bell.load();
});
SC.stream("/tracks/101038194", function(sound){ //roar
	roar = sound;
	roar.load();
});
SC.stream("/tracks/101038160", function(sound){ //short rune
	rune = sound;
	rune.load();
});

SC.stream("/tracks/101038184", function(sound){ //aegis fanfare
	fanfare = sound;
	fanfare.load();
});


  }
});


$('#runePlay').click(function(e){
e.preventDefault();
rune.play();
});


$('#stackPlay').click(function(e){
e.preventDefault();
bell.play();
});


$('#roshPlay').click(function(e){
e.preventDefault();
roar.play();
});


$('#aegisPlay').click(function(e){
e.preventDefault();
fanfare.play();
});


$('#volume').change(function(){


for(var i in soundManager.sounds) { 
soundManager.defaultOptions.volume = $('#volume').val(); 
soundManager.getSoundById(i).setVolume($('#volume').val()); 
} 

});


$('#lessTime').click(function(e){
	e.preventDefault();
		resetMainTimer();

var m = originalStart.add('milliseconds',500);
	
	if(isPreGame)
	{
		
		mainTimer = $('#timer').tinyTimer({ to: m.toDate(),
							onTick: tick
						}).data("tinyTimer");
	}
	else
	{
		var m = originalStart.add('milliseconds',500);
	
		mainTimer = $('#timer').tinyTimer({ from: m.toDate(),
							onTick: tick
						}).data("tinyTimer");
	}
});

$('#pausePlay').click(function(){

	if($('#pausePlay').val() == 'pause')
	{
		mainTimer.pause();
		$('#pausePlay').attr('value','play');
	}
	
	else if($('#pausePlay').val() == 'play')
	{
		mainTimer.resume();
		$('#pausePlay').attr('value','pause');
	}	
});

$('#moreTime').click(function(e){
	e.preventDefault();
		resetMainTimer();
	

	if(isPreGame)
	{
		var m = originalStart.add('milliseconds',-500);

		mainTimer = $('#timer').tinyTimer({ to: m.toDate(),
							onTick: tick
						}).data("tinyTimer");
	}
	else
	{
		var m = originalStart.add('milliseconds',-500);
		mainTimer = $('#timer').tinyTimer({ from: m.toDate(),
							onTick: tick
						}).data("tinyTimer");
	}
});

$('#resetButton').click(function(){
	resetMainTimer();
	startPreGameTimer();
});

$('#resetButtonAfter').click(function(){

//	if(!mainTimer) startTimer();

	resetMainTimer();
	isPreGame = false;
	var m = new moment();
	m.add('minutes',-1 * $('#resetMin').val());
	m.add('seconds',-1 * $('#resetSec').val());
	originalStart = m;
	
	mainTimer = $('#timer').tinyTimer({ from: m.toDate(),
							format: '%-H{:}%0m:%0s' ,
							onTick: tick
						}).data("tinyTimer");
	}
	);

$('#startRoshTimer').click(function(){

if(roshTimer)
{
	roshTimer.options.onTick = function(){};
	clearTimer(aegisTimer.interval);
	clearInterval(roshTimer.interval);
    roshTimer.stop();
    roshTimer = null;
    $('#roshTimer').remove();
    $('#aegisTimer').remove();
	$('#roshTimerContainer').prepend('<span id="roshTimer">00:00</span> , Aegis <span id="aegisTimer">0:00</span>');
}


	var m = new moment();
	m.add('minutes',10);
	m.add('seconds',-1 * $('#roshLag').val());



	var mA = new moment();
	mA.add('minutes',6);
	mA.add('seconds',-1 * $('#roshLag').val());


	
	roshTimer = $('#roshTimer').tinyTimer({ to: m.toDate(),
							format: '%-H{:}%0m:%0s' ,
							onEnd: roshRespawn
						}).data("tinyTimer");



	
	aegisTimer = $('#aegisTimer').tinyTimer({ to: mA.toDate(),
							format: '%-H{:}%0m:%0s' ,
							onEnd: aegisReclaim
						}).data("tinyTimer");

	});
});