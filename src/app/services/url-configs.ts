import { environment } from '../../environments/environment';

export class UrlConfig {
    private static readonly SERVICE_PREFIX = environment.apiUrl;

    static readonly WORKSPACE_ROOT_URL = `${UrlConfig.SERVICE_PREFIX}/workspaces`;
    // static readonly CRITERE_EVALUATION_ROOT_URL = `${UrlConfig.SERVICE_PREFIX}/critere-evaluation`;
    // static readonly DEPARTEMENT_ROOT_URL = `${UrlConfig.SERVICE_PREFIX}/departement`;
    // static readonly CATEGORIE_FICHIER_ROOT_URL = `${UrlConfig.SERVICE_PREFIX}/categorie/fichier`;
    // static readonly PRESTATAIRE_ROOT_URL = `${UrlConfig.SERVICE_PREFIX}/prestataire`;
}