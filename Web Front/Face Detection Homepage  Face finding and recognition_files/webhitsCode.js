// Referrer- und Countercode Ausgabe
function webhits( wh_opts ){
	if (typeof(wh_opts) == 'object'){
		if (typeof(wh_opts.ref_stat) != 'undefined' && (wh_opts.ref_stat == 1 || wh_opts.ref_stat == 'T' || wh_opts.ref_stat == 'Y')){
			webhitsReferrercode(wh_opts);
		}
		webhitsCountercode(wh_opts);
	}else{
		document.write('<p>Fehler bei der Einbindung des WebHits-Codes. Ihre &uuml;bergebenen Optionen m&uuml;ssen als Object &uuml;bergeben werden.</p>');
	}
}

function webhitsSetCookie(wh_name, wh_wert, wh_expires){
	if (typeof(wh_expires) == 'undefined'){
		d = (new Date);
		d.setTime(( new Date().getTime() + 1000*3600*24*365*10 ));
		wh_expires = d.toGMTString();
	}
	var wh_cook = wh_name + "=" + unescape(wh_wert);
	wh_cook += "; expires=" + wh_expires;
	wh_cook += "; path=/";
	document.cookie = wh_cook;
	alert("Sie haben einem anonymen Nutzungsprofil wiedersprochen. Es werden keine Daten von Ihnen erfasst.");
}

function webhitsDeleteCookie(wh_name) {
	var wh_cook = wh_name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT;";
	wh_cook += "path=/";
	document.cookie = wh_cook;
	alert("Sie stimmen einem anonymen Nutzungsprofil zu. Ihre Daten werden anonymisiert und verarbeitet.");
}

function webhitsGetCookie(wh_name) {
	var wh_i=0;
	var wh_suche = wh_name + "=";
	while (wh_i<document.cookie.length) {
		if (document.cookie.substring(wh_i, wh_i + wh_suche.length) == wh_suche) {
			var wh_ende = document.cookie.indexOf(";", wh_i+ wh_suche.length);
			wh_ende = ( wh_ende > -1 ) ? wh_ende : document.cookie.length;
			var wh_cook = document.cookie.substring(wh_i + wh_suche.length, wh_ende);
			return unescape(wh_cook);
		}
		wh_i++;
	}
	return "";
}

function webhitsPrivacy(){
	document.write('<p id="webhitsPrivacy">');
	document.write('<strong>Hinweise zum Datenschutz – Verwendung einer Webanalyse Software:</strong><br />');
	document.write('<input type="button" onclick="webhitsDeleteCookie(\'webhits_track\');" value="Ja" /><span>, von meinen Daten darf ein anonymes Nutzungsprofil erstellt werden.</span><br />');
	document.write('<input type="button" onclick="webhitsSetCookie(\'webhits_track\', \'no\' );" value="Nein*" /><span>, von mir ab sofort kein anonymes Nutzungsprofil mehr erfassen.</span><br />');
	document.write('<small>* erfordert Cookies</small>');
	document.write('</p>');
}

function webhitsPrepareString(wh_str){
	wh_str = wh_str_replace('<', '', wh_str);
	wh_str = wh_str_replace('>', '', wh_str);
	return wh_trim(wh_str);
}

function webhitsReferrercode(wh_opts){
	if (typeof(wh_opts.df) != 'undefined'){
		wh_opts.df = webhitsPrepareString(wh_opts.df);
		if( webhitsGetCookie('webhits_track') != 'no' ){
			var wh_strInRef = false;
			if (typeof(wh_opts.ref_ignore) != 'undefined') {
				wh_opts.ref_ignore = webhitsPrepareString(wh_opts.ref_ignore);
				webhitsOptions = wh_opts.ref_ignore.split(',');
				for (var wh_i=0; wh_i < webhitsOptions.length; wh_i++){
					var wh_val = wh_trim(webhitsOptions[wh_i]);
					if ((document.referrer.length > 0) && (document.images) && (document.referrer.toLowerCase().indexOf(wh_val) >= 0)){
						wh_strInRef = true;
					}
				}
			}

			if ((document.referrer.length > 0) && (document.images) && (wh_strInRef == false)){
				wh_refstat = new Image(1,1);
				wh_refstat.src = "http://www.webhits.de/cgi/refstat?df="+wh_opts.df+"&ref="+escape(document.referrer);
			}
		}
	}else{
		alert('Fehler im Referrercode! Die Counter-ID fehlt in der Variablendefinition.');
	}
}

