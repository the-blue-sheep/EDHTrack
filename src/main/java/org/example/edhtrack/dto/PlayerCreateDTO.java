package org.example.edhtrack.dto;

public class PlayerCreateDTO {
    private String name;

    public PlayerCreateDTO() {}

    public PlayerCreateDTO(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
