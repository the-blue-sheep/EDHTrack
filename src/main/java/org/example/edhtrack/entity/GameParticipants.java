package org.example.edhtrack.entity;

import jakarta.persistence.*;

@Entity
public class GameParticipants {
    @Id
    @GeneratedValue
    private int id;
    private int gameId;
    @ManyToOne
    @JoinColumn(name="player_id")
    private Player player;

    @JoinColumn(name="deck_id")
    private int deckId;


}
