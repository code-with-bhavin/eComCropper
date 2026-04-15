import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [
    `
      .nav {
        background: rgba(255, 255, 255, 0.82);
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(16px);
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
        font-size: 1.1rem;
        font-weight: 800;
        color: #102a43;
        letter-spacing: 0.02em;
      }

      .links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }

      .links a {
        text-decoration: none;
        padding: 0.48rem 0.82rem;
        border-radius: 999px;
        color: #52606d;
        font-size: 0.92rem;
        transition: background 0.2s ease, color 0.2s ease;
      }

      .links a:hover {
        background: #f0f4f8;
        color: #102a43;
      }

      .links a.active {
        background: linear-gradient(135deg, #0f6cbd, #0b4f8a);
        color: #fff;
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
        <a class="brand" routerLink="/">eComCropper</a>
        <nav class="links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/crop/meesho" routerLinkActive="active">Meesho</a>
          <a routerLink="/crop/flipkart" routerLinkActive="active">Flipkart</a>
          <a routerLink="/crop/amazon" routerLinkActive="active">Amazon</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/privacy" routerLinkActive="active">Privacy</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </nav>
      </div>
    </header>
  `
})
export class NavbarComponent {}
