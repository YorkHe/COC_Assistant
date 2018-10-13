<template>
    <v-app id="inspire">
        <v-navigation-drawer
                v-model="drawer"
                fixed
                app
                permanent
        >
            <v-list dense>
                <v-subheader>
                    KP
                </v-subheader>
                <v-list-tile
                        v-for="(item, index) in KP"
                        :key="index"
                >
                    <v-list-tile-action>
                        <v-icon>person</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{item}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider>
                </v-divider>
                <v-subheader>
                    PC
                </v-subheader>
                <v-list-tile
                        v-for="(item, index) in PC"
                        :key="index"
                >
                    <v-list-tile-action>
                        <v-icon>child_care</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{item}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fixed app>
            <v-toolbar-title>Call of Cthulu</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <PlayerCard></PlayerCard>
            </v-toolbar-items>
        </v-toolbar>

        <v-content>
            <v-container fluid fill-height id="msg_container">
                <v-list
                        style="background: rgba(0,0,0,0);"
                >
                    <v-card
                            v-for="(item, index) in messages"
                            :key="index"
                    >
                        <v-card-text class="ma-4 pa-4">
                            {{item.msg}}
                        </v-card-text>
                    </v-card>
                </v-list>
            </v-container>
        </v-content>
        <v-footer height="auto" color="primary lighten-1" fixed app class="ma-8 pa-2">
            <v-layout
                    justify-center
                    row
                    wrap
            >
                <v-flex row>
                    <v-text-field
                            v-model="msg"
                            solo
                            hide-details
                    ></v-text-field>
                </v-flex>
                <v-btn
                        @click="handleSendButtonOnClick"
                >发送</v-btn>
                <v-dialog
                        width="600"
                >
                    <v-btn
                            slot="activator"
                    >检定</v-btn>
                    <v-card>
                        <v-card-title
                                class="headline"
                                primary-title
                        >
                            请选择要检定的对象
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <span class="text-sm-center" style="margin: auto;">检定</span>
                                    <v-flex sm4>
                                        <v-text-field disabled label="属性/技能" v-model="prop_name"></v-text-field>
                                    </v-flex>
                                    <v-flex sm4>
                                        <v-text-field  disabled label="点数" width="14" v-model="_dice_result1"></v-text-field>
                                    </v-flex>
                                    <span class="text-sm-center" style="margin: auto;">+</span>
                                    <v-flex sm3>
                                        <v-text-field label="偏移" width="14" v-model="bias_value"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-subheader>
                                    属性
                                </v-subheader>
                                <v-layout row wrap>
                                    <v-chip
                                            v-for="(item, index) in properties"
                                            :key="index"
                                            v-on:click="handlePropertySelect('property', $event)"
                                    >
                                        {{item.title}}
                                    </v-chip>
                                </v-layout>
                                <v-subheader>
                                    技能
                                </v-subheader>
                                <v-layout row wrap>
                                    <v-chip
                                            v-for="(item, index) in skills"
                                            :key="index"
                                            v-on:click="handlePropertySelect('skill', $event)"
                                    >
                                        {{item.title}}
                                    </v-chip>
                                </v-layout>
                                <v-subheader>
                                    骰子
                                </v-subheader>
                                <v-layout row wrap>
                                    <v-chip
                                            v-for="(item, index) in dices"
                                            :key="index"
                                            v-on:click="handleDiceSelect(dice_count1, $event)"
                                    >
                                        {{item}}
                                    </v-chip>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat v-on:click="handleClearExamine">清除</v-btn>
                            <v-btn flat>丢!</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog
                        v-model="dialog2"
                        width="500"
                >
                    <v-btn
                            slot="activator"
                    >
                        掷骰
                    </v-btn>
                    <v-card>
                        <v-card-title>
                            请选择要投掷的骰子
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex sm5>
                                        <v-text-field disabled label="点数" width="14" v-model="_dice_result2"></v-text-field>
                                    </v-flex>
                                    <span class="text-sm-center" style="margin: auto;">+</span>
                                    <v-flex sm5>
                                        <v-text-field label="偏移" width="14" v-model="bias2"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-subheader>
                                    骰子
                                </v-subheader>
                                <v-layout row wrap>
                                    <v-chip
                                            v-for="(item, index) in dices"
                                            :key="index"
                                            v-on:click="handleDiceSelect(dice_count2, $event)"
                                    >
                                        {{item}}
                                    </v-chip>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    @click="handleRollDice($event, _dice_result2, dice_count2, bias2, true)"
                                    flat
                            >
                                暗投
                            </v-btn>
                            <v-btn
                                    @click="handleRollDice($event, _dice_result2, dice_count2, bias2, false)"
                                    flat>丢!</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
        </v-footer>
        <v-dialog v-model="register_dialog" persistent max-width="300">
            <v-card>
                <v-card-title>
                    调查员, 欢迎来到这个房间, 你的名字是?
                </v-card-title>
                <v-card-text>
                    <v-layout
                            wrap
                            row
                    >

                        <v-text-field
                                v-model="user_name"
                                label="名字"
                        >
                        </v-text-field>
                        <v-switch
                                :label="`我是KP: ${isKP.toString()}`"
                                v-model="isKP"
                        >

                        </v-switch>

                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spaer></v-spaer>
                    <v-btn
                            @click="handleRegisterButtonClicked"
                    >确认</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>
