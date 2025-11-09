package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;

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

    @OneToOne
    @JoinColumn(name = "winner")
    private Player winner;

    private String notes;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    private List<GameParticipant> participants;

}
