//>>built
define("dijit/robotx",["dojo/_base/kernel","dojo/robotx"],function(_1,_2){
_1.experimental("dijit.robotx");
var _3=_2._updateDocument;
_2._updateDocument=function(){
_3();
var _4=_1.global;
if(_4.dijit){
window.dijit=_4.dijit;
}
};
});