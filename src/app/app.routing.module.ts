import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
// import { AdminusersComponent } from './home/dashboard/adminusers/adminusers.component';
// import { CreatenewclaimComponent } from './home/dashboard/createnewclaim/createnewclaim.component';

const routes: Routes = [
    // { path: '', redirectTo: '/LoginComponent', pathMatch: 'full' },
    // // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    // { path: 'dashboard', component: HomeComponent,
    //     children: [
    //         { path: '', component: DashboardComponent, pathMatch: 'full' },
    //         { path: 'Createnewclaim', component: CreatenewclaimComponent },
    //         { path: 'Createnewclaim/:id', component: CreatenewclaimComponent },
    //         { path: 'adminUsers', component: AdminusersComponent }
    //     ]
    // },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}

