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
    if (false) {
    }
    else {
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

    conn.query(
        'SELECT userId, password from user WHERE userId = "' + userId + '"', function (err, row) {
            if (err) {
                throw err;
            }
            if (row.length == 0) {
                res.render('error', {errorMsg: '이 아이디는 없는 아이디에용'});
            }
            else {
                conn.query (
                    '', function (err, row){
                        if (err) {
                            throw err;
                        }
                    }
                )
            }
        }
    );

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
        var name2 = "eee";

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
                        'UPDATE user SET password = PASSWORD("' + password + '") WHERE userId = "' + userId + '"', function (err, result) {
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
    res.render('main');
};