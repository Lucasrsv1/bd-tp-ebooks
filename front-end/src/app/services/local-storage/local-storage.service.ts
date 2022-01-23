import { Injectable } from "@angular/core";

const APP_KEY_PREFIX = "EBOOKS_";

export enum LocalStorageKey {
	USER = "USER"
}

@Injectable({ providedIn: "root" })
export class LocalStorageService {
	constructor () { }

	public hasKey (key: LocalStorageKey, suffix: string = ""): boolean {
		return Boolean(this.get(key, null, suffix));
	}

	public get (key: LocalStorageKey, defaultValue: any = null, suffix: string = ""): string {
		return window.localStorage.getItem(APP_KEY_PREFIX + key + suffix) || defaultValue;
	}

	public set (key: LocalStorageKey, value: string, suffix: string = ""): void {
		window.localStorage.setItem(APP_KEY_PREFIX + key + suffix, value);
	}

	public delete (key: LocalStorageKey, suffix: string = ""): void {
		window.localStorage.removeItem(APP_KEY_PREFIX + key + suffix);
	}
}
