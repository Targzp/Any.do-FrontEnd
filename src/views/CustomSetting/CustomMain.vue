<!--
 * @Author: 胡晨明
 * @Date: 2021-10-20 16:11:59
 * @LastEditTime: 2022-01-27 21:39:08
 * @LastEditors: 胡晨明
 * @Description: 自定义设置主要设置界面组件
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\views\CustomSetting\CustomMain.vue
-->
<template>
    <div class="customMain">
        <el-scrollbar>
            <!-- 功能模块 -->
            <div class="customMain__gap customMain__functions">
                <!-- 功能模块标题 -->
                <div class="customMain__title" :ref="scrollDoms.functionDom">功能模块</div>
                <!-- 功能模块内容 -->
                <div class="customMain__functions__content">
                    <!-- 子模块循环渲染 -->
                    <div
                        class="customMain__functions__item"
                        v-for="func in functionModels"
                        :key="func.functionFlag"
                    >
                        <div class="customMain__functions__item__iconBackground">
                            <span class="iconfont customMain__functions__icon" v-html="func.functionIcon"></span>
                        </div>
                        <div class="customMain__functions__item__cnt">
                            <el-switch class="customMain__functions__item__switch" v-model="functions[func.functionFlag]"/>
                            <span class="customMain__desc-color">{{func.functionName}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 日期与时间 -->
            <div class="customMain__gap customMain__timeAndDate">
                <div class="customMain__title" :ref="scrollDoms.dateDom">日期与时间</div>
                <div class="customMain__item-flex">
                    <span class="customMain__desc">时间格式</span>
                    <el-select
                        class="customMain__inputWidth"
                        v-model="timeAndDate.timeFormat"
                    >
                        <el-option value="24" label="24小时制"></el-option>
                        <el-option value="12" label="12小时制"></el-option>
                    </el-select>
                </div>
                <div class="customMain__item-flex">
                    <span class="customMain__desc">每周开始于</span>
                    <el-select
                        class="customMain__inputWidth"
                        v-model="timeAndDate.firstDayOfWeek"
                    >
                        <el-option value="2" label="周一"></el-option>
                        <el-option value="1" label="周日"></el-option>
                    </el-select>
                </div>
            </div>
            <!-- 提醒与通知 -->
            <div class="customMain__gap customMain__notify">
                <div class="customMain__title" :ref="scrollDoms.notifyDom">提醒与通知</div>
                <div class="customMain__item-flex">
                    <span class="customMain__desc">邮件提醒</span>
                    <el-select
                        class="customMain__inputWidth"
                        v-model="notify.mailNotify"
                    >
                        <el-option :value="true" label="通过邮件提醒我"></el-option>
                        <el-option :value="false" label="不要通过邮件提醒我"></el-option>
                    </el-select>
                </div>
                <div class="customMain__item-flex">
                    <span class="customMain__desc">网页提醒</span>
                    <el-select
                        class="customMain__inputWidth"
                        v-model="notify.webNotify"
                    >
                        <el-option :value="true" label="在网页上提醒我"></el-option>
                        <el-option :value="false" label="不要在网页上提醒我"></el-option>
                    </el-select>
                </div>
            </div>
            <!-- 任务默认值 -->
            <div class="customMain__gap customMain__task">
                <div class="customMain__title" :ref="scrollDoms.taskDom">任务默认值</div>
                <div class="customMain__item-flex">
                    <span class="customMain__desc">默认日期</span>
                    <el-select
                        class="customMain__inputWidth"
                        placeholder="无"
                        v-model="taskDefault.defaultDate"
                    >
                        <el-option value="td" label="今天"></el-option>
                        <el-option value="tm" label="明天"></el-option>
                        <el-option value="at" label="后天"></el-option>
                    </el-select>
                </div>
                <div class="customMain__item-flex">
                    <span class="customMain__desc">默认日期模式</span>
                    <el-select
                        class="customMain__inputWidth"
                        v-model="taskDefault.defaultDateMode"
                    >
                        <el-option value="date" label="日期"></el-option>
                        <el-option value="quantum" label="时间段"></el-option>
                    </el-select>
                </div>
                <div class="customMain__item-flex">
                    <span class="customMain__desc">默认提醒</span>
                    <el-select
                        class="customMain__inputWidth"
                        v-model="taskDefault.defaultNotify"
                    >
                        <el-option value="0" label="准时"></el-option>
                        <el-option value="5" label="提前5分钟"></el-option>
                        <el-option value="30" label="提前30分钟"></el-option>
                        <el-option value="60" label="提前1小时"></el-option>
                    </el-select>
                </div>
                <div class="customMain__item-flex">
                    <span class="customMain__desc">默认优先级</span>
                    <el-select
                        class="customMain__inputWidth"
                        placeholder="无"
                        v-model="taskDefault.defaultPriority"
                    >
                        <el-option value="low" label="低"></el-option>
                        <el-option value="mid" label="中"></el-option>
                        <el-option value="high" label="高"></el-option>
                    </el-select>
                </div>
                <div class="customMain__item-flex">
                    <span class="customMain__desc">默认添加到清单</span>
                    <el-select
                        class="customMain__inputWidth"
                        v-model.number="taskDefault.defaultList"
                    >
                        <el-option
                          v-for="list in userLists"
                          :key="list.listId"
                          :value="list.listId"
                          :label="list.listName" 
                        />
                    </el-select>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <div class="customBottom">
        <el-button 
            class="customBottom__completeBtn"
            @click="handleCustomSettingsPost"
        >提交</el-button>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { reactive, toRefs, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../api/index'

// 获取 customSetting 状态管理仓库
const store = useStore()
const customSetting = store.state.customSetting

// 获取清单列表
const userLists = store.state.lists.userLists

// 功能模块循环渲染集合
const functionModels = [
    { functionName: '专注', functionIcon: '&#xe638;', functionFlag: 'focus' },
    { functionName: '打卡', functionIcon: '&#xe62b;', functionFlag: 'habit' },
    { functionName: '日历', functionIcon: '&#xe61c;', functionFlag: 'calender' }
]

// 需滚动的标题元素
const scrollDoms = toRefs(reactive({
    functionDom: null,
    dateDom: null,
    notifyDom: null,
    taskDom: null,
}))

// 监听状态管理仓库中 tabDom 的变化，使对应元素滚动到对应位置
watch(
    () => customSetting.tabDom,
    (tabDom) => {
        scrollDoms[tabDom].value.scrollIntoView(true)
    }
)

// 用户自定义设置初始化数据
const customSettings = reactive({
    functions: {
        calender: true,
        habit: true,
        focus: true
    },
    timeAndDate: {
        timeFormat: "24",
        firstDayOfWeek: "1"
    },
    notify: {
        "mailNotify": false,
        "webNotify": true
    },
    taskDefault: {
        defaultDate: "",
        defaultDateMode: "date",
        defaultNotify: "0",
        defaultPriority: "",
        defaultList: ""
    }
})

const { functions, timeAndDate, notify, taskDefault } = toRefs(customSettings)

// 获取用户自定义设置数据
;(async () => {
    try {
        let res = await request.getCustomSettings()
        if (res) {
            Object.assign(customSettings, res)
        }
    } catch (error) {
        console.log(`${error}`)
    }
})()

// 用户自定义设置数据提交
const handleCustomSettingsPost = () => {
    ElMessageBox.confirm('请确认是否提交', '确认框', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning',
    })
    .then(async () => {
        let res = await request.postCustomSettings(customSettings)
        if (res) {
            ElMessage.success('提交成功')
        }
    })
    .catch((err) => {
        console.log(`${err}`)
    })
}
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
.customMain {
    width: 80%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: .6rem;
    padding: .2rem 0 0 .2rem;
    box-sizing: border-box;
    overflow-y: hidden;
    font-size: .14rem;

    &__gap {
        border-bottom: 1px solid $devider-color;
        margin-right: .15rem;
        margin-bottom: .2rem;
    }

    &__title {
        font-size: .16rem;
        color: $base-fontColor;
        margin-bottom: .2rem;
    }

    &__item-flex {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: .18rem;
    }

    &__desc {
        color: $base-fontColor;
        width: 1rem;
        margin-right: .25rem;
    }

    &__inputWidth {
        width: 2.05rem;
    }

    &__inputWidth .el-input__inner::placeholder {
        font-size: 14px;
        color: #606266;
    }

    &__functions {
        &__content {
            display: flex;
            flex-wrap: wrap;
            margin-left: 12%;
        }

        &__item {
            display: flex;
            margin-right: auto;
            align-items: center;
            margin-right: .5rem;
            margin-bottom: .15rem;

            &__iconBackground {
                width: .41rem;
                height: .41rem;
                margin-right: .08rem;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: .05rem;
                background: rgba(255, 255, 255, 0.2);
            }

            &__cnt {
                display: flex;
                align-items: center;
            }

            &__switch {
                margin-right: .05rem;
            }
        }

        &__icon {
            color: $icon-color;
            font-size: .23rem;
        }
    }

    &__timeAndDate {
        &__desc {
            width: 0.9rem;
            margin-right: .25rem;
        }
    }

    &__notify {
        &__desc {
            width: 0.9rem;
            margin-right: .25rem;
        }

        &__timeSelect {
            width: 1.2rem;
            margin-right: .05rem;
            margin-bottom: .05rem;
        }

        &__paSelect {
            width: .8rem;
            transition: all .2s ease;
        }

        &__paSelect--hidden {
            transform: translateX(10px);
            opacity: 0;
            visibility: hidden;
        }
    }
}

.customBottom {
    width: 80%;
    height: .6rem;
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
}

@media screen and (max-width: 800px) {
  /* 设置底部及主界面响应式 */
  .customBottom, .customMain {
      width: 88%;
  }
}
</style>