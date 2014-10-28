
var Parse = require('modules/Parse');
 
var isInForeground = true;
 
Ti.App.addEventListener('pause', function(){
    isInForeground = false;
});
 
Ti.App.addEventListener('resumed', function(){
    isInForeground = true;
});

var deviceToken;
 
/**
 * Registers device for push notifications and then registers the device on Parse
 * with the default channels
 * @param {Array} channels
 */
function register(channels){
	Ti.API.info("Registering device channels > "+JSON.stringify(channels));
	Ti.Network.registerForPushNotifications({
	    types: [
	        Ti.Network.NOTIFICATION_TYPE_BADGE,
	        Ti.Network.NOTIFICATION_TYPE_ALERT,
	        Ti.Network.NOTIFICATION_TYPE_SOUND
	    ], success:function(e) {
	    	Ti.API.info("Registered");
	    	/// Registering device on parse
	        Parse.register({
	                deviceType: 'ios',
	                deviceToken: e.deviceToken,
	                channels: channels || [] // array of channels, make sure to add the default broadcast channel
	        }, function(data, success){
	        	//TODO: remove this try catch
	        	 try{
		        	var data = JSON.parse(data);
		        } catch(ex){ Ti.API.error(JSON.stringify(ex)); }
	        	/// Storing the installation ID for later update.
        		Ti.App.Properties.setString("parseInstallationId", data.objectId);
	        });
	    }, error:function(e) {
	        Ti.API.error(e.error);
	    }, callback:function(e) {
	        Ti.API.info(JSON.stringify(e.data));
	        if (isInForeground && e.data && e.data.alert) {
	            var alertDialog = Ti.UI.createAlertDialog({
	                title: L('Alert', 'Alert'),
	                message: e.data.alert
	            });
	            alertDialog.show();
	        }
	        Ti.App.fireEvent('app:admin:refresh');
	    }
	});
}

function updateInstallation(args){
	if(args){
		args.error && args.error("Missing parameters");
		return false;
	}
	/// Reading installation ID from app properties if missing.
	if(!args.installationId){
		args.installationId = Ti.App.Properties.getString("parseInstallationId");
	}
	if(!args.installationId){
		args.error && args.error("Missing Installation ID");
		return false;
	}
	
	//. Good to go.
	//Parse.
}


/// TESTING ONLY
function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = {
	register : register
}
