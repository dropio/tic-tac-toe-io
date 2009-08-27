/***************************************************************
* The Drop.io Javascript API Client
* Author: Shaun Salzberg (shaun@dropio.com)
*
* Example Usage:
* api = new DropioApiClient("[YOUR API KEY]")
* api.createDrop({"name":"somedrop"},callback);
* function callback(response,success) {
* if( success ) alert("Your drop name: " + response.name);
* else alert("There was some error: " + response.message);
* };
*
******************************************************************/
 
function DropioApiClient(the_api_key,the_xd_path,opts) {
    this.api_key = the_api_key; // the api key
    
	if( the_xd_path != null )
      DropioApiClient.xd_path = the_xd_path;
    else
      DropioApiClient.xd_path = "http://" + document.location.host + "/DropioJSClientXDReceiver.html";
   
    if( typeof(opts) == "undefined" ) opts = {}
	
    // legacy param
	if( opts == true )
		this.call_type = DropioApiClient.AJAX_CALL_TYPE;
	else
 		this.call_type = opts.call_type != null ? opts.call_type : DropioApiClient.IFRAME_CALL_TYPE;
   
	if( this.call_type == DropioApiClient.AJAX_CALL_TYPE )
      this.request = null;
 
	this.version = opts.version ? opts.version : "2.0";
	
    /************************************************************************************************************************
    * The api calls
    * Each method takes two arguments:
    * 1) params - a json-style hash where the keys are the parameters specified in the Drop.io API docs
    * 2) callback - a callback function to be called when the API call is complete. It gets passed two arguments:
    * a) response - a json-style hash containing the response from the server with the structure specified by the api docs
    * b) success - a boolean indicating whether or not the attempted api call was successful
    **************************************************************************************************************************/
    this.createDrop = function(params,callback) {
      this.sendApiRequest(DropioApiClient.createDropUrl(),DropioApiClient.CREATE_DROP_METHOD,params,callback);
    };
    
    this.getDrop = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.GET_DROP_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.getDropUrl(params.drop_name),DropioApiClient.GET_DROP_METHOD,params,callback);
    };
    
    this.redirectToDrop = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.REDIRECT_TO_DROP_ACTION,callback) ) return;
      top.location.href = DropioApiClient.getRedirectUrl(DropioApiClient.redirectToDropUrl(params.drop_name),params);
    };
    
    this.getRedirectToDropUrl = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.REDIRECT_TO_DROP_ACTION,callback) ) return;
      return DropioApiClient.getRedirectUrl(DropioApiClient.redirectToDropUrl(params.drop_name),params);
    };
    
    this.updateDrop = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.UPDATE_DROP_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.updateDropUrl(params.drop_name),DropioApiClient.UPDATE_DROP_METHOD,params,callback);
    };
    
    this.deleteDrop = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.DELETE_DROP_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.deleteDropUrl(params.drop_name),DropioApiClient.DELETE_DROP_METHOD,params,callback);
    };
    
    this.createLink = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.CREATE_LINK_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.createLinkUrl(params.drop_name),DropioApiClient.CREATE_LINK_METHOD,params,callback);
    };
    
    this.createNote = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.CREATE_NOTE_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.createNoteUrl(params.drop_name),DropioApiClient.CREATE_NOTE_METHOD,params,callback);
    };
    
    // ONLY FOR FIREFOX EXTENSIONS
    this.createFile = function(params,onprogress,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.CREATE_FILE_ACTION,callback) ) return;
      this.sendAjaxUploadRequest(DropioApiClient.createFileUrl(),DropioApiClient.CREATE_FILE_METHOD,params,onprogress,callback);
    }
    
    this.getAssetList = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.GET_ASSET_LIST_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.getAssetListUrl(params.drop_name),DropioApiClient.GET_ASSET_LIST_METHOD,params,callback);
    };
    
    this.redirectToAsset = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.REDIRECT_TO_ASSET_ACTION,callback) ) return;
      top.location.href = DropioApiClient.getRedirectUrl(DropioApiClient.redirectToAssetUrl(params.drop_name,params.asset_name),params);
    };
    
    this.getRedirectToAssetUrl = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.REDIRECT_TO_DROP_ACTION,callback) ) return;
      return DropioApiClient.getRedirectUrl(DropioApiClient.redirectToAssetUrl(params.drop_name,params.asset_name),params);
    };
    
    this.getAsset = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.GET_ASSET_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.getAssetUrl(params.drop_name,params.asset_name),DropioApiClient.GET_ASSET_METHOD,params,callback);
    };
    
    this.updateAsset = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.UPDATE_ASSET_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.updateAssetUrl(params.drop_name,params.asset_name),DropioApiClient.UPDATE_ASSET_METHOD,params,callback);
    };
    
    this.deleteAsset = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.DELETE_ASSET_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.deleteAssetUrl(params.drop_name,params.asset_name),DropioApiClient.DELETE_ASSET_METHOD,params,callback);
    };
    
    this.sendAsset = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.SEND_ASSET_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.sendAssetUrl(params.drop_name,params.asset_name),DropioApiClient.SEND_ASSET_METHOD,params,callback);
    };
    
    this.getCommentList = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.GET_COMMENT_LIST_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.getCommentListUrl(params.drop_name,params.asset_name),DropioApiClient.GET_COMMENT_LIST_METHOD,params,callback);
    };
    
    this.createComment = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.CREATE_COMMENT_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.createCommentUrl(params.drop_name,params.asset_name),DropioApiClient.CREATE_COMMENT_METHOD,params,callback);
    };
    
    this.getComment = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.GET_COMMENT_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.getCommentUrl(params.drop_name,params.asset_name,params.comment_id),DropioApiClient.GET_COMMENT_METHOD,params,callback);
    };
    
    this.updateComment = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.UPDATE_COMMENT_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.updateCommentUrl(params.drop_name,params.asset_name,params.comment_id),DropioApiClient.UPDATE_COMMENT_METHOD,params,callback);
    };
    
    this.deleteComment = function(params,callback) {
      if( !DropioApiClient.validateParams(params,DropioApiClient.DELETE_COMMENT_ACTION,callback) ) return;
      this.sendApiRequest(DropioApiClient.deleteCommentUrl(params.drop_name,params.asset_name,params.comment_id),DropioApiClient.DELETE_COMMENT_METHOD,params,callback);
    };
    
    /***********************************************************************************************
    * creates a form containing a input field of type file in order to upload a file via the API
    * params - a json-style hash of parameters to be sent with the API call (see the API docs)
    * callback - a function to be called when uploading is complete
    * options - a json-style hash of options (see below)
    * valid options are:
    * form_id: the id of the form
    * form_css: the css class for the form
    * show_label: a boolean indicating whether or not to create a label for the file chooser field (true by default)
    * label_id: the id of the label
    * label: the text label to appear before the file chooser field, if show_label is set
    * label_css: the css class for the label before the file chooser field, if show_label is set
    * file_input_css: the css class for the file input field
    * show_submit_button: a boolean indicating whether or not to have create a submit button (true by default)
    * submit_button_id: the id of the submit_button
    * submit_button_label: the label to appear on the submit button
    * submit_button_css: the css class for the submit button
    * insert_after: the id of an element to insert the form after
    * insert_before: the id of an element to insert the form before
    * append_to: the id of an element to append this form to
    * If neither insert_before nor insert_after are specified, this will just return a reference
    * to the containing div element that is created
    *************************************************************************************************/
    this.uploadFileForm = function(params,callback,options) {
      var drop_name = params.drop_name;
      
      params = this.cleanParams(params);
 
      // the containing div
      var d = DOMHelper.createElement("div");
  
      // the form (uses innerHTML as a hack for IE so method/enctype work)
      var formstr = "<form action='"+DropioApiClient.createFileUrl()+"' method='post' enctype='multipart/form-data'";
      if( options.form_css != null ) formstr += " class='"+options.form_css+"'"
      if( options.form_id != null ) formstr += " id='"+options.form_id+"'"
      else formstr += "id ='dropio_js_api_upload_form"+(Math.round(Math.random()*9999999))+"'"; // the random id is so IE doesnt cache it
      formstr += "></form>"
      d.innerHTML = formstr;
      var f = d.firstChild;
      f.style.display = ""
      f.onsubmit = callback;
      
      // hidden fields
      var h1 = DOMHelper.createElement("input",{"type":"hidden","name":"api_key","value":params.api_key});
      var h2 = DOMHelper.createElement("input",{"type":"hidden","name":"format","value":"html"});
      var h3 = DOMHelper.createElement("input",{"type":"hidden","name":"drop_name","value":drop_name});
      
      if(params.token == null) params.token = "";
      var h4 = DOMHelper.createElement("input",{"type":"hidden","name":"token","value":params.token});
            
      var h5 = DOMHelper.createElement("input",{"type":"hidden","name":"version","value":this.version});
      
      // the file field label
      if( options.show_label == null || options.show_label == true ) {
        if( options.label == null ) options.label = "File: ";
        var l = DOMHelper.createElement("label")
        l.innerHTML = options.label;
        if( options.label_css != null ) { l.setAttribute("class",options.label_css); l.className = options.label_css; }
        if( options.label_id != null ) { l.setAttribute("id",options.label_id); l.id = options.label_id; }
      }
      
      // the file field
      var fif = DOMHelper.createElement("input",{"type":"file","name":"file","id":"file"});
      if( options.file_input_css != null ) { fif.setAttribute("class",options.file_input_css); fif.className = options.file_input_css; }
      
      // the submit button
      var sb = null;
      if( options.show_submit_button == null || options.show_submit_button == true ) {
        if( options.submit_button_label == null ) options.submit_button_label = "Upload";
        sb = DOMHelper.createElement("input",{"type":"submit","value":options.submit_button_label});
        if( options.submit_button_css != null ) { sb.setAttribute("class",options.submit_button_css); sb.className = options.submit_button_css; }
         if( options.submit_button_id != null ) { sb.setAttribute("id",options.submit_button_id); sb.id = options.submit_button_id; }
         sb.onclick = function() { DropioApiClient.submitUploadForm(f.id,callback); }
      }
      
      // build the form
      // appendChild is used rather than insert to appease IE
      f.appendChild(h1);
      f.appendChild(h2);
      f.appendChild(h3);
      f.appendChild(h4);
      f.appendChild(h5);
      if(l) f.appendChild(l);
      f.appendChild(fif);
      if( sb ) d.appendChild(sb);
      
      // add it to the DOM appropriately, or just return a reference to it
      if( options.insert_after != null ) {
        DOMHelper.insertAfter(options.insert_after,d);
        return d;
      }
      else if( options.insert_before != null ) {
        DOMHelper.insertBefore(options.insert_before,d);
        return d;
      }
      else if( options.append_to != null ) {
        DOMHelper.getElementById(options.append_to).appendChild(d);
        return d;
      }
      else
        return d;
    };
    
    /********************************
    * sends the actual api request
    ********************************/
    this.sendApiRequest = function(url,method,params,callback) {
      params = this.cleanParams(params);
	  switch(this.call_type) {
		  case DropioApiClient.AJAX_CALL_TYPE:	  
	      	this.sendAjaxRequest(url,method,params,callback);
			break;
		  case DropioApiClient.IFRAME_CALL_TYPE:
	      	this.sendAimRequest(url,method,params,callback);
			break;
		  case DropioApiClient.YAHOO_MAIL_CALL_TYPE:
			this.sendYahooMailRequest(url,method,params,callback)
			break;
		  case DropioApiClient.GOOGLE_WAVE_CALL_TYPE:
			this.sendGoogleWaveRequest(url,method,params,callback)
			break;
		  default:
			alert("You must specify a valid call type to the DropioApiClient constructor")
	  }
    };
    
    // for all but creating a file
    this.sendAjaxRequest = function(url,method,params,callback) {
      params.format = "json";
      var serialParams = this.serializeParams(params);

      this.getXHR(callback);

      this.request.open(method,url);
      this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      this.request.send(serialParams);
    };
    
    // NOTE: This will only work in firefox, namely when building a firefox extension
    this.sendAjaxUploadRequest = function(url,method,params,onprogress,callback) {
      params = this.cleanParams(params);
      params.format = "json";
      
      var boundaryString = '---------------------------dropio-boundary' + Math.random();
      var boundary = '--' + boundaryString;
      
      var formData = "";
      
      for( k in params ) {
        if( k != "file" && k != "fileName" && k != "contentType" ) {
          formData += boundary + '\r\n'
          formData += 'Content-Disposition: form-data; name="'+k+'"' + '\r\n\r\n'
          formData += params[k] + '\r\n'
        }
      }

      formData += boundary + '\r\n'
      formData += 'Content-Disposition: form-data; name="file"; filename="' + params.fileName + '"\r\n'
      formData += 'Content-Type: ' + params.contentType + '\r\n\r\n';

      // form - start
      var prefixStringInputStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
      prefixStringInputStream.setData(formData, formData.length);

      // form - middle (binary)
      var storageStream = Components.classes["@mozilla.org/storagestream;1"]
        .createInstance(Components.interfaces.nsIStorageStream);
      storageStream.init(4096, params.file.length, null);

      var binaryStream = Components.classes["@mozilla.org/binaryoutputstream;1"]
        .createInstance(Components.interfaces.nsIBinaryOutputStream);
      binaryStream.setOutputStream(storageStream.getOutputStream(0));
      binaryStream.writeBytes(params.file, params.file.length);
      binaryStream.close();

      // form - end
      var suffixStringInputStream = Components.classes["@mozilla.org/io/string-input-stream;1"]
        .createInstance(Components.interfaces.nsIStringInputStream);
      formData = '\r\n' + boundary + '--\r\n';
      suffixStringInputStream.setData(formData, formData.length);

      // multiplex the streams together
      var multiStream = Components.classes["@mozilla.org/io/multiplex-input-stream;1"]
        .createInstance(Components.interfaces.nsIMultiplexInputStream);
      multiStream.appendStream(prefixStringInputStream);
      multiStream.appendStream(storageStream.newInputStream(0));
      multiStream.appendStream(suffixStringInputStream);

      this.getXHR(callback);
      this.request.onuploadprogress = onprogress;
      this.request.open(method,url);
      this.request.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundaryString);
      this.request.setRequestHeader('Accept', "*/*");
      this.request.send(multiStream);
    };
    
    this.abortRequest = function() {
      if( this.request ) {
        this.request.abort();
        this.request = null;
      }
    };
    
    this.sendAimRequest = function(url,method,params,callback) {        
      // create form
      var f = DOMHelper.createElement("form",{action:url,method:"POST",style:"display:none"});
      f.id = "dropio_api_call_form_" + ((Math.round(Math.random()*9999999))); // the random id is so IE doesnt cache it
 
      
      // create hidden params
      for( i in params ) {
        var hf = DOMHelper.createElement("input",{type:"hidden",name:i,value:params[i]});
        f.appendChild(hf);
      }
      
      // method
      var hf = DOMHelper.createElement("input",{type:"hidden",name:"_method",value:method});
      f.appendChild(hf);
      
      // format
      var hf = DOMHelper.createElement("input",{type:"hidden",name:"format",value:"jtext"});
      f.appendChild(hf);
 
      document.body.appendChild(f);
 
      DropioApiClient.AIM.submit(f,callback,false);
      
      document.body.removeChild(f)
    };
    
	this.sendYahooMailRequest = function(url,method,params,callback) {
		if( typeof(openmail) == "undefined" ) {
			alert("DropioApiClient cannot detect the Yahoo Mail environment. Make sure the 'openmail' namespace is available.");
			return;
		}
		
		params["_method"] = method;
		params["format"] = "json"
		openmail.Application.callWebService({
			url: url,
			method: "POST",
			parameters: params
		}, function(response) {
			var responseJSON;
			if( response.error )
				responseJSON = {result:"Failure",action:"DropioApiClient",message:response.error};
			else
				responseJSON = YAHOO.lang.JSON.parse(response.data);
			
			callback(responseJSON, !response.error);	
		})
	}  
	
	this.sendGoogleWaveRequest = function(url,method,params,callback) { 
		alert("Google Wave calls not yet implemented.")
	} 

	this.serializeParams = function(params) {
      var res = "";
      for( k in params )
        res += k + "=" + escape(params[k]) + "&";
      res = res.substring(0,res.length-1);
      return res;
    };
    
    this.getXHR = function(callback) {
      var ua = navigator.userAgent.toLowerCase();
      this.abortRequest();
       if (!window.ActiveXObject)
         this.request = new XMLHttpRequest();
       else if (ua.indexOf('msie 5') == -1)
         this.request = new ActiveXObject("Msxml2.XMLHTTP");
       else 
         this.request = new ActiveXObject("Microsoft.XMLHTTP");

        this.request.onreadystatechange = function() {
          if (this.readyState == 4) {
            if( this.status == 0 ) return; // aborted
            var responseJSON;
            try { 
              responseJSON = eval( "(" + this.responseText + ")" );
            } catch(e) {
              responseJSON = {result:"Failure",action:"DropioApiClient",message:"unexpected response from the server"};
            }
            callback(responseJSON, this.status == 200);
          } 
       };
    };
    
    /********************************
    * utility functions
    ********************************/
    this.cleanParams = function(params) {
      newparams = {}
      
      for( var i in params )
        if( params[i] != null && params[i] != "" )
          newparams[i] = params[i]
          
      newparams.api_key = this.api_key;
      newparams.version = this.version
      
      // for sendAsset
      if( params.to_drop_name != null )
        newparams.drop_name = params.to_drop_name
      
      return newparams;
    };
};
 
