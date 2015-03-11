// 点击数字冒泡
$("*").on("click",function(e){
	anp(e);
})
function anp(e){
	var n=Math.round(Math.random()*10);
	var $i=$("<b>").text("+"+n);
	var x=e.pageX,y=e.pageY;
	$i.css({top:y-20,left:x,position:"absolute"});
	$("body").append($i);
	$i.animate({top:y-180,opacity:0,},1500,function(){
		$i.remove();
	});
	e.stopPropagation();
}
// 侧边栏微博分享
function $en(tit){return encodeURIComponent(tit)}
var title="大家好我叫潘嘉晨 欢迎来的我的单页网站，如果喜欢请分享给你的好友~";
$(".sina").click(function(){
	window.open('http://v.t.sina.com.cn/share/share.php?appkey=962772401&title='+$en(title));
})
$(".qq").click(function(){
	window.open('http://v.t.qq.com/share/share.php?title='+$en(title));
})
// 回到顶部
showScroll();
function showScroll(){
	$(window).scroll( function() { 
		var scrollValue=$(window).scrollTop();
		scrollValue > 2300 ? $('div[class=toTop]').fadeIn():$('div[class=toTop]').fadeOut();
		} );	
		$('.toTop').click(function(){
			$("html,body").animate({scrollTop:0},1200);	
			$('#pic1').attr('num', '1');

		});	
	}


// page2文字跳舞
eval(function(p, a, c, k, e, d) {
	e = function(c) {
		return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
	};
	if (!''.replace(/^/, String)) {
		while (c--) {
			d[e(c)] = k[c] || e(c)
		}
		k = [
			function(e) {
				return d[e]
			}
		];
		e = function() {
			return '\\w+'
		};
		c = 1
	};
	while (c--) {
		if (k[c]) {
			p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
		}
	}
	return p
}('(4($){$.t.w=4(5){2 e={h:\'1.x\',n:v,l:u,};2 5=$.y(e,5);d 6.c(4(){2 3=$(6);z(3.7()!==3.g()){d};2 7=3.7();2 a=\'\';r(2 i=0;i<=7.s;i++){2 8=7.F(i,i+1);a+=($.I(8))?\'<9 H="f-b">\'+8+\'</9>\':8}3.g(a);3.A(\'9.f-b\').c(4(){$(6).B(4(){$(6).p({q:5.h},{o:j,k:5.n,m:\'C\',D:4(){$(6).p({q:0},{o:j,k:5.l,m:\'E\'})}})})})})}})(G);', 45, 45, '||var|obj|function|options|this|text|character|span|newMarkup|char|each|return|defaults|bumpy|html|bounceHeight||false|duration|bounceDownDuration|easing|bounceUpDuration|queue|animate|bottom|for|length|fn|700|500|bumpyText|3em|extend|if|find|mouseover|easeOutCubic|complete|easeOutBounce|slice|jQuery|class|trim'.split('|'), 0, {}))
$(document).ready(function(){
	$('.text-flash').bumpyText();
});
// page2的nav
 $('#page2Nav > div').hover(
                function () {
                    var $this = $(this);
                    $this.find('img').stop().animate({
                        'width'     :'199px',
                        'height'    :'199px',
                        'top'       :'68px',
                        'left'      :'28px',
                        'opacity'   :'1.0'
                    },500,'easeOutBack',function(){
                        $(this).parent().find('ul').fadeIn(700);
                    });

                    $this.find('a:first,h2').addClass('active');
                },
                function () {
                    var $this = $(this);
                    $this.find('ul').fadeOut(500);
                    $this.find('img').stop().animate({
                        'width'     :'52px',
                        'height'    :'52px',
                        'top'       :'0px',
                        'left'      :'0px',
                        'opacity'   :'0.0'
                    },5000,'easeOutBack');

                    $this.find('a:first,h2').removeClass('active');
                }
            );

