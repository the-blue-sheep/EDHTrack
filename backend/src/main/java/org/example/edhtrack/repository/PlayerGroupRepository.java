package org.example.edhtrack.repository;

import org.example.edhtrack.entity.Player;
import org.example.edhtrack.entity.PlayerGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

public interface PlayerGroupRepository extends JpaRepository<PlayerGroup, Integer> {

    Optional<PlayerGroup> findByName(String name);

    @Query("""
    SELECT DISTINCT p
    FROM Player p
    JOIN p.groups g
    WHERE g.groupId IN :groupIds
""")
    List<Player> findByGroupIds(List<Integer> groupIds);

    Optional<PlayerGroup> findByIsDefaultTrue();
}
