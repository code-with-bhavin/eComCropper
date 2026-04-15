import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  styles: [
    `
      .hero {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 1.25rem;
      }

      .hero-card {
        padding: 1.6rem;
        border-radius: 28px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background:
          radial-gradient(circle at top left, rgba(15, 108, 189, 0.14), transparent 32%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(244, 247, 251, 0.94));
        box-shadow: 0 30px 80px rgba(15, 23, 42, 0.08);
      }

      .eyebrow {
        display: inline-flex;
        padding: 0.34rem 0.72rem;
        border-radius: 999px;
        background: #d9ecff;
        color: #0b4f8a;
        font-size: 0.82rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .route-grid,
      .steps {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
      }

      .route-card,
      .step-card {
        padding: 1.15rem;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(15, 23, 42, 0.08);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
      }

      .route-card h3 {
        margin: 0;
        font-size: 1.08rem;
        color: #102a43;
      }

      .route-card p,
      .step-card p {
        margin: 0.55rem 0 0;
        color: #52606d;
        line-height: 1.6;
      }

      .step-no {
        display: inline-grid;
        place-items: center;
        width: 2rem;
        height: 2rem;
        border-radius: 999px;
        background: #0f6cbd;
        color: #fff;
        font-weight: 800;
      }

      @media (max-width: 900px) {
        .hero,
        .route-grid,
        .steps {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  template: `
    <section class="container page-wrap">
      <div class="hero">
        <div class="hero-card">
          <span class="eyebrow">Marketplace Crop Studio</span>
          <h1 class="section-title" style="font-size:2.65rem;line-height:1.04;margin-top:1rem;">Dedicated crop pages instead of one generic tool.</h1>
          <p class="section-subtitle" style="font-size:1.04rem;max-width:54ch;">
            Meesho, Flipkart ane Amazon mate separate route-based pages che, etle flow vadhu focused lage che ane pachi darek marketplace mate crop logic ane UI independently tune kari shakay.
          </p>
          <div style="display:flex;gap:0.8rem;flex-wrap:wrap;margin-top:1.15rem;">
            <a class="btn btn-primary" routerLink="/crop/meesho">Open Meesho</a>
            <a class="btn" routerLink="/crop/flipkart">Open Flipkart</a>
            <a class="btn" routerLink="/crop/amazon">Open Amazon</a>
          </div>
        </div>

        <div class="hero-card">
          <div class="card" style="border:none;box-shadow:none;background:#0f172a;color:#f8fafc;">
            <div style="font-size:0.86rem;opacity:0.76;">Route Pattern</div>
            <div style="margin-top:0.4rem;font-size:1.75rem;font-weight:800;">/crop/:marketplace</div>
            <div style="margin-top:0.65rem;color:#cbd5e1;line-height:1.6;">
              Cleaner UI, direct links, and future marketplace-specific crop presets without cluttering one shared page.
            </div>
          </div>
          <div style="margin-top:1rem;display:grid;gap:0.75rem;">
            <div class="card" style="border:none;box-shadow:none;background:#fff;">Meesho route: <strong>/crop/meesho</strong></div>
            <div class="card" style="border:none;box-shadow:none;background:#fff;">Flipkart route: <strong>/crop/flipkart</strong></div>
            <div class="card" style="border:none;box-shadow:none;background:#fff;">Amazon route: <strong>/crop/amazon</strong></div>
          </div>
        </div>
      </div>

      <div class="route-grid" style="margin-top:1rem;">
        <div class="route-card">
          <h3>Meesho Crop Page</h3>
          <p>Invoice-aware Meesho flow with dedicated route and label-prep copy.</p>
          <div style="margin-top:0.9rem;"><a class="btn btn-primary" routerLink="/crop/meesho">Go to Meesho</a></div>
        </div>
        <div class="route-card">
          <h3>Flipkart Crop Page</h3>
          <p>Separate page so Flipkart crop rules and messaging can evolve independently.</p>
          <div style="margin-top:0.9rem;"><a class="btn btn-primary" routerLink="/crop/flipkart">Go to Flipkart</a></div>
        </div>
        <div class="route-card">
          <h3>Amazon Crop Page</h3>
          <p>Independent Amazon workflow, ready for future marketplace-specific tuning.</p>
          <div style="margin-top:0.9rem;"><a class="btn btn-primary" routerLink="/crop/amazon">Go to Amazon</a></div>
        </div>
      </div>

      <div class="card" style="margin-top:1rem;padding:1.35rem;border-radius:24px;">
        <h2 class="section-title" style="font-size:1.28rem;">How the new flow works</h2>
        <div class="steps" style="margin-top:1rem;">
          <div class="step-card">
            <span class="step-no">1</span>
            <p>Correct marketplace page par direct land karo.</p>
          </div>
          <div class="step-card">
            <span class="step-no">2</span>
            <p>PDF upload karo ane invoice separate page joiye che ke nai e choose karo.</p>
          </div>
          <div class="step-card">
            <span class="step-no">3</span>
            <p>Processed output download karo with cleaner route-specific UX.</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomePageComponent {}
