package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue
    private int id;
    private LocalDate date;
    private String notes;

    @ManyToOne
    @JoinColumn(name = "winner_id")
    private Player winner;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<GameParticipant> players;

}
