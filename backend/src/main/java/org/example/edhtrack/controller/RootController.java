package org.example.edhtrack.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class RootController {

    @GetMapping(value = { "/", "/{path:[^\\.]*}" })
    public String forward(@PathVariable(required = false) String path) {
        if (path == null || path.isEmpty() ||
                path.startsWith("api") ||
                path.startsWith("v3") ||
                path.startsWith("swagger-ui")) {
            if (path == null) return "forward:/index.html";
            return "forward:/" + path;
        }
        return "forward:/index.html";
    }
}
