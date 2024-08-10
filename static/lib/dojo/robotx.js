/*
	Copyright (c) 2004-2016, The JS Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/robotx",["require","doh/main","./aspect","./dom-construct","./dom-style","./_base/kernel","./_base/lang","./on","./robot","./sniff","./_base/window"],function(_1,_2,_3,_4,_5,_6,_7,on,_8,_9,_a){
_6.experimental("dojo.robotx");
var _b=null;
var _c;
function _d(_e){
_1(["./domReady!"],function(){
var _f={overflow:"hidden",margin:"0px",borderWidth:"0px",height:"100%",width:"100%"};
_5.set(document.documentElement,_f);
_5.set(document.body,_f);
_b=document.createElement("iframe");
_b.setAttribute("ALLOWTRANSPARENCY","true");
_b.scrolling=_9("ie")?"yes":"auto";
var _10=document.compatMode=="BackCompat"?document.body:document.documentElement;
_5.set(_b,{border:"0px none",padding:"0px",margin:"0px",width:"100%",height:"100%"});
_b.src=_e;
if(_b.attachEvent!==undefined){
_b.attachEvent("onload",_11);
}else{
on(_b,"load",_11);
}
_4.place(_b,_a.body(),"first");
});
};
function _11(){
_8._updateDocument();
if(_b.contentWindow.require){
_b.contentWindow.require(["dojo/ready"],function(_12){
_12(Infinity,function(){
setTimeout(function(){
_c.resolve(true);
},500);
});
});
}else{
_c.resolve(true);
}
};
_7.mixin(_8,{_updateDocument:function(){
_6.setContext(_b.contentWindow,_b.contentWindow.document);
_8.window=_b.contentWindow;
_8.doc=_b.contentWindow.document;
var win=_6.global;
if(win.dojo){
_6.publish=win.dojo.publish;
_6.subscribe=win.dojo.subscribe;
_6.connectPublisher=win.dojo.connectPublisher;
}
},initRobot:function(url){
_2.registerGroup("initialize robot",{name:"load "+url,timeout:100000,runTest:function(){
_c=new _2.Deferred();
_d(url);
return _c;
}});
},waitForPageToLoad:function(_13){
_c=new _2.Deferred();
_13();
return _c;
}});
return _8;
});
