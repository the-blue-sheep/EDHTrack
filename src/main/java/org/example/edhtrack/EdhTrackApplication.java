package org.example.edhtrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "org.example.edhtrack.entity")
public class EdhTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(EdhTrackApplication.class, args);
    }

}
