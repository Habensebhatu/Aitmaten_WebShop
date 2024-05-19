import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl:'./about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
log = "logaitmatenf.jpeg"
 

constructor( private route: ActivatedRoute, 
  private router: Router){
  
}
ngOnInit() {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        const element = document.querySelector('#' + fragment);
        if (element) element.scrollIntoView();
      }
    }
  });
}
}
