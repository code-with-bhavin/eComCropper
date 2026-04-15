import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container" style="padding-top:2rem;">
      <div class="card" style="padding:2rem;display:grid;gap:1rem;">
        <h1 class="section-title">Instant E-commerce Label Cropper</h1>
        <p class="section-subtitle">
          Upload your PDF labels, pick marketplace format (Meesho, Flipkart, Amazon), and instantly download 4x6 ready labels.
        </p>
        <div>
          <a class="btn btn-primary" routerLink="/tool">Open Tool</a>
        </div>
      </div>
    </section>

    <section class="container" id="how-to-use">
      <div class="card" style="padding:1.5rem; margin-top:1rem;">
        <h2 class="section-title">How to use</h2>
        <ol class="section-subtitle">
          <li>Open the tool page.</li>
          <li>Drag and drop your PDF shipping labels.</li>
          <li>Select marketplace tab and click process.</li>
          <li>Download the cropped PDF instantly.</li>
        </ol>
      </div>
    </section>

    <section class="container" id="benefits">
      <div class="card" style="padding:1.5rem; margin-top:1rem;">
        <h2 class="section-title">Benefits</h2>
        <ul class="section-subtitle">
          <li>No signup required.</li>
          <li>Fast, browser-driven workflow.</li>
          <li>Optimized for label printing and AdSense-friendly public content.</li>
        </ul>
      </div>
    </section>
  `
})
export class HomePageComponent {}
