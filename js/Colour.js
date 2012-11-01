/*

Colour.js

Objects for handling and processing colours

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

function Colour(){
this.getIntegerRGB=function(){
var _1=this.getRGB();
return {"r":Math.round(_1.r),"g":Math.round(_1.g),"b":Math.round(_1.b),"a":_1.a};
};
this.getPercentageRGB=function(){
var _2=this.getRGB();
return {"r":100*_2.r/255,"g":100*_2.g/255,"b":100*_2.b/255,"a":_2.a};
};
this.getCSSHexadecimalRGB=function(){
var _3=this.getIntegerRGB();
var _4=_3.r.toString(16);
var _5=_3.g.toString(16);
var _6=_3.b.toString(16);
return "#"+(_4.length==2?_4:"0"+_4)+(_5.length==2?_5:"0"+_5)+(_6.length==2?_6:"0"+_6);
};
this.getCSSIntegerRGB=function(){
var _7=this.getIntegerRGB();
return "rgb("+_7.r+","+_7.g+","+_7.b+")";
};
this.getCSSIntegerRGBA=function(){
var _8=this.getIntegerRGB();
return "rgb("+_8.r+","+_8.g+","+_8.b+","+_8.a+")";
};
this.getCSSPercentageRGB=function(){
var _9=this.getPercentageRGB();
return "rgb("+_9.r+"%,"+_9.g+"%,"+_9.b+"%)";
};
this.getCSSPercentageRGBA=function(){
var _a=this.getPercentageRGB();
return "rgb("+_a.r+"%,"+_a.g+"%,"+_a.b+"%,"+_a.a+")";
};
this.getCSSHSL=function(){
var _b=this.getHSL();
return "hsl("+_b.h+","+_b.s+"%,"+_b.l+"%)";
};
this.getCSSHSLA=function(){
var _c=this.getHSL();
return "hsl("+_c.h+","+_c.s+"%,"+_c.l+"%,"+_c.a+")";
};
this.setNodeColour=function(_d){
_d.style.color=this.getCSSHexadecimalRGB();
};
this.setNodeBackgroundColour=function(_e){
_e.style.backgroundColor=this.getCSSHexadecimalRGB();
};
};
RGBColour.prototype=new Colour();
function RGBColour(r,g,b,a){
var _f=(a===undefined?1:Math.max(0,Math.min(1,a)));
var rgb={"r":Math.max(0,Math.min(255,r)),"g":Math.max(0,Math.min(255,g)),"b":Math.max(0,Math.min(255,b))};
var hsv=null;
var hsl=null;
function _10(_11,_12){
if(_12==0){
var hue=0;
}else{
switch(_11){
case rgb.r:
var hue=(rgb.g-rgb.b)/_12*60;
if(hue<0){
hue+=360;
}
break;
case rgb.g:
var hue=(rgb.b-rgb.r)/_12*60+120;
break;
case rgb.b:
var hue=(rgb.r-rgb.g)/_12*60+240;
break;
}
}
return hue;
};
function _13(){
var _14=Math.max(rgb.r,rgb.g,rgb.b);
var _15=_14-Math.min(rgb.r,rgb.g,rgb.b);
hsv={"h":_10(_14,_15),"s":(_14==0?0:100*_15/_14),"v":_14/2.55};
};
function _16(){
var _17=Math.max(rgb.r,rgb.g,rgb.b);
var _18=_17-Math.min(rgb.r,rgb.g,rgb.b);
var l=_17/255-_18/510;
hsl={"h":_10(_17,_18),"s":(_18==0?0:_18/2.55/(l<0.5?l*2:2-l*2)),"l":100*l};
};
this.getRGB=function(){
return {"r":rgb.r,"g":rgb.g,"b":rgb.b,"a":_f};
};
this.getHSV=function(){
if(hsv==null){
_13();
}
return {"h":hsv.h,"s":hsv.s,"v":hsv.v,"a":_f};
};
this.getHSL=function(){
if(hsl==null){
_16();
}
return {"h":hsl.h,"s":hsl.s,"l":hsl.l,"a":_f};
};
};
HSVColour.prototype=new Colour();
function HSVColour(h,s,v,a){
var _19=(a===undefined?1:Math.max(0,Math.min(1,a)));
var hsv={"h":(h%360+360)%360,"s":Math.max(0,Math.min(100,s)),"v":Math.max(0,Math.min(100,v))};
var rgb=null;
var hsl=null;
function _1a(){
if(hsv.s==0){
var r=hsv.v;
var g=hsv.v;
var b=hsv.v;
}else{
var f=hsv.h/60-Math.floor(hsv.h/60);
var p=hsv.v*(1-hsv.s/100);
var q=hsv.v*(1-hsv.s/100*f);
var t=hsv.v*(1-hsv.s/100*(1-f));
switch(Math.floor(hsv.h/60)){
case 0:
var r=hsv.v;
var g=t;
var b=p;
break;
case 1:
var r=q;
var g=hsv.v;
var b=p;
break;
case 2:
var r=p;
var g=hsv.v;
var b=t;
break;
case 3:
var r=p;
var g=q;
var b=hsv.v;
break;
case 4:
var r=t;
var g=p;
var b=hsv.v;
break;
case 5:
var r=hsv.v;
var g=p;
var b=q;
break;
}
}
rgb={"r":r*2.55,"g":g*2.55,"b":b*2.55};
};
function _1b(){
var l=(2-hsv.s/100)*hsv.v/2;
hsl={"h":hsv.h,"s":hsv.s*hsv.v/(l<50?l*2:200-l*2),"l":l};
if(isNaN(hsl.s)){
hsl.s=0;
}
};
this.getRGB=function(){
if(rgb==null){
_1a();
}
return {"r":rgb.r,"g":rgb.g,"b":rgb.b,"a":_19};
};
this.getHSV=function(){
return {"h":hsv.h,"s":hsv.s,"v":hsv.v,"a":_19};
};
this.getHSL=function(){
if(hsl==null){
_1b();
}
return {"h":hsl.h,"s":hsl.s,"l":hsl.l,"a":_19};
};
};
HSLColour.prototype=new Colour();
function HSLColour(h,s,l,a){
var _1c=(a===undefined?1:Math.max(0,Math.min(1,a)));
var hsl={"h":(h%360+360)%360,"s":Math.max(0,Math.min(100,s)),"l":Math.max(0,Math.min(100,l))};
var rgb=null;
var hsv=null;
function _1d(){
if(hsl.s==0){
rgb={"r":hsl.l*2.55,"g":hsl.l*2.55,"b":hsl.l*2.55};
}else{
var p=hsl.l<50?hsl.l*(1+hsl.s/100):hsl.l+hsl.s-hsl.l*hsl.s/100;
var q=2*hsl.l-p;
rgb={"r":(h+120)/60%6,"g":h/60,"b":(h+240)/60%6};
for(var key in rgb){
if(rgb.hasOwnProperty(key)){
if(rgb[key]<1){
rgb[key]=q+(p-q)*rgb[key];
}else{
if(rgb[key]<3){
rgb[key]=p;
}else{
if(rgb[key]<4){
rgb[key]=q+(p-q)*(4-rgb[key]);
}else{
rgb[key]=q;
}
}
}
rgb[key]*=2.55;
}
}
}
};
function _1e(){
var t=hsl.s*(hsl.l<50?hsl.l:100-hsl.l)/100;
hsv={"h":hsl.h,"s":200*t/(hsl.l+t),"v":t+hsl.l};
if(isNaN(hsv.s)){
hsv.s=0;
}
};
this.getRGB=function(){
if(rgb==null){
_1d();
}
return {"r":rgb.r,"g":rgb.g,"b":rgb.b,"a":_1c};
};
this.getHSV=function(){
if(hsv==null){
_1e();
}
return {"h":hsv.h,"s":hsv.s,"v":hsv.v,"a":_1c};
};
this.getHSL=function(){
return {"h":hsl.h,"s":hsl.s,"l":hsl.l,"a":_1c};
};
};
