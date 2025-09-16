package com.midascore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MidasCoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(MidasCoreApplication.class, args);
    }
}
