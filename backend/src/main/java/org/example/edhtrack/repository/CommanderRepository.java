package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Commander;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommanderRepository extends JpaRepository<Commander, Long> {
    Optional<Commander> findByNameIgnoreCase(String name);
    Optional<Commander> findByScryfallId(String scryfallId);
}
