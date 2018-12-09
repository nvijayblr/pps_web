import { Component, OnInit } from '@angular/core';
// import {MdDialog, MdDialogRef} from '@angular/material';
import { Languageconstant } from '../../utill/constants/languageconstant';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  public title;
  public dialogMessage;
  public dialogLocalization = {
        yesBtnLabel: '',
        noBtnLabel: '',
        }
   constructor(
    private languageconstant: Languageconstant,
     // public dialogRef: MdDialogRef<DialogComponent>
    ) {}

  ngOnInit() {

    this.title = 'Confirmation';
    this.dialogMessage = 'You modified current item, do you want to save ?';
    this.setLanguageConstants();
  }
  setLanguageConstants(): void {
        const lang = this.languageconstant.Language;

        this.dialogLocalization = {
            yesBtnLabel: this.languageconstant.dialog[lang].yesBtnLabel,
            noBtnLabel: this.languageconstant.dialog[lang].noBtnLabel,
            }
        }
            
  setMessage(msg): void {
    this.dialogMessage = msg;
  }

}