/**********************************************************
* Define class variables and methods for DropioApiClient
***********************************************************/
DropioApiClient.HOST = "http://drop.io/";
DropioApiClient.API_HOST = "http://api.drop.io/";
DropioApiClient.UPLOAD_HOST = "http://assets.drop.io/";
 
// the api call urls
// uses {drop_name}, {asset_name}, and {comment_id} as placeholders
// use the corresponding getter methods to retrieve the urls with the substitutions
DropioApiClient.CREATE_DROP_URL = "drops";
DropioApiClient.GET_DROP_URL = "drops/{drop_name}";
DropioApiClient.REDIRECT_TO_DROP_URL = "{drop_name}/from_api";
DropioApiClient.UPDATE_DROP_URL = "drops/{drop_name}";
DropioApiClient.DELETE_DROP_URL = "drops/{drop_name}";
DropioApiClient.CREATE_LINK_URL = "drops/{drop_name}/assets";
DropioApiClient.CREATE_NOTE_URL = "drops/{drop_name}/assets";
DropioApiClient.CREATE_FILE_URL = "upload";
DropioApiClient.GET_ASSET_LIST_URL = "drops/{drop_name}/assets";
DropioApiClient.GET_ASSET_URL = "drops/{drop_name}/assets/{asset_name}";
DropioApiClient.REDIRECT_TO_ASSET_URL = "{drop_name}/asset/{asset_name}/from_api";
DropioApiClient.UPDATE_ASSET_URL = "drops/{drop_name}/assets/{asset_name}";
DropioApiClient.DELETE_ASSET_URL = "drops/{drop_name}/assets/{asset_name}";
DropioApiClient.SEND_ASSET_URL = "drops/{drop_name}/assets/{asset_name}/send_to";
DropioApiClient.GET_COMMENT_LIST_URL = "drops/{drop_name}/assets/{asset_name}/comments";
DropioApiClient.CREATE_COMMENT_URL = "drops/{drop_name}/assets/{asset_name}/comments";
DropioApiClient.GET_COMMENT_URL = "drops/{drop_name}/assets/{asset_name}/comments/{comment_id}";
DropioApiClient.UPDATE_COMMENT_URL = "drops/{drop_name}/assets/{asset_name}/comments/{comment_id}";
DropioApiClient.DELETE_COMMENT_URL = "drops/{drop_name}/assets/{asset_name}/comments/{comment_id}";
 
