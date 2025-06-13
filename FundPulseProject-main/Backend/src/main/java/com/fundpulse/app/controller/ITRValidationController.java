package com.fundpulse.app.controller;


import com.fundpulse.app.service.itrVerification.ITRValidationService;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/itr")
public class ITRValidationController {

    @Autowired
    private ITRValidationService itrValidationService;

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateITRDocument(@RequestParam("file") MultipartFile file) {
        boolean isValidITR = false;
        try {
            isValidITR = itrValidationService.isITRDocument(file);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (TesseractException e) {
            throw new RuntimeException(e);
        }
        if (isValidITR) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }
}
