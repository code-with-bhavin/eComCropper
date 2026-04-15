import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer style="margin-top:3rem;border-top:1px solid rgba(15,23,42,0.08);background:rgba(255,255,255,0.72);backdrop-filter:blur(12px);">
      <div class="container" style="padding:1.2rem 0;font-size:0.9rem;color:#52606d;">
        © {{ year }} eComCropper · Marketplace label crop workspace
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