function wh_getCounterURL( wh_opts ){
	wh_params = webhitsGetCounterParams(wh_opts);
	if (typeof(wh_opts.https) != 'undefined' && (wh_opts.https == "1" || wh_opts.https == "T" || wh_opts.https == "Y")){
		wh_protokoll = 'https';
	}else{
		wh_protokoll = 'http';
	}
	wh_opts.df = webhitsPrepareString(wh_opts.df);
	whURL = wh_protokoll+'://www.webhits.de/cgi/Count.cgi?df='+wh_opts.df+'.dat&'+wh_params.join('&');
	return whURL;
}

function webhitsCountercode(wh_opts, wh_returnHTML){
	if (typeof(wh_opts.df) != 'undefined'){
		if( webhitsGetCookie('webhits_track') == 'no' ){
			wh_opts.incr = '0';
		}
	
		if (typeof(wh_opts.width) == 'undefined'){ wh_opts.width = 'auto'; }
		if (typeof(wh_opts.height) == 'undefined'){ wh_opts.height = 'auto'; }
		
		if (typeof(wh_opts.text) != 'undefined' && (wh_opts.text == "1" || wh_opts.text == "T" || wh_opts.text == "Y")){
			webhitsCounterAsText(wh_opts);
			return true;
		}else if (typeof(wh_opts.flash) != 'undefined' && (wh_opts.flash == "1" || wh_opts.flash == "T" || wh_opts.flash == "Y")){
			webhitsCounterAsFlash(wh_opts);
			return true;
		}else{
			if (typeof(wh_opts.sh) != 'undefined' && (wh_opts.sh == "0" || wh_opts.sh == "N" || wh_opts.sh == "F")){
				whCode = '<IMG ALT="Counter" SRC="'+wh_getCounterURL( wh_opts )+'" WIDTH="1" HEIGHT="1" />';
			}else{
				whCode = '<IMG ALT="Counter" SRC="'+wh_getCounterURL( wh_opts )+'" STYLE="width:'+wh_opts.width+';height:'+wh_opts.height+'" />';
			}
		}
	}else{
		whCode = '<p>Fehler im Countercode! Die Counter-ID fehlt in der Variablendefinition.';
	}
	if( typeof( wh_returnHTML ) != 'undefined'){
		return whCode;
	}else{
		document.write( whCode );
	}
}

// function webhitsCounterAsText(wh_opts, wh_returnHTML){
function webhitsCounterAsText(wh_opts){
	wh_opts.dd = 'javascript';
	whCode = '<SCRIPT LANGUAGE="JavaScript1.2" SRC="'+wh_getCounterURL( wh_opts )+'" TYPE="text\/javascript"><\/SCRIPT>';
	whCode += '<span id="webhitsTextCounter"></span>';
	document.write( whCode );
	window.setTimeout("webhitsCounterAsTextAusgabe()", 1000);
}

function webhitsCounterAsTextAusgabe(retry){
	if (typeof(retry) == "undefined") retry = 0;
	if (typeof(WH_COUNTER) != "undefined"){
		document.getElementById("webhitsTextCounter").innerHTML = WH_COUNTER;
	}else{
		retry++;
		if (retry >= 30) return false;
		window.setTimeout(function(){ webhitsCounterAsTextAusgabe(retry); }, 1000);
	}
}

function webhitsCounterAsFlash(wh_opts){
	if (typeof(wh_opts.counterJs) != 'undefined' && wh_opts.counterJs != ''){
		wh_opts.dd = 'javascript';
		whCode = '<SCRIPT LANGUAGE="JavaScript1.2" SRC="'+wh_getCounterURL( wh_opts )+'" TYPE="text\/javascript"><\/SCRIPT>';
		whCode += '<SCRIPT LANGUAGE="JavaScript1.2" SRC="'+wh_opts.counterJs+'" TYPE="text\/javascript"><\/SCRIPT>';
		whCode += '<NOSCRIPT><A HREF="http:\/\/www.webhits.de\/" TARGET="_blank">Counter by WebHits<\/A><\/NOSCRIPT>';
		whCode += '<div id="webhitsFlashCounter"></div>';

		document.write( whCode );
		window.setTimeout("webhitsCounterAsFlashAusgabe()", 1000);
	}else{
		alert('Fehler im Flashcounter! Bitte definieren Sie die Variable counterJs mit dem Pfad zur counter.js.');
	}
}

function webhitsCounterAsFlashAusgabe(retry){
	if (typeof(retry) == "undefined") retry = 0;
	if (typeof(WH_COUNTER) != "undefined"){
		document.getElementById("webhitsFlashCounter").innerHTML = WHTable;
	}else{
		retry++;
		if (retry >= 30) return false;
		window.setTimeout(function(){ webhitsCounterAsFlashAusgabe(retry); }, 1000);
	}
}

