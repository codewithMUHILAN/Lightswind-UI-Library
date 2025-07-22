(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('troika-worker-utils'), require('webgl-sdf-generator'), require('bidi-js'), require('troika-three-utils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'three', 'troika-worker-utils', 'webgl-sdf-generator', 'bidi-js', 'troika-three-utils'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.troika_three_text = {}, global.THREE, global.troika_worker_utils, global.webgl_sdf_generator, global.bidi_js, global.troika_three_utils));
}(this, (function (exports, three, troikaWorkerUtils, createSDFGenerator, bidiFactory, troikaThreeUtils) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var createSDFGenerator__default = /*#__PURE__*/_interopDefaultLegacy(createSDFGenerator);
  var bidiFactory__default = /*#__PURE__*/_interopDefaultLegacy(bidiFactory);

  /*!
  Custom build of Typr.ts (https://github.com/fredli74/Typr.ts) for use in Troika text rendering.
  Original MIT license applies: https://github.com/fredli74/Typr.ts/blob/master/LICENSE
  */
  function typrFactory(){return "undefined"==typeof window&&(self.window=self),function(r){var e={parse:function(r){var t=e._bin,a=new Uint8Array(r);if("ttcf"==t.readASCII(a,0,4)){var n=4;t.readUshort(a,n),n+=2,t.readUshort(a,n),n+=2;var o=t.readUint(a,n);n+=4;for(var s=[],i=0;i<o;i++){var h=t.readUint(a,n);n+=4,s.push(e._readFont(a,h));}return s}return [e._readFont(a,0)]},_readFont:function(r,t){var a=e._bin,n=t;a.readFixed(r,t),t+=4;var o=a.readUshort(r,t);t+=2,a.readUshort(r,t),t+=2,a.readUshort(r,t),t+=2,a.readUshort(r,t),t+=2;for(var s=["cmap","head","hhea","maxp","hmtx","name","OS/2","post","loca","glyf","kern","CFF ","GDEF","GPOS","GSUB","SVG "],i={_data:r,_offset:n},h={},d=0;d<o;d++){var f=a.readASCII(r,t,4);t+=4,a.readUint(r,t),t+=4;var u=a.readUint(r,t);t+=4;var l=a.readUint(r,t);t+=4,h[f]={offset:u,length:l};}for(d=0;d<s.length;d++){var v=s[d];h[v]&&(i[v.trim()]=e[v.trim()].parse(r,h[v].offset,h[v].length,i));}return i},_tabOffset:function(r,t,a){for(var n=e._bin,o=n.readUshort(r,a+4),s=a+12,i=0;i<o;i++){var h=n.readASCII(r,s,4);s+=4,n.readUint(r,s),s+=4;var d=n.readUint(r,s);if(s+=4,n.readUint(r,s),s+=4,h==t)return d}return 0}};e._bin={readFixed:function(r,e){return (r[e]<<8|r[e+1])+(r[e+2]<<8|r[e+3])/65540},readF2dot14:function(r,t){return e._bin.readShort(r,t)/16384},readInt:function(r,t){return e._bin._view(r).getInt32(t)},readInt8:function(r,t){return e._bin._view(r).getInt8(t)},readShort:function(r,t){return e._bin._view(r).getInt16(t)},readUshort:function(r,t){return e._bin._view(r).getUint16(t)},readUshorts:function(r,t,a){for(var n=[],o=0;o<a;o++)n.push(e._bin.readUshort(r,t+2*o));return n},readUint:function(r,t){return e._bin._view(r).getUint32(t)},readUint64:function(r,t){return 4294967296*e._bin.readUint(r,t)+e._bin.readUint(r,t+4)},readASCII:function(r,e,t){for(var a="",n=0;n<t;n++)a+=String.fromCharCode(r[e+n]);return a},readUnicode:function(r,e,t){for(var a="",n=0;n<t;n++){var o=r[e++]<<8|r[e++];a+=String.fromCharCode(o);}return a},_tdec:"undefined"!=typeof window&&window.TextDecoder?new window.TextDecoder:null,readUTF8:function(r,t,a){var n=e._bin._tdec;return n&&0==t&&a==r.length?n.decode(r):e._bin.readASCII(r,t,a)},readBytes:function(r,e,t){for(var a=[],n=0;n<t;n++)a.push(r[e+n]);return a},readASCIIArray:function(r,e,t){for(var a=[],n=0;n<t;n++)a.push(String.fromCharCode(r[e+n]));return a},_view:function(r){return r._dataView||(r._dataView=r.buffer?new DataView(r.buffer,r.byteOffset,r.byteLength):new DataView(new Uint8Array(r).buffer))}},e._lctf={},e._lctf.parse=function(r,t,a,n,o){var s=e._bin,i={},h=t;s.readFixed(r,t),t+=4;var d=s.readUshort(r,t);t+=2;var f=s.readUshort(r,t);t+=2;var u=s.readUshort(r,t);return t+=2,i.scriptList=e._lctf.readScriptList(r,h+d),i.featureList=e._lctf.readFeatureList(r,h+f),i.lookupList=e._lctf.readLookupList(r,h+u,o),i},e._lctf.readLookupList=function(r,t,a){var n=e._bin,o=t,s=[],i=n.readUshort(r,t);t+=2;for(var h=0;h<i;h++){var d=n.readUshort(r,t);t+=2;var f=e._lctf.readLookupTable(r,o+d,a);s.push(f);}return s},e._lctf.readLookupTable=function(r,t,a){var n=e._bin,o=t,s={tabs:[]};s.ltype=n.readUshort(r,t),t+=2,s.flag=n.readUshort(r,t),t+=2;var i=n.readUshort(r,t);t+=2;for(var h=s.ltype,d=0;d<i;d++){var f=n.readUshort(r,t);t+=2;var u=a(r,h,o+f,s);s.tabs.push(u);}return s},e._lctf.numOfOnes=function(r){for(var e=0,t=0;t<32;t++)0!=(r>>>t&1)&&e++;return e},e._lctf.readClassDef=function(r,t){var a=e._bin,n=[],o=a.readUshort(r,t);if(t+=2,1==o){var s=a.readUshort(r,t);t+=2;var i=a.readUshort(r,t);t+=2;for(var h=0;h<i;h++)n.push(s+h),n.push(s+h),n.push(a.readUshort(r,t)),t+=2;}if(2==o){var d=a.readUshort(r,t);t+=2;for(h=0;h<d;h++)n.push(a.readUshort(r,t)),t+=2,n.push(a.readUshort(r,t)),t+=2,n.push(a.readUshort(r,t)),t+=2;}return n},e._lctf.getInterval=function(r,e){for(var t=0;t<r.length;t+=3){var a=r[t],n=r[t+1];if(r[t+2],a<=e&&e<=n)return t}return -1},e._lctf.readCoverage=function(r,t){var a=e._bin,n={};n.fmt=a.readUshort(r,t),t+=2;var o=a.readUshort(r,t);return t+=2,1==n.fmt&&(n.tab=a.readUshorts(r,t,o)),2==n.fmt&&(n.tab=a.readUshorts(r,t,3*o)),n},e._lctf.coverageIndex=function(r,t){var a=r.tab;if(1==r.fmt)return a.indexOf(t);if(2==r.fmt){var n=e._lctf.getInterval(a,t);if(-1!=n)return a[n+2]+(t-a[n])}return -1},e._lctf.readFeatureList=function(r,t){var a=e._bin,n=t,o=[],s=a.readUshort(r,t);t+=2;for(var i=0;i<s;i++){var h=a.readASCII(r,t,4);t+=4;var d=a.readUshort(r,t);t+=2;var f=e._lctf.readFeatureTable(r,n+d);f.tag=h.trim(),o.push(f);}return o},e._lctf.readFeatureTable=function(r,t){var a=e._bin,n=t,o={},s=a.readUshort(r,t);t+=2,s>0&&(o.featureParams=n+s);var i=a.readUshort(r,t);t+=2,o.tab=[];for(var h=0;h<i;h++)o.tab.push(a.readUshort(r,t+2*h));return o},e._lctf.readScriptList=function(r,t){var a=e._bin,n=t,o={},s=a.readUshort(r,t);t+=2;for(var i=0;i<s;i++){var h=a.readASCII(r,t,4);t+=4;var d=a.readUshort(r,t);t+=2,o[h.trim()]=e._lctf.readScriptTable(r,n+d);}return o},e._lctf.readScriptTable=function(r,t){var a=e._bin,n=t,o={},s=a.readUshort(r,t);t+=2,s>0&&(o.default=e._lctf.readLangSysTable(r,n+s));var i=a.readUshort(r,t);t+=2;for(var h=0;h<i;h++){var d=a.readASCII(r,t,4);t+=4;var f=a.readUshort(r,t);t+=2,o[d.trim()]=e._lctf.readLangSysTable(r,n+f);}return o},e._lctf.readLangSysTable=function(r,t){var a=e._bin,n={};a.readUshort(r,t),t+=2,n.reqFeature=a.readUshort(r,t),t+=2;var o=a.readUshort(r,t);return t+=2,n.features=a.readUshorts(r,t,o),n},e.CFF={},e.CFF.parse=function(r,t,a){var n=e._bin;(r=new Uint8Array(r.buffer,t,a))[t=0],r[++t],r[++t],r[++t],t++;var o=[];t=e.CFF.readIndex(r,t,o);for(var s=[],i=0;i<o.length-1;i++)s.push(n.readASCII(r,t+o[i],o[i+1]-o[i]));t+=o[o.length-1];var h=[];t=e.CFF.readIndex(r,t,h);var d=[];for(i=0;i<h.length-1;i++)d.push(e.CFF.readDict(r,t+h[i],t+h[i+1]));t+=h[h.length-1];var f=d[0],u=[];t=e.CFF.readIndex(r,t,u);var l=[];for(i=0;i<u.length-1;i++)l.push(n.readASCII(r,t+u[i],u[i+1]-u[i]));if(t+=u[u.length-1],e.CFF.readSubrs(r,t,f),f.CharStrings){t=f.CharStrings;u=[];t=e.CFF.readIndex(r,t,u);var v=[];for(i=0;i<u.length-1;i++)v.push(n.readBytes(r,t+u[i],u[i+1]-u[i]));f.CharStrings=v;}if(f.ROS){t=f.FDArray;var c=[];t=e.CFF.readIndex(r,t,c),f.FDArray=[];for(i=0;i<c.length-1;i++){var p=e.CFF.readDict(r,t+c[i],t+c[i+1]);e.CFF._readFDict(r,p,l),f.FDArray.push(p);}t+=c[c.length-1],t=f.FDSelect,f.FDSelect=[];var U=r[t];if(t++,3!=U)throw U;var g=n.readUshort(r,t);t+=2;for(i=0;i<g+1;i++)f.FDSelect.push(n.readUshort(r,t),r[t+2]),t+=3;}return f.Encoding&&(f.Encoding=e.CFF.readEncoding(r,f.Encoding,f.CharStrings.length)),f.charset&&(f.charset=e.CFF.readCharset(r,f.charset,f.CharStrings.length)),e.CFF._readFDict(r,f,l),f},e.CFF._readFDict=function(r,t,a){var n;for(var o in t.Private&&(n=t.Private[1],t.Private=e.CFF.readDict(r,n,n+t.Private[0]),t.Private.Subrs&&e.CFF.readSubrs(r,n+t.Private.Subrs,t.Private)),t)-1!=["FamilyName","FontName","FullName","Notice","version","Copyright"].indexOf(o)&&(t[o]=a[t[o]-426+35]);},e.CFF.readSubrs=function(r,t,a){var n=e._bin,o=[];t=e.CFF.readIndex(r,t,o);var s,i=o.length;s=i<1240?107:i<33900?1131:32768,a.Bias=s,a.Subrs=[];for(var h=0;h<o.length-1;h++)a.Subrs.push(n.readBytes(r,t+o[h],o[h+1]-o[h]));},e.CFF.tableSE=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,0,111,112,113,114,0,115,116,117,118,119,120,121,122,0,123,0,124,125,126,127,128,129,130,131,0,132,133,0,134,135,136,137,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,138,0,139,0,0,0,0,140,141,142,143,0,0,0,0,0,144,0,0,0,145,0,0,146,147,148,149,0,0,0,0],e.CFF.glyphByUnicode=function(r,e){for(var t=0;t<r.charset.length;t++)if(r.charset[t]==e)return t;return -1},e.CFF.glyphBySE=function(r,t){return t<0||t>255?-1:e.CFF.glyphByUnicode(r,e.CFF.tableSE[t])},e.CFF.readEncoding=function(r,t,a){e._bin;var n=[".notdef"],o=r[t];if(t++,0!=o)throw "error: unknown encoding format: "+o;var s=r[t];t++;for(var i=0;i<s;i++)n.push(r[t+i]);return n},e.CFF.readCharset=function(r,t,a){var n=e._bin,o=[".notdef"],s=r[t];if(t++,0==s)for(var i=0;i<a;i++){var h=n.readUshort(r,t);t+=2,o.push(h);}else {if(1!=s&&2!=s)throw "error: format: "+s;for(;o.length<a;){h=n.readUshort(r,t);t+=2;var d=0;1==s?(d=r[t],t++):(d=n.readUshort(r,t),t+=2);for(i=0;i<=d;i++)o.push(h),h++;}}return o},e.CFF.readIndex=function(r,t,a){var n=e._bin,o=n.readUshort(r,t)+1,s=r[t+=2];if(t++,1==s)for(var i=0;i<o;i++)a.push(r[t+i]);else if(2==s)for(i=0;i<o;i++)a.push(n.readUshort(r,t+2*i));else if(3==s)for(i=0;i<o;i++)a.push(16777215&n.readUint(r,t+3*i-1));else if(1!=o)throw "unsupported offset size: "+s+", count: "+o;return (t+=o*s)-1},e.CFF.getCharString=function(r,t,a){var n=e._bin,o=r[t],s=r[t+1];r[t+2],r[t+3],r[t+4];var i=1,h=null,d=null;o<=20&&(h=o,i=1),12==o&&(h=100*o+s,i=2),21<=o&&o<=27&&(h=o,i=1),28==o&&(d=n.readShort(r,t+1),i=3),29<=o&&o<=31&&(h=o,i=1),32<=o&&o<=246&&(d=o-139,i=1),247<=o&&o<=250&&(d=256*(o-247)+s+108,i=2),251<=o&&o<=254&&(d=256*-(o-251)-s-108,i=2),255==o&&(d=n.readInt(r,t+1)/65535,i=5),a.val=null!=d?d:"o"+h,a.size=i;},e.CFF.readCharString=function(r,t,a){for(var n=t+a,o=e._bin,s=[];t<n;){var i=r[t],h=r[t+1];r[t+2],r[t+3],r[t+4];var d=1,f=null,u=null;i<=20&&(f=i,d=1),12==i&&(f=100*i+h,d=2),19!=i&&20!=i||(f=i,d=2),21<=i&&i<=27&&(f=i,d=1),28==i&&(u=o.readShort(r,t+1),d=3),29<=i&&i<=31&&(f=i,d=1),32<=i&&i<=246&&(u=i-139,d=1),247<=i&&i<=250&&(u=256*(i-247)+h+108,d=2),251<=i&&i<=254&&(u=256*-(i-251)-h-108,d=2),255==i&&(u=o.readInt(r,t+1)/65535,d=5),s.push(null!=u?u:"o"+f),t+=d;}return s},e.CFF.readDict=function(r,t,a){for(var n=e._bin,o={},s=[];t<a;){var i=r[t],h=r[t+1];r[t+2],r[t+3],r[t+4];var d=1,f=null,u=null;if(28==i&&(u=n.readShort(r,t+1),d=3),29==i&&(u=n.readInt(r,t+1),d=5),32<=i&&i<=246&&(u=i-139,d=1),247<=i&&i<=250&&(u=256*(i-247)+h+108,d=2),251<=i&&i<=254&&(u=256*-(i-251)-h-108,d=2),255==i)throw u=n.readInt(r,t+1)/65535,d=5,"unknown number";if(30==i){var l=[];for(d=1;;){var v=r[t+d];d++;var c=v>>4,p=15&v;if(15!=c&&l.push(c),15!=p&&l.push(p),15==p)break}for(var U="",g=[0,1,2,3,4,5,6,7,8,9,".","e","e-","reserved","-","endOfNumber"],S=0;S<l.length;S++)U+=g[l[S]];u=parseFloat(U);}if(i<=21)if(f=["version","Notice","FullName","FamilyName","Weight","FontBBox","BlueValues","OtherBlues","FamilyBlues","FamilyOtherBlues","StdHW","StdVW","escape","UniqueID","XUID","charset","Encoding","CharStrings","Private","Subrs","defaultWidthX","nominalWidthX"][i],d=1,12==i)f=["Copyright","isFixedPitch","ItalicAngle","UnderlinePosition","UnderlineThickness","PaintType","CharstringType","FontMatrix","StrokeWidth","BlueScale","BlueShift","BlueFuzz","StemSnapH","StemSnapV","ForceBold",0,0,"LanguageGroup","ExpansionFactor","initialRandomSeed","SyntheticBase","PostScript","BaseFontName","BaseFontBlend",0,0,0,0,0,0,"ROS","CIDFontVersion","CIDFontRevision","CIDFontType","CIDCount","UIDBase","FDArray","FDSelect","FontName"][h],d=2;null!=f?(o[f]=1==s.length?s[0]:s,s=[]):s.push(u),t+=d;}return o},e.cmap={},e.cmap.parse=function(r,t,a){r=new Uint8Array(r.buffer,t,a),t=0;var n=e._bin,o={};n.readUshort(r,t),t+=2;var s=n.readUshort(r,t);t+=2;var i=[];o.tables=[];for(var h=0;h<s;h++){var d=n.readUshort(r,t);t+=2;var f=n.readUshort(r,t);t+=2;var u=n.readUint(r,t);t+=4;var l="p"+d+"e"+f,v=i.indexOf(u);if(-1==v){var c;v=o.tables.length,i.push(u);var p=n.readUshort(r,u);0==p?c=e.cmap.parse0(r,u):4==p?c=e.cmap.parse4(r,u):6==p?c=e.cmap.parse6(r,u):12==p?c=e.cmap.parse12(r,u):console.debug("unknown format: "+p,d,f,u),o.tables.push(c);}if(null!=o[l])throw "multiple tables for one platform+encoding";o[l]=v;}return o},e.cmap.parse0=function(r,t){var a=e._bin,n={};n.format=a.readUshort(r,t),t+=2;var o=a.readUshort(r,t);t+=2,a.readUshort(r,t),t+=2,n.map=[];for(var s=0;s<o-6;s++)n.map.push(r[t+s]);return n},e.cmap.parse4=function(r,t){var a=e._bin,n=t,o={};o.format=a.readUshort(r,t),t+=2;var s=a.readUshort(r,t);t+=2,a.readUshort(r,t),t+=2;var i=a.readUshort(r,t);t+=2;var h=i/2;o.searchRange=a.readUshort(r,t),t+=2,o.entrySelector=a.readUshort(r,t),t+=2,o.rangeShift=a.readUshort(r,t),t+=2,o.endCount=a.readUshorts(r,t,h),t+=2*h,t+=2,o.startCount=a.readUshorts(r,t,h),t+=2*h,o.idDelta=[];for(var d=0;d<h;d++)o.idDelta.push(a.readShort(r,t)),t+=2;for(o.idRangeOffset=a.readUshorts(r,t,h),t+=2*h,o.glyphIdArray=[];t<n+s;)o.glyphIdArray.push(a.readUshort(r,t)),t+=2;return o},e.cmap.parse6=function(r,t){var a=e._bin,n={};n.format=a.readUshort(r,t),t+=2,a.readUshort(r,t),t+=2,a.readUshort(r,t),t+=2,n.firstCode=a.readUshort(r,t),t+=2;var o=a.readUshort(r,t);t+=2,n.glyphIdArray=[];for(var s=0;s<o;s++)n.glyphIdArray.push(a.readUshort(r,t)),t+=2;return n},e.cmap.parse12=function(r,t){var a=e._bin,n={};n.format=a.readUshort(r,t),t+=2,t+=2,a.readUint(r,t),t+=4,a.readUint(r,t),t+=4;var o=a.readUint(r,t);t+=4,n.groups=[];for(var s=0;s<o;s++){var i=t+12*s,h=a.readUint(r,i+0),d=a.readUint(r,i+4),f=a.readUint(r,i+8);n.groups.push([h,d,f]);}return n},e.glyf={},e.glyf.parse=function(r,e,t,a){for(var n=[],o=0;o<a.maxp.numGlyphs;o++)n.push(null);return n},e.glyf._parseGlyf=function(r,t){var a=e._bin,n=r._data,o=e._tabOffset(n,"glyf",r._offset)+r.loca[t];if(r.loca[t]==r.loca[t+1])return null;var s={};if(s.noc=a.readShort(n,o),o+=2,s.xMin=a.readShort(n,o),o+=2,s.yMin=a.readShort(n,o),o+=2,s.xMax=a.readShort(n,o),o+=2,s.yMax=a.readShort(n,o),o+=2,s.xMin>=s.xMax||s.yMin>=s.yMax)return null;if(s.noc>0){s.endPts=[];for(var i=0;i<s.noc;i++)s.endPts.push(a.readUshort(n,o)),o+=2;var h=a.readUshort(n,o);if(o+=2,n.length-o<h)return null;s.instructions=a.readBytes(n,o,h),o+=h;var d=s.endPts[s.noc-1]+1;s.flags=[];for(i=0;i<d;i++){var f=n[o];if(o++,s.flags.push(f),0!=(8&f)){var u=n[o];o++;for(var l=0;l<u;l++)s.flags.push(f),i++;}}s.xs=[];for(i=0;i<d;i++){var v=0!=(2&s.flags[i]),c=0!=(16&s.flags[i]);v?(s.xs.push(c?n[o]:-n[o]),o++):c?s.xs.push(0):(s.xs.push(a.readShort(n,o)),o+=2);}s.ys=[];for(i=0;i<d;i++){v=0!=(4&s.flags[i]),c=0!=(32&s.flags[i]);v?(s.ys.push(c?n[o]:-n[o]),o++):c?s.ys.push(0):(s.ys.push(a.readShort(n,o)),o+=2);}var p=0,U=0;for(i=0;i<d;i++)p+=s.xs[i],U+=s.ys[i],s.xs[i]=p,s.ys[i]=U;}else {var g;s.parts=[];do{g=a.readUshort(n,o),o+=2;var S={m:{a:1,b:0,c:0,d:1,tx:0,ty:0},p1:-1,p2:-1};if(s.parts.push(S),S.glyphIndex=a.readUshort(n,o),o+=2,1&g){var m=a.readShort(n,o);o+=2;var b=a.readShort(n,o);o+=2;}else {m=a.readInt8(n,o);o++;b=a.readInt8(n,o);o++;}2&g?(S.m.tx=m,S.m.ty=b):(S.p1=m,S.p2=b),8&g?(S.m.a=S.m.d=a.readF2dot14(n,o),o+=2):64&g?(S.m.a=a.readF2dot14(n,o),o+=2,S.m.d=a.readF2dot14(n,o),o+=2):128&g&&(S.m.a=a.readF2dot14(n,o),o+=2,S.m.b=a.readF2dot14(n,o),o+=2,S.m.c=a.readF2dot14(n,o),o+=2,S.m.d=a.readF2dot14(n,o),o+=2);}while(32&g);if(256&g){var y=a.readUshort(n,o);o+=2,s.instr=[];for(i=0;i<y;i++)s.instr.push(n[o]),o++;}}return s},e.GDEF={},e.GDEF.parse=function(r,t,a,n){var o=t;t+=4;var s=e._bin.readUshort(r,t);return {glyphClassDef:0===s?null:e._lctf.readClassDef(r,o+s)}},e.GPOS={},e.GPOS.parse=function(r,t,a,n){return e._lctf.parse(r,t,a,n,e.GPOS.subt)},e.GPOS.subt=function(r,t,a,n){var o=e._bin,s=a,i={};if(i.fmt=o.readUshort(r,a),a+=2,1==t||2==t||3==t||7==t||8==t&&i.fmt<=2){var h=o.readUshort(r,a);a+=2,i.coverage=e._lctf.readCoverage(r,h+s);}if(1==t&&1==i.fmt){var d=o.readUshort(r,a);a+=2,0!=d&&(i.pos=e.GPOS.readValueRecord(r,a,d));}else if(2==t&&i.fmt>=1&&i.fmt<=2){d=o.readUshort(r,a);a+=2;var f=o.readUshort(r,a);a+=2;var u=e._lctf.numOfOnes(d),l=e._lctf.numOfOnes(f);if(1==i.fmt){i.pairsets=[];var v=o.readUshort(r,a);a+=2;for(var c=0;c<v;c++){var p=s+o.readUshort(r,a);a+=2;var U=o.readUshort(r,p);p+=2;for(var g=[],S=0;S<U;S++){var m=o.readUshort(r,p);p+=2,0!=d&&(P=e.GPOS.readValueRecord(r,p,d),p+=2*u),0!=f&&(x=e.GPOS.readValueRecord(r,p,f),p+=2*l),g.push({gid2:m,val1:P,val2:x});}i.pairsets.push(g);}}if(2==i.fmt){var b=o.readUshort(r,a);a+=2;var y=o.readUshort(r,a);a+=2;var F=o.readUshort(r,a);a+=2;var C=o.readUshort(r,a);a+=2,i.classDef1=e._lctf.readClassDef(r,s+b),i.classDef2=e._lctf.readClassDef(r,s+y),i.matrix=[];for(c=0;c<F;c++){var _=[];for(S=0;S<C;S++){var P=null,x=null;0!=d&&(P=e.GPOS.readValueRecord(r,a,d),a+=2*u),0!=f&&(x=e.GPOS.readValueRecord(r,a,f),a+=2*l),_.push({val1:P,val2:x});}i.matrix.push(_);}}}else if(4==t&&1==i.fmt)i.markCoverage=e._lctf.readCoverage(r,o.readUshort(r,a)+s),i.baseCoverage=e._lctf.readCoverage(r,o.readUshort(r,a+2)+s),i.markClassCount=o.readUshort(r,a+4),i.markArray=e.GPOS.readMarkArray(r,o.readUshort(r,a+6)+s),i.baseArray=e.GPOS.readBaseArray(r,o.readUshort(r,a+8)+s,i.markClassCount);else if(6==t&&1==i.fmt)i.mark1Coverage=e._lctf.readCoverage(r,o.readUshort(r,a)+s),i.mark2Coverage=e._lctf.readCoverage(r,o.readUshort(r,a+2)+s),i.markClassCount=o.readUshort(r,a+4),i.mark1Array=e.GPOS.readMarkArray(r,o.readUshort(r,a+6)+s),i.mark2Array=e.GPOS.readBaseArray(r,o.readUshort(r,a+8)+s,i.markClassCount);else {if(9==t&&1==i.fmt){var I=o.readUshort(r,a);a+=2;var w=o.readUint(r,a);if(a+=4,9==n.ltype)n.ltype=I;else if(n.ltype!=I)throw "invalid extension substitution";return e.GPOS.subt(r,n.ltype,s+w)}console.debug("unsupported GPOS table LookupType",t,"format",i.fmt);}return i},e.GPOS.readValueRecord=function(r,t,a){var n=e._bin,o=[];return o.push(1&a?n.readShort(r,t):0),t+=1&a?2:0,o.push(2&a?n.readShort(r,t):0),t+=2&a?2:0,o.push(4&a?n.readShort(r,t):0),t+=4&a?2:0,o.push(8&a?n.readShort(r,t):0),t+=8&a?2:0,o},e.GPOS.readBaseArray=function(r,t,a){var n=e._bin,o=[],s=t,i=n.readUshort(r,t);t+=2;for(var h=0;h<i;h++){for(var d=[],f=0;f<a;f++)d.push(e.GPOS.readAnchorRecord(r,s+n.readUshort(r,t))),t+=2;o.push(d);}return o},e.GPOS.readMarkArray=function(r,t){var a=e._bin,n=[],o=t,s=a.readUshort(r,t);t+=2;for(var i=0;i<s;i++){var h=e.GPOS.readAnchorRecord(r,a.readUshort(r,t+2)+o);h.markClass=a.readUshort(r,t),n.push(h),t+=4;}return n},e.GPOS.readAnchorRecord=function(r,t){var a=e._bin,n={};return n.fmt=a.readUshort(r,t),n.x=a.readShort(r,t+2),n.y=a.readShort(r,t+4),n},e.GSUB={},e.GSUB.parse=function(r,t,a,n){return e._lctf.parse(r,t,a,n,e.GSUB.subt)},e.GSUB.subt=function(r,t,a,n){var o=e._bin,s=a,i={};if(i.fmt=o.readUshort(r,a),a+=2,1!=t&&2!=t&&4!=t&&5!=t&&6!=t)return null;if(1==t||2==t||4==t||5==t&&i.fmt<=2||6==t&&i.fmt<=2){var h=o.readUshort(r,a);a+=2,i.coverage=e._lctf.readCoverage(r,s+h);}if(1==t&&i.fmt>=1&&i.fmt<=2){if(1==i.fmt)i.delta=o.readShort(r,a),a+=2;else if(2==i.fmt){var d=o.readUshort(r,a);a+=2,i.newg=o.readUshorts(r,a,d),a+=2*i.newg.length;}}else if(2==t&&1==i.fmt){d=o.readUshort(r,a);a+=2,i.seqs=[];for(var f=0;f<d;f++){var u=o.readUshort(r,a)+s;a+=2;var l=o.readUshort(r,u);i.seqs.push(o.readUshorts(r,u+2,l));}}else if(4==t){i.vals=[];d=o.readUshort(r,a);a+=2;for(f=0;f<d;f++){var v=o.readUshort(r,a);a+=2,i.vals.push(e.GSUB.readLigatureSet(r,s+v));}}else if(5==t&&2==i.fmt){if(2==i.fmt){var c=o.readUshort(r,a);a+=2,i.cDef=e._lctf.readClassDef(r,s+c),i.scset=[];var p=o.readUshort(r,a);a+=2;for(f=0;f<p;f++){var U=o.readUshort(r,a);a+=2,i.scset.push(0==U?null:e.GSUB.readSubClassSet(r,s+U));}}}else if(6==t&&3==i.fmt){if(3==i.fmt){for(f=0;f<3;f++){d=o.readUshort(r,a);a+=2;for(var g=[],S=0;S<d;S++)g.push(e._lctf.readCoverage(r,s+o.readUshort(r,a+2*S)));a+=2*d,0==f&&(i.backCvg=g),1==f&&(i.inptCvg=g),2==f&&(i.ahedCvg=g);}d=o.readUshort(r,a);a+=2,i.lookupRec=e.GSUB.readSubstLookupRecords(r,a,d);}}else {if(7==t&&1==i.fmt){var m=o.readUshort(r,a);a+=2;var b=o.readUint(r,a);if(a+=4,9==n.ltype)n.ltype=m;else if(n.ltype!=m)throw "invalid extension substitution";return e.GSUB.subt(r,n.ltype,s+b)}console.debug("unsupported GSUB table LookupType",t,"format",i.fmt);}return i},e.GSUB.readSubClassSet=function(r,t){var a=e._bin.readUshort,n=t,o=[],s=a(r,t);t+=2;for(var i=0;i<s;i++){var h=a(r,t);t+=2,o.push(e.GSUB.readSubClassRule(r,n+h));}return o},e.GSUB.readSubClassRule=function(r,t){var a=e._bin.readUshort,n={},o=a(r,t),s=a(r,t+=2);t+=2,n.input=[];for(var i=0;i<o-1;i++)n.input.push(a(r,t)),t+=2;return n.substLookupRecords=e.GSUB.readSubstLookupRecords(r,t,s),n},e.GSUB.readSubstLookupRecords=function(r,t,a){for(var n=e._bin.readUshort,o=[],s=0;s<a;s++)o.push(n(r,t),n(r,t+2)),t+=4;return o},e.GSUB.readChainSubClassSet=function(r,t){var a=e._bin,n=t,o=[],s=a.readUshort(r,t);t+=2;for(var i=0;i<s;i++){var h=a.readUshort(r,t);t+=2,o.push(e.GSUB.readChainSubClassRule(r,n+h));}return o},e.GSUB.readChainSubClassRule=function(r,t){for(var a=e._bin,n={},o=["backtrack","input","lookahead"],s=0;s<o.length;s++){var i=a.readUshort(r,t);t+=2,1==s&&i--,n[o[s]]=a.readUshorts(r,t,i),t+=2*n[o[s]].length;}i=a.readUshort(r,t);return t+=2,n.subst=a.readUshorts(r,t,2*i),t+=2*n.subst.length,n},e.GSUB.readLigatureSet=function(r,t){var a=e._bin,n=t,o=[],s=a.readUshort(r,t);t+=2;for(var i=0;i<s;i++){var h=a.readUshort(r,t);t+=2,o.push(e.GSUB.readLigature(r,n+h));}return o},e.GSUB.readLigature=function(r,t){var a=e._bin,n={chain:[]};n.nglyph=a.readUshort(r,t),t+=2;var o=a.readUshort(r,t);t+=2;for(var s=0;s<o-1;s++)n.chain.push(a.readUshort(r,t)),t+=2;return n},e.head={},e.head.parse=function(r,t,a){var n=e._bin,o={};return n.readFixed(r,t),t+=4,o.fontRevision=n.readFixed(r,t),t+=4,n.readUint(r,t),t+=4,n.readUint(r,t),t+=4,o.flags=n.readUshort(r,t),t+=2,o.unitsPerEm=n.readUshort(r,t),t+=2,o.created=n.readUint64(r,t),t+=8,o.modified=n.readUint64(r,t),t+=8,o.xMin=n.readShort(r,t),t+=2,o.yMin=n.readShort(r,t),t+=2,o.xMax=n.readShort(r,t),t+=2,o.yMax=n.readShort(r,t),t+=2,o.macStyle=n.readUshort(r,t),t+=2,o.lowestRecPPEM=n.readUshort(r,t),t+=2,o.fontDirectionHint=n.readShort(r,t),t+=2,o.indexToLocFormat=n.readShort(r,t),t+=2,o.glyphDataFormat=n.readShort(r,t),t+=2,o},e.hhea={},e.hhea.parse=function(r,t,a){var n=e._bin,o={};return n.readFixed(r,t),t+=4,o.ascender=n.readShort(r,t),t+=2,o.descender=n.readShort(r,t),t+=2,o.lineGap=n.readShort(r,t),t+=2,o.advanceWidthMax=n.readUshort(r,t),t+=2,o.minLeftSideBearing=n.readShort(r,t),t+=2,o.minRightSideBearing=n.readShort(r,t),t+=2,o.xMaxExtent=n.readShort(r,t),t+=2,o.caretSlopeRise=n.readShort(r,t),t+=2,o.caretSlopeRun=n.readShort(r,t),t+=2,o.caretOffset=n.readShort(r,t),t+=2,t+=8,o.metricDataFormat=n.readShort(r,t),t+=2,o.numberOfHMetrics=n.readUshort(r,t),t+=2,o},e.hmtx={},e.hmtx.parse=function(r,t,a,n){for(var o=e._bin,s={aWidth:[],lsBearing:[]},i=0,h=0,d=0;d<n.maxp.numGlyphs;d++)d<n.hhea.numberOfHMetrics&&(i=o.readUshort(r,t),t+=2,h=o.readShort(r,t),t+=2),s.aWidth.push(i),s.lsBearing.push(h);return s},e.kern={},e.kern.parse=function(r,t,a,n){var o=e._bin,s=o.readUshort(r,t);if(t+=2,1==s)return e.kern.parseV1(r,t-2,a,n);var i=o.readUshort(r,t);t+=2;for(var h={glyph1:[],rval:[]},d=0;d<i;d++){t+=2;a=o.readUshort(r,t);t+=2;var f=o.readUshort(r,t);t+=2;var u=f>>>8;if(0!=(u&=15))throw "unknown kern table format: "+u;t=e.kern.readFormat0(r,t,h);}return h},e.kern.parseV1=function(r,t,a,n){var o=e._bin;o.readFixed(r,t),t+=4;var s=o.readUint(r,t);t+=4;for(var i={glyph1:[],rval:[]},h=0;h<s;h++){o.readUint(r,t),t+=4;var d=o.readUshort(r,t);t+=2,o.readUshort(r,t),t+=2;var f=d>>>8;if(0!=(f&=15))throw "unknown kern table format: "+f;t=e.kern.readFormat0(r,t,i);}return i},e.kern.readFormat0=function(r,t,a){var n=e._bin,o=-1,s=n.readUshort(r,t);t+=2,n.readUshort(r,t),t+=2,n.readUshort(r,t),t+=2,n.readUshort(r,t),t+=2;for(var i=0;i<s;i++){var h=n.readUshort(r,t);t+=2;var d=n.readUshort(r,t);t+=2;var f=n.readShort(r,t);t+=2,h!=o&&(a.glyph1.push(h),a.rval.push({glyph2:[],vals:[]}));var u=a.rval[a.rval.length-1];u.glyph2.push(d),u.vals.push(f),o=h;}return t},e.loca={},e.loca.parse=function(r,t,a,n){var o=e._bin,s=[],i=n.head.indexToLocFormat,h=n.maxp.numGlyphs+1;if(0==i)for(var d=0;d<h;d++)s.push(o.readUshort(r,t+(d<<1))<<1);if(1==i)for(d=0;d<h;d++)s.push(o.readUint(r,t+(d<<2)));return s},e.maxp={},e.maxp.parse=function(r,t,a){var n=e._bin,o={},s=n.readUint(r,t);return t+=4,o.numGlyphs=n.readUshort(r,t),t+=2,65536==s&&(o.maxPoints=n.readUshort(r,t),t+=2,o.maxContours=n.readUshort(r,t),t+=2,o.maxCompositePoints=n.readUshort(r,t),t+=2,o.maxCompositeContours=n.readUshort(r,t),t+=2,o.maxZones=n.readUshort(r,t),t+=2,o.maxTwilightPoints=n.readUshort(r,t),t+=2,o.maxStorage=n.readUshort(r,t),t+=2,o.maxFunctionDefs=n.readUshort(r,t),t+=2,o.maxInstructionDefs=n.readUshort(r,t),t+=2,o.maxStackElements=n.readUshort(r,t),t+=2,o.maxSizeOfInstructions=n.readUshort(r,t),t+=2,o.maxComponentElements=n.readUshort(r,t),t+=2,o.maxComponentDepth=n.readUshort(r,t),t+=2),o},e.name={},e.name.parse=function(r,t,a){var n=e._bin,o={};n.readUshort(r,t),t+=2;var s=n.readUshort(r,t);t+=2,n.readUshort(r,t);for(var i,h=["copyright","fontFamily","fontSubfamily","ID","fullName","version","postScriptName","trademark","manufacturer","designer","description","urlVendor","urlDesigner","licence","licenceURL","---","typoFamilyName","typoSubfamilyName","compatibleFull","sampleText","postScriptCID","wwsFamilyName","wwsSubfamilyName","lightPalette","darkPalette"],d=t+=2,f=0;f<s;f++){var u=n.readUshort(r,t);t+=2;var l=n.readUshort(r,t);t+=2;var v=n.readUshort(r,t);t+=2;var c=n.readUshort(r,t);t+=2;var p=n.readUshort(r,t);t+=2;var U=n.readUshort(r,t);t+=2;var g,S=h[c],m=d+12*s+U;if(0==u)g=n.readUnicode(r,m,p/2);else if(3==u&&0==l)g=n.readUnicode(r,m,p/2);else if(0==l)g=n.readASCII(r,m,p);else if(1==l)g=n.readUnicode(r,m,p/2);else if(3==l)g=n.readUnicode(r,m,p/2);else {if(1!=u)throw "unknown encoding "+l+", platformID: "+u;g=n.readASCII(r,m,p),console.debug("reading unknown MAC encoding "+l+" as ASCII");}var b="p"+u+","+v.toString(16);null==o[b]&&(o[b]={}),o[b][void 0!==S?S:c]=g,o[b]._lang=v;}for(var y in o)if(null!=o[y].postScriptName&&1033==o[y]._lang)return o[y];for(var y in o)if(null!=o[y].postScriptName&&0==o[y]._lang)return o[y];for(var y in o)if(null!=o[y].postScriptName&&3084==o[y]._lang)return o[y];for(var y in o)if(null!=o[y].postScriptName)return o[y];for(var y in o){i=y;break}return console.debug("returning name table with languageID "+o[i]._lang),o[i]},e["OS/2"]={},e["OS/2"].parse=function(r,t,a){var n=e._bin.readUshort(r,t);t+=2;var o={};if(0==n)e["OS/2"].version0(r,t,o);else if(1==n)e["OS/2"].version1(r,t,o);else if(2==n||3==n||4==n)e["OS/2"].version2(r,t,o);else {if(5!=n)throw "unknown OS/2 table version: "+n;e["OS/2"].version5(r,t,o);}return o},e["OS/2"].version0=function(r,t,a){var n=e._bin;return a.xAvgCharWidth=n.readShort(r,t),t+=2,a.usWeightClass=n.readUshort(r,t),t+=2,a.usWidthClass=n.readUshort(r,t),t+=2,a.fsType=n.readUshort(r,t),t+=2,a.ySubscriptXSize=n.readShort(r,t),t+=2,a.ySubscriptYSize=n.readShort(r,t),t+=2,a.ySubscriptXOffset=n.readShort(r,t),t+=2,a.ySubscriptYOffset=n.readShort(r,t),t+=2,a.ySuperscriptXSize=n.readShort(r,t),t+=2,a.ySuperscriptYSize=n.readShort(r,t),t+=2,a.ySuperscriptXOffset=n.readShort(r,t),t+=2,a.ySuperscriptYOffset=n.readShort(r,t),t+=2,a.yStrikeoutSize=n.readShort(r,t),t+=2,a.yStrikeoutPosition=n.readShort(r,t),t+=2,a.sFamilyClass=n.readShort(r,t),t+=2,a.panose=n.readBytes(r,t,10),t+=10,a.ulUnicodeRange1=n.readUint(r,t),t+=4,a.ulUnicodeRange2=n.readUint(r,t),t+=4,a.ulUnicodeRange3=n.readUint(r,t),t+=4,a.ulUnicodeRange4=n.readUint(r,t),t+=4,a.achVendID=[n.readInt8(r,t),n.readInt8(r,t+1),n.readInt8(r,t+2),n.readInt8(r,t+3)],t+=4,a.fsSelection=n.readUshort(r,t),t+=2,a.usFirstCharIndex=n.readUshort(r,t),t+=2,a.usLastCharIndex=n.readUshort(r,t),t+=2,a.sTypoAscender=n.readShort(r,t),t+=2,a.sTypoDescender=n.readShort(r,t),t+=2,a.sTypoLineGap=n.readShort(r,t),t+=2,a.usWinAscent=n.readUshort(r,t),t+=2,a.usWinDescent=n.readUshort(r,t),t+=2},e["OS/2"].version1=function(r,t,a){var n=e._bin;return t=e["OS/2"].version0(r,t,a),a.ulCodePageRange1=n.readUint(r,t),t+=4,a.ulCodePageRange2=n.readUint(r,t),t+=4},e["OS/2"].version2=function(r,t,a){var n=e._bin;return t=e["OS/2"].version1(r,t,a),a.sxHeight=n.readShort(r,t),t+=2,a.sCapHeight=n.readShort(r,t),t+=2,a.usDefault=n.readUshort(r,t),t+=2,a.usBreak=n.readUshort(r,t),t+=2,a.usMaxContext=n.readUshort(r,t),t+=2},e["OS/2"].version5=function(r,t,a){var n=e._bin;return t=e["OS/2"].version2(r,t,a),a.usLowerOpticalPointSize=n.readUshort(r,t),t+=2,a.usUpperOpticalPointSize=n.readUshort(r,t),t+=2},e.post={},e.post.parse=function(r,t,a){var n=e._bin,o={};return o.version=n.readFixed(r,t),t+=4,o.italicAngle=n.readFixed(r,t),t+=4,o.underlinePosition=n.readShort(r,t),t+=2,o.underlineThickness=n.readShort(r,t),t+=2,o},null==e&&(e={}),null==e.U&&(e.U={}),e.U.codeToGlyph=function(r,e){var t=r.cmap,a=-1;if(null!=t.p0e4?a=t.p0e4:null!=t.p3e1?a=t.p3e1:null!=t.p1e0?a=t.p1e0:null!=t.p0e3&&(a=t.p0e3),-1==a)throw "no familiar platform and encoding!";var n=t.tables[a];if(0==n.format)return e>=n.map.length?0:n.map[e];if(4==n.format){for(var o=-1,s=0;s<n.endCount.length;s++)if(e<=n.endCount[s]){o=s;break}if(-1==o)return 0;if(n.startCount[o]>e)return 0;return 65535&(0!=n.idRangeOffset[o]?n.glyphIdArray[e-n.startCount[o]+(n.idRangeOffset[o]>>1)-(n.idRangeOffset.length-o)]:e+n.idDelta[o])}if(12==n.format){if(e>n.groups[n.groups.length-1][1])return 0;for(s=0;s<n.groups.length;s++){var i=n.groups[s];if(i[0]<=e&&e<=i[1])return i[2]+(e-i[0])}return 0}throw "unknown cmap table format "+n.format},e.U.glyphToPath=function(r,t){var a={cmds:[],crds:[]};if(r.SVG&&r.SVG.entries[t]){var n=r.SVG.entries[t];return null==n?a:("string"==typeof n&&(n=e.SVG.toPath(n),r.SVG.entries[t]=n),n)}if(r.CFF){var o={x:0,y:0,stack:[],nStems:0,haveWidth:!1,width:r.CFF.Private?r.CFF.Private.defaultWidthX:0,open:!1},s=r.CFF,i=r.CFF.Private;if(s.ROS){for(var h=0;s.FDSelect[h+2]<=t;)h+=2;i=s.FDArray[s.FDSelect[h+1]].Private;}e.U._drawCFF(r.CFF.CharStrings[t],o,s,i,a);}else r.glyf&&e.U._drawGlyf(t,r,a);return a},e.U._drawGlyf=function(r,t,a){var n=t.glyf[r];null==n&&(n=t.glyf[r]=e.glyf._parseGlyf(t,r)),null!=n&&(n.noc>-1?e.U._simpleGlyph(n,a):e.U._compoGlyph(n,t,a));},e.U._simpleGlyph=function(r,t){for(var a=0;a<r.noc;a++){for(var n=0==a?0:r.endPts[a-1]+1,o=r.endPts[a],s=n;s<=o;s++){var i=s==n?o:s-1,h=s==o?n:s+1,d=1&r.flags[s],f=1&r.flags[i],u=1&r.flags[h],l=r.xs[s],v=r.ys[s];if(s==n)if(d){if(!f){e.U.P.moveTo(t,l,v);continue}e.U.P.moveTo(t,r.xs[i],r.ys[i]);}else f?e.U.P.moveTo(t,r.xs[i],r.ys[i]):e.U.P.moveTo(t,(r.xs[i]+l)/2,(r.ys[i]+v)/2);d?f&&e.U.P.lineTo(t,l,v):u?e.U.P.qcurveTo(t,l,v,r.xs[h],r.ys[h]):e.U.P.qcurveTo(t,l,v,(l+r.xs[h])/2,(v+r.ys[h])/2);}e.U.P.closePath(t);}},e.U._compoGlyph=function(r,t,a){for(var n=0;n<r.parts.length;n++){var o={cmds:[],crds:[]},s=r.parts[n];e.U._drawGlyf(s.glyphIndex,t,o);for(var i=s.m,h=0;h<o.crds.length;h+=2){var d=o.crds[h],f=o.crds[h+1];a.crds.push(d*i.a+f*i.b+i.tx),a.crds.push(d*i.c+f*i.d+i.ty);}for(h=0;h<o.cmds.length;h++)a.cmds.push(o.cmds[h]);}},e.U._getGlyphClass=function(r,t){var a=e._lctf.getInterval(t,r);return -1==a?0:t[a+2]},e.U._applySubs=function(r,t,a,n){for(var o=r.length-t-1,s=0;s<a.tabs.length;s++)if(null!=a.tabs[s]){var i,h=a.tabs[s];if(!h.coverage||-1!=(i=e._lctf.coverageIndex(h.coverage,r[t])))if(1==a.ltype)r[t],1==h.fmt?r[t]=r[t]+h.delta:r[t]=h.newg[i];else if(4==a.ltype)for(var d=h.vals[i],f=0;f<d.length;f++){var u=d[f],l=u.chain.length;if(!(l>o)){for(var v=!0,c=0,p=0;p<l;p++){for(;-1==r[t+c+(1+p)];)c++;u.chain[p]!=r[t+c+(1+p)]&&(v=!1);}if(v){r[t]=u.nglyph;for(p=0;p<l+c;p++)r[t+p+1]=-1;break}}}else if(5==a.ltype&&2==h.fmt)for(var U=e._lctf.getInterval(h.cDef,r[t]),g=h.cDef[U+2],S=h.scset[g],m=0;m<S.length;m++){var b=S[m],y=b.input;if(!(y.length>o)){for(v=!0,p=0;p<y.length;p++){var F=e._lctf.getInterval(h.cDef,r[t+1+p]);if(-1==U&&h.cDef[F+2]!=y[p]){v=!1;break}}if(v){var C=b.substLookupRecords;for(f=0;f<C.length;f+=2)C[f],C[f+1];}}}else if(6==a.ltype&&3==h.fmt){if(!e.U._glsCovered(r,h.backCvg,t-h.backCvg.length))continue;if(!e.U._glsCovered(r,h.inptCvg,t))continue;if(!e.U._glsCovered(r,h.ahedCvg,t+h.inptCvg.length))continue;var _=h.lookupRec;for(m=0;m<_.length;m+=2){U=_[m];var P=n[_[m+1]];e.U._applySubs(r,t+U,P,n);}}}},e.U._glsCovered=function(r,t,a){for(var n=0;n<t.length;n++){if(-1==e._lctf.coverageIndex(t[n],r[a+n]))return !1}return !0},e.U.glyphsToPath=function(r,t,a){for(var n={cmds:[],crds:[]},o=0,s=0;s<t.length;s++){var i=t[s];if(-1!=i){for(var h=s<t.length-1&&-1!=t[s+1]?t[s+1]:0,d=e.U.glyphToPath(r,i),f=0;f<d.crds.length;f+=2)n.crds.push(d.crds[f]+o),n.crds.push(d.crds[f+1]);a&&n.cmds.push(a);for(f=0;f<d.cmds.length;f++)n.cmds.push(d.cmds[f]);a&&n.cmds.push("X"),o+=r.hmtx.aWidth[i],s<t.length-1&&(o+=e.U.getPairAdjustment(r,i,h));}}return n},e.U.P={},e.U.P.moveTo=function(r,e,t){r.cmds.push("M"),r.crds.push(e,t);},e.U.P.lineTo=function(r,e,t){r.cmds.push("L"),r.crds.push(e,t);},e.U.P.curveTo=function(r,e,t,a,n,o,s){r.cmds.push("C"),r.crds.push(e,t,a,n,o,s);},e.U.P.qcurveTo=function(r,e,t,a,n){r.cmds.push("Q"),r.crds.push(e,t,a,n);},e.U.P.closePath=function(r){r.cmds.push("Z");},e.U._drawCFF=function(r,t,a,n,o){for(var s=t.stack,i=t.nStems,h=t.haveWidth,d=t.width,f=t.open,u=0,l=t.x,v=t.y,c=0,p=0,U=0,g=0,S=0,m=0,b=0,y=0,F=0,C=0,_={val:0,size:0};u<r.length;){e.CFF.getCharString(r,u,_);var P=_.val;if(u+=_.size,"o1"==P||"o18"==P)s.length%2!=0&&!h&&(d=s.shift()+n.nominalWidthX),i+=s.length>>1,s.length=0,h=!0;else if("o3"==P||"o23"==P){s.length%2!=0&&!h&&(d=s.shift()+n.nominalWidthX),i+=s.length>>1,s.length=0,h=!0;}else if("o4"==P)s.length>1&&!h&&(d=s.shift()+n.nominalWidthX,h=!0),f&&e.U.P.closePath(o),v+=s.pop(),e.U.P.moveTo(o,l,v),f=!0;else if("o5"==P)for(;s.length>0;)l+=s.shift(),v+=s.shift(),e.U.P.lineTo(o,l,v);else if("o6"==P||"o7"==P)for(var x=s.length,I="o6"==P,w=0;w<x;w++){var k=s.shift();I?l+=k:v+=k,I=!I,e.U.P.lineTo(o,l,v);}else if("o8"==P||"o24"==P){x=s.length;for(var G=0;G+6<=x;)c=l+s.shift(),p=v+s.shift(),U=c+s.shift(),g=p+s.shift(),l=U+s.shift(),v=g+s.shift(),e.U.P.curveTo(o,c,p,U,g,l,v),G+=6;"o24"==P&&(l+=s.shift(),v+=s.shift(),e.U.P.lineTo(o,l,v));}else {if("o11"==P)break;if("o1234"==P||"o1235"==P||"o1236"==P||"o1237"==P)"o1234"==P&&(p=v,U=(c=l+s.shift())+s.shift(),C=g=p+s.shift(),m=g,y=v,l=(b=(S=(F=U+s.shift())+s.shift())+s.shift())+s.shift(),e.U.P.curveTo(o,c,p,U,g,F,C),e.U.P.curveTo(o,S,m,b,y,l,v)),"o1235"==P&&(c=l+s.shift(),p=v+s.shift(),U=c+s.shift(),g=p+s.shift(),F=U+s.shift(),C=g+s.shift(),S=F+s.shift(),m=C+s.shift(),b=S+s.shift(),y=m+s.shift(),l=b+s.shift(),v=y+s.shift(),s.shift(),e.U.P.curveTo(o,c,p,U,g,F,C),e.U.P.curveTo(o,S,m,b,y,l,v)),"o1236"==P&&(c=l+s.shift(),p=v+s.shift(),U=c+s.shift(),C=g=p+s.shift(),m=g,b=(S=(F=U+s.shift())+s.shift())+s.shift(),y=m+s.shift(),l=b+s.shift(),e.U.P.curveTo(o,c,p,U,g,F,C),e.U.P.curveTo(o,S,m,b,y,l,v)),"o1237"==P&&(c=l+s.shift(),p=v+s.shift(),U=c+s.shift(),g=p+s.shift(),F=U+s.shift(),C=g+s.shift(),S=F+s.shift(),m=C+s.shift(),b=S+s.shift(),y=m+s.shift(),Math.abs(b-l)>Math.abs(y-v)?l=b+s.shift():v=y+s.shift(),e.U.P.curveTo(o,c,p,U,g,F,C),e.U.P.curveTo(o,S,m,b,y,l,v));else if("o14"==P){if(s.length>0&&!h&&(d=s.shift()+a.nominalWidthX,h=!0),4==s.length){var O=s.shift(),T=s.shift(),D=s.shift(),B=s.shift(),A=e.CFF.glyphBySE(a,D),R=e.CFF.glyphBySE(a,B);e.U._drawCFF(a.CharStrings[A],t,a,n,o),t.x=O,t.y=T,e.U._drawCFF(a.CharStrings[R],t,a,n,o);}f&&(e.U.P.closePath(o),f=!1);}else if("o19"==P||"o20"==P){s.length%2!=0&&!h&&(d=s.shift()+n.nominalWidthX),i+=s.length>>1,s.length=0,h=!0,u+=i+7>>3;}else if("o21"==P)s.length>2&&!h&&(d=s.shift()+n.nominalWidthX,h=!0),v+=s.pop(),l+=s.pop(),f&&e.U.P.closePath(o),e.U.P.moveTo(o,l,v),f=!0;else if("o22"==P)s.length>1&&!h&&(d=s.shift()+n.nominalWidthX,h=!0),l+=s.pop(),f&&e.U.P.closePath(o),e.U.P.moveTo(o,l,v),f=!0;else if("o25"==P){for(;s.length>6;)l+=s.shift(),v+=s.shift(),e.U.P.lineTo(o,l,v);c=l+s.shift(),p=v+s.shift(),U=c+s.shift(),g=p+s.shift(),l=U+s.shift(),v=g+s.shift(),e.U.P.curveTo(o,c,p,U,g,l,v);}else if("o26"==P)for(s.length%2&&(l+=s.shift());s.length>0;)c=l,p=v+s.shift(),l=U=c+s.shift(),v=(g=p+s.shift())+s.shift(),e.U.P.curveTo(o,c,p,U,g,l,v);else if("o27"==P)for(s.length%2&&(v+=s.shift());s.length>0;)p=v,U=(c=l+s.shift())+s.shift(),g=p+s.shift(),l=U+s.shift(),v=g,e.U.P.curveTo(o,c,p,U,g,l,v);else if("o10"==P||"o29"==P){var L="o10"==P?n:a;if(0==s.length)console.debug("error: empty stack");else {var W=s.pop(),M=L.Subrs[W+L.Bias];t.x=l,t.y=v,t.nStems=i,t.haveWidth=h,t.width=d,t.open=f,e.U._drawCFF(M,t,a,n,o),l=t.x,v=t.y,i=t.nStems,h=t.haveWidth,d=t.width,f=t.open;}}else if("o30"==P||"o31"==P){var V=s.length,E=(G=0,"o31"==P);for(G+=V-(x=-3&V);G<x;)E?(p=v,U=(c=l+s.shift())+s.shift(),v=(g=p+s.shift())+s.shift(),x-G==5?(l=U+s.shift(),G++):l=U,E=!1):(c=l,p=v+s.shift(),U=c+s.shift(),g=p+s.shift(),l=U+s.shift(),x-G==5?(v=g+s.shift(),G++):v=g,E=!0),e.U.P.curveTo(o,c,p,U,g,l,v),G+=4;}else {if("o"==(P+"").charAt(0))throw console.debug("Unknown operation: "+P,r),P;s.push(P);}}}t.x=l,t.y=v,t.nStems=i,t.haveWidth=h,t.width=d,t.open=f;};var t=e,a={Typr:t};return r.Typr=t,r.default=a,Object.defineProperty(r,"__esModule",{value:!0}),r}({}).Typr}

  /*!
  Custom bundle of woff2otf (https://github.com/arty-name/woff2otf) with fflate
  (https://github.com/101arrowz/fflate) for use in Troika text rendering. 
  Original licenses apply: 
  - fflate: https://github.com/101arrowz/fflate/blob/master/LICENSE (MIT)
  - woff2otf.js: https://github.com/arty-name/woff2otf/blob/master/woff2otf.js (Apache2)
  */
  function woff2otfFactory(){return function(r){var e=Uint8Array,n=Uint16Array,t=Uint32Array,a=new e([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),i=new e([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),o=new e([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),f=function(r,e){for(var a=new n(31),i=0;i<31;++i)a[i]=e+=1<<r[i-1];var o=new t(a[30]);for(i=1;i<30;++i)for(var f=a[i];f<a[i+1];++f)o[f]=f-a[i]<<5|i;return [a,o]},u=f(a,2),v=u[0],s=u[1];v[28]=258,s[258]=28;for(var l=f(i,0)[0],c=new n(32768),g=0;g<32768;++g){var h=(43690&g)>>>1|(21845&g)<<1;h=(61680&(h=(52428&h)>>>2|(13107&h)<<2))>>>4|(3855&h)<<4,c[g]=((65280&h)>>>8|(255&h)<<8)>>>1;}var w=function(r,e,t){for(var a=r.length,i=0,o=new n(e);i<a;++i)++o[r[i]-1];var f,u=new n(e);for(i=0;i<e;++i)u[i]=u[i-1]+o[i-1]<<1;if(t){f=new n(1<<e);var v=15-e;for(i=0;i<a;++i)if(r[i])for(var s=i<<4|r[i],l=e-r[i],g=u[r[i]-1]++<<l,h=g|(1<<l)-1;g<=h;++g)f[c[g]>>>v]=s;}else for(f=new n(a),i=0;i<a;++i)r[i]&&(f[i]=c[u[r[i]-1]++]>>>15-r[i]);return f},d=new e(288);for(g=0;g<144;++g)d[g]=8;for(g=144;g<256;++g)d[g]=9;for(g=256;g<280;++g)d[g]=7;for(g=280;g<288;++g)d[g]=8;var m=new e(32);for(g=0;g<32;++g)m[g]=5;var b=w(d,9,1),p=w(m,5,1),y=function(r){for(var e=r[0],n=1;n<r.length;++n)r[n]>e&&(e=r[n]);return e},L=function(r,e,n){var t=e/8|0;return (r[t]|r[t+1]<<8)>>(7&e)&n},U=function(r,e){var n=e/8|0;return (r[n]|r[n+1]<<8|r[n+2]<<16)>>(7&e)},k=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],T=function(r,e,n){var t=new Error(e||k[r]);if(t.code=r,Error.captureStackTrace&&Error.captureStackTrace(t,T),!n)throw t;return t},O=function(r,f,u){var s=r.length;if(!s||u&&!u.l&&s<5)return f||new e(0);var c=!f||u,g=!u||u.i;u||(u={}),f||(f=new e(3*s));var h,d=function(r){var n=f.length;if(r>n){var t=new e(Math.max(2*n,r));t.set(f),f=t;}},m=u.f||0,k=u.p||0,O=u.b||0,A=u.l,x=u.d,E=u.m,D=u.n,M=8*s;do{if(!A){u.f=m=L(r,k,1);var S=L(r,k+1,3);if(k+=3,!S){var V=r[(I=((h=k)/8|0)+(7&h&&1)+4)-4]|r[I-3]<<8,_=I+V;if(_>s){g&&T(0);break}c&&d(O+V),f.set(r.subarray(I,_),O),u.b=O+=V,u.p=k=8*_;continue}if(1==S)A=b,x=p,E=9,D=5;else if(2==S){var j=L(r,k,31)+257,z=L(r,k+10,15)+4,C=j+L(r,k+5,31)+1;k+=14;for(var F=new e(C),P=new e(19),q=0;q<z;++q)P[o[q]]=L(r,k+3*q,7);k+=3*z;var B=y(P),G=(1<<B)-1,H=w(P,B,1);for(q=0;q<C;){var I,J=H[L(r,k,G)];if(k+=15&J,(I=J>>>4)<16)F[q++]=I;else {var K=0,N=0;for(16==I?(N=3+L(r,k,3),k+=2,K=F[q-1]):17==I?(N=3+L(r,k,7),k+=3):18==I&&(N=11+L(r,k,127),k+=7);N--;)F[q++]=K;}}var Q=F.subarray(0,j),R=F.subarray(j);E=y(Q),D=y(R),A=w(Q,E,1),x=w(R,D,1);}else T(1);if(k>M){g&&T(0);break}}c&&d(O+131072);for(var W=(1<<E)-1,X=(1<<D)-1,Y=k;;Y=k){var Z=(K=A[U(r,k)&W])>>>4;if((k+=15&K)>M){g&&T(0);break}if(K||T(2),Z<256)f[O++]=Z;else {if(256==Z){Y=k,A=null;break}var $=Z-254;if(Z>264){var rr=a[q=Z-257];$=L(r,k,(1<<rr)-1)+v[q],k+=rr;}var er=x[U(r,k)&X],nr=er>>>4;er||T(3),k+=15&er;R=l[nr];if(nr>3){rr=i[nr];R+=U(r,k)&(1<<rr)-1,k+=rr;}if(k>M){g&&T(0);break}c&&d(O+131072);for(var tr=O+$;O<tr;O+=4)f[O]=f[O-R],f[O+1]=f[O+1-R],f[O+2]=f[O+2-R],f[O+3]=f[O+3-R];O=tr;}}u.l=A,u.p=Y,u.b=O,A&&(m=1,u.m=E,u.d=x,u.n=D);}while(!m);return O==f.length?f:function(r,a,i){(null==a||a<0)&&(a=0),(null==i||i>r.length)&&(i=r.length);var o=new(r instanceof n?n:r instanceof t?t:e)(i-a);return o.set(r.subarray(a,i)),o}(f,0,O)},A=new e(0);var x="undefined"!=typeof TextDecoder&&new TextDecoder;try{x.decode(A,{stream:!0}),1;}catch(r){}return r.convert_streams=function(r){var e=new DataView(r),n=0;function t(){var r=e.getUint16(n);return n+=2,r}function a(){var r=e.getUint32(n);return n+=4,r}function i(r){m.setUint16(b,r),b+=2;}function o(r){m.setUint32(b,r),b+=4;}for(var f={signature:a(),flavor:a(),length:a(),numTables:t(),reserved:t(),totalSfntSize:a(),majorVersion:t(),minorVersion:t(),metaOffset:a(),metaLength:a(),metaOrigLength:a(),privOffset:a(),privLength:a()},u=0;Math.pow(2,u)<=f.numTables;)u++;u--;for(var v=16*Math.pow(2,u),s=16*f.numTables-v,l=12,c=[],g=0;g<f.numTables;g++)c.push({tag:a(),offset:a(),compLength:a(),origLength:a(),origChecksum:a()}),l+=16;var h,w=new Uint8Array(12+16*c.length+c.reduce((function(r,e){return r+e.origLength+4}),0)),d=w.buffer,m=new DataView(d),b=0;return o(f.flavor),i(f.numTables),i(v),i(u),i(s),c.forEach((function(r){o(r.tag),o(r.origChecksum),o(l),o(r.origLength),r.outOffset=l,(l+=r.origLength)%4!=0&&(l+=4-l%4);})),c.forEach((function(e){var n,t=r.slice(e.offset,e.offset+e.compLength);if(e.compLength!=e.origLength){var a=new Uint8Array(e.origLength);n=new Uint8Array(t,2),O(n,a);}else a=new Uint8Array(t);w.set(a,e.outOffset);var i=0;(l=e.outOffset+e.origLength)%4!=0&&(i=4-l%4),w.set(new Uint8Array(i).buffer,e.outOffset+e.origLength),h=l+i;})),d.slice(0,h)},Object.defineProperty(r,"__esModule",{value:!0}),r}({}).convert_streams}

  /**
   * A factory wrapper parsing a font file using Typr.
   * Also adds support for WOFF files (not WOFF2).
   */

  /**
   * @typedef ParsedFont
   * @property {number} ascender
   * @property {number} descender
   * @property {number} xHeight
   * @property {(number) => boolean} supportsCodePoint
   * @property {(text:string, fontSize:number, letterSpacing:number, callback) => number} forEachGlyph
   * @property {number} lineGap
   * @property {number} capHeight
   * @property {number} unitsPerEm
   */

  /**
   * @typedef {(buffer: ArrayBuffer) => ParsedFont} FontParser
   */

  /**
   * @returns {FontParser}
   */
  function parserFactory(Typr, woff2otf) {
    const cmdArgLengths = {
      M: 2,
      L: 2,
      Q: 4,
      C: 6,
      Z: 0
    };

    // {joinType: "skip+step,..."}
    const joiningTypeRawData = {"C":"18g,ca,368,1kz","D":"17k,6,2,2+4,5+c,2+6,2+1,10+1,9+f,j+11,2+1,a,2,2+1,15+2,3,j+2,6+3,2+8,2,2,2+1,w+a,4+e,3+3,2,3+2,3+5,23+w,2f+4,3,2+9,2,b,2+3,3,1k+9,6+1,3+1,2+2,2+d,30g,p+y,1,1+1g,f+x,2,sd2+1d,jf3+4,f+3,2+4,2+2,b+3,42,2,4+2,2+1,2,3,t+1,9f+w,2,el+2,2+g,d+2,2l,2+1,5,3+1,2+1,2,3,6,16wm+1v","R":"17m+3,2,2,6+3,m,15+2,2+2,h+h,13,3+8,2,2,3+1,2,p+1,x,5+4,5,a,2,2,3,u,c+2,g+1,5,2+1,4+1,5j,6+1,2,b,2+2,f,2+1,1s+2,2,3+1,7,1ez0,2,2+1,4+4,b,4,3,b,42,2+2,4,3,2+1,2,o+3,ae,ep,x,2o+2,3+1,3,5+1,6","L":"x9u,jff,a,fd,jv","T":"4t,gj+33,7o+4,1+1,7c+18,2,2+1,2+1,2,21+a,2,1b+k,h,2u+6,3+5,3+1,2+3,y,2,v+q,2k+a,1n+8,a,p+3,2+8,2+2,2+4,18+2,3c+e,2+v,1k,2,5+7,5,4+6,b+1,u,1n,5+3,9,l+1,r,3+1,1m,5+1,5+1,3+2,4,v+1,4,c+1,1m,5+4,2+1,5,l+1,n+5,2,1n,3,2+3,9,8+1,c+1,v,1q,d,1f,4,1m+2,6+2,2+3,8+1,c+1,u,1n,3,7,6+1,l+1,t+1,1m+1,5+3,9,l+1,u,21,8+2,2,2j,3+6,d+7,2r,3+8,c+5,23+1,s,2,2,1k+d,2+4,2+1,6+a,2+z,a,2v+3,2+5,2+1,3+1,q+1,5+2,h+3,e,3+1,7,g,jk+2,qb+2,u+2,u+1,v+1,1t+1,2+6,9,3+a,a,1a+2,3c+1,z,3b+2,5+1,a,7+2,64+1,3,1n,2+6,2,2,3+7,7+9,3,1d+d,1,1+1,1s+3,1d,2+4,2,6,15+8,d+1,x+3,3+1,2+2,1l,2+1,4,2+2,1n+7,3+1,49+2,2+c,2+6,5,7,4+1,5j+1l,2+4,ek,3+1,r+4,1e+4,6+5,2p+c,1+3,1,1+2,1+b,2db+2,3y,2p+v,ff+3,30+1,n9x,1+2,2+9,x+1,29+1,7l,4,5,q+1,6,48+1,r+h,e,13+7,q+a,1b+2,1d,3+3,3+1,14,1w+5,3+1,3+1,d,9,1c,1g,2+2,3+1,6+1,2,17+1,9,6n,3,5,fn5,ki+f,h+f,5s,6y+2,ea,6b,46+4,1af+2,2+1,6+3,15+2,5,4m+1,fy+3,as+1,4a+a,4x,1j+e,1l+2,1e+3,3+1,1y+2,11+4,2+7,1r,d+1,1h+8,b+3,3,2o+2,3,2+1,7,4h,4+7,m+1,1m+1,4,12+6,4+4,5g+7,3+2,2,o,2d+5,2,5+1,2+1,6n+3,7+1,2+1,s+1,2e+7,3,2+1,2z,2,3+5,2,2u+2,3+3,2+4,78+8,2+1,75+1,2,5,41+3,3+1,5,x+9,15+5,3+3,9,a+5,3+2,1b+c,2+1,bb+6,2+5,2,2b+l,3+6,2+1,2+1,3f+5,4,2+1,2+6,2,21+1,4,2,9o+1,470+8,at4+4,1o+6,t5,1s+3,2a,f5l+1,2+3,43o+2,a+7,1+7,3+6,v+3,45+2,1j0+1i,5+1d,9,f,n+4,2+e,11t+6,2+g,3+6,2+1,2+4,7a+6,c6+3,15t+6,32+6,1,gzau,v+2n,3l+6n"};

    const JT_LEFT = 1, //indicates that a character joins with the subsequent character, but does not join with the preceding character.
      JT_RIGHT = 2, //indicates that a character joins with the preceding character, but does not join with the subsequent character.
      JT_DUAL = 4, //indicates that a character joins with the preceding character and joins with the subsequent character.
      JT_TRANSPARENT = 8, //indicates that the character does not join with adjacent characters and that the character must be skipped over when the shaping engine is evaluating the joining positions in a sequence of characters. When a JT_TRANSPARENT character is encountered in a sequence, the JOINING_TYPE of the preceding character passes through. Diacritical marks are frequently assigned this value.
      JT_JOIN_CAUSING = 16, //indicates that the character forces the use of joining forms with the preceding and subsequent characters. Kashidas and the Zero Width Joiner (U+200D) are both JOIN_CAUSING characters.
      JT_NON_JOINING = 32; //indicates that a character does not join with the preceding or with the subsequent character.,

    let joiningTypeMap;
    function getCharJoiningType(ch) {
      if (!joiningTypeMap) {
        const m = {
          R: JT_RIGHT,
          L: JT_LEFT,
          D: JT_DUAL,
          C: JT_JOIN_CAUSING,
          U: JT_NON_JOINING,
          T: JT_TRANSPARENT
        };
        joiningTypeMap = new Map();
        for (let type in joiningTypeRawData) {
          let lastCode = 0;
          joiningTypeRawData[type].split(',').forEach(range => {
            let [skip, step] = range.split('+');
            skip = parseInt(skip,36);
            step = step ? parseInt(step, 36) : 0;
            joiningTypeMap.set(lastCode += skip, m[type]);
            for (let i = step; i--;) {
              joiningTypeMap.set(++lastCode, m[type]);
            }
          });
        }
      }
      return joiningTypeMap.get(ch) || JT_NON_JOINING
    }

    const ISOL = 1, INIT = 2, FINA = 3, MEDI = 4;
    const formsToFeatures = [null, 'isol', 'init', 'fina', 'medi'];

    function detectJoiningForms(str) {
      // This implements the algorithm described here:
      // https://github.com/n8willis/opentype-shaping-documents/blob/master/opentype-shaping-arabic-general.md
      const joiningForms = new Uint8Array(str.length);
      let prevJoiningType = JT_NON_JOINING;
      let prevForm = ISOL;
      let prevIndex = -1;
      for (let i = 0; i < str.length; i++) {
        const code = str.codePointAt(i);
        let joiningType = getCharJoiningType(code) | 0;
        let form = ISOL;
        if (joiningType & JT_TRANSPARENT) {
          continue
        }
        if (prevJoiningType & (JT_LEFT | JT_DUAL | JT_JOIN_CAUSING)) {
          if (joiningType & (JT_RIGHT | JT_DUAL | JT_JOIN_CAUSING)) {
            form = FINA;
            // isol->init, fina->medi
            if (prevForm === ISOL || prevForm === FINA) {
              joiningForms[prevIndex]++;
            }
          }
          else if (joiningType & (JT_LEFT | JT_NON_JOINING)) {
            // medi->fina, init->isol
            if (prevForm === INIT || prevForm === MEDI) {
              joiningForms[prevIndex]--;
            }
          }
        }
        else if (prevJoiningType & (JT_RIGHT | JT_NON_JOINING)) {
          // medi->fina, init->isol
          if (prevForm === INIT || prevForm === MEDI) {
            joiningForms[prevIndex]--;
          }
        }
        prevForm = joiningForms[i] = form;
        prevJoiningType = joiningType;
        prevIndex = i;
        if (code > 0xffff) i++;
      }
      // console.log(str.split('').map(ch => ch.codePointAt(0).toString(16)))
      // console.log(str.split('').map(ch => getCharJoiningType(ch.codePointAt(0))))
      // console.log(Array.from(joiningForms).map(f => formsToFeatures[f] || 'none'))
      return joiningForms
    }

    function stringToGlyphs (font, str) {
      const glyphIds = [];
      for (let i = 0; i < str.length; i++) {
        const cc = str.codePointAt(i);
        if (cc > 0xffff) i++;
        glyphIds.push(Typr.U.codeToGlyph(font, cc));
      }

      const gsub = font['GSUB'];
      if (gsub) {
        const {lookupList, featureList} = gsub;
        let joiningForms;
        const supportedFeatures = /^(rlig|liga|mset|isol|init|fina|medi|half|pres|blws|ccmp)$/;
        const usedLookups = [];
        featureList.forEach(feature => {
          if (supportedFeatures.test(feature.tag)) {
            for (let ti = 0; ti < feature.tab.length; ti++) {
              if (usedLookups[feature.tab[ti]]) continue
              usedLookups[feature.tab[ti]] = true;
              const tab = lookupList[feature.tab[ti]];
              const isJoiningFeature = /^(isol|init|fina|medi)$/.test(feature.tag);
              if (isJoiningFeature && !joiningForms) { //lazy
                joiningForms = detectJoiningForms(str);
              }
              for (let ci = 0; ci < glyphIds.length; ci++) {
                if (!joiningForms || !isJoiningFeature || formsToFeatures[joiningForms[ci]] === feature.tag) {
                  Typr.U._applySubs(glyphIds, ci, tab, lookupList);
                }
              }
            }
          }
        });
      }

      return glyphIds
    }

    // Calculate advances and x/y offsets for each glyph, e.g. kerning and mark
    // attachments. This is a more complete version of Typr.U.getPairAdjustment
    // and should become an upstream replacement eventually.
    function calcGlyphPositions(font, glyphIds) {
      const positions = new Int16Array(glyphIds.length * 3); // [offsetX, offsetY, advanceX, ...]
      let glyphIndex = 0;
      for (; glyphIndex < glyphIds.length; glyphIndex++) {
        const glyphId = glyphIds[glyphIndex];
        if (glyphId === -1) continue;

        positions[glyphIndex * 3 + 2] = font.hmtx.aWidth[glyphId]; // populate advanceX in...advance.

        const gpos = font.GPOS;
        if (gpos) {
          const llist = gpos.lookupList;
          for (let i = 0; i < llist.length; i++) {
            const lookup = llist[i];
            for (let j = 0; j < lookup.tabs.length; j++) {
              const tab = lookup.tabs[j];
              // Single char placement
              if (lookup.ltype === 1) {
                const ind = Typr._lctf.coverageIndex(tab.coverage, glyphId);
                if (ind !== -1 && tab.pos) {
                  applyValueRecord(tab.pos, glyphIndex);
                  break
                }
              }
              // Pairs (kerning)
              else if (lookup.ltype === 2) {
                let adj = null;
                let prevGlyphIndex = getPrevGlyphIndex();
                if (prevGlyphIndex !== -1) {
                  const coverageIndex = Typr._lctf.coverageIndex(tab.coverage, glyphIds[prevGlyphIndex]);
                  if (coverageIndex !== -1) {
                    if (tab.fmt === 1) {
                      const right = tab.pairsets[coverageIndex];
                      for (let k = 0; k < right.length; k++) {
                        if (right[k].gid2 === glyphId) adj = right[k];
                      }
                    } else if (tab.fmt === 2) {
                      const c1 = Typr.U._getGlyphClass(glyphIds[prevGlyphIndex], tab.classDef1);
                      const c2 = Typr.U._getGlyphClass(glyphId, tab.classDef2);
                      adj = tab.matrix[c1][c2];
                    }
                    if (adj) {
                      if (adj.val1) applyValueRecord(adj.val1, prevGlyphIndex);
                      if (adj.val2) applyValueRecord(adj.val2, glyphIndex);
                      break
                    }
                  }
                }
              }
              // Mark to base
              else if (lookup.ltype === 4) {
                const markArrIndex = Typr._lctf.coverageIndex(tab.markCoverage, glyphId);
                if (markArrIndex !== -1) {
                  const baseGlyphIndex = getPrevGlyphIndex(isBaseGlyph);
                  const baseArrIndex = baseGlyphIndex === -1 ? -1 : Typr._lctf.coverageIndex(tab.baseCoverage, glyphIds[baseGlyphIndex]);
                  if (baseArrIndex !== -1) {
                    const markRecord = tab.markArray[markArrIndex];
                    const baseAnchor = tab.baseArray[baseArrIndex][markRecord.markClass];
                    positions[glyphIndex * 3] = baseAnchor.x - markRecord.x + positions[baseGlyphIndex * 3] - positions[baseGlyphIndex * 3 + 2];
                    positions[glyphIndex * 3 + 1] = baseAnchor.y - markRecord.y + positions[baseGlyphIndex * 3 + 1];
                    break;
                  }
                }
              }
              // Mark to mark
              else if (lookup.ltype === 6) {
                const mark1ArrIndex = Typr._lctf.coverageIndex(tab.mark1Coverage, glyphId);
                if (mark1ArrIndex !== -1) {
                  const prevGlyphIndex = getPrevGlyphIndex();
                  if (prevGlyphIndex !== -1) {
                    const prevGlyphId = glyphIds[prevGlyphIndex];
                    if (getGlyphClass(font, prevGlyphId) === 3) { // only check mark glyphs
                      const mark2ArrIndex = Typr._lctf.coverageIndex(tab.mark2Coverage, prevGlyphId);
                      if (mark2ArrIndex !== -1) {
                        const mark1Record = tab.mark1Array[mark1ArrIndex];
                        const mark2Anchor = tab.mark2Array[mark2ArrIndex][mark1Record.markClass];
                        positions[glyphIndex * 3] = mark2Anchor.x - mark1Record.x + positions[prevGlyphIndex * 3] - positions[prevGlyphIndex * 3 + 2];
                        positions[glyphIndex * 3 + 1] = mark2Anchor.y - mark1Record.y + positions[prevGlyphIndex * 3 + 1];
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        // Check kern table if no GPOS
        else if (font.kern && !font.cff) {
          const prevGlyphIndex = getPrevGlyphIndex();
          if (prevGlyphIndex !== -1) {
            const ind1 = font.kern.glyph1.indexOf(glyphIds[prevGlyphIndex]);
            if (ind1 !== -1) {
              const ind2 = font.kern.rval[ind1].glyph2.indexOf(glyphId);
              if (ind2 !== -1) {
                positions[prevGlyphIndex * 3 + 2] += font.kern.rval[ind1].vals[ind2];
              }
            }
          }
        }
      }

      return positions;

      function getPrevGlyphIndex(filter) {
        for (let i = glyphIndex - 1; i >=0; i--) {
          if (glyphIds[i] !== -1 && (!filter || filter(glyphIds[i]))) {
            return i
          }
        }
        return -1;
      }

      function isBaseGlyph(glyphId) {
        return getGlyphClass(font, glyphId) === 1;
      }

      function applyValueRecord(source, gi) {
        for (let i = 0; i < 3; i++) {
          positions[gi * 3 + i] += source[i] || 0;
        }
      }
    }

    function getGlyphClass(font, glyphId) {
      const classDef = font.GDEF && font.GDEF.glyphClassDef;
      return classDef ? Typr.U._getGlyphClass(glyphId, classDef) : 0;
    }

    function firstNum(...args) {
      for (let i = 0; i < args.length; i++) {
        if (typeof args[i] === 'number') {
          return args[i]
        }
      }
    }

    /**
     * @returns ParsedFont
     */
    function wrapFontObj(typrFont) {
      const glyphMap = Object.create(null);

      const os2 = typrFont['OS/2'];
      const hhea = typrFont.hhea;
      const unitsPerEm = typrFont.head.unitsPerEm;
      const ascender = firstNum(os2 && os2.sTypoAscender, hhea && hhea.ascender, unitsPerEm);

      /** @type ParsedFont */
      const fontObj = {
        unitsPerEm,
        ascender,
        descender: firstNum(os2 && os2.sTypoDescender, hhea && hhea.descender, 0),
        capHeight: firstNum(os2 && os2.sCapHeight, ascender),
        xHeight: firstNum(os2 && os2.sxHeight, ascender),
        lineGap: firstNum(os2 && os2.sTypoLineGap, hhea && hhea.lineGap),
        supportsCodePoint(code) {
          return Typr.U.codeToGlyph(typrFont, code) > 0
        },
        forEachGlyph(text, fontSize, letterSpacing, callback) {
          let penX = 0;
          const fontScale = 1 / fontObj.unitsPerEm * fontSize;

          const glyphIds = stringToGlyphs(typrFont, text);
          let charIndex = 0;
          const positions = calcGlyphPositions(typrFont, glyphIds);

          glyphIds.forEach((glyphId, i) => {
            // Typr returns a glyph index per string codepoint, with -1s in place of those that
            // were omitted due to ligature substitution. So we can track original index in the
            // string via simple increment, and skip everything else when seeing a -1.
            if (glyphId !== -1) {
              let glyphObj = glyphMap[glyphId];
              if (!glyphObj) {
                const {cmds, crds} = Typr.U.glyphToPath(typrFont, glyphId);

                // Build path string
                let path = '';
                let crdsIdx = 0;
                for (let i = 0, len = cmds.length; i < len; i++) {
                  const numArgs = cmdArgLengths[cmds[i]];
                  path += cmds[i];
                  for (let j = 1; j <= numArgs; j++) {
                    path += (j > 1 ? ',' : '') + crds[crdsIdx++];
                  }
                }

                // Find extents - Glyf gives this in metadata but not CFF, and Typr doesn't
                // normalize the two, so it's simplest just to iterate ourselves.
                let xMin, yMin, xMax, yMax;
                if (crds.length) {
                  xMin = yMin = Infinity;
                  xMax = yMax = -Infinity;
                  for (let i = 0, len = crds.length; i < len; i += 2) {
                    let x = crds[i];
                    let y = crds[i + 1];
                    if (x < xMin) xMin = x;
                    if (y < yMin) yMin = y;
                    if (x > xMax) xMax = x;
                    if (y > yMax) yMax = y;
                  }
                } else {
                  xMin = xMax = yMin = yMax = 0;
                }

                glyphObj = glyphMap[glyphId] = {
                  index: glyphId,
                  advanceWidth: typrFont.hmtx.aWidth[glyphId],
                  xMin,
                  yMin,
                  xMax,
                  yMax,
                  path,
                };
              }

              callback.call(
                null,
                glyphObj,
                penX + positions[i * 3] * fontScale,
                positions[i * 3 + 1] * fontScale,
                charIndex
              );

              penX += positions[i * 3 + 2] * fontScale;
              if (letterSpacing) {
                penX += letterSpacing * fontSize;
              }
            }
            charIndex += (text.codePointAt(charIndex) > 0xffff ? 2 : 1);
          });

          return penX
        }
      };

      return fontObj
    }

    /**
     * @type FontParser
     */
    return function parse(buffer) {
      // Look to see if we have a WOFF file and convert it if so:
      const peek = new Uint8Array(buffer, 0, 4);
      const tag = Typr._bin.readASCII(peek, 0, 4);
      if (tag === 'wOFF') {
        buffer = woff2otf(buffer);
      } else if (tag === 'wOF2') {
        throw new Error('woff2 fonts not supported')
      }
      return wrapFontObj(Typr.parse(buffer)[0])
    }
  }


  const workerModule = /*#__PURE__*/troikaWorkerUtils.defineWorkerModule({
    name: 'Typr Font Parser',
    dependencies: [typrFactory, woff2otfFactory, parserFactory],
    init(typrFactory, woff2otfFactory, parserFactory) {
      const Typr = typrFactory();
      const woff2otf = woff2otfFactory();
      return parserFactory(Typr, woff2otf)
    }
  });

  /*!
  Custom bundle of @unicode-font-resolver/client v1.0.2 (https://github.com/lojjic/unicode-font-resolver)
  for use in Troika text rendering. 
  Original MIT license applies
  */
  function unicodeFontResolverClientFactory(){return function(t){var n=function(){this.buckets=new Map;};n.prototype.add=function(t){var n=t>>5;this.buckets.set(n,(this.buckets.get(n)||0)|1<<(31&t));},n.prototype.has=function(t){var n=this.buckets.get(t>>5);return void 0!==n&&0!=(n&1<<(31&t))},n.prototype.serialize=function(){var t=[];return this.buckets.forEach((function(n,r){t.push((+r).toString(36)+":"+n.toString(36));})),t.join(",")},n.prototype.deserialize=function(t){var n=this;this.buckets.clear(),t.split(",").forEach((function(t){var r=t.split(":");n.buckets.set(parseInt(r[0],36),parseInt(r[1],36));}));};var r=Math.pow(2,8),e=r-1,o=~e;function a(t){var n=function(t){return t&o}(t).toString(16),e=function(t){return (t&o)+r-1}(t).toString(16);return "codepoint-index/plane"+(t>>16)+"/"+n+"-"+e+".json"}function i(t,n){var r=t&e,o=n.codePointAt(r/6|0);return 0!=((o=(o||48)-48)&1<<r%6)}function u(t,n){var r;(r=t,r.replace(/U\+/gi,"").replace(/^,+|,+$/g,"").split(/,+/).map((function(t){return t.split("-").map((function(t){return parseInt(t.trim(),16)}))}))).forEach((function(t){var r=t[0],e=t[1];void 0===e&&(e=r),n(r,e);}));}function c(t,n){u(t,(function(t,r){for(var e=t;e<=r;e++)n(e);}));}var s={},f={},l=new WeakMap,v="https://cdn.jsdelivr.net/gh/lojjic/unicode-font-resolver@v1.0.1/packages/data";function d(t){var r=l.get(t);return r||(r=new n,c(t.ranges,(function(t){return r.add(t)})),l.set(t,r)),r}var h,p=new Map;function g(t,n,r){return t[n]?n:t[r]?r:function(t){for(var n in t)return n}(t)}function w(t,n){var r=n;if(!t.includes(r)){r=1/0;for(var e=0;e<t.length;e++)Math.abs(t[e]-n)<Math.abs(r-n)&&(r=t[e]);}return r}function k(t){return h||(h=new Set,c("9-D,20,85,A0,1680,2000-200A,2028-202F,205F,3000",(function(t){h.add(t);}))),h.has(t)}return t.CodePointSet=n,t.clearCache=function(){s={},f={};},t.getFontsForString=function(t,n){void 0===n&&(n={});var r,e=n.lang;void 0===e&&(e=/\p{Script=Hangul}/u.test(r=t)?"ko":/\p{Script=Hiragana}|\p{Script=Katakana}/u.test(r)?"ja":"en");var o=n.category;void 0===o&&(o="sans-serif");var u=n.style;void 0===u&&(u="normal");var c=n.weight;void 0===c&&(c=400);var l=(n.dataUrl||v).replace(/\/$/g,""),h=new Map,y=new Uint8Array(t.length),b={},m={},A=new Array(t.length),S=new Map,j=!1;function M(t){var n=p.get(t);return n||(n=fetch(l+"/"+t).then((function(t){if(!t.ok)throw new Error(t.statusText);return t.json().then((function(t){if(!Array.isArray(t)||1!==t[0])throw new Error("Incorrect schema version; need 1, got "+t[0]);return t[1]}))})).catch((function(n){if(l!==v)return j||(console.error('unicode-font-resolver: Failed loading from dataUrl "'+l+'", trying default CDN. '+n.message),j=!0),l=v,p.delete(t),M(t);throw n})),p.set(t,n)),n}for(var P=function(n){var r=t.codePointAt(n),e=a(r);A[n]=e,s[e]||S.has(e)||S.set(e,M(e).then((function(t){s[e]=t;}))),r>65535&&(n++,E=n);},E=0;E<t.length;E++)P(E);return Promise.all(S.values()).then((function(){S.clear();for(var n=function(n){var o=t.codePointAt(n),a=null,u=s[A[n]],c=void 0;for(var l in u){var v=m[l];if(void 0===v&&(v=m[l]=new RegExp(l).test(e||"en")),v){for(var d in c=l,u[l])if(i(o,u[l][d])){a=d;break}break}}if(!a)t:for(var h in u)if(h!==c)for(var p in u[h])if(i(o,u[h][p])){a=p;break t}a||(console.debug("No font coverage for U+"+o.toString(16)),a="latin"),A[n]=a,f[a]||S.has(a)||S.set(a,M("font-meta/"+a+".json").then((function(t){f[a]=t;}))),o>65535&&(n++,r=n);},r=0;r<t.length;r++)n(r);return Promise.all(S.values())})).then((function(){for(var n,r=null,e=0;e<t.length;e++){var a=t.codePointAt(e);if(r&&(k(a)||d(r).has(a)))y[e]=y[e-1];else {r=f[A[e]];var i=b[r.id];if(!i){var s=r.typeforms,v=g(s,o,"sans-serif"),p=g(s[v],u,"normal"),m=w(null===(n=s[v])||void 0===n?void 0:n[p],c);i=b[r.id]=l+"/font-files/"+r.id+"/"+v+"."+p+"."+m+".woff";}var S=h.get(i);null==S&&(S=h.size,h.set(i,S)),y[e]=S;}a>65535&&(e++,y[e]=y[e-1]);}return {fontUrls:Array.from(h.keys()),chars:y}}))},Object.defineProperty(t,"__esModule",{value:!0}),t}({})}

  /**
   * @typedef {string | {src:string, label?:string, unicodeRange?:string, lang?:string}} UserFont
   */

  /**
   * @typedef {ClientOptions} FontResolverOptions
   * @property {Array<UserFont>|UserFont} [fonts]
   * @property {'normal'|'italic'} [style]
   * @property {'normal'|'bold'|number} [style]
   * @property {string} [unicodeFontsURL]
   */

  /**
   * @typedef {Object} FontResolverResult
   * @property {Uint8Array} chars
   * @property {Array<ParsedFont & {src:string}>} fonts
   */

  /**
   * @typedef {function} FontResolver
   * @param {string} text
   * @param {(FontResolverResult) => void} callback
   * @param {FontResolverOptions} [options]
   */

  /**
   * Factory for the FontResolver function.
   * @param {FontParser} fontParser
   * @param {{getFontsForString: function, CodePointSet: function}} unicodeFontResolverClient
   * @return {FontResolver}
   */
  function createFontResolver(fontParser, unicodeFontResolverClient) {
    /**
     * @type {Record<string, ParsedFont>}
     */
    const parsedFonts = Object.create(null);

    /**
     * @type {Record<string, Array<(ParsedFont) => void>>}
     */
    const loadingFonts = Object.create(null);

    /**
     * Load a given font url
     */
    function doLoadFont(url, callback) {
      const onError = err => {
        console.error(`Failure loading font ${url}`, err);
      };
      try {
        const request = new XMLHttpRequest();
        request.open('get', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
          if (request.status >= 400) {
            onError(new Error(request.statusText));
          }
          else if (request.status > 0) {
            try {
              const fontObj = fontParser(request.response);
              fontObj.src = url;
              callback(fontObj);
            } catch (e) {
              onError(e);
            }
          }
        };
        request.onerror = onError;
        request.send();
      } catch(err) {
        onError(err);
      }
    }


    /**
     * Load a given font url if needed, invoking a callback when it's loaded. If already
     * loaded, the callback will be called synchronously.
     * @param {string} fontUrl
     * @param {(font: ParsedFont) => void} callback
     */
    function loadFont(fontUrl, callback) {
      let font = parsedFonts[fontUrl];
      if (font) {
        callback(font);
      } else if (loadingFonts[fontUrl]) {
        loadingFonts[fontUrl].push(callback);
      } else {
        loadingFonts[fontUrl] = [callback];
        doLoadFont(fontUrl, fontObj => {
          fontObj.src = fontUrl;
          parsedFonts[fontUrl] = fontObj;
          loadingFonts[fontUrl].forEach(cb => cb(fontObj));
          delete loadingFonts[fontUrl];
        });
      }
    }

    /**
     * For a given string of text, determine which fonts are required to fully render it and
     * ensure those fonts are loaded.
     */
    return function (text, callback, {
      lang,
      fonts: userFonts = [],
      style = 'normal',
      weight = 'normal',
      unicodeFontsURL
    } = {}) {
      const charResolutions = new Uint8Array(text.length);
      const fontResolutions = [];
      if (!text.length) {
        allDone();
      }

      const fontIndices = new Map();
      const fallbackRanges = []; // [[start, end], ...]

      if (style !== 'italic') style = 'normal';
      if (typeof weight !== 'number') {
        weight = weight === 'bold' ? 700 : 400;
      }

      if (userFonts && !Array.isArray(userFonts)) {
        userFonts = [userFonts];
      }
      userFonts = userFonts.slice()
        // filter by language
        .filter(def => !def.lang || def.lang.test(lang))
        // switch order for easier iteration
        .reverse();
      if (userFonts.length) {
        const UNKNOWN = 0;
        const RESOLVED = 1;
        const NEEDS_FALLBACK = 2;
        let prevCharResult = UNKNOWN

        ;(function resolveUserFonts (startIndex = 0) {
          for (let i = startIndex, iLen = text.length; i < iLen; i++) {
            const codePoint = text.codePointAt(i);
            // Carry previous character's result forward if:
            // - it resolved to a font that also covers this character
            // - this character is whitespace
            if (
              (prevCharResult === RESOLVED && fontResolutions[charResolutions[i - 1]].supportsCodePoint(codePoint)) ||
              (i > 0 && /\s/.test(text[i]))
            ) {
              charResolutions[i] = charResolutions[i - 1];
              if (prevCharResult === NEEDS_FALLBACK) {
                fallbackRanges[fallbackRanges.length - 1][1] = i;
              }
            } else {
              for (let j = charResolutions[i], jLen = userFonts.length; j <= jLen; j++) {
                if (j === jLen) {
                  // none of the user fonts matched; needs fallback
                  const range = prevCharResult === NEEDS_FALLBACK ?
                    fallbackRanges[fallbackRanges.length - 1] :
                    (fallbackRanges[fallbackRanges.length] = [i, i]);
                  range[1] = i;
                  prevCharResult = NEEDS_FALLBACK;
                } else {
                  charResolutions[i] = j;
                  const { src, unicodeRange } = userFonts[j];
                  // filter by optional explicit unicode ranges
                  if (!unicodeRange || isCodeInRanges(codePoint, unicodeRange)) {
                    const fontObj = parsedFonts[src];
                    // font not yet loaded, load it and resume
                    if (!fontObj) {
                      loadFont(src, () => {
                        resolveUserFonts(i);
                      });
                      return;
                    }
                    // if the font actually contains a glyph for this char, lock it in
                    if (fontObj.supportsCodePoint(codePoint)) {
                      let fontIndex = fontIndices.get(fontObj);
                      if (typeof fontIndex !== 'number') {
                        fontIndex = fontResolutions.length;
                        fontResolutions.push(fontObj);
                        fontIndices.set(fontObj, fontIndex);
                      }
                      charResolutions[i] = fontIndex;
                      prevCharResult = RESOLVED;
                      break;
                    }
                  }
                }
              }
            }

            if (codePoint > 0xffff && i + 1 < iLen) {
              charResolutions[i + 1] = charResolutions[i];
              i++;
              if (prevCharResult === NEEDS_FALLBACK) {
                fallbackRanges[fallbackRanges.length - 1][1] = i;
              }
            }
          }
          resolveFallbacks();
        })();
      } else {
        fallbackRanges.push([0, text.length - 1]);
        resolveFallbacks();
      }

      function resolveFallbacks() {
        if (fallbackRanges.length) {
          // Combine all fallback substrings into a single string for querying
          const fallbackString = fallbackRanges.map(range => text.substring(range[0], range[1] + 1)).join('\n');
          unicodeFontResolverClient.getFontsForString(fallbackString, {
            lang: lang || undefined,
            style,
            weight,
            dataUrl: unicodeFontsURL
          }).then(({fontUrls, chars}) => {
            // Extract results and put them back in the main array
            const fontIndexOffset = fontResolutions.length;
            let charIdx = 0;
            fallbackRanges.forEach(range => {
              for (let i = 0, endIdx = range[1] - range[0]; i <= endIdx; i++) {
                charResolutions[range[0] + i] = chars[charIdx++] + fontIndexOffset;
              }
              charIdx++; //skip segment separator
            });

            // Load and parse the fallback fonts - avoiding Promise here to prevent polyfills in the worker
            let loadedCount = 0;
            fontUrls.forEach((url, i) => {
              loadFont(url, fontObj => {
                fontResolutions[i + fontIndexOffset] = fontObj;
                if (++loadedCount === fontUrls.length) {
                  allDone();
                }
              });
            });
          });
        } else {
          allDone();
        }
      }

      function allDone() {
        callback({
          chars: charResolutions,
          fonts: fontResolutions
        });
      }

      function isCodeInRanges(code, ranges) {
        // todo optimize search - CodePointSet from unicode-font-resolver?
        for (let k = 0; k < ranges.length; k++) {
          const [start, end = start] = ranges[k];
          if (start <= code && code <= end) {
            return true
          }
        }
        return false
      }
    }
  }

  const fontResolverWorkerModule = /*#__PURE__*/troikaWorkerUtils.defineWorkerModule({
    name: 'FontResolver',
    dependencies: [
      createFontResolver,
      workerModule,
      unicodeFontResolverClientFactory,
    ],
    init(createFontResolver, fontParser, unicodeFontResolverClientFactory) {
      return createFontResolver(fontParser, unicodeFontResolverClientFactory());
    }
  });

  /**
   * @typedef {number|'left'|'center'|'right'} AnchorXValue
   */
  /**
   * @typedef {number|'top'|'top-baseline'|'top-cap'|'top-ex'|'middle'|'bottom-baseline'|'bottom'} AnchorYValue
   */

  /**
   * @typedef {object} TypesetParams
   * @property {string} text
   * @property {UserFont|UserFont[]} [font]
   * @property {string} [lang]
   * @property {number} [sdfGlyphSize=64]
   * @property {number} [fontSize=1]
   * @property {number|'normal'|'bold'} [fontWeight='normal']
   * @property {'normal'|'italic'} [fontStyle='normal']
   * @property {number} [letterSpacing=0]
   * @property {'normal'|number} [lineHeight='normal']
   * @property {number} [maxWidth]
   * @property {'ltr'|'rtl'} [direction='ltr']
   * @property {string} [textAlign='left']
   * @property {number} [textIndent=0]
   * @property {'normal'|'nowrap'} [whiteSpace='normal']
   * @property {'normal'|'break-word'} [overflowWrap='normal']
   * @property {AnchorXValue} [anchorX=0]
   * @property {AnchorYValue} [anchorY=0]
   * @property {boolean} [metricsOnly=false]
   * @property {string} [unicodeFontsURL]
   * @property {FontResolverResult} [preResolvedFonts]
   * @property {boolean} [includeCaretPositions=false]
   * @property {number} [chunkedBoundsSize=8192]
   * @property {{[rangeStartIndex]: number}} [colorRanges]
   */

  /**
   * @typedef {object} TypesetResult
   * @property {Uint16Array} glyphIds id for each glyph, specific to that glyph's font
   * @property {Uint8Array} glyphFontIndices index into fontData for each glyph
   * @property {Float32Array} glyphPositions x,y of each glyph's origin in layout
   * @property {{[font]: {[glyphId]: {path: string, pathBounds: number[]}}}} glyphData data about each glyph appearing in the text
   * @property {TypesetFontData[]} fontData data about each font used in the text
   * @property {Float32Array} [caretPositions] startX,endX,bottomY caret positions for each char
   * @property {Uint8Array} [glyphColors] color for each glyph, if color ranges supplied
   *         chunkedBounds, //total rects per (n=chunkedBoundsSize) consecutive glyphs
   *         fontSize, //calculated em height
   *         topBaseline: anchorYOffset + lines[0].baseline, //y coordinate of the top line's baseline
   *         blockBounds: [ //bounds for the whole block of text, including vertical padding for lineHeight
   *           anchorXOffset,
   *           anchorYOffset - totalHeight,
   *           anchorXOffset + maxLineWidth,
   *           anchorYOffset
   *         ],
   *         visibleBounds, //total bounds of visible text paths, may be larger or smaller than blockBounds
   *         timings
   */

  /**
   * @typedef {object} TypesetFontData
   * @property src
   * @property unitsPerEm
   * @property ascender
   * @property descender
   * @property lineHeight
   * @property capHeight
   * @property xHeight
   */

  /**
   * @typedef {function} TypesetterTypesetFunction - compute fonts and layout for some text.
   * @param {TypesetParams} params
   * @param {(TypesetResult) => void} callback - function called when typesetting is complete.
   *    If the params included `preResolvedFonts`, this will be called synchronously.
   */

  /**
   * @typedef {function} TypesetterMeasureFunction - compute width/height for some text.
   * @param {TypesetParams} params
   * @param {(width:number, height:number) => void} callback - function called when measurement is complete.
   *    If the params included `preResolvedFonts`, this will be called synchronously.
   */


  /**
   * Factory function that creates a self-contained environment for processing text typesetting requests.
   *
   * It is important that this function has no closure dependencies, so that it can be easily injected
   * into the source for a Worker without requiring a build step or complex dependency loading. All its
   * dependencies must be passed in at initialization.
   *
   * @param {FontResolver} resolveFonts - function to resolve a string to parsed fonts
   * @param {object} bidi - the bidi.js implementation object
   * @return {{typeset: TypesetterTypesetFunction, measure: TypesetterMeasureFunction}}
   */
  function createTypesetter(resolveFonts, bidi) {
    const INF = Infinity;

    // Set of Unicode Default_Ignorable_Code_Point characters, these will not produce visible glyphs
    // eslint-disable-next-line no-misleading-character-class
    const DEFAULT_IGNORABLE_CHARS = /[\u00AD\u034F\u061C\u115F-\u1160\u17B4-\u17B5\u180B-\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8]/;

    // This regex (instead of /\s/) allows us to select all whitespace EXCEPT for non-breaking white spaces
    const lineBreakingWhiteSpace = `[^\\S\\u00A0]`;

    // Incomplete set of characters that allow line breaking after them
    // In the future we may consider a full Unicode line breaking algorithm impl: https://www.unicode.org/reports/tr14
    const BREAK_AFTER_CHARS = new RegExp(`${lineBreakingWhiteSpace}|[\\-\\u007C\\u00AD\\u2010\\u2012-\\u2014\\u2027\\u2056\\u2E17\\u2E40]`);

    /**
     * Load and parse all the necessary fonts to render a given string of text, then group
     * them into consecutive runs of characters sharing a font.
     */
    function calculateFontRuns({text, lang, fonts, style, weight, preResolvedFonts, unicodeFontsURL}, onDone) {
      const onResolved = ({chars, fonts: parsedFonts}) => {
        let curRun, prevVal;
        const runs = [];
        for (let i = 0; i < chars.length; i++) {
          if (chars[i] !== prevVal) {
            prevVal = chars[i];
            runs.push(curRun = { start: i, end: i, fontObj: parsedFonts[chars[i]]});
          } else {
            curRun.end = i;
          }
        }
        onDone(runs);
      };
      if (preResolvedFonts) {
        onResolved(preResolvedFonts);
      } else {
        resolveFonts(
          text,
          onResolved,
          { lang, fonts, style, weight, unicodeFontsURL }
        );
      }
    }

    /**
     * Main entry point.
     * Process a text string with given font and formatting parameters, and return all info
     * necessary to render all its glyphs.
     * @type TypesetterTypesetFunction
     */
    function typeset(
      {
        text='',
        font,
        lang,
        sdfGlyphSize=64,
        fontSize=400,
        fontWeight=1,
        fontStyle='normal',
        letterSpacing=0,
        lineHeight='normal',
        maxWidth=INF,
        direction,
        textAlign='left',
        textIndent=0,
        whiteSpace='normal',
        overflowWrap='normal',
        anchorX = 0,
        anchorY = 0,
        metricsOnly=false,
        unicodeFontsURL,
        preResolvedFonts=null,
        includeCaretPositions=false,
        chunkedBoundsSize=8192,
        colorRanges=null
      },
      callback
    ) {
      const mainStart = now();
      const timings = {fontLoad: 0, typesetting: 0};

      // Ensure newlines are normalized
      if (text.indexOf('\r') > -1) {
        console.info('Typesetter: got text with \\r chars; normalizing to \\n');
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      }

      // Ensure we've got numbers not strings
      fontSize = +fontSize;
      letterSpacing = +letterSpacing;
      maxWidth = +maxWidth;
      lineHeight = lineHeight || 'normal';
      textIndent = +textIndent;

      calculateFontRuns({
        text,
        lang,
        style: fontStyle,
        weight: fontWeight,
        fonts: typeof font === 'string' ? [{src: font}] : font,
        unicodeFontsURL,
        preResolvedFonts
      }, runs => {
        timings.fontLoad = now() - mainStart;
        const hasMaxWidth = isFinite(maxWidth);
        let glyphIds = null;
        let glyphFontIndices = null;
        let glyphPositions = null;
        let glyphData = null;
        let glyphColors = null;
        let caretPositions = null;
        let visibleBounds = null;
        let chunkedBounds = null;
        let maxLineWidth = 0;
        let renderableGlyphCount = 0;
        let canWrap = whiteSpace !== 'nowrap';
        const metricsByFont = new Map(); // fontObj -> metrics
        const typesetStart = now();

        // Distribute glyphs into lines based on wrapping
        let lineXOffset = textIndent;
        let prevRunEndX = 0;
        let currentLine = new TextLine();
        const lines = [currentLine];
        runs.forEach(run => {
          const { fontObj } = run;
          const { ascender, descender, unitsPerEm, lineGap, capHeight, xHeight } = fontObj;

          // Calculate metrics for each font used
          let fontData = metricsByFont.get(fontObj);
          if (!fontData) {
            // Find conversion between native font units and fontSize units
            const fontSizeMult = fontSize / unitsPerEm;

            // Determine appropriate value for 'normal' line height based on the font's actual metrics
            // This does not guarantee individual glyphs won't exceed the line height, e.g. Roboto; should we use yMin/Max instead?
            const calcLineHeight = lineHeight === 'normal' ?
              (ascender - descender + lineGap) * fontSizeMult : lineHeight * fontSize;

            // Determine line height and leading adjustments
            const halfLeading = (calcLineHeight - (ascender - descender) * fontSizeMult) / 2;
            const caretHeight = Math.min(calcLineHeight, (ascender - descender) * fontSizeMult);
            const caretTop = (ascender + descender) / 2 * fontSizeMult + caretHeight / 2;
            fontData = {
              index: metricsByFont.size,
              src: fontObj.src,
              fontObj,
              fontSizeMult,
              unitsPerEm,
              ascender: ascender * fontSizeMult,
              descender: descender * fontSizeMult,
              capHeight: capHeight * fontSizeMult,
              xHeight: xHeight * fontSizeMult,
              lineHeight: calcLineHeight,
              baseline: -halfLeading - ascender * fontSizeMult, // baseline offset from top of line height
              // cap: -halfLeading - capHeight * fontSizeMult, // cap from top of line height
              // ex: -halfLeading - xHeight * fontSizeMult, // ex from top of line height
              caretTop,
              caretBottom: caretTop - caretHeight
            };
            metricsByFont.set(fontObj, fontData);
          }
          const { fontSizeMult } = fontData;

          const runText = text.slice(run.start, run.end + 1);
          let prevGlyphX, prevGlyphObj;
          fontObj.forEachGlyph(runText, fontSize, letterSpacing, (glyphObj, glyphX, glyphY, charIndex) => {
            glyphX += prevRunEndX;
            charIndex += run.start;
            prevGlyphX = glyphX;
            prevGlyphObj = glyphObj;
            const char = text.charAt(charIndex);
            const glyphWidth = glyphObj.advanceWidth * fontSizeMult;
            const curLineCount = currentLine.count;
            let nextLine;

            // Calc isWhitespace and isEmpty once per glyphObj
            if (!('isEmpty' in glyphObj)) {
              glyphObj.isWhitespace = !!char && new RegExp(lineBreakingWhiteSpace).test(char);
              glyphObj.canBreakAfter = !!char && BREAK_AFTER_CHARS.test(char);
              glyphObj.isEmpty = glyphObj.xMin === glyphObj.xMax || glyphObj.yMin === glyphObj.yMax || DEFAULT_IGNORABLE_CHARS.test(char);
            }
            if (!glyphObj.isWhitespace && !glyphObj.isEmpty) {
              renderableGlyphCount++;
            }

            // If a non-whitespace character overflows the max width, we need to soft-wrap
            if (canWrap && hasMaxWidth && !glyphObj.isWhitespace && glyphX + glyphWidth + lineXOffset > maxWidth && curLineCount) {
              // If it's the first char after a whitespace, start a new line
              if (currentLine.glyphAt(curLineCount - 1).glyphObj.canBreakAfter) {
                nextLine = new TextLine();
                lineXOffset = -glyphX;
              } else {
                // Back up looking for a whitespace character to wrap at
                for (let i = curLineCount; i--;) {
                  // If we got the start of the line there's no soft break point; make hard break if overflowWrap='break-word'
                  if (i === 0 && overflowWrap === 'break-word') {
                    nextLine = new TextLine();
                    lineXOffset = -glyphX;
                    break
                  }
                  // Found a soft break point; move all chars since it to a new line
                  else if (currentLine.glyphAt(i).glyphObj.canBreakAfter) {
                    nextLine = currentLine.splitAt(i + 1);
                    const adjustX = nextLine.glyphAt(0).x;
                    lineXOffset -= adjustX;
                    for (let j = nextLine.count; j--;) {
                      nextLine.glyphAt(j).x -= adjustX;
                    }
                    break
                  }
                }
              }
              if (nextLine) {
                currentLine.isSoftWrapped = true;
                currentLine = nextLine;
                lines.push(currentLine);
                maxLineWidth = maxWidth; //after soft wrapping use maxWidth as calculated width
              }
            }

            let fly = currentLine.glyphAt(currentLine.count);
            fly.glyphObj = glyphObj;
            fly.x = glyphX + lineXOffset;
            fly.y = glyphY;
            fly.width = glyphWidth;
            fly.charIndex = charIndex;
            fly.fontData = fontData;

            // Handle hard line breaks
            if (char === '\n') {
              currentLine = new TextLine();
              lines.push(currentLine);
              lineXOffset = -(glyphX + glyphWidth + (letterSpacing * fontSize)) + textIndent;
            }
          });
          // At the end of a run we must capture the x position as the starting point for the next run
          prevRunEndX = prevGlyphX + prevGlyphObj.advanceWidth * fontSizeMult + letterSpacing * fontSize;
        });

        // Calculate width/height/baseline of each line (excluding trailing whitespace) and maximum block width
        let totalHeight = 0;
        lines.forEach(line => {
          let isTrailingWhitespace = true;
          for (let i = line.count; i--;) {
            const glyphInfo = line.glyphAt(i);
            // omit trailing whitespace from width calculation
            if (isTrailingWhitespace && !glyphInfo.glyphObj.isWhitespace) {
              line.width = glyphInfo.x + glyphInfo.width;
              if (line.width > maxLineWidth) {
                maxLineWidth = line.width;
              }
              isTrailingWhitespace = false;
            }
            // use the tallest line height, lowest baseline, and highest cap/ex
            let {lineHeight, capHeight, xHeight, baseline} = glyphInfo.fontData;
            if (lineHeight > line.lineHeight) line.lineHeight = lineHeight;
            const baselineDiff = baseline - line.baseline;
            if (baselineDiff < 0) { //shift all metrics down
              line.baseline += baselineDiff;
              line.cap += baselineDiff;
              line.ex += baselineDiff;
            }
            // compare cap/ex based on new lowest baseline
            line.cap = Math.max(line.cap, line.baseline + capHeight);
            line.ex = Math.max(line.ex, line.baseline + xHeight);
          }
          line.baseline -= totalHeight;
          line.cap -= totalHeight;
          line.ex -= totalHeight;
          totalHeight += line.lineHeight;
        });

        // Find overall position adjustments for anchoring
        let anchorXOffset = 0;
        let anchorYOffset = 0;
        if (anchorX) {
          if (typeof anchorX === 'number') {
            anchorXOffset = -anchorX;
          }
          else if (typeof anchorX === 'string') {
            anchorXOffset = -maxLineWidth * (
              anchorX === 'left' ? 0 :
              anchorX === 'center' ? 0.5 :
              anchorX === 'right' ? 1 :
              parsePercent(anchorX)
            );
          }
        }
        if (anchorY) {
          if (typeof anchorY === 'number') {
            anchorYOffset = -anchorY;
          }
          else if (typeof anchorY === 'string') {
            anchorYOffset = anchorY === 'top' ? 0 :
              anchorY === 'top-baseline' ? -lines[0].baseline :
              anchorY === 'top-cap' ? -lines[0].cap :
              anchorY === 'top-ex' ? -lines[0].ex :
              anchorY === 'middle' ? totalHeight / 2 :
              anchorY === 'bottom' ? totalHeight :
              anchorY === 'bottom-baseline' ? -lines[lines.length - 1].baseline :
              parsePercent(anchorY) * totalHeight;
          }
        }

        if (!metricsOnly) {
          // Resolve bidi levels
          const bidiLevelsResult = bidi.getEmbeddingLevels(text, direction);

          // Process each line, applying alignment offsets, adding each glyph to the atlas, and
          // collecting all renderable glyphs into a single collection.
          glyphIds = new Uint16Array(renderableGlyphCount);
          glyphFontIndices = new Uint8Array(renderableGlyphCount);
          glyphPositions = new Float32Array(renderableGlyphCount * 2);
          glyphData = {};
          visibleBounds = [INF, INF, -INF, -INF];
          chunkedBounds = [];
          if (includeCaretPositions) {
            caretPositions = new Float32Array(text.length * 4);
          }
          if (colorRanges) {
            glyphColors = new Uint8Array(renderableGlyphCount * 3);
          }
          let renderableGlyphIndex = 0;
          let prevCharIndex = -1;
          let colorCharIndex = -1;
          let chunk;
          let currentColor;
          lines.forEach((line, lineIndex) => {
            let {count:lineGlyphCount, width:lineWidth} = line;

            // Ignore empty lines
            if (lineGlyphCount > 0) {
              // Count trailing whitespaces, we want to ignore these for certain things
              let trailingWhitespaceCount = 0;
              for (let i = lineGlyphCount; i-- && line.glyphAt(i).glyphObj.isWhitespace;) {
                trailingWhitespaceCount++;
              }

              // Apply horizontal alignment adjustments
              let lineXOffset = 0;
              let justifyAdjust = 0;
              if (textAlign === 'center') {
                lineXOffset = (maxLineWidth - lineWidth) / 2;
              } else if (textAlign === 'right') {
                lineXOffset = maxLineWidth - lineWidth;
              } else if (textAlign === 'justify' && line.isSoftWrapped) {
                // count non-trailing whitespace characters, and we'll adjust the offsets per character in the next loop
                let whitespaceCount = 0;
                for (let i = lineGlyphCount - trailingWhitespaceCount; i--;) {
                  if (line.glyphAt(i).glyphObj.isWhitespace) {
                    whitespaceCount++;
                  }
                }
                justifyAdjust = (maxLineWidth - lineWidth) / whitespaceCount;
              }
              if (justifyAdjust || lineXOffset) {
                let justifyOffset = 0;
                for (let i = 0; i < lineGlyphCount; i++) {
                  let glyphInfo = line.glyphAt(i);
                  const glyphObj = glyphInfo.glyphObj;
                  glyphInfo.x += lineXOffset + justifyOffset;
                  // Expand non-trailing whitespaces for justify alignment
                  if (justifyAdjust !== 0 && glyphObj.isWhitespace && i < lineGlyphCount - trailingWhitespaceCount) {
                    justifyOffset += justifyAdjust;
                    glyphInfo.width += justifyAdjust;
                  }
                }
              }

              // Perform bidi range flipping
              const flips = bidi.getReorderSegments(
                text, bidiLevelsResult, line.glyphAt(0).charIndex, line.glyphAt(line.count - 1).charIndex
              );
              for (let fi = 0; fi < flips.length; fi++) {
                const [start, end] = flips[fi];
                // Map start/end string indices to indices in the line
                let left = Infinity, right = -Infinity;
                for (let i = 0; i < lineGlyphCount; i++) {
                  if (line.glyphAt(i).charIndex >= start) { // gte to handle removed characters
                    let startInLine = i, endInLine = i;
                    for (; endInLine < lineGlyphCount; endInLine++) {
                      let info = line.glyphAt(endInLine);
                      if (info.charIndex > end) {
                        break
                      }
                      if (endInLine < lineGlyphCount - trailingWhitespaceCount) { //don't include trailing ws in flip width
                        left = Math.min(left, info.x);
                        right = Math.max(right, info.x + info.width);
                      }
                    }
                    for (let j = startInLine; j < endInLine; j++) {
                      const glyphInfo = line.glyphAt(j);
                      glyphInfo.x = right - (glyphInfo.x + glyphInfo.width - left);
                    }
                    break
                  }
                }
              }

              // Assemble final data arrays
              let glyphObj;
              const setGlyphObj = g => glyphObj = g;
              for (let i = 0; i < lineGlyphCount; i++) {
                const glyphInfo = line.glyphAt(i);
                glyphObj = glyphInfo.glyphObj;
                const glyphId = glyphObj.index;

                // Replace mirrored characters in rtl
                const rtl = bidiLevelsResult.levels[glyphInfo.charIndex] & 1; //odd level means rtl
                if (rtl) {
                  const mirrored = bidi.getMirroredCharacter(text[glyphInfo.charIndex]);
                  if (mirrored) {
                    glyphInfo.fontData.fontObj.forEachGlyph(mirrored, 0, 0, setGlyphObj);
                  }
                }

                // Add caret positions
                if (includeCaretPositions) {
                  const {charIndex, fontData} = glyphInfo;
                  const caretLeft = glyphInfo.x + anchorXOffset;
                  const caretRight = glyphInfo.x + glyphInfo.width + anchorXOffset;
                  caretPositions[charIndex * 4] = rtl ? caretRight : caretLeft; //start edge x
                  caretPositions[charIndex * 4 + 1] = rtl ? caretLeft : caretRight; //end edge x
                  caretPositions[charIndex * 4 + 2] = line.baseline + fontData.caretBottom + anchorYOffset; //common bottom y
                  caretPositions[charIndex * 4 + 3] = line.baseline + fontData.caretTop + anchorYOffset; //common top y

                  // If we skipped any chars from the previous glyph (due to ligature subs), fill in caret
                  // positions for those missing char indices; currently this uses a best-guess by dividing
                  // the ligature's width evenly. In the future we may try to use the font's LigatureCaretList
                  // table to get better interior caret positions.
                  const ligCount = charIndex - prevCharIndex;
                  if (ligCount > 1) {
                    fillLigatureCaretPositions(caretPositions, prevCharIndex, ligCount);
                  }
                  prevCharIndex = charIndex;
                }

                // Track current color range
                if (colorRanges) {
                  const {charIndex} = glyphInfo;
                  while(charIndex > colorCharIndex) {
                    colorCharIndex++;
                    if (colorRanges.hasOwnProperty(colorCharIndex)) {
                      currentColor = colorRanges[colorCharIndex];
                    }
                  }
                }

                // Get atlas data for renderable glyphs
                if (!glyphObj.isWhitespace && !glyphObj.isEmpty) {
                  const idx = renderableGlyphIndex++;
                  const {fontSizeMult, src: fontSrc, index: fontIndex} = glyphInfo.fontData;

                  // Add this glyph's path data
                  const fontGlyphData = glyphData[fontSrc] || (glyphData[fontSrc] = {});
                  if (!fontGlyphData[glyphId]) {
                    fontGlyphData[glyphId] = {
                      path: glyphObj.path,
                      pathBounds: [glyphObj.xMin, glyphObj.yMin, glyphObj.xMax, glyphObj.yMax]
                    };
                  }

                  // Determine final glyph position and add to glyphPositions array
                  const glyphX = glyphInfo.x + anchorXOffset;
                  const glyphY = glyphInfo.y + line.baseline + anchorYOffset;
                  glyphPositions[idx * 2] = glyphX;
                  glyphPositions[idx * 2 + 1] = glyphY;

                  // Track total visible bounds
                  const visX0 = glyphX + glyphObj.xMin * fontSizeMult;
                  const visY0 = glyphY + glyphObj.yMin * fontSizeMult;
                  const visX1 = glyphX + glyphObj.xMax * fontSizeMult;
                  const visY1 = glyphY + glyphObj.yMax * fontSizeMult;
                  if (visX0 < visibleBounds[0]) visibleBounds[0] = visX0;
                  if (visY0 < visibleBounds[1]) visibleBounds[1] = visY0;
                  if (visX1 > visibleBounds[2]) visibleBounds[2] = visX1;
                  if (visY1 > visibleBounds[3]) visibleBounds[3] = visY1;

                  // Track bounding rects for each chunk of N glyphs
                  if (idx % chunkedBoundsSize === 0) {
                    chunk = {start: idx, end: idx, rect: [INF, INF, -INF, -INF]};
                    chunkedBounds.push(chunk);
                  }
                  chunk.end++;
                  const chunkRect = chunk.rect;
                  if (visX0 < chunkRect[0]) chunkRect[0] = visX0;
                  if (visY0 < chunkRect[1]) chunkRect[1] = visY0;
                  if (visX1 > chunkRect[2]) chunkRect[2] = visX1;
                  if (visY1 > chunkRect[3]) chunkRect[3] = visY1;

                  // Add to glyph ids and font indices arrays
                  glyphIds[idx] = glyphId;
                  glyphFontIndices[idx] = fontIndex;

                  // Add colors
                  if (colorRanges) {
                    const start = idx * 3;
                    glyphColors[start] = currentColor >> 16 & 255;
                    glyphColors[start + 1] = currentColor >> 8 & 255;
                    glyphColors[start + 2] = currentColor & 255;
                  }
                }
              }
            }
          });

          // Fill in remaining caret positions in case the final character was a ligature
          if (caretPositions) {
            const ligCount = text.length - prevCharIndex;
            if (ligCount > 1) {
              fillLigatureCaretPositions(caretPositions, prevCharIndex, ligCount);
            }
          }
        }

        // Assemble final data about each font used
        const fontData = [];
        metricsByFont.forEach(({index, src, unitsPerEm, ascender, descender, lineHeight, capHeight, xHeight}) => {
          fontData[index] = {src, unitsPerEm, ascender, descender, lineHeight, capHeight, xHeight};
        });

        // Timing stats
        timings.typesetting = now() - typesetStart;

        callback({
          glyphIds, //id for each glyph, specific to that glyph's font
          glyphFontIndices, //index into fontData for each glyph
          glyphPositions, //x,y of each glyph's origin in layout
          glyphData, //dict holding data about each glyph appearing in the text
          fontData, //data about each font used in the text
          caretPositions, //startX,endX,bottomY caret positions for each char
          // caretHeight, //height of cursor from bottom to top - todo per glyph?
          glyphColors, //color for each glyph, if color ranges supplied
          chunkedBounds, //total rects per (n=chunkedBoundsSize) consecutive glyphs
          fontSize, //calculated em height
          topBaseline: anchorYOffset + lines[0].baseline, //y coordinate of the top line's baseline
          blockBounds: [ //bounds for the whole block of text, including vertical padding for lineHeight
            anchorXOffset,
            anchorYOffset - totalHeight,
            anchorXOffset + maxLineWidth,
            anchorYOffset
          ],
          visibleBounds, //total bounds of visible text paths, may be larger or smaller than blockBounds
          timings
        });
      });
    }


    /**
     * For a given text string and font parameters, determine the resulting block dimensions
     * after wrapping for the given maxWidth.
     * @param args
     * @param callback
     */
    function measure(args, callback) {
      typeset({...args, metricsOnly: true}, (result) => {
        const [x0, y0, x1, y1] = result.blockBounds;
        callback({
          width: x1 - x0,
          height: y1 - y0
        });
      });
    }

    function parsePercent(str) {
      let match = str.match(/^([\d.]+)%$/);
      let pct = match ? parseFloat(match[1]) : NaN;
      return isNaN(pct) ? 0 : pct / 100
    }

    function fillLigatureCaretPositions(caretPositions, ligStartIndex, ligCount) {
      const ligStartX = caretPositions[ligStartIndex * 4];
      const ligEndX = caretPositions[ligStartIndex * 4 + 1];
      const ligBottom = caretPositions[ligStartIndex * 4 + 2];
      const ligTop = caretPositions[ligStartIndex * 4 + 3];
      const guessedAdvanceX = (ligEndX - ligStartX) / ligCount;
      for (let i = 0; i < ligCount; i++) {
        const startIndex = (ligStartIndex + i) * 4;
        caretPositions[startIndex] = ligStartX + guessedAdvanceX * i;
        caretPositions[startIndex + 1] = ligStartX + guessedAdvanceX * (i + 1);
        caretPositions[startIndex + 2] = ligBottom;
        caretPositions[startIndex + 3] = ligTop;
      }
    }

    function now() {
      return (self.performance || Date).now()
    }

    // Array-backed structure for a single line's glyphs data
    function TextLine() {
      this.data = [];
    }
    const textLineProps = ['glyphObj', 'x', 'y', 'width', 'charIndex', 'fontData'];
    TextLine.prototype = {
      width: 0,
      lineHeight: 0,
      baseline: 0,
      cap: 0,
      ex: 0,
      isSoftWrapped: false,
      get count() {
        return Math.ceil(this.data.length / textLineProps.length)
      },
      glyphAt(i) {
        let fly = TextLine.flyweight;
        fly.data = this.data;
        fly.index = i;
        return fly
      },
      splitAt(i) {
        let newLine = new TextLine();
        newLine.data = this.data.splice(i * textLineProps.length);
        return newLine
      }
    };
    TextLine.flyweight = textLineProps.reduce((obj, prop, i, all) => {
      Object.defineProperty(obj, prop, {
        get() {
          return this.data[this.index * textLineProps.length + i]
        },
        set(val) {
          this.data[this.index * textLineProps.length + i] = val;
        }
      });
      return obj
    }, {data: null, index: 0});


    return {
      typeset,
      measure,
    }
  }

  const now = () => (self.performance || Date).now();

  const mainThreadGenerator = /*#__PURE__*/ createSDFGenerator__default['default']();

  let warned;

  /**
   * Generate an SDF texture image for a single glyph path, placing the result into a webgl canvas at a
   * given location and channel. Utilizes the webgl-sdf-generator external package for GPU-accelerated SDF
   * generation when supported.
   */
  function generateSDF(width, height, path, viewBox, distance, exponent, canvas, x, y, channel, useWebGL = true) {
    // Allow opt-out
    if (!useWebGL) {
      return generateSDF_JS_Worker(width, height, path, viewBox, distance, exponent, canvas, x, y, channel)
    }

    // Attempt GPU-accelerated generation first
    return generateSDF_GL(width, height, path, viewBox, distance, exponent, canvas, x, y, channel).then(
      null,
      err => {
        // WebGL failed either due to a hard error or unexpected results; fall back to JS in workers
        if (!warned) {
          console.warn(`WebGL SDF generation failed, falling back to JS`, err);
          warned = true;
        }
        return generateSDF_JS_Worker(width, height, path, viewBox, distance, exponent, canvas, x, y, channel)
      }
    )
  }

  const queue = [];
  const chunkTimeBudget = 5; // ms
  let timer = 0;

  function nextChunk() {
    const start = now();
    while (queue.length && now() - start < chunkTimeBudget) {
      queue.shift()();
    }
    timer = queue.length ? setTimeout(nextChunk, 0) : 0;
  }

  /**
   * WebGL-based implementation executed on the main thread. Requests are executed in time-bounded
   * macrotask chunks to allow render frames to execute in between.
   */
  const generateSDF_GL = (...args) => {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        const start = now();
        try {
          mainThreadGenerator.webgl.generateIntoCanvas(...args);
          resolve({ timing: now() - start });
        } catch (err) {
          reject(err);
        }
      });
      if (!timer) {
        timer = setTimeout(nextChunk, 0);
      }
    })
  };

  const threadCount = 4; // how many workers to spawn
  const idleTimeout = 2000; // workers will be terminated after being idle this many milliseconds
  const threads = {};
  let callNum = 0;

  /**
   * Fallback JS-based implementation, fanned out to a number of worker threads for parallelism
   */
  function generateSDF_JS_Worker(width, height, path, viewBox, distance, exponent, canvas, x, y, channel) {
    const workerId = 'TroikaTextSDFGenerator_JS_' + ((callNum++) % threadCount);
    let thread = threads[workerId];
    if (!thread) {
      thread = threads[workerId] = {
        workerModule: troikaWorkerUtils.defineWorkerModule({
          name: workerId,
          workerId,
          dependencies: [
            createSDFGenerator__default['default'],
            now
          ],
          init(_createSDFGenerator, now) {
            const generate = _createSDFGenerator().javascript.generate;
            return function (...args) {
              const start = now();
              const textureData = generate(...args);
              return {
                textureData,
                timing: now() - start
              }
            }
          },
          getTransferables(result) {
            return [result.textureData.buffer]
          }
        }),
        requests: 0,
        idleTimer: null
      };
    }

    thread.requests++;
    clearTimeout(thread.idleTimer);
    return thread.workerModule(width, height, path, viewBox, distance, exponent)
      .then(({ textureData, timing }) => {
        // copy result data into the canvas
        const start = now();
        // expand single-channel data into rgba
        const imageData = new Uint8Array(textureData.length * 4);
        for (let i = 0; i < textureData.length; i++) {
          imageData[i * 4 + channel] = textureData[i];
        }
        mainThreadGenerator.webglUtils.renderImageData(canvas, imageData, x, y, width, height, 1 << (3 - channel));
        timing += now() - start;

        // clean up workers after a while
        if (--thread.requests === 0) {
          thread.idleTimer = setTimeout(() => { troikaWorkerUtils.terminateWorker(workerId); }, idleTimeout);
        }
        return { timing }
      })
  }

  function warmUpSDFCanvas(canvas) {
    if (!canvas._warm) {
      mainThreadGenerator.webgl.isSupported(canvas);
      canvas._warm = true;
    }
  }

  const resizeWebGLCanvasWithoutClearing = mainThreadGenerator.webglUtils.resizeWebGLCanvasWithoutClearing;

  const CONFIG = {
    defaultFontURL: null,
    unicodeFontsURL: null,
    sdfGlyphSize: 64,
    sdfMargin: 1 / 16,
    sdfExponent: 9,
    textureWidth: 2048,
    useWorker: true,
  };
  const tempColor = /*#__PURE__*/new three.Color();
  let hasRequested = false;

  function now$1() {
    return (self.performance || Date).now()
  }

  /**
   * Customizes the text builder configuration. This must be called prior to the first font processing
   * request, and applies to all fonts.
   *
   * @param {String} config.defaultFontURL - The URL of the default font to use for text processing
   *                 requests, in case none is specified or the specifiede font fails to load or parse.
   *                 Defaults to "Roboto Regular" from Google Fonts.
   * @param {String} config.unicodeFontsURL - A custom location for the fallback unicode-font-resolver
   *                 data and font files, if you don't want to use the default CDN. See
   *                 https://github.com/lojjic/unicode-font-resolver for details. It can also be
   *                 configured per text instance, but this lets you do it once globally.
   * @param {Number} config.sdfGlyphSize - The default size of each glyph's SDF (signed distance field)
   *                 texture used for rendering. Must be a power-of-two number, and applies to all fonts,
   *                 but note that this can also be overridden per call to `getTextRenderInfo()`.
   *                 Larger sizes can improve the quality of glyph rendering by increasing the sharpness
   *                 of corners and preventing loss of very thin lines, at the expense of memory. Defaults
   *                 to 64 which is generally a good balance of size and quality.
   * @param {Number} config.sdfExponent - The exponent used when encoding the SDF values. A higher exponent
   *                 shifts the encoded 8-bit values to achieve higher precision/accuracy at texels nearer
   *                 the glyph's path, with lower precision further away. Defaults to 9.
   * @param {Number} config.sdfMargin - How much space to reserve in the SDF as margin outside the glyph's
   *                 path, as a percentage of the SDF width. A larger margin increases the quality of
   *                 extruded glyph outlines, but decreases the precision available for the glyph itself.
   *                 Defaults to 1/16th of the glyph size.
   * @param {Number} config.textureWidth - The width of the SDF texture; must be a power of 2. Defaults to
   *                 2048 which is a safe maximum texture dimension according to the stats at
   *                 https://webglstats.com/webgl/parameter/MAX_TEXTURE_SIZE and should allow for a
   *                 reasonably large number of glyphs (default glyph size of 64^2 and safe texture size of
   *                 2048^2, times 4 channels, allows for 4096 glyphs.) This can be increased if you need to
   *                 increase the glyph size and/or have an extraordinary number of glyphs.
   * @param {Boolean} config.useWorker - Whether to run typesetting in a web worker. Defaults to true.
   */
  function configureTextBuilder(config) {
    if (hasRequested) {
      console.warn('configureTextBuilder called after first font request; will be ignored.');
    } else {
      assign(CONFIG, config);
    }
  }

  /**
   * Repository for all font SDF atlas textures and their glyph mappings. There is a separate atlas for
   * each sdfGlyphSize. Each atlas has a single Texture that holds all glyphs for all fonts.
   *
   *   {
   *     [sdfGlyphSize]: {
   *       glyphCount: number,
   *       sdfGlyphSize: number,
   *       sdfTexture: Texture,
   *       sdfCanvas: HTMLCanvasElement,
   *       contextLost: boolean,
   *       glyphsByFont: Map<fontURL, Map<glyphID, {path, atlasIndex, sdfViewBox}>>
   *     }
   *   }
   */
  const atlases = Object.create(null);

  /**
   * @typedef {object} TroikaTextRenderInfo - Format of the result from `getTextRenderInfo`.
   * @property {TypesetParams} parameters - The normalized input arguments to the render call.
   * @property {Texture} sdfTexture - The SDF atlas texture.
   * @property {number} sdfGlyphSize - The size of each glyph's SDF; see `configureTextBuilder`.
   * @property {number} sdfExponent - The exponent used in encoding the SDF's values; see `configureTextBuilder`.
   * @property {Float32Array} glyphBounds - List of [minX, minY, maxX, maxY] quad bounds for each glyph.
   * @property {Float32Array} glyphAtlasIndices - List holding each glyph's index in the SDF atlas.
   * @property {Uint8Array} [glyphColors] - List holding each glyph's [r, g, b] color, if `colorRanges` was supplied.
   * @property {Float32Array} [caretPositions] - A list of caret positions for all characters in the string; each is
   *           four elements: the starting X, the ending X, the bottom Y, and the top Y for the caret.
   * @property {number} [caretHeight] - An appropriate height for all selection carets.
   * @property {number} ascender - The font's ascender metric.
   * @property {number} descender - The font's descender metric.
   * @property {number} capHeight - The font's cap height metric, based on the height of Latin capital letters.
   * @property {number} xHeight - The font's x height metric, based on the height of Latin lowercase letters.
   * @property {number} lineHeight - The final computed lineHeight measurement.
   * @property {number} topBaseline - The y position of the top line's baseline.
   * @property {Array<number>} blockBounds - The total [minX, minY, maxX, maxY] rect of the whole text block;
   *           this can include extra vertical space beyond the visible glyphs due to lineHeight, and is
   *           equivalent to the dimensions of a block-level text element in CSS.
   * @property {Array<number>} visibleBounds - The total [minX, minY, maxX, maxY] rect of the whole text block;
   *           unlike `blockBounds` this is tightly wrapped to the visible glyph paths.
   * @property {Array<object>} chunkedBounds - List of bounding rects for each consecutive set of N glyphs,
   *           in the format `{start:N, end:N, rect:[minX, minY, maxX, maxY]}`.
   * @property {object} timings - Timing info for various parts of the rendering logic including SDF
   *           generation, typesetting, etc.
   * @frozen
   */

  /**
   * @callback getTextRenderInfo~callback
   * @param {TroikaTextRenderInfo} textRenderInfo
   */

  /**
   * Main entry point for requesting the data needed to render a text string with given font parameters.
   * This is an asynchronous call, performing most of the logic in a web worker thread.
   * @param {TypesetParams} args
   * @param {getTextRenderInfo~callback} callback
   */
  function getTextRenderInfo(args, callback) {
    hasRequested = true;
    args = assign({}, args);
    const totalStart = now$1();

    // Convert relative URL to absolute so it can be resolved in the worker, and add fallbacks.
    // In the future we'll allow args.font to be a list with unicode ranges too.
    const { defaultFontURL } = CONFIG;
    const fonts = [];
    if (defaultFontURL) {
      fonts.push({label: 'default', src: toAbsoluteURL(defaultFontURL)});
    }
    if (args.font) {
      fonts.push({label: 'user', src: toAbsoluteURL(args.font)});
    }
    args.font = fonts;

    // Normalize text to a string
    args.text = '' + args.text;

    args.sdfGlyphSize = args.sdfGlyphSize || CONFIG.sdfGlyphSize;
    args.unicodeFontsURL = args.unicodeFontsURL || CONFIG.unicodeFontsURL;

    // Normalize colors
    if (args.colorRanges != null) {
      let colors = {};
      for (let key in args.colorRanges) {
        if (args.colorRanges.hasOwnProperty(key)) {
          let val = args.colorRanges[key];
          if (typeof val !== 'number') {
            val = tempColor.set(val).getHex();
          }
          colors[key] = val;
        }
      }
      args.colorRanges = colors;
    }

    Object.freeze(args);

    // Init the atlas if needed
    const {textureWidth, sdfExponent} = CONFIG;
    const {sdfGlyphSize} = args;
    const glyphsPerRow = (textureWidth / sdfGlyphSize * 4);
    let atlas = atlases[sdfGlyphSize];
    if (!atlas) {
      const canvas = document.createElement('canvas');
      canvas.width = textureWidth;
      canvas.height = sdfGlyphSize * 256 / glyphsPerRow; // start tall enough to fit 256 glyphs
      atlas = atlases[sdfGlyphSize] = {
        glyphCount: 0,
        sdfGlyphSize,
        sdfCanvas: canvas,
        sdfTexture: new three.Texture(
          canvas,
          undefined,
          undefined,
          undefined,
          three.LinearFilter,
          three.LinearFilter
        ),
        contextLost: false,
        glyphsByFont: new Map()
      };
      atlas.sdfTexture.generateMipmaps = false;
      initContextLossHandling(atlas);
    }

    const {sdfTexture, sdfCanvas} = atlas;

    // Issue request to the typesetting engine in the worker
    const typeset = CONFIG.useWorker ? typesetInWorker : typesetOnMainThread;
    typeset(args).then(result => {
      const {glyphIds, glyphFontIndices, fontData, glyphPositions, fontSize, timings} = result;
      const neededSDFs = [];
      const glyphBounds = new Float32Array(glyphIds.length * 4);
      let boundsIdx = 0;
      let positionsIdx = 0;
      const quadsStart = now$1();

      const fontGlyphMaps = fontData.map(font => {
        let map = atlas.glyphsByFont.get(font.src);
        if (!map) {
          atlas.glyphsByFont.set(font.src, map = new Map());
        }
        return map
      });

      glyphIds.forEach((glyphId, i) => {
        const fontIndex = glyphFontIndices[i];
        const {src: fontSrc, unitsPerEm} = fontData[fontIndex];
        let glyphInfo = fontGlyphMaps[fontIndex].get(glyphId);

        // If this is a glyphId not seen before, add it to the atlas
        if (!glyphInfo) {
          const {path, pathBounds} = result.glyphData[fontSrc][glyphId];

          // Margin around path edges in SDF, based on a percentage of the glyph's max dimension.
          // Note we add an extra 0.5 px over the configured value because the outer 0.5 doesn't contain
          // useful interpolated values and will be ignored anyway.
          const fontUnitsMargin = Math.max(pathBounds[2] - pathBounds[0], pathBounds[3] - pathBounds[1])
            / sdfGlyphSize * (CONFIG.sdfMargin * sdfGlyphSize + 0.5);

          const atlasIndex = atlas.glyphCount++;
          const sdfViewBox = [
            pathBounds[0] - fontUnitsMargin,
            pathBounds[1] - fontUnitsMargin,
            pathBounds[2] + fontUnitsMargin,
            pathBounds[3] + fontUnitsMargin,
          ];
          fontGlyphMaps[fontIndex].set(glyphId, (glyphInfo = { path, atlasIndex, sdfViewBox }));

          // Collect those that need SDF generation
          neededSDFs.push(glyphInfo);
        }

        // Calculate bounds for renderable quads
        // TODO can we get this back off the main thread?
        const {sdfViewBox} = glyphInfo;
        const posX = glyphPositions[positionsIdx++];
        const posY = glyphPositions[positionsIdx++];
        const fontSizeMult = fontSize / unitsPerEm;
        glyphBounds[boundsIdx++] = posX + sdfViewBox[0] * fontSizeMult;
        glyphBounds[boundsIdx++] = posY + sdfViewBox[1] * fontSizeMult;
        glyphBounds[boundsIdx++] = posX + sdfViewBox[2] * fontSizeMult;
        glyphBounds[boundsIdx++] = posY + sdfViewBox[3] * fontSizeMult;

        // Convert glyphId to SDF index for the shader
        glyphIds[i] = glyphInfo.atlasIndex;
      });
      timings.quads = (timings.quads || 0) + (now$1() - quadsStart);

      const sdfStart = now$1();
      timings.sdf = {};

      // Grow the texture height by power of 2 if needed
      const currentHeight = sdfCanvas.height;
      const neededRows = Math.ceil(atlas.glyphCount / glyphsPerRow);
      const neededHeight = Math.pow(2, Math.ceil(Math.log2(neededRows * sdfGlyphSize)));
      if (neededHeight > currentHeight) {
        // Since resizing the canvas clears its render buffer, it needs special handling to copy the old contents over
        console.info(`Increasing SDF texture size ${currentHeight}->${neededHeight}`);
        resizeWebGLCanvasWithoutClearing(sdfCanvas, textureWidth, neededHeight);
        // As of Three r136 textures cannot be resized once they're allocated on the GPU, we must dispose to reallocate it
        sdfTexture.dispose();
      }

      Promise.all(neededSDFs.map(glyphInfo =>
        generateGlyphSDF(glyphInfo, atlas, args.gpuAccelerateSDF).then(({timing}) => {
          timings.sdf[glyphInfo.atlasIndex] = timing;
        })
      )).then(() => {
        if (neededSDFs.length && !atlas.contextLost) {
          safariPre15Workaround(atlas);
          sdfTexture.needsUpdate = true;
        }
        timings.sdfTotal = now$1() - sdfStart;
        timings.total = now$1() - totalStart;
        // console.log(`SDF - ${timings.sdfTotal}, Total - ${timings.total - timings.fontLoad}`)

        // Invoke callback with the text layout arrays and updated texture
        callback(Object.freeze({
          parameters: args,
          sdfTexture,
          sdfGlyphSize,
          sdfExponent,
          glyphBounds,
          glyphAtlasIndices: glyphIds,
          glyphColors: result.glyphColors,
          caretPositions: result.caretPositions,
          chunkedBounds: result.chunkedBounds,
          ascender: result.ascender,
          descender: result.descender,
          lineHeight: result.lineHeight,
          capHeight: result.capHeight,
          xHeight: result.xHeight,
          topBaseline: result.topBaseline,
          blockBounds: result.blockBounds,
          visibleBounds: result.visibleBounds,
          timings: result.timings,
        }));
      });
    });

    // While the typesetting request is being handled, go ahead and make sure the atlas canvas context is
    // "warmed up"; the first request will be the longest due to shader program compilation so this gets
    // a head start on that process before SDFs actually start getting processed.
    Promise.resolve().then(() => {
      if (!atlas.contextLost) {
        warmUpSDFCanvas(sdfCanvas);
      }
    });
  }

  function generateGlyphSDF({path, atlasIndex, sdfViewBox}, {sdfGlyphSize, sdfCanvas, contextLost}, useGPU) {
    if (contextLost) {
      // If the context is lost there's nothing we can do, just quit silently and let it
      // get regenerated when the context is restored
      return Promise.resolve({timing: -1})
    }
    const {textureWidth, sdfExponent} = CONFIG;
    const maxDist = Math.max(sdfViewBox[2] - sdfViewBox[0], sdfViewBox[3] - sdfViewBox[1]);
    const squareIndex = Math.floor(atlasIndex / 4);
    const x = squareIndex % (textureWidth / sdfGlyphSize) * sdfGlyphSize;
    const y = Math.floor(squareIndex / (textureWidth / sdfGlyphSize)) * sdfGlyphSize;
    const channel = atlasIndex % 4;
    return generateSDF(sdfGlyphSize, sdfGlyphSize, path, sdfViewBox, maxDist, sdfExponent, sdfCanvas, x, y, channel, useGPU)
  }

  function initContextLossHandling(atlas) {
    const canvas = atlas.sdfCanvas;

    /*
    // Begin context loss simulation
    if (!window.WebGLDebugUtils) {
      let script = document.getElementById('WebGLDebugUtilsScript')
      if (!script) {
        script = document.createElement('script')
        script.id = 'WebGLDebugUtils'
        document.head.appendChild(script)
        script.src = 'https://cdn.jsdelivr.net/gh/KhronosGroup/WebGLDeveloperTools@b42e702/src/debug/webgl-debug.js'
      }
      script.addEventListener('load', () => {
        initContextLossHandling(atlas)
      })
      return
    }
    window.WebGLDebugUtils.makeLostContextSimulatingCanvas(canvas)
    canvas.loseContextInNCalls(500)
    canvas.addEventListener('webglcontextrestored', (event) => {
      canvas.loseContextInNCalls(5000)
    })
    // End context loss simulation
    */

    canvas.addEventListener('webglcontextlost', (event) => {
      console.log('Context Lost', event);
      event.preventDefault();
      atlas.contextLost = true;
    });
    canvas.addEventListener('webglcontextrestored', (event) => {
      console.log('Context Restored', event);
      atlas.contextLost = false;
      // Regenerate all glyphs into the restored canvas:
      const promises = [];
      atlas.glyphsByFont.forEach(glyphMap => {
        glyphMap.forEach(glyph => {
          promises.push(generateGlyphSDF(glyph, atlas, true));
        });
      });
      Promise.all(promises).then(() => {
        safariPre15Workaround(atlas);
        atlas.sdfTexture.needsUpdate = true;
      });
    });
  }

  /**
   * Preload a given font and optionally pre-generate glyph SDFs for one or more character sequences.
   * This can be useful to avoid long pauses when first showing text in a scene, by preloading the
   * needed fonts and glyphs up front along with other assets.
   *
   * @param {object} options
   * @param {string} options.font - URL of the font file to preload. If not given, the default font will
   *        be loaded.
   * @param {string|string[]} options.characters - One or more character sequences for which to pre-
   *        generate glyph SDFs. Note that this will honor ligature substitution, so you may need
   *        to specify ligature sequences in addition to their individual characters to get all
   *        possible glyphs, e.g. `["t", "h", "th"]` to get the "t" and "h" glyphs plus the "th" ligature.
   * @param {number} options.sdfGlyphSize - The size at which to prerender the SDF textures for the
   *        specified `characters`.
   * @param {function} callback - A function that will be called when the preloading is complete.
   */
  function preloadFont({font, characters, sdfGlyphSize}, callback) {
    let text = Array.isArray(characters) ? characters.join('\n') : '' + characters;
    getTextRenderInfo({ font, sdfGlyphSize, text }, callback);
  }


  // Local assign impl so we don't have to import troika-core
  function assign(toObj, fromObj) {
    for (let key in fromObj) {
      if (fromObj.hasOwnProperty(key)) {
        toObj[key] = fromObj[key];
      }
    }
    return toObj
  }

  // Utility for making URLs absolute
  let linkEl;
  function toAbsoluteURL(path) {
    if (!linkEl) {
      linkEl = typeof document === 'undefined' ? {} : document.createElement('a');
    }
    linkEl.href = path;
    return linkEl.href
  }

  /**
   * Safari < v15 seems unable to use the SDF webgl canvas as a texture. This applies a workaround
   * where it reads the pixels out of that canvas and uploads them as a data texture instead, at
   * a slight performance cost.
   */
  function safariPre15Workaround(atlas) {
    // Use createImageBitmap support as a proxy for Safari<15, all other mainstream browsers
    // have supported it for a long while so any false positives should be minimal.
    if (typeof createImageBitmap !== 'function') {
      console.info('Safari<15: applying SDF canvas workaround');
      const {sdfCanvas, sdfTexture} = atlas;
      const {width, height} = sdfCanvas;
      const gl = atlas.sdfCanvas.getContext('webgl');
      let pixels = sdfTexture.image.data;
      if (!pixels || pixels.length !== width * height * 4) {
        pixels = new Uint8Array(width * height * 4);
        sdfTexture.image = {width, height, data: pixels};
        sdfTexture.flipY = false;
        sdfTexture.isDataTexture = true;
      }
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
  }

  const typesetterWorkerModule = /*#__PURE__*/troikaWorkerUtils.defineWorkerModule({
    name: 'Typesetter',
    dependencies: [
      createTypesetter,
      fontResolverWorkerModule,
      bidiFactory__default['default'],
    ],
    init(createTypesetter, fontResolver, bidiFactory) {
      return createTypesetter(fontResolver, bidiFactory())
    }
  });

  const typesetInWorker = /*#__PURE__*/troikaWorkerUtils.defineWorkerModule({
    name: 'Typesetter',
    dependencies: [
      typesetterWorkerModule,
    ],
    init(typesetter) {
      return function(args) {
        return new Promise(resolve => {
          typesetter.typeset(args, resolve);
        })
      }
    },
    getTransferables(result) {
      // Mark array buffers as transferable to avoid cloning during postMessage
      const transferables = [];
      for (let p in result) {
        if (result[p] && result[p].buffer) {
          transferables.push(result[p].buffer);
        }
      }
      return transferables
    }
  });

  const typesetOnMainThread = typesetInWorker.onMainThread;

  function dumpSDFTextures() {
    Object.keys(atlases).forEach(size => {
      const canvas = atlases[size].sdfCanvas;
      const {width, height} = canvas;
      console.log("%c.", `
      background: url(${canvas.toDataURL()});
      background-size: ${width}px ${height}px;
      color: transparent;
      font-size: 0;
      line-height: ${height}px;
      padding-left: ${width}px;
    `);
    });
  }

  const templateGeometries = {};

  function getTemplateGeometry(detail) {
    let geom = templateGeometries[detail];
    if (!geom) {
      geom = templateGeometries[detail] = new three.PlaneGeometry(1, 1, detail, detail).translate(0.5, 0.5, 0);
    }
    return geom
  }

  const glyphBoundsAttrName = 'aTroikaGlyphBounds';
  const glyphIndexAttrName = 'aTroikaGlyphIndex';
  const glyphColorAttrName = 'aTroikaGlyphColor';

  /**
  @class GlyphsGeometry

  A specialized Geometry for rendering a set of text glyphs. Uses InstancedBufferGeometry to
  render the glyphs using GPU instancing of a single quad, rather than constructing a whole
  geometry with vertices, for much smaller attribute arraybuffers according to this math:

    Where N = number of glyphs...

    Instanced:
    - position: 4 * 3
    - index: 2 * 3
    - normal: 4 * 3
    - uv: 4 * 2
    - glyph x/y bounds: N * 4
    - glyph indices: N * 1
    = 5N + 38

    Non-instanced:
    - position: N * 4 * 3
    - index: N * 2 * 3
    - normal: N * 4 * 3
    - uv: N * 4 * 2
    - glyph indices: N * 1
    = 39N

  A downside of this is the rare-but-possible lack of the instanced arrays extension,
  which we could potentially work around with a fallback non-instanced implementation.

  */
  class GlyphsGeometry extends three.InstancedBufferGeometry {
    constructor() {
      super();

      this.detail = 1;
      this.curveRadius = 0;

      // Define groups for rendering text outline as a separate pass; these will only
      // be used when the `material` getter returns an array, i.e. outlineWidth > 0.
      this.groups = [
        {start: 0, count: Infinity, materialIndex: 0},
        {start: 0, count: Infinity, materialIndex: 1}
      ];

      // Preallocate empty bounding objects
      this.boundingSphere = new three.Sphere();
      this.boundingBox = new three.Box3();
    }

    computeBoundingSphere () {
      // No-op; we'll sync the boundingSphere proactively when needed.
    }

    computeBoundingBox() {
      // No-op; we'll sync the boundingBox proactively when needed.
    }

    set detail(detail) {
      if (detail !== this._detail) {
        this._detail = detail;
        if (typeof detail !== 'number' || detail < 1) {
          detail = 1;
        }
        let tpl = getTemplateGeometry(detail)
        ;['position', 'normal', 'uv'].forEach(attr => {
          this.attributes[attr] = tpl.attributes[attr].clone();
        });
        this.setIndex(tpl.getIndex().clone());
      }
    }
    get detail() {
      return this._detail
    }

    set curveRadius(r) {
      if (r !== this._curveRadius) {
        this._curveRadius = r;
        this._updateBounds();
      }
    }
    get curveRadius() {
      return this._curveRadius
    }

    /**
     * Update the geometry for a new set of glyphs.
     * @param {Float32Array} glyphBounds - An array holding the planar bounds for all glyphs
     *        to be rendered, 4 entries for each glyph: x1,x2,y1,y1
     * @param {Float32Array} glyphAtlasIndices - An array holding the index of each glyph within
     *        the SDF atlas texture.
     * @param {Array} blockBounds - An array holding the [minX, minY, maxX, maxY] across all glyphs
     * @param {Array} [chunkedBounds] - An array of objects describing bounds for each chunk of N
     *        consecutive glyphs: `{start:N, end:N, rect:[minX, minY, maxX, maxY]}`. This can be
     *        used with `applyClipRect` to choose an optimized `instanceCount`.
     * @param {Uint8Array} [glyphColors] - An array holding r,g,b values for each glyph.
     */
    updateGlyphs(glyphBounds, glyphAtlasIndices, blockBounds, chunkedBounds, glyphColors) {
      // Update the instance attributes
      this.updateAttributeData(glyphBoundsAttrName, glyphBounds, 4);
      this.updateAttributeData(glyphIndexAttrName, glyphAtlasIndices, 1);
      this.updateAttributeData(glyphColorAttrName, glyphColors, 3);
      this._blockBounds = blockBounds;
      this._chunkedBounds = chunkedBounds;
      this.instanceCount = glyphAtlasIndices.length;
      this._updateBounds();
    }

    _updateBounds() {
      const bounds = this._blockBounds;
      if (bounds) {
        const { curveRadius, boundingBox: bbox } = this;
        if (curveRadius) {
          const { PI, floor, min, max, sin, cos } = Math;
          const halfPi = PI / 2;
          const twoPi = PI * 2;
          const absR = Math.abs(curveRadius);
          const leftAngle = bounds[0] / absR;
          const rightAngle = bounds[2] / absR;
          const minX = floor((leftAngle + halfPi) / twoPi) !== floor((rightAngle + halfPi) / twoPi)
            ? -absR : min(sin(leftAngle) * absR, sin(rightAngle) * absR);
          const maxX = floor((leftAngle - halfPi) / twoPi) !== floor((rightAngle - halfPi) / twoPi)
            ? absR : max(sin(leftAngle) * absR, sin(rightAngle) * absR);
          const maxZ = floor((leftAngle + PI) / twoPi) !== floor((rightAngle + PI) / twoPi)
            ? absR * 2 : max(absR - cos(leftAngle) * absR, absR - cos(rightAngle) * absR);
          bbox.min.set(minX, bounds[1], curveRadius < 0 ? -maxZ : 0);
          bbox.max.set(maxX, bounds[3], curveRadius < 0 ? 0 : maxZ);
        } else {
          bbox.min.set(bounds[0], bounds[1], 0);
          bbox.max.set(bounds[2], bounds[3], 0);
        }
        bbox.getBoundingSphere(this.boundingSphere);
      }
    }

    /**
     * Given a clipping rect, and the chunkedBounds from the last updateGlyphs call, choose the lowest
     * `instanceCount` that will show all glyphs within the clipped view. This is an optimization
     * for long blocks of text that are clipped, to skip vertex shader evaluation for glyphs that would
     * be clipped anyway.
     *
     * Note that since `drawElementsInstanced[ANGLE]` only accepts an instance count and not a starting
     * offset, this optimization becomes less effective as the clipRect moves closer to the end of the
     * text block. We could fix that by switching from instancing to a full geometry with a drawRange,
     * but at the expense of much larger attribute buffers (see classdoc above.)
     *
     * @param {Vector4} clipRect
     */
    applyClipRect(clipRect) {
      let count = this.getAttribute(glyphIndexAttrName).count;
      let chunks = this._chunkedBounds;
      if (chunks) {
        for (let i = chunks.length; i--;) {
          count = chunks[i].end;
          let rect = chunks[i].rect;
          // note: both rects are l-b-r-t
          if (rect[1] < clipRect.w && rect[3] > clipRect.y && rect[0] < clipRect.z && rect[2] > clipRect.x) {
            break
          }
        }
      }
      this.instanceCount = count;
    }

    /**
     * Utility for updating instance attributes with automatic resizing
     */
    updateAttributeData(attrName, newArray, itemSize) {
      const attr = this.getAttribute(attrName);
      if (newArray) {
        // If length isn't changing, just update the attribute's array data
        if (attr && attr.array.length === newArray.length) {
          attr.array.set(newArray);
          attr.needsUpdate = true;
        } else {
          this.setAttribute(attrName, new three.InstancedBufferAttribute(newArray, itemSize));
          // If the new attribute has a different size, we also have to (as of r117) manually clear the
          // internal cached max instance count. See https://github.com/mrdoob/three.js/issues/19706
          // It's unclear if this is a threejs bug or a truly unsupported scenario; discussion in
          // that ticket is ambiguous as to whether replacing a BufferAttribute with one of a
          // different size is supported, but https://github.com/mrdoob/three.js/pull/17418 strongly
          // implies it should be supported. It's possible we need to
          delete this._maxInstanceCount; //for r117+, could be fragile
          this.dispose(); //for r118+, more robust feeling, but more heavy-handed than I'd like
        }
      } else if (attr) {
        this.deleteAttribute(attrName);
      }
    }
  }

  // language=GLSL
  const VERTEX_DEFS = `
uniform vec2 uTroikaSDFTextureSize;
uniform float uTroikaSDFGlyphSize;
uniform vec4 uTroikaTotalBounds;
uniform vec4 uTroikaClipRect;
uniform mat3 uTroikaOrient;
uniform bool uTroikaUseGlyphColors;
uniform float uTroikaEdgeOffset;
uniform float uTroikaBlurRadius;
uniform vec2 uTroikaPositionOffset;
uniform float uTroikaCurveRadius;
attribute vec4 aTroikaGlyphBounds;
attribute float aTroikaGlyphIndex;
attribute vec3 aTroikaGlyphColor;
varying vec2 vTroikaGlyphUV;
varying vec4 vTroikaTextureUVBounds;
varying float vTroikaTextureChannel;
varying vec3 vTroikaGlyphColor;
varying vec2 vTroikaGlyphDimensions;
`;

  // language=GLSL prefix="void main() {" suffix="}"
  const VERTEX_TRANSFORM = `
vec4 bounds = aTroikaGlyphBounds;
bounds.xz += uTroikaPositionOffset.x;
bounds.yw -= uTroikaPositionOffset.y;

vec4 outlineBounds = vec4(
  bounds.xy - uTroikaEdgeOffset - uTroikaBlurRadius,
  bounds.zw + uTroikaEdgeOffset + uTroikaBlurRadius
);
vec4 clippedBounds = vec4(
  clamp(outlineBounds.xy, uTroikaClipRect.xy, uTroikaClipRect.zw),
  clamp(outlineBounds.zw, uTroikaClipRect.xy, uTroikaClipRect.zw)
);

vec2 clippedXY = (mix(clippedBounds.xy, clippedBounds.zw, position.xy) - bounds.xy) / (bounds.zw - bounds.xy);

position.xy = mix(bounds.xy, bounds.zw, clippedXY);

uv = (position.xy - uTroikaTotalBounds.xy) / (uTroikaTotalBounds.zw - uTroikaTotalBounds.xy);

float rad = uTroikaCurveRadius;
if (rad != 0.0) {
  float angle = position.x / rad;
  position.xz = vec2(sin(angle) * rad, rad - cos(angle) * rad);
  normal.xz = vec2(sin(angle), cos(angle));
}
  
position = uTroikaOrient * position;
normal = uTroikaOrient * normal;

vTroikaGlyphUV = clippedXY.xy;
vTroikaGlyphDimensions = vec2(bounds[2] - bounds[0], bounds[3] - bounds[1]);

${''/* NOTE: it seems important to calculate the glyph's bounding texture UVs here in the
  vertex shader, rather than in the fragment shader, as the latter gives strange artifacts
  on some glyphs (those in the leftmost texture column) on some systems. The exact reason
  isn't understood but doing this here, then mix()-ing in the fragment shader, seems to work. */}
float txCols = uTroikaSDFTextureSize.x / uTroikaSDFGlyphSize;
vec2 txUvPerSquare = uTroikaSDFGlyphSize / uTroikaSDFTextureSize;
vec2 txStartUV = txUvPerSquare * vec2(
  mod(floor(aTroikaGlyphIndex / 4.0), txCols),
  floor(floor(aTroikaGlyphIndex / 4.0) / txCols)
);
vTroikaTextureUVBounds = vec4(txStartUV, vec2(txStartUV) + txUvPerSquare);
vTroikaTextureChannel = mod(aTroikaGlyphIndex, 4.0);
`;

  // language=GLSL
  const FRAGMENT_DEFS = `
uniform sampler2D uTroikaSDFTexture;
uniform vec2 uTroikaSDFTextureSize;
uniform float uTroikaSDFGlyphSize;
uniform float uTroikaSDFExponent;
uniform float uTroikaEdgeOffset;
uniform float uTroikaFillOpacity;
uniform float uTroikaBlurRadius;
uniform vec3 uTroikaStrokeColor;
uniform float uTroikaStrokeWidth;
uniform float uTroikaStrokeOpacity;
uniform bool uTroikaSDFDebug;
varying vec2 vTroikaGlyphUV;
varying vec4 vTroikaTextureUVBounds;
varying float vTroikaTextureChannel;
varying vec2 vTroikaGlyphDimensions;

float troikaSdfValueToSignedDistance(float alpha) {
  // Inverse of exponential encoding in webgl-sdf-generator
  ${''/* TODO - there's some slight inaccuracy here when dealing with interpolated alpha values; those
    are linearly interpolated where the encoding is exponential. Look into improving this by rounding
    to nearest 2 whole texels, decoding those exponential values, and linearly interpolating the result.
  */}
  float maxDimension = max(vTroikaGlyphDimensions.x, vTroikaGlyphDimensions.y);
  float absDist = (1.0 - pow(2.0 * (alpha > 0.5 ? 1.0 - alpha : alpha), 1.0 / uTroikaSDFExponent)) * maxDimension;
  float signedDist = absDist * (alpha > 0.5 ? -1.0 : 1.0);
  return signedDist;
}

float troikaGlyphUvToSdfValue(vec2 glyphUV) {
  vec2 textureUV = mix(vTroikaTextureUVBounds.xy, vTroikaTextureUVBounds.zw, glyphUV);
  vec4 rgba = texture2D(uTroikaSDFTexture, textureUV);
  float ch = floor(vTroikaTextureChannel + 0.5); //NOTE: can't use round() in WebGL1
  return ch == 0.0 ? rgba.r : ch == 1.0 ? rgba.g : ch == 2.0 ? rgba.b : rgba.a;
}

float troikaGlyphUvToDistance(vec2 uv) {
  return troikaSdfValueToSignedDistance(troikaGlyphUvToSdfValue(uv));
}

float troikaGetAADist() {
  ${''/*
    When the standard derivatives extension is available, we choose an antialiasing alpha threshold based
    on the potential change in the SDF's alpha from this fragment to its neighbor. This strategy maximizes 
    readability and edge crispness at all sizes and screen resolutions.
  */}
  #if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
  return length(fwidth(vTroikaGlyphUV * vTroikaGlyphDimensions)) * 0.5;
  #else
  return vTroikaGlyphDimensions.x / 64.0;
  #endif
}

float troikaGetFragDistValue() {
  vec2 clampedGlyphUV = clamp(vTroikaGlyphUV, 0.5 / uTroikaSDFGlyphSize, 1.0 - 0.5 / uTroikaSDFGlyphSize);
  float distance = troikaGlyphUvToDistance(clampedGlyphUV);
 
  // Extrapolate distance when outside bounds:
  distance += clampedGlyphUV == vTroikaGlyphUV ? 0.0 : 
    length((vTroikaGlyphUV - clampedGlyphUV) * vTroikaGlyphDimensions);

  ${''/* 
  // TODO more refined extrapolated distance by adjusting for angle of gradient at edge...
  // This has potential but currently gives very jagged extensions, maybe due to precision issues?
  float uvStep = 1.0 / uTroikaSDFGlyphSize;
  vec2 neighbor1UV = clampedGlyphUV + (
    vTroikaGlyphUV.x != clampedGlyphUV.x ? vec2(0.0, uvStep * sign(0.5 - vTroikaGlyphUV.y)) :
    vTroikaGlyphUV.y != clampedGlyphUV.y ? vec2(uvStep * sign(0.5 - vTroikaGlyphUV.x), 0.0) :
    vec2(0.0)
  );
  vec2 neighbor2UV = clampedGlyphUV + (
    vTroikaGlyphUV.x != clampedGlyphUV.x ? vec2(0.0, uvStep * -sign(0.5 - vTroikaGlyphUV.y)) :
    vTroikaGlyphUV.y != clampedGlyphUV.y ? vec2(uvStep * -sign(0.5 - vTroikaGlyphUV.x), 0.0) :
    vec2(0.0)
  );
  float neighbor1Distance = troikaGlyphUvToDistance(neighbor1UV);
  float neighbor2Distance = troikaGlyphUvToDistance(neighbor2UV);
  float distToUnclamped = length((vTroikaGlyphUV - clampedGlyphUV) * vTroikaGlyphDimensions);
  float distToNeighbor = length((clampedGlyphUV - neighbor1UV) * vTroikaGlyphDimensions);
  float gradientAngle1 = min(asin(abs(neighbor1Distance - distance) / distToNeighbor), PI / 2.0);
  float gradientAngle2 = min(asin(abs(neighbor2Distance - distance) / distToNeighbor), PI / 2.0);
  distance += (cos(gradientAngle1) + cos(gradientAngle2)) / 2.0 * distToUnclamped;
  */}

  return distance;
}

float troikaGetEdgeAlpha(float distance, float distanceOffset, float aaDist) {
  #if defined(IS_DEPTH_MATERIAL) || defined(IS_DISTANCE_MATERIAL)
  float alpha = step(-distanceOffset, -distance);
  #else

  float alpha = smoothstep(
    distanceOffset + aaDist,
    distanceOffset - aaDist,
    distance
  );
  #endif

  return alpha;
}
`;

  // language=GLSL prefix="void main() {" suffix="}"
  const FRAGMENT_TRANSFORM = `
float aaDist = troikaGetAADist();
float fragDistance = troikaGetFragDistValue();
float edgeAlpha = uTroikaSDFDebug ?
  troikaGlyphUvToSdfValue(vTroikaGlyphUV) :
  troikaGetEdgeAlpha(fragDistance, uTroikaEdgeOffset, max(aaDist, uTroikaBlurRadius));

#if !defined(IS_DEPTH_MATERIAL) && !defined(IS_DISTANCE_MATERIAL)
vec4 fillRGBA = gl_FragColor;
fillRGBA.a *= uTroikaFillOpacity;
vec4 strokeRGBA = uTroikaStrokeWidth == 0.0 ? fillRGBA : vec4(uTroikaStrokeColor, uTroikaStrokeOpacity);
if (fillRGBA.a == 0.0) fillRGBA.rgb = strokeRGBA.rgb;
gl_FragColor = mix(fillRGBA, strokeRGBA, smoothstep(
  -uTroikaStrokeWidth - aaDist,
  -uTroikaStrokeWidth + aaDist,
  fragDistance
));
gl_FragColor.a *= edgeAlpha;
#endif

if (edgeAlpha == 0.0) {
  discard;
}
`;


  /**
   * Create a material for rendering text, derived from a baseMaterial
   */
  function createTextDerivedMaterial(baseMaterial) {
    const textMaterial = troikaThreeUtils.createDerivedMaterial(baseMaterial, {
      chained: true,
      extensions: {
        derivatives: true
      },
      uniforms: {
        uTroikaSDFTexture: {value: null},
        uTroikaSDFTextureSize: {value: new three.Vector2()},
        uTroikaSDFGlyphSize: {value: 0},
        uTroikaSDFExponent: {value: 0},
        uTroikaTotalBounds: {value: new three.Vector4(0,0,0,0)},
        uTroikaClipRect: {value: new three.Vector4(0,0,0,0)},
        uTroikaEdgeOffset: {value: 0},
        uTroikaFillOpacity: {value: 1},
        uTroikaPositionOffset: {value: new three.Vector2()},
        uTroikaCurveRadius: {value: 0},
        uTroikaBlurRadius: {value: 0},
        uTroikaStrokeWidth: {value: 0},
        uTroikaStrokeColor: {value: new three.Color()},
        uTroikaStrokeOpacity: {value: 1},
        uTroikaOrient: {value: new three.Matrix3()},
        uTroikaUseGlyphColors: {value: true},
        uTroikaSDFDebug: {value: false}
      },
      vertexDefs: VERTEX_DEFS,
      vertexTransform: VERTEX_TRANSFORM,
      fragmentDefs: FRAGMENT_DEFS,
      fragmentColorTransform: FRAGMENT_TRANSFORM,
      customRewriter({vertexShader, fragmentShader}) {
        let uDiffuseRE = /\buniform\s+vec3\s+diffuse\b/;
        if (uDiffuseRE.test(fragmentShader)) {
          // Replace all instances of `diffuse` with our varying
          fragmentShader = fragmentShader
            .replace(uDiffuseRE, 'varying vec3 vTroikaGlyphColor')
            .replace(/\bdiffuse\b/g, 'vTroikaGlyphColor');
          // Make sure the vertex shader declares the uniform so we can grab it as a fallback
          if (!uDiffuseRE.test(vertexShader)) {
            vertexShader = vertexShader.replace(
              troikaThreeUtils.voidMainRegExp,
              'uniform vec3 diffuse;\n$&\nvTroikaGlyphColor = uTroikaUseGlyphColors ? aTroikaGlyphColor / 255.0 : diffuse;\n'
            );
          }
        }
        return { vertexShader, fragmentShader }
      }
    });

    // Force transparency - TODO is this reasonable?
    textMaterial.transparent = true;

    // Force single draw call when double-sided
    textMaterial.forceSinglePass = true;

    Object.defineProperties(textMaterial, {
      isTroikaTextMaterial: {value: true},

      // WebGLShadowMap reverses the side of the shadow material by default, which fails
      // for planes, so here we force the `shadowSide` to always match the main side.
      shadowSide: {
        get() {
          return this.side
        },
        set() {
          //no-op
        }
      }
    });

    return textMaterial
  }

  const defaultMaterial = /*#__PURE__*/ new three.MeshBasicMaterial({
    color: 0xffffff,
    side: three.DoubleSide,
    transparent: true
  });
  const defaultStrokeColor = 0x808080;

  const tempMat4 = /*#__PURE__*/ new three.Matrix4();
  const tempVec3a = /*#__PURE__*/ new three.Vector3();
  const tempVec3b = /*#__PURE__*/ new three.Vector3();
  const tempArray = [];
  const origin = /*#__PURE__*/ new three.Vector3();
  const defaultOrient = '+x+y';

  function first(o) {
    return Array.isArray(o) ? o[0] : o
  }

  let getFlatRaycastMesh = () => {
    const mesh = new three.Mesh(
      new three.PlaneGeometry(1, 1),
      defaultMaterial
    );
    getFlatRaycastMesh = () => mesh;
    return mesh
  };
  let getCurvedRaycastMesh = () => {
    const mesh = new three.Mesh(
      new three.PlaneGeometry(1, 1, 32, 1),
      defaultMaterial
    );
    getCurvedRaycastMesh = () => mesh;
    return mesh
  };

  const syncStartEvent = { type: 'syncstart' };
  const syncCompleteEvent = { type: 'synccomplete' };

  const SYNCABLE_PROPS = [
    'font',
    'fontSize',
    'fontStyle',
    'fontWeight',
    'lang',
    'letterSpacing',
    'lineHeight',
    'maxWidth',
    'overflowWrap',
    'text',
    'direction',
    'textAlign',
    'textIndent',
    'whiteSpace',
    'anchorX',
    'anchorY',
    'colorRanges',
    'sdfGlyphSize'
  ];

  const COPYABLE_PROPS = SYNCABLE_PROPS.concat(
    'material',
    'color',
    'depthOffset',
    'clipRect',
    'curveRadius',
    'orientation',
    'glyphGeometryDetail'
  );

  /**
   * @class Text
   *
   * A ThreeJS Mesh that renders a string of text on a plane in 3D space using signed distance
   * fields (SDF).
   */
  class Text extends three.Mesh {
    constructor() {
      const geometry = new GlyphsGeometry();
      super(geometry, null);

      // === Text layout properties: === //

      /**
       * @member {string} text
       * The string of text to be rendered.
       */
      this.text = '';

      /**
       * @member {number|string} anchorX
       * Defines the horizontal position in the text block that should line up with the local origin.
       * Can be specified as a numeric x position in local units, a string percentage of the total
       * text block width e.g. `'25%'`, or one of the following keyword strings: 'left', 'center',
       * or 'right'.
       */
      this.anchorX = 0;

      /**
       * @member {number|string} anchorY
       * Defines the vertical position in the text block that should line up with the local origin.
       * Can be specified as a numeric y position in local units (note: down is negative y), a string
       * percentage of the total text block height e.g. `'25%'`, or one of the following keyword strings:
       * 'top', 'top-baseline', 'top-cap', 'top-ex', 'middle', 'bottom-baseline', or 'bottom'.
       */
      this.anchorY = 0;

      /**
       * @member {number} curveRadius
       * Defines a cylindrical radius along which the text's plane will be curved. Positive numbers put
       * the cylinder's centerline (oriented vertically) that distance in front of the text, for a concave
       * curvature, while negative numbers put it behind the text for a convex curvature. The centerline
       * will be aligned with the text's local origin; you can use `anchorX` to offset it.
       *
       * Since each glyph is by default rendered with a simple quad, each glyph remains a flat plane
       * internally. You can use `glyphGeometryDetail` to add more vertices for curvature inside glyphs.
       */
      this.curveRadius = 0;

      /**
       * @member {string} direction
       * Sets the base direction for the text. The default value of "auto" will choose a direction based
       * on the text's content according to the bidi spec. A value of "ltr" or "rtl" will force the direction.
       */
      this.direction = 'auto';

      /**
       * @member {string|null} font
       * URL of a custom font to be used. Font files can be in .ttf, .otf, or .woff (not .woff2) formats.
       * Defaults to Noto Sans.
       */
      this.font = null; //will use default from TextBuilder

      this.unicodeFontsURL = null; //defaults to CDN

      /**
       * @member {number} fontSize
       * The size at which to render the font in local units; corresponds to the em-box height
       * of the chosen `font`.
       */
      this.fontSize = 0.1;

      /**
       * @member {number|'normal'|'bold'}
       * The weight of the font. Currently only used for fallback Noto fonts.
       */
      this.fontWeight = 'normal';

      /**
       * @member {'normal'|'italic'}
       * The style of the font. Currently only used for fallback Noto fonts.
       */
      this.fontStyle = 'normal';

      /**
       * @member {string|null} lang
       * The language code of this text; can be used for explicitly selecting certain CJK fonts.
       */
      this.lang = null;

        /**
       * @member {number} letterSpacing
       * Sets a uniform adjustment to spacing between letters after kerning is applied. Positive
       * numbers increase spacing and negative numbers decrease it.
       */
      this.letterSpacing = 0;

      /**
       * @member {number|string} lineHeight
       * Sets the height of each line of text, as a multiple of the `fontSize`. Defaults to 'normal'
       * which chooses a reasonable height based on the chosen font's ascender/descender metrics.
       */
      this.lineHeight = 'normal';

      /**
       * @member {number} maxWidth
       * The maximum width of the text block, above which text may start wrapping according to the
       * `whiteSpace` and `overflowWrap` properties.
       */
      this.maxWidth = Infinity;

      /**
       * @member {string} overflowWrap
       * Defines how text wraps if the `whiteSpace` property is `normal`. Can be either `'normal'`
       * to break at whitespace characters, or `'break-word'` to allow breaking within words.
       * Defaults to `'normal'`.
       */
      this.overflowWrap = 'normal';

      /**
       * @member {string} textAlign
       * The horizontal alignment of each line of text within the overall text bounding box.
       */
      this.textAlign = 'left';

      /**
       * @member {number} textIndent
       * Indentation for the first character of a line; see CSS `text-indent`.
       */
      this.textIndent = 0;

      /**
       * @member {string} whiteSpace
       * Defines whether text should wrap when a line reaches the `maxWidth`. Can
       * be either `'normal'` (the default), to allow wrapping according to the `overflowWrap` property,
       * or `'nowrap'` to prevent wrapping. Note that `'normal'` here honors newline characters to
       * manually break lines, making it behave more like `'pre-wrap'` does in CSS.
       */
      this.whiteSpace = 'normal';


      // === Presentation properties: === //

      /**
       * @member {THREE.Material} material
       * Defines a _base_ material to be used when rendering the text. This material will be
       * automatically replaced with a material derived from it, that adds shader code to
       * decrease the alpha for each fragment (pixel) outside the text glyphs, with antialiasing.
       * By default it will derive from a simple white MeshBasicMaterial, but you can use any
       * of the other mesh materials to gain other features like lighting, texture maps, etc.
       *
       * Also see the `color` shortcut property.
       */
      this.material = null;

      /**
       * @member {string|number|THREE.Color} color
       * This is a shortcut for setting the `color` of the text's material. You can use this
       * if you don't want to specify a whole custom `material`. Also, if you do use a custom
       * `material`, this color will only be used for this particuar Text instance, even if
       * that same material instance is shared across multiple Text objects.
       */
      this.color = null;

      /**
       * @member {object|null} colorRanges
       * WARNING: This API is experimental and may change.
       * This allows more fine-grained control of colors for individual or ranges of characters,
       * taking precedence over the material's `color`. Its format is an Object whose keys each
       * define a starting character index for a range, and whose values are the color for each
       * range. The color value can be a numeric hex color value, a `THREE.Color` object, or
       * any of the strings accepted by `THREE.Color`.
       */
      this.colorRanges = null;

      /**
       * @member {number|string} outlineWidth
       * WARNING: This API is experimental and may change.
       * The width of an outline/halo to be drawn around each text glyph using the `outlineColor` and `outlineOpacity`.
       * Can be specified as either an absolute number in local units, or as a percentage string e.g.
       * `"12%"` which is treated as a percentage of the `fontSize`. Defaults to `0`, which means
       * no outline will be drawn unless an `outlineOffsetX/Y` or `outlineBlur` is set.
       */
      this.outlineWidth = 0;

      /**
       * @member {string|number|THREE.Color} outlineColor
       * WARNING: This API is experimental and may change.
       * The color of the text outline, if `outlineWidth`/`outlineBlur`/`outlineOffsetX/Y` are set.
       * Defaults to black.
       */
      this.outlineColor = 0x000000;

      /**
       * @member {number} outlineOpacity
       * WARNING: This API is experimental and may change.
       * The opacity of the outline, if `outlineWidth`/`outlineBlur`/`outlineOffsetX/Y` are set.
       * Defaults to `1`.
       */
      this.outlineOpacity = 1;

      /**
       * @member {number|string} outlineBlur
       * WARNING: This API is experimental and may change.
       * A blur radius applied to the outer edge of the text's outline. If the `outlineWidth` is
       * zero, the blur will be applied at the glyph edge, like CSS's `text-shadow` blur radius.
       * Can be specified as either an absolute number in local units, or as a percentage string e.g.
       * `"12%"` which is treated as a percentage of the `fontSize`. Defaults to `0`.
       */
      this.outlineBlur = 0;

      /**
       * @member {number|string} outlineOffsetX
       * WARNING: This API is experimental and may change.
       * A horizontal offset for the text outline.
       * Can be specified as either an absolute number in local units, or as a percentage string e.g. `"12%"`
       * which is treated as a percentage of the `fontSize`. Defaults to `0`.
       */
      this.outlineOffsetX = 0;

      /**
       * @member {number|string} outlineOffsetY
       * WARNING: This API is experimental and may change.
       * A vertical offset for the text outline.
       * Can be specified as either an absolute number in local units, or as a percentage string e.g. `"12%"`
       * which is treated as a percentage of the `fontSize`. Defaults to `0`.
       */
      this.outlineOffsetY = 0;

      /**
       * @member {number|string} strokeWidth
       * WARNING: This API is experimental and may change.
       * The width of an inner stroke drawn inside each text glyph using the `strokeColor` and `strokeOpacity`.
       * Can be specified as either an absolute number in local units, or as a percentage string e.g. `"12%"`
       * which is treated as a percentage of the `fontSize`. Defaults to `0`.
       */
      this.strokeWidth = 0;

      /**
       * @member {string|number|THREE.Color} strokeColor
       * WARNING: This API is experimental and may change.
       * The color of the text stroke, if `strokeWidth` is greater than zero. Defaults to gray.
       */
      this.strokeColor = defaultStrokeColor;

      /**
       * @member {number} strokeOpacity
       * WARNING: This API is experimental and may change.
       * The opacity of the stroke, if `strokeWidth` is greater than zero. Defaults to `1`.
       */
      this.strokeOpacity = 1;

      /**
       * @member {number} fillOpacity
       * WARNING: This API is experimental and may change.
       * The opacity of the glyph's fill from 0 to 1. This behaves like the material's `opacity` but allows
       * giving the fill a different opacity than the `strokeOpacity`. A fillOpacity of `0` makes the
       * interior of the glyph invisible, leaving just the `strokeWidth`. Defaults to `1`.
       */
      this.fillOpacity = 1;

      /**
       * @member {number} depthOffset
       * This is a shortcut for setting the material's `polygonOffset` and related properties,
       * which can be useful in preventing z-fighting when this text is laid on top of another
       * plane in the scene. Positive numbers are further from the camera, negatives closer.
       */
      this.depthOffset = 0;

      /**
       * @member {Array<number>} clipRect
       * If specified, defines a `[minX, minY, maxX, maxY]` of a rectangle outside of which all
       * pixels will be discarded. This can be used for example to clip overflowing text when
       * `whiteSpace='nowrap'`.
       */
      this.clipRect = null;

      /**
       * @member {string} orientation
       * Defines the axis plane on which the text should be laid out when the mesh has no extra
       * rotation transform. It is specified as a string with two axes: the horizontal axis with
       * positive pointing right, and the vertical axis with positive pointing up. By default this
       * is '+x+y', meaning the text sits on the xy plane with the text's top toward positive y
       * and facing positive z. A value of '+x-z' would place it on the xz plane with the text's
       * top toward negative z and facing positive y.
       */
      this.orientation = defaultOrient;

      /**
       * @member {number} glyphGeometryDetail
       * Controls number of vertical/horizontal segments that make up each glyph's rectangular
       * plane. Defaults to 1. This can be increased to provide more geometrical detail for custom
       * vertex shader effects, for example.
       */
      this.glyphGeometryDetail = 1;

      /**
       * @member {number|null} sdfGlyphSize
       * The size of each glyph's SDF (signed distance field) used for rendering. This must be a
       * power-of-two number. Defaults to 64 which is generally a good balance of size and quality
       * for most fonts. Larger sizes can improve the quality of glyph rendering by increasing
       * the sharpness of corners and preventing loss of very thin lines, at the expense of
       * increased memory footprint and longer SDF generation time.
       */
      this.sdfGlyphSize = null;

      /**
       * @member {boolean} gpuAccelerateSDF
       * When `true`, the SDF generation process will be GPU-accelerated with WebGL when possible,
       * making it much faster especially for complex glyphs, and falling back to a JavaScript version
       * executed in web workers when support isn't available. It should automatically detect support,
       * but it's still somewhat experimental, so you can set it to `false` to force it to use the JS
       * version if you encounter issues with it.
       */
      this.gpuAccelerateSDF = true;

      this.debugSDF = false;
    }

    /**
     * Updates the text rendering according to the current text-related configuration properties.
     * This is an async process, so you can pass in a callback function to be executed when it
     * finishes.
     * @param {function} [callback]
     */
    sync(callback) {
      if (this._needsSync) {
        this._needsSync = false;

        // If there's another sync still in progress, queue
        if (this._isSyncing) {
          (this._queuedSyncs || (this._queuedSyncs = [])).push(callback);
        } else {
          this._isSyncing = true;
          this.dispatchEvent(syncStartEvent);

          getTextRenderInfo({
            text: this.text,
            font: this.font,
            lang: this.lang,
            fontSize: this.fontSize || 0.1,
            fontWeight: this.fontWeight || 'normal',
            fontStyle: this.fontStyle || 'normal',
            letterSpacing: this.letterSpacing || 0,
            lineHeight: this.lineHeight || 'normal',
            maxWidth: this.maxWidth,
            direction: this.direction || 'auto',
            textAlign: this.textAlign,
            textIndent: this.textIndent,
            whiteSpace: this.whiteSpace,
            overflowWrap: this.overflowWrap,
            anchorX: this.anchorX,
            anchorY: this.anchorY,
            colorRanges: this.colorRanges,
            includeCaretPositions: true, //TODO parameterize
            sdfGlyphSize: this.sdfGlyphSize,
            gpuAccelerateSDF: this.gpuAccelerateSDF,
            unicodeFontsURL: this.unicodeFontsURL,
          }, textRenderInfo => {
            this._isSyncing = false;

            // Save result for later use in onBeforeRender
            this._textRenderInfo = textRenderInfo;

            // Update the geometry attributes
            this.geometry.updateGlyphs(
              textRenderInfo.glyphBounds,
              textRenderInfo.glyphAtlasIndices,
              textRenderInfo.blockBounds,
              textRenderInfo.chunkedBounds,
              textRenderInfo.glyphColors
            );

            // If we had extra sync requests queued up, kick it off
            const queued = this._queuedSyncs;
            if (queued) {
              this._queuedSyncs = null;
              this._needsSync = true;
              this.sync(() => {
                queued.forEach(fn => fn && fn());
              });
            }

            this.dispatchEvent(syncCompleteEvent);
            if (callback) {
              callback();
            }
          });
        }
      }
    }

    /**
     * Initiate a sync if needed - note it won't complete until next frame at the
     * earliest so if possible it's a good idea to call sync() manually as soon as
     * all the properties have been set.
     * @override
     */
    onBeforeRender(renderer, scene, camera, geometry, material, group) {
      this.sync();

      // This may not always be a text material, e.g. if there's a scene.overrideMaterial present
      if (material.isTroikaTextMaterial) {
        this._prepareForRender(material);
      }
    }

    /**
     * Shortcut to dispose the geometry specific to this instance.
     * Note: we don't also dispose the derived material here because if anything else is
     * sharing the same base material it will result in a pause next frame as the program
     * is recompiled. Instead users can dispose the base material manually, like normal,
     * and we'll also dispose the derived material at that time.
     */
    dispose() {
      this.geometry.dispose();
    }

    /**
     * @property {TroikaTextRenderInfo|null} textRenderInfo
     * @readonly
     * The current processed rendering data for this TextMesh, returned by the TextBuilder after
     * a `sync()` call. This will be `null` initially, and may be stale for a short period until
     * the asynchrous `sync()` process completes.
     */
    get textRenderInfo() {
      return this._textRenderInfo || null
    }

    /**
     * Create the text derived material from the base material. Can be overridden to use a custom
     * derived material.
     */
    createDerivedMaterial(baseMaterial) {
      return createTextDerivedMaterial(baseMaterial)
    }

    // Handler for automatically wrapping the base material with our upgrades. We do the wrapping
    // lazily on _read_ rather than write to avoid unnecessary wrapping on transient values.
    get material() {
      let derivedMaterial = this._derivedMaterial;
      const baseMaterial = this._baseMaterial || this._defaultMaterial || (this._defaultMaterial = defaultMaterial.clone());
      if (!derivedMaterial || !derivedMaterial.isDerivedFrom(baseMaterial)) {
        derivedMaterial = this._derivedMaterial = this.createDerivedMaterial(baseMaterial);
        // dispose the derived material when its base material is disposed:
        baseMaterial.addEventListener('dispose', function onDispose() {
          baseMaterial.removeEventListener('dispose', onDispose);
          derivedMaterial.dispose();
        });
      }
      // If text outline is configured, render it as a preliminary draw using Three's multi-material
      // feature (see GlyphsGeometry which sets up `groups` for this purpose) Doing it with multi
      // materials ensures the layers are always rendered consecutively in a consistent order.
      // Each layer will trigger onBeforeRender with the appropriate material.
      if (this.hasOutline()) {
        let outlineMaterial = derivedMaterial._outlineMtl;
        if (!outlineMaterial) {
          outlineMaterial = derivedMaterial._outlineMtl = Object.create(derivedMaterial, {
            id: {value: derivedMaterial.id + 0.1}
          });
          outlineMaterial.isTextOutlineMaterial = true;
          outlineMaterial.depthWrite = false;
          outlineMaterial.map = null; //???
          derivedMaterial.addEventListener('dispose', function onDispose() {
            derivedMaterial.removeEventListener('dispose', onDispose);
            outlineMaterial.dispose();
          });
        }
        return [
          outlineMaterial,
          derivedMaterial
        ]
      } else {
        return derivedMaterial
      }
    }
    set material(baseMaterial) {
      if (baseMaterial && baseMaterial.isTroikaTextMaterial) { //prevent double-derivation
        this._derivedMaterial = baseMaterial;
        this._baseMaterial = baseMaterial.baseMaterial;
      } else {
        this._baseMaterial = baseMaterial;
      }
    }

    hasOutline() {
      return !!(this.outlineWidth || this.outlineBlur || this.outlineOffsetX || this.outlineOffsetY)
    }

    get glyphGeometryDetail() {
      return this.geometry.detail
    }
    set glyphGeometryDetail(detail) {
      this.geometry.detail = detail;
    }

    get curveRadius() {
      return this.geometry.curveRadius
    }
    set curveRadius(r) {
      this.geometry.curveRadius = r;
    }

    // Create and update material for shadows upon request:
    get customDepthMaterial() {
      return first(this.material).getDepthMaterial()
    }
    set customDepthMaterial(m) {
      // future: let the user override with their own?
    }
    get customDistanceMaterial() {
      return first(this.material).getDistanceMaterial()
    }
    set customDistanceMaterial(m) {
      // future: let the user override with their own?
    }

    _prepareForRender(material) {
      const isOutline = material.isTextOutlineMaterial;
      const uniforms = material.uniforms;
      const textInfo = this.textRenderInfo;
      if (textInfo) {
        const {sdfTexture, blockBounds} = textInfo;
        uniforms.uTroikaSDFTexture.value = sdfTexture;
        uniforms.uTroikaSDFTextureSize.value.set(sdfTexture.image.width, sdfTexture.image.height);
        uniforms.uTroikaSDFGlyphSize.value = textInfo.sdfGlyphSize;
        uniforms.uTroikaSDFExponent.value = textInfo.sdfExponent;
        uniforms.uTroikaTotalBounds.value.fromArray(blockBounds);
        uniforms.uTroikaUseGlyphColors.value = !isOutline && !!textInfo.glyphColors;

        let distanceOffset = 0;
        let blurRadius = 0;
        let strokeWidth = 0;
        let fillOpacity;
        let strokeOpacity;
        let strokeColor;
        let offsetX = 0;
        let offsetY = 0;

        if (isOutline) {
          let {outlineWidth, outlineOffsetX, outlineOffsetY, outlineBlur, outlineOpacity} = this;
          distanceOffset = this._parsePercent(outlineWidth) || 0;
          blurRadius = Math.max(0, this._parsePercent(outlineBlur) || 0);
          fillOpacity = outlineOpacity;
          offsetX = this._parsePercent(outlineOffsetX) || 0;
          offsetY = this._parsePercent(outlineOffsetY) || 0;
        } else {
          strokeWidth = Math.max(0, this._parsePercent(this.strokeWidth) || 0);
          if (strokeWidth) {
            strokeColor = this.strokeColor;
            uniforms.uTroikaStrokeColor.value.set(strokeColor == null ? defaultStrokeColor : strokeColor);
            strokeOpacity = this.strokeOpacity;
            if (strokeOpacity == null) strokeOpacity = 1;
          }
          fillOpacity = this.fillOpacity;
        }

        uniforms.uTroikaEdgeOffset.value = distanceOffset;
        uniforms.uTroikaPositionOffset.value.set(offsetX, offsetY);
        uniforms.uTroikaBlurRadius.value = blurRadius;
        uniforms.uTroikaStrokeWidth.value = strokeWidth;
        uniforms.uTroikaStrokeOpacity.value = strokeOpacity;
        uniforms.uTroikaFillOpacity.value = fillOpacity == null ? 1 : fillOpacity;
        uniforms.uTroikaCurveRadius.value = this.curveRadius || 0;

        let clipRect = this.clipRect;
        if (clipRect && Array.isArray(clipRect) && clipRect.length === 4) {
          uniforms.uTroikaClipRect.value.fromArray(clipRect);
        } else {
          // no clipping - choose a finite rect that shouldn't ever be reached by overflowing glyphs or outlines
          const pad = (this.fontSize || 0.1) * 100;
          uniforms.uTroikaClipRect.value.set(
            blockBounds[0] - pad,
            blockBounds[1] - pad,
            blockBounds[2] + pad,
            blockBounds[3] + pad
          );
        }
        this.geometry.applyClipRect(uniforms.uTroikaClipRect.value);
      }
      uniforms.uTroikaSDFDebug.value = !!this.debugSDF;
      material.polygonOffset = !!this.depthOffset;
      material.polygonOffsetFactor = material.polygonOffsetUnits = this.depthOffset || 0;

      // Shortcut for setting material color via `color` prop on the mesh; this is
      // applied only to the derived material to avoid mutating a shared base material.
      const color = isOutline ? (this.outlineColor || 0) : this.color;

      if (color == null) {
        delete material.color; //inherit from base
      } else {
        const colorObj = material.hasOwnProperty('color') ? material.color : (material.color = new three.Color());
        if (color !== colorObj._input || typeof color === 'object') {
          colorObj.set(colorObj._input = color);
        }
      }

      // base orientation
      let orient = this.orientation || defaultOrient;
      if (orient !== material._orientation) {
        let rotMat = uniforms.uTroikaOrient.value;
        orient = orient.replace(/[^-+xyz]/g, '');
        let match = orient !== defaultOrient && orient.match(/^([-+])([xyz])([-+])([xyz])$/);
        if (match) {
          let [, hSign, hAxis, vSign, vAxis] = match;
          tempVec3a.set(0, 0, 0)[hAxis] = hSign === '-' ? 1 : -1;
          tempVec3b.set(0, 0, 0)[vAxis] = vSign === '-' ? -1 : 1;
          tempMat4.lookAt(origin, tempVec3a.cross(tempVec3b), tempVec3b);
          rotMat.setFromMatrix4(tempMat4);
        } else {
          rotMat.identity();
        }
        material._orientation = orient;
      }
    }

    _parsePercent(value) {
      if (typeof value === 'string') {
        let match = value.match(/^(-?[\d.]+)%$/);
        let pct = match ? parseFloat(match[1]) : NaN;
        value = (isNaN(pct) ? 0 : pct / 100) * this.fontSize;
      }
      return value
    }

    /**
     * Translate a point in local space to an x/y in the text plane.
     */
    localPositionToTextCoords(position, target = new three.Vector2()) {
      target.copy(position); //simple non-curved case is 1:1
      const r = this.curveRadius;
      if (r) { //flatten the curve
        target.x = Math.atan2(position.x, Math.abs(r) - Math.abs(position.z)) * Math.abs(r);
      }
      return target
    }

    /**
     * Translate a point in world space to an x/y in the text plane.
     */
    worldPositionToTextCoords(position, target = new three.Vector2()) {
      tempVec3a.copy(position);
      return this.localPositionToTextCoords(this.worldToLocal(tempVec3a), target)
    }

    /**
     * @override Custom raycasting to test against the whole text block's max rectangular bounds
     * TODO is there any reason to make this more granular, like within individual line or glyph rects?
     */
    raycast(raycaster, intersects) {
      const {textRenderInfo, curveRadius} = this;
      if (textRenderInfo) {
        const bounds = textRenderInfo.blockBounds;
        const raycastMesh = curveRadius ? getCurvedRaycastMesh() : getFlatRaycastMesh();
        const geom = raycastMesh.geometry;
        const {position, uv} = geom.attributes;
        for (let i = 0; i < uv.count; i++) {
          let x = bounds[0] + (uv.getX(i) * (bounds[2] - bounds[0]));
          const y = bounds[1] + (uv.getY(i) * (bounds[3] - bounds[1]));
          let z = 0;
          if (curveRadius) {
            z = curveRadius - Math.cos(x / curveRadius) * curveRadius;
            x = Math.sin(x / curveRadius) * curveRadius;
          }
          position.setXYZ(i, x, y, z);
        }
        geom.boundingSphere = this.geometry.boundingSphere;
        geom.boundingBox = this.geometry.boundingBox;
        raycastMesh.matrixWorld = this.matrixWorld;
        raycastMesh.material.side = this.material.side;
        tempArray.length = 0;
        raycastMesh.raycast(raycaster, tempArray);
        for (let i = 0; i < tempArray.length; i++) {
          tempArray[i].object = this;
          intersects.push(tempArray[i]);
        }
      }
    }

    copy(source) {
      // Prevent copying the geometry reference so we don't end up sharing attributes between instances
      const geom = this.geometry;
      super.copy(source);
      this.geometry = geom;

      COPYABLE_PROPS.forEach(prop => {
        this[prop] = source[prop];
      });
      return this
    }

    clone() {
      return new this.constructor().copy(this)
    }
  }


  // Create setters for properties that affect text layout:
  SYNCABLE_PROPS.forEach(prop => {
    const privateKey = '_private_' + prop;
    Object.defineProperty(Text.prototype, prop, {
      get() {
        return this[privateKey]
      },
      set(value) {
        if (value !== this[privateKey]) {
          this[privateKey] = value;
          this._needsSync = true;
        }
      }
    });
  });

  const syncStartEvent$1 = { type: "syncstart" };
  const syncCompleteEvent$1 = { type: "synccomplete" };
  const memberIndexAttrName = "aTroikaTextBatchMemberIndex";


  /*
  Data texture packing strategy:

  # Common:
  0-15: matrix
  16-19: uTroikaTotalBounds
  20-23: uTroikaClipRect
  24: diffuse (color/outlineColor)
  25: uTroikaFillOpacity (fillOpacity/outlineOpacity)
  26: uTroikaCurveRadius
  27: <blank>

  # Main:
  28: uTroikaStrokeWidth
  29: uTroikaStrokeColor
  30: uTroikaStrokeOpacity

  # Outline:
  28-29: uTroikaPositionOffset
  30: uTroikaEdgeOffset
  31: uTroikaBlurRadius
  */
  const floatsPerMember = 32;

  const tempBox3 = new three.Box3();
  const tempColor$1 = new three.Color();

  /**
   * @experimental
   *
   * A specialized `Text` implementation that accepts any number of `Text` children
   * and automatically batches them together to render in a single draw call.
   *
   * The `material` of each child `Text` will be ignored, and the `material` of the
   * `BatchedText` will be used for all of them instead.
   *
   * NOTE: This only works in WebGL2 or where the OES_texture_float extension is available.
   */
  class BatchedText extends Text {
    constructor () {
      super();

      /**
       * @typedef {Object} PackingInfo
       * @property {number} index - the packing order index when last packed, or -1
       * @property {boolean} dirty - whether it has synced since last pack
       */

      /**
       * @type {Map<Text, PackingInfo>}
       */
      this._members = new Map();
      this._dataTextures = {};

      this._onMemberSynced = (e) => {
        this._members.get(e.target).dirty = true;
      };
    }

    /**
     * @override
     * Batch any Text objects added as children
     */
    add (...objects) {
      for (let i = 0; i < objects.length; i++) {
        if (objects[i] instanceof Text) {
          this.addText(objects[i]);
        } else {
          super.add(objects[i]);
        }
      }
      return this;
    }

    /**
     * @override
     */
    remove (...objects) {
      for (let i = 0; i < objects.length; i++) {
        if (objects[i] instanceof Text) {
          this.removeText(objects[i]);
        } else {
          super.remove(objects[i]);
        }
      }
      return this;
    }

    /**
     * @param {Text} text
     */
    addText (text) {
      if (!this._members.has(text)) {
        this._members.set(text, {
          index: -1,
          glyphCount: -1,
          dirty: true
        });
        text.addEventListener("synccomplete", this._onMemberSynced);
      }
    }

    /**
     * @param {Text} text
     */
    removeText (text) {
      this._needsRepack = true;
      text.removeEventListener("synccomplete", this._onMemberSynced);
      this._members.delete(text);
    }

    /**
     * Use the custom derivation with extra batching logic
     */
    createDerivedMaterial (baseMaterial) {
      return createBatchedTextMaterial(baseMaterial);
    }

    updateMatrixWorld (force) {
      super.updateMatrixWorld(force);
      this.updateBounds();
    }

    /**
     * Update the batched geometry bounds to hold all members
     */
    updateBounds () {
      // Update member local matrices and the overall bounds
      const bbox = this.geometry.boundingBox.makeEmpty();
      this._members.forEach((_, text) => {
        if (text.matrixAutoUpdate) text.updateMatrix(); // ignore world matrix
        tempBox3.copy(text.geometry.boundingBox).applyMatrix4(text.matrix);
        bbox.union(tempBox3);
      });
      bbox.getBoundingSphere(this.geometry.boundingSphere);
    }

    /** @override */
    hasOutline() {
      // Iterator.some() not supported in Safari
      for (let member of this._members.keys()) {
        if (member.hasOutline()) return true;
      }
      return false;
    }

    /**
     * @override
     * Copy member matrices and uniform values into the data texture
     */
    _prepareForRender (material) {
      const isOutline = material.isTextOutlineMaterial;
      material.uniforms.uTroikaIsOutline.value = isOutline;

      // Resize the texture to fit in powers of 2
      let texture = this._dataTextures[isOutline ? 'outline' : 'main'];
      const dataLength = Math.pow(2, Math.ceil(Math.log2(this._members.size * floatsPerMember)));
      if (!texture || dataLength !== texture.image.data.length) {
        // console.log(`resizing: ${dataLength}`);
        if (texture) texture.dispose();
        const width = Math.min(dataLength / 4, 1024);
        texture = this._dataTextures[isOutline ? 'outline' : 'main'] = new three.DataTexture(
          new Float32Array(dataLength),
          width,
          dataLength / 4 / width,
          three.RGBAFormat,
          three.FloatType
        );
      }

      const texData = texture.image.data;
      const setTexData = (index, value) => {
        if (value !== texData[index]) {
          texData[index] = value;
          texture.needsUpdate = true;
        }
      };
      this._members.forEach(({ index, dirty }, text) => {
        if (index > -1) {
          const startIndex = index * floatsPerMember;

          // Matrix
          const matrix = text.matrix.elements;
          for (let i = 0; i < 16; i++) {
            setTexData(startIndex + i, matrix[i]);
          }

          // Let the member populate the uniforms, since that does all the appropriate
          // logic and handling of defaults, and we'll just grab the results from there
          text._prepareForRender(material);
          const {
            uTroikaTotalBounds,
            uTroikaClipRect,
            uTroikaPositionOffset,
            uTroikaEdgeOffset,
            uTroikaBlurRadius,
            uTroikaStrokeWidth,
            uTroikaStrokeColor,
            uTroikaStrokeOpacity,
            uTroikaFillOpacity,
            uTroikaCurveRadius,
          } = material.uniforms;

          // Total bounds for uv
          for (let i = 0; i < 4; i++) {
            setTexData(startIndex + 16 + i, uTroikaTotalBounds.value.getComponent(i));
          }

          // Clip rect
          for (let i = 0; i < 4; i++) {
            setTexData(startIndex + 20 + i, uTroikaClipRect.value.getComponent(i));
          }

          // Color
          let color = isOutline ? (text.outlineColor || 0) : text.color;
          if (color == null) color = this.color;
          if (color == null) color = this.material.color;
          if (color == null) color = 0xffffff;
          setTexData(startIndex + 24, tempColor$1.set(color).getHex());

          // Fill opacity / outline opacity
          setTexData(startIndex + 25, uTroikaFillOpacity.value);

          // Curve radius
          setTexData(startIndex + 26, uTroikaCurveRadius.value);

          if (isOutline) {
            // Outline properties
            setTexData(startIndex + 28, uTroikaPositionOffset.value.x);
            setTexData(startIndex + 29, uTroikaPositionOffset.value.y);
            setTexData(startIndex + 30, uTroikaEdgeOffset.value);
            setTexData(startIndex + 31, uTroikaBlurRadius.value);
          } else {
            // Stroke properties
            setTexData(startIndex + 28, uTroikaStrokeWidth.value);
            setTexData(startIndex + 29, tempColor$1.set(uTroikaStrokeColor.value).getHex());
            setTexData(startIndex + 30, uTroikaStrokeOpacity.value);
          }
        }
      });
      material.setMatrixTexture(texture);

      // For the non-member-specific uniforms:
      super._prepareForRender(material);
    }

    sync (callback) {
      // TODO: skip members updating their geometries, just use textRenderInfo directly

      // Trigger sync on all members that need it
      let syncPromises = this._needsRepack ? [] : null;
      this._needsRepack = false;
      this._members.forEach((packingInfo, text) => {
        if (packingInfo.dirty || text._needsSync) {
          packingInfo.dirty = false;
          (syncPromises || (syncPromises = [])).push(new Promise(resolve => {
            if (text._needsSync) {
              text.sync(resolve);
            } else {
              resolve();
            }
          }));
        }
      });

      // If any needed syncing, wait for them and then repack the batched geometry
      if (syncPromises) {
        this.dispatchEvent(syncStartEvent$1);

        Promise.all(syncPromises).then(() => {
          const { geometry } = this;
          const batchedAttributes = geometry.attributes;
          let memberIndexes = batchedAttributes[memberIndexAttrName] && batchedAttributes[memberIndexAttrName].array || new Uint16Array(0);
          let batchedGlyphIndexes = batchedAttributes[glyphIndexAttrName] && batchedAttributes[glyphIndexAttrName].array || new Float32Array(0);
          let batchedGlyphBounds = batchedAttributes[glyphBoundsAttrName] && batchedAttributes[glyphBoundsAttrName].array || new Float32Array(0);

          // Initial pass to collect total glyph count and resize the arrays if needed
          let totalGlyphCount = 0;
          this._members.forEach((packingInfo, { textRenderInfo }) => {
            if (textRenderInfo) {
              totalGlyphCount += textRenderInfo.glyphAtlasIndices.length;
              this._textRenderInfo = textRenderInfo; // TODO - need this, but be smarter
            }
          });
          if (totalGlyphCount !== memberIndexes.length) {
            memberIndexes = cloneAndResize(memberIndexes, totalGlyphCount);
            batchedGlyphIndexes = cloneAndResize(batchedGlyphIndexes, totalGlyphCount);
            batchedGlyphBounds = cloneAndResize(batchedGlyphBounds, totalGlyphCount * 4);
          }

          // Populate batch arrays
          let memberIndex = 0;
          let glyphIndex = 0;
          this._members.forEach((packingInfo, { textRenderInfo }) => {
            if (textRenderInfo) {
              const glyphCount = textRenderInfo.glyphAtlasIndices.length;
              memberIndexes.fill(memberIndex, glyphIndex, glyphIndex + glyphCount);

              // TODO can skip these for members that are not dirty or shifting overall position:
              batchedGlyphIndexes.set(textRenderInfo.glyphAtlasIndices, glyphIndex, glyphIndex + glyphCount);
              batchedGlyphBounds.set(textRenderInfo.glyphBounds, glyphIndex * 4, (glyphIndex + glyphCount) * 4);

              glyphIndex += glyphCount;
              packingInfo.index = memberIndex++;
            }
          });

          // Update the geometry attributes
          geometry.updateAttributeData(memberIndexAttrName, memberIndexes, 1);
          geometry.getAttribute(memberIndexAttrName).setUsage(three.DynamicDrawUsage);
          geometry.updateAttributeData(glyphIndexAttrName, batchedGlyphIndexes, 1);
          geometry.updateAttributeData(glyphBoundsAttrName, batchedGlyphBounds, 4);

          this.updateBounds();

          this.dispatchEvent(syncCompleteEvent$1);
          if (callback) {
            callback();
          }
        });
      }
    }

    copy (source) {
      if (source instanceof BatchedText) {
        super.copy(source);
        this._members.forEach((_, text) => this.removeText(text));
        source._members.forEach((_, text) => this.addText(text));
      }
      return this;
    }

    dispose () {
      super.dispose();
      Object.values(this._dataTextures).forEach(tex => tex.dispose());
    }
  }

  function cloneAndResize (source, newLength) {
    const copy = new source.constructor(newLength);
    copy.set(source.subarray(0, newLength));
    return copy;
  }

  function createBatchedTextMaterial (baseMaterial) {
    const texUniformName = "uTroikaMatricesTexture";
    const texSizeUniformName = "uTroikaMatricesTextureSize";

    // Due to how vertexTransform gets injected, the matrix transforms must happen
    // in the base material of TextDerivedMaterial, but other transforms to its
    // shader must come after, so we sandwich it between two derivations.

    // Transform the vertex position
    let batchMaterial = troikaThreeUtils.createDerivedMaterial(baseMaterial, {
      chained: true,
      uniforms: {
        [texSizeUniformName]: { value: new three.Vector2() },
        [texUniformName]: { value: null }
      },
      // language=GLSL
      vertexDefs: `
      uniform highp sampler2D ${texUniformName};
      uniform vec2 ${texSizeUniformName};
      attribute float ${memberIndexAttrName};

      vec4 troikaBatchTexel(float offset) {
        offset += ${memberIndexAttrName} * ${floatsPerMember.toFixed(1)} / 4.0;
        float w = ${texSizeUniformName}.x;
        vec2 uv = (vec2(mod(offset, w), floor(offset / w)) + 0.5) / ${texSizeUniformName};
        return texture2D(${texUniformName}, uv);
      }
    `,
      // language=GLSL prefix="void main() {" suffix="}"
      vertexTransform: `
      mat4 matrix = mat4(
        troikaBatchTexel(0.0),
        troikaBatchTexel(1.0),
        troikaBatchTexel(2.0),
        troikaBatchTexel(3.0)
      );
      position.xyz = (matrix * vec4(position, 1.0)).xyz;
    `,
    });

    // Add the text shaders
    batchMaterial = createTextDerivedMaterial(batchMaterial);

    // Now make other changes to the derived text shader code
    batchMaterial = troikaThreeUtils.createDerivedMaterial(batchMaterial, {
      chained: true,
      uniforms: {
        uTroikaIsOutline: {value: false},
      },
      customRewriter(shaders) {
        // Convert some text shader uniforms to varyings
        const varyingUniforms = [
          'uTroikaTotalBounds',
          'uTroikaClipRect',
          'uTroikaPositionOffset',
          'uTroikaEdgeOffset',
          'uTroikaBlurRadius',
          'uTroikaStrokeWidth',
          'uTroikaStrokeColor',
          'uTroikaStrokeOpacity',
          'uTroikaFillOpacity',
          'uTroikaCurveRadius',
          'diffuse'
        ];
        varyingUniforms.forEach(uniformName => {
          shaders = uniformToVarying(shaders, uniformName);
        });
        return shaders
      },
      // language=GLSL
      vertexDefs: `
      uniform bool uTroikaIsOutline;
      vec3 troikaFloatToColor(float v) {
        return mod(floor(vec3(v / 65536.0, v / 256.0, v)), 256.0) / 256.0;
      }
    `,
      // language=GLSL prefix="void main() {" suffix="}"
      vertexTransform: `
      uTroikaTotalBounds = troikaBatchTexel(4.0);
      uTroikaClipRect = troikaBatchTexel(5.0);
      
      vec4 data = troikaBatchTexel(6.0);
      diffuse = troikaFloatToColor(data.x);
      uTroikaFillOpacity = data.y;
      uTroikaCurveRadius = data.z;
      
      data = troikaBatchTexel(7.0);
      if (uTroikaIsOutline) {
        if (data == vec4(0.0)) { // degenerate if zero outline
          position = vec3(0.0);
        } else {
          uTroikaPositionOffset = data.xy;
          uTroikaEdgeOffset = data.z;
          uTroikaBlurRadius = data.w;
        }
      } else {
        uTroikaStrokeWidth = data.x;
        uTroikaStrokeColor = troikaFloatToColor(data.y);
        uTroikaStrokeOpacity = data.z;
      }
    `,
    });

    batchMaterial.setMatrixTexture = (texture) => {
      batchMaterial.uniforms[texUniformName].value = texture;
      batchMaterial.uniforms[texSizeUniformName].value.set(texture.image.width, texture.image.height);
    };
    return batchMaterial;
  }

  /**
   * Turn a uniform into a varying/writeable value.
   * - If the uniform was used in the fragment shader, it will become a varying in both shaders.
   * - If the uniform was only used in the vertex shader, it will become a writeable var.
   */
  function uniformToVarying({vertexShader, fragmentShader}, uniformName, varyingName = uniformName) {
    const uniformRE = new RegExp(`uniform\\s+(bool|float|vec[234]|mat[34])\\s+${uniformName}\\b`);

    let type;
    let hadFragmentUniform = false;
    fragmentShader = fragmentShader.replace(uniformRE, ($0, $1) => {
      hadFragmentUniform = true;
      return `varying ${type = $1} ${varyingName}`
    });

    let hadVertexUniform = false;
    vertexShader = vertexShader.replace(uniformRE, (_, $1) => {
      hadVertexUniform = true;
      return `${hadFragmentUniform ? 'varying' : ''} ${type = $1} ${varyingName}`
    });
    if (!hadVertexUniform) {
      vertexShader = `${hadFragmentUniform ? 'varying' : ''} ${type} ${varyingName};\n${vertexShader}`;
    }
    return {vertexShader, fragmentShader}
  }

  //=== Utility functions for dealing with carets and selection ranges ===//

  /**
   * @typedef {object} TextCaret
   * @property {number} x - x position of the caret
   * @property {number} y - y position of the caret's bottom
   * @property {number} height - height of the caret
   * @property {number} charIndex - the index in the original input string of this caret's target
   *   character; the caret will be for the position _before_ that character.
   */

  /**
   * Given a local x/y coordinate in the text block plane, find the nearest caret position.
   * @param {TroikaTextRenderInfo} textRenderInfo - a result object from TextBuilder#getTextRenderInfo
   * @param {number} x
   * @param {number} y
   * @return {TextCaret | null}
   */
  function getCaretAtPoint(textRenderInfo, x, y) {
    let closestCaret = null;
    const rows = groupCaretsByRow(textRenderInfo);

    // Find nearest row by y first
    let closestRow = null;
    rows.forEach(row => {
      if (!closestRow || Math.abs(y - (row.top + row.bottom) / 2) < Math.abs(y - (closestRow.top + closestRow.bottom) / 2)) {
        closestRow = row;
      }
    });

    // Then find closest caret by x within that row
    closestRow.carets.forEach(caret => {
      if (!closestCaret || Math.abs(x - caret.x) < Math.abs(x - closestCaret.x)) {
        closestCaret = caret;
      }
    });
    return closestCaret
  }


  const _rectsCache = new WeakMap();

  /**
   * Given start and end character indexes, return a list of rectangles covering all the
   * characters within that selection.
   * @param {TroikaTextRenderInfo} textRenderInfo
   * @param {number} start - index of the first char in the selection
   * @param {number} end - index of the first char after the selection
   * @return {Array<{left, top, right, bottom}> | null}
   */
  function getSelectionRects(textRenderInfo, start, end) {
    let rects;
    if (textRenderInfo) {
      // Check cache - textRenderInfo is frozen so it's safe to cache based on it
      let prevResult = _rectsCache.get(textRenderInfo);
      if (prevResult && prevResult.start === start && prevResult.end === end) {
        return prevResult.rects
      }

      const {caretPositions} = textRenderInfo;

      // Normalize
      if (end < start) {
        const s = start;
        start = end;
        end = s;
      }
      start = Math.max(start, 0);
      end = Math.min(end, caretPositions.length + 1);

      // Build list of rects, expanding the current rect for all characters in a run and starting
      // a new rect whenever reaching a new line or a new bidi direction
      rects = [];
      let currentRect = null;
      for (let i = start; i < end; i++) {
        const x1 = caretPositions[i * 4];
        const x2 = caretPositions[i * 4 + 1];
        const left = Math.min(x1, x2);
        const right = Math.max(x1, x2);
        const bottom = caretPositions[i * 4 + 2];
        const top = caretPositions[i * 4 + 3];
        if (!currentRect || bottom !== currentRect.bottom || top !== currentRect.top || left > currentRect.right || right < currentRect.left) {
          currentRect = {
            left: Infinity,
            right: -Infinity,
            bottom,
            top,
          };
          rects.push(currentRect);
        }
        currentRect.left = Math.min(left, currentRect.left);
        currentRect.right = Math.max(right, currentRect.right);
      }

      // Merge any overlapping rects, e.g. those formed by adjacent bidi runs
      rects.sort((a, b) => b.bottom - a.bottom || a.left - b.left);
      for (let i = rects.length - 1; i-- > 0;) {
        const rectA = rects[i];
        const rectB = rects[i + 1];
        if (rectA.bottom === rectB.bottom && rectA.top === rectB.top && rectA.left <= rectB.right && rectA.right >= rectB.left) {
          rectB.left = Math.min(rectB.left, rectA.left);
          rectB.right = Math.max(rectB.right, rectA.right);
          rects.splice(i, 1);
        }
      }

      _rectsCache.set(textRenderInfo, {start, end, rects});
    }
    return rects
  }

  const _caretsByRowCache = new WeakMap();

  /**
   * Group a set of carets by row of text, caching the result. A single row of text may contain carets of
   * differing positions/heights if it has multiple fonts, and they may overlap slightly across rows, so this
   * uses an assumption of "at least overlapping by half" to put them in the same row.
   * @return Array<{bottom: number, top: number, carets: TextCaret[]}>
   */
  function groupCaretsByRow(textRenderInfo) {
    // textRenderInfo is frozen so it's safe to cache based on it
    let rows = _caretsByRowCache.get(textRenderInfo);
    if (!rows) {
      rows = [];
      const {caretPositions} = textRenderInfo;
      let curRow;

      const visitCaret = (x, bottom, top, charIndex) => {
        // new row if not overlapping by at least half
        if (!curRow || (top < (curRow.top + curRow.bottom) / 2)) {
          rows.push(curRow = {bottom, top, carets: []});
        }
        // expand vertical limits if necessary
        if (top > curRow.top) curRow.top = top;
        if (bottom < curRow.bottom) curRow.bottom = bottom;
        curRow.carets.push({
          x,
          y: bottom,
          height: top - bottom,
          charIndex,
        });
      };

      let i = 0;
      for (; i < caretPositions.length; i += 4) {
        visitCaret(caretPositions[i], caretPositions[i + 2], caretPositions[i + 3], i / 4);
      }
      // Add one more caret after the final char
      visitCaret(caretPositions[i - 3], caretPositions[i - 2], caretPositions[i - 1], i / 4);
    }
    _caretsByRowCache.set(textRenderInfo, rows);
    return rows
  }

  exports.BatchedText = BatchedText;
  exports.GlyphsGeometry = GlyphsGeometry;
  exports.Text = Text;
  exports.configureTextBuilder = configureTextBuilder;
  exports.createTextDerivedMaterial = createTextDerivedMaterial;
  exports.dumpSDFTextures = dumpSDFTextures;
  exports.fontResolverWorkerModule = fontResolverWorkerModule;
  exports.getCaretAtPoint = getCaretAtPoint;
  exports.getSelectionRects = getSelectionRects;
  exports.getTextRenderInfo = getTextRenderInfo;
  exports.preloadFont = preloadFont;
  exports.typesetterWorkerModule = typesetterWorkerModule;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
