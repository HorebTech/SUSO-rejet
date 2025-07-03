import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Output() fileUploaded = new EventEmitter<any>();

  uploadedFiles: {
    file: File;
    extension: string;
    name: string;
    size: string;
    loading: boolean;
    icon: string;
  }[] = [];

  allowedExts = ['xlsx']; // ✅ Seulement Excel

  constructor(private messageService: MessageService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const file = input.files[0]; // ✅ un seul fichier
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!this.allowedExts.includes(ext)) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erreur', 
        detail: 'Seuls les fichiers Excel (.xlsx) sont autorisés.', 
        life: 8000 
      });
      input.value = ''; // Reset
      return;
    }

    // Si déjà un fichier, le remplacer
    this.uploadedFiles = [];

    const fileObj = {
      file,
      extension: ext,
      name: file.name,
      size: this.formatBytes(file.size),
      loading: true,
      icon: this.getFileIcon(ext)
    };

    this.uploadedFiles.push(fileObj);

    // Simuler le chargement
    setTimeout(() => {
      fileObj.loading = false;
      this.fileUploaded.emit(this.uploadedFiles); // Émettre fichier au parent
    }, 1000);

    input.value = ''; // Reset input
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.fileUploaded.emit(this.uploadedFiles); // Mise à jour
  }

  getFileIcon(extension: string): string {
    const icons: { [key: string]: string } = {
      xlsx: 'assets/images/xls-file.png'
    };
    return icons[extension] || 'assets/images/unknown-file.png';
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
