package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "game_participants")
public class GameParticipant {
    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    @JoinColumn(name = "game")
    private Game game;

    @ManyToOne
    @JoinColumn(name="player")
    private Player player;

    @ManyToOne
    @JoinColumn(name="deck")
    private Deck deck;

}
