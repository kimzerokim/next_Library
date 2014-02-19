// mysql connection configure
var mysql = require('mysql');

var extractConnection = (function () {
    var mysqlConfig = {
        host: 'localhost',
        port: 3306,
        user: 'nodeMaster',
        password: 'node',
        database: 'nextLibrary'
    };

    var returnInfo = function () {
        return mysqlConfig;
    };

    return {
        returnInfo: returnInfo
    };
}());

var conn = mysql.createConnection(extractConnection.returnInfo());

//conn.connect(); // 사실 쿼리날릴때 자동으로 연결됨.
//conn.end(); // 이걸로 커넥션을 끊는다. -> 없는게 가장 편함. 여기서 오류가 많이 발생.


//start Route

exports.start = function (req, res) {
    //isAdmin?
    //redirect to adminpage
    if (req.session.isAdmin) {
        res.redirect('/admin');
    }

    //loginStatus on
    if (req.session.loginStatus) {
        res.redirect('/' + req.session.userId);
    }

    //loginStatus off
    else {
        /* res.render('error', {errorMsg : "오랜만이네"}); */
        console.log("로그아웃상태입니다.");
        req.session.isAdmin = false;
        req.session.loginStatus = false;
        res.render('start');
    }
};

exports.error = function (req, res) {
    res.render('error');
};

exports.login = function (req, res) {
    res.render('login');
};

var adminInfo = (function () {
    var info = {
        userId : 'admin',
        password : 'admin'
    };

    var returnInfo = function() {
        return info;
    };

    return {
        returnInfo : returnInfo
    };
}());

exports.loginEnter = function (req, res) {
    var userId = req.body.userId;
    var password = req.body.password;

    function configureAdmin() {
        if (userId === adminInfo.returnInfo().userId && password === adminInfo.returnInfo().password) {
            req.session.isAdmin = true;
            setSessionEndRedirect();
        }
    }

    function setSessionEndRedirect() {
        req.session.isAdmin = false;
        req.session.loginStatus = true;
        req.session.userId = userId;
        res.redirect('/');
    }

    //admin configure
    configureAdmin();

    conn.query(
        'SELECT userId, password from user WHERE userId = "' + userId + '"', function (err, row) {
            if (err) {
                throw err;
            }
            if (row.length == 0) {
                res.render('error', {errorMsg: '이 아이디는 없는 아이디에용'});
            }
            else {
                conn.query(
                    'SELECT userId, password from user WHERE userId = "'
                        + userId + '" AND password = PASSWORD("' + password + '")', function (err, row) {
                        if (err) {
                            throw err;
                        }
                        if (row.length == 0) {
                            res.render('error', {errorMsg: '비밀번호가 틀렸네요'});
                        }
                        else {
                            console.log("로그인 완료");
                            //userName을 가져오기위해 한번 더 조회
                            conn.query('SELECT name, find_count FROM user WHERE userId = "'
                                + userId + '"', function (err, row) {
                                if (err) {
                                    throw err;
                                }
                                req.session.userName = row[0].name;
                                req.session.find_count = row[0].find_count;
                                setSessionEndRedirect();
                            });
                        }
                    }
                )
            }
        }
    );
};

exports.logout = function (req, res) {
    req.session.loginStatus = false;
    res.redirect('/');
};

exports.register = function (req, res) {
    res.render('register');
};

exports.registerEnter = function (req, res) {
    var userId = req.body.userId;
    var name = req.body.userName;
    var password = req.body.password;
    var reEnteredPassword = req.body.rePassword;

    if (password === reEnteredPassword) {

        // id 중복값이 있는지 확인하자.
        conn.query(
            'SELECT userId FROM user WHERE userId = "' + userId + '"', function (err, row) {
                if (err) {
                    throw err;
                }
                var numberOfResult = row.length;

                if (numberOfResult == 0) {
                    //데이터베이스 기재 및 비밀번호 변경
                    conn.query(
                        'INSERT INTO user (userId, name, password) VALUES ("'
                            + userId + '", "' + name + '", PASSWORD("' + password + '"))', function (err) {
                            if (err) {
                                throw err;
                            }
                            res.json({status: "SUCCESS"});
                        });
                    res.redirect('/');
                }
                else {
                    res.render('error', {errorMsg: '사용중인 아이디지렁~~'});
                }
            });
    }
    else {
        res.render('error', {errorMsg: '비밀번호 확인이 틀렸어용!!!'});
    }
};

exports.main = function (req, res) {
    var cardUserName;
    var cardBookTitle;
    var cardBookLocation;

    function createCard(callback) {
        conn.query('SELECT user.name userName, book.title title, book.location location ' +
            'FROM user_has_book rel join book on rel.bookNum = book.bookNum ' +
            'join user on user.userNum = rel.userNum', function (err, row) {
            if (err) {
                callback(err, null);
            }
            else {
                //for문 구현 필수
                callback(null, row[0]);
            }
        });
    }

    createCard(function (err, row) {
        if (err) throw err;
        if (row.length == 0) {
            //완전히 처음 사용할 때, 카드가 없을경우 이렇게 처리해줘야함.
            res.render('main', {userName: req.session.userName, userFindCount: req.session.find_count});
        }
        else {
            cardUserName = row.userName;
            cardBookTitle = row.title;
            cardBookLocation = row.location;
            res.render('main', {userName: req.session.userName, userFindCount: req.session.find_count,
                cardUserName: cardUserName, cardBookTitle: cardBookTitle, cardBookLocation: cardBookLocation});
        }
    });
};

//write
exports.searchBook = function (req, res) {
    var searchQuery = req.body.bookTitle;
    var bookStatus = {};

    function receiveQuery(row) {
        bookStatus = row;
        res.contentType('json');
        res.send(bookStatus);
    }

    conn.query('SELECT SUBSTRING_INDEX("' + searchQuery + '",\' \' , 1) AS frontQ', function (err, row) {
        if (err) {
            throw err;
        }
        var frontQ = row[0].frontQ;
        frontQuerySend(frontQ);
    });

    function frontQuerySend(frontQ) {
        conn.query('SELECT location, title FROM book WHERE title LIKE "%' + frontQ + '%"', function (err, row) {
            if (err) {
                throw err;
            }
            receiveQuery(row[0]);
            console.log("여기1");
            console.log(row[0]);
        });
    }
};

exports.writeCard = function (req, res) {
    var userId = req.session.userId;
    var userNum;
    var bookTitle = req.body.bookSendTitle;
    var bookLocation;
    var bookNum;

    function writeCard(callback) {
        //receive book info
        conn.query('SELECT bookNum, location FROM book WHERE title = "' + bookTitle + '"', function (err, result) {
            if (err) {
                callback(err);
                return;
            }

            //writing book info to create card. (bookTitle is unique key, so i should use result's first order value)
            bookLocation = result[0].location;
            bookNum = result[0].bookNum;

            //user configuration. (also userId is unique key)
            conn.query('SELECT userNum FROM user WHERE userId = "' + userId + '"', function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }
                userNum = result[0].userNum;
                callback(null);
            });
        });
    }

    writeCard(function (err) {
        //receive callback variables
        if (err) {
            console.log("error while writing new Card");
            throw err;
        }

        //create card
        conn.query('INSERT INTO user_has_book (userNum, bookNum) VALUES ("'
            + userNum + '", "' + bookNum + '")', function (err) {
            if (err) {
                throw err;
            }
            console.log("successfully write new Card");
        });
    });

    res.redirect('/');
};