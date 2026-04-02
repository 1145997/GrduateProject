package dev.forint.campuslostfound.modules.comment.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import dev.forint.campuslostfound.modules.comment.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {
}