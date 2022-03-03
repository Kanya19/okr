if (!window.localStorage.getItem('version')) {
    window.localStorage.setItem('version', 1)
}

let IndexDB = {
    init: (databaseName, table, flags, callback) => {
        let flag = flags;
        let verIndex = window.localStorage.getItem('version')
        var request = window.indexedDB.open(databaseName, verIndex);
        request.onerror = () => {
            let errdata = {
                status: 'error',
                mes: '打开数据库失败！'
            }
            callback(errdata)
        };
        var indexdb;
        request.onsuccess = (event) => {
            indexdb = event.target.result;
            if (flag == true) {
                verIndex = parseInt(window.localStorage.getItem('version')) + 1
                window.localStorage.setItem('version', verIndex);
            } else {
                verIndex = parseInt(window.localStorage.getItem('version'))
            }
            if (indexdb.objectStoreNames.length > 0) {
                flag = true
            }
            indexdb.isCreate = flag;
            flag = false;
            callback(indexdb)
        };
        request.onupgradeneeded = (event) => {
            indexdb = event.target.result;
            if (!indexdb.objectStoreNames.contains(table)) {
                if (flag) {
                    indexdb.createObjectStore(table, {
                        keyPath: 'id'
                    });
                }
            }
        }
    },
    insertData: (databaseName, table, key, data, callback) => {
        IndexDB.init(databaseName, table, true, (db) => {
            try {
                var addData = [{
                    id: key,
                    value: data
                }]
                var transaction = db.transaction(table, 'readwrite');
                var store = transaction.objectStore(table);
                for (var i = 0; i < addData.length; i++) {
                    store.add(addData[i]);
                }
                let backData = {
                    status: 'success',
                    dataBase: databaseName,
                    table: table,
                    data: addData
                }
                callback(backData)
            } catch (error) {
                let errdata = {
                    status: 'error',
                    mes: '数据写入失败！'
                }
                callback(errdata)
            }
            db.close()
        })
    },
    selectData: (databaseName, table, key, callback) => {
        IndexDB.init(databaseName, table, false, (db) => {
            if (db.isCreate == false) {
                let errdata = {
                    status: 'error',
                    mes: '获取数据失败！'
                }
                callback(errdata)
                db.close()
                return
            } else {
                var transaction = db.transaction(table, 'readwrite');
                var store = transaction.objectStore(table);
                var request = store.get(key);
                request.onsuccess = (e) => {
                    try {
                        var resultData = e.target.result;
                        let backData = {
                            status: 'success',
                            dataBase: databaseName,
                            table: table,
                            data: resultData.value
                        }
                        callback(backData)
                    } catch (error) {
                        let errdata = {
                            status: 'error',
                            mes: '数据读取失败！数据库中没有该数据！'
                        }
                        callback(errdata)
                    }
                };
                request.onerror = () => {
                    let errdata = {
                        status: 'error',
                        mes: '数据读取失败！'
                    }
                    callback(errdata)
                }
            }
            db.close()
        })
    },
    deleteData: (databaseName, table, key, callback) => {
        IndexDB.init(databaseName, table, false, (db) => {
            if (db.isCreate == false) {
                let errdata = {
                    status: 'error',
                    mes: '删除数据失败！'
                }
                callback(errdata)
                db.close()
                return
            } else {
                var transaction = db.transaction(table, 'readwrite');
                var store = transaction.objectStore(table);

                var getresult = store.get(key);
                let pro = new Promise((resolved) => {
                    getresult.onsuccess = (e) => {
                        resolved(e.target.result)
                        db.close()
                    }
                })
                pro.then(res => {
                    var result = store.delete(key);
                    if (res != undefined) {
                        result.onsuccess = () => {
                            let errdata = {
                                status: 'success',
                                mes: '删除成功！',
                            }
                            callback(errdata)
                        }
                        result.onerror = () => {
                            let errdata = {
                                status: 'error',
                                mes: '删除失败！'
                            }
                            callback(errdata)
                        }
                    } else {
                        let errdata = {
                            status: 'error',
                            mes: '数据库中已经没有该数据！'
                        }
                        callback(errdata)
                    }
                    db.close()
                })
            }
        })
    },
    changeData: (databaseName, table, key, data, callback) => {
        IndexDB.init(databaseName, table, true, (db) => {
            try {
                var addData = {
                    id: key,
                    value: data
                }
                var transaction = db.transaction(table, 'readwrite');
                var store = transaction.objectStore(table);
                store.put(addData);
                let backData = {
                    status: 'success',
                    dataBase: databaseName,
                    table: table,
                    data: addData
                }
                callback(backData)
            } catch (error) {
                let errdata = {
                    status: 'error',
                    mes: '更新写入失败！'
                }
                callback(errdata)
            }
            db.close()
        })
    },
    clearTable: (databaseName, table, callback) => {
        IndexDB.init(databaseName, table, true, (db) => {
            var transaction = db.transaction(table, 'readwrite');
            var store = transaction.objectStore(table);
            var result = store.clear();
            result.onsuccess = () => {
                let successmsg = {
                    status: "success",
                    msg: "数据表" + table + "清空成功！",
                }
                callback(successmsg)
            }
            result.onerror = () => {
                let successmsg = {
                    status: "success",
                    msg: "数据表" + table + "清空失败！",
                }
                callback(successmsg)
            }
        })
    },
    IndexDB: () => {}
}

// export default IndexDB