// the api call methods
DropioApiClient.CREATE_DROP_METHOD = "post";
DropioApiClient.GET_DROP_METHOD = "get";
DropioApiClient.REDIRECT_TO_DROP_METHOD = "get";
DropioApiClient.UPDATE_DROP_METHOD = "put";
DropioApiClient.DELETE_DROP_METHOD = "delete";
DropioApiClient.CREATE_LINK_METHOD = "post";
DropioApiClient.CREATE_NOTE_METHOD = "post";
DropioApiClient.CREATE_FILE_METHOD = "post";
DropioApiClient.GET_ASSET_LIST_METHOD = "get";
DropioApiClient.GET_ASSET_METHOD = "get";
DropioApiClient.REDIRECT_TO_ASSET_METHOD = "get";
DropioApiClient.UPDATE_ASSET_METHOD = "put";
DropioApiClient.DELETE_ASSET_METHOD = "delete";
DropioApiClient.SEND_ASSET_METHOD = "post";
DropioApiClient.GET_COMMENT_LIST_METHOD = "get";
DropioApiClient.CREATE_COMMENT_METHOD = "post";
DropioApiClient.GET_COMMENT_METHOD = "get";
DropioApiClient.UPDATE_COMMENT_METHOD = "put";
DropioApiClient.DELETE_COMMENT_METHOD = "delete";
  
