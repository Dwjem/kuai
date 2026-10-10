# 休息排班生成

## /generate，生成接口
+ mounth ：哪个月的排班
+ startDay ：从｛mounth｝月的哪一天开始
+ intervalDays ：休息日间隔

## /update,更新列表

+ restDays：原始休息日列表
+ oldDay：要改的日期
+ newDay：新的日期
+ intervalDays：间隔
+ mounth：哪个月

## /add,在列表中多加一天
+ restDays：原始休息日列表
+ intervalDays：间隔
+ days：加哪天，可以是多个，中间用逗号间隔
+ mounth：哪个月

项目中我安装了lodash和dayjs，可以用于时间计算和补零等其他操作，不需要重复造轮子