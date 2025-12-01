package org.example.edhtrack.dto.player;

public record PlayerSetRetiredDTO(int id, String name, boolean isRetired) {
    public String getName() {
        return name;
    }
}
