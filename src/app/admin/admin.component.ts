import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../manager.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
    permission: boolean;
    constructor(
        private managerService: ManagerService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(async (parameter) => {
            const id = parameter['id'];
            if (id) {
                this.permission = await this.managerService.checkPermission(id);
                if (this.permission) {
                    this.router.navigate(['/calendar']);
                }
            }
        });
    }
}
