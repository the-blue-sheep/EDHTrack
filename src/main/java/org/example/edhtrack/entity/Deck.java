package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "decks")
public class Deck {
    @Id
    @GeneratedValue
    private int DeckId;

    @Column(nullable=false)
    private String Commander;

    private String colors;
    private String deckName;
    private String bracket;

    @ManyToOne
    @JoinColumn(name = "playerID", nullable=false)
    private Player player;

}
