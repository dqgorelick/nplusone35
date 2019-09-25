const NUM_CLOUDS = 100;

const randRange = (min, max) => {
  return Math.floor(Math.random()*(max-min)) + min;
}

const generateCloud = () => {
	for (let i=0; i<NUM_CLOUDS; i++) {
		
		const cloud=document.getElementById(`cloud${randRange(0,5)}`)
		
		const newCloud=cloud.cloneNode(true)
		newCloud.setAttributeNS(null, 'class', 'cloud');
		document.querySelectorAll('.clouds')[0].appendChild(newCloud)
		
		// need to append cloud before getting box
		const box = newCloud.querySelectorAll('path')[0].getBBox();
		newCloud.setAttributeNS(null, 'style',
		  `
		  transform-origin: center;
		  transform: 
		  	translateY(${window.innerHeight-box.y-box.height}px)
		  	translateX(${randRange(-1000, 1000)}px)
		  	translateZ(${-(NUM_CLOUDS - 1 - i) * 10}px)
		  	scale(${randRange(1,3)})
		  	;
		  `
		)
		  // --stroke-width: ${mapVelocity(velocity)};
		  // --offset: ${path_offset};
		  // --start: ${start};
		  // --end: ${end};
		  // --initial: ${initial};
		  // --segment_length: ${segment_length}`)
	}
}

generateCloud();

var globalPos = 0;

// setInterval(() => {
// 	globalPos += 0
// 	document.querySelectorAll('.clouds')[0].style.transform = `translateZ(${globalPos}px)`
// 	console.log('hello', globalPos)
// }, 1000)