package dev.forint.campuslostfound.modules.statistics.controller;

import dev.forint.campuslostfound.common.api.Result;
import dev.forint.campuslostfound.common.utils.AdminTokenUtils;
import dev.forint.campuslostfound.modules.statistics.service.StatisticsService;
import dev.forint.campuslostfound.modules.statistics.vo.DashboardOverviewVO;
import dev.forint.campuslostfound.modules.statistics.vo.TrendVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final AdminTokenUtils adminTokenUtils;
    private final StatisticsService statisticsService;

    @GetMapping("/overview")
    public Result<DashboardOverviewVO> overview() {
        adminTokenUtils.checkAdminLogin();
        return Result.success(statisticsService.getOverview());
    }

    @GetMapping("/trend/recent7days")
    public Result<Map<String, Object>> recent7DaysTrend() {
        adminTokenUtils.checkAdminLogin();

        List<TrendVO> trendList = statisticsService.getRecent7DaysTrend();

        Map<String, Object> data = new HashMap<>();
        data.put("list", trendList);

        return Result.success(data);
    }
}