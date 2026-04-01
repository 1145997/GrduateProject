package dev.forint.campuslostfound.modules.lostfound.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import dev.forint.campuslostfound.modules.lostfound.dto.LostFoundAddDTO;
import dev.forint.campuslostfound.modules.lostfound.dto.LostFoundQueryDTO;
import dev.forint.campuslostfound.modules.lostfound.entity.LostFound;
import dev.forint.campuslostfound.modules.lostfound.vo.LostFoundDetailVO;
import dev.forint.campuslostfound.modules.lostfound.vo.LostFoundListVO;

public interface LostFoundService extends IService<LostFound> {

    void add(LostFoundAddDTO dto);

    Page<LostFoundListVO> getPage(LostFoundQueryDTO dto);

    LostFoundDetailVO getDetail(Long id);

    void approve(Long id);

    void reject(Long id, String auditReason);
}