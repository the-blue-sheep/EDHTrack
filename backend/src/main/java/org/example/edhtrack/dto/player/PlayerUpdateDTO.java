package org.example.edhtrack.dto.player;

public record PlayerUpdateDTO(int id, String newName, boolean isRetired) {
    public String getNewName() {
        return newName;
    }

    public int getId() {
        return id;
    }
}
