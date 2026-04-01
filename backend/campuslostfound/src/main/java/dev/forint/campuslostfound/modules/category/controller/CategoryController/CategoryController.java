package dev.forint.campuslostfound.modules.category.controller;

import dev.forint.campuslostfound.common.api.Result;
import dev.forint.campuslostfound.modules.category.entity.Category;
import dev.forint.campuslostfound.modules.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/list")
    public Result<List<Category>> list() {
        List<Category> list = categoryService.getEnabledCategoryList();
        return Result.success(list);
    }
}