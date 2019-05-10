try {
    const mysql = require('mysql');
    const express = require('express');
    const jwt = require("jsonwebtoken");
    const Q = require('q');
    const Promise = require('promise');
    var app = express();
    const bodyparser = require('body-parser');
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({
        extended: true
    }));
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    var mysqlConnection = mysql.createConnection({
        host: 'eu-cdbr-west-02.cleardb.net',
        user: 'b393a788a6ce87',
        password: '746fc67c',
        database: 'heroku_059c5a38624e915'
    });

    function mysqlConnect(callback) {
        mysqlConnection.connect((err) => {
            if (!err) {
                console.log("db connection succeded");
                return callback(true);
            } else {
                console.log('DB connection failed \n error:' + JSON.stringify(err, undefined, 2));
                return callback(false);
            }
        });
    }

    mysqlConnect((err)=>{

    });
    app.listen(process.env.PORT, () => {
        console.log('express started...');
    });

    app.get('/users', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {


                mysqlConnection.query('select * from users', (err, rows, fields) => {
                    if (!err) {
                        console.log(rows);
                        res.send(rows)
                    } else
                        console.log(err);
                });
            } else {
                res.send("DB Connection error");
            }
        });
    });

    app.get('/todoList/:id', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                mysqlConnection.query('select * from todolist where idTodolist = ?', [req.params.id], (err, rows, fields) => {
                    if (!err) {
                        console.log(rows);
                        res.send(rows)
                    } else
                        console.log(err);
                });
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });
    app.get('/todoList/all/:id', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                mysqlConnection.query('select * from todolist where user_id = ?', [req.params.id], (err, rows, fields) => {
                    if (!err) {
                        console.log(rows);
                        res.send(rows)
                    } else
                        console.log(err);
                });
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });

    app.post('/todoList/create', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                authenticate(req.body.token, (result => {
                    if (result === true) {
                        console.log(req.body);
                        mysqlConnection.query('INSERT INTO `todolist` ( `name`, `description`, `user_id`) VALUES (?,?,?)', [req.body.name, req.body.description, req.body.user_id], (err, rows, fields) => {
                            if (!err) {
                                console.log(rows);
                                res.send(rows)
                            } else
                                console.log(err);
                        });
                    } else
                        res.send(false);
                }));
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });


//todolist update
    app.post('/todoList/update', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                authenticate(req.body['token'], (result => {
                    if (result === true) {
                        console.log(req.body);
                        mysqlConnection.query('UPDATE `todolist` SET `name`= ?, `description`=?, `user_id`=?', [req.body.name, req.body.description, req.body.user_id], (err, rows, fields) => {
                            if (!err) {
                                console.log(rows);
                                res.send(rows)
                            } else
                                console.log(err);
                        });
                    } else
                        res.send(false);
                }));
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });

//todolist delete
    app.post('/todoList/delete', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                authenticate(req.body.token, (result => {
                    if (result === true) {
                        console.log(req.body);
                        mysqlConnection.query('DELETE FROM `todolist` where idTodolist = ?', [req.body.id], (err, rows, fields) => {
                            if (!err) {
                                console.log(rows);
                                res.send(rows)
                            } else
                                console.log(err);
                        });
                    } else
                        res.send(false);
                }));
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });
    app.get('/todo/byTodoList/:id', (req, res) => {
        console.log("works");
        mysqlConnect((connected) => {
            if (connected === true) {
                mysqlConnection.query('select * from todo where todoList_id = ?', [req.params.id], (err, rows, fields) => {
                    if (!err) {
                        console.log(rows);
                        res.send(rows)
                    } else
                        console.log(err);
                });
            } else {
                res.send("DB Connection error");
            }
        });
    });
//todo create
    app.post('/todo/create', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                authenticate(req.body.token, (result => {
                    if (result === true) {
                        console.log(req.body);
                        mysqlConnection.query('INSERT INTO `todo` ( `name`, `description`, `todoList_id`) VALUES (?,?,?)', [req.body.name, req.body.description, req.body.todoList_id], (err, rows, fields) => {
                            if (!err) {
                                console.log(rows);
                                res.send(rows)
                            } else
                                console.log(err);
                        });
                    } else
                        res.send(false);
                }));
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });


//todo update
    app.post('/todo/update', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                authenticate(req.body.token, (result => {
                    if (result === true) {
                        console.log(req.body);
                        mysqlConnection.query('UPDATE `todo` SET `name`=?, `description`=?,completed = ?, `todoList_id`=? where id= ?', [req.body.name, req.body.description, req.body.completed, req.body.todoList_id, req.body.id], (err, rows, fields) => {
                            if (!err) {
                                console.log(rows);
                                res.send(rows)
                            } else
                                console.log(err);
                        });
                    } else
                        res.send(false);
                }));
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });


//todo delete
    app.post('/todo/delete', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                console.log(req.bodytoken);
                authenticate(req.body.token, (result => {
                        if (result === true) {
                            console.log("truee??");
                            console.log(req.body);
                            mysqlConnection.query('DELETE FROM `todo` where id= ?', [req.body.id], (err, rows, fields) => {
                                if (!err) {
                                    console.log(rows);
                                    res.send(rows)
                                } else
                                    console.log(err);
                            });
                        } else {
                            console.log("false???");
                            res.send(false);
                        }

                    })
                )
                ;
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });


//login user
    app.post('/users/login', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                console.log(req.body);
                mysqlConnection.query('SELECT * FROM users WHERE `email` = ? and `password` = ?', [req.body.email, req.body.password], (err, rows, fields) => {
                    console.log("fields" + fields);
                    if (rows.length !== 0) {
                        var today = new Date();
                        var expiresAt = new Date(today.setHours(today.getHours() + 8));
                        const token = jwt.sign({email: req.body.email, expAt: expiresAt}, "secret");
                        console.log("token" + token);
                        console.log("expires" + expiresAt);
                        mysqlConnection.query('INSERT INTO `tokens` ( `token`, `expiresAt`, `userId`) VALUES (?,?,?)', [token, expiresAt.toISOString().slice(0, 19).replace('T', ' '), rows[0].idUsers], (err1, rows1, fields) => {
                            console.log(rows);
                            let obj = {
                                token: token,
                                userId: rows[0].idUsers
                            };
                            res.send(obj);
                        });

                    } else {
                        res.send("false");
                        console.log(rows);
                        console.log(err);
                    }
                });
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });


//user update
    app.post('/users/update', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                console.log(req.body);
                mysqlConnection.query('UPDATE `users` SET `email`=?, `password`=?', [req.body.email, req.body.password], (err, rows, fields) => {
                    if (!err) {
                        console.log(rows);
                        res.send(rows)
                    } else
                        console.log(err);
                });
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });

//user delete
    /*
    app.post('/users/delete', (req, res) => {
        console.log(req.body);
        mysqlConnection.query('DELETE FROM `users`', [req.body.email, req.body.password], (err, rows, fields) => {
            if (!err) {
                console.log(rows);
                res.send(rows)
            } else
                console.log(err);
        });
    });*/
//user register
    app.post('/users/register', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                mysqlConnection.query('INSERT INTO `users` ( `email`, `password`) VALUES (?,?)', [req.body.email, req.body.password], (err, rows, fields) => {
                    if (!err) {
                        console.log(rows);
                        res.send(rows)
                    } else
                        console.log(err);
                });
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });

//get users podle idecek
    app.get('/users/:id', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                mysqlConnection.query('SELECT * FROM todolist WHERE idUsers = ?', [req.params.id], (err, rows, fields) => {
                    if (!err) {
                        console.log(rows);
                        res.send(rows)
                    } else
                        console.log(err);
                });
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });
    app.post('/users/logout', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                mysqlConnection.query('delete FROM tokens WHERE token = ?', [req.body.token], (err, rows, fields) => {
                    if (!err) {
                        console.log(rows);
                        res.send(rows)
                    } else
                        console.log(err);
                });
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });

//get user podle mailu
    app.get('/users/:email', (req, res) => {
        mysqlConnect((connected) => {
            if (connected === true) {
                mysqlConnection.query('SELECT * FROM users WHERE email = ?', [req.params.email], (err, rows, fields) => {
                    if (!err) {
                        console.log(rows);
                        res.send(rows)
                    } else
                        console.log(err);
                });
            } else {
                res.send("DB Connection error");
            }
        });
        mysqlConnection.end();
    });


// pro každý objekt CRUD = Create Update Delete
// get podle uvážení

    function authenticate(token, callback) {
        mysqlConnection.query('select * from tokens where token = ?', [token], (err, rows, fields) => {
            console.log(rows);
            if (rows.length === 1) {
                if (new Date(rows[0].expiresAt) > new Date()) {
                    console.log("authenticate true");
                    return callback(true);
                } else {
                    console.log("authenticate false");
                    return callback(false);
                }
            } else
                return callback(false);
        });

    }

    function getUserFromToken(token, callback) {
        mysqlConnection.query('select * from tokens where token = ?', [token], (err, rows, fields) => {
            console.log(rows);
            if (rows.length === 1) {
                if (new Date(rows[0].expiresAt) > new Date()) {
                    console.log("authenticate true");
                    return callback(rows[0].userId);
                }
            }
        });
    }


} catch (e) {
    console.log(e);
    console.log('někde se stala chyba');
}

