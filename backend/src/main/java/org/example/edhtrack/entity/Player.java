package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Data
@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String name;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Deck> decks;

    public boolean isRetired = false;

    @ManyToMany(mappedBy = "players")
    private Set<PlayerGroup> groups = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Player)) return false;
        return id == ((Player) o).id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }

    public Player() {}
    public Player(String name) {
        this.name = name;
    }
    public void setPlayerId(int i) {
        this.id = i;
    }
}
