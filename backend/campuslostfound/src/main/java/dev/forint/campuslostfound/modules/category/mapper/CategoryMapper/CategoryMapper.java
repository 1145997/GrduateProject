package dev.forint.campuslostfound.modules.category.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import dev.forint.campuslostfound.modules.category.entity.Category;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
}