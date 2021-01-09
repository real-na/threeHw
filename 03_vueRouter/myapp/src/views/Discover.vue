<template>
    <div class="discover m-5">
        <!-- 排序按钮 -->
        <header>
            <el-button class="price-sort"
            @click="changeSort('price')">价格排序
                <span>
                    <i :class="{
                        'el-icon-top':sort==='price,1',
                        'el-icon-bottom':sort==='price,-1'
                    }"></i>
                </span>
            </el-button>
            <el-button
            @click="changeSort('commentCount')">评论数
                <span>
                    <i :class="{
                        'el-icon-top':sort==='commentCount,1',
                        'el-icon-bottom':sort==='commentCount,-1'
                    }"></i>
                </span></el-button>
        </header>
        <!-- 商品列表 -->
        <el-row :gutter="30">
            <el-col
                :xs="24" :sm="12" :md="8" :lg="6" 
                v-for="item in dataList"
                :key="item._id">
                <el-card :body-style="{ padding: '0px', height: '400px'}" class="p-3 m-5"
                @click.native="gotoDetail(item.ppid)">
                    <img :src="item.imagePath" class="image" />
                    <div class="list-text">
                        <span>{{ item.name }}</span>
                        <div class="bottom clearfix">
                            <p class="price">
                                价格：<span>{{ item.price }}</span>
                            </p>
                            <p class="comment">
                                评论数：<span>{{ item.commentCount }}</span>
                            </p>
                            <el-button type="text" class="button"
                                >查看详情</el-button
                            >
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 分页器 -->
        <el-pagination
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            :page-sizes="[8, 20, 40, 60]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
import goodsApi from "../api/goodsApi";
export default {
    data() {
        return {
            dataList: [],
            page: 1,
            size: 8,
            sort: "",//-1表示降序，1表示升序
            query: {}, //query查询条件
            total: 1,
        };
    },

    created() {
        this.getData();
    },

    methods: {
        // 获取数据
        async getData() {
            let { page, size, sort, query } = this;
            const { data } = await goodsApi.getList({
                page,
                size,
                sort,
                query,
            });
            if (data.flag) {
                this.dataList = data.data;
                this.total = data.total;
            }
        },
        //改变排序方式
        changeSort(type){
            this.sort = `${type},${(this.sort&&this.sort.includes('-'))?'1':'-1'}`;
            console.log("change",this.sort);
            this.getData();
        },
        // 每页条数改变
        sizeChange(pageSize){
            this.size = pageSize;
            this.getData();
        },
        //当前页码改变
        currentChange(currentPage){
            this.page = currentPage;
            this.getData();
        },
        // 跳转详情页
        gotoDetail(id){
            this.$router.push('/details/'+id);
        }
    },
};
</script>

<style scoped lang='scss'>
.discover{
    text-align: center;
    .el-row{
        text-align: center;
        .el-col{
            .el-card{
                img{
                    width: 200px;
                    height: 240px;
                }
                .list-text{
                    text-align: left;
                    span{
                        font-size: 1px;
                    }
                }
            }
        }
    }
}
</style>