import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import 'chartjs-adapter-date-fns';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserAnimationsModule) ,
    provideHttpClient(withFetch()),
    importProvidersFrom(ToastrModule.forRoot()),
    importProvidersFrom(FlexLayoutServerModule), ]
};