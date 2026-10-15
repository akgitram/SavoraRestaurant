package com.savora.restro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestroApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestroApplication.class, args);
		System.out.println("Application start");
	}

}
