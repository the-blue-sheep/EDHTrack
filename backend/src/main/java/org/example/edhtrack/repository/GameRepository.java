package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Game;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {


    @Query("""
        SELECT g
        FROM Game g
        WHERE (:playerId IS NULL OR EXISTS (
                SELECT 1 FROM GameParticipant gp
                WHERE gp.game = g AND gp.player.id = :playerId
            ))
        AND (:commander IS NULL OR EXISTS (
                SELECT 1 FROM GameParticipant gp
                JOIN gp.deck d
                JOIN d.commanders c
                WHERE gp.game = g AND LOWER(c.name) LIKE :commander
            ))
        AND (:groupIds IS NULL OR g.group.groupId IN :groupIds)
    """)
    Page<Game> findByFilters(
            @Param("playerId") Integer playerId,
            @Param("commander") String commander,
            @Param("groupIds") List<Integer> groupIds,
            Pageable pageable
    );
}
