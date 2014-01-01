// mysql connection configure

var mysql = require('mysql');
var mysqlConfig = {
    host: 'localhost',
    port: '3306',
    user: 'nodeMaster',
    password: 'node',
    database: 'nextLibrary'
};
var conn = mysql.createConnection(mysqlConfig);

exports.start = function (req, res) {
    if (false) {

    }
    else {
        res.render('start');
    }
};

exports.login = function (req, res) {
    res.render('login');
};

exports.register = function (req, res) {
    res.render('register');
};

exports.registerEnter = function (req, res) {
    if (req.body.password === req.body.rePassword) {
        conn.query('INSERT INTO ')
    }
    else {
        res.send("not good");
    }
}

exports.main = function (req, res) {
    res.render('main');
};