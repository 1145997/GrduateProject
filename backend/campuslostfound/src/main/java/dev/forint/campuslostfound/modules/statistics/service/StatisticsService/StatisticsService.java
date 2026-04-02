package dev.forint.campuslostfound.modules.statistics.service;

import dev.forint.campuslostfound.modules.statistics.vo.DashboardOverviewVO;
import dev.forint.campuslostfound.modules.statistics.vo.TrendVO;

import java.util.List;

public interface StatisticsService {

    DashboardOverviewVO getOverview();

    List<TrendVO> getRecent7DaysTrend();
}