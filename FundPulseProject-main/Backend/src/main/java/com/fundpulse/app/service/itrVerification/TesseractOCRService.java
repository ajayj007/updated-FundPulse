package com.fundpulse.app.service.itrVerification;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.RescaleOp;
import java.io.File;
import java.io.IOException;

@Service
public class TesseractOCRService {

    public String extractTextFromFile(MultipartFile file) throws IOException, TesseractException {
        File tempFile = convertMultipartFileToFile(file);
        String extractedText = "";

        // Check if it's a PDF
        if (file.getOriginalFilename().endsWith(".pdf")) {
            // Try extracting text directly first
            extractedText = extractTextFromPDF(tempFile);
            if (extractedText.trim().isEmpty()) {
                // If no text is found, convert to image and use OCR
                tempFile = convertPDFToImage(tempFile);
                extractedText = extractTextFromImage(tempFile);
            }
        } else {
            // If it's an image, extract text directly
            extractedText = extractTextFromImage(tempFile);
        }

        // Delete temp file
        tempFile.delete();
        return extractedText;
    }

    /**
     * Extracts text directly from a PDF (if it contains selectable text)
     */
    private String extractTextFromPDF(File pdfFile) throws IOException {
        PDDocument document = PDDocument.load(pdfFile);
        PDFTextStripper pdfStripper = new PDFTextStripper();
        String extractedText = pdfStripper.getText(document);
        document.close();
        return extractedText;
    }

    /**
     * Converts a PDF to an image (for scanned PDFs)
     */
    private File convertPDFToImage(File pdfFile) throws IOException {
        PDDocument document = PDDocument.load(pdfFile);
        PDFRenderer pdfRenderer = new PDFRenderer(document);

        BufferedImage image = pdfRenderer.renderImageWithDPI(0, 300); // Convert first page to 300 DPI image

        // Convert image to grayscale and enhance contrast for better OCR accuracy
        BufferedImage processedImage = preprocessImage(image);

        File outputFile = File.createTempFile("converted_", ".png");
        ImageIO.write(processedImage, "png", outputFile);

        document.close();
        return outputFile;
    }

    /**
     * Extracts text from an image using Tesseract OCR
     */
    private String extractTextFromImage(File imageFile) throws TesseractException {
        ITesseract tesseract = new Tesseract();
        tesseract.setDatapath("C://Program Files//Tesseract-OCR//tessdata");
        tesseract.setLanguage("eng");

        return tesseract.doOCR(imageFile);
    }

    /**
     * Enhances image quality for better OCR recognition
     */
    private BufferedImage preprocessImage(BufferedImage image) {
        BufferedImage grayImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_BYTE_GRAY);
        Graphics2D g = grayImage.createGraphics();
        g.drawImage(image, 0, 0, null);
        g.dispose();

        // Apply contrast enhancement
        float scaleFactor = 1.5f;
        float offset = 15;
        RescaleOp rescaleOp = new RescaleOp(scaleFactor, offset, null);
        rescaleOp.filter(grayImage, grayImage);

        return grayImage;
    }

    /**
     * Converts MultipartFile to a temporary File
     */
    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convFile = File.createTempFile("uploaded_", "." + getFileExtension(file));
        file.transferTo(convFile);
        return convFile;
    }

    private String getFileExtension(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        return fileName != null ? fileName.substring(fileName.lastIndexOf(".") + 1) : "";
    }
}
