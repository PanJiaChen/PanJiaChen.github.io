/*
 * jQuery css bezier animation support -- Jonah Fox
 * version 0.0.1
 * Released under the MIT license.
 */
/*
  var path = $.path.bezier({
    start: {x:10, y:10, angle: 20, length: 0.3},
    end:   {x:20, y:30, angle: -20, length: 0.2}
  })
  $("myobj").animate({path: path}, duration)

*/

(function($){

  $.path = {}


  var V = {
    rotate: function(p, degrees) {
      var radians = degrees * 3.141592654 / 180
      var c = Math.cos(radians), s = Math.sin(radians)
      return [c*p[0] - s*p[1], s*p[0] + c*p[1] ]
    },
    scale: function(p, n) {
      return [n*p[0], n*p[1]]
    },
    add: function(a, b) {
      return [a[0]+b[0], a[1]+b[1]]
    },
    minus: function(a, b) {
      return [a[0]-b[0], a[1]-b[1]]
    }
  }
   
   $.path.bezier = function( params ) { 
     	params.start = $.extend({angle: 0, length: 0.3333}, params.start )
     	params.end   = $.extend({angle: 0, length: 0.3333}, params.end )

     this.p1 = [params.start.x, params.start.y];
     this.p4 = [params.end.x, params.end.y];
     
     var v14 = V.minus(this.p4, this.p1)
     var v12 = V.scale(v14, params.start.length)
     v12 = V.rotate(v12, params.start.angle)
     this.p2 = V.add(this.p1, v12)
      
     var v41 = V.scale(v14, -1)
     var v43 = V.scale(v41, params.end.length)     
     v43 = V.rotate(v43, params.end.angle)
     this.p3 = V.add(this.p4, v43)

     this.f1 = function(t) { return (t*t*t); }
     this.f2 = function(t) { return (3*t*t*(1-t)); } 
     this.f3 = function(t) { return (3*t*(1-t)*(1-t)); }
     this.f4 = function(t) { return ((1-t)*(1-t)*(1-t)); }

     /* p from 0 to 1 */
     this.css = function(p) {
       var f1 = this.f1(p), f2 = this.f2(p), f3 = this.f3(p), f4=this.f4(p)
       var x = this.p1[0]*f1 + this.p2[0]*f2 +this.p3[0]*f3 + this.p4[0]*f4;
       var y = this.p1[1]*f1 + this.p2[1]*f2 +this.p3[1]*f3 + this.p4[1]*f4;
       return {top: y + "px", left: x + "px"}
     }
   }

   $.path.arc = function(params) {
     for(var i in params)
       this[i] = params[i]

     this.dir = this.dir || 1

     while(this.start > this.end && this.dir > 0)
       this.start -= 360

     while(this.start < this.end && this.dir < 0)
       this.start += 360


     this.css = function(p) {
       var a = this.start * (p ) + this.end * (1-(p ))  
       a = a * 3.1415927 / 180 // to radians

       var x = Math.sin(a) * this.radius + this.center[0]
       var y = Math.cos(a) * this.radius + this.center[1]
       return {top: y + "px", left: x + "px"}
     } 

   };
   
       
  $.fx.step.path = function(fx){
    var css = fx.end.css(1 - fx.pos)
    for(var i in css) 
      fx.elem.style[i] = css[i];
  }

// 1
var aux   = {
      toggleChars : function($el, settings) {
        var $wrappers = $el.find('.sl-wrapper'),
          total   = $wrappers.length,
          c1      = $el.hasClass('sl-w1') ? 'sl-w2' : 'sl-w1',
          c2      = $el.hasClass('sl-w1') ? 'sl-w1' : 'sl-w2';    
        
        $el.addClass(c1).removeClass(c2);
        
        $wrappers.each(function(i) {
          var $wrapper      = $(this),
            interval;
          
          switch(settings.dir) {
            case 'leftright' : interval = i * settings.delay; break;
            case 'rightleft' : interval = (total - 1 - i) * settings.delay; break;
          };
          
          if(settings.delay) {
            setTimeout(function() {
              aux.switchChar($wrapper, $el, settings, c1, c2);
            }, interval);
          } 
          else
            aux.switchChar($wrapper, $el, settings, c1, c2);
        });
      },
      switchChar  : function($wrapper, $el, settings, c1, c2) {
        var $newChar      = $wrapper.find('span.' + c1),
          $currentChar    = $wrapper.find('span.' + c2),
          nextWrapperW    = $currentChar.width();
          
        if($newChar.length)
          nextWrapperW    = $newChar.width();
        
        //new slides in
        if($newChar.length) {
          var param = {left : '0px'};
          if(!$.browser.msie && settings.opacity)
            param.opacity   = 1;
          
          $newChar.stop().animate(param, settings.speed, settings.easing);
          
          //animate the wrappers width
          $wrapper.stop().animate({
            width : nextWrapperW + 'px'
          }, settings.speed);
        }
        
        //current slides out
        if(!settings.overlay || c1 === 'sl-w1') {
          if(settings.dir === 'leftright')
            var param = {left : -$currentChar.width() + 'px'};
          else
            var param = {left : nextWrapperW + 'px'};
            
          if(!$.browser.msie && settings.opacity)
            param.opacity   = 0;
          $currentChar.stop().animate(param, settings.speed, settings.easing);
        }
      }
    },
    methods = {
      init  : function(options) {
        
        if(this.length){
          
          var settings = {
            delay   : false,    // each letter will have different animation times
            speed   : 300,      // animation speed    
            easing    : 'jswing',   // easing animation
            dir     : 'leftright',  // leftright - current goes left, new one goes right || rightleft - current goes right, new one goes left, 
            overlay   : false,    // hover word is slided on top of the current word (just for the case when the hover word equals word)
            opacity   : true      // animate the letters opacity
          };
          
          return this.each(function(){
            
            // If options exist, lets merge them with our default settings
            if ( options ) {
              $.extend( settings, options );
            }
            
            var $el       = $(this).addClass('sl-w1'),
              word      = $el.data('hover') || $el.html();  // if data-hover was set the hover word is the one specified, otherwise the hover word is also the word
            
            if($el.data('hover')) settings.overlay = false;     // the overlay option will only work for the case when the hover word equals word
            
            $el.lettering();                    // apply the lettering.js plugin
              
            var $chars      = $el.children('span').addClass('sl-w1'),
              $tmp      = $('<span>' + word + '</span>').lettering();
            
            $chars.each(function(i) {
              var $char   = $(this);
              
              $char.wrap( $('<span/>').addClass('sl-wrapper') ) // wrap each of the words chars, and set width of each wrapper = chars width
                 .parent().css({
                  width : $char.width() + 'px'
                  });
            });
            
            $tmp.children('span').each(function(i) {
              var $char   = $(this),
                $wrapper  = $el.children('.sl-wrapper').eq(i);
              
              if($wrapper.length)                 // check if theres a wrapper to insert the char
                $wrapper.prepend( $char.addClass('sl-w2') );
              else {                        // otherwise create one   
                $el.append(
                  $('<span class="sl-wrapper"></span>').prepend( $char.addClass('sl-w2') )
                );
                
                $char.parent().css({
                  width : $char.width() + 'px'
                });
              }
              
              if(!$.browser.msie && settings.opacity)
                  $char.css('opacity', 0);
              
                                    // "hide" the char
              if(settings.dir === 'leftright')              
                $char.css('left', - $char.width() + 'px');
              else
                $char.css('left', $char.parent().width() + 'px');   
            });
            
            // mouseenter / mouseleave events - swicth to the other word
            $el.bind('mouseenter.hoverwords mouseleave.hoverwords', function(e) {
              aux.toggleChars($el, settings);
            });

          });
        }
      }
    };
  
  $.fn.hoverwords = function(method) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.hoverwords' );
    }
  };
})(jQuery);

