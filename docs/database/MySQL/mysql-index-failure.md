# MySQL索引失效

## 索引失效的情景

1. **在索引列上进行运算操作，索引将失效。**
2. **字符串类型字段使用时，不加引号，索引将失效。**
3. **模糊查询中，如果仅仅是尾部模糊匹配，索引不会是失效；如果是头部模糊匹配，索引失效。**
4. **用 or 分割开的条件，如果 or 其中一个条件的列没有索引，那么涉及的索引都不会被用到。**
5. **如果 MySQL 评估使用索引比全表更慢，则不使用索引。**
6. **若是联合索引，如果不遵循最左前缀原则，也会导致索引失效。**

给出一个tb_user表格

```bash
mysql> select * from tb_user;
  
 5 rows in set (0.00 sec)
 
```

| id   | name   | email                                   | phone       | profession       | age  | gender | status | create_time         |
| ---- | ------ | --------------------------------------- | ----------- | ---------------- | ---- | ------ | ------ | ------------------- |
| 1    | 孙悟空 | [1111@qq.com](mailto:1111@qq.com)       | 11111111111 | 软件工程         | 500  | 1      | 1      | 2022-06-20 11:35:11 |
| 2    | 周瑜   | [1121@qq.com](mailto:1121@qq.com)       | 11111111112 | 软件工程2        | 50   | 1      | 0      | 2022-06-20 11:35:11 |
| 3    | 孙尚香 | [1113@qq.com](mailto:1113@qq.com)       | 11111111113 | 计算机科学与技术 | 30   | 2      | 2      | 2022-06-20 11:35:11 |
| 4    | 白龙马 | [1114@qq.com](mailto:1114@qq.com)       | 11111111114 | 飞翔科学         | 300  | 1      | 0      | 2022-06-20 11:35:11 |
| 5    | 唐曾   | [1115@qq.com](mailto:1115@qq.com)       | 11111111115 | 软件工程         | 50   | 1      | 5      | 2022-06-20 11:35:11 |
| 6    | 鲁智深 | [11751@qq.com](mailto:11751@qq.com)     | 11111111116 | PS               | 22   | 1      | 4      | 2022-06-20 11:35:11 |
| 7    | 孙悟空 | [112011@3qq.com](mailto:112011@3qq.com) | 11111111117 | 物流管理         | 30   | 1      | 3      | 2022-06-20 11:35:11 |

```bash
 # 给phone字段个name字段给了索引
 mysql> SHOW INDEX FROM tb_user; 
 6 rows in set (0.00 sec)
```

| Table   | Non_unique | Key_name       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible |
| ------- | ---------- | -------------- | ------------ | ----------- | --------- | ----------- | -------- | ------ | ---- | ---------- | ------- | ------------- | ------- |
| tb_user | 0          | PRIMARY        | 1            | id          | A         | 12          | NULL     | NULL   |      | BTREE      |         |               | YES     |
| tb_user | 0          | idx_user_phone | 1            | phone       | A         | 12          | NULL     | NULL   | YES  | BTREE      |         |               | YES     |
| tb_user | 1          | idx_user_name  | 1            | name        | A         | 11          | NULL     | NULL   | YES  | BTREE      |         |               | YES     |

> 此表格展示了数据库表`tb_user`的索引详情，包括索引是否唯一(`Non_unique`)、索引名称(`Key_name`)、列在索引中的顺序(`Seq_in_index`)、列名(`Column_name`)、字符集排序规则(`Collation`)、索引中唯一值的数量(`Cardinality`)、列前缀长度(`Sub_part`)、索引压缩(`Packed`)、列是否允许NULL值(`Null`)、索引类型(`Index_type`)、注释(`Comment`)以及索引的可见性(`Visible`)。

### **1、在索引列上进行运算操作(数学运算、函数或表达式)，索引将失效。**

```bash
# 当对phone进行操作时，索引会失效 explain 中的key为null
 mysql> select * from tb_user where substring(phone, 10, 2) = '15';
1 row in set (0.00 sec)
```

| id   | name | email                             | phone       | profession | age  | gender | status | create_time         |
| ---- | ---- | --------------------------------- | ----------- | ---------- | ---- | ------ | ------ | ------------------- |
| 5    | 唐曾 | [1115@qq.com](mailto:1115@qq.com) | 11111111115 | 软件工程   | 50   | 1      | 5      | 2022-06-20 11:35:11 |

