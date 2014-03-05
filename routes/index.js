// mysql connection configure
var mysql = require('mysql');

var extractConnection = (function () {
    var mysqlConfig = {
            host: 'localhost',
            port: 3306,
            user: 'nodeMaster',
            password: 'node',
            database: 'nextLibrary'
        },

        returnInfo = function () {
            return mysqlConfig;
        };

    return {
        returnInfo: returnInfo
    };
}());

var conn = mysql.createConnection(extractConnection.returnInfo());

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
            userId: 'admin',
            password: 'admin'
        },

        returnInfo = function () {
            return info;
        };

    return {
        returnInfo: returnInfo
    };
}());

exports.loginEnter = function (req, res) {
    var userId = req.body.userId,
        password = req.body.password;

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

    //need to making asynchronous process
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
    var userId = req.body.userId,
        name = req.body.userName,
        password = req.body.password,
        reEnteredPassword = req.body.rePassword;

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
        res.render('error', {errorMsg: '비밀번호 재확인란이 틀렸어용!!!'});
    }
};

exports.main = function (req, res) {
    //send query to create cards at main page
    function createCard(callback) {
        conn.query('SELECT user.name userName, user.find_count find_count, book.title title, book.location location, ' +
            'rel.status status, rel.cardNum cardNum FROM user_has_book rel join book on rel.bookNum = book.bookNum ' +
            'join user on user.userNum = rel.userNum ORDER BY rel.cardNum DESC', function (err, result) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, result);
            }
        });
    }

    createCard(function (err, result) {
        if (err) {
            throw err;
        }
        if (result.length == 0) {
            //for first use. (no cards are exist)
            res.render('main', {userName: req.session.userName, userFindCount: req.session.find_count});
        }
        else {
            //return card list
            res.render('main', {userName: req.session.userName, userFindCount: result[0].find_count, cards: result,
                bookSearchResult: []});
        }
    });
};

//write
exports.searchBook = function (req, res) {
    var searchQuery = req.body.bookTitle,
        bookSearchResult = {};

    //full text search
    function bookSearch(callback) {
        conn.query('SELECT location, title, status FROM book WHERE MATCH(title) AGAINST("*'
            + searchQuery + '*") ORDER BY status LIMIT 5', function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }

            if (result.length > 0) {
                callback(null, result);
            }
            else {
                res.render('error', {errorMsg: '찾고자 하는 책 정보에 문제가 있어요 ㅜㅠ'});
            }
        })
    }

    bookSearch(function (err, result) {
        if (err) throw err;
        bookSearchResult = result;
        res.contentType('json');
        res.send(bookSearchResult);
    });
};

exports.writeCard = function (req, res) {
    var userId = req.session.userId,
        userNum,
        bookTitle = req.body.bookSendTitle,
        bookLocation,
        bookNum;

    function writeCard(callback) {
        //receive book info
        conn.query('SELECT bookNum, location FROM book WHERE title = "' + bookTitle + '"', function (err, result) {
            if (err) {
                callback(err);
                return;
            }

            if (result.length > 0) {
                //writing book info to create card. (bookTitle is unique key, so i should use result's first order value)
                bookLocation = result[0].location;
                bookNum = result[0].bookNum;

                //user configuration. (also userId is unique key)
                conn.query('SELECT userNum, find_count FROM user WHERE userId = "' + userId + '"', function (err, result) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    if (result.length > 0) {

                        userNum = result[0].userNum;

                        conn.query('UPDATE user SET find_count = find_count+1 WHERE userNum = "' + userNum + '"', function (err) {
                            if (err) {
                                callback(err);
                                return;
                            }

                            if (result.length > 0) {

                                //book status change
                                conn.query('UPDATE book SET status = 1, find_count = find_count + 1 WHERE bookNum = "'
                                    + bookNum + '"', function (err) {
                                    if (err) {
                                        callback(err);
                                    }
                                });
                                callback(null);
                            }
                            else {
                                res.render('error', {errorMsg: '로그인 문제가 있는 것 같아요'});
                            }
                        });
                    }
                    else {
                        res.render('error', {errorMsg: '로그인 문제가 있는 것 같아요'});
                    }
                });
            }
            else {
                res.render('error', {errorMsg: '책의 제목이 문제가 있어요'});
            }
        });
    }

    writeCard(function (err) {
        //receive callback variables
        if (err) {
            console.log("error while writing new Card");
            res.render('error');
        }

        //create card
        conn.query('INSERT INTO user_has_book (userNum, bookNum) VALUES ("'
            + userNum + '", "' + bookNum + '")', function (err) {
            if (err) {
                throw err;
            }
            console.log("successfully write new Card, book name : " + bookTitle);
        });

        res.redirect('/');
    });
};

//card return button action
exports.changeCard = function (req, res) {
    var cardNum = req.params.cardNum,
        bookNum;

    //
    function changeCard(callback) {
        conn.query('UPDATE user_has_book SET status = 1 WHERE cardNum = "' + cardNum + '"', function (err) {
            if (err) {
                callback(err, null);
                return;
            }

            console.log("cardNum :" + cardNum + " successfully changed");

            conn.query('SELECT bookNum FROM user_has_book WHERE cardNum ="' + cardNum + '"', function (err, result) {
                if (err) {
                    callback(err, null);
                    return;
                }
                if (result.length > 0) {
                    bookNum = result[0].bookNum;
                    console.log(bookNum);
                    callback(null);
                }
                else {
                    res.render('error', {errorMsg: '반납에 문제가 있어요'});
                }
            });
        });
    }

    changeCard(function (err) {
        if (err) throw err;
        conn.query('UPDATE book SET status = 0 WHERE bookNum = "' + bookNum + '"', function (err) {
            if (err) {
                throw err;
            }
            console.log("bookNum :" + bookNum + " successfully changed");

            res.redirect('/');
        })

    });
};