import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [
    `
      .nav {
        background: #ffffff;
        border-bottom: 1px solid #e5e5e5;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .nav-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 62px;
        gap: 1rem;
      }

      .brand {
        text-decoration: none;
        font-size: 1.05rem;
        font-weight: 700;
        color: #111;
      }

      .links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }

      .links a {
        text-decoration: none;
        padding: 0.4rem 0.65rem;
        border-radius: 6px;
        color: #444;
        font-size: 0.92rem;
      }

      .links a.active {
        background: #ecfdf5;
        color: #047857;
        font-weight: 600;
      }

      @media (max-width: 700px) {
        .nav-inner {
          flex-direction: column;
          justify-content: center;
          padding: 0.65rem 0;
        }
      }
    `
  ],
  template: `
    <header class="nav">
      <div class="container nav-inner">
        <a class="brand" routerLink="/">eCropper Clone</a>
        <nav class="links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/tool" routerLinkActive="active">Crop Tool</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/privacy" routerLinkActive="active">Privacy</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </nav>
      </div>
    </header>
  `
})
export class NavbarComponent {}
