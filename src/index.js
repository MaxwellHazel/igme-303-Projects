"use strict";
(function () {
	
	let ctx;
	let canvas;
	const canvasWidth = 800, canvasHeight = 600;
	let x = .01, y = 0, z = 0;
	let a = 10, b = 28, c = 8/3;
	let scale = 10;
	let counter = 0;
	let paused = false;
	let createRectangles = true;
	let createCircles = false;
	let createRings = false;
	let createGradient = false;
	let currentTool = "0";
	let fillStyle=null;
	let strokeStyle=null;
	let color = false;
	let pauseButton;
	let playButton;
	window.onload = init;
	function init(){
		canvas = document.querySelector('canvas');
		ctx = canvas.getContext("2d");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		pauseButton = document.querySelector("#pauseButton");
		playButton = document.querySelector("#playButton");
		setupUI();
		loop();
	}
	function setupUI(){
		document.querySelector("#playButton").onclick = function(e){
			console.log(e);
			if(paused){  //In the original code, playButton called update() every time it was clicked.
				paused = false;  //This if statement makes it so update() is only called when the screensaver is being unpaused.
				//pauseButton.background-color = "#007bff";
				//e.target.background-color = #507bff;
				loop();
			}
		}
			
		document.querySelector("#pauseButton").onclick = function(e){
			console.log(e);
			paused = true;
			//playButton.background-color = "#007bff";
			//e.target.background-color = "#507bff";
		}
			
		document.querySelector("#chooserScale").onchange = function(e){
			scale = e.target.value;
		}
		document.querySelector("#chooserA").onchange = function(e){
			a = e.target.value;
		}
		document.querySelector("#chooserB").onchange = function(e){
			b = e.target.value;
		}
		document.querySelector("#chooserShape").onchange = function(e){
			currentTool = e.target.value;
		}
		document.querySelector("#colorCB").onchange = function(e){
			color = e.target.checked;
		}
		document.querySelector("#btnExport").onclick = doExport;
		//<span><input id="btnClear" type="button" value="Clear"/></span>
		/*//paused = true;
		document.querySelector("#btnClear").onclick = cls(ctx);
		//paused = false;*/
	}
		
	function loop(){
		if(paused){
			return;
		}
		requestAnimationFrame(loop);
		counter += .05;
		if (counter > 360) counter = 360;
		let dt = .01;
		let dx = dt * (a * (y - x));
		let dy = dt * (x * (b - z) - y);
		let dz = dt * (x * y - c * z);
		
		x = x + dx;
		y = y + dy;
		z = z + dz;
		let value = 255 - (z * scale);
		//console.log(dx,dy,dz);
		console.log(x,y,z);
		ctx.save();
		ctx.translate(canvasWidth/2, canvasHeight/2);
		if(color){
			mhLIB.drawGradients(ctx);
			//ctx.fillStyle = `hsl(${counter},100%,50%)`;
		}else{
			ctx.fillStyle = `rgb(${155 - value},${value},${255 - value})`;
		}
		switch(currentTool){
			case "0":
				mhLIB.drawRect(ctx, x * scale, y * scale, 4, 4, 1, ctx.fillStyle, ctx.fillStyle);
				break;
			case "1":
				mhLIB.drawCircle(ctx, x * scale, y * scale, 6, 1, ctx.fillStyle, ctx.fillStyle);
				break;
			case "2":
				mhLIB.drawRing(ctx, x * scale, y * scale, 5, 10, 2, ctx.fillStyle, ctx.fillStyle);
				break;
			default:
				break;
		}
		ctx.restore();
	}
		
	/*function cls(ctx){
		//setTimeout(function(){cls(ctx);},5000);
		if(paused == false){
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		}
	}*/
	function doExport(){
		// https://www.w3schools.com/jsref/met_win_open.asp
		const data = canvas.toDataURL(); 
		const newWindow = window.open();
		newWindow.document.write('<iframe src="' + data  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
	}
})();