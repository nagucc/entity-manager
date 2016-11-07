/*
eslint-disable no-underscore-dangle
 */
import { expect } from 'chai';
import EntityManagerMongoDB from '../src/entity-manager-mongodb';

describe('EntityManagerMongoDB', () => {
  const mongoUrl = 'mongodb://localhost/test';
  const manager = new EntityManagerMongoDB(mongoUrl, 'testEntity');
  const entity = {
    _id: 23,
    name: 'tes',
  };
  let otherId;
  describe('insert()', () => {
    it('should has _id === 23', async () => {
      const result = await manager.insert(entity);
      expect(result.result.ok).to.eql(1);
      expect(result.insertedId).to.eql(entity._id);
    });
    it('should has _id', async () => {
      const result = await manager.insert({ name: entity.name });
      expect(result.result.ok).to.eql(1);
      expect(result.insertedId).to.be.ok;
      otherId = result.insertedId;
    });
  });
  describe('find*()', () => {
    it('findById()', async () => {
      const result = await manager.findById(entity._id);
      expect(result).to.eql(entity);
    });
    it('findOne()', async () => {
      const result = await manager.findOne({ name: entity.name });
      expect(result).to.eql(entity);
    });
    it('find()', async () => {
      const result = await manager.find({ name: entity.name });
      expect(result.length).to.eql(2);
      expect(result[0]).to.eql(entity);
    });
  });

  describe('count()', () => {
    it('count()', async () => {
      const result = await manager.count({ name: entity.name });
      expect(result).to.eql(2);
    });
  });

  describe('update*()', () => {
    it('updateById()', async () => {
      const result = await manager.updateById(entity._id, {
        $set: { other: 'oth' },
      });
      expect(result.result.ok).to.eql(1);
      expect(result.result.nModified).to.eql(1);
    });
    it('update()', async () => {
      const result = await manager.update({ name: entity.name }, {
        $set: { other: 'oth2' },
      }, { multi: true });
      expect(result.result.ok).to.eql(1);
      expect(result.result.nModified).to.eql(2);
    });
  });
  describe('removeById()', () => {
    it('should be ok, when _id is invalid', async () => {
      const result = await manager.removeById();
      expect(result.result.ok).to.eql(1);
      expect(result.result.n).to.eql(0);
    });
    it('should be ok, when _id is valid', async () => {
      const result = await manager.removeById(entity._id);
      expect(result.result.ok).to.eql(1);
      expect(result.result.n).to.eql(1);
      await manager.removeById(otherId);
    });
  });
  describe.skip('mapReduce()', () => {
  });
});
