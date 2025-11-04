package org.example.edhtrack.dto;

import lombok.Getter;

@Getter
public class PlayerResponseDTO {

    private int id;
    private String name;

    public PlayerResponseDTO(int id, String name) {
        this.id = id;
        this.name = name;
    }

}
