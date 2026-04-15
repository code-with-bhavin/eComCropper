import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer style="margin-top:3rem;border-top:1px solid #d9e2ec;background:#fff;">
      <div class="container" style="padding:1.2rem;color:#486581;font-size:0.9rem;">
        © {{ year }} ECom Cropper · Seller tools for quick shipping label formatting.
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
