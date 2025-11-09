package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {}
