var writeButton = document.getElementById("writeRequest");
var userInfoButton = document.getElementById("userInfoRequest");
var settingButton = document.getElementById("settingRequest");
//var userInfoButton = $('#userInfoRequest');

var onload = {
	execute : function () {
		onload.addEvent();
	}, 
	
	addEvent : function () {
		writeButton.addEventListener("click", aside.writeEvent, true);
		userInfoButton.addEventListener("click", aside.userInfoEvent.popUp, true);
		//userInfoButton.on("click", aside.userInfoPopUpEvent);
		settingButton.addEventListener("click", aside.settingEvent.popUp, true);
	}
};

var util = {
	blurStyle : document.createElement('style'),
		
	blurOtherField : function () {
		this.blurStyle.innerHTML = "#contentsView {-webkit-filter: blur(3px); -moz-filter: blur(3px); -o-filter: blur(3px); -ms-filter: blur(3px); filter: blur(3px); opacity: 0.5;} footer {-webkit-filter: blur(3px); -moz-filter: blur(3px); -o-filter: blur(3px); -ms-filter: blur(3px); filter: blur(3px); opacity: 0.5;}";
		document.body.appendChild(this.blurStyle);
	}, 
		
	unblurOtherField : function () {
		document.body.removeChild(this.blurStyle);
	}
};

var aside = {
	writeEvent : function () {
		
	},
	
	userInfoEvent : {	
		popUp : function () {
			var userInfoWindow = document.getElementById("userInfoPopUp");
			var userInfoWindowCloseButton = document.getElementById("userInfoClose");
			
			userInfoWindow.style.display = "block";
			userInfoWindowCloseButton.addEventListener("click", aside.userInfoEvent.popUpClose, true);
			util.blurOtherField();
		},
	
		popUpClose : function () {
			var userInfoWindow = document.getElementById("userInfoPopUp");
			userInfoWindow.style.display = "none";
			util.unblurOtherField();
		}
	},
	
	settingEvent : {
		popUp : function () {
			var settingWindow = document.getElementById("settingPopUp");
			var settingWindowCloseButton = document.getElementById("settingClose");

			settingWindow.style.display = "block";
			settingWindowCloseButton.addEventListener("click", aside.settingEvent.popUpClose, true);
			util.blurOtherField();
		},
	
		popUpClose : function () {
			var settingWindow = document.getElementById("settingPopUp");
			settingWindow.style.display = "none";
			util.unblurOtherField();
		}
	}
};

window.onload = onload.execute();