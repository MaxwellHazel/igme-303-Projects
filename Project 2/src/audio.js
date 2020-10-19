// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, sourceNode, analyserNode, gainNode, distortionFilter, biquadFilter, lowShelfBiquadFilter;

// 3 - here we are faking an enumeration

const DEFAULTS = Object.freeze({
	gain : .5,
	numSamples : 256
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples/2);

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
function setupWebaudio(filePath){
// 1 - The || is because WebAudio has not been standardized across browsers yet
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	audioCtx = new AudioContext();
// 2 - this creates an <audio> element
	element = document.querySelector('audio');//new Audio();

// 3 - have it point at a sound file
	loadSoundFile(filePath);

// 4 - create an a source node that points at the <audio> element
// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource
	sourceNode = audioCtx.createMediaElementSource(element);
	distortionFilter = audioCtx.createWaveShaper();
	
	// https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
	biquadFilter = audioCtx.createBiquadFilter();
	biquadFilter.type = "highshelf";
	lowShelfBiquadFilter = audioCtx.createBiquadFilter();
	lowShelfBiquadFilter.type = "lowshelf";
// 5 - create an analyser node
// note the UK spelling of "Analyser"
	analyserNode = audioCtx.createAnalyser();
/*
// 6
We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
across the sound spectrum.

If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
the amplitude of that frequency.
*/ 

// fft stands for Fast Fourier Transform
	analyserNode.fftSize = DEFAULTS.numSamples;

// 7 - create a gain (volume) node
	gainNode = audioCtx.createGain();
	gainNode.gain.value = DEFAULTS.gain;
// 8 - connect the nodes - we now have an audio graph
	//sourceNode.connect(analyserNode);
	sourceNode.connect(biquadFilter);
	biquadFilter.connect(lowShelfBiquadFilter);
	lowShelfBiquadFilter.connect(distortionFilter);
	distortionFilter.connect(analyserNode);
	analyserNode.connect(gainNode);
	gainNode.connect(audioCtx.destination);
}

function loadSoundFile(filepath){
	element.src = filepath;
}

function playCurrentSound(){
	element.play();
}
function pauseCurrentSound(){
	element.pause();
}

function setVolume(value){
	/*if(value%2==undefined){
		value = (Number)value;// make sure that it's a Number rather than a String
	}*/
	gainNode.gain.value = Number(value);//(float)value;
	document.querySelector("#volumeLabel").innerhtml=`${value}`;
}
function toggleHighshelf(highshelf){
		if(highshelf){
			biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
			biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
		}else{
			biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
		}
	}
	function toggleLowshelf(lowshelf){
		if(lowshelf){
			lowShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
			lowShelfBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
		}else{
			lowShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
		}
	}
	function toggleDistortion(distortion, distortionAmount){
		if(distortion){
			distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
			distortionFilter.curve = makeDistortionCurve(distortionAmount);
		}else{
			distortionFilter.curve = null;
		}
	}
	
	// from: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
	function makeDistortionCurve(amount=20) {
		let n_samples = 256, curve = new Float32Array(n_samples);
		for (let i =0 ; i < n_samples; ++i ) {
			let x = i * 2 / n_samples - 1;
			curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
		}
		return curve;
	}

export {audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode, toggleHighshelf, toggleLowshelf, toggleDistortion, makeDistortionCurve};