// the dropio api client method action
DropioApiClient.CREATE_DROP_ACTION = "create_drop";
DropioApiClient.GET_DROP_ACTION = "get_drop";
DropioApiClient.REDIRECT_TO_DROP_ACTION = "redirect_to_drop";
DropioApiClient.UPDATE_DROP_ACTION = "update_drop";
DropioApiClient.DELETE_DROP_ACTION = "delete_drop";
DropioApiClient.CREATE_LINK_ACTION = "create_link";
DropioApiClient.CREATE_NOTE_ACTION = "create_note";
DropioApiClient.CREATE_FILE_ACTION = "create_file";
DropioApiClient.GET_ASSET_LIST_ACTION = "get_asset_list";
DropioApiClient.GET_ASSET_ACTION = "get_asset";
DropioApiClient.REDIRECT_TO_ASSET_ACTION = "redirect_to_asset";
DropioApiClient.UPDATE_ASSET_ACTION = "update_asset";
DropioApiClient.DELETE_ASSET_ACTION = "delete_asset";
DropioApiClient.SEND_ASSET_ACTION = "send_asset";
DropioApiClient.GET_COMMENT_LIST_ACTION = "get_comment_list";
DropioApiClient.CREATE_COMMENT_ACTION = "create_comment";
DropioApiClient.GET_COMMENT_ACTION = "get_comment";
DropioApiClient.UPDATE_COMMENT_ACTION = "update_comment";
DropioApiClient.DELETE_COMMENT_ACTION = "delete_comment";

