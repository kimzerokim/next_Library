// mysql connection configure
var mysql = require('mysql');
var mysqlConfig = {
    host: 'localhost',
    port: 3306,
    user: 'nodeMaster',
    password: 'node',
    database: 'nextLibrary'
};
var conn = mysql.createConnection(mysqlConfig);

//conn.connect(); // 사실 쿼리날릴때 자동으로 연결됨.
//conn.end(); // 이걸로 커넥션을 끊는다. -> 없는게 가장 편함. 여기서 오류가 많이 발생.


//start Route

exports.start = function (req, res) {
    //loginStatus on
    if (req.session.loginStatus) {
        res.redirect('/' + req.session.userId);
    }
    //loginStatus off
    else {
        console.log("로그인 실패");
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

exports.loginEnter = function (req, res) {
    var userId = req.body.userId;
    var password = req.body.password;

    function setSessionEndRedirect() {
        req.session.loginStatus = true;
        req.session.userId = userId;
        res.redirect('/');
    };

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
        var query = {
            userId: userId,
            name: name,
            password: password
        };
        console.log(query);

        // id 중복값이 있는지 확인하자.
        conn.query(
            'SELECT userId FROM user WHERE userId = "' + userId + '"', function (err, row) {
                if (err) {
                    throw err;
                }
                var numberOfResult = row.length;

                console.log("result" + numberOfResult);
                if (numberOfResult == 0) {
                    //데이터베이스 기재 및 비밀번호 변경
                    conn.query(
                        'INSERT INTO user SET ?', query, function (err, result) {
                            if (err) {
                                throw err;
                            }
                            res.json({status: "SUCCESS"});
                        });
                    conn.query(
                        'UPDATE user SET password = PASSWORD("' +
                            password + '") WHERE userId = "' + userId + '"', function (err) {
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

    function createCard() {
        conn.query()
    };

    res.render('main', {userName: req.session.userName, userFindCount: req.session.find_count});
};

//write
exports.searchBook = function (req, res) {
    var searchQuery = req.body.bookTitle;
    var bookStatus = {};

    function receiveQuery(row) {
        bookStatus = row;
        res.contentType('json');
        res.send(bookStatus);
    };

    conn.query('SELECT location, title FROM book WHERE title = SUBSTRING_INDEX("'
        + searchQuery + '",\' \' , 1)', function (err, row) {
        if (err) {
            throw err;
        }
        console.log(row[0]);
        receiveQuery(row[0]);
    });
};

exports.writeCard = function (req, res) {
    var userId = req.session.userId;
    var userNum;
    var bookTitle = req.body.bookSendTitle;
    var bookLocation;
    var bookNum;

    function bookConfigure() {
        conn.query('SELECT bookNum, location FROM book WHERE title = "' + bookTitle + '"', function (err, row) {
            if (err) {
                throw err;
            }
            writeBookVar(row[0]);
        });
    };

    function writeBookVar(row) {
        console.log(row);
        bookLocation = row.location;
        bookNum = row.bookNum;
        userConfigure();
    };

    function userConfigure() {
        conn.query('SELECT userNum FROM user WHERE userId = "' + userId + '"', function (err, row) {
            if (err) {
                throw err;
            }
            writeUserVar(row[0]);
        });
    };

    function writeUserVar(row) {
        userNum = row.userNum;
        writeRelation();
    };

    function writeRelation() {
        conn.query('INSERT INTO user_has_book (userNum, bookNum) VALUES ("'
            + userNum + '", "' + bookNum + '")', function (err) {
            if (err) {
                throw err;
            }
            console.log("finish");
        });
    };

    bookConfigure();

    res.redirect('/');
};