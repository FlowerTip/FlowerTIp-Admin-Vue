<template>
  <div class="container">
    <el-calendar ref="calendar">
      <template #header="{ date }">
        <span>待办事项面板</span>
        <span>{{ date }}</span>
        <el-button-group>
          <el-button size="small" @click="selectDate('prev-year')">
            上一年
          </el-button>
          <el-button size="small" @click="selectDate('prev-month')">
            上一个月
          </el-button>
          <el-button size="small" @click="selectDate('today')">今天</el-button>
          <el-button size="small" @click="selectDate('next-month')">
            下一个月
          </el-button>
          <el-button size="small" @click="selectDate('next-year')">
            下一年
          </el-button>
        </el-button-group>
      </template>
    </el-calendar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { CalendarDateType, CalendarInstance } from "element-plus";

const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return;
  calendar.value.selectDate(val);
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
}
</style>