```bash
 mysql> explain select * from tb_user where substring(phone, 10, 2) = '15';
 
 1 row in set, 1 warning (0.00 sec)
```

| id   | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
| ---- | ----------- | ------- | ---------- | ---- | ------------- | ---- | ------- | ---- | ---- | -------- | ----------- |
| 1    | SIMPLE      | tb_user | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 12   | 100.00   | Using where |

> 查询的标识符(`id`)、查询类型(`select_type`)、涉及的表(`table`)、分区(`partitions`)、访问类型(`type`)、可能使用的索引(`possible_keys`)、实际使用的索引(`key`)、索引长度(`key_len`)、参照(`ref`)、预计扫描的行数(`rows`)、过滤后的行比例(`filtered`)以及额外的信息(`Extra`)。
>
> - **type列**: 显示的是`ALL`，这表明进行了全表扫描，而不是通过索引来查找数据。如果是通过索引查找，这一列可能会显示`index`、`range`、`ref`或其他表明使用索引的类型。
> - **possible_keys列**: 值为`NULL`，表示没有可以使用的索引。如果有可用的索引，这个字段会列出可能被查询使用的索引名。
> - **key列**: 同样是`NULL`，意味着实际执行时没有使用任何索引。如果使用了索引，这里会显示所用索引的名称。



### **2、字符串类型字段使用时，不加引号，索引将失效。**

```bash
# phone 的类型是字符串，查找时，若加了"，会使用索引 key 为 idx_user_phone
 mysql> explain select * from tb_user where phone = '11111111115';
 
 1 row in set, 1 warning (0.00 sec)
 
 
# phone 的类型是字符串，查找时，若不加了"，不会使用索引 key 为 null
 mysql> explain select * from tb_user where phone = 11111111115;
 
 1 row in set, 3 warnings (0.00 sec)
```

| id   | select_type | table   | partitions | type  | possible_keys  | key            | key_len | ref   | rows | filtered | Extra |
| ---- | ----------- | ------- | ---------- | ----- | -------------- | -------------- | ------- | ----- | ---- | -------- | ----- |
| 1    | SIMPLE      | tb_user | NULL       | const | idx_user_phone | idx_user_phone | 63      | const | 1    | 100.00   | NULL  |



| id   | select_type | table   | partitions | type | possible_keys  | key  | key_len | ref  | rows | filtered | Extra       |
| ---- | ----------- | ------- | ---------- | ---- | -------------- | ---- | ------- | ---- | ---- | -------- | ----------- |
| 1    | SIMPLE      | tb_user | NULL       | ALL  | idx_user_phone | NULL | NULL    | NULL | 12   | 10.00    | Using where |

### **3、模糊查询中，如果仅仅是尾部模糊匹配，索引不会是失效；如果是头部模糊匹配，索引失效。**

```bash
# 在头部使用了%模糊查询，索引失效了
 mysql> explain select * from tb_user where profession like '%工程';
 
 1 row in set, 1 warning (0.00 sec)
 
# 在尾部使用模糊索引，索引不会失效
 mysql> explain select * from tb_user where profession like '工程%';
 
 1 row in set, 1 warning (0.00 sec)
 
# 在中间使用索引依然有效
 mysql> explain select * from tb_user where profession like '工%程';
 
 1 row in set, 1 warning (0.00 sec)
```

| id   | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
| ---- | ----------- | ------- | ---------- | ---- | ------------- | ---- | ------- | ---- | ---- | -------- | ----------- |
| 1    | SIMPLE      | tb_user | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 12   | 11.11    | Using where |



| id   | select_type | table   | partitions | type  | possible_keys         | key                   | key_len | ref  | rows | filtered | Extra                 |
| ---- | ----------- | ------- | ---------- | ----- | --------------------- | --------------------- | ------- | ---- | ---- | -------- | --------------------- |
| 1    | SIMPLE      | tb_user | NULL       | range | idx_user_pro_age_stat | idx_user_pro_age_stat | 83      | NULL | 1    | 100.00   | Using index condition |



| id   | select_type | table   | partitions | type  | possible_keys         | key                   | key_len | ref  | rows | filtered | Extra                 |
| ---- | ----------- | ------- | ---------- | ----- | --------------------- | --------------------- | ------- | ---- | ---- | -------- | --------------------- |
| 1    | SIMPLE      | tb_user | NULL       | range | idx_user_pro_age_stat | idx_user_pro_age_stat | 83      | NULL | 1    | 100.00   | Using index condition |

