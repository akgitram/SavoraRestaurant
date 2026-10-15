package com.savora.restro.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.savora.restro.entity.Gellery;
import com.savora.restro.repository.GelleryRepo;

@Service 
public class GelleryService {
    @Autowired 
    private GelleryRepo gelleryRepo;

    public Gellery save(Gellery gellery){
        return gelleryRepo.save(gellery);
    }

    public List<Gellery> getAll(){
        List<Gellery> item=gelleryRepo.findAll();
        return item;
    }

    public Gellery deleteImage(Long id){
        Gellery item=gelleryRepo.findById(id)
                .orElseThrow(()->new RuntimeException("ITEM NOT FOUD"));
        gelleryRepo.delete(item);
        return item;
    }
    
}
