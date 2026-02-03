package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
public class PlayerGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int groupId;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean isDefault;

    @ManyToMany(mappedBy = "groups")
    private Set<Player> players = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PlayerGroup)) return false;
        return groupId == ((PlayerGroup) o).groupId;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(groupId);
    }

    public void setIsDefault(boolean b) {
        this.isDefault = b;
    }
}

