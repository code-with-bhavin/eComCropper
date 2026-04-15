import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { ToolPageComponent } from './pages/tool/tool-page.component';
import { AboutPageComponent } from './pages/about/about-page.component';
import { PrivacyPageComponent } from './pages/privacy/privacy-page.component';
import { ContactPageComponent } from './pages/contact/contact-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'ECom Cropper | Home' },
  { path: 'tool', redirectTo: 'crop/meesho', pathMatch: 'full' },
  {
    path: 'crop/meesho',
    component: ToolPageComponent,
    title: 'ECom Cropper | Meesho Crop Tool',
    data: { platform: 'meesho' }
  },
  {
    path: 'crop/flipkart',
    component: ToolPageComponent,
    title: 'ECom Cropper | Flipkart Crop Tool',
    data: { platform: 'flipkart' }
  },
  {
    path: 'crop/amazon',
    component: ToolPageComponent,
    title: 'ECom Cropper | Amazon Crop Tool',
    data: { platform: 'amazon' }
  },
  { path: 'about', component: AboutPageComponent, title: 'ECom Cropper | About' },
  { path: 'privacy', component: PrivacyPageComponent, title: 'ECom Cropper | Privacy Policy' },
  { path: 'contact', component: ContactPageComponent, title: 'ECom Cropper | Contact' },
  { path: '**', redirectTo: '' }
];
