import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeVisualizadorComponent } from './pages/home-visualizador/home-visualizador.component';
import { RecoverAccessComponent } from './pages/recover-access/recover-access.component';
import { AuthGuard } from 'src/service/auth.guard';
import { LoginGuard } from 'src/service/login.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'recover', component: RecoverAccessComponent, canActivate: [LoginGuard] },
  { path: 'home', component: HomeVisualizadorComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
