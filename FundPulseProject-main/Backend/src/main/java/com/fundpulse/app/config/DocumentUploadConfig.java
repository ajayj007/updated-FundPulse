package com.fundpulse.app.config;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Collections;

@Service
public class DocumentUploadConfig {

    private static final String APPLICATION_NAME = "FundPulseApp";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Value("${gcp.credentials.base64}")
    private String credentialsBase64;

    public Drive getDriveInstance() throws IOException {
        HttpTransport httpTransport = new NetHttpTransport();

        // Decode base64 string into InputStream
        byte[] decodedBytes = Base64.getDecoder().decode(credentialsBase64);
        ByteArrayInputStream credentialsStream = new ByteArrayInputStream(decodedBytes);

        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream)
                .createScoped(Collections.singleton(DriveScopes.DRIVE));

        return new Drive.Builder(httpTransport, JSON_FACTORY, new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }
}
