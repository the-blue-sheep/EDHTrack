package org.example.edhtrack.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.example.edhtrack.Utils.Role;


@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToOne
    private Player player;

}

