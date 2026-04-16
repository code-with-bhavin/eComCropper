import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-10 border-b border-slate-900/10 bg-white/75 backdrop-blur-xl">
      <div class="container">
        <div class="flex min-h-[64px] flex-col items-start justify-center gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:py-0">
          <a
            class="inline-flex items-center gap-2 font-extrabold tracking-tight text-slate-900"
            routerLink="/"
            aria-label="eComCropper home"
          >
            <span class="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md">
              EC
            </span>
            <span class="text-base">eComCropper</span>
          </a>

          <nav class="flex flex-wrap gap-2">
            <a
              class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              routerLink="/"
              routerLinkActive="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
              [routerLinkActiveOptions]="{ exact: true }"
              >Home</a
            >
            <a
              class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              routerLink="/crop/meesho"
              routerLinkActive="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
              >Meesho</a
            >
            <a
              class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              routerLink="/crop/flipkart"
              routerLinkActive="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
              >Flipkart</a
            >
            <a
              class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              routerLink="/crop/amazon"
              routerLinkActive="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
              >Amazon</a
            >
            <a
              class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              routerLink="/about"
              routerLinkActive="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
              >About</a
            >
            <a
              class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              routerLink="/privacy"
              routerLinkActive="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
              >Privacy</a
            >
            <a
              class="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              routerLink="/contact"
              routerLinkActive="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md"
              >Raise Request</a
            >
          </nav>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {}
