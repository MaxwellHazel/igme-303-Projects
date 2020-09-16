"use strict";
(function () {
	
	let ctx;
	let canvas;
	const canvasWidth = 800, canvasHeight = 600;
	let x = .01, y = 0, z = 0;
	let a, b, c;
	//let dt=;
	let scale;
	let counter = 0;
	let paused = false;
	window.onload = init;
	function init(){
	canvas = document.querySelector('canvas');
	  ctx = canvas.getContext("2d");
	  canvas.width = canvasWidth;
	  canvas.height = canvasHeight;
	  ctx.fillRect(0,0,canvasWidth,canvasHeight);
	  setupUI();
	  loop();
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
		console.log(x,y,z);
		ctx.save();
		ctx.translate(canvasWidth/2, canvasHeight/2);
		ctx.fillStyle = `rgb(${255 - value},${255 - value},${value})`;
		//ctx.fillStyle = `hsl(${counter},100%,50%)`;
		ctx.fillRect(x * scale,y * scale,2,2);
		ctx.restore();
		
	}
	
	function setupUI(){
			scale = document.querySelector("#chooserScale").value;
			a = document.querySelector("#chooserA").value;
			b = document.querySelector("#chooserB").value;
			c = document.querySelector("#chooserC").value;
			/*document.querySelector("#rectanglesCB").onchange = function(e){
				console.log(e);
				createRectangles = e.target.checked;
			};
			document.querySelector("#circlesCB").onchange = function(e){
				console.log(e);
				createCircles = e.target.checked;
			};
			document.querySelector("#linesCB").onchange = function(e){
				console.log(e);
				createLines = e.target.checked;
			};
			document.querySelector("#ringsCB").onchange = function(e){
				console.log(e);
				createRings = e.target.checked;
			};*/
			
			document.querySelector("#playButton").onclick = function(e){
				console.log(e);
				if(paused){  //In the original code, playButton called update() every time it was clicked.
					paused = false;  //This if statement makes it so update() is only called when the screensaver is being unpaused.
					loop();
				}
			};
			
			document.querySelector("#pauseButton").onclick = function(e){
				console.log(e);
				paused = true;
			};
			
			document.querySelector("#chooserScale").onchange = function(e){
				scale = e.target.value;
				//updateInfo();
			}
			document.querySelector("#chooserA").onchange = function(e){
				a = e.target.value;
				//updateInfo();
			}
			document.querySelector("#chooserB").onchange = function(e){
				b = e.target.value;
				//updateInfo();
			}
			document.querySelector("#chooserC").onchange = function(e){
				c = e.target.value;
				//updateInfo();
			}
			document.querySelector("#btnExport").onclick = doExport;
			
			//canvas.onclick = canvasClicked;
		}
		
		function doExport(){
			// https://www.w3schools.com/jsref/met_win_open.asp
			const data = canvas.toDataURL(); 
			const newWindow = window.open();
			newWindow.document.write('<iframe src="' + data  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
		}
	
})();