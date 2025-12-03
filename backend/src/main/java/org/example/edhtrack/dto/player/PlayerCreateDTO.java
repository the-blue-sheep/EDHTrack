package org.example.edhtrack.dto.player;

public record PlayerCreateDTO(String name) {
    public String getName() {
        return name;
    }
}