### **4、用 or 分割开的条件，如果 or 其中一个条件的列没有索引，那么涉及的索引都不会被用到。**

```bash
# id是主键索引，age没有设置索引 where id = 1 or age = 50 不会走索引
 mysql> explain select * from tb_user  where id = 1 or age = 50;
 
 1 row in set, 1 warning (0.00 sec)
 
# id是主键索引，phone设置成了唯一索引 id = 1 or phone = '11111111112'; 这样会走索引
 mysql> explain select * from tb_user where id = 1 or phone = '11111111112';
 
 1 row in set, 1 warning (0.00 sec)
```

| id   | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
| ---- | ----------- | ------- | ---------- | ---- | ------------- | ---- | ------- | ---- | ---- | -------- | ----------- |
| 1    | SIMPLE      | tb_user | NULL       | ALL  | PRIMARY       | NULL | NULL    | NULL | 12   | 17.50    | Using where |



| id   | select_type | table   | partitions | type        | possible_keys          | key                    | key_len | ref  | rows | filtered | Extra                                            |
| ---- | ----------- | ------- | ---------- | ----------- | ---------------------- | ---------------------- | ------- | ---- | ---- | -------- | ------------------------------------------------ |
| 1    | SIMPLE      | tb_user | NULL       | index_merge | PRIMARY,idx_user_phone | PRIMARY,idx_user_phone | 4,63    | NULL | 2    | 100.00   | Using union(PRIMARY,idx_user_phone); Using where |



### 5、如果 MySQL 评估使用索引比全表更慢，则不使用索引。因为需要回表

```bash
# tb_user中给出的十多条数据中  phone > '11111111121' 的数据只有一条，所占的比例非常低，这时会使用索引
 mysql> explain select * from tb_user where phone > '11111111121';
 
 1 row in set, 1 warning (0.00 sec)
 
 
# tb_user中给出的十多条数据中  phone < '11111111121' 的数据只有90%，所占的比例非常高，这时MySQL自己就会进行评估了，如果使用索引用的时间还没有全表扫描用的时间多，干脆全表扫描(这时使用索引可能用时更多，主要需要回表)
 mysql> explain select * from tb_user where phone < '11111111121';
 
 1 row in set, 1 warning (0.00 sec)
```

| id   | select_type | table   | partitions | type  | possible_keys  | key            | key_len | ref  | rows | filtered | Extra                 |
| ---- | ----------- | ------- | ---------- | ----- | -------------- | -------------- | ------- | ---- | ---- | -------- | --------------------- |
| 1    | SIMPLE      | tb_user | NULL       | range | idx_user_phone | idx_user_phone | 63      | NULL | 2    | 100.00   | Using index condition |



| id   | select_type | table   | partitions | type | possible_keys  | key  | key_len | ref  | rows | filtered | Extra       |
| ---- | ----------- | ------- | ---------- | ---- | -------------- | ---- | ------- | ---- | ---- | -------- | ----------- |
| 1    | SIMPLE      | tb_user | NULL       | ALL  | idx_user_phone | NULL | NULL    | NULL | 12   | 83.33    | Using where |

### 6、不遵循最左前缀原则，也会导致索引失效

如果索引关联了多列（联合索引），要遵守最左前缀法则，最左前缀法则指的是查询从索引的最左列开始，并且不跳过索引中的列。 如果跳跃某一列，索引将部分失效（后面的字段索引失效）。

```bash
# 给出一个数据表 tb_user
mysql> select * from tb_user;
 
12 rows in set (0.00 sec)

```

