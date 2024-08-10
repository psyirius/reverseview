/*
	Copyright (c) 2004-2016, The JS Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/robot",["./_base/array","./dom","./dom-geometry","./_base/kernel","./_base/lang","./_base/window","doh/_browserRunner","doh/robot","./window"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9){
_4.experimental("dojo.robot");
_5.mixin(_8,{_resolveNode:function(n){
if(typeof n=="function"){
n=n();
}
return n?_2.byId(n):null;
},_scrollIntoView:function(n){
var p=null;
_1.forEach(_8._getWindowChain(n),function(w){
var p2=_3.position(n,false),b=_3.getPadBorderExtents(n),_a=null;
if(!p){
p=p2;
}else{
_a=p;
p={x:p.x+p2.x+b.l,y:p.y+p2.y+b.t,w:p.w,h:p.h};
}
_9.scrollIntoView(n,p);
p2=_3.position(n,false);
if(!_a){
p=p2;
}else{
p={x:_a.x+p2.x+b.l,y:_a.y+p2.y+b.t,w:p.w,h:p.h};
}
n=w.frameElement;
});
},_position:function(n){
var p=null,_b=Math.max,_c=Math.min;
_1.forEach(_8._getWindowChain(n),function(w){
var p2=_3.position(n,false),b=_3.getPadBorderExtents(n);
if(!p){
p=p2;
}else{
var _d=_9.getBox(n.contentWindow.document);
p2.r=p2.x+_d.w;
p2.b=p2.y+_d.h;
p={x:_b(p.x+p2.x,p2.x)+b.l,y:_b(p.y+p2.y,p2.y)+b.t,r:_c(p.x+p2.x+p.w,p2.r)+b.l,b:_c(p.y+p2.y+p.h,p2.b)+b.t};
p.w=p.r-p.x;
p.h=p.b-p.y;
}
n=w.frameElement;
});
return p;
},_getWindowChain:function(n){
var cW=_9.get(n.ownerDocument);
var _e=[cW];
var f=cW.frameElement;
return (cW==_6.global||!f)?_e:_e.concat(_8._getWindowChain(f));
},scrollIntoView:function(_f,_10){
_8.sequence(function(){
_8._scrollIntoView(_8._resolveNode(_f));
},_10);
},mouseMoveAt:function(_11,_12,_13,_14,_15){
_8._assertRobot();
var _16={};
this.sequence(function(){
_11=_8._resolveNode(_11);
_8._scrollIntoView(_11);
var pos=_8._position(_11);
if(_15===undefined){
_14=pos.w/2;
_15=pos.h/2;
}
_16.x=pos.x+_14;
_16.y=pos.y+_15;
},_12);
this.mouseMoveTo(_16,0,_13,false);
}});
return _8;
});
