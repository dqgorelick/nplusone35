const NUM_CLOUDS = 30;
const BREAKPOINT = 200;
const INTERVAL = 10; 
const TICK_TIME = 1000;

const randRange = (min, max) => {
  return Math.floor(Math.random()*(max-min)) + min;
}

const applyCloudTransform = (transform) => (
	`
	transform-origin: center;
	transform: 
		translateX(${transform.translateX}px)
		translateY(${transform.translateY}px)
		translateZ(${transform.translateZ}px)
		;
	`
)


const applyCloudTransition = () => {
	[...document.querySelectorAll('.cloud')].forEach((cloud) => {
		cloud.style.transition = 'transform 2s linear';
	})
}


const generateCloud = () => {
	for (let i=0; i<NUM_CLOUDS; i++) {
		
		const cloud=document.getElementById(`cloud${randRange(0,5)}`)
		
		const newCloud=cloud.cloneNode(true)
		newCloud.setAttributeNS(null, 'class', 'cloud');
		document.querySelectorAll('.clouds')[0].appendChild(newCloud)
		
		// need to append cloud before getting box
		const box = newCloud.querySelectorAll('path')[0].getBBox();
		const centerX = (window.innerWidth/2) - (box.width/2);
		const transform = {
			translateX: centerX + randRange(-1000, 1000),
			translateY: window.innerHeight-box.y-box.height,
			translateZ: -(NUM_CLOUDS - 1 - i) * 15,
			state: 0,
			height: box.height,
		}
		newCloud.setAttributeNS(null, 'style', applyCloudTransform(transform));
		newCloud.setAttributeNS(null, 'data-transform', JSON.stringify(transform));

		  // --stroke-width: ${mapVelocity(velocity)};
		  // --offset: ${path_offset};
		  // --start: ${start};
		  // --end: ${end};
		  // --initial: ${initial};
		  // --segment_length: ${segment_length}`)
	}
	// apply cloud transition after they are rendered
	// setTimeout(applyCloudTransition, 500);
}

generateCloud();

var globalPos = -200;

document.addEventListener('click', () => {console.log(globalPos)});
setInterval(() => {
	globalPos += INTERVAL
	document.querySelectorAll('.clouds')[0].style.transform = `translateZ(${globalPos}px)`
	checkClouds();
}, TICK_TIME)

const checkClouds = () => {

	[...document.querySelectorAll('.cloud')].forEach((cloud) => {
		var transform = JSON.parse(cloud.dataset.transform);
		if (transform.translateZ > -(globalPos + BREAKPOINT)) {
			if (transform.state === 0) {
				console.log('apply transform!', transform.translateZ, -(globalPos + BREAKPOINT))
				const newTransform = { 
					...transform, 
					translateY: transform.translateY + transform.height,
					state: 1,
				}
				cloud.setAttributeNS(null, 'style', 
					applyCloudTransform(newTransform) 
					+ `transition: transform ${BREAKPOINT / (INTERVAL * (TICK_TIME/1000))}s linear`
				);
				cloud.setAttributeNS(null, 'data-transform', JSON.stringify(newTransform))

			}
		}
		if (transform.translateZ > -(globalPos - BREAKPOINT)) {
			console.log(transform.translateZ, globalPos)
			console.log('removed child')
			cloud.parentNode.removeChild(cloud);
		}
	})
}