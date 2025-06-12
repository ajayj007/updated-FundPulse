package com.fundpulse.app.repositories;

import com.fundpulse.app.models.Startup;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StartupRepo extends MongoRepository<Startup, String> {
    Startup findByEmailAndPassword(String email, String pwd);

    Optional<Startup> findByEmail(String email);
}
