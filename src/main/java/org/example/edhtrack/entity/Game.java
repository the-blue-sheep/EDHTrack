package org.example.edhtrack.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue
    private int id;
    private LocalDate date;

    @OneToOne
    @JoinColumn(name = "winner_id")
    private Player winner;

    private String notes;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<GameParticipant> participants;

}
