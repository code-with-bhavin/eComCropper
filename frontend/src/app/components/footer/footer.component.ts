import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="mt-12 border-t border-slate-900/10 bg-white/70 backdrop-blur-xl">
      <div class="container py-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-2 font-extrabold tracking-tight text-slate-900">
            <span class="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md">
              EC
            </span>
            <span>eComCropper</span>
          </div>

          <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-600">
            <a class="hover:text-slate-900" routerLink="/crop/flipkart">Flipkart</a>
            <a class="hover:text-slate-900" routerLink="/crop/meesho">Meesho</a>
            <a class="hover:text-slate-900" routerLink="/crop/amazon">Amazon</a>
            <a class="hover:text-slate-900" routerLink="/about">About</a>
            <a class="hover:text-slate-900" routerLink="/privacy">Privacy</a>
            <a class="hover:text-slate-900" routerLink="/contact">Raise Request</a>
          </div>
        </div>

        <div class="mt-4 text-sm text-slate-500">
          © {{ year }} eComCropper · Crop shipping labels fast · No login
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
