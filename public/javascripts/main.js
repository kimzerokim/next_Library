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
				    var bookSearchResult = JSON.parse(request.responseText);
				    aside.writeEvent.showBookList(bookSearchResult);			              
                }
            };            
            request.send(oFormData);
            //ajax 통신이 끝난 후 폼의 값을 초기화 해준다.
            eleForm[0].value = "";           
        }, 
        
        bookSelect : function() {
            var searchResultDiv = document.getElementById("searchResult");
		    var searchResultList = searchResultDiv.getElementsByTagName('li');
		    for (var i = 0 ; searchResultList.length > i; i++) {
    		    searchResultList[i].style.backgroundColor = "#eeeeee";
    		    
    		    var liCheckBox = searchResultList[i].getElementsByClassName("check");
    		    liCheckBox[0].style.display = "none";
		    }
		    
		    this.style.backgroundColor = "#f4d5d5";
		    
		    var checkBox = this.getElementsByClassName("check");
		    checkBox[0].style.display = "block";
		    
		    var bookTitle = this.getElementsByClassName("bookTitle");
		    
		    var writeTitleInput = document.getElementById("writeTitleInput");
            writeTitleInput.value = bookTitle[0].innerText;    
		    
        },
        
        showBookList : function(result) {
            var gParentNode = document.getElementById("searchResult");
            var parentNode = gParentNode.childNodes[0];
            var sendHTML = '';
            
            for (var j = 0; result.length > j; j++) {
                var currentHTML = '<li><div class="resultCheckBox"><div class="check">쳌!</div></div><div class="bookLocation">'+ result[j].location +'</div><div class="bookTitle">'+ result[j].title +'</div>';
                if (result[j].status == 0) {
                    currentHTML += '<div class="bookStatus">집에있음</div></li>'; 
                    sendHTML += currentHTML;
                }
                else {
                    currentHTML += '<div class="bookStatus">가출중</div></li>'; 
                    sendHTML += currentHTML;
                }
            }
            parentNode.innerHTML = sendHTML;
            console.log(sendHTML);
            sendHTML = '';
            currentHTML = '';
            
            //검색결과가 만들어진 후 리스트에 이벤트핸들러 추가
            var searchResultDiv = document.getElementById("searchResult");
		    var searchResultList = searchResultDiv.getElementsByTagName('li');
		    for (var i = 0 ; searchResultList.length > i; i++) {
    		    searchResultList[i].addEventListener("click", aside.writeEvent.bookSelect, true);
		    }
        }
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