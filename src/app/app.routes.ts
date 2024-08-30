import { Routes } from '@angular/router';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './auth/page-not-found/page-not-found.component';
import { authGuard } from './guards/auth.guard';
import { CreateStageComponent } from './stages/create-stage/create-stage.component';
import { DetailStageComponent } from './stages/detail-stage/detail-stage.component';
import { InscrirStageComponent } from './stages/inscrir-stage/inscrir-stage.component';
import { ListStageComponent } from './stages/list-stage/list-stage.component';
import { CreateStagiaireComponent } from './stagiaire/create-stagiaire/create-stagiaire.component';
import { DeleteStagiaireComponent } from './stagiaire/delete-stagiaire/delete-stagiaire.component';
import { StagiaireDetailComponent } from './stagiaire/detail-stagiaire/detail-stagiaire.component';
import { ListStagiaireComponent } from './stagiaire/list-stagiaire/list-stagiaire.component';
import { StagiaireDashboardComponent } from './dashboard/stagiaire-dashboard/stagiaire-dashboard.component';
import { ProjectDashboardComponent } from './dashboard/project-dashboard/project-dashboard.component';
import { CreateProjectComponent } from './projects/create-project/create-project.component';
import { ProjectsListComponent } from './projects/projects-list/projects-list.component';
import { ProjectsAffectComponent } from './projects/projects-affect/projects-affect.component';
import { ProjectsDetailComponent } from './projects/projects-detail/projects-detail.component';
import { HomeComponent } from './home/home.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { CardStagiaireComponent } from './stagiaire/card-stagiaire/card-stagiaire.component';
import { CardStageComponent } from './stages/card-stage/card-stage.component';
import { CardProjectComponent } from './projects/card-project/card-project.component';


export const routes: Routes = [
                {path:'card-stage/:id', component: CardStageComponent,canActivate: [authGuard] },
                {path:'card-project/:id', component: CardProjectComponent,canActivate: [authGuard] },
                {path:'card-stagiaire/:id', component: CardStagiaireComponent,canActivate: [authGuard] },
                {path:'feedback', component: FeedbackComponent,canActivate: [authGuard] },
                {path:'dashboard-projects', component: ProjectDashboardComponent,canActivate: [authGuard] },
                {path:'projects-detail/:id', component: ProjectsDetailComponent,canActivate: [authGuard] },
                {path:'projects-affect', component: ProjectsAffectComponent,canActivate: [authGuard] },
                {path:'projects-list', component: ProjectsListComponent,canActivate: [authGuard] },
                {path:'create-project', component: CreateProjectComponent,canActivate: [authGuard] },
                {path:'dashboard-project', component: ProjectDashboardComponent,canActivate: [authGuard] },
                {path:'dashboard-stagiaire', component: StagiaireDashboardComponent,canActivate: [authGuard] },
                {path:'inscrir-stage/:id', component: InscrirStageComponent,canActivate: [authGuard] },
                {path:'detail-stage/:id', component: DetailStageComponent,canActivate: [authGuard] },
                {path:'add-stage', component: CreateStageComponent,canActivate: [authGuard] },
                {path: 'delete-stagiaire/:id', component: DeleteStagiaireComponent ,canActivate: [authGuard] },
                {path:'detail-stagiaire/:id', component: StagiaireDetailComponent,canActivate: [authGuard] },
                {path:'add-stagiaire', component: CreateStagiaireComponent,canActivate: [authGuard] },
                {path:'stages', component: ListStageComponent,canActivate: [authGuard] },
                {path:'stagiaire', component: ListStagiaireComponent,canActivate: [authGuard] },
                {path:'home', component:HomeComponent,canActivate: [authGuard] },
                {path:'inscription', component: InscriptionComponent },
                {path:'login', component: LoginComponent},
                {path:'', redirectTo: 'login', pathMatch: 'full'},
                {path:'page-not-found', component: PageNotFoundComponent},
                {path:'**', component: PageNotFoundComponent},
];
