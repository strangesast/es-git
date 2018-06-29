import { Constructor, Hash, Mode, Type } from '@es-git/core';
import { GitObject as BasicGitObject, IObjectRepo, textToBlob } from '@es-git/object-mixin';

export type TextBlobObject = {
  readonly type : Type.blob
  readonly body : string
}

export type GitObject = BasicGitObject | TextBlobObject;

export interface ISaveTextMixin {
  saveObject(object: GitObject): Promise<Hash>;
}

function isBasicGitObject(object: GitObject): object is BasicGitObject {
  return object.type !== Type.blob || object.body instanceof Uint8Array;
}

export default function saveTextMixin<T extends Constructor<IObjectRepo>>(repo : T) {
  return class SaveAsText extends repo {
    async saveObject(object: GitObject) {
      if (isBasicGitObject(object)) {
        return super.saveObject(object);
      }
      return super.saveObject({body: textToBlob(object.body), type: Type.blob});
    }

    async saveText(text: string) {
      return await this.saveObject({type: Type.blob, body: text});
    }
  }
}

export interface ISaveTextRepo {
  saveObject(object : GitObject) : Promise<Hash>;
  loadObject(hash : Hash) : Promise<GitObject | undefined>;
}
