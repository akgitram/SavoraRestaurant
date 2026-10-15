package com.savora.restro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupDto {
    @NotBlank(message = "user name is required")
    @Size(min = 3 ,message = "username must be over 3 character")
    private String name;
    @NotBlank(message = "email is required")
    private String email;
    @NotBlank(message = "password is required")
    @Size(min = 6,message = "password must be 6 character")
    private String password;
    public SignupDto(){

    }
    public SignupDto(
            @NotBlank(message = "user name is required") @Size(min = 3, message = "username must be over 3 character") String name,
            @NotBlank(message = "email is required") String email,
            @NotBlank(message = "password is required") @Size(min = 6, message = "password must be 6 character") String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    

    
    
}
