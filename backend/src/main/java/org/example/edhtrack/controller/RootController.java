package org.example.edhtrack.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping(value = {"/", "/{x:[^\\.]*}", "/**/{x:[^\\.]*}"})
    public String forward() {
        return "forward:/index.html";
    }
}
