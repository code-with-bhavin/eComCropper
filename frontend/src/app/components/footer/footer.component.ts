import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer style="margin-top:2.5rem;border-top:1px solid #e5e5e5;background:#fff;">
      <div class="container" style="padding:1rem 0;font-size:0.88rem;color:#666;">
        © {{ year }} eCropper Clone · Simple PDF Label Crop Utility
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
