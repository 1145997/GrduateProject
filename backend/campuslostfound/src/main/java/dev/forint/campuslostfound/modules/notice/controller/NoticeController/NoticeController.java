package dev.forint.campuslostfound.modules.notice.controller;

import dev.forint.campuslostfound.common.api.Result;
import dev.forint.campuslostfound.modules.notice.entity.Notice;
import dev.forint.campuslostfound.modules.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice/public")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("/list")
    public Result<List<Notice>> list() {
        return Result.success(noticeService.getPublicList());
    }

    @GetMapping("/{id}")
    public Result<Notice> detail(@PathVariable Long id) {
        return Result.success(noticeService.getPublicDetail(id));
    }
}