import test from 'ava';
import * as sinon from 'sinon';
import { Hash, Type } from '@es-git/core';
import { IObjectRepo } from '@es-git/object-mixin';
import saveTextMixin from '@es-git/save-text-mixin';

import saveSimpleMixin, { GitObject } from './index';

test('save obj', async t => {
  const save = sinon.spy();
  const repo =  new SaveSimpleRepo({save});

  const simple = {property: 'value', key: 1234};//, anotherKey: {objectKey: 'objectValue'}};
  const sameSimple = {key: 1234, property: 'value'};//, anotherKey: {objectKey: 'objectValue'}};

  t.deepEqual(simple, sameSimple);
  t.false(JSON.stringify(simple) == JSON.stringify(sameSimple));

  const resultA = await repo.saveSimple(simple);
  const resultB = await repo.saveSimple(sameSimple);
  t.true(save.calledTwice);

  const obj: GitObject = {type: Type.blob, body: {'toast': 'toast'}};

  //await repo.saveObject({type: Type.blob, body: simple});
  //await repo.saveObject({type: Type.blob, body: sameSimple});
});

const SaveSimpleRepo = saveSimpleMixin(saveTextMixin(class TestRepo {
  private readonly save: sinon.SinonSpy;
  constructor({save}: {save?: sinon.SinonSpy} = {}) {
    this.save = save || sinon.spy();
  }

  encodeObject(object: GitObject): [Hash, Uint8Array] {
    throw new Error('Method not implemented');
  }

  decodeObject(buffer: Uint8Array): GitObject {
    throw new Error('Method not implemented');
  }

  loadObject<T extends GitObject>(hash: string): Promise<T | undefined> {
    throw new Error('not implemented');
  }

  saveObject(object: GitObject): Promise<string> {
    return this.save(object);
  }
}));
