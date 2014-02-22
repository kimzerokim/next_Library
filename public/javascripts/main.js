var writeButton = document.getElementById("writeRequest");
var userInfoButton = document.getElementById("userInfoRequest");
var settingButton = document.getElementById("settingRequest");
var searchButton = document.getElementById("searchButton");
//var userInfoButton = $('#userInfoRequest');

var onload = {
	execute : function () {
		onload.addEvent();
	}, 
	
	addEvent : function () {
		writeButton.addEventListener("click", aside.writeEvent.popUp, true);
		userInfoButton.addEventListener("click", aside.userInfoEvent.popUp, true);
		//userInfoButton.on("click", aside.userInfoPopUpEvent);
		settingButton.addEventListener("click", aside.settingEvent.popUp, true);
		searchButton.addEventListener("click", aside.writeEvent.bookSearchRequest, true);
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
	writeEvent : {
		popUp : function () {
			var writeWindow = document.getElementById("writePopUp");
			var writeWindowCloseButton = document.getElementById("writePopUpClose");
			
			writeWindow.style.display = "block";
			writeWindowCloseButton.addEventListener("click", aside.writeEvent.popUpClose, true);
			util.blurOtherField();
		},
	
		popUpClose : function () {
			var writeWindow = document.getElementById("writePopUp");
			writeWindow.style.display = "none";
			util.unblurOtherField();
		}, 
		
		bookSearchRequest : function(e) {
		    e.preventDefault();
            var eleForm = e.currentTarget.form;
            var oFormData = new FormData(eleForm);
           
            var url = "/searchBookForRequest";
            var request = new XMLHttpRequest();
		
            request.open("POST" , url, true);
            request.onreadystatechange = function() {
			    if (request.readyState == 4 && request.status == 200) {
				    var obj = JSON.parse(request.responseText);
				    var rTable = document.getElementById("searchResult");
				    rTable.style.display = "block";
				    var table1 = document.getElementById("table1");
                    table1.innerHTML = obj.location;
                    var table2 = document.getElementById("table2");
                    table2.innerHTML = obj.title;
                    var writeTitleInput = document.getElementById("writeTitleInput");
                    writeTitleInput.value = obj.title;           
                }
            };            
            request.send(oFormData);
            //ajax 통신이 끝난 후 폼의 값을 초기화 해준다.
            eleForm[0].value = "";
        }
        
        /*
bbookSearchRequest : function(e) {
            e.preventDefault();
            var eleForm = e.currentTarget.form;
            var oFormData = new FormData(eleForm);
            
            var url = "/searchBookForRequest";
            var request = new XMLHttpRequest();
            
            request.open("POST", url, true);
            request.onreadystatechange = function() {
                if (request.readState == 4 && request.status == 200) {
                    var obj = JSON.parse(request.responseText);
                    var resultList = document.getElementById("searchResult");
                    resultList.style.display = "block";
                }
            }
        }
*/
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