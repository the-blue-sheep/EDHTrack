package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "decks")
public class Deck {
    @Id
    @GeneratedValue
    private int deckId;

    @Column(nullable=false)
    private String commander;

    private String colors;
    private String deckName;
    private String bracket;
    public boolean isRetired = false;

    @ManyToOne
    private Player player;
}