function webhitsGetCounterParams(wh_opts){
	var wh_params = new Array();
	if (typeof(wh_opts.display)		!= 'undefined') { wh_params[1]		= 'display='+wh_opts.display;	}
	if (typeof(wh_opts.timezone)	!= 'undefined') { wh_params[2]		= 'timezone='+wh_opts.timezone;	}
	if (typeof(wh_opts.tformat)		!= 'undefined') { wh_params[3]		= 'tformat='+wh_opts.tformat; 	}
	if (typeof(wh_opts.dformat)		!= 'undefined') { wh_params[4]		= 'dformat='+wh_opts.dformat; 	}
	if (typeof(wh_opts.ignore)		!= 'undefined') { wh_params[5]		= 'ignore='+wh_opts.ignore; 	}
	if (typeof(wh_opts.ft) 			!= 'undefined') { wh_params[6]		= 'ft='+wh_opts.ft; 			}
	if (typeof(wh_opts.frgb)		!= 'undefined') { wh_params[7] 		= 'frgb='+wh_opts.frgb; 		}
	if (typeof(wh_opts.tr) 			!= 'undefined') { wh_params[8]		= 'tr='+wh_opts.tr; 			}
	if (typeof(wh_opts.md) 			!= 'undefined') { wh_params[9]		= 'md='+wh_opts.md; 			}
	if (typeof(wh_opts.pad) 		!= 'undefined') { wh_params[10] 	= 'pad='+wh_opts.pad;			}
	if (typeof(wh_opts.dd) 			!= 'undefined') { wh_params[11]		= 'dd='+wh_opts.dd; 			}
	if (typeof(wh_opts.comma)		!= 'undefined') { wh_params[12] 	= 'comma='+wh_opts.comma; 		}
	if (typeof(wh_opts.srgb) 		!= 'undefined') { wh_params[13] 	= 'srgb='+wh_opts.srgb; 		}
	if (typeof(wh_opts.prgb) 		!= 'undefined') { wh_params[14] 	= 'prgb='+wh_opts.prgb; 		}
	if (typeof(wh_opts.chcolor)		!= 'undefined') { wh_params[15]		= 'chcolor='+wh_opts.chcolor; 	}
	if (typeof(wh_opts.sh) 			!= 'undefined') { wh_params[16]		= 'sh='+wh_opts.sh; 			}
	if (typeof(wh_opts.incr)	 	!= 'undefined') { wh_params[17] 	= 'incr='+wh_opts.incr; 		}
	if (typeof(wh_opts.negate) 		!= 'undefined') { wh_params[18]		= 'negate='+wh_opts.negate; 	}
	if (typeof(wh_opts.degrees)		!= 'undefined') { wh_params[19]		= 'degrees='+wh_opts.degrees; 	}
	if (typeof(wh_opts.rotate)		!= 'undefined') { wh_params[20]		= 'rotate='+wh_opts.rotate; 	}
	
	return wh_array_values(wh_params);
}

function wh_array_values (wh_input) {

    var wh_tmp_arr = [];
    var wh_cnt = 0;
    var wh_key = ''; 
    for ( wh_key in wh_input ){
	if( typeof wh_input[wh_key] != "string" ){ continue; }
        wh_tmp_arr[wh_cnt] = wh_input[wh_key];
        wh_cnt++;
    }
 
    return wh_tmp_arr;
}
function wh_trim (wh_str, wh_charlist) {
    wh_str += '';
    
    if (!wh_charlist) {
        // default list        
		wh_whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        wh_charlist += '';
        wh_whitespace = wh_charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');    
	}
    
    wh_l = wh_str.length;
    for (wh_i = 0; wh_i < wh_l; wh_i++) {
        if (wh_whitespace.indexOf(wh_str.charAt(wh_i)) === -1) {            
			wh_str = wh_str.substring(wh_i);
            break;
        }
    }
	
	wh_l = wh_str.length;
    for (wh_i = wh_l - 1; wh_i >= 0; wh_i--) {
        if (wh_whitespace.indexOf(wh_str.charAt(wh_i)) === -1) {
            wh_str = wh_str.substring(0, wh_i + 1);
            break;        
		}
    }
    
    return wh_whitespace.indexOf(wh_str.charAt(0)) === -1 ? wh_str : '';
}
function wh_str_replace(wh_search, wh_replace, wh_subject) {
	return wh_subject.toString().split(wh_search).join(wh_replace);
}
