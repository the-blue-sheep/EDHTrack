package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "commanders")
public class Commander {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String scryfallId;

    public Commander() {

    }

    public Commander(String name) {
        this.name = name;

    }
}
