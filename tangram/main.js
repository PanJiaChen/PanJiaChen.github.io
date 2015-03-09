var classArr=['gru','barca','cup','runner','triangle','cammello','fish','horse'];
var classCounter=0;

$("body").on("mouseenter",function(){
	$("#boxbasic").removeClass();
});

$("#boxbasic").on("mouseenter",function(){
	if (classCounter==8) {
		classCounter=0;
	}else{
		$("#boxbasic").addClass(classArr[classCounter]);
		classCounter++;
	}
});

$("#boxbasic").on("mouseleave",function(){
	$("#boxbasic").removeClass();
});
