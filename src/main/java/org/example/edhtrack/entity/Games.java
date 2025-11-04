package org.example.edhtrack.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Games {
    @Id
    @GeneratedValue
    private int id;
    private LocalDate date;
    @JoinColumn(name="player_id")
    private int winnderId;
    private String notes;
}
