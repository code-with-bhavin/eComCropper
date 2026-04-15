import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="container" style="padding-top:2rem;">
      <div class="card" style="padding:1.5rem;">
        <h1 class="section-title">Privacy Policy</h1>
        <p class="section-subtitle">
          We do not store user PDFs permanently. Uploaded files are processed in memory and returned instantly. No user account is required.
        </p>
      </div>
    </section>
  `
})
export class PrivacyPageComponent {}
