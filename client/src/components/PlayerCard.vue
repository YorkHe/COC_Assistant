<template>
    <v-dialog>
        <v-btn
                height="32"
                slot="activator"
                flat
        >
            我的人物卡
        </v-btn>
        <v-card>
            <v-card-text>
                <v-stepper v-model="e1">
                    <v-stepper-header>
                        <v-stepper-step :complete="e1 > 1" step="1">属性随机</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="e1 > 2" step="2">属性调整</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="e1 > 3" step="3">职业</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="e1 > 4" step="4">技能</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="e1 > 5" step="5">背景</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="e1 > 6" step="6">装备与物品</v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step :complete="e1 > 7" step="7">总结</v-stepper-step>
                    </v-stepper-header>
                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <v-data-table
                                    :headers="header_random"
                                    :items="property_value"
                                    hide-actions
                            >
                                <template slot="items" slot-scope="props">
                                    <td>{{props.item.name}}</td>
                                    <td>{{props.item.value}}</td>
                                    <td>{{props.item.value / 2}}</td>
                                    <td>{{props.item.value / 5}}</td>
                                </template>
                            </v-data-table>
                            <v-btn
                                    @click="e1 = 2"
                            >
                                继续
                            </v-btn>
                            <p>请注意一旦确认之后不可返回</p>
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <v-layout>
                                <v-text-field
                                        label="年龄"
                                        hint="10岁"
                                >
                                </v-text-field>
                                <v-btn>
                                    确定
                                </v-btn>
                            </v-layout>
                            <p>剩余调整值: 0</p>
                            <v-data-table
                                    :headers="header_adjust"
                                    :items="property_value"
                                    hide-actions
                            >
                                <template slot="items" slot-scope="props">
                                    <td>{{props.item.name}}</td>
                                    <td>{{props.item.value}}</td>
                                    <td>
                                        <v-text-field
                                                v-bind:disabled="props.item.value == 10"
                                        ></v-text-field>
                                    </td>
                                </template>
                            </v-data-table>
                            <v-btn
                                    primary
                            >
                                随机分配调整值
                            </v-btn>
                            <v-btn
                                    primary
                            >
                                剩余教育检定次数: 1
                            </v-btn>
                            <v-btn
                                    @click="e1 = 3"
                            >
                                继续
                            </v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="3">
                            <v-text-field
                                    label="请选择一个职业"
                                    disabled
                            >
                            </v-text-field>

                            <v-layout
                                    row
                                    wrap
                            >
                                <v-chip
                                        v-for="(item, index) in occupations"
                                        :key="index"
                                >
                                    {{item.name}}
                                </v-chip>
                            </v-layout>

                            <div>
                                <h2>会计师</h2>
                                <p><span>信誉等级:</span>30-60</p>
                                <p><span>技能:</span> 会计，法律，图书馆，聆听，说服，侦察，任意其他两项个人或时代特长。</p>
                                <p><span>属性:</span>教育×4</p>
                                <p><span>描述:</span>
                                    "会计师可能在企业工作或作为自由会计师，为个体经营者和企业客户担任顾问。他们是优秀的研究者，既勤奋又关注细节，能够通过仔细分析个人和企业事务历史记录、财务报表和其他记录支持其他调查员。
                                </p>
                            </div>

                            <v-btn
                                    @click="e1 = 4"
                            >
                                继续
                            </v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="4">
                            <p>可分配的本职技能点: 0</p>
                            <p>可分配的兴趣技能点: 0</p>

                            <v-data-table
                                    :headers="header_skill"
                                    :items="skill_value"
                                    hide_actions
                            >
                                <template slot="items" slot-scope="props">
                                    <td>{{props.item.name}}</td>
                                    <td></td>
                                    <td>{{props.item.initial}}</td>
                                    <td>0</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </template>
                            </v-data-table>
                            <v-btn
                                    @click="e1=5"
                            >
                                继续
                            </v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="5">
                            <v-text-field
                                    label="个人描述"
                            >
                            </v-text-field>
                            <v-text-field
                                    label="思想与信念"
                            >
                            </v-text-field>
                            <v-text-field
                                    label="重要之人"
                            >
                            </v-text-field>
                            <v-text-field
                                    label="意义非凡之地"
                            >
                            </v-text-field>
                            <v-text-field
                                    label="宝贵之物"
                            >
                            </v-text-field>
                            <v-text-field
                                    label="特质"
                            >
                            </v-text-field>
                            <v-layout
                                    row
                                    wrap
                            >
                                <span>从下面的列表中选一个,或者</span>
                                <v-btn primary>随便挑一个</v-btn>
                            </v-layout>
                            <div>
                                <h2>个人描述</h2>
                                <ol>
                                   <li>
                                       你信仰并祈并一位大能。（例如毗沙门天、耶稣基督、海尔·塞拉西一世）
                                   </li>
                                    <li>
                                       你信仰并祈并一位大能。（例如毗沙门天、耶稣基督、海尔·塞拉西一世）
                                   </li>
                                    <li>
                                       你信仰并祈并一位大能。（例如毗沙门天、耶稣基督、海尔·塞拉西一世）
                                   </li>
                                </ol>
                            </div>
                            <v-btn
                                    @click="e1=6"
                            >
                                继续
                            </v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="6">
                            <b>你的信用评级是: 0 身无分文</b>
                            <p>连贫穷都够不上的人才能够叫做身无分文。 住所：大概只有睡大街。 旅行：步行，扒车或逃票上火车轮船。 </p>
                            <p>现金: 0 </p>
                            <p>其他资产: 0</p>
                            <p>消费水平: 0</p>
                            <v-divider></v-divider>
                            <b>装备</b>
                            <v-text-field
                                    label="你身上带有的装备"
                            ></v-text-field>
                            <v-layout
                                    row
                                    wrapper
                            >
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                            </v-layout>
                            <v-divider></v-divider>
                             <b>武器</b>
                            <v-text-field
                                    label="你身上带有的武器"
                            ></v-text-field>
                            <v-layout
                                    row
                                    wrapper
                            >
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                                <v-chip>1</v-chip>
                            </v-layout>
                            <v-btn
                                    @click="e1=7"
                            >继续</v-btn>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    var occupation = require("../data/occupation")
    export default {
        data() {
            return {
                occupations: occupation.data,
                header_random: [
                    {
                        text: "属性",
                        align: "left",
                        value: "name",
                        sortable: false,
                    },
                    {
                        text: "数值",
                        value: "value",
                        sortable: false,
                    },
                    {
                        text: "二分数",
                        sortable: false,
                    },
                    {
                        text: "五分数",
                        sortable: false,
                    }
                ],
                header_adjust: [
                    {
                        text: "属性",
                        align: "left",
                        value: "name",
                        sortable: false,
                    },
                    {
                        text: "初始值",
                        sortable: false,
                    },
                    {
                        text: "调整值",
                        sortable: false,
                    }
                ],
                header_skill: [
                    {
                        text: "技能名称",
                        align: "left",
                    },
                    {
                        text: "本职",
                    },
                    {
                        text: "初始",
                    },
                    {
                        text: "成长",
                    },
                    {
                        text: "职业",
                    },
                    {
                        text: "兴趣",
                    },
                    {
                        text: "总值",
                    },
                    {
                        text: "1/2",
                    },
                    {
                        text: "1/5"
                    }
                ],
                property_value: [
                    {
                        name: "力量",
                        value: 10,
                    },
                    {
                        name: "力量",
                        value: 10,
                    }, {
                        name: "力量",
                        value: 10,
                    }, {
                        name: "力量",
                        value: 10,
                    }, {
                        name: "力量",
                        value: 10,
                    }, {
                        name: "力量",
                        value: 10,
                    },
                ],
                skill_value: [
                    {
                        name: "会计",
                        initial: 5,
                    },
                    {
                        name: "会计",
                        initial: 5,
                    },
                    {
                        name: "会计",
                        initial: 5,
                    },
                    {
                        name: "会计",
                        initial: 5,
                    },
                    {
                        name: "会计",
                        initial: 5,
                    },
                    {
                        name: "会计",
                        initial: 5,
                    },
                    {
                        name: "会计",
                        initial: 5,
                    },
                    {
                        name: "会计",
                        initial: 5,
                    },
                    {
                        name: "会计",
                        initial: 5,
                    },
                ],
                e1: 0
            }
        },
        name: "PlayerCard"
    }
</script>

<style scoped>

</style>