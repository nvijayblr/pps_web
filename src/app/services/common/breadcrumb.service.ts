import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MenuItem } from 'primeng/primeng';

@Injectable()
export class BreadcrumbService {
    public breadcrumbItem: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);
    private itemBreadcrums: MenuItem[];

    constructor() {
    }

    setBreadcrumbs(page: string) {
        this.itemBreadcrums = [];
        let refList: MenuItem[] = this.getBreadcrumsLink(page);
        this.breadcrumbItem.next(refList);
    }

    private getBreadcrumsLink(page: string): MenuItem[] {
        this.itemBreadcrums = [];

        switch (page) {
            case 'dashboard':
                this.itemBreadcrums.push({ label: 'Dashboard' });
                break;
            case 'adminUsers':
                this.itemBreadcrums.push({ label: 'Dashboard', routerLink: ['dashboard'] });
                this.itemBreadcrums.push({ label: 'Admin Users' });
                break;
            case 'customers':
                this.itemBreadcrums.push({ label: 'Dashboard', routerLink: ['dashboard'] });
                this.itemBreadcrums.push({ label: 'Customers' });
                break;
            case 'clients':
                this.itemBreadcrums.push({ label: 'Dashboard', routerLink: ['dashboard'] });
                this.itemBreadcrums.push({ label: 'Clients' });
                break;
            case 'customerUsers':
                this.itemBreadcrums.push({ label: 'Dashboard', routerLink: ['dashboard'] });
                this.itemBreadcrums.push({ label: 'Customer Users' });
                break;
            case 'workflow':
                this.itemBreadcrums.push({ label: 'Dashboard', routerLink: ['dashboard'] });
                this.itemBreadcrums.push({ label: 'Workflow' });
                break;
            case 'projects':
                this.itemBreadcrums.push({ label: 'Dashboard', routerLink: ['dashboard'] });
                this.itemBreadcrums.push({ label: 'Projects' });
                break;
            case 'DataSources':
                this.itemBreadcrums.push({ label: 'Dashboard', routerLink: ['dashboard'] });
                this.itemBreadcrums.push({ label: 'DataSources' });
                break;
            case 'Destinations':
                this.itemBreadcrums.push({ label: 'Dashboard', routerLink: ['dashboard'] });
                this.itemBreadcrums.push({ label: 'Destinations' });
                break;
            default:
                this.itemBreadcrums = [];
        }
        return this.itemBreadcrums;
    }
}