import { Constructor, Hash, Type } from '@es-git/core';
import { GitObject as BasicGitObject, ISaveTextRepo } from '@es-git/save-text-mixin';
import * as stringify from 'json-stable-stringify';

export interface SimpleObject {
  [key: string]: SimpleObject | number | string | boolean;
}

export type Simple = SimpleObject | number | string | boolean;

export interface SimpleGitObject {
  type: Type.blob;
  body: Simple;
}

export type GitObject = BasicGitObject | SimpleGitObject;

export interface ISaveSimpleRepo {
  saveSimple(simple: Simple): Promise<Hash>;
}

function isBasicGitObject(object: GitObject): object is BasicGitObject {
  return object.type !== Type.blob || object.body instanceof Uint8Array || typeof object.body === 'string';
}

export default function saveSimpleMixin<T extends Constructor<ISaveTextRepo>>(repo: T): T & Constructor<ISaveSimpleRepo> {
  return class SaveSimpleRepo extends repo implements ISaveSimpleRepo {
    async saveObject(object: GitObject) {
      if(isBasicGitObject(object)) {
        return super.saveObject(object);
      }
      return super.saveObject({body: stringify(object.body), type: Type.blob});
    }

    async toast() {
      const simple = {toast: 'toast'};
      const res = await this.saveObject({type: Type.blob, body: simple});
    }

    async saveSimple(simple: Simple) {
      return await this.saveObject({
        type: Type.blob,
        body: simple
      });
    }
  }
}
