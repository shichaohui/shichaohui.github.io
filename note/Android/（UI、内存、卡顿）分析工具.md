## 内存分析工具

查找内存泄漏和占内存较多的对象。

* Android Studio — Memory Profiler

  分析内存占用、对象、引用等，导出 .hprof 文件。

* Android SDK Tools — hprof-conv

  转换 .hprof 文件为 MAT 可识别的格式。

  命令: `hprof-conv xxx.hprof newName.hprof`

* MAT

  分析 .hprof 文件。

## UI分析工具

分析 UI 层级、id、渲染情况

* HierarchyViewer（已废弃）

* Android Studio — Layout Inspector

  仅能查看 Debug 的 APP 的 View 树、id 等信息。

* Android SDK Tools — uiautomatorviewer

  可以查看 Release 的 APP 的 View 树、id 等信息。

* 开发者工具 — 调试 GPU 过度绘制

## 卡顿分析工具

分析函数执行时间等信息。

* TraceView（已废弃）

* Android Studio — CPU Profiler

* 代码生成 tracing 跟踪日志

  ```java
  Debug.startMethodTracing("fileName");
  Debug.stopMethodTracing();
  ```