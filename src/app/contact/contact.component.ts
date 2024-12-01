import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  sendEmail() {
    window.location.href = "mailto:ahmedtariq1591@gmail.com";
  }
}
