import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'mdn-polyfills/Object.assign';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    signIn: any = 'hello';
    title = 'App 567';
    constructor(private router: Router) { }


    gotoLogin(): void {
        const link = ['/login'];
        this.router.navigate(link);
    }

}
