/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData, data2;
var quarterBucket=0,halfBucket=0,threeQuarterBucket=0,lastQuarterBucket=0,averageLoudness=0,medianLoudness=0;

function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0.4,color:"blue"},{percent:.25,color:"green"},{percent:.5,color:"yellow"},{percent:.75,color:"red"},{percent:0.5,color:"magenta"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
	data2 = new Uint8Array(analyserNode.fftSize/2);
	analyserNode.getByteTimeDomainData(data2);
}

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	if(params.showGradient){
		// 2 - draw gradient
		ctx.save();
		ctx.fillStyle = gradient;
		ctx.globalAlpha = .3;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		ctx.restore();
	}else{
		// 3 - draw background
		ctx.save();
		ctx.fillStyle = "black";
		ctx.globalAlpha = 0.01;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		ctx.restore();
	}
	
	// 4 - draw bars
	let barSpacing = 4;
	let margin = 5;
	let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
	let barWidth = screenWidthForBars / audioData.length;
	let barHeight = 200;
	let topSpacing = 100;
	var quarterBucket=0,halfBucket=0,threeQuarterBucket=0,lastQuarterBucket=0,averageLoudness=0,medianLoudness=0;
	// loop through the data and draw!
	ctx.save();
	ctx.strokeStyle = 'rgba(0,0,0,0.50)';
	for(var i=0; i<audioData.length; i++) { 
		// the higher the amplitude of the sample (bin) the taller the bar
		// remember we have to draw our bars left-to-right and top-down
				
		// just draw every other bin
		if (params.showBars && i%2 == 0){
			// ramp the color left to right
			ctx.fillStyle = utils.makeColor(255 - i*4,128 + i*2,i*4,.04);
			//ctx.fillStyle = 'rgba(255,255,255,0.50)';
			ctx.fillRect(i * (barWidth + barSpacing),topSpacing + 256-audioData[i],barWidth,barHeight);
			ctx.strokeRect(margin + i * (barWidth + barSpacing),topSpacing + 256-audioData[i],barWidth,barHeight);
		}
		averageLoudness += audioData[i];
	}
	ctx.restore();
	
	// AGGREGATE THE FREQUENCY STATS
	averageLoudness /= audioData.length;
	averageLoudness /= 255;
	medianLoudness = audioData[audioData.length/2.0];
	medianLoudness /= audioData.length;
	
	// 5 - draw circles
	if(params.showCircles){
		let maxRadius = canvasHeight/4;
		ctx.save();
		ctx.globalAlpha = .5;
		for(let i=0; i < audioData.length; i++){
			let percent = audioData[i] / 255;
			let circleRadius = percent * maxRadius;
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(255, 111, 111, .34 - percent/3.0);
			ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent/10.0);
			ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent/5.0);
			ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * .50, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		ctx.restore();
	}
	// 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	let data = imageData.data;
	let length = data.length;
	let width = imageData.width; //not using here
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
	for (let i = 0; i < length; i += 4){
		// C) randomly change every 20th pixel to red
		if(params.showNoise && Math.random() < .05){
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i+1] = data[i+2] = 0;// zero out the red and green and blue channels
			//data[i] = 255;// make the red channel 100% red
			data[i] = 155;
			data[i+1] = 123;
			data[i+2] = 10;
		} // end if
		if(params.showInvert){
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			let red = data[i], green = data[i+1], blue = data[i+2];
			data[i] = 255 - red;// set red channel
			data[i+1] = 255 - green;// set green channel
			data[i+2] = 255 - blue;// set blue channel
			//data[i+3} is the alpha
		} // end if
	} // end for
	if(params.showEmboss){
		//stepping through each sub-pixel
		for (let i = 0; i < length; i ++){
			if(i%4 == 3) continue; //skip alpha channel
			data[i] = 127 + 2*data[i] - data[i+4] - data [i + width *4];
		}
	}
	// QUADRATIC CURVES
	var range = canvasHeight;
	if (params.showQuadratic){
		utils.drawQuadraticCurve(ctx,5,utils.makeColor(255,255,0,0.1),-20,canvasHeight-70,canvasWidth/2.0,range - range*averageLoudness*2,canvasWidth+20,canvasHeight-70);
		utils.drawQuadraticCurve(ctx,10,utils.makeColor(255,20,20,0.1),-50,canvasHeight-30,canvasWidth/2.0,range - range*medianLoudness*2,canvasWidth+50,canvasHeight-30);
	}
			
			
	// CUBIC BEZIER CURVES
	if (params.showCubicBezier){
		//utils.makeColor(153,50,204,0.15)
		ctx.globalAlpha = 0.15;
		utils.drawCubicBezierCurve(ctx,3,utils.getRandomColor(),0,canvasHeight,canvasWidth/2.0,range - range*averageLoudness*2,canvasWidth/2.0,range - range*medianLoudness*2,canvasWidth,canvasHeight);
		ctx.globalAlpha = 1.0;
	}
	// WAVEFORM
	if (params.showWaveform){
		utils.drawWaveform(ctx,data2);
	}
	// D) copy image data back to canvas
	ctx.putImageData(imageData, 0, 0);
}

export {setupCanvas,draw};