| id   | name       | email          | phone       | profession       | age  | gender | status | create_time         |
| ---- | ---------- | -------------- | ----------- | ---------------- | ---- | ------ | ------ | ------------------- |
| 1    | 孙悟空     | 1111@qq.com    | 11111111111 | 软件工程         | 500  | 1      | 1      | 2022-06-20 11:35:11 |
| 2    | 周瑜       | 1121@qq.com    | 11111111112 | 软件工程2        | 50   | 1      | 0      | 2022-06-20 11:35:11 |
| 3    | 孙尚香     | 1113@qq.com    | 11111111113 | 计算机科学与技术 | 30   | 2      | 2      | 2022-06-20 11:35:11 |
| 4    | 白龙马     | 1114@qq.com    | 11111111114 | 飞翔科学         | 300  | 1      | 0      | 2022-06-20 11:35:11 |
| 5    | 唐曾       | 1115@qq.com    | 11111111115 | 软件工程         | 50   | 1      | 5      | 2022-06-20 11:35:11 |
| 6    | 鲁智深     | 11751@qq.com   | 11111111116 | PS               | 22   | 1      | 4      | 2022-06-20 11:35:11 |
| 7    | 孙悟空     | 112011@3qq.com | 11111117111 | 物流管理         | 30   | 1      | 3      | 2022-06-20 11:35:11 |
| 8    | 白素贞     | 1144411@qq.com | 11111111811 | 航空技术         | 50   | 2      | 1      | 2022-06-20 11:35:11 |
| 9    | 小青       | 111155@qq.com  | 11111111911 | 火箭技术         | 16   | 2      | 2      | 2022-06-20 11:35:11 |
| 10   | 沙和尚     | 1151@qq.com    | 11111110111 | 游戏代练         | 20   | 1      | 2      | 2022-06-20 11:35:11 |
| 11   | 李世明     | 11661@qq.com   | 11111121111 | QQ飞车代练       | 22   | 1      | 6      | 2022-06-20 11:35:11 |
| 12   | 女儿国国王 | 1161@qq.com    | 11111116111 | 物联网技术       | 22   | 2      | 3      | 2022-06-20 11:35:11 |

```sql
# 为profession, age, status创建联合索引
create index idx_user_pro_age_stat on tb_user(profession, age, status);

#查看索引
SHOW INDEX FROM tb_user;

mysql> SHOW INDEX FROM tb_user;

6 rows in set (0.00 sec)

```

| Table   | Non_unique | Key_name              | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment | Visible |
| ------- | ---------- | --------------------- | ------------ | ----------- | --------- | ----------- | -------- | ------ | ---- | ---------- | ------- | ------------- | ------- |
| tb_user | 0          | PRIMARY               | 1            | id          | A         | 12          | NULL     | NULL   |      | BTREE      |         |               | YES     |
| tb_user | 0          | idx_user_phone        | 1            | phone       | A         | 12          | NULL     | NULL   | YES  | BTREE      |         |               | YES     |
| tb_user | 1          | idx_user_name         | 1            | name        | A         | 11          | NULL     | NULL   | YES  | BTREE      |         |               | YES     |
| tb_user | 1          | idx_user_pro_age_stat | 1            | profession  | A         | 11          | NULL     | NULL   | YES  | BTREE      |         |               | YES     |
| tb_user | 1          | idx_user_pro_age_stat | 2            | age         | A         | 12          | NULL     | NULL   | YES  | BTREE      |         |               | YES     |
| tb_user | 1          | idx_user_pro_age_stat | 3            | status      | A         | 12          | NULL     | NULL   | YES  | BTREE      |         |               | YES     |

> - 可以看出由 profession、age、和status创建的联合索引idx_user_pro_age_stat已经存在
>
> - 再此时若查找数据是，如果使用了profession、age、和status中的一个或者几个作为条件时，必须满足最左前缀才会触发索引，及 profession 必须存在的情况下才会触发索引
>
> 具体情况请往下看

```sql

# 情况1 索引的字段(profession, status, age)都使用了 这时 key_len = 93
mysql> explain select * from tb_user where profession = '航空技术' and status = 1 and age = 50;
 
1 row in set, 1 warning (0.00 sec)
```

| id   | select_type | table   | partitions | type | possible_keys         | key                   | key_len | ref               | rows | filtered | Extra |
| ---- | ----------- | ------- | ---------- | ---- | --------------------- | --------------------- | ------- | ----------------- | ---- | -------- | ----- |
| 1    | SIMPLE      | tb_user | NULL       | ref  | idx_user_pro_age_stat | idx_user_pro_age_stat | 93      | const,const,const | 1    | 100.00   | NULL  |



```sql
-- 情况2 条件字段使用了索引中的前两个(profession, age)这时，也使用了索引 key_len = 88，得出status的索引长度为 5
mysql> explain select * from tb_user where profession = '航空技术' and age = 50;

1 row in set, 1 warning (0.00 sec)
```

