package dev.forint.campuslostfound.modules.notice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import dev.forint.campuslostfound.modules.notice.entity.Notice;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NoticeMapper extends BaseMapper<Notice> {
}