package dev.forint.campuslostfound.modules.category.service;

import com.baomidou.mybatisplus.extension.service.IService;
import dev.forint.campuslostfound.modules.category.entity.Category;

import java.util.List;

public interface CategoryService extends IService<Category> {

    List<Category> getEnabledCategoryList();
}