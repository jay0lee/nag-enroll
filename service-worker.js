chrome.runtime.getPlatformInfo(function (info) {
    if ( info.os != 'cros' ) {
        // We should be a noop on non-ChromeOS devices
        return
    }
    if ( typeof chrome.enterprise == "undefined" ) {
        console.log("chrome.enterprise not available. Nagging.");
        schedule_nag();
    } else if ( typeof chrome.enterprise.deviceAttributes == "undefined" ) {
        console.log("chrome.enterprise.deviceAttributes not available. Nagging.");
        schedule_nag();
    } else if ( typeof chrome.enterprise.deviceAttributes.getDirectoryDeviceId == "undefined" ) {
        console.log("chrome.enterprise.deviceAttributes.getDirectoryDeviceID() not available. Nagging.");
        schedule_nag();
    } else {
        console.log("getDirectoryDeviceId() available. Calling it.");
        chrome.enterprise.deviceAttributes.getDirectoryDeviceId(handle_id);
    }
});

function handle_id(id) {
    // Device ID is a uuid4 and should be at least 36 chars long.
    if ( id.length < 36 ) {
	console.log("expected a 36 char device ID, got: '" + id + ". Nagging.");
        schedule_nag()
    } else {
        console.log("We are enrolled with device id: " + id + " nothing else to do here.");
    }
}

function schedule_nag() {
	chrome.alarms.create("nag_enroll", {
		periodInMinutes: 0.5,
		delayInMinutes: 0,
	});
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "nag_enroll") {
        options = {
            type: "basic",
	    priority: 2,
	    requireInteraction: true,
            iconUrl: "logo/logo-128.png",
            title: "Enroll your device",
            message: "This ChromeOS device is not enrolled. Please click here for instructions to enroll this device."
        };
        chrome.notifications.create(options);
    }
});
