package com.savora.restro.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.savora.restro.dto.MenuItemDto;
import com.savora.restro.entity.MenuItem;
import com.savora.restro.repository.MenuItemRepo;

@Service 
public class MenuItemService {
    private MenuItemRepo menuItemRepo;

    public MenuItemService(MenuItemRepo menuItemRepo) {
        this.menuItemRepo = menuItemRepo;
    }

    //add item
    public MenuItem saveItem(MenuItemDto items){
        MenuItem menu=new MenuItem();
        menu.setName(items.getName());
        menu.setDescription(items.getDescription());
        menu.setPrice(items.getPrice());
        menu.setCategory(items.getCategory());
        menu.setImageUrl(items.getImageUrl());
        menu.setAvailable(items.isAvailable());
        return menuItemRepo.save(menu);
    }
    //find item
    public MenuItem getItem(Long id){
        MenuItem item=menuItemRepo.findById(id)
            .orElseThrow(()->new RuntimeException("ITEM NOT FOUND"));

        return item;
    }

    //find all item
    public List<MenuItem> findall(){
        return menuItemRepo.findAll();
    }

    //update itme
    public MenuItem updateItem(Long id,MenuItemDto dto){
        MenuItem item=menuItemRepo.findById(id)
            .orElseThrow(()->new RuntimeException("ITEM NOT FOUND"));
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setCategory(dto.getCategory());
        item.setAvailable(dto.isAvailable());

        menuItemRepo.save(item);
        return item;
    }

    //delete item
    public MenuItem deleteItem(Long id){
        MenuItem item=menuItemRepo.findById(id)
            .orElseThrow(()->new RuntimeException("ITEM NOT FOUND"));
        menuItemRepo.delete(item);
        return item;

    }


    
    
}
