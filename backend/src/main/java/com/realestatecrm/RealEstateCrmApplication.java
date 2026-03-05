package com.realestatecrm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RealEstateCrmApplication {
    public static void main(String[] args) {
        SpringApplication.run(RealEstateCrmApplication.class, args);
    }
}
