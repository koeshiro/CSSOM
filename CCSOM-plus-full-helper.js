//helper functions
helper={};
helper.ObjectLength=function(o){
    var s = 0, k;
    for (k in o) {
        if (o.hasOwnProperty(k)) s++;
    }
    return s;
};
//My typeof. For WHY? IS UNDERSTEND THAT IS A OBJECT AND THAT IS A ARRAY.
helper.ObjectType=function(e){
	var t=Object.prototype.toString.call(e),r='';
	if(/\[object HTML([a-zA-Z]+)Element\]/.test(t)) r=t.match(/\[object HTML([a-zA-Z]+)Element\]/)[1].toLowerCase();
	else if(/\[object ([a-zA-Z]+)\]/.test(t)) r=t.match(/\[object ([a-zA-Z]+)\]/)[1].toLowerCase();
   else if(r=='') {
      if('toString' in e && 'length' in e && 'join' in e && 'splice' in e && 'pop' in e) r='array';
      else r=typeof(e);
   }
   return r;
}
helper.isHTML=function (e)
{
	var t=Object.prototype.toString.call(e);
	if(/\[object HTML([a-zA-Z]+)\]/.test(t)) return true;
	else return false;
}
helper.get=function (p,o,s,b,m){
	var xhttp= new XMLHttpRequest();
	var url=p+"?";
	if(o||o!=""){
		//body
		for (var k in o)
		{
			url+=k+"="+encodeURIComponent(JSON.stringify(o[k]))+'&';

		}
	}
	xhttp.open('GET', url, b);
	//Meta tegs
	if(m!=undefined){if(!('Content-Type' in m))xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');}
	if(m){
		for (var k in m)
		{
			xhttp.setRequestHeader(k,m);
		}
	}
	//---
	if(s){
		xhttp.onreadystatechange = function () {
			if(xhttp.readyState==4) s(xhttp.responseText,xhttp.readyState);
		}
		xhttp.send(null);
	}else{
		xhttp.send(null);
		return xhttp.responseText;
	}
}
helper.post=function (p,o,s,b,m){
	var xhttp= new XMLHttpRequest();
	var body="";
	var response,redy;
	if(o||o!=""){
		//body
	for (var k in o)
	{
		body+=k+"="+encodeURIComponent(JSON.stringify(o[k]))+"&";
	}
	}
	xhttp.open('POST', p, b);
	//Meta tegs
	if(m!=undefined)if(!('Content-Type' in m)){xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');}
	if(m){
		for (var k in m)
		{
			xhttp.setRequestHeader(k,m);
		}
	}
	//---
	if(s){
		xhttp.onreadystatechange = function () {
			if(xhttp.readyState==4) s(xhttp.responseText,xhttp.readyState);
		}
		xhttp.send(body);
	}else{
		xhttp.send(body);
		return xhttp.responseText;
	}
}
helper.replaceAll=function (t,o){
	var i=0, n=helper.ObjectLength(o), HTML=t,r=new RegExp("(<{\\S+}>)","g"),a=[],b=[],TypeCache='',c,ca,z,zn;
	//loop start
   do
	{
		HTML=HTML.replace(r,function (s,p,b){
				a=s.split("<{"),b=a[1].split("}>"),c=o;
            if(b[0]!=undefined&&b[0].indexOf('.')!=-1){
               ca=b[0].split('.'),z=0,zn=ca.length,c=o,i=i+zn,n=n+zn;
               while (z<zn) {
                  console.log(c,ca[z],i,n);
                  c=c[ca[z]];
                  z++;
               }
            } else c=o[b[0]];
				TypeCache=helper.ObjectType(o[b[0]]);
				if(TypeCache=='string'||TypeCache=='number'||TypeCache=='null'||TypeCache=='undefined') return c;
				else if(TypeCache=='function') {try{return c()} catch (e){console.error(e)}}
				else if(TypeCache=='object'&&c.hasOwnProperty('template')) return new Theme(c['template']).outTheme(c);
				else if(TypeCache=='object'&&!c.hasOwnProperty('template')) console.error("Object "+c+" in "+o+" have not template. Can`t use object without template");
				else console.log('Can`t use object by type'+TypeCache);
			});
	 i++;
	}
	while(i<=n)
	//loop end
	return HTML;
}
CSSOM=function(row){
  // regexp - Comments /\/\*[\s\S]+\*\//ig
  // reqexp - @charset /@charset[^;]+;/ig
  // regexp - @keyframes /(@.*keyframes[^{]+) \{([\s\S]+)\}/gi
  // regexp - @media /(@media[^{]+\{[\s\S]+\})/ig
  // regexp - @import /@import[^;]+/ig
  // regexp - @page /@page[^{]+\{[\s\S]+\}/ig
  // regexp - @font-face /@font-face[^{]+{([\s\S]+)}/ig
  // regexp - standart css rows /([^{]+{[^}]+\})/ig
  // regexp - for all /(((@[\s\S]*?){([\s\S]*?}\s*?)})|[^@{]+{[^}]+})/mg
  var AllRegExp={
      Comments:/(\/\*[\s\S\n]*?\*\/)/ig,
      Charset:/@charset[^;]+;/ig,
      KeyFrame:/(@.*keyframes[^{]+) \{([\s\S]*?}\s*?)\}/i,
      Media:/(@media [\s\S]*?){([\s\S]*?}\s*?)}/i,
      Import:/@import[^;]+/ig,
      Page:/@page[^{]+\{[\s\S]+\}/ig,
      FontFace:/@font-face[^{]+{([^}]+)}/ig,
      Row:/([^@{]+{[^}]+\})/ig,
      TestOnliRows:/(@page|@media|@.*keyframes|@charset|@font-face)/ig,
      SplitAllCSS:/(((@[\s\S]*?){([\s\S]*?}\s*?)})|[^@{]+{[^}]+})/mg
    }, c='',css=row.split('\r\n').join('').replace(AllRegExp.Comments,'').match(AllRegExp.SplitAllCSS),i=0,n=css.length,RESULT=[];
		console.log(css);
    while(i<n){
      // Standart CSS Row

      if(AllRegExp.Row.test(css[i])&&!AllRegExp.TestOnliRows.test(css[i])){
				//BAG! If remove this log is cant normal working
				console.log(AllRegExp.Row.test(css[i])&&!AllRegExp.TestOnliRows.test(css[i]),css[i]);
        RESULT.push(this.splitRow(css[i]));
      }
      // Media Row
      if(AllRegExp.Media.test(css[i])){
        c=css[i].match(AllRegExp.Media);
        RESULT.push(this.splitMedia(c));
      }
      // KeyFrame Row
      if(AllRegExp.KeyFrame.test(css[i])){
        c=css[i].match(AllRegExp.KeyFrame);
        RESULT.push(this.splitKeyFrame(c));
      }
      // FontFace Row
      if(AllRegExp.FontFace.test(css[i])){
        RESULT.push(this.splitFontFace(css[i]));
      }
      // Page Row
      if(AllRegExp.Page.test(css[i])){
        RESULT.push(this.splitPage(css[i]));
      }
      //IMPORT AND CHARSET LATER
      i++;
    } this.RESULT=RESULT;
    return this;
};
//CSSOM HELP FUNCTIONS FOR PARSE CSS TEXT TO OBJECT
CSSOM.prototype.splitPage = function(row) {
  var RESULT={},css=this.splitRow(row);
  RESULT['isPage']='true'; RESULT['type']=css['selector'];RESULT['property']=css['property'];
  return RESULT;
};
CSSOM.prototype.splitFontFace = function(row) {
  var RESULT={},css=this.splitRow(row);
  RESULT['isFontFace']='true'; RESULT['type']=css['selector'];RESULT['property']=css['property'];
  return RESULT;
};
CSSOM.prototype.splitKeyFrame = function(m) {
  var t=m[1],row=m[2],RESULT={};
  RESULT['isKeyFrame']=true; RESULT['type']=t; RESULT['property']=row;
  return RESULT;
};
CSSOM.prototype.splitMedia = function(m) {
  var t=m[1],row=m[2].match(/[^@{]+{[^}]+}/mg),i=0,n=row.length,RESULT={},a=[];
  while (i<n) {
    a.push(this.splitRow(row[i]));
    i++;
  } RESULT['isMedia']=true; RESULT['type']=t; RESULT['css']=a;
  return RESULT;
};
CSSOM.prototype.splitRow = function(row) {
  var RESULT={},c=row.match(/([^{]+){([^}]+)}/m),s=c[1],p=c[2].match(/[^:\s]+:[^;]+;/g),i=0,n=p.length,o={};
  while(i<n) {
    c=p[i].split(':');
    o[c[0]]=c[1];
    i++;
  }
  RESULT['isRow']=s,RESULT['selector']=s, RESULT['property']=o;
  return RESULT;
};
//UNPARSER
CSSOM.prototype.unParser=function(css){
	var cache='';
	if(helper.ObjectType(css)=='array'){
		var i=0,n=css.length;
		while (i<n) {
			if(css[i]['isRow']) cache+=''+css[i]['selector']+'{'+this.unParserProperty(css[i]['property'])+'}';
      if(css[i]['isMedia']) cache+=''+css[i]['type']+'{'+this.unParser(css[i]['css'])+'}';
      if(css[i]['isKeyFrame']) cache+=''+css[i]['type']+'{'+css[i]['property']+'}';
      if(css[i]['isPage']||css[i]['isFontFace']) cache+=''+css[i]['type']+'{'+this.unParserProperty(css[i]['property'])+'}';
			i++;
		}
	}else if(helper.ObjectType(css)=='object'){
		cache+=''+cache['selector']+'{'+this.unParserProperty(cache['property'])+'}';
	}
	return cache;
}
CSSOM.prototype.unParserProperty=function(css){
	var cache='';
	for(var k in css){
		cache+=k+':'+css[k]+'';
	}
	return cache;
}
// ETC HELP FUNCTIONS FOR WORK WITH CSS
CSSOM.prototype.replaceCSS = function(r) {
  var cache=this.RESULT,x=0,y=0,ix=0,iy=cache.length,css,TypeCache=helper.ObjectType(r);
	if(TypeCache=='string') css=new CSSOM(r).getCSSArray();
	else if(TypeCache=='object'&&r.hasOwnProperty('selector')&&r.hasOwnProperty('property')) css=[r];
	else if(TypeCache=='array') css=r;
  ix=css.length;
  while(x<ix){
    while(y<iy){
      if(css[x]['selector']==cache[y]['selector']){
        for(var k in css[x]['property']){
          cache[y]['property'][k]=css[x]['property'][k];
          }
        }
        y++;
      }
    y=0; x++;
  } this.RESULT=cache;
	return this;
};
CSSOM.prototype.find=function(selector){
	var cache=this.RESULT,out={},i=0,n=cache.length,reg=new RegExp("\\s*"+selector+"\\s*","i");
	while(i<n){
		if(reg.test(cache[i]['selector'])) {out=cache[i]; break;}
		i++;
	}
	return out;
}
CSSOM.prototype.delete=function(selector){
	var cache=this.RESULT,out=[],i=0,n=cache.length,reg=new RegExp("\\s*"+selector+"\\s*","i");
	while(i<n){
		if(!reg.test(cache[i]['selector']))out.push(cache[i]);
		i++;
	} this.RESULT=out;
	return this;
}
//RESULT
CSSOM.prototype.getCSSArray = function() {
  return this.RESULT;
};
CSSOM.prototype.toJSON = function() {
  return this.RESULT;
};
CSSOM.prototype.toString = function() {
  return this.unParser(this.RESULT);
};
CSSOM.prototype.RESULT=[];
