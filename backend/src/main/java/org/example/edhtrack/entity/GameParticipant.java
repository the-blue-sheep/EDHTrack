package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
@Table(name = "game_participants")
public class GameParticipant {
    @Id
    @GeneratedValue
    private int id;

    @ManyToOne
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Game game;

    @ManyToOne
    private Player player;

    @ManyToOne
    private Deck deck;

    @Column(length = 1000)
    private String notes;

    private boolean isWinner;
}
