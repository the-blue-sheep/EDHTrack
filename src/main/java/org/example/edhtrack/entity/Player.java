package org.example.edhtrack.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter //Getter for id and name
@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Setter //Setter only for name because id is autoincrement
    private String name;

    public Player() {}

    public Player(String name) {
        this.name = name;
    }

}