// 云与down按钮动画
var yueAnimate={
		
		btntop :function(){

			$("#btntop").css({"margin-top": "0px"});
			$("#btntop").animate({
				"margin-top": "30px"
			},1000,'easeOutBounce');
			
		},
		yue :function(id,left,right,time){
			$(id).animate({
				"margin-left": right
			},time,function(){
				$(id).animate({
					"margin-left": left
				},time);
			});
		},
		
	}
	var shubiao=true;
	var wheel = function(event) {  
		var delta = 0;  
		if (!event)
			event = window.event;  
		if (event.wheelDelta) {
			delta = event.wheelDelta / 120;
		} else if (event.detail) {
			delta = -event.detail / 3;
		}
		if (delta) handle(delta);
		if (event.preventDefault) event.preventDefault();  
		event.returnValue = false;  
	}
	if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
	document.onmousewheel = wheel;
	var $f=true;
	var handle = function(delta) {
		if(!shubiao) return;
		shubiao=false;
		var random_num = Math.floor((Math.random() * 100) + 50);
		if (delta < 0) {
			PicWheelScroll(1);
			$f=false;
			 //console.log("鼠标滑轮向下滚动：" + delta + "次！"); // 1  
			return false;  
		} else {
			$f=true;
			PicWheelScroll(0);
			//console.log("鼠标滑轮向上滚动：" + delta + "次！"); // -1  
			return false;  
		}
	}
	$(".floor").each(function(i){
		$(this).click(function(){
			$(".floor").removeClass("active");
			$(".floor").eq(i).addClass("active");
			var num=i+1;
			if(num=="4") $("#btntop").hide();
			else $("#btntop").show();
			gotoAnchor($(".page"+num));
			getAnchroFun(num);
		})
	})
	var PicWheelScroll = function(n){
		
		var num=$("#pic1").attr("num");
		
		if((num===4&&n===1) || (num===1&&n===0)) return;
		if(n==1){
			if(num<4) num++;
		}else{
			if(num>1) num--;
		}

		$(".floor").removeClass("active");
		$(".floor").eq(num-1).addClass("active");

		if(num=="4") $("#btntop").hide();
		else $("#btntop").show();
		gotoAnchor($(".page"+num));
		getAnchroFun(num);
	}

	
	yueAnimate.yue("#page2yue1","-560px","-375px",50000);
	yueAnimate.yue("#page2yue2","55px","260px",50000);
	yueAnimate.yue("#page4yue3","338px","-60px",50000);


	setInterval(yueAnimate.btntop,2000);
	var getAnchroFun=function(num){
		var h=$(window).height();
		var h=(h-500<30?30:h-580)+"px";
		$(".divtop").css("bottom","30px");
		var n=$("#pic1").attr("num");
		
		$("#pic1").attr("num",num);
	}
	var gotoAnchor = function(selector,isauto){
		var anchor = $(selector);
		if (anchor.length < 0) return;
		var $win=$(window);
		var $body = $(window.document.documentElement);
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf("webkit") > -1) {
			$body = $(window.document.body)
		}
		var pos=anchor.offset();
		if (isauto) {
			var t = pos.top - $win.scrollTop(); //相对于屏幕显示区
			var t2 = $win.height() - t;
			if (t2 < anchor.outerHeight()) {
				$body.animate({"scrollTop": pos.top}, "normal");
			}
			return;
		}
		var apple=pos.top
		$body.animate({"scrollTop": pos.top},1000,'easeInOutCubic',function(){shubiao=true});
	}
	gotoAnchor($(".page1"));
	
	$(window).resize(function(){
		var h=$(window).height();
		$(".back").css("height",h+"px");
		var n=$("#pic1").attr("num");
		var h1=(h-500<30?30:h-580)+"px";
		
		$(".divtop").css("bottom","30px");
		gotoAnchor($(".page"+n));
	});
	$(".divtop").click(function(){
		var n=$("#pic1").attr("num");
		if(n=="3") $("#btntop").hide();
		n=parseInt(n)+1;
		if(n==5) {return;}
		$(".floor").removeClass("active");
		$(".floor").eq(n-1).addClass("active");
		gotoAnchor($(".page"+n));
		getAnchroFun(n);
		$("#pic1").attr("num",n);
	})

$('#circleMenu > a').mouseover(
	function(){
		var $this = $(this);
		move($this,800,1);
	}
);

	/*
	page1圆的js
	 */
	function move($elem,speed,turns){
		var id = $elem.attr('id');
		var $circle = $('#circle_'+id);

		/* if hover the same one nothing happens */
		if($circle.css('opacity')==1)
			return;

		/* change the image */
		$('#image_'+id).stop(true,true).fadeIn(650).siblings().not(this).fadeOut(650);

		/*
		if there's a circle already, then let's remove it:
		either animate it in a circular movement or just fading out, depending on the current position of it
		 */
		$('#circleContent .circle').each(function(i){
			var $theCircle = $(this);
			if($theCircle.css('opacity')==1)
				$theCircle.stop()
			.animate({
				path : new $.path.arc({
					center	: [409,359],
					radius	: 257,
					start	: 65,
					end     : -110,
					dir	: -1
				}),
				opacity: '0'
			},1500);
			else
				$theCircle.stop()
			.animate({opacity: '0'},200);
		});

		/* make the circle appear in a circular movement */
		var end = 65 - 360 * (turns-1);
		$circle.stop()
		.animate({
			path : new $.path.arc({
				center	: [409,359],
				radius	: 257,
				start	: 180,
				end		: end,
				dir		: -1
			}),
			opacity: '1'
		},speed);
	}


