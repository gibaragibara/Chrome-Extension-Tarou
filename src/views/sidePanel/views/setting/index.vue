<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'
import { defaultWidget } from '~/constants'
import { buildNpcFilter, notificationItem, notificationSetting, widgetList } from '~/logic'

function handleDelete(item: string) {
  const index = notificationItem.value.findIndex(i => i === item)
  notificationItem.value.splice(index, 1)
}

function updateNpcFilter(item: number) {
  const index = buildNpcFilter.value.findIndex(b => b === item)
  if (index !== -1)
    buildNpcFilter.value.splice(index, 1)
}

onMounted(() => {
  for (const widget of defaultWidget) {
    const hit = widgetList.value.find(w => w.key === widget.key)
    if (!hit)
      widgetList.value.push({ ...widget })
  }
  widgetList.value = widgetList.value.filter(widget =>
    defaultWidget.some(defaultWidget => defaultWidget.key === widget.key),
  )
})
</script>

<template>
  <el-alert :closable="false">
    <template #title>
      <div w-268px>
        <el-tooltip content="可点击或拖拽进行设置" placement="top-start">
          <span>
            主页设置
          </span>
        </el-tooltip>
      </div>
    </template>
  </el-alert>

  <VueDraggableNext v-model="widgetList" my-10px flex flex-col gap-10px px-10px>
    <transition-group name="draglist">
      <div
        v-for="widget in widgetList" :key="widget.key"
        :class=" { 'bg-neutral-6!': !widget.visible }"
        cursor-grab select-none rounded-lg bg-teal-6 text-center text-14px leading-loose
        @click="widget.visible = !widget.visible"
      >
        {{ widget.name }}
      </div>
    </transition-group>
  </VueDraggableNext>

  <el-alert :closable="false">
    <template #title>
      <div w-268px flex items-center justify-between gap-2>
        <div>
          弹窗通知
        </div>
        <VolumeControl />
      </div>
    </template>
  </el-alert>
  <div flex flex-col pl-5>
    <el-checkbox v-model="notificationSetting.battleWin" label="战斗结束提醒" />
    <el-checkbox v-model="notificationSetting.battleLose" label="队伍全灭提醒" />
    <el-checkbox v-model="notificationSetting.replicardEvent" label="沙盒宝箱提醒" />
    <el-checkbox v-model="notificationSetting.appearanceQuest" label="Hell提醒" />
    <el-checkbox v-model="notificationSetting.itemGoal" label="底部道具数量达到目标" />
    <el-checkbox v-model="notificationSetting.isPointOverLimit" label="四象点数超过上限" />
    <el-checkbox v-model="notificationSetting.sampoFinish" label="探险完成提醒" />
    <el-checkbox v-model="notificationSetting.checkUpdate" label="检测版本更新" />
  </div>


  <script setup lang="ts">
    /**
     * 设置页面组件
     *
     * 功能：
     * - 主页小组件显示顺序和可见性设置
     * - 浏览器通知设置（战斗结束、掉落提醒等）
     * - Telegram 远程通知配置
     * - 掉落物品监控列表管理
     * - 未拥有角色筛选设置
     */
    import { VueDraggableNext } from 'vue-draggable-next'
    import { defaultWidget } from '~/constants'
    import { buildNpcFilter, notificationItem, notificationSetting, telegramConfig, widgetList } from '~/logic'

    /**
     * 从掉落提醒列表中删除指定物品
     * @param {string} item - 物品的资源路径
     */
    function handleDelete(item: string) {
      const index = notificationItem.value.findIndex(i => i === item)
      notificationItem.value.splice(index, 1)
    }

    /**
     * 从未拥有角色列表中移除指定角色
     * @param {number} item - 角色 ID
     */
    function updateNpcFilter(item: number) {
      const index = buildNpcFilter.value.findIndex(b => b === item)
      if (index !== -1)
        buildNpcFilter.value.splice(index, 1)
    }

    onMounted(() => {
      for (const widget of defaultWidget) {
        const hit = widgetList.value.find(w => w.key === widget.key)
        if (!hit)
          widgetList.value.push({ ...widget })
      }
      widgetList.value = widgetList.value.filter(widget =>
          defaultWidget.some(defaultWidget => defaultWidget.key === widget.key),
      )
    })
  </script>

  <template>
    <el-alert :closable="false">
      <template #title>
        <div w-268px>
          <el-tooltip content="可点击或拖拽进行设置" placement="top-start">
          <span>
            主页设置
          </span>
          </el-tooltip>
        </div>
      </template>
    </el-alert>

    <VueDraggableNext v-model="widgetList" my-10px flex flex-col gap-10px px-10px>
      <transition-group name="draglist">
        <div
            v-for="widget in widgetList" :key="widget.key"
            :class=" { 'bg-neutral-6!': !widget.visible }"
            cursor-grab select-none rounded-lg bg-teal-6 text-center text-14px leading-loose
            @click="widget.visible = !widget.visible"
        >
          {{ widget.name }}
        </div>
      </transition-group>
    </VueDraggableNext>

    <el-alert :closable="false">
      <template #title>
        <div w-268px flex items-center justify-between gap-2>
          <div>
            弹窗通知
          </div>
          <VolumeControl />
        </div>
      </template>
    </el-alert>
    <div flex flex-col pl-5>
      <el-checkbox v-model="notificationSetting.battleWin" label="战斗结束提醒" />
      <el-checkbox v-model="notificationSetting.battleLose" label="队伍全灭提醒" />
      <el-checkbox v-model="notificationSetting.replicardEvent" label="沙盒宝箱提醒" />
      <el-checkbox v-model="notificationSetting.appearanceQuest" label="Hell提醒" />
      <el-checkbox v-model="notificationSetting.itemGoal" label="底部道具数量达到目标" />
      <el-checkbox v-model="notificationSetting.isPointOverLimit" label="四象点数超过上限" />
      <el-checkbox v-model="notificationSetting.sampoFinish" label="探险完成提醒" />
      <el-checkbox v-model="notificationSetting.checkUpdate" label="检测版本更新" />
    </div>

    <!-- Telegram 远程通知配置区域 -->
    <el-alert :closable="false" my-10px>
      <template #title>
        <div w-268px flex items-center justify-between gap-2>
          <div>
            Telegram 通知
          </div>
          <!-- 功能总开关：控制是否启用 Telegram 通知 -->
          <el-switch v-model="telegramConfig.enabled" />
        </div>
      </template>
    </el-alert>

    <!-- 配置表单：仅在开关开启时显示 -->
    <div v-if="telegramConfig.enabled" flex flex-col gap-10px px-5 pb-10px>
      <!-- Bot Token 输入框 -->
      <el-input
          v-model="telegramConfig.botToken"
          placeholder="输入 Bot Token"
          clearable
      >
        <template #prepend>
          Bot Token
        </template>
      </el-input>

      <!-- Chat ID 输入框 -->
      <el-input
          v-model="telegramConfig.chatId"
          placeholder="输入 Chat ID"
          clearable
      >
        <template #prepend>
          Chat ID
        </template>
      </el-input>

      <!-- 配置帮助提示 -->
      <el-alert type="info" :closable="false" show-icon>
        <template #title>
          <div text-12px>
            1. 在 Telegram 搜索 @BotFather 创建机器人获取 Token<br>
            2. 搜索 @userinfobot 获取你的 Chat ID<br>
            3. 确保已在 Telegram 中向你的 Bot 发送过至少一条消息
          </div>
        </template>
      </el-alert>
    </div>

    <el-alert :closable="false">
      <template #title>
        <div w-268px flex items-center justify-between gap-2>
          <el-tooltip content="在道具图片上右键加入掉落监控" placement="top-start">
            <div>
              掉落提醒
            </div>
          </el-tooltip>
          <el-switch v-model="notificationSetting.targetItemDrop" />
        </div>
      </template>
    </el-alert>
    <div px-5>
      <el-card my-10px body-style="padding: 10px">
        <div flex flex-wrap gap-12px>
          <div v-for="item in notificationItem" :key="item" relative fc flex-col select-none class="group">
            <img h-50px w-50px :src="`https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/assets${item}`">
            <div absolute hidden h-full w-full fc bg-black opacity-70 group-hover:flex>
              <div i-carbon:close-filled absolute icon-btn @click="handleDelete(item)" />
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-alert :closable="false">
      <template #title>
        <div w-268px>
          <el-tooltip content="点击配置查询中的角色进行设置" placement="top-start">
          <span>
            未拥有角色
          </span>
          </el-tooltip>
        </div>
      </template>
    </el-alert>
    <div v-if="buildNpcFilter.length" px-5>
      <el-card my-10px body-style="padding: 10px">
        <div flex flex-wrap gap-12px>
          <div v-for="item in buildNpcFilter" :key="item" relative fc flex-col select-none class="group">
            <img :src="getAssetImg('npc', `${item}_01`, 's')" h-50px w-50px>
            <div absolute hidden h-full w-full fc bg-black opacity-70 group-hover:flex>
              <div i-carbon:close-filled absolute icon-btn @click="updateNpcFilter(item)" />
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </template>


  <el-alert :closable="false">
    <template #title>
      <div w-268px flex items-center justify-between gap-2>
        <el-tooltip content="在道具图片上右键加入掉落监控" placement="top-start">
          <div>
            掉落提醒
          </div>
        </el-tooltip>
        <el-switch v-model="notificationSetting.targetItemDrop" />
      </div>
    </template>
  </el-alert>
  <div px-5>
    <el-card my-10px body-style="padding: 10px">
      <div flex flex-wrap gap-12px>
        <div v-for="item in notificationItem" :key="item" relative fc flex-col select-none class="group">
          <img h-50px w-50px :src="`https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/assets${item}`">
          <div absolute hidden h-full w-full fc bg-black opacity-70 group-hover:flex>
            <div i-carbon:close-filled absolute icon-btn @click="handleDelete(item)" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
  <el-alert :closable="false">
    <template #title>
      <div w-268px>
        <el-tooltip content="点击配置查询中的角色进行设置" placement="top-start">
          <span>
            未拥有角色
          </span>
        </el-tooltip>
      </div>
    </template>
  </el-alert>
  <div v-if="buildNpcFilter.length" px-5>
    <el-card my-10px body-style="padding: 10px">
      <div flex flex-wrap gap-12px>
        <div v-for="item in buildNpcFilter" :key="item" relative fc flex-col select-none class="group">
          <img :src="getAssetImg('npc', `${item}_01`, 's')" h-50px w-50px>
          <div absolute hidden h-full w-full fc bg-black opacity-70 group-hover:flex>
            <div i-carbon:close-filled absolute icon-btn @click="updateNpcFilter(item)" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
