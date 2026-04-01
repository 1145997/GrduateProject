package dev.forint.campuslostfound.modules.lostfound.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import dev.forint.campuslostfound.modules.lostfound.dto.LostFoundAddDTO;
import dev.forint.campuslostfound.modules.lostfound.dto.LostFoundQueryDTO;
import dev.forint.campuslostfound.modules.lostfound.entity.LostFound;
import dev.forint.campuslostfound.modules.lostfound.mapper.LostFoundMapper;
import dev.forint.campuslostfound.modules.lostfound.service.LostFoundService;
import dev.forint.campuslostfound.modules.lostfound.vo.LostFoundListVO;
import dev.forint.campuslostfound.modules.lostfound.vo.LostFoundDetailVO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class LostFoundServiceImpl extends ServiceImpl<LostFoundMapper, LostFound> implements LostFoundService {

    @Override
    public void add(LostFoundAddDTO dto) {
        LostFound lostFound = new LostFound();
        BeanUtils.copyProperties(dto, lostFound);
        lostFound.setUserId(1L);
        lostFound.setStatus(0);
        lostFound.setViewCount(0);
        this.save(lostFound);
    }

    @Override
    public Page<LostFoundListVO> getPage(LostFoundQueryDTO dto) {
        Page<LostFound> page = new Page<>(dto.getPageNum(), dto.getPageSize());

        LambdaQueryWrapper<LostFound> wrapper = new LambdaQueryWrapper<>();

        wrapper.eq(dto.getType() != null, LostFound::getType, dto.getType())
                .eq(dto.getStatus() != null, LostFound::getStatus, dto.getStatus())
                .and(StringUtils.hasText(dto.getKeyword()), w -> w
                        .like(LostFound::getTitle, dto.getKeyword())
                        .or()
                        .like(LostFound::getItemName, dto.getKeyword())
                        .or()
                        .like(LostFound::getDescription, dto.getKeyword())
                )
                .orderByDesc(LostFound::getCreateTime);

        Page<LostFound> entityPage = this.page(page, wrapper);

        Page<LostFoundListVO> voPage = new Page<>();
        voPage.setCurrent(entityPage.getCurrent());
        voPage.setSize(entityPage.getSize());
        voPage.setTotal(entityPage.getTotal());

        voPage.setRecords(entityPage.getRecords().stream().map(item -> {
            LostFoundListVO vo = new LostFoundListVO();
            BeanUtils.copyProperties(item, vo);
            return vo;
        }).toList());

        return voPage;
    }

    @Override
    public LostFoundDetailVO getDetail(Long id) {
        LostFound lostFound = this.getById(id);
        if (lostFound == null) {
            throw new RuntimeException("信息不存在");
        }

        lostFound.setViewCount((lostFound.getViewCount() == null ? 0 : lostFound.getViewCount()) + 1);
        this.updateById(lostFound);

        LostFoundDetailVO vo = new LostFoundDetailVO();
        BeanUtils.copyProperties(lostFound, vo);
        return vo;
    }

    @Override
    public void approve(Long id) {
        LostFound lostFound = this.getById(id);
        if (lostFound == null) {
            throw new RuntimeException("信息不存在");
        }

        lostFound.setStatus(1);
        lostFound.setAuditReason(null);
        lostFound.setAuditAdminId(1L);
        lostFound.setAuditTime(java.time.LocalDateTime.now());

        this.updateById(lostFound);
    }

    @Override
    public void reject(Long id, String auditReason) {
        LostFound lostFound = this.getById(id);
        if (lostFound == null) {
            throw new RuntimeException("信息不存在");
        }

        lostFound.setStatus(3);
        lostFound.setAuditReason(auditReason);
        lostFound.setAuditAdminId(1L);
        lostFound.setAuditTime(java.time.LocalDateTime.now());

        this.updateById(lostFound);
    }
}