(function($){
  function injector(t, splitter, klass, after) {
    var a = t.text().split(splitter), inject = '';
    if (a.length) {
      $(a).each(function(i, item) {
        inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
      }); 
      t.empty().append(inject);
    }
  }
  
  var methods = {
    init : function() {

      return this.each(function() {
        injector($(this), '', 'char', '');
      });

    },

    words : function() {

      return this.each(function() {
        injector($(this), ' ', 'word', ' ');
      });

    },
    
    lines : function() {

      return this.each(function() {
        var r = "eefec303079ad17405c889e092e105b0";
        // Because it's hard to split a <br/> tag consistently across browsers,
        // (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash 
        // (of the word "split").  If you're trying to use this plugin on that 
        // md5 hash string, it will fail because you're being ridiculous.
        injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
      });

    }
  };

  $.fn.lettering = function( method ) {
    // Method calling logic
    if ( method && methods[method] ) {
      return methods[ method ].apply( this, [].slice.call( arguments, 1 ));
    } else if ( method === 'letters' || ! method ) {
      return methods.init.apply( this, [].slice.call( arguments, 0 ) ); // always pass an array
    }
    $.error( 'Method ' +  method + ' does not exist on jQuery.lettering' );
    return this;
  };

})(jQuery);

// page3 direction move
$.addClass = function(elem, newClass){
  if(!elem) 
    return false;
  else if(!elem.className) {
    elem.className = newClass;
    return false; 
  }
  else {
    var ownClass = elem.className.split(" "), had = false;
    for(var i = 0; i < ownClass.length; i++){
      if(ownClass[i] === newClass){
        had = true;
        break;
      }
    }
    if(!had){
      elem.className += " " + newClass;
    }
    return had;
  }
};

