import {Inject, Injectable, Renderer2} from '@angular/core';
import {ObservableValue} from "../shared/ObservableValue";
import {ISettings} from "./ISettings";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public static readonly STORAGE_KEY = 'settings';
  public static readonly CAPITALS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  public static readonly LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  public static readonly NUMBERS = '0123456789';
  public static readonly SYMBOLS = '+=.?/;!@#$%^&*()`~ <>_-\\';

  private static readonly DEFAULT_PASSWORD_LENGTH = 28;
  private static readonly DEFAULT_ALPHABET = SettingsService.CAPITALS + SettingsService.LETTERS + SettingsService.NUMBERS + SettingsService.SYMBOLS;

  private _passwordLength: ObservableValue<number> = new ObservableValue<number>();
  private _defaultUsername: ObservableValue<string> = new ObservableValue<string>();
  private _usernames: ObservableValue<string[]> = new ObservableValue<string[]>();
  private _alphabet: ObservableValue<string> = new ObservableValue<string>();
  private _isDarkTheme: ObservableValue<boolean> = new ObservableValue<boolean>();

  constructor() {
    this.load();
    this._defaultUsername.value = "Erik";
    this._usernames.value = [this._defaultUsername.value, "Test"];
  } //TODO: make this better

  public save(): void {
    localStorage.setItem(SettingsService.STORAGE_KEY, this.toJSON());
  }

  public load(): void {
    this.restoreJSON(localStorage.getItem(SettingsService.STORAGE_KEY));
  }

  public toJSON(): string {
    const pureObject: ISettings = {
      alphabet: this.alphabet.value,
      passwordLength: this.passwordLength.value,
      defaultUsername: this.defaultUsername.value,
      usernames: this.usernames.value,
      isDarkTheme: this.isDarkTheme.value
    };
    return JSON.stringify(pureObject);
  }

  public restoreJSON(json: string): void {
    const loaded: ISettings = JSON.parse(json);
    if(loaded == null) {
      this.setDefault();
    } else {
      this.passwordLengthValue = loaded.passwordLength;
      this.alphabetValue = loaded.alphabet;
      this.defaultUsernameValue = loaded.defaultUsername;
      this.usernamesValue = loaded.usernames;
      this.isDarkThemeValue = loaded.isDarkTheme;
    }
    this.save();
  }

  public setDefault(): void {
    this._passwordLength.value = SettingsService.DEFAULT_PASSWORD_LENGTH;
    this._alphabet.value = SettingsService.DEFAULT_ALPHABET;
    this._defaultUsername.value = null;
    this._usernames.value = [];
    this._isDarkTheme.value = false;
  }

  get alphabet(): ObservableValue<string> {
    return this._alphabet;
  }

  set alphabetValue(value: string) {
    this._alphabet.value = value;
  }


  get passwordLength(): ObservableValue<number> {
    return this._passwordLength;
  }

  set passwordLengthValue(value: number) {
    this._passwordLength.value = value;
  }


  get usernames(): ObservableValue<string[]> {
    return this._usernames;
  }

  set usernamesValue(value: string[]) {
    this._usernames.value = value;
  }

  get defaultUsername(): ObservableValue<string> {
    return this._defaultUsername;
  }

  set defaultUsernameValue(value: string) {
    this._defaultUsername.value = value;
  }

  get isDarkTheme(): ObservableValue<boolean> {
    return this._isDarkTheme;
  }

  set isDarkThemeValue(value: boolean) {
    this._isDarkTheme.value = value;
    if(value) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

  }
}
