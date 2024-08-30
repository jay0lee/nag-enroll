chrome.runtime.getPlatformInfo(function (info) {
    if ( info.os != 'cros' ) {
        // We should be a noop on non-ChromeOS devices
        return
    }
    if ( typeof chrome.enterprise == "undefined" ) {
        handle_id('not available');
    } else if ( typeof chrome.enterprise.deviceAttributes == "undefined" ) {
        handle_id('not available');
    } else if ( typeof chrome.enterprise.deviceAttributes.getDirectoryDeviceId == "undefined" ) {
        handle_id('not available');
    } else {
        chrome.enterprise.deviceAttributes.getDirectoryDeviceId(handle_id);
    }
});

function handle_id(id) {
    if ( id === 'not available' ) {
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
