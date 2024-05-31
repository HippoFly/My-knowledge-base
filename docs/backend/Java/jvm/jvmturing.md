# JVM调优

### JVM调优常用命令和参数

常用命令：

1. jps：查看进程及其相关去信息

2. jmap：用来生成dump文件和查看堆相关的各类信息的命令。

3. jstat：查看jvm运行时的状态信息

4. jstack：查看jvm线程快照的命令

5. jinfo：查看jvm参数和动态修改部分jvm参数\

常用参数：

> -Xms：初始化堆大小
>
> -Xmx：最大堆大小
>
> -Xmn：新生代的内存空间大小
>
> -XX：SurvivorRatio	
>
> -Xss：每个线程的堆栈大小
>
> -XX：PermSize：设置永久代初始值
>
> XX：MaxPermSize：设置永久代最大值
>
> -XX:NewSize：新生代大小
>
> -XX:NewRatio 新生代和老生代占比
>
> -XX:SurvivorRatio：伊甸园空间和幸存者空间的占比
>
> 设定垃圾回收器 年轻代用 -XX:+UseParNewGC 年老代用-XX:+UseConcMarkSweepGC
>
> -Xms 设置初始堆的大小
>
> -Xmx 设置最大堆的大小
>
> -Xmn 设置年轻代大小，相当于同时配置-XX:NewSize和-XX:MaxNewSize为一样的值
>
> -Xss 每个线程的堆栈大小
>
> -XX:NewSize 设置年轻代大小(for 1.3/1.4)
>
> -XX:MaxNewSize 年轻代最大值(for 1.3/1.4)
>
> -XX:NewRatio 年轻代与年老代的比值(除去持久代)
>
> -XX:SurvivorRatio Eden区与Survivor区的的比值
>
> -XX:PretenureSizeThreshold 当创建的对象超过指定大小时，直接把对象分配在老年代。
>
> -XX:MaxTenuringThreshold设定对象在Survivor复制的最大年龄阈值，超过阈值转移到



 垃圾收集器

> -XX:+UseParallelGC：选择垃圾收集器为并行收集器。
>
> -XX:ParallelGCThreads=20：配置并行收集器的线程数
>
> -XX:+UseConcMarkSweepGC：设置年老代为并发收集。
>
> -XX:CMSFullGCsBeforeCompaction=5 由于并发收集器不对内存空间进行压缩、整理，
>
> 所以运行一段时间以后会产生“碎片”，使得运行效率降低。此值设置运行5次GC以后对内
>
> 存空间进行压缩、整理。
>
> -XX:+UseCMSCompactAtFullCollection：打开对年老代的压缩。可能会影响性能，但是
>
> 可以消除碎片

 辅助

> -XX:+PrintGCDetails 打印GC详细信息
>
> -XX:+HeapDumpOnOutOfMemoryError让JVM在发生内存溢出的时候自动生成内存快照,
>
> 排查问题用
>
> -XX:+DisableExplicitGC禁止系统System.gc()，防止手动误触发FGC造成问题.
>
> -XX:+PrintTLAB 查看TLAB空间的使用情况

### **常见调优工具有哪些**

常用调优工具分为两类,jdk自带监控工具：jconsole和jvisualvm，第三方有：MAT(Memory

Analyzer Tool)、GChisto。

jconsole，Java Monitoring and Management Console是从java5开始，在JDK中自带的java监

控和管理控制台，用于对JVM中内存，线程和类等的监控

jvisualvm，jdk自带全能工具，可以分析内存快照、线程快照；监控内存变化、GC变化等。

MAT，Memory Analyzer Tool，一个基于Eclipse的内存分析工具，是一个快速、功能丰富的

Java heap分析工具，它可以帮助我们查找内存泄漏和减少内存消耗

GChisto，一款专业分析gc日志的工具

### **如何选择垃圾收集器？**

\1. 如果你的堆大小不是很大（比如 100MB ），选择串行收集器一般是效率最高的。

参数： -XX:+UseSerialGC 。 

\2. 如果你的应用运行在单核的机器上，或者你的虚拟机核数只有单核，选择串行收集器依然是合

适的，这时候启用一些并行收集器没有任何收益。

参数： -XX:+UseSerialGC 。 

\3. 如果你的应用是“吞吐量”优先的，并且对较长时间的停顿没有什么特别的要求。选择并行收集

器是比较好的。

参数： -XX:+UseParallelGC 。4. 如果你的应用对响应时间要求较高，想要较少的停顿。甚至 1 秒的停顿都会引起大量的请求失

败，那么选择 G1 、 ZGC 、 CMS 都是合理的。虽然这些收集器的 GC 停顿通常都比较短，但它

需要一些额外的资源去处理这些工作，通常吞吐量会低一些。

参数：

-XX:+UseConcMarkSweepGC 、 

-XX:+UseG1GC 、 

-XX:+UseZGC 等。

从上面这些出发点来看，我们平常的 Web 服务器，都是对响应性要求非常高的。选择性其实就集

中在 CMS 、 G1 、 ZGC 上。而对于某些定时任务，使用并行收集器，是一个比较好的选择。