| id   | select_type | table   | partitions | type | possible_keys         | key                   | key_len | ref         | rows | filtered | Extra |
| ---- | ----------- | ------- | ---------- | ---- | --------------------- | --------------------- | ------- | ----------- | ---- | -------- | ----- |
| 1    | SIMPLE      | tb_user | NULL       | ref  | idx_user_pro_age_stat | idx_user_pro_age_stat | 88      | const,const | 1    | 100.00   | NULL  |



```sql
# 情况3 条件字段使用了索引中的第一个(profession)这时，也使用了索引 key_len = 83，得出profession的索引长度为83，age的索引长度为 5
mysql> explain select * from tb_user where profession = '航空技术';

1 row in set, 1 warning (0.00 sec)
```

| id   | select_type | table   | partitions | type | possible_keys         | key                   | key_len | ref   | rows | filtered | Extra |
| ---- | ----------- | ------- | ---------- | ---- | --------------------- | --------------------- | ------- | ----- | ---- | -------- | ----- |
| 1    | SIMPLE      | tb_user | NULL       | ref  | idx_user_pro_age_stat | idx_user_pro_age_stat | 83      | const | 1    | 100.00   | NULL  |

```sql
# 情况4 条件字段使用了索引中的第一个和第三个 这时，也使用了索引 key_len = 83，得出结论此时只是使用了profession索引字段，status索引字段没有使用了，因为age索引字段缺失时，age右边的索引字段会失效
mysql> explain select * from tb_user where profession = '航空技术' and status = 1;

1 row in set, 1 warning (0.00 sec)
```

| id   | select_type | table   | partitions | type | possible_keys         | key                   | key_len | ref   | rows | filtered | Extra                 |
| ---- | ----------- | ------- | ---------- | ---- | --------------------- | --------------------- | ------- | ----- | ---- | -------- | --------------------- |
| 1    | SIMPLE      | tb_user | NULL       | ref  | idx_user_pro_age_stat | idx_user_pro_age_stat | 83      | const | 1    | 10.00    | Using index condition |

```sql
# 情况5 当查询天剑汇总只有age和status时，key为null，此时没有使用索引，丢失了最左侧的索引就会出现索引失效。
mysql> explain select * from tb_user where age = 50 and status = 1;

1 row in set, 1 warning (0.00 sec)

# 特别说明，查询时，查询条件书写的顺序和索引的顺序不同，不会影响索引的使用情况。下面的两条SQL索引使用情况是相同的
explain select * from tb_user where profession = '航空技术' and status = 1 and age = 50;
explain select * from tb_user where status = 1 and age = 50 and profession = '航空技术';
```

| id   | select_type | table   | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
| ---- | ----------- | ------- | ---------- | ---- | ------------- | ---- | ------- | ---- | ---- | -------- | ----------- |
| 1    | SIMPLE      | tb_user | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 12   | 8.33     | Using where |

联合索引中，出现范围查询`（<, >）`，范围查询右侧的列索引失效。可以用`>=`或者`<=`来规避索引失效问题 **(满足业务需求的情况下)**。

```bash
# age > 20 此时key_len = 88 导致status的索引失效了
 mysql> explain select * from tb_user where profession = '航空技术'and  age > 20 and status = 1;

 1 row in set, 1 warning (0.00 sec)
 
 
 # age >= 20 此时key_len = 93 status的索引有效，所以在业务满足的情况下，尽量使用 >=,<=来代替 >,<
 mysql> explain select * from tb_user where profession = '航空技术'and  age >= 20 and status = 1;

 1 row in set, 1 warning (0.00 sec)
```

| id   | select_type | table   | partitions | type  | possible_keys         | key                   | key_len | ref  | rows | filtered | Extra                 |
| ---- | ----------- | ------- | ---------- | ----- | --------------------- | --------------------- | ------- | ---- | ---- | -------- | --------------------- |
| 1    | SIMPLE      | tb_user | NULL       | range | idx_user_pro_age_stat | idx_user_pro_age_stat | 88      | NULL | 1    | 10.00    | Using index condition |



| id   | select_type | table   | partitions | type  | possible_keys         | key                   | key_len | ref  | rows | filtered | Extra                 |
| ---- | ----------- | ------- | ---------- | ----- | --------------------- | --------------------- | ------- | ---- | ---- | -------- | --------------------- |
| 1    | SIMPLE      | tb_user | NULL       | range | idx_user_pro_age_stat | idx_user_pro_age_stat | 93      | NULL | 1    | 10.00    | Using index condition |