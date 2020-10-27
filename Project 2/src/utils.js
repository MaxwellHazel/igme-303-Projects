// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
  return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

/*function makeColor(red, green, blue, alpha){
	var color='rgba('+red+','+green+','+blue+', '+alpha+')';
	return color;
}*/

const getRandomColor = () => {
	const floor = 35; // so that colors are not too bright or too dark 
  const getByte = () => getRandom(floor,255-floor);
  return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
  let lg = ctx.createLinearGradient(startX,startY,endX,endY);
  for(let stop of colorStops){
    lg.addColorStop(stop.percent,stop.color);
  }
  return lg;
};
function drawQuadraticCurve(ctx,lineWidth,strokeStyle,startX,startY,cpX,cpY,endX,endY){
	ctx.save();
	ctx.lineWidth=lineWidth;
	ctx.strokeStyle=strokeStyle;
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.quadraticCurveTo(cpX,cpY,endX,endY);
	ctx.stroke();
	ctx.restore();
}
		
function drawCubicBezierCurve(ctx,lineWidth,strokeStyle,startX,startY,cpX,cpY,cp2X,cp2Y,endX,endY){
	ctx.save();
	ctx.lineWidth=lineWidth;
	ctx.strokeStyle = strokeStyle;
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.bezierCurveTo(cpX,cpY,cp2X,cp2Y,endX,endY);
	ctx.stroke();
	ctx.restore();
}
function drawWaveform(ctx,data){
	ctx.save();
	var xStep = ctx.canvas.width/data.length;
	ctx.lineWidth=5;
	ctx.strokeStyle = makeColor(255,255,255,0.15);
	ctx.beginPath();
	ctx.moveTo(-64,128);
	for(var i=0; i<data.length; i++) { 
		ctx.lineTo(xStep*i,(data[i] *3)-196);
	}
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

const goFullscreen = (element) => {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullscreen) {
		element.mozRequestFullscreen();
	} else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	}
	// .. and do nothing if the method is not supported
};

export {makeColor, getRandomColor, getLinearGradient, goFullscreen, drawCubicBezierCurve, drawQuadraticCurve, drawWaveform};