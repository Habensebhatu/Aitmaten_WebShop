import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  // log = 'footer-logo.png';
  log = "logeaitmaten.png";
  dayClasses: { [key: string]: boolean } = {};

  constructor(private router: Router) {
    const currentDay = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam', weekday: 'long' }).toLowerCase();
    this.dayClasses = {
      maandag: currentDay === 'maandag',
      dinsdag: currentDay === 'dinsdag',
      woensdag: currentDay === 'woensdag',
      donderdag: currentDay === 'donderdag',
      vrijdag: currentDay === 'vrijdag',
      zaterdag: currentDay === 'zaterdag',
      zondag: currentDay === 'zondag'
    };
   
  }
  
  onFooterLinkClick(fragment: string): void {
    this.router.navigate(['/home'], { fragment: fragment }).then(() => {
      // Delay the scroll action to ensure the page has rendered
      setTimeout(() => {
        const element = document.querySelector("#" + fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // A delay of 100ms. Adjust if necessary.
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/Register']);
  }
  
  navigateToAboutUs(): void {
    this.router.navigate(['/aboutUs']).then(() => {
      window.scrollTo(0, 0);
    });
  }
  
  navigateToCantacUS(): void{
    this.router.navigate(['/contactUs']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  navigateToHeadOfHome(): void{
    this.router.navigate(['/home']).then(() => {
      window.scrollTo(0, 0);
    });
  }
  

 
}
