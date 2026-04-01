package dev.forint.campuslostfound.modules.lostfound.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import dev.forint.campuslostfound.common.api.Result;
import dev.forint.campuslostfound.modules.lostfound.dto.LostFoundAddDTO;
import dev.forint.campuslostfound.modules.lostfound.dto.LostFoundQueryDTO;
import dev.forint.campuslostfound.modules.lostfound.service.LostFoundService;
import dev.forint.campuslostfound.modules.lostfound.vo.LostFoundListVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import dev.forint.campuslostfound.modules.lostfound.vo.LostFoundDetailVO;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/lostfound")
@RequiredArgsConstructor
public class LostFoundController {

    private final LostFoundService lostFoundService;

    @PostMapping
    public Result<Void> add(@RequestBody @Valid LostFoundAddDTO dto) {
        lostFoundService.add(dto);
        return Result.success("发布成功", null);
    }

    @GetMapping("/list")
    public Result<Map<String, Object>> list(LostFoundQueryDTO dto) {
        Page<LostFoundListVO> page = lostFoundService.getPage(dto);

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
}