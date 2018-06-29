import test from 'ava';
import * as sinon from 'sinon';
import { Hash, Type } from '@es-git/core';
import { IObjectRepo } from '@es-git/object-mixin';

import saveTextMixin, { GitObject } from './index';

test('save obj', async t => {
  const save = sinon.spy();
  const repo =  new SaveTextRepo({save});

  const resultA = await repo.saveText("toast");
  const resultB = await repo.saveObject({type: Type.blob, body: (new TextEncoder).encode("toast")});
  t.true(save.calledTwice);

  t.is(resultA, resultB);
});

const SaveTextRepo = saveTextMixin(class TestRepo {
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
});
