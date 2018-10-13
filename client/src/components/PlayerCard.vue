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
                                    v-on:click="handlePropertyRandomize"
                            >
                                不高兴, 重新丢!
                            </v-btn>
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
                                        v-bind:disabled = "!age_changeable"
                                        v-model="age"
                                        label="年龄"
                                >
                                </v-text-field>
                                <v-btn
                                        @click="handleConfirmAge"
                                >
                                    确定
                                </v-btn>
                            </v-layout>
                            <p>{{age_description}}</p>
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
                                                v-model="props.item.adjust"
                                                v-bind:disabled="age_changeable || !current_age.hasOwnProperty(['adjust_category']) || !(current_age['adjust_category'].includes(props.item.name))"
                                        >
                                        </v-text-field>
                                    </td>
                                    <td>
                                        {{parseInt(props.item.value) + parseInt(props.item.adjust)}}
                                    </td>
                                </template>
                            </v-data-table>
                            <v-btn
                                    primary
                                    @click="handleLuckyEnhance"
                            >
                                剩余幸运检定次数: {{(current_age != null && current_age['lucky_enhance']) || 0}}
                            </v-btn>
                            <v-btn
                                    primary
                                    @click="handleEducationEnhance"
                            >
                                剩余教育检定次数: {{(current_age != null && current_age['education_enhance']) || 0}}
                            </v-btn>
                            <v-btn
                                    @click="e1 = 3"
                            >
                                继续
                            </v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="3">
                            <v-layout
                                    row
                                    wrap
                            >
                                <v-chip
                                        v-for="(item, index) in occupations"
                                        :key="index"
                                        v-on:click="handleJobSelection"
                                >
                                    {{item.name}}
                                </v-chip>
                            </v-layout>

                            <div
                                    class="ma-3"
                            >
                                <h2>{{(current_job != null && current_job['name']) || ""}}</h2>
                                <p><span>信誉等级:</span>{{(current_job != null && current_job['credit']) || ""}}</p>
                                <p><span>技能:</span> {{(current_job != null && current_job['skills']) || ""}}</p>
                                <p><span>属性:</span>{{(current_job != null && current_job['property']) || ""}}</p>
                                <p><span>描述:</span>
                                    {{(current_job != null && current_job['description']) || ""}}
                                </p>
                            </div>
                            <v-btn
                                    @click="e1 = 4"
                            >
                                继续
                            </v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="4">
                            <h2>职业: {{current_job.name}}</h2>
                            <p>技能: {{current_job.skills}}</p>
                            <p>可分配的本职技能点: {{job_point}}</p>
                            <p>可分配的兴趣技能点: {{interest_point}}</p>

                            <v-data-table
                                    :headers="header_skill"
                                    :items="skill_value"
                                    hide_actions
                            >
                                <template slot="items" slot-scope="props">
                                    <td>{{props.item.name}}</td>
                                    <td>{{props.item.initial}}</td>
                                    <td>{{props.item.growth}}</td>
                                    <td>
                                        <v-text-field
                                                v-model="props.item.job"
                                        >
                                        </v-text-field>
                                    </td>
                                    <td>
                                         <v-text-field
                                                v-model="props.item.interest"
                                        >
                                        </v-text-field>
                                    </td>
                                    <td>
                                        {{parseInt(props.item.initial) + parseInt(props.item.growth) + parseInt(props.item.job) + parseInt(props.item.interest)}}
                                    </td>
                                    <td>
                                        {{(parseInt(props.item.initial) + parseInt(props.item.growth) + parseInt(props.item.job) + parseInt(props.item.interest)) / 2}}
                                    </td>
                                    <td>
                                        {{(parseInt(props.item.initial) + parseInt(props.item.growth) + parseInt(props.item.job) + parseInt(props.item.interest))/5}}
                                    </td>
                                </template>
                            </v-data-table>
                            <v-btn
                                    @click="handleConfirmSkillPoint"
                            >
                                继续
                            </v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="5">
                            <v-layout
                                    wrap
                                    row
                            >
                                <v-text-field
                                        label="姓名"
                                >
                                </v-text-field>
                                <v-text-field
                                        label="性别"
                                >
                                </v-text-field>
                                <v-text-field
                                        label="出生地"
                                >
                                </v-text-field>
                            </v-layout>
                            <v-text-field
                                    v-on:focus="current_bg_title='个人描述'; current_bg_description=backgrounds.description"
                                    label="个人描述"
                            >
                            </v-text-field>
                            <v-text-field
                                    v-on:focus="current_bg_title='思想与信念'; current_bg_description=backgrounds.belief"
                                    label="思想与信念"
                            >
                            </v-text-field>
                            <v-text-field
                                    v-on:focus="current_bg_title='重要之人'; current_bg_description=backgrounds.important_person"
                                    label="重要之人"
                            >
                            </v-text-field>
                            <v-text-field
                                    v-on:focus="current_bg_title='意义非凡之地'; current_bg_description=backgrounds.important_place"
                                    label="意义非凡之地"
                            >
                            </v-text-field>
                            <v-text-field
                                    v-on:focus="current_bg_title='宝贵之物'; current_bg_description=backgrounds.important_object"
                                    label="宝贵之物"
                            >
                            </v-text-field>
                            <v-text-field
                                    v-on:focus="current_bg_title='特质'; current_bg_description=backgrounds.feature"
                                    label="特质"
                            >
                            </v-text-field>
                            <v-textarea
                                    label="背景故事"
                            >
                            </v-textarea>
                            <v-layout
                                    row
                                    wrap
                            >
                                <span>从下面的列表中选一个</span>
                            </v-layout>
                            <div>
                                <h2>{{current_bg_title}}</h2>
                                <ol>
                                   <li
                                           v-for="(item, index) in current_bg_description"
                                           :key="index"
                                   >
                                       {{item}}
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
                            <b>你的信用评级是: {{credit_value}} {{credit_item.name}}</b>
                            <p>{{credit_item.description}}</p>
                            <p>现金: {{credit_value * credit_item.cash }} </p>
                            <p>其他资产: {{credit_value * credit_item.asset}}</p>
                            <p>消费水平: {{credit_item.consume}}</p>
                            <v-divider></v-divider>
                            <b>装备</b>
                            <v-text-field
                                    label="你身上带有的装备"
                            ></v-text-field>
                            <v-divider></v-divider>
                             <b>武器</b>
                            <v-text-field
                                    label="你身上带有的武器"
                            ></v-text-field>
                            <v-btn
                                    @click="e1=7"
                            >继续</v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="7">
                            <PlayerCardSummary></PlayerCardSummary>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import PlayerCardSummary from "../components/PlayerCardSummary.vue"
    var occupation = require("../data/occupation")
    var skills = require("../data/skills")
    var background = require("../data/background")
    var credit = require("../data/credit").data
    export default {
        components: {PlayerCardSummary},
        created: function () {
            this.handlePropertyRandomize()
        },
        computed: {
            age_description: {
                get() {
                    for (let i = 0; i < this.age_array.length; i++) {
                        let item = this.age_array[i]
                        if (item["value_min"] <= this.age && item["value_max"] >= this.age) {
                            return item.description
                        }
                    }
                }
            },
            job_point: {
                get() {
                    let tokens = this.current_job.property.split("+")
                    let total = 0;
                    for(let index in tokens) {
                        let token=tokens[index]
                        var prop, value;
                        [prop, value] = token.split("×")
                        if (prop.includes("或")) {
                            var firstprop, secondprop;
                            [firstprop, secondprop] = prop.split("或")
                            let firstprop_item = this.property_value.find((x)=>{return x.name == firstprop})
                            let firstprop_value = firstprop_item.value + firstprop_item.adjust

                            let secondprop_item = this.property_value.find((x)=>{return x.name == secondprop})
                            let secondprop_value = secondprop_item.value + secondprop_item.adjust

                            total += Math.max(firstprop_value, secondprop_value) * value
                        } else {

                            let prop_item = this.property_value.find((x) => {
                                return x.name == prop
                            })
                            let prop_value = prop_item.value + prop_item.adjust

                            total += prop_value * value;
                        }
                    }

                    for (let index in this.skill_value) {
                        let skill = this.skill_value[index];
                        total -= parseInt(skill.job)
                    }

                    return total
                }
            },
            interest_point: {
                get() {
                    let interest_item = this.property_value.find((x)=>{return x.name == "智力"})
                    let total = (interest_item.value + interest_item.adjust) * 2

                    for (let index in this.skill_value) {
                        let skill = this.skill_value[index];
                        total -= parseInt(skill.interest)
                    }

                    return total
                }
            },
            credit_value: {
                get() {
                    let credit_item = this.skill_value.find((x) => {return x.name == "信用评级"})
                    let total = (parseInt(credit_item.initial)+ parseInt(credit_item.growth) + parseInt(credit_item.job) + parseInt(credit_item.interest))
                    return total
                }
            },
            credit_item: {
                get() {
                    let value = this.credit_value;
                    for (let index in credit) {
                        let item = credit[index]
                        if (parseInt(item.credit_min) <= value && parseInt(item.credit_max) >= value) {
                            return item
                        }
                    }
                }
            },
        },
        data() {
            return {
                age: 0,
                backgrounds: background.data,
                current_bg_title: "个人描述",
                current_bg_description: background.data.description,
                occupations: occupation.data,
                current_age: null,
                current_job: {
                    "index": 2,
                    "name": "会计师",
                    "credit": "30-70",
                    "property": "教育×4",
                    "skill_point": 0,
                    "skills": "会计，法律，图书馆，聆听，说服，侦察，任意其他两项个人或时代特长。",
                    "relations": "生意伙伴，法律界，金融业界(银行，其他会计师)。",
                    "description": "会计师可能在企业工作或作为自由会计师，为个体经营者和企业客户担任顾问。他们是优秀的研究者，既勤奋又关注细节，能够通过仔细分析个人和企业事务历史记录、财务报表和其他记录支持其他调查员。"
                },
                age_changeable: true,
                age_array: [
                        {
                            "value_min": Number.MIN_VALUE,
                            "value_max": 14,
                            "description": "小朋友, 快去写作业吧, 别来跑团了.",
                            "valid": false,
                        },
                        {
                            "value_min" : 15,
                            "value_max" : 19,
                            "description": "力量和体型合计减5点。教育减５点。 决定幸运值时可以骰2次并取较好的一次。",
                            "lucky_enhance": 1,
                            "education_reduce": 5,
                            "adjust_total": 5,
                            "adjust_category": ["力量", "体型"]
                        },
                        {
                            "value_min" : 20,
                            "value_max" : 39,
                            "description": "对教育进行１次增强检定。",
                            "education_enhance": 1
                        },
                        {
                            "value_min" : 40,
                            "value_max" : 49,
                            "description": "对教育进行２次增强检定。力量体质敏捷合计减5点。外貌减5点。",
                            "education_enhance": 2,
                            "adjust_total": 5,
                            "adjust_category": ["力量", "体质", "敏捷"],
                            "reduce_app": 5
                        },
                        {
                            "value_min" : 50,
                            "value_max" : 59,
                            "description": "对教育进行３次增强检定。力量体质敏捷合计减10点。外貌减10点。",
                            "education_enhance": 3,
                            "adjust_total": 10,
                            "adjust_category": ["力量", "体质", "敏捷"],
                            "reduce_app": 10
                        },
                        {
                            "value_min" : 60,
                            "value_max" : 69,
                            "description": "对教育进行４次增强检定。力量体质敏捷合计减20点。外貌减15点。",
                            "education_enhance": 4,
                            "adjust_total": 20,
                            "adjust_category": ["力量", "体质", "敏捷"],
                            "reduce_app": 15
                        },
                        {
                            "value_min" : 70,
                            "value_max" : 79,
                            "description": "对教育进行４次增强检定。力量体质敏捷合计减40点。外貌减20点。",
                            "education_enhance": 4,
                            "adjust_total": 40,
                            "adjust_category": ["力量", "体质", "敏捷"],
                            "reduce_app": 20
                        },
                        {
                            "value_min" : 80,
                            "value_max" : 89,
                            "description": "对教育进行４次增强检定。力量体质敏捷合计减80点。外貌减25点。",
                            "education_enhance": 4,
                            "adjust_total": 80,
                            "adjust_category": ["力量", "体质", "敏捷"],
                            "reduce_app": 25
                        },
                        {
                            "value_min" : 90,
                            "value_max" : Number.MAX_VALUE,
                            "description": "对不起, 养老院不让你出门",
                            "valid": false
                        },
                    ],
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
                    },
                    {
                        text: "最终值",
                        sortable: false,
                    }
                ],
                header_skill: [
                    {
                        text: "技能名称",
                        align: "left",
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
                        adjust: 0,
                    },
                    {
                        name: "体质",
                        value: 10,
                        adjust: 0,
                    }, {
                        name: "体型",
                        value: 10,
                        adjust: 0,
                    }, {
                        name: "敏捷",
                        value: 10,
                        adjust: 0,
                    }, {
                        name: "外貌",
                        value: 10,
                        adjust: 0,
                    }, {
                        name: "智力",
                        value: 10,
                        adjust: 0,
                    },{
                        name: "意志",
                        value: 10,
                        adjust: 0,
                    },{
                        name: "教育",
                        value: 10,
                        adjust: 0,
                    },{
                        name: "幸运",
                        value: 10,
                        adjust: 0,
                    },
                ],
                skill_value: skills.data,
                e1: 1
            }
        },
        methods: {
            getRandomInteger(max) {
                return Math.floor(Math.random() * Math.floor(max-1)) + 1;
            },
            handleConfirmAge() {
                for (let i = 0; i < this.age_array.length; i++) {
                    let item = this.age_array[i]
                    if (item["value_min"] <= this.age && item["value_max"] >= this.age) {
                        if (item.hasOwnProperty("valid") && item.valid == false) {
                            alert("对不起, 你不能选择这个年龄")
                            return;
                        }
                        this.current_age = item
                        break;
                    }
                }
                this.age_changeable = false

                if (this.current_age.hasOwnProperty("reduce_app")) {
                    let target_index = this.property_value.findIndex((x)=>{
                        return x.name == "外貌"
                    })

                    let target_item = this.property_value[target_index];

                    Object.assign(this.property_value[target_index], {
                        name: target_item.name,
                        value: target_item.value,
                        adjust: -1 * this.current_age["reduce_app"]
                    })
                }
            },
            handleLuckyEnhance() {
                let value = this.getRandomInteger(6) + this.getRandomInteger(6) + this.getRandomInteger(6);
                value = value * 5;

                let lucky_index = this.property_value.findIndex((x)=>{return x.name == "幸运"})
                let lucky_item = this.property_value[lucky_index];
                if (lucky_item.value < value) {
                    Object.assign(this.property_value[lucky_index], {
                        name: lucky_item.name,
                        value: value,
                        adjust: 0
                    })
                }
                alert("幸运检定(3d6 * 5)结果: " + value);
                this.current_age.lucky_enhance -= 1;
            },
            handleEducationEnhance() {
                let d100value = this.getRandomInteger(100);
                let d10value = this.getRandomInteger(10);

                let edu_index = this.property_value.findIndex((x)=>{return x.name == "教育"})
                let edu_item = this.property_value[edu_index];
                if (edu_item.value < d100value) {
                    Object.assign(this.property_value[edu_index], {
                        name: edu_item.name,
                        value: edu_item.value,
                        adjust: Math.min(99-edu_item.adjust-d10value-edu_item.value, edu_item.adjust + d10value)
                    })
                }
                alert("教育增强检定结果: (1d100)" +d100value +"(1d10)" + d10value)

                this.current_age.education_enhance-= 1;
            },
            handlePropertyRandomize(event) {
                if (event) event.preventDefault()
                for (let i = 0; i < this.property_value.length; i++) {
                    if (["力量", "体质", "敏捷", "外貌", "意志", "幸运"].includes(this.property_value[i].name)) {
                        let value = this.getRandomInteger(6) + this.getRandomInteger(6) + this.getRandomInteger(6);
                        value = value * 5;
                        Object.assign(this.property_value[i], {name: this.property_value[i].name, value: value})
                    }

                    if (["体型", "智力", "教育"].includes(this.property_value[i].name)) {
                        let value = this.getRandomInteger(6) + this.getRandomInteger(6) + 6;
                        value = value * 5;
                        this.property_value[i].value = value
                        Object.assign(this.property_value[i], {name: this.property_value[i].name, value: value})
                    }
                }
            },
            handleConfirmSkillPoint(){
                if (this.job_point == 0 && this.interest_point == 0) {
                    this.e1 += 1
                    return;
                }

                if (this.job_point < 0 || this.interest_point < 0) {
                    alert("本职技能点或者兴趣技能点超出应有值");
                    return;
                }

                if (this.job_point > 0 || this.interest_point > 0) {
                    if (confirm("你还有未分配完的技能点,确定要继续吗")){
                        this.e1 += 1
                    }
                }
            },
            handleJobSelection(event) {
                if (event) event.preventDefault()
                let item = this.occupations.find((x)=>{return x.name==event.target.innerText})
                Object.assign(this.current_job, item)
            }
        },
        name: "PlayerCard"
    }
</script>

<style scoped>

</style>