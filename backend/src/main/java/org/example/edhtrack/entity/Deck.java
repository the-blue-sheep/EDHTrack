package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.example.edhtrack.Utils;

import java.util.Set;

@Entity
@Data
@Table(name = "decks")
public class Deck {
    @Id
    @GeneratedValue
    private int deckId;

    private String colors;
    private String deckName;

    @Enumerated(EnumType.STRING)
    private Utils.Bracket bracket;

    public boolean isRetired = false;

    @ManyToOne
    private Player player;

    @ManyToMany
    @JoinTable(
            name = "deck_commanders",
            joinColumns = @JoinColumn(name = "deck_id"),
            inverseJoinColumns = @JoinColumn(name = "commander_id")
    )
    private Set<Commander> commanders;
}