DropioApiClient.IFRAME_CALL_TYPE = "iframe";
DropioApiClient.AJAX_CALL_TYPE = "ajax";
DropioApiClient.YAHOO_MAIL_CALL_TYPE = "yahoo_mail";
DropioApiClient.GOOGLE_WAVE_CALL_TYPE = "google_wave"; // not yet implemented
  
// the actions that require drop_name validation
DropioApiClient.DROP_NAME_VALIDATIONS =
                        [DropioApiClient.GET_DROP_ACTION,
                        DropioApiClient.REDIRECT_TO_DROP_ACTION,
                        DropioApiClient.UPDATE_DROP_ACTION,
                        DropioApiClient.DELETE_DROP_ACTION,
                        DropioApiClient.CREATE_LINK_ACTION,
                        DropioApiClient.CREATE_NOTE_ACTION,
                        DropioApiClient.CREATE_FILE_ACTION,
                        DropioApiClient.GET_ASSET_LIST_ACTION,
                        DropioApiClient.GET_ASSET_ACTION,
                        DropioApiClient.REDIRECT_TO_ASSET_ACTION,
                        DropioApiClient.UPDATE_ASSET_ACTION,
                        DropioApiClient.DELETE_ASSET_ACTION,
                        DropioApiClient.SEND_ASSET_ACTION,
                        DropioApiClient.GET_COMMENT_LIST_ACTION,
                        DropioApiClient.CREATE_COMMENT_ACTION,
                        DropioApiClient.GET_COMMENT_ACTION,
                        DropioApiClient.UPDATE_COMMENT_ACTION,
                        DropioApiClient.DELETE_COMMENT_ACTION];
                        
