'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var mongoUseCollection = require('mongo-use-collection');
var mongodb = require('mongodb');
var debug = _interopDefault(require('debug'));

var info = debug('entity-manager:info');
var error = debug('entity-manager:error');

var EntityManager$1 = function () {
  /**
   * 构造函数
   * @param  {String} collectionName Entity使用的集合的名称
   * @param  {String} mongoUrl       所使用的数据库的连接字符串
   */
  function EntityManager(mongoUrl, collectionName) {
    _classCallCheck(this, EntityManager);

    this.collectionName = collectionName;
    this.mongoUrl = mongoUrl;
    this.useEntity = function (cb) {
      return mongoUseCollection.useCollection(mongoUrl, collectionName, cb);
    };
  }

  /**
   *
   * 插入实体对象到数据库中
   * @param  {Object} entityData 实体对象数据
   * @return {Promise}            操作结果
   */


  _createClass(EntityManager, [{
    key: 'insert',
    value: function insert(entityData) {
      var _this = this;

      return new _Promise(function (resolve, reject) {
        return _this.useEntity(function () {
          var _ref = _asyncToGenerator(_regeneratorRuntime.mark(function _callee(col) {
            var result;
            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    result = void 0;
                    _context.prev = 1;
                    _context.next = 4;
                    return col.insertOne(entityData);

                  case 4:
                    result = _context.sent;

                    resolve(result);
                    _context.next = 12;
                    break;

                  case 8:
                    _context.prev = 8;
                    _context.t0 = _context['catch'](1);

                    console.log('EntityManager Error: ', _context.t0); // eslint-disable-line no-console
                    reject(_context.t0);

                  case 12:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, _this, [[1, 8]]);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      });
    }

    /**
     * 查询实体对象
     * @param  {Object} query =             {}  查询条件
     * @param  {Number} limit =             100 查询结果限制
     * @param  {number} skip  =             0   跳过开头的结果
     * @return {Promise}       操作结果
     */

  }, {
    key: 'find',
    value: function find() {
      var _this2 = this;

      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? { query: {}, limit: 100, skip: 0 } : arguments[0];

      var _ref2$query = _ref2.query;
      var query = _ref2$query === undefined ? {} : _ref2$query;
      var _ref2$limit = _ref2.limit;
      var limit = _ref2$limit === undefined ? 100 : _ref2$limit;
      var _ref2$skip = _ref2.skip;
      var skip = _ref2$skip === undefined ? 0 : _ref2$skip;

      return new _Promise(function (resolve, reject) {
        return _this2.useEntity(function () {
          var _ref3 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee2(col) {
            var result, cursor;
            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    result = void 0;
                    _context2.prev = 1;

                    info('[' + col.collectionName + ']query::', query);
                    info('limit:', limit);
                    info('skip:', skip);
                    cursor = col.find(query).skip(skip).limit(limit);
                    _context2.next = 8;
                    return cursor.toArray();

                  case 8:
                    result = _context2.sent;

                    info('[' + col.collectionName + ']result count::' + result.length);
                    return _context2.abrupt('return', resolve(result));

                  case 13:
                    _context2.prev = 13;
                    _context2.t0 = _context2['catch'](1);

                    error(_context2.t0.message, _context2.t0.stack);
                    return _context2.abrupt('return', reject(_context2.t0));

                  case 17:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this2, [[1, 13]]);
          }));

          return function (_x3) {
            return _ref3.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: 'count',
    value: function count() {
      var _this3 = this;

      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      console.log('[EntityManager count]query::', _JSON$stringify(query));
      return new _Promise(function (resolve, reject) {
        return _this3.useEntity(function () {
          var _ref4 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee3(col) {
            var result;
            return _regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.prev = 0;
                    _context3.next = 3;
                    return col.count(query);

                  case 3:
                    result = _context3.sent;

                    console.log('[EntityManager count]result::', result);
                    resolve(result);
                    _context3.next = 12;
                    break;

                  case 8:
                    _context3.prev = 8;
                    _context3.t0 = _context3['catch'](0);

                    console.log('[EntityManager count]Error: ', _context3.t0); // eslint-disable-line no-console
                    reject(_context3.t0);

                  case 12:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee3, _this3, [[0, 8]]);
          }));

          return function (_x5) {
            return _ref4.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: 'findOne',
    value: function findOne() {
      var _this4 = this;

      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new _Promise(function (resolve, reject) {
        return _this4.useEntity(function () {
          var _ref5 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee4(col) {
            var result;
            return _regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.prev = 0;
                    _context4.next = 3;
                    return col.findOne(query);

                  case 3:
                    result = _context4.sent;

                    resolve(result);
                    _context4.next = 11;
                    break;

                  case 7:
                    _context4.prev = 7;
                    _context4.t0 = _context4['catch'](0);

                    console.log('[EntityManager findOne]Error: ', _context4.t0); // eslint-disable-line no-console
                    reject(_context4.t0);

                  case 11:
                  case 'end':
                    return _context4.stop();
                }
              }
            }, _callee4, _this4, [[0, 7]]);
          }));

          return function (_x7) {
            return _ref5.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: 'findById',
    value: function findById(_id) {
      return this.findOne({ _id: _id });
    }
  }, {
    key: 'removeById',
    value: function removeById(_id) {
      var _this5 = this;

      return new _Promise(function (resolve, reject) {
        return _this5.useEntity(function () {
          var _ref6 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee5(col) {
            var result;
            return _regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.prev = 0;
                    _context5.next = 3;
                    return col.remove({ _id: _id }, { single: true });

                  case 3:
                    result = _context5.sent;

                    resolve(result);
                    _context5.next = 11;
                    break;

                  case 7:
                    _context5.prev = 7;
                    _context5.t0 = _context5['catch'](0);

                    console.log('[EntityManager removeById]Error: ', _context5.t0); // eslint-disable-line no-console
                    reject(_context5.t0);

                  case 11:
                  case 'end':
                    return _context5.stop();
                }
              }
            }, _callee5, _this5, [[0, 7]]);
          }));

          return function (_x8) {
            return _ref6.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: 'updateById',
    value: function updateById(_id, updateQuery, options) {
      return this.update({ _id: _id }, updateQuery, options);
    }
  }, {
    key: 'update',
    value: function update(condition, updateQuery) {
      var _this6 = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      return new _Promise(function (resolve, reject) {
        return _this6.useEntity(function () {
          var _ref7 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee6(col) {
            var result;
            return _regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.prev = 0;
                    _context6.next = 3;
                    return col.update(condition, updateQuery, options);

                  case 3:
                    result = _context6.sent;

                    resolve(result);
                    _context6.next = 10;
                    break;

                  case 7:
                    _context6.prev = 7;
                    _context6.t0 = _context6['catch'](0);

                    reject({
                      error: _context6.t0,
                      condition: condition,
                      updateQuery: updateQuery,
                      options: options
                    });

                  case 10:
                  case 'end':
                    return _context6.stop();
                }
              }
            }, _callee6, _this6, [[0, 7]]);
          }));

          return function (_x10) {
            return _ref7.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: 'aggregate',
    value: function aggregate(pipeline, options) {
      var _this7 = this;

      return new _Promise(function (resolve, reject) {
        return _this7.useEntity(function () {
          var _ref8 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee7(col) {
            var cursor, result;
            return _regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.prev = 0;
                    cursor = col.aggregate(pipeline, options);
                    _context7.next = 4;
                    return cursor.toArray();

                  case 4:
                    result = _context7.sent;

                    resolve(result);
                    _context7.next = 11;
                    break;

                  case 8:
                    _context7.prev = 8;
                    _context7.t0 = _context7['catch'](0);

                    reject(_context7.t0);

                  case 11:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, _callee7, _this7, [[0, 8]]);
          }));

          return function (_x11) {
            return _ref8.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: 'group',
    value: function group(keys, condition, initial, reduce, finalize, command, options) {
      var _this8 = this;

      return new _Promise(function (resolve, reject) {
        return _this8.useEntity(function () {
          var _ref9 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee8(col) {
            var result;
            return _regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.prev = 0;
                    _context8.next = 3;
                    return col.group(keys, condition, initial, reduce, finalize, command, options);

                  case 3:
                    result = _context8.sent;

                    resolve(result);
                    _context8.next = 10;
                    break;

                  case 7:
                    _context8.prev = 7;
                    _context8.t0 = _context8['catch'](0);

                    reject(_context8.t0);

                  case 10:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, _callee8, _this8, [[0, 7]]);
          }));

          return function (_x12) {
            return _ref9.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: 'mapReduce',
    value: function mapReduce(map, reduce, options) {
      var _this9 = this;

      return new _Promise(function (resolve, reject) {
        return _this9.useEntity(function () {
          var _ref10 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee9(col) {
            var result;
            return _regeneratorRuntime.wrap(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.prev = 0;
                    _context9.next = 3;
                    return col.mapReduce(map, reduce, options);

                  case 3:
                    result = _context9.sent;

                    resolve(result);
                    _context9.next = 10;
                    break;

                  case 7:
                    _context9.prev = 7;
                    _context9.t0 = _context9['catch'](0);

                    reject(_context9.t0);

                  case 10:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, _callee9, _this9, [[0, 7]]);
          }));

          return function (_x13) {
            return _ref10.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: 'writeFile',
    value: function () {
      var _ref11 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee10(data, fileId, filename) {
        var options = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
        var db, gs;
        return _regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _context10.next = 3;
                return mongodb.MongoClient.connect(this.mongoUrl);

              case 3:
                db = _context10.sent;


                // 创建一个新文件用于写入
                // http://mongodb.github.io/node-mongodb-native/2.2/api/GridStore.html
                gs = new mongodb.GridStore(db, fileId, filename, 'w', options);

                // 打开文件

                _context10.next = 7;
                return gs.open();

              case 7:
                _context10.next = 9;
                return gs.write(data);

              case 9:
                _context10.next = 11;
                return gs.close();

              case 11:
                _context10.next = 13;
                return db.close();

              case 13:
                return _context10.abrupt('return', fileId);

              case 16:
                _context10.prev = 16;
                _context10.t0 = _context10['catch'](0);
                throw _context10.t0;

              case 19:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this, [[0, 16]]);
      }));

      function writeFile(_x14, _x15, _x16, _x17) {
        return _ref11.apply(this, arguments);
      }

      return writeFile;
    }()
  }, {
    key: 'readFile',
    value: function () {
      var _ref12 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee11(fileId) {
        var db, file;
        return _regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _context11.next = 3;
                return mongodb.MongoClient.connect(this.mongoUrl);

              case 3:
                db = _context11.sent;
                _context11.next = 6;
                return mongodb.GridStore.read(db, fileId);

              case 6:
                file = _context11.sent;
                _context11.next = 9;
                return db.close();

              case 9:
                return _context11.abrupt('return', file);

              case 12:
                _context11.prev = 12;
                _context11.t0 = _context11['catch'](0);
                throw _context11.t0;

              case 15:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 12]]);
      }));

      function readFile(_x19) {
        return _ref12.apply(this, arguments);
      }

      return readFile;
    }()
  }, {
    key: 'removeFile',
    value: function () {
      var _ref13 = _asyncToGenerator(_regeneratorRuntime.mark(function _callee12(fileId) {
        var db;
        return _regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                _context12.next = 3;
                return mongodb.MongoClient.connect(this.mongoUrl);

              case 3:
                db = _context12.sent;
                _context12.next = 6;
                return mongodb.GridStore.unlink(db, fileId);

              case 6:
                _context12.next = 8;
                return db.close();

              case 8:
                _context12.next = 13;
                break;

              case 10:
                _context12.prev = 10;
                _context12.t0 = _context12['catch'](0);
                throw _context12.t0;

              case 13:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this, [[0, 10]]);
      }));

      function removeFile(_x20) {
        return _ref13.apply(this, arguments);
      }

      return removeFile;
    }()
  }]);

  return EntityManager;
}();

var EntityManager = EntityManager$1;

exports.EntityManagerMongoDB = EntityManager$1;
exports['default'] = EntityManager;
//# sourceMappingURL=index.js.map