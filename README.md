# entity-manager
Entity Manager for mongodb
为实体提供通用的MongoDB存取功能

## 示例

```javascript
import 'entity-manager';

const mongoUrl = 'mongodb://localhost/test';
const entityName = 'testEntity';
const manager = new EntityManagerMongoDB(mongoUrl, entityName);

// 插入数据
const result = await manager.insert({
  name: 'test',
  address: 'my address',
});

// 如果添加成功，result.ok === 1，result.insertedId 为生成的_id

```

## API

### EntityManagerMongoDB类

#### constructor(urlOrDb, collectionName)

构造函数，初始化对象。

参数：
- urlOrDb 必须。存取数据用的数据库连接字符串或MongoDB [Db对象](http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html)。
- collectionName 必须。保存数据的集合名称。

返回值：无。

#### insert(entityData)
插入实体对象到数据库中。

参数：
- entityData 必须。实体数据，可包含一个`_id`字段，作为实体的主键，如果没有_id，则系统自动生成一个_id。

返回值：Promise([insertOneWriteOpResult](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#~insertOneWriteOpResult))。

#### find([options = {}])

查询实体对象

参数：
- options
  - query，默认{}，查询语句；
  - limit，默认100，查询结果的最大数；
  - skip，默认为0，查询结果跳过的数量；
  - sort，默认{ _id: 1}，查询排序方法。

返回值：
- 查询成功时，返回查询结果（数组）;
- 查询失败时，返回错误信息

#### count([query={}])
查询实体数量

参数：
- query，默认{}，查询语句

返回值：查询到的记录的数量。

#### findOne([query={}])
查询一个实体

参数：

返回值：

#### findById(_id)
根据_id查询实体

参数：
- _id，必须，实体Id

返回值：查询到的实体；

#### removeById(_id)
根据_id删除实体

返回值：
- 成功时，无；
- 失败时，错误信息.

#### updateById(query)
根据_id更新实体

参数：
- query 必须，且必须包含_id字段

#### update(condition, updateQuery, options = {})
更新实体

参数：
- condition 必须，实体查询语句
- updateQuery 必须，更新语句
- options 默认为{}， 提供给MongoDB更新方法的参数，参见：[collection.update](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#update)

#### mapReduce(map, reduce, options)
对数据执行MapReduce操作

参数：
- map 必须，map方法
- reduce 必须，reduce方法
- options 参见 [collection.mapReduce](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html#mapReduce)