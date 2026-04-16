import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdSlotComponent } from './components/adsense/ad-slot.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, AdSlotComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="container">
      <div class="grid gap-4 xl:grid-cols-[160px_1fr_160px]">
        <aside class="hidden xl:block">
          <div class="sticky top-[88px] space-y-3">
            <app-ad-slot [slot]="ads.slots.leftRail" width="160px" height="600px"></app-ad-slot>
          </div>
        </aside>

        <div>
          <router-outlet></router-outlet>

          <!-- Mobile/tablet in-content ad slot -->
          <div class="mt-6 xl:hidden">
            <app-ad-slot
              [slot]="ads.slots.inContent"
              width="100%"
              height="280px"
              format="auto"
              [fullWidthResponsive]="true"
            ></app-ad-slot>
          </div>
        </div>

        <aside class="hidden xl:block">
          <div class="sticky top-[88px] space-y-3">
            <app-ad-slot [slot]="ads.slots.rightRail" width="160px" height="600px"></app-ad-slot>
          </div>
        </aside>
      </div>
    </main>
    <app-footer></app-footer>
  `
})
export class AppComponent {
  readonly ads = environment.adsense;
}
