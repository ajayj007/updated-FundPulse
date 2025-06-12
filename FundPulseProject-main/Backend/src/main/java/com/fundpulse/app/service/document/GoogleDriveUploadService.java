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

    public String uploadFile(MultipartFile file, String folderId) throws IOException {
        // Get Drive instance
        Drive drive = documentUploadConfig.getDriveInstance();

        // Convert MultipartFile to a temporary file
        java.io.File tempFile = java.io.File.createTempFile("upload-", ".pdf");
        Files.copy(file.getInputStream(), tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

        // Set file metadata and assign it to a specific folder
        File fileMetadata = new File();
        fileMetadata.setName(file.getOriginalFilename());
        fileMetadata.setMimeType("application/pdf");

        // Assign file to a specific folder
        if (folderId != null && !folderId.isEmpty()) {
            fileMetadata.setParents(Collections.singletonList(folderId));
        }

        // Upload the file to Google Drive inside the specified folder
        File uploadedFile = drive.files()
                .create(fileMetadata, new com.google.api.client.http.FileContent("application/pdf", tempFile))
                .setFields("id, webViewLink")
                .execute();

        // Make the file publicly accessible (Optional)
        Permission permission = new Permission()
                .setType("anyone")
                .setRole("reader");
        drive.permissions().create(uploadedFile.getId(), permission).execute();

        // Return the sharable link
        return uploadedFile.getWebViewLink();
    }
}
