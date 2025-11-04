package org.example.edhtrack.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Decks {
    @Id
    @GeneratedValue
    private int id;
    private String Commander;
    private String colorId;
    private String deckName;
    private String bracket;
    private int playerId;

}
