package org.example.edhtrack.dto;

import lombok.Getter;

@Getter
public class PlayerCreateDTO {
    private String name;

    public PlayerCreateDTO() {}

    public PlayerCreateDTO(String name) {
        this.name = name;
    }

}
