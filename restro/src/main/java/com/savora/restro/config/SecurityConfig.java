package com.savora.restro.config;

import java.util.List;

import com.savora.restro.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {

                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of("https://savora-restaurant-three.vercel.app/"));

                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

                configuration.setAllowedHeaders(List.of("*"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", configuration);

                return source;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http.csrf(csrf -> csrf.disable())

                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                .requestMatchers("/auth/user/signup", "/auth/user/login","/auth/user/verify-otp").permitAll()

                                                .requestMatchers(HttpMethod.GET, "/api/menu/**").permitAll()

                                                .requestMatchers(HttpMethod.POST, "/api/menu/**").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.PUT, "/api/menu/**").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.DELETE, "/api/menu/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/admin/create").hasRole("ADMIN")

                                                .requestMatchers("/auth/user/**").hasAnyRole("USER", "ADMIN")

                                                .requestMatchers(HttpMethod.POST, "/api/user/**")
                                                .hasAnyRole("USER", "ADMIN")

                                                .requestMatchers(HttpMethod.GET, "/api/user/my")
                                                .hasAnyRole("USER", "ADMIN")

                                                .requestMatchers(HttpMethod.GET, "/api/user").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.GET, "/api/user/**").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.PUT, "/api/user/**").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.DELETE, "/api/user/**").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.POST, "/api/orders")
                                                .hasAnyRole("USER", "ADMIN")

                                                .requestMatchers(HttpMethod.GET, "/api/orders/my")
                                                .hasAnyRole("USER", "ADMIN")

                                                .requestMatchers(HttpMethod.PATCH, "/api/orders/*/cancel")
                                                .hasAnyRole("USER", "ADMIN")

                                                .requestMatchers("/api/admin/orders/**").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.POST, "/admin/gellery").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.GET, "/admin/gellery").permitAll()

                                                .requestMatchers(HttpMethod.DELETE, "/admin/gellery/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.POST, "/api/categories").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()

                                                .requestMatchers(HttpMethod.DELETE, "/api/categories").hasRole("ADMIN")

                                                .requestMatchers(HttpMethod.POST, "/api/contect").permitAll()
                                                .requestMatchers("/api/auth/forgot-password",
                                                                "/api/auth/reset-password")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                                .requestMatchers("/api/auth/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()


                                                .anyRequest().authenticated())

                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}