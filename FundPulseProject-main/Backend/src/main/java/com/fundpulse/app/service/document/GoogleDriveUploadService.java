package com.fundpulse.app.service.document;

import com.fundpulse.app.config.DocumentUploadConfig;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Collections;

@Service
public class GoogleDriveUploadService {

    @Autowired
    private DocumentUploadConfig documentUploadConfig; // Your Drive config
    public String uploadFile(MultipartFile file, String folderId) {
        java.io.File tempFile = null;

        try {
            // Create temp file with original extension
            String originalName = file.getOriginalFilename();
            String extension = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : ".pdf"; // fallback
            tempFile = java.io.File.createTempFile("upload-", extension);

            // Transfer multipart content into temp file
            file.transferTo(tempFile);

            // Get Google Drive instance
            Drive drive = documentUploadConfig.getDriveInstance();

            // Set file metadata
            File fileMetadata = new File();
            fileMetadata.setName(originalName);
            fileMetadata.setMimeType("application/pdf");

            if (folderId != null && !folderId.isEmpty()) {
                fileMetadata.setParents(Collections.singletonList(folderId));
            }

            // Upload to Google Drive
            File uploadedFile = drive.files()
                    .create(fileMetadata, new com.google.api.client.http.FileContent("application/pdf", tempFile))
                    .setFields("id, webViewLink")
                    .execute();

            // Make file public
            Permission permission = new Permission()
                    .setType("anyone")
                    .setRole("reader");
            drive.permissions().create(uploadedFile.getId(), permission).execute();

            return uploadedFile.getWebViewLink();

        } catch (Exception e) {
            System.err.println("Google Drive upload failed: " + e.getMessage());
            e.printStackTrace();
            return null;
        } finally {
            // Clean up temporary file
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

}
