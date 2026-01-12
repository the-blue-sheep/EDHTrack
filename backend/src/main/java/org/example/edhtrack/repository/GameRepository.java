package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Game;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {

    @Query("""
        SELECT DISTINCT g
        FROM Game g
        JOIN g.players gp
        JOIN gp.player p
        JOIN gp.deck d
        JOIN d.commanders c
        WHERE (:playerId IS NULL OR p.id = :playerId)
          AND (:commander IS NULL OR :commander = ''
                OR LOWER(c.name) LIKE LOWER(CONCAT('%', :commander, '%')))
    """)
    Page<Game> findByFilters(
            @Param("playerId") Integer playerId,
            @Param("commander") String commander,
            Pageable pageable
    );
}