// the actions that need asset_name validation
DropioApiClient.ASSET_NAME_VALIDATIONS =
                        [DropioApiClient.GET_ASSET_ACTION,
                          DropioApiClient.REDIRECT_TO_ASSET_ACTION,
                          DropioApiClient.UPDATE_ASSET_ACTION,
                          DropioApiClient.DELETE_ASSET_ACTION,
                          DropioApiClient.SEND_ASSET_ACTION,
                          DropioApiClient.GET_COMMENT_LIST_ACTION,
                          DropioApiClient.CREATE_COMMENT_ACTION,
                          DropioApiClient.GET_COMMENT_ACTION,
                          DropioApiClient.UPDATE_COMMENT_ACTION,
                          DropioApiClient.DELETE_COMMENT_ACTION];
                          
// the actions that need comment_id validation
DropioApiClient.COMMENT_ID_VALIDATIONS =
                        [DropioApiClient.GET_COMMENT_ACTION,
                         DropioApiClient.UPDATE_COMMENT_ACTION,
                         DropioApiClient.DELETE_COMMENT_ACTION];
                                       
/********************************
* url getters
********************************/
DropioApiClient.createDropUrl = function() {
  return DropioApiClient.API_HOST + DropioApiClient.CREATE_DROP_URL;
};
 
DropioApiClient.getDropUrl = function(the_drop_name) {
  return DropioApiClient.API_HOST + DropioApiClient.GET_DROP_URL.replace(/{drop_name}/,the_drop_name);
};
 
DropioApiClient.redirectToDropUrl = function(the_drop_name) {
  return DropioApiClient.HOST + DropioApiClient.REDIRECT_TO_DROP_URL.replace(/{drop_name}/,the_drop_name);
};
 
DropioApiClient.updateDropUrl = function(the_drop_name) {
  return DropioApiClient.API_HOST + DropioApiClient.UPDATE_DROP_URL.replace(/{drop_name}/,the_drop_name);
};
 
DropioApiClient.deleteDropUrl = function(the_drop_name) {
  return DropioApiClient.API_HOST + DropioApiClient.DELETE_DROP_URL.replace(/{drop_name}/,the_drop_name);
};
 
DropioApiClient.createLinkUrl = function(the_drop_name) {
  return DropioApiClient.API_HOST + DropioApiClient.CREATE_LINK_URL.replace(/{drop_name}/,the_drop_name);
};
 
DropioApiClient.createNoteUrl = function(the_drop_name) {
  return DropioApiClient.API_HOST + DropioApiClient.CREATE_NOTE_URL.replace(/{drop_name}/,the_drop_name);
};
 
DropioApiClient.createFileUrl = function() {
  return DropioApiClient.UPLOAD_HOST + DropioApiClient.CREATE_FILE_URL;
};
 
DropioApiClient.getAssetListUrl = function(the_drop_name) {
  return DropioApiClient.API_HOST + DropioApiClient.GET_ASSET_LIST_URL.replace(/{drop_name}/,the_drop_name);
};
 
DropioApiClient.getAssetUrl = function(the_drop_name,the_asset_name) {
  return DropioApiClient.API_HOST + DropioApiClient.GET_ASSET_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name);
};
 
DropioApiClient.redirectToAssetUrl = function(the_drop_name,the_asset_name) {
  return DropioApiClient.HOST + DropioApiClient.REDIRECT_TO_ASSET_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name);
};
 
DropioApiClient.updateAssetUrl = function(the_drop_name,the_asset_name) {
  return DropioApiClient.API_HOST + DropioApiClient.UPDATE_ASSET_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name);
};
 
DropioApiClient.deleteAssetUrl = function(the_drop_name,the_asset_name) {
  return DropioApiClient.API_HOST + DropioApiClient.DELETE_ASSET_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name);
};
 
DropioApiClient.sendAssetUrl = function(the_drop_name,the_asset_name) {
  return DropioApiClient.API_HOST + DropioApiClient.SEND_ASSET_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name);
};
 
DropioApiClient.getCommentListUrl = function(the_drop_name,the_asset_name) {
  return DropioApiClient.API_HOST + DropioApiClient.GET_COMMENT_LIST_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name);
};
 
DropioApiClient.createCommentUrl = function(the_drop_name,the_asset_name) {
  return DropioApiClient.API_HOST + DropioApiClient.CREATE_COMMENT_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name);
};
 
DropioApiClient.getCommentUrl = function(the_drop_name,the_asset_name,the_comment_id) {
  return DropioApiClient.API_HOST + DropioApiClient.GET_COMMENT_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name).replace(/{comment_id}/,the_comment_id);
};
 
DropioApiClient.updateCommentUrl = function(the_drop_name,the_asset_name,the_comment_id) {
  return DropioApiClient.API_HOST + DropioApiClient.UPDATE_COMMENT_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name).replace(/{comment_id}/,the_comment_id);
};
 
DropioApiClient.deleteCommentUrl = function(the_drop_name,the_asset_name,the_comment_id) {
  return DropioApiClient.API_HOST + DropioApiClient.DELETE_COMMENT_URL.replace(/{drop_name}/,the_drop_name).replace(/{asset_name}/,the_asset_name).replace(/{comment_id}/,the_comment_id);
};
 
