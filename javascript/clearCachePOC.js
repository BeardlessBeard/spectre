function main(){

	// Creating the byte array (16 MB)
	var cacheSize = 16 * 1024 * 1024;
	var evictionBuffer = new Int8Array(cacheSize);
	var junk;
	var array = new Array(100);

	// Flush cache
	function clflush(){
		// console.log("clflush() before");
		for(var i = 0; i < cacheSize; i++)
			junk = evictionBuffer[i];
		// console.log("clflush() after");
	}

	// Load array into cache
	function loadArray(){
		for(var i = 0; i < array.length; i++)
			array[i] = i;
	}

	function traverseArray(){
		// console.log("traverseArray()");
		for(var i = 0; i < array.length; i++)
			junk = array[i];
	}

	// Loading into cache
	loadArray();

	// Test that it's in cache
	var t1 = performance.now();
	traverseArray();
	var t2 = performance.now();

	traverseArray();
	traverseArray();
	traverseArray();

	var t3 = performance.now();
	traverseArray();
	var t4 = performance.now();

	clflush();

	// Test time after eviction
	var t5 = performance.now();
	traverseArray();
	var t6 = performance.now();

	console.log("traverseArray()");
	console.log(t2-t1);
	console.log("traverseArray2()");
	console.log(t4-t3);
	console.log("traverseArray() After clflush()");
	console.log(t6-t5);
}

main();
