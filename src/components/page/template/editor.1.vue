<template>
    <section class="editBox">
        <div class="edit" id="edit" contenteditable="true">
            <div><br></div>
            <!-- <input size="16" type="text"  class="selectInput"  readonly placeholder="选择日期"> -->
        </div>
        <div class="btnBox">
            <button @click="addInput">输入框</button>
            <button @click="timeInput">时间选择</button>
        </div>
    </section>
</template>
<script>
    import draggable from 'vuedraggable';   
    import '@/assets/js/plugin/bootstrap-datepicker.js';
    import '@/assets/css/datepicker3.css';
    export default{
        data(){
            return{

            }
        },
        methods:{
            addInput(){
                $('#edit').children("div:last-child").append(`<textarea></textarea>`)
            },
            getContext(){
                this.InnerHtml = $('#edit').html();
            },
            timeInput(){
                var This = this;
                var dateInput = '<div style="position:relative;"><input size="16" type="text"  class="selectInput"  readonly placeholder="选择日期"></div>'
                $('#edit').children("div:last-child").append(dateInput);
                $('#edit .selectInput').each(function(index, element) {
                    This.initDatePicker($(this))
                });;
            },
            initDatePicker(el){
                el.datepicker({
                    todayBtn: "linked",
                    startDate:new Date(),
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    todayHighlight: true,
                    format: 'yyyy-mm-dd',  
                    
                }).on("changeDate",(e) => {

                });
            }
        },
        mounted(){
        }
    }
</script>
