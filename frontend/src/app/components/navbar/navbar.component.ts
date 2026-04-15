import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [
    `
      .nav {
        position: sticky;
        top: 0;
        z-index: 10;
        background: #fff;
        border-bottom: 1px solid #d9e2ec;
      }

      .nav-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
      }

      .brand {
        font-weight: 700;
        color: #0d243d;
        text-decoration: none;
      }

      .links {
        display: flex;
        gap: 0.8rem;
      }

      .links a {
        text-decoration: none;
        color: #334e68;
        padding: 0.4rem 0.7rem;
        border-radius: 8px;
      }

      .links a.active {
        background: #ebf2ff;
        color: #1f4fd4;
      }
    `
  ],
  template: `
    <header class="nav">
      <div class="container nav-inner">
        <a class="brand" routerLink="/">ECom Cropper</a>
        <nav class="links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/tool" routerLinkActive="active">Tool</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/privacy" routerLinkActive="active">Privacy</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
        </nav>
      </div>
    </header>
  `
})
export class NavbarComponent {}
