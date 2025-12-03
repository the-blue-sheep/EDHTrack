package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;


@Data
@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(unique = true)
    private String name;
    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Deck> decks;
    public boolean isRetired = false;

    public Player() {}

    public Player(String name) {
        this.name = name;
    }

    public void setPlayerId(int i) {
        this.id = i;
    }
}
