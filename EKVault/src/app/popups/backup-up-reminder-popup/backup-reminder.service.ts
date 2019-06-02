import { Injectable } from '@angular/core';
import {SettingsService} from "../../settings/settings.service";
import {ImportExportService} from "../../import-export/import-export.service";
import {BackUpReminderPopUpService} from "./back-up-reminder-pop-up.service";

@Injectable({
  providedIn: 'root'
})
export class BackupReminderService {

  private static readonly LAST_REMINDER_KEY = 'lastBackupReminder';
  public static readonly DAYS_TO_MILLIS = 86400000;

  constructor(private readonly settings: SettingsService,
              private readonly exportService: ImportExportService,
              private readonly backupReminderPopup: BackUpReminderPopUpService) {
  }

  private needsReminder(): boolean {
    console.log('needs reminder');
    if(this.settings.remindBackUpTime.value == -1) {
      console.log('never backup');
      return false;
    }
    console.log('check localstorage');
    console.log('ls value: ', new Date(localStorage.getItem(BackupReminderService.LAST_REMINDER_KEY)).getTime());
    console.log('last backup: ', this.settings.remindBackUpTime.value * BackupReminderService.DAYS_TO_MILLIS);
    const reminderDate = new Date(localStorage.getItem(BackupReminderService.LAST_REMINDER_KEY)).getTime() + this.settings.remindBackUpTime.value * BackupReminderService.DAYS_TO_MILLIS;
    console.log(new Date().getTime() > reminderDate);
    return new Date().getTime() > reminderDate;
  }

  private static setLastReminderToNow(): void {
    localStorage.setItem(BackupReminderService.LAST_REMINDER_KEY, new Date().toISOString());
  }

  private doAutobackup(): boolean {
    return this.settings.doAutoBackUp.value;
  }

  private makeBackup(): void {
    // Force to always backup passwords if things are backed up automaticly
    this.exportService.exportPasswords();
    if(this.settings.doBackupSettings) {
      this.exportService.exportSettings();
    }
  }

  private doBackupOrReminder(): void {
    if (this.doAutobackup()) {
      this.makeBackup();
    } else {
      this.backupReminderPopup.openBackupReminder();
    }
    BackupReminderService.setLastReminderToNow();
  }

  public tryBackUpOrReminder(): void {
    console.log('try');
    if(this.needsReminder()) {
      console.log('in if');
      this.doBackupOrReminder();
    }
  }
}
