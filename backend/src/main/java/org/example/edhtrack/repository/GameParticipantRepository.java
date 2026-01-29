package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameParticipantRepository extends JpaRepository<GameParticipant,Integer> {
    List<GameParticipant> findByPlayer(Player player);

    List<GameParticipant> findByDeck_ColorsContaining(String colors);

    List<GameParticipant> findByDeck_Commanders_NameIgnoreCase(String commanderName);

    int countByPlayer(Player player);

    List<GameParticipant> findByPlayerAndDeck(Player player, Deck deck);

    @Query("""
        select count(gp) > 0
        from GameParticipant gp
        where gp.deck.deckId = :deckId
    """)
    boolean isDeckUsed(@Param("deckId") int deckId);

    List<GameParticipant> findByPlayerAndGame_Group_GroupIdIn(Player player, List<Integer> groups);

    @Query("""
        SELECT gp
        FROM GameParticipant gp
        JOIN gp.game g
        LEFT JOIN g.group grp
        WHERE gp.player = :player
        AND (:groupIds IS NULL OR grp.groupId IN :groupIds)
        ORDER BY g.date ASC
    """)
    List<GameParticipant> findByPlayerAndGroups(
            @Param("player") Player player,
            @Param("groupIds") List<Integer> groupIds
    );
}
