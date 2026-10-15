package com.savora.restro.service;

import org.springframework.stereotype.Service;

import com.savora.restro.entity.Contect;
import com.savora.restro.repository.ContectRepo;

@Service 
public class ContectService {
    private ContectRepo contectRepo;

    public ContectService(ContectRepo contectRepo) {
        this.contectRepo = contectRepo;
    }
    
    public Contect sendContect(Contect contect){
        return contectRepo.save(contect);
    }
    
}
