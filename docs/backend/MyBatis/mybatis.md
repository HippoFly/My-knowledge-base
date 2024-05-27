# MyBatis常见问题

## 查询

### MyBatis如何实现分页

1.SQL

2.RowBounds

3.Intercepter

4.PageHelper

> 详细请查看[MyBatis分页]([https://www.cnblogs.com/hippofly/p/18215079)

### 

###  **MyBatis 是如何将 sql 执行结果封装为目标对象并返回的？都有哪些映射形式？**

1. **基本类型映射**：将 SQL 查询结果的单个列直接映射到 Java 对象的基本数据类型或包装类中。例如，将数据库中的一个数字列映射到 Java 中的整数类型。
2. **复杂对象映射**：将 SQL 查询结果的多列映射到 Java 对象的复杂属性中。这可以通过在 `<resultMap>` 中使用 `<result>` 标签进行手动映射，或者通过 MyBatis 的自动映射机制进行自动映射。
3. **关联查询映射**：将 SQL 查询结果中的多个表的数据映射到 Java 对象的关联属性中。这可以通过在 `<resultMap>` 中使用 `<association>` 和 `<collection>` 标签指定关联映射规则来实现。
4. **嵌套查询映射**：在关联查询的基础上，进行更深层次的嵌套查询，将多层次的关联数据映射到 Java 对象的嵌套属性中。这通过在 `<resultMap>` 的 `<association>` 或 `<collection>` 中嵌套另一个 `<resultMap>` 实现。
5. **枚举类型映射**：将 SQL 查询结果中的枚举值映射到 Java 中的枚举类型。这需要在 `<resultMap>` 中使用 `<result>` 标签指定枚举属性的映射规则。
6. **自定义类型处理器映射**：对于一些特定类型，例如日期时间类型或者 JSON 字符串类型，可以通过自定义类型处理器来实现 SQL 结果与 Java 对象之间的映射。

### MyBatis 如何实现xml到mapper的对应

1.**命名空间和方法名对应**：

在 MyBatis 的 XML 文件中:命名空间（namespace）和id 

Mapper 接口中的包名: 包名+类名+方法名

![XML文件](https://img2.imgtp.com/2024/05/27/LiPnIR2c.png)

![Java文件](https://img2.imgtp.com/2024/05/27/gxGCLAba.png)



2.**参数和返回值类型对应**：Mapper 接口中的方法的参数类型和返回值类型需要与 XML 文件中定义的 SQL 语句的参数类型和返回值类型对应。

例如，如果在 XML 文件中定义了一个查询语句，并且需要传入一个用户 id 作为参数，并且返回一个 User 对象作为结果，那么对应的 Mapper 接口中的方法就应该接受一个 Long 类型的参数，并且返回一个 User 对象。



###  在 mapper 中如何传递多个参数？

![传多参数](https://img2.imgtp.com/2024/05/27/nuCqE3ke.png)

**方法 1：顺序传参法**

```java
public User selectUser(String name, int deptId);

<select id="selectUser" resultMap="UserResultMap">
    select * from user
    where user_name = #{0} and dept_id = #{1}
</select>
```

- `#{}`里面的数字代表传入参数的顺序。
- **这种方法不建议使用，sql 层表达不直观，且一旦顺序调整容易出错。**

**方法 2：@Param 注解传参法**

```java
public User selectUser(@Param("userName") String name, int @Param("deptId") deptId);

<select id="selectUser" resultMap="UserResultMap">
    select * from user
    where user_name = #{userName} and dept_id = #{deptId}
</select>
```

- `#{}`里面的名称对应的是注解@Param 括号里面修饰的名称。
- 这种方法在参数不多的情况还是比较直观的，（推荐使用）。

**方法 3：Map 传参法**

```java
public User selectUser(Map<String, Object> params);

<select id="selectUser" parameterType="java.util.Map" resultMap="UserResultMap">
    select * from user
    where user_name = #{userName} and dept_id = #{deptId}
</select>
```

- `#{}`里面的名称对应的是 Map 里面的 key 名称。
- 这种方法适合传递多个参数，且参数易变能灵活传递的情况。

**方法 4：Java Bean 传参法**

```java
public User selectUser(User user);

<select id="selectUser" parameterType="com.jourwon.pojo.User" resultMap="UserResultMap">
    select * from user
    where user_name = #{userName} and dept_id = #{deptId}
</select>
```

- `#{}`里面的名称对应的是 User 类里面的成员属性。
- 这种方法直观，需要建一个实体类，扩展不容易，需要加属性，但代码可读性强，业务逻辑处理方便，推荐使用。（推荐使用）。

### **实体类属性名和表中字段名不一样 ，怎么办?**

第 1 种： 通过在查询的 SQL 语句中定义字段名的别名，让字段名的别名和实体类的属性名一致

第 2 种： 通过 resultMap 中的`<result>`来映射字段名和实体类属性名的一一对应的关系。

### **Mybatis 是否可以映射 Enum 枚举类？**

- Mybatis 当然可以映射枚举类，不单可以映射枚举类，Mybatis 可以映射任何对象到表的一列上。映射方式为自定义一个 TypeHandler，实现 TypeHandler 的 setParameter()和 getResult()接口方法。
- TypeHandler 有两个作用，一是完成从 javaType 至 jdbcType 的转换，二是完成 jdbcType 至 javaType 的转换，体现为 setParameter()和 getResult()两个方法，分别代表设置 sql 问号占位符参数和获取列查询结果。

### **如何获取生成的主键?**

- `useGeneratedKeys="true"`即可

```java
<insert id="insert" useGeneratedKeys="true" keyProperty="userId" >
    insert into user(
    user_name, user_password, create_time)
    values(#{userName}, #{userPassword} , #{createTime, jdbcType= TIMESTAMP})
</insert>
```

- 这时候就可以完成回填主键

```java
mapper.insert(user);
user.getId;
```

### **#{}和${}的区别?**

在 MyBatis 中，`#{}` 和 `${}` 是两种不同的占位符，`#{}` 是预编译处理，`${}` 是字符串替换。

①、当使用 `#{}` 时，MyBatis 会在 SQL 执行之前，将占位符替换为问号 `?`，并使用参数值来替代这些问号。

由于 `#{}` 使用了预处理，它能有效防止 SQL 注入，可以确保参数值在到达数据库之前被正确地处理和转义。

```xml
<select id="selectUser" resultType="User">
  SELECT * FROM users WHERE id = #{id}
</select>
```

②、当使用 `${}` 时，参数的值会直接替换到 SQL 语句中去，而不会经过预处理。

`${}` 通常用于那些不能使用预处理的场合，比如说动态表名、列名、排序等，要提前对参数进行安全性校验。

### **模糊查询 like 语句该怎么写?**

 ![concat拼接like](https://img2.imgtp.com/2024/05/27/iLrYcJTy.png)



## 一级，二级缓存

MyBatis中的一级缓存和二级缓存都是用于提高数据访问性能的机制，但它们的作用范围和生命周期有所不同。

### **一级缓存**：

- **生命周期（失效）**：一级缓存的生命周期与SqlSession相同，在同一个 SqlSession 中执行的多个查询操作才能共享一级缓存，当**SqlSession关闭或提交时**，一级缓存也会失效。一级缓存的清理是自动的，当执行**增删改操作（insert、update、delete）**时，MyBatis 会自动清空当前 SqlSession 的一级缓存，防止数据不一致。

  一级缓存的生效需要满足以下条件：

  - 两次查询的 SQL 语句完全相同。
  - 两次查询的 SQL 参数也完全相同。
  - 两次查询在同一个 SqlSession 中执行。

  ```java
  SqlSession sqlSession = sqlSessionFactory.openSession();
  UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
  
  // 第一次查询，会向数据库发起查询请求，并将结果存入一级缓存
  User user1 = userMapper.selectUserById(1);
  
  // 第二次查询相同的数据，直接从一级缓存中获取结果，不再向数据库发起查询请求
  User user2 = userMapper.selectUserById(1);
  
  // 关闭 SqlSession，一级缓存也随之失效，缓存中的数据被清空
  sqlSession.close();
  ```

- **开启与关闭**：一级缓存是默认开启的，无需额外配置。

- **查询时机|作用范围**：当执行一个查询语句时，MyBatis 会首先检查当前 SqlSession 的一级缓存中是否存在对应的结果。如果存在，则直接返回缓存中的结果，不再向数据库发起查询请求，从而提高查询性能。

- **缓存结构**：一级缓存实际上是一个基于 HashMap 实现的缓存结构，它将查询语句的结果存储在内存中，以键值对的方式进行存储，其中键通常是 SQL 语句及其参数的组合，值则是查询结果。

### **二级缓存**：

- 作用范围： 即**多个SqlSession**共享同一个二级缓存，当有多个SqlSession对同一个Mapper进行操作时，可以共享缓存数据。
- **生命周期**：二级缓存的生命周期与整个**应用程序相同**，当应用程序关闭时，二级缓存才会失效。
- 开启与关闭：二级缓存需要手动配置开启，可以在Mapper XML文件中通过**`<cache>`**标签来配置。

下面是一个简单的二级缓存配置示例：

```xml
xmlCopy code
<!-- 在Mapper XML文件中配置二级缓存 -->
<cache eviction="LRU" flushInterval="60000" size="1000" readOnly="true"/>
```

在这个示例中，使用**`<cache>`**标签配置了二级缓存，并指定了缓存的清除策略为LRU（最近最少使用），刷新间隔为60秒，缓存容量为1000条，并且设为只读模式。

需要注意的是，二级缓存是可选的，开启二级缓存需要考虑到数据的一致性和并发访问的情况，因为二级缓存是全局共享的，对于频繁更新的数据可能会出现数据不一致的情况，需要开发者根据具体业务场景来决定是否使用二级缓存。

## 动态SQL

![](https://img2.imgtp.com/2024/05/27/O7XE5Z8m.png)

### **if**

1. 根据条件判断是否包含某一段SQL语句。

```xml
xmlCopy code
<select id="selectUsers" resultType="User">
    SELECT * FROM users
    <where>
        <if test="username != null">
            AND username = #{username}
        </if>
    </where>
</select>
```

### **choose、when、otherwise**

类似于Java中的switch语句，根据条件选择执行不同的SQL片段。

```xml
xmlCopy code
<select id="selectUsers" resultType="User">
    SELECT * FROM users
    <where>
        <choose>
            <when test="username != null">
                AND username = #{username}
            </when>
            <when test="email != null">
                AND email = #{email}
            </when>
            <otherwise>
                AND status = 'active'
            </otherwise>
        </choose>
    </where>
</select>
```

### **trim、where、set**

 用于处理SQL语句中的空格、逗号等，可以动态地添加或移除SQL片段。

```xml
xmlCopy code
<update id="updateUser" parameterType="User">
    UPDATE users
    <set>
        <if test="username != null">
            username = #{username},
        </if>
        <if test="password != null">
            password = #{password},
        </if>
    </set>
    WHERE id = #{id}
</update>
```

### **foreach**：

用于遍历集合，并在SQL中动态生成对应的SQL片段。

```xml
xmlCopy code
<select id="selectUsersByIdList" resultType="User">
    SELECT * FROM users
    WHERE id IN
    <foreach collection="idList" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

### **bind**：

用于将OGNL表达式的结果绑定到一个变量上，可以在后续的SQL语句中使用该变量。

```xml
xmlCopy code
<select id="selectUsers" resultType="User">
    <bind name="pattern" value="'%' + username + '%'"/>
    SELECT * FROM users
    WHERE username LIKE #{pattern}
</select>
```

## 一对一、一对多的关联查询

| 关系                       |                            关系                            | 实际 |
| :------------------------- | :--------------------------------------------------------: | ---- |
| **一对一（One-to-One）**   |                         订单和支付                         |      |
| **一对多（One-to-Many）**  |                   一个部门可以有多个员工                   |      |
| **多对一（Many-to-One)**   |                                                            |      |
| **多对多（Many-to-Many）** | 一个学生可以选择多门课程，而一门课程也可以被多个学生选择。 |      |

### 一对一

 **1.嵌套执行，特点是`ResultMap`套`resultMap`**

SQL执行2次

```xml
<select id="getUserWithAddress" resultMap="UserResultMap">
    SELECT u.*, a.*
    FROM user u
    LEFT JOIN address a ON u.address_id = a.id
    WHERE u.id = #{userId}
</select>

<resultMap id="UserResultMap" type="User">
    <id property="id" column="user_id" />
    <result property="name" column="user_name" />
    <!-- 嵌套查询，关联对象 Address -->
    <association property="address" javaType="Address" resultMap="AddressResultMap" />
</resultMap>

<resultMap id="AddressResultMap" type="Address">
    <id property="id" column="address_id" />
    <result property="city" column="city" />
    <result property="street" column="street" />
</resultMap>
```

**2.关联查询，ResultMap不再嵌套而是直接写出字段和表名对应**

SQL执行一次

```xml
<select id="getUserWithAddress" resultMap="UserResultMap">
    SELECT u.id AS user_id, u.name AS user_name,
           a.id AS address_id, a.city, a.street
    FROM user u
    LEFT JOIN address a ON u.address_id = a.id
    WHERE u.id = #{userId}
</select>

<resultMap id="UserResultMap" type="User">
    <id property="id" column="user_id" />
    <result property="name" column="user_name" />
    <!-- 直接将关联对象 Address 的字段映射到 User 对象中 -->
    <association property="address" javaType="Address">
        <id property="id" column="address_id" />
        <result property="city" column="city" />
        <result property="street" column="street" />
    </association>
</resultMap>
```



### **一对多**

比如部门和人员，是一对多的关系。

1. 嵌套查询，resultMap 里用**`<collection>`   写别名具体参数对应**
2. 增加子SQL标签

- 实体类

```java
@Data
public class DeptEntity {

    private Long id;

    private String name;

    private String code;

    private List<UserEntity> userList;

}
```

- 结果映射

```xml
    <resultMap id="DeptResultMap" type="com.example.mybatis.entity.DeptEntity">
        <id property="id" column="dept_pid" />
        <result property="name" column="dept_name"/>
        <result property="code" column="dept_code"/>
        <collection property="userList" ofType="com.example.mybatis.entity.UserEntity">
            <id column="user_id" property="id" jdbcType="BIGINT" />
            <result column="user_email" property="email" jdbcType="VARCHAR" />
            <result column="user_name" property="name" jdbcType="VARCHAR" />
            <result column="user_sex" property="sex" jdbcType="VARCHAR" />
            <result column="user_tel" property="tel" jdbcType="VARCHAR" />
            <result column="user_address" property="address" jdbcType="VARCHAR" />
        </collection>
    </resultMap>
```

- 查询

查询就是一个普通的关联查询

```xml
    <select id="getDept" resultMap="DeptResultMap" parameterType="java.lang.Long">
        select d.dept_id as dept_pid, d.name as dept_name, d.code as dept_code,
               u.id as user_id, u.email as user_email, u.name as user_name,
               u.sex as user_sex, u.tel as user_tel, u.address as user_address
        from dept d
                 left join user u on u.dept_id=d.dept_id
        where d.dept_id=#{id}
    </select>
```

### 多对一 

1. `<association ….. column="tid" select="getTeacher" />` 中`select="getTeacher"` 指定关联查询SQL语句
2. 直接SQL查完，通过`<resultMap>` +`<association>`  指定嵌套对象

实体类

```java
// Studend<M>
public class Student {
    private int id;
    private String name;
    private Teacher teacher;
}
// Teacher<S>
public class Teacher {
    private int id;
    private String name;
}
```

Mapper

```java
public interface StudentMapper {
    List<Student> getStudent(); 
}
```

XML

```xml
<select id="getStudent" resultMap="studentTeacher">        
select * from student    
</select>     

<resultMap id="studentTeacher" type="student">         
<id property="id" column="id" />         
<result property="name" column="name" />         
<!--复杂的属性需要单独处理，对象：association；集合：collection-->         
<!--association关联属性  property属性名 javaType属性类型 column在多的一方的表（即学生表）中的列名-->         
<association property="teacher" javaType="Teacher" column="tid" select="getTeacher" />     
</resultMap>    

<!--       这里传递过来的id，只有一个属性的时候，下面可以写任何值       association中column多参数配置：       column="{key=value,key=value}"       其实就是键值对的形式，key是传给下个sql的取值名称，value是片段一中sql查询的字段名。   -->     
<select id="getTeacher" resultType="teacher">         
select * from teacher where id = #{tid}     
</select>
================================================

  <select id="getStudent2" resultMap="studentMap">        
select s.id sid,s.name sname,t.id ttid,t.name tname from student s,teacher t where s.tid=t.id;    
</select>    

<resultMap id="studentMap" type="student">        
<id property="id" column="sid" />        
<result property="name" column="sname" />        
<!--关联对象property 关联对象在Student实体类中的属性-->        
<association property="teacher" javaType="Teacher" >            
	<id property="id" column="ttid" />            
	<result property="name" column="tname" />        
</association>    
</resultMap>


 
```

> 作者：hresh
> 链接：<https://juejin.cn/post/6844904110135705607>
> 来源：稀土掘金
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

## 原理

### **为什么 Mapper 接口不需要实现类？**

四个字回答：**动态代理**，我们来看一下获取 Mapper 的过程：

 ![](https://img2.imgtp.com/2024/05/27/iIQyHzs4.png)

### **`Mybatis` 是否支持延迟加载？原理？**

- `Mybatis` 支持 association 关联对象和 collection 关联集合对象的延迟加载，association 指的就是一对一，collection 指的就是一对多查询。在 `Mybatis` 配置文件中，可以配置是否启用延迟加载 `lazyLoadingEnabled=true|false`。
- 它的原理是，使用 CGLIB 创建目标对象的代理对象，当调用目标方法时，进入拦截器方法，比如调用 `a.getB().getName()`，拦截器 **`invoke()`**方法发现 `a.getB()`是 **null** 值，那么就会单独发送事先保存好的查询关联 B 对象的 **sql**，把 B 查询上来，然后调用 `a.setB(b)`，于是 a 的对象 b 属性就有值了，接着完成 `a.getB().getName()`方法的调用。这就是延迟加载的基本原理。
- 当然了，不光是 Mybatis，几乎所有的包括 Hibernate，支持延迟加载的原理都是一样的。