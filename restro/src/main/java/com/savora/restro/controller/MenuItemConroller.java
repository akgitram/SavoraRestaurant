package com.savora.restro.controller;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.savora.restro.dto.MenuItemDto;
import com.savora.restro.entity.MenuItem;
import com.savora.restro.service.MenuItemService;

@RestController 
@RequestMapping("/api/menu")
public class MenuItemConroller {

    private MenuItemService menuItemService;

    public MenuItemConroller(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody MenuItemDto dto){
        System.out.println("data coming");
        MenuItem item=menuItemService.saveItem(dto);
        return ResponseEntity.ok(item);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getItem(@PathVariable Long id){
        MenuItem item=menuItemService.getItem(id);
        return ResponseEntity.ok(item);
    }
    @GetMapping
    public ResponseEntity<List<MenuItem>> getall(){
        List<MenuItem> item=menuItemService.findall();
        return ResponseEntity.ok(item);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id,@RequestBody MenuItemDto dto){
        MenuItem item=menuItemService.updateItem(id, dto);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable  Long id){
        MenuItem item=menuItemService.deleteItem(id);
        return ResponseEntity.ok(item);

    }


    
}
