package dev.forint.campuslostfound.modules.lostfound.controller;

import dev.forint.campuslostfound.common.api.Result;
import dev.forint.campuslostfound.modules.lostfound.dto.LostFoundRejectDTO;
import dev.forint.campuslostfound.modules.lostfound.service.LostFoundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/lostfound")
@RequiredArgsConstructor
public class AdminLostFoundController {

    private final LostFoundService lostFoundService;

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