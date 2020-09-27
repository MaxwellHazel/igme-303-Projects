"use strict"
console.log("loaded");
(function () {
	const drawParams = Object.freeze({
			"minRectSpan" : 0.5,
			"maxRectSpan" : 100,
			"minStrokeWidth" : 0,
			"maxStrokeWidth" : 10
	});
		
	function drawRect(ctx, x, y, width, height, lineWidth=0, fill="black", stroke="black", alpha=1){
		ctx.save();                 // A - save the drawing state attributes and CTM
		if(lineWidth >drawParams.minStrokeWidth){
			ctx.lineWidth = lineWidth;       // B
			ctx.strokeStyle = stroke;    // B - optionally, change the values of one or more drawing state attributes
			ctx.fillStyle = fill;   // B
		}
		ctx.beginPath();            // C - describe a path
		ctx.rect(x, y, width,height); // C - x,y,width,height
		ctx.closePath();            // C
		ctx.fill();                 // D - swap the order of stroke() and fill() to see what happens to the drawing
		ctx.stroke();               // D - draw! i.e. make the path visible
		ctx.restore();              // E - restore the saved values of drawing state attributes and CTM
	}
	function drawCircle(ctx, x, y, radius, lineWidth=0, fill="black", stroke="black", alpha=1){
		ctx.save();
		ctx.beginPath(); 
		if(lineWidth >drawParams.minStrokeWidth){
			ctx.lineWidth = lineWidth;       // B
			ctx.strokeStyle = stroke;    // B - optionally, change the values of one or more drawing state attributes
			ctx.fillStyle = fill;   // B
		}
		ctx.arc(x, y, radius, 0, Math.PI * 2, false); // draws a circle at "x, y" with a "radius"-pixel radius
		ctx.closePath();
		ctx.globalAlpha = alpha;
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	}
		
	function drawRing(ctx, x, y, innerRadius, outerRadius, lineWidth=0, fill="black", stroke="black", alpha=1){
		ctx.save();
		if(lineWidth >drawParams.minStrokeWidth){
			ctx.lineWidth = lineWidth;       // B
			ctx.strokeStyle = stroke;    // B - optionally, change the values of one or more drawing state attributes
			ctx.fillStyle = fill;   // B
		}
		ctx.beginPath(); 
		ctx.arc(x, y, outerRadius, 0, Math.PI * 2, false); // draws a circle at "x,y" with a "radius"-pixel radius
		ctx.arc(x, y, innerRadius, 0, Math.PI * 2, true);  // punches out the center of the circle
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();			
	}
		
	function drawLine(ctx, x, y, endpointX, endpointY, lineWidth=0, stroke="black", alpha=1){
		ctx.save();
		if(lineWidth >drawParams.minStrokeWidth){
			ctx.lineWidth = lineWidth;       // B
			ctx.strokeStyle = stroke;    // B - optionally, change the values of one or more drawing state attributes
			//ctx.fillStyle = fill;   // B
		}
		ctx.beginPath(); 
		ctx.moveTo(x, y);  // start the "pen" at x, y 
		ctx.lineTo(endpointX, endpointY); // draw line to endpointX, endpointY
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}
		
	function drawTriangle(ctx, x, y, width, height, lineWidth=0, fill="black", stroke="black", alpha=1){
		ctx.save();
		if(lineWidth >drawParams.minStrokeWidth){
			ctx.lineWidth = lineWidth;       // B
			ctx.strokeStyle = stroke;    // B - optionally, change the values of one or more drawing state attributes
			ctx.fillStyle = fill;   // B
		}
		ctx.beginPath(); 
		ctx.moveTo(x, y);  	// start the "pen" at x, y 
		ctx.lineTo(x+width, y); 	// point #1 -> draw line to x+width, y
		ctx.lineTo(x+(width/2), y+height);	// point #2 -> draw line to x+(width/2), y+height
		ctx.closePath(); 	// the path will automatically close back to point #1
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	}
		
	function drawGradient() {
        var grad = ctx.createLinearGradient(10, 0, 80, 0);
        grad.addColorStop(0, 'black');
        grad.addColorStop(1, 'white');
        ctx.fillStyle = grad;
        ctx.fillRect(10, 10, 100, 100);
    }
		
	function drawGradients(ctx){//, x, y, width, height, alpha=1) {
		var grad = ctx.createLinearGradient(10, 0, 390, 0);
		grad.addColorStop(0, 'red');
		grad.addColorStop(1 / 6, 'orange');
		grad.addColorStop(2 / 6, 'yellow');
		grad.addColorStop(3 / 6, 'green')
		grad.addColorStop(4 / 6, 'aqua');
		grad.addColorStop(5 / 6, 'blue');
		grad.addColorStop(1, 'purple');
		ctx.fillStyle = grad;
		//ctx.fillRect(x, y, width, height);
	}
		
	//random functions
	function randomRect(ctx, x=getRandomInt(0, canvasWidth), y=getRandomInt(0, canvasHeight)){
		drawRect(ctx, x, y, getRandomInt(drawParams.minRectSpan, drawParams.maxRectSpan),getRandomInt(drawParams.minRectSpan, drawParams.maxRectSpan), getRandomInt(0, drawParams.maxStrokeWidth), getRandomColor(), getRandomColor());
	}
	function randomCircle(ctx){
		drawCircle(ctx, getRandomInt(0, ctx.canvas.width), getRandomInt(0, ctx.canvas.height), getRandomInt(drawParams.minRectSpan, drawParams.maxRectSpan), getRandomInt(drawParams.maxStrokeWidth, drawParams.maxStrokeWidth), getRandomColor(), getRandomColor());
	}
	function randomRing(ctx){
		let outerRadius = getRandomInt(15,125);  //outerRadius is called separately to ensure that the outerRadius is larger than the innerRadius
		drawRing(ctx, getRandomInt(0, ctx.canvas.width), getRandomInt(0, ctx.canvas.height), outerRadius-getRandomInt(0, 15), outerRadius, getRandomInt(drawParams.maxStrokeWidth, drawParams.maxStrokeWidth), getRandomColor(), getRandomColor())
	}
	function randomLine(ctx){
		drawLine(ctx, getRandomInt(0, ctx.canvas.width),getRandomInt(0, ctx.canvas.height), getRandomInt(0, ctx.canvas.width),getRandomInt(0, ctx.canvas.height), getRandomInt(drawParams.maxStrokeWidth, drawParams.maxStrokeWidth), getRandomColor(), getRandomColor())
	}
	function canvasClicked(e){
		let rect = e.target.getBoundingClientRect();
		let mouseX = e.clientX - rect.x;
		let mouseY = e.clientY - rect.y;
		console.log(mouseX,mouseY);
		//randomRect(ctx, mouseX, mouseY);
	}
	// handy helper functions!
	function getRandomColor(){
		function getByte(){
			return 55 + Math.round(Math.random() * 200);
		}
		return "rgba(" + getByte() + "," + getByte() + "," + getByte() + ",.8)";
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	/*function getMousePos(parentElement,event) {
		var rect = parentElement.getBoundingClientRect();
		return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
		};
	}*/
		
	
	//window.mhLIB = {drawRect, drawCircle, drawRing, drawLine, drawTriangle, drawGradient, drawGradients, randomRect, randomCircle, randomRing, randomLine, getRandomColor, getRandomInt};
	if(window){
		window["mhLIB"] = {drawRect, drawCircle, drawRing, drawLine, drawTriangle, drawGradient, drawGradients, randomRect, randomCircle, randomRing, randomLine, getRandomColor, getRandomInt, canvasClicked};
	}else{
		throw "'window' is not defined";
	};
})();