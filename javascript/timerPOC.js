function wait_edge(){
	var next, last = performance.now();
	while((next = performance.now()) == last){}
	return next;
}

function count_edge(){
	var last = performance.now(), count = 0;
	while(performance.now() == last) count++;
	return count;
}

function calibrate(){
	var counter = 0, next;
	for(var i = 0; i < 10; i++){
		next = wait_edge();
		counter += count_edge();
	}
	next = wait_edge();
	return (wait_edge() - next) / (counter / 10.0);
}

function measure(fnc){
	var start = wait_edge();
	fnc();
	var count = count_edge();
	return (performance.now()-start) - count * calibrate();
}



function main(){

	// Creating the byte array (16 MB)
	var cacheSize = 16 * 1024 * 1024;
	var evictionBuffer = new Int8Array(cacheSize);
	var junk;
	var array = new Array(100);

	// Flush cache
	function clflush(){
		for(var i = 0; i < cacheSize; i++)
			junk = evictionBuffer[i];
	}
	// Load array into cache
	function loadArray(){
		for(var i = 0; i < array.length; i++)
			array[i] = i;
	}
	// Stores array in cache
	function traverseArray(){
		for(var i = 0; i < array.length; i++)
			junk = array[i];
	}

	// Fill the array and load it into the cache
	loadArray();
	traverseArray();

	// This should NOT work
	var right = 0;
	var wrong = 0;
	for(var i = 0; i < 100; i++){
		var t1 = performance.now();
		junk = array[8];
		var t2 = performance.now();

		clflush();

		var t3 = performance.now();
		junk = array[8];
		var t4 = performance.now();


		if((t2-t1) < (t4-t3)){
			right++;
		}else{
			wrong++;
		}

		traverseArray();
	}
	console.log(right);
	console.log(wrong);


	traverseArray();
	var right = 0;
	var wrong = 0;
	var hit = new Array();
	var miss = new Array();

	var CACHE_HIT_THRESHOLD = 0.003850574713;

	// This might work
	for(var i = 0; i < 100; i++){
		var t1 = measure(function(){
			junk = array[8];
		});

		clflush();

		var t2 = measure(function(){
			junk = array[8];
		});

		if(t1 <= CACHE_HIT_THRESHOLD){
			right++;
		}else{
			wrong++;
		}

		traverseArray();
	}

	console.log(right);
	console.log(wrong);
}

main();
