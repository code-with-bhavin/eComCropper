import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="container page-wrap">
      <div class="card" style="display:grid;gap:0.9rem;">
        <h1 class="section-title">Fast PDF Label Cropper</h1>
        <p class="section-subtitle">
          Tamara shipping label PDFs ne simple rite upload karo, platform select karo ane instantly cropped 4x6 PDF download karo.
        </p>
        <div>
          <a class="btn btn-primary" routerLink="/tool">Start Cropping</a>
        </div>
      </div>

      <div class="card" style="margin-top:1rem;">
        <h2 class="section-title" style="font-size:1.2rem;">How it works</h2>
        <ol class="section-subtitle" style="padding-left:1.2rem;">
          <li>Tool page open karo.</li>
          <li>PDF choose karo (drag/drop pan chale).</li>
          <li>Marketplace select kari ne process button dabavo.</li>
          <li>Ready PDF download karo ane direct print karo.</li>
        </ol>
      </div>

      <div class="card" style="margin-top:1rem;">
        <h2 class="section-title" style="font-size:1.2rem;">Why this UI?</h2>
        <ul class="section-subtitle" style="padding-left:1.2rem;">
          <li>Clean, distraction-free layout</li>
          <li>One-page action flow</li>
          <li>Mobile-friendly simple controls</li>
        </ul>
      </div>
    </section>
  `
})
export class HomePageComponent {}
