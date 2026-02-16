package org.example.edhtrack.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public String root() {
        return "EDH Track API running";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