// validations
DropioApiClient.validateParams = function(the_params,the_action,the_callback) {
  var dnamevalid = DropioApiClient.DROP_NAME_VALIDATIONS.indexOf(the_action) == -1 || DropioApiClient.validate(the_params.drop_name);
  var anamevalid = DropioApiClient.ASSET_NAME_VALIDATIONS.indexOf(the_action) == -1 || DropioApiClient.validate(the_params.asset_name)
  var cidvalid = DropioApiClient.COMMENT_ID_VALIDATIONS.indexOf(the_action) == -1 || DropioApiClient.validate(the_params.comment_id)
  if( !(dnamevalid && anamevalid && cidvalid) ) {
    if( !dnamevalid ) message = "drop_name must be provided";
    else if( !anamevalid ) message = "asset_name must be provided";
    else if( !cidvalid ) message = "comment_id must be provided";
    else if( the_action == DropioApiClient.CREATE_FILE_ACTION ) {
      if( !the_params.file ) message = "file must be provided";
      else if( !the_params.fileName ) message = "fileName must be provided";
      else if( !the_params.contentType ) message = "contentType must be provided";
    }
    the_callback({result:"Failure",action:"DropioApiClient",message:message},false);
    return false;
  }
  else
    return true;
};
  
DropioApiClient.validate = function(the_param) {
  return the_param != null && the_param != "";
};
  
// updates the drop_name parameter to be submitted with a form
// created with uploadFileForm
DropioApiClient.updateDropNameForUploadForm = function(form_id,drop_name) {
  DOMHelper.getElementById(form_id).drop_name.value = drop_name;
};
 
// updates the token parameter to be submitted with a form
// created with uploadFileForm
DropioApiClient.updateTokenForUploadForm = function(form_id,token) {
  DOMHelper.getElementById(form_id).token.value = token;
};
 
// updates the callback for a form created with uploadFileForm
DropioApiClient.updateCallbackForUploadForm = function(form_id,new_callback) {
  DOMHelper.getElementById(form_id).onsubmit = new_callback
};
 
// submits a form created by uploadFileForm
// use this rather than simply submit()
DropioApiClient.submitUploadForm = function(form_id) {
    var f = DOMHelper.getElementById(form_id)
    DropioApiClient.AIM.submit(f,f.onsubmit,true);
};

DropioApiClient.getRedirectUrl = function(url,params) {
  unixutc = Math.round(Date.parse(new Date().toUTCString()) / 1000) + 10 * 60;
  sig = SHA1(unixutc+"+"+params.token+"+"+params.drop_name);
  exp = unixutc;
  
  redirectTo = url + "?version=" + this.version + "&signature=" + sig + "&expires=" + exp;

  if( params.first_admin != null ) redirectTo += "&prompt_admin=" + ( params.first_admin == true || params.prompt_admin == true );
  return redirectTo;
};

DropioApiClient.forLocalDev = function(host) {
	if(host == null) host = "localhost"
	DropioApiClient.local = true;
	DropioApiClient.HOST = "http://" + host + ":3000/";
	DropioApiClient.API_HOST = "http://" + host + ":3000/api/";	
}

/***************************************************
* THE AWESOME PATENTED* DROPIO AJAX IFRAME METHOD
* (*) not really patented
***************************************************/
DropioApiClient.AIM = {};
DropioApiClient.AIM.call_in_progress = false;
DropioApiClient.AIM.watchers = []; // keep list of watchers created so we can destroy them later -- hack for safari
DropioApiClient.AIM.submit = function(form_elem,callback,upload) {
  if( DropioApiClient.AIM.call_in_progress ) return;
  DropioApiClient.AIM.call_in_progress = true;
  
  var name = "dropio_js_client_xd_receiver_" + ((Math.round(Math.random()*9999999))); // the random id is so IE doesnt cache it
 
  // the iframe thats the target of the form submission
  var d  = DOMHelper.createElement("div");
  d.innerHTML =  "<iframe style='width:0px;height:0px;border:0px' src='about:blank' name='"+name+"' id='"+name+"' onload='DropioApiClient.AIM.addWatcherIframe(\""+name+"\","+upload+");'></iframe>"; // uses innerHTML as hack for IE so onload works
  document.body.appendChild(d);
  
  var i_target = DOMHelper.getElementById(name);
  i_target.onComplete = callback;

  form_elem.target = name;
  form_elem.submit();
};
 
DropioApiClient.AIM.addWatcherIframe = function(name,upload) {  
  // the iframe that watches the response coming into the first iframe
  var watcher_host = upload ? DropioApiClient.UPLOAD_HOST : ((DropioApiClient.local ? DropioApiClient.HOST : DropioApiClient.API_HOST) + "javascripts/");
  var watcher_id = name+"_watcher_" + ((Math.round(Math.random()*9999999)))
  var i_watcher = DOMHelper.createElement("iframe",{"style":"width:0px;height:0px;border:0px","src":watcher_host+"js_api_watcher.html#"+DropioApiClient.xd_path+"&"+name+"&0","name":name+"_watcher","id":watcher_id})
  
  DropioApiClient.AIM.watchers.push(watcher_id); // part of the hack for safari so back button works
  
  document.body.appendChild(i_watcher);
};
  
