function main(){
	function now() { return Atomics.load(sharedArray, 0) };
	function reset() { Atomics.store(sharedArray, 0, 0) }
	function start() { reset(); return now(); }

	// Creating the byte array (16 MB)
	var cacheSize = 16 * 1024 * 1024;
	var evictionBuffer = new Int8Array(cacheSize);
	var junk;
	var array = new Array(100);

	// Timer Stuff
	const worker = new Worker("worker.js");
	const sharedBuffer = new SharedArrayBuffer(10* Uint32Array.BYTES_PER_ELEMENT);
	const sharedArray = new Uint32Array(sharedBuffer);
	worker.postMessage(sharedBuffer);

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
	traverseArray();

	var hit = new Array();
	var miss = new Array();

	worker.onmessage = function(msg){
		var right = 0;
		var wrong = 0;
		for(var i = 0; i < 100; i++){
			var t1 = start();
			junk = array[8];
			var t2 = now();

			clflush();

			var t3 = start();
			junk = array[8];
			var t4 = now();

			hit.push(t2-t1);
			miss.push(t4-t3);

			if((t2-t1) < (t4-t3)){
				right++;
			}else{
				wrong++;
			}

			traverseArray();
		}
		console.log(hit);
		console.log(miss);

	}
}

main();
