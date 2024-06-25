import { Component, OnInit } from '@angular/core';
import { NetworkService } from './network.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'halo_vita';
  isOnline: boolean = true;

  constructor(private networkService: NetworkService) {}

  ngOnInit() {
    this.networkService.isOnline.subscribe((onlineStatus: boolean) => {
      this.isOnline = onlineStatus;
    });
  }
}
