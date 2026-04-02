package dev.forint.campuslostfound.modules.category.service;

import com.baomidou.mybatisplus.extension.service.IService;
import dev.forint.campuslostfound.modules.category.entity.Category;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import dev.forint.campuslostfound.modules.category.dto.AdminCategoryQueryDTO;
import dev.forint.campuslostfound.modules.category.dto.CategoryAddDTO;


import java.util.List;

public interface CategoryService extends IService<Category> {

    List<Category> getEnabledCategoryList();

    Page<Category> getAdminPage(AdminCategoryQueryDTO dto);

    void add(CategoryAddDTO dto);

    void updateCategory(Long id, CategoryAddDTO dto);

    void deleteCategory(Long id);
}