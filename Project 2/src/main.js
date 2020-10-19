/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/But_even_then.mp3"
});
const drawParams = {
	showGradient : true,
	showBars : true,
	showCircles : true,
	showNoise : false,
	showInvert : false,
	showEmboss : false
};

function init(){
	audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
	canvas.setupCanvas(canvasElement,audio.analyserNode);
	loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
	const fsButton = document.querySelector("#fsButton");
	let volumeSlider = document.querySelector("#volumeSlider");
	let volumeLabel = document.querySelector("#volumeLabel");
	let trackSelect = document.querySelector("#trackSelect");
	let gradientSelect = document.querySelector("#gradientCB");
	let barsSelect = document.querySelector("#barsCB");
	let circleSelect = document.querySelector("#circlesCB");
	let noiseSelect = document.querySelector("#noiseCB");
	let invertSelect = document.querySelector("#invertCB");
	let embossSelect = document.querySelector("#embossCB");
	//let noneSelect = document.querySelector("#noneR");
	//let radioSelect = document.querySelector("effectR");
	let highshelf = false;
	let lowshelf = false;
	let distortion = false;
	let distortionAmount = 0;
  // add .onclick event to button
	fsButton.onclick = e => {
		console.log("init called");
		utils.goFullscreen(canvasElement);
	};
	playButton.onclick = e => {
		console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
		if(audio.audioCtx.state == "suspended") {
			audio.audioCtx.resume();
		}
		console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
		console.log(`e.target.dataset.playing before = ${e.target.dataset.playing}`);
		if(e.target.dataset.playing == "no"){
			audio.playCurrentSound();
			e.target.dataset.playing = "yes";
		}else{
			audio.pauseCurrentSound();
			e.target.dataset.playing = "no";
			//audio.audioCtx.state = "suspended";
		}
		console.log(`e.target.dataset.playing after = ${e.target.dataset.playing}`);
	};
	// Chrome autoplay fix
	// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
	document.querySelector("audio").onplay = (e) => {
  	  if (audio.audioCtx.state == "suspended") {
    	    audio.audioCtx.resume();
  	  }
	};
	volumeSlider.oninput = e =>{
		audio.setVolume(e.target.value);
		volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
	};
	volumeSlider.dispatchEvent(new Event("input"));
	trackSelect.onchange = e =>{
		audio.loadSoundFile(e.target.value);
		if(playButton.dataset.playing == "yes"){
			playButton.dispatchEvent(new Event("click"));
		}
	};
	gradientSelect.onchange = e => {
		drawParams.showGradient = e.target.checked;
	};
	barsSelect.onchange = e => {
		drawParams.showBars = e.target.checked;
	};
	circleSelect.onchange = e => {
		drawParams.showCircles = e.target.checked;
	};
	noiseSelect.onchange = e => {
		drawParams.showNoise = e.target.checked;
	};
	invertSelect.onchange = e => {
		drawParams.showInvert = e.target.checked;
		//drawParams.showEmboss = !e.target.checked;
		/*if(e.target.checked){
			
		}*/
		//drawParams.showInvert = true;
		//drawParams.showEmboss = false;
	};
	embossSelect.onchange = e => {
		drawParams.showEmboss = e.target.checked;
		/*if(e.target.checked){
			drawParams.showInvert = false;//e.target.checked;
			drawParams.showEmboss = true;//e.target.checked;
		}*/
		//drawParams.showInvert = !e.target.checked;
	};
	/*noneSelect.onchange = e => {
		if(e.target.checked){
			drawParams.showInvert = false;
			drawParams.showEmboss = false;
		}
		drawParams.showInvert = false;
		drawParams.showEmboss = false;
		//console.log("init called");
		<span><input type="radio" name="effectR" id="invertR" ><label for="invertR">Invert Colors</label></span>
		<span><input type="radio" name="effectR" id="embossR" ><label for="embossR">Show Emboss</label></span>
		<span><input type="radio" name="effectR" id="noneR" checked><label for="noneR">No Effect</label></span>
	};*/
	// NEW
	document.querySelector("#upload").onchange = (e) => {
		const files = event.target.files;
		document.querySelector("audio").src = URL.createObjectURL(files[0]);
	};
	
	// I. set the initial state of the high shelf checkbox
	document.querySelector('#highshelfCB').checked = highshelf; // `highshelf` is a boolean we will declare in a second
  
	// II. change the value of `highshelf` every time the high shelf checkbox changes state
	document.querySelector('#highshelfCB').onchange = e => {
		highshelf = e.target.checked;
		audio.toggleHighshelf(highshelf); // turn on or turn off the filter, depending on the value of `highshelf`!
	};
	// II. change the value of `lowshelf` every time the low shelf checkbox changes state
	document.querySelector('#lowshelfCB').onchange = e => {
		lowshelf = e.target.checked;
		audio.toggleLowshelf(lowshelf); // turn on or turn off the filter, depending on the value of `lowshelf`!
	};
	document.querySelector('#distortionCB').onchange = e => {
		distortion = e.target.checked;
		audio.toggleDistortion(distortion);
	};
	// III. 
	//turn on or turn off the filter, depending on the value of `distortion`!
	document.querySelector('#distortionSlider').value = distortionAmount;
	document.querySelector('#distortionSlider').onchange = e => {
		distortionAmount = Number(e.target.value);
		audio.toggleDistortion(distortion, distortionAmount);
	};
	
} // end setupUI
function loop(){
/* NOTE: This is temporary testing code that we will delete in Part II */
	requestAnimationFrame(loop);
	canvas.draw(drawParams);
	// 1) create a byte array (values of 0-255) to hold the audio data
	// normally, we do this once when the program starts up, NOT every frame
	/*let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
	
	// 2) populate the array of audio data *by reference* (i.e. by its address)
	audio.analyserNode.getByteFrequencyData(audioData);
	
	// 3) log out the array and the average loudness (amplitude) of all of the frequency bins
		console.log(audioData);
		
		console.log("-----Audio Stats-----");
		let totalLoudness =  audioData.reduce((total,num) => total + num);
		let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
		let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
		let maxLoudness =  Math.max(...audioData); // ditto!
		// Now look at loudness in a specific bin
		// 22050 kHz divided by 128 bins = 172.23 kHz per bin
		// the 12th element in array represents loudness at 2.067 kHz
		let loudnessAt2K = audioData[11]; 
		console.log(`averageLoudness = ${averageLoudness}`);
		console.log(`minLoudness = ${minLoudness}`);
		console.log(`maxLoudness = ${maxLoudness}`);
		console.log(`loudnessAt2K = ${loudnessAt2K}`);
		console.log("---------------------");*/
}
export {init};