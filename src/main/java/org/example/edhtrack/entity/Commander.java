package org.example.edhtrack.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Commander {

    private String name;
    private String cardId;

    public Commander() {}

    public Commander(String name, String cardId) {
        this.name = name;
        this.cardId = cardId;
    }

    public String getName() {
        return name;
    }

    public String getCardId() {
        return cardId;
    }
}
