
package com.savora.restro.controller;


import org.springframework.web.bind.annotation.*;

import com.savora.restro.entity.Category;
import com.savora.restro.repository.CategoryRepository;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "${app.frontend.url}")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Get all categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Add a category
    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    // Get category by ID
    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Category not found: " + id));
    }

    // Delete category
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
    }
}