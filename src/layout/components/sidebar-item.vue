<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item as AppTypeConfig.MenuOption) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :title="onlyOneChild.meta.title"
            :icon="onlyOneChild.meta.icon"
            :size="17"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu
      v-else
      ref="subMenuRef"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template #title>
        <item :title="item.meta.title" :icon="item.meta.icon" :size="17" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        is-nest
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
export default {
  name: "SidebarItem",
};
</script>

<script lang="ts" setup>
import { isExternalFn } from "@/utils/validate";
import { resolve } from "@/utils/tool";
import Item from "./item.vue";
import AppLink from "./link.vue";
import type { ElSubMenu } from "element-plus";
import { ref } from "vue";

const subMenuRef = ref<InstanceType<typeof ElSubMenu>>();
type ComponentProps = {
  item: any;
  isNest?: boolean;
  basePath: string;
};
const props = defineProps<ComponentProps>();

const onlyOneChild = ref<AppTypeConfig.MenuOption>({
  path: "",
  name: "",
  meta: {
    icon: "",
    title: "",
    hidden: false,
    isHide: false,
    isFull: false,
    isAffix: false,
    isKeepAlive: false,
  },
});

const hasOneShowingChild = (
  children: AppTypeConfig.MenuOption[] = [],
  parent: AppTypeConfig.MenuOption
) => {
  const showingChildren = children.filter((item) => {
    if (item.meta.hidden) {
      return false;
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item;
      return true;
    }
  });

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true;
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }

  return false;
};

console.log(
  hasOneShowingChild(props.item.children, props.item),
  onlyOneChild,
  "onlyOneChild"
);

const resolvePath = (routePath: string) => {
  if (isExternalFn(routePath)) {
    return routePath;
  }
  if (isExternalFn(props.basePath)) {
    return props.basePath;
  }
  return resolve(
    props.basePath as unknown as IArguments,
    routePath as unknown as IArguments
  );
};
</script>
