package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Integer> {
    Optional<Player> findByName(String playerName);

    @Query("SELECT p FROM Player p LEFT JOIN FETCH p.groups WHERE p.name = :name")
    Optional<Player> findByNameWithGroups(@Param("name") String name);
}
