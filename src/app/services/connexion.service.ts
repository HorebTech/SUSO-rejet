import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { saveAs } from 'file-saver';
import { RejectResponse } from '../models/response';

@Injectable({ providedIn: 'root' })
export class ConnexionService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

    getWorkspaces(credentials: { username: string; password: string, api_url: string }): Observable<any> {
        return this.http.post(`${this.API_URL}/workspaces`, credentials);
    }
    getStats(credentials: { username: string; password: string, api_url: string, workspace: string }): Observable<any> {
        return this.http.post(`${this.API_URL}/interview_stats`, credentials);
    }
    getQuestionnaires(credentials: { username: string; password: string, api_url: string, workspace: string }): Observable<any> {
        return this.http.post(`${this.API_URL}/questionnaires`, credentials);
    }

    downloadQuestionnaire(downloadData: any) {
        const headers = new HttpHeaders({
        'Content-Type': 'application/json'
        });

        return this.http.post(`${this.API_URL}/download`, 
        JSON.stringify(downloadData),
        {
            headers: headers,
            responseType: 'blob'  // <-- important pour recevoir un fichier binaire
        }
        );
    }

    uploadExcel(formData: FormData): Observable<RejectResponse> {
        return this.http.post<RejectResponse>(`${this.API_URL}/reject_and_comment`, formData);
    }
    
}

