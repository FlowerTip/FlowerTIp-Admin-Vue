<template>
  <div class="chart-wrapper">
    <MoreBarChart
      :chartOption="chartOption"
      style="width: 100%; height: 100%"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import MoreBarChart from "@/components/Chart/more-bar.vue";

const chartOption = reactive({
  legendData: ["2021年", "2022年", "2023年", "2024年"],
  icon: "round",
  unit: "人",
  xAxisData: ["北京", "上海", "广州", "深圳", "杭州", "苏州", "西安", "郑州"],
  seriesData: [
    {
      name: "2021年",
      type: "bar",
      data: [120, 200, 150, 80, 70, 110, 130, 500],
    },
    {
      name: "2022年",
      type: "bar",
      data: [140, 230, 120, 180, 270, 110, 130, 200],
    },
    {
      name: "2023年",
      type: "bar",
      data: [320, 200, 250, 380, 270, 110, 130, 300],
    },
    {
      name: "2024年",
      type: "bar",
      data: [100, 20, 150, 580, 270, 110, 430, 1000],
    },
  ],
});
</script>

<style lang="scss" scoped>
.chart-wrapper {
  height: 100%;
  background-color: #fff;
}
</style>
