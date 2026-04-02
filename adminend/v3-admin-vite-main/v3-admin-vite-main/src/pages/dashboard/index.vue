<script setup lang="ts">
import {
  getOverview,
  getRecent7DaysTrend,
  type OverviewData,
  type TrendItem
} from "@@/apis/dashboard"

defineOptions({
  name: "Dashboard"
})

const loading = ref(false)

const overview = reactive<OverviewData>({
  totalUsers: 0,
  totalInfos: 0,
  pendingInfos: 0,
  publishedInfos: 0,
  finishedInfos: 0,
  rejectedInfos: 0,
  totalNotices: 0
})

const trendList = ref<TrendItem[]>([])

const cardList = computed(() => [
  { label: "用户总数", value: overview.totalUsers },
  { label: "信息总数", value: overview.totalInfos },
  { label: "待审核", value: overview.pendingInfos },
  { label: "已发布", value: overview.publishedInfos },
  { label: "已完结", value: overview.finishedInfos },
  { label: "已驳回", value: overview.rejectedInfos },
  { label: "公告总数", value: overview.totalNotices }
])

async function fetchData() {
  loading.value = true
  try {
    const [overviewRes, trendRes] = await Promise.all([
      getOverview(),
      getRecent7DaysTrend()
    ])

    Object.assign(overview, overviewRes.data)
    trendList.value = trendRes.data.list || []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="app-container" v-loading="loading">
    <div class="page-header">
      <div class="page-title">仪表盘</div>
      <div class="page-desc">校园失物招领后台工作台首页</div>
    </div>

    <div class="card-grid">
      <el-card
        v-for="item in cardList"
        :key="item.label"
        shadow="hover"
        class="stat-card"
      >
        <div class="stat-card__label">{{ item.label }}</div>
        <div class="stat-card__value">{{ item.value }}</div>
      </el-card>
    </div>

    <el-row :gutter="16" class="content-row">
      <el-col :xs="24" :lg="16">
        <el-card shadow="never">
          <template #header>
            <div class="block-title">近 7 天发布趋势</div>
          </template>

          <el-table :data="trendList" border>
            <el-table-column prop="date" label="日期" min-width="180" />
            <el-table-column prop="count" label="发布数量" min-width="120" align="center" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card shadow="never">
          <template #header>
            <div class="block-title">系统概览</div>
          </template>

          <div class="summary-list">
            <div class="summary-item">
              <span>当前待审核信息</span>
              <strong>{{ overview.pendingInfos }}</strong>
            </div>
            <div class="summary-item">
              <span>当前已发布信息</span>
              <strong>{{ overview.publishedInfos }}</strong>
            </div>
            <div class="summary-item">
              <span>当前已驳回信息</span>
              <strong>{{ overview.rejectedInfos }}</strong>
            </div>
            <div class="summary-item">
              <span>当前公告总数</span>
              <strong>{{ overview.totalNotices }}</strong>
            </div>
            <div class="summary-item">
              <span>平台注册用户数</span>
              <strong>{{ overview.totalUsers }}</strong>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  padding: 16px;
}

.page-header {
  margin-bottom: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.page-desc {
  margin-top: 6px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  border-radius: 12px;

  &__label {
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }

  &__value {
    margin-top: 12px;
    font-size: 30px;
    font-weight: 700;
    color: var(--el-text-color-primary);
    line-height: 1;
  }
}

.content-row {
  margin-top: 0;
}

.block-title {
  font-size: 16px;
  font-weight: 600;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--el-fill-color-light);

  span {
    color: var(--el-text-color-regular);
  }

  strong {
    font-size: 18px;
    color: var(--el-text-color-primary);
  }
}
</style>