// page3 direction move
var hover_dir = {
	wrapper: $(".major-list")[0],
	box: $(".major-item"),
	target: $(".back-face"),
	bindEvent: function(){
		var mouse_pos, x, y, stop_bubble;
		for(var i = 0; i < hover_dir.box.length; i++){
			(function(n){
				$.addEvent(hover_dir.box[n], "mouseover", function(event){
					event = $.getEvent(event);
					var relatedT = $.getRelatedTarget(event);
					if(!$.contains(hover_dir.box[n], relatedT)){
						var child = hover_dir.box[n].childNodes[0];
						$.stopPropagation(event);
						$.removeClass(hover_dir.target[n], "to-left") ||
						$.removeClass(hover_dir.target[n], "to-right") ||
						$.removeClass(hover_dir.target[n], "to-top") ||
						$.removeClass(hover_dir.target[n], "to-bottom");
						x = event.pageX;
						y = event.pageY;
						mouse_pos = {"x": x, "y": y};
						var dir = $.get_dir(hover_dir.box[n], mouse_pos);
						switch(dir){
							case "left": 
								$.addClass(hover_dir.target[n], "from-left");
								break;
							case "right": 
								$.addClass(hover_dir.target[n], "from-right");
								break;
							case "top": 
								$.addClass(hover_dir.target[n], "from-top");
								break;
							case "bottom":
								$.addClass(hover_dir.target[n], "from-bottom");
								break;
							default: break;
						}
					}
				});
				$.addEvent(hover_dir.box[n], "mouseout", function(event){
					event = $.getEvent(event);
					var relatedT = $.getRelatedTarget(event);
					if(!$.contains(hover_dir.box[n], relatedT)){
						$.removeClass(hover_dir.target[n], "from-left") ||
						$.removeClass(hover_dir.target[n], "from-right") ||
						$.removeClass(hover_dir.target[n], "from-top") ||
						$.removeClass(hover_dir.target[n], "from-bottom");
						x = event.pageX;
						y = event.pageY;
						mouse_pos = {"x": x, "y": y};
						var dir = $.get_dir(hover_dir.box[n], mouse_pos);
						switch(dir){
							case "left": 
								$.addClass(hover_dir.target[n], "to-left");
								break;
							case "right": 
								$.addClass(hover_dir.target[n], "to-right");
								break;
							case "top": 
								$.addClass(hover_dir.target[n], "to-top");
								break;
							case "bottom":
								$.addClass(hover_dir.target[n], "to-bottom");
								break;
							default: break;
						}
					}	
				});
			})(i);
		}},
	init: function(){
		hover_dir.bindEvent();
	}
};
hover_dir.init();


// page4
var highLight={
			opacity : 0.2,
			imgWidth : $('.images-wrap ul li').find('img').width(),
			imgHeight : $('.images-wrap ul li').find('img').height()
		};
		$('.images-wrap ul li ').css({
			'width': highLight.imgWidth,
			'height': highLight.imgHeight
		});

		$('.images-wrap ul li').hover(function() {
			$(this).find('img').addClass('active').css({ 'opacity' : 1});
			$(this).siblings('li').find('img').css({'opacity' : highLight.opacity}) ;
		}, function() {
			$(this).find('img').removeClass('active');
		});

		$('.images-wrap ul').bind('mouseleave',function(){
				
				$(this).find('img').css('opacity', 1);
		});
		var d = 0; //delay
		var ry, tz, s; //transform params

		//animation time
		$(".animate").on("click", function(){
		//fading out the thumbnails with style
		$(".animate-image").each(function(){
			d = Math.random()*1000; //1ms to 1000ms delay
			$(this).delay(d).animate({opacity: 0}, {
				//while the thumbnails are fading out, we will use the step function to apply some transforms. variable n will give the current opacity in the animation.
				step: function(n){
					s = 1-n; //scale - will animate from 0 to 1
					$(this).css("transform", "scale("+s+")");
				}, 
				duration: 1000, 
			})
		}).promise().done(function(){
			//after *promising* and *doing* the fadeout animation we will bring the images back
			storm();
			})
		})
		//bringing back the images with style
		function storm(){
			$(".animate-image").each(function(){
				d = Math.random()*1000;
				$(this).delay(d).animate({opacity: 1}, {
					step: function(n){
						//rotating the images on the Y axis from 360deg to 0deg
						ry = (1-n)*360;
						//translating the images from 1000px to 0px
						tz = (1-n)*1000;
						//applying the transformation
						$(this).css("transform", "rotateY("+ry+"deg) translateZ("+tz+"px)");
					}, 
					duration: 3000, 
					//some easing fun. Comes from the jquery easing plugin.
					easing: 'easeOutQuint', 
				})
			})
		}