DropioApiClient.AIM.responseJSON = "";
DropioApiClient.AIM.parseResult = function(name,json,more) {
  DropioApiClient.AIM.responseJSON += json;

  // if there is more of the message, wait for it
  if(more) return;
    
  var i = DOMHelper.getElementById(name);

  // get the json from the identifer in the url
  var beg = DropioApiClient.AIM.responseJSON.indexOf("{");
  if( DropioApiClient.AIM.responseJSON.indexOf("[") < beg ) beg = DropioApiClient.AIM.responseJSON.indexOf("[");
  var end = DropioApiClient.AIM.responseJSON.lastIndexOf("}");
  if( DropioApiClient.AIM.responseJSON.lastIndexOf("]") > end ) end = DropioApiClient.AIM.responseJSON.lastIndexOf("]");
  DropioApiClient.AIM.responseJSON = DropioApiClient.AIM.responseJSON.substring(beg,end+1);

  // clean up
  DropioApiClient.AIM.cleanup(name,navigator.appVersion.indexOf("Safari") != -1 ? [] : DropioApiClient.AIM.watchers); // dont delete watcherd in safari since it causes it to crash
  DropioApiClient.AIM.watchers = []
  
  // callback time
  try {
    json = eval("("+DropioApiClient.AIM.responseJSON+")");
  } catch(e) {
    json = {response:{result:"Failure",action:"DropioApiClient",message:"unexpected response from the server"}}
  }
  success = true;
  if( json.response != null ) {
    json = json.response;
    if( json.result == "Failure" ) success = false;
  }
  
  DropioApiClient.AIM.responseJSON = "";
  DropioApiClient.AIM.call_in_progress = false;
  
  if(i)
    i.onComplete(json,success);  
};

DropioApiClient.AIM.cleanup = function(name,watchers) {
  DOMHelper.removeElement(name);
  while(w = watchers.pop()) // remove all iframes since safari generates a couple of them...
    DOMHelper.removeElement(w);
};
 
/**
* various utility functions to make this cross browser compatible without prototype
**/
var DOMHelper = {
  createElement: function(elem,attrs) {
    attrs_str = "";
    for( i in attrs )
      attrs_str += " " + i + "=\"" + attrs[i] + "\""
    
    // IE
    try {
      var e = document.createElement("<" + elem + attrs_str + ">");
    // others
    } catch(x) {
      var e = document.createElement(elem);
      for( i in attrs )
        e.setAttribute(i,attrs[i]);
    }
 
    return e;
  },
  
  getElementById: function(id) {
    return document.getElementById(id)
  },
  
  removeElement: function(id) {
    var x = DOMHelper.getElementById(id);
    if(x && x.parentNode)
      x.parentNode.removeChild(x);
  },
  
  insertBefore: function(id,elem) {
    var x = document.getElementById(id);
    x.parentNode.insertBefore(elem,x);
  },
  
  insertAfter: function(id,elem) {
    var x = document.getElementById(id);
    x.parentNode.appendChild(elem,x);
  }
};
 
/* Create an indexOf method for Array if this is IE */
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}
 
/**
* (for redirect to drop / asset )
* Secure Hash Algorithm (SHA1)
* http://www.webtoolkit.info/
*
**/
 
function SHA1 (msg) {
 
    function rotate_left(n,s) {
        var t4 = ( n<<s ) | (n>>>(32-s));
        return t4;
    };
 
    function lsb_hex(val) {
        var str="";
        var i;
        var vh;
        var vl;
 
        for( i=0; i<=6; i+=2 ) {
            vh = (val>>>(i*4+4))&0x0f;
            vl = (val>>>(i*4))&0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };
 
    function cvt_hex(val) {
        var str="";
        var i;
        var v;
 
        for( i=7; i>=0; i-- ) {
            v = (val>>>(i*4))&0x0f;
            str += v.toString(16);
        }
        return str;
    };
 
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    };
 
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
 
    msg = Utf8Encode(msg);
 
    var msg_len = msg.length;
 
    var word_array = new Array();
    for( i=0; i<msg_len-3; i+=4 ) {
        j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
        msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
        word_array.push( j );
    }
 
    switch( msg_len % 4 ) {
        case 0:
            i = 0x080000000;
        break;
        case 1:
            i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
        break;
 
        case 2:
            i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
        break;
 
        case 3:
            i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8 | 0x80;
        break;
    }
 
    word_array.push( i );
 
    while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 
    word_array.push( msg_len>>>29 );
    word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
        for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
        for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
 
        for( i= 0; i<=19; i++ ) {
            temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
 
        for( i=20; i<=39; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
 
        for( i=40; i<=59; i++ ) {
            temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
 
        for( i=60; i<=79; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
 
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
 
    }
 
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
 
    return temp.toLowerCase();
 
}
