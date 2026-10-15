package com.savora.restro.entity;
import java.lang.reflect.GenericArrayType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity 
public class Gellery {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(nullable =false)
    private String imageUrl;
    public Gellery(){

    }
    public Gellery(Long id,String name,String imageUrl){
        this.id=id;
        this.name=name;
        this.imageUrl=imageUrl;
    }
    
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name=name;
    }
    public String getImageUrl(){
        return imageUrl;
    }
    public void setImageUrl(String imageUrl){
        this.imageUrl=imageUrl;
    }
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}

    
}