$.removeClass = function(elem, oneClass){
  if(!elem || !elem.className) return false;
  var ownClass = elem.className.split(" "),
    had = false;
  for(var i = 0; i < ownClass.length; i++){
    if(ownClass[i] === oneClass){
      ownClass.splice(i, 1);
      had = true;
      break;
    }
  }
  if(had){
    elem.className = "";
    if(ownClass.length < 1){
      return had;
    }else if(ownClass.length == 1){
      elem.className = ownClass[0];
    }else if(ownClass.length >1){
      for(var i = 0; i < ownClass.length; i++){
        if(i == ownClass.length - 1){
          elem.className += ownClass[i];
        }else{
          elem.className += ownClass[i] + " ";
        }
      }
    }
  } 
  return had; 
};

$.addEvent = function(elem, eventName, handler){
  if(elem){
    if(elem.addEventListener){
      return elem.addEventListener(eventName, handler, false);
    }else if(elem.attachEvent){
      return elem.attachEvent("on" + eventName, handler);
    }else {
      elem["on" + eventName] = handler;
    }
  }
};

$.removeEvent = function(elem, eventName, handler){
  if(elem){
    if(elem.removeEventListener){
      return elem.removeEventListener(eventName, handler, false);
    }else if(elem.detachEvent){
      return elem.detachEvent("on" + eventName, handler);
    }else {
      elem["on" + eventName] = null;
    }
  } 
};

$.getEvent = function(event){
  return event ? event : window.event;
};

$.getTarget = function(event){
  return event.target || event.srcElement;
};

$.getRelatedTarget = function(event){
  return event.relatedTarget || event.toElement || event.fromElement || null;
};

$.contains = function(parent, cur){
  while(cur.parentNode){
    if(cur.parentNode === parent){
      return true;
    }
    cur = cur.parentNode;
  }
  return false;
};



$.stopPropagation = function(event){
  if(event.stopPropagation){
    event.stopPropagation();
  }else{
    event.cancleBubble = true;
  }
};

$.get_pos = function(elem){
  if(!elem) return false;
  var left = elem.offsetLeft,
    top = elem.offsetTop,
    current = elem.offsetParent;
  while(current !== null){
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent;
  }
  return {"left": left, "top": top};
};

$.get_dir = function(elem, mouse_pos){
  if(!elem) return false;
  var pos = $.get_pos(elem),
    size = {"width": elem.offsetWidth, "height": elem.offsetHeight},
    dx = mouse_pos.x - pos.left - size.width/2,
    dy = (mouse_pos.y - pos.top - size.height/2)*-1,
    eve_tan = dy/dx,
    tan = size.height/size.width;
  if(dx != 0){
    if(eve_tan > tan*-1 && eve_tan < tan && dx < 0){
      return "left";
    }else if(eve_tan > tan*-1 && eve_tan < tan && dx > 0){
      return "right";
    }else if((eve_tan > tan || eve_tan < tan*-1) && dy > 0){
      return "top";
    }else if((eve_tan > tan || eve_tan < tan*-1) && dy <= 0){
      return "bottom";
    }
  }else if(dy > 0){
    return "top";
  }else {
    return "bottom";
  }
};
Function.prototype.method = function(name, func) {
  if(!this.prototype[name]){
    this.prototype[name] = func;
  }
  return this;
}