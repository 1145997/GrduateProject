package dev.forint.campuslostfound.modules.lostfound.controller;

import dev.forint.campuslostfound.common.api.Result;
import dev.forint.campuslostfound.modules.lostfound.dto.LostFoundRejectDTO;
import dev.forint.campuslostfound.modules.lostfound.service.LostFoundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import dev.forint.campuslostfound.modules.lostfound.dto.AdminLostFoundQueryDTO;
import dev.forint.campuslostfound.modules.lostfound.vo.LostFoundDetailVO;
import dev.forint.campuslostfound.modules.lostfound.vo.LostFoundListVO;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/admin/lostfound")
@RequiredArgsConstructor
public class AdminLostFoundController {

    private final LostFoundService lostFoundService;

    @GetMapping("/pending")
    public Result<Map<String, Object>> pending(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize
    ) {
        Page<LostFoundListVO> page = lostFoundService.getPendingPage(pageNum, pageSize);

        Map<String, Object> data = new HashMap<>();
        data.put("list", page.getRecords());
        data.put("total", page.getTotal());
        data.put("pageNum", page.getCurrent());
        data.put("pageSize", page.getSize());

        return Result.success(data);
    }

    @GetMapping("/list")
    public Result<Map<String, Object>> list(AdminLostFoundQueryDTO dto) {
        Page<LostFoundListVO> page = lostFoundService.getAdminPage(dto);

        Map<String, Object> data = new HashMap<>();
        data.put("list", page.getRecords());
        data.put("total", page.getTotal());
        data.put("pageNum", page.getCurrent());
        data.put("pageSize", page.getSize());

        return Result.success(data);
    }

    @GetMapping("/{id}")
    public Result<LostFoundDetailVO> detail(@PathVariable Long id) {
        return Result.success(lostFoundService.getDetail(id));
    }

    @PutMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id) {
        lostFoundService.approve(id);
        return Result.success("审核通过", null);
    }

    @PutMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @RequestBody @Valid LostFoundRejectDTO dto) {
        lostFoundService.reject(id, dto.getAuditReason());
        return Result.success("驳回成功", null);
    }
}