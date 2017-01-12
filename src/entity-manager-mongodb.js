/*
EntityManager 类，用于生成一个通用的管理Entity的类。
 */
/*
eslint-disable no-console
 */
import { useCollection } from 'mongo-use-collection'; // eslint-disable-line import/no-unresolved
import { MongoClient, GridStore } from 'mongodb';
import debug from 'debug';

const info = debug('entity-manager:info');
const error = debug('entity-manager:error');
export default class EntityManager {
  /**
   * 构造函数
   * @param  {String} collectionName Entity使用的集合的名称
   * @param  {String} mongoUrl       所使用的数据库的连接字符串
   */
  constructor(mongoUrl, collectionName) {
    this.collectionName = collectionName;
    this.mongoUrl = mongoUrl;
    this.useEntity = cb => useCollection(mongoUrl, collectionName, cb);
  }

  /**
   *
   * 插入实体对象到数据库中
   * @param  {Object} entityData 实体对象数据
   * @return {Promise}            操作结果
   */
  insert(entityData) {
    return new Promise((resolve, reject) => this.useEntity(async col => {
      let result;
      try {
        result = await col.insertOne(entityData);
        resolve(result);
      } catch (e) {
        console.log('EntityManager Error: ', e); // eslint-disable-line no-console
        reject(e);
      }
    }));
  }

/**
 * 查询实体对象
 * @param  {Object} query =             {}  查询条件
 * @param  {Number} limit =             100 查询结果限制
 * @param  {number} skip  =             0   跳过开头的结果
 * @return {Promise}       操作结果
 */
  find({ query = {}, limit = 100, skip = 0 } = { query: {}, limit: 100, skip: 0 }) {
    return new Promise((resolve, reject) => this.useEntity(async col => {
      let result;
      try {
        info(`[${col.collectionName}]query::`, query);
        info('limit:', limit);
        info('skip:', skip);
        const cursor = col.find(query).skip(skip).limit(limit);
        info('cursor:', cursor);
        result = await cursor.toArray();
        console.log('###', result);
        info(`[${col.collectionName}]result count::${result.length}`);
        return resolve(result);
      } catch (e) {
        error(e.message, e.stack);
        return reject(e);
      }
    }));
  }

  count(query = {}) {
    console.log('[EntityManager count]query::', JSON.stringify(query));
    return new Promise((resolve, reject) => this.useEntity(async col => {
      try {
        const result = await col.count(query);
        console.log('[EntityManager count]result::', result);
        resolve(result);
      } catch (e) {
        console.log('[EntityManager count]Error: ', e); // eslint-disable-line no-console
        reject(e);
      }
    }));
  }

  findOne(query = {}) {
    return new Promise((resolve, reject) => this.useEntity(async col => {
      try {
        const result = await col.findOne(query);
        resolve(result);
      } catch (e) {
        console.log('[EntityManager findOne]Error: ', e); // eslint-disable-line no-console
        reject(e);
      }
    }));
  }

  findById(_id) {
    return this.findOne({ _id });
  }

  removeById(_id) {
    return new Promise((resolve, reject) => this.useEntity(async col => {
      try {
        const result = await col.remove({ _id }, { single: true });
        resolve(result);
      } catch (e) {
        console.log('[EntityManager removeById]Error: ', e); // eslint-disable-line no-console
        reject(e);
      }
    }));
  }

  updateById(_id, updateQuery, options) {
    return this.update({ _id }, updateQuery, options);
  }

  update(condition, updateQuery, options = {}) {
    return new Promise((resolve, reject) => this.useEntity(async col => {
      try {
        const result = await col.update(condition, updateQuery, options);
        resolve(result);
      } catch (error) {
        reject({
          error,
          condition,
          updateQuery,
          options,
        });
      }
    }));
  }

  aggregate(pipeline, options) {
    return new Promise((resolve, reject) => this.useEntity(async col => {
      try {
        const cursor = col.aggregate(pipeline, options);
        const result = await cursor.toArray();
        resolve(result);
      } catch (e) {
        reject(e);
      }
    }));
  }


  group(keys, condition, initial, reduce, finalize, command, options) {
    return new Promise((resolve, reject) => this.useEntity(async col => {
      try {
        // http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#group
        const result = await col.group(keys, condition, initial,
          reduce, finalize, command, options);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    }));
  }

  mapReduce(map, reduce, options) {
    return new Promise((resolve, reject) => this.useEntity(async col => {
      try {
        const result = await col.mapReduce(map, reduce, options);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    }));
  }

  async writeFile(data, fileId, filename, options = null) {
    try {
      // 连接数据库
      const db = await MongoClient.connect(this.mongoUrl);

      // 创建一个新文件用于写入
      // http://mongodb.github.io/node-mongodb-native/2.2/api/GridStore.html
      const gs = new GridStore(db, fileId, filename, 'w', options);

      // 打开文件
      await gs.open();

      // 写入Buffer
      await gs.write(data);

      // 关闭文件
      await gs.close();

      await db.close();

      // 返回文件Id
      return fileId;
    } catch (e) {
      throw e;
    }
  }

  async readFile(fileId) {
    try {
    // 连接数据库
      const db = await MongoClient.connect(this.mongoUrl);
      const file = await GridStore.read(db, fileId);
      await db.close();

      // 返回文件Buffer
      return file;
    } catch (e) {
      throw e;
    }
  }

  async removeFile(fileId) {
    try {
    // 连接数据库
      const db = await MongoClient.connect(this.mongoUrl);
      await GridStore.unlink(db, fileId);
      await db.close();
    } catch (e) {
      throw e;
    }
  }
}