<style>
</style>

<script>
    import PlayerCard from "./components/PlayerCard.vue"

    export default {
        components: {
            PlayerCard
        },
        data: () => ({
            isConnected: false,
            isKP: false,
            register_dialog: true,
            socketMessage: '',
            bias_value:0,
            prop_name:"",
            dice_count1:[],
            dice_count2:[],
            dice_result1:"",
            dice_result2:"",
            bias1: "0",
            bias2: "0",
            msg: "",
            dialog1: false,
            dialog2: false,
            slider1: 50,
            slider2: 50,
            KP: [
            ],
            PC: [
            ],
            properties: [
                {title: "力量", name : "STR"},
                {title: "体质", name : "CON"},
                {title: "体型", name : "SIZ"},
                {title: "敏捷", name : "DEX"},
                {title: "外貌", name : "APP"},
                {title: "智力", name : "INT"},
                {title: "灵感", name : "IDEA"},
                {title: "意志", name : "POW"},
                {title: "教育", name : "EDU"},
                {title: "移动力", name : "MOV"},
                {title: "幸运", name : "LUCKY"},
            ],
            skills: [
                {title: "人类学", name: "Human"},
                {title: "人类学", name: "Human"},
                {title: "人类学", name: "Human"},
                {title: "人类学", name: "Human"},
                {title: "人类学", name: "Human"},
                {title: "人类学", name: "Human"},
            ],
            dices:[
                "d4",
                "d6",
                "d8",
                "d10",
                "d100",
                "d12",
                "d20"
            ],
            messages: [
            ]
        }),
        computed: {
            _dice_result1: {
                set: function (value) {
                    this.dice_result1=value
                },
                get: function () {
                    return this.dice_count1.map(item=> item.value + item.name).concat()
                }
            },
             _dice_result2: {
                set: function (value) {
                    this.dice_result2=value
                },
                get: function () {
                    return this.dice_count2.map(item=> item.value + item.name).concat()
                }
            },

        },
        props: {
            source: String
        },
        sockets: {
            connect() {
                this.isConnected = true;
            },
            disconnect() {
                this.isConnected = false;
            },
            customEmit(val){
                this.messages.push(val)
            },
            message(data) {
                this.messages.push(data)
            },
            playerList(data) {
                this.KP = data.KP
                this.PC = data.PC
            },
            setToken(data){
                document.cookie = data
            }
        },
        updated(){
            window.scrollTo(0,document.body.scrollHeight - 100);
        },
        methods: {
            handleSendButtonOnClick(event) {
                if(event) event.preventDefault()
                this.$socket.emit("message", {
                    msg: this.msg,
                    token: document.cookie
                })
                this.msg = ""
            },
            handlePropertySelect(type, event) {
                if (event) event.preventDefault()
                this.prop_name = event.target.innerText
            },
            handleDiceSelect(dice_count, event) {
                if (event) event.preventDefault()
                for(let i = 0; i < dice_count.length; i++) {
                    let obj = dice_count[i];
                    if (obj.name == event.target.innerText) {
                        obj.value ++
                        return
                    }
                }
                dice_count.push({
                    name: event.target.innerText,
                    value: 1,
                })
            },
            handleClearExamine(event){
                if (event) event.preventDefault()
                this.prop_name = ""
                this.dice_count1 = []
            },
            handleRollDice(event, dice_result, dice_count, bias, dark){
                if (event) event.preventDefault()
                this.$socket.emit("dice", {
                    token: document.cookie,
                    dices:dice_count,
                    dice_name: dice_result,
                    dark: dark,
                    bias: bias||0
                })
                dice_count.splice(0, dice_count.length)
                bias = 0
                this.dialog2 = false;
            },
            handleRegisterButtonClicked() {
                this.$socket.emit("register", {name: this.user_name, type: this.isKP?"KP":"PC", token:document.cookie})
                this.register_dialog=false
            }
        }
